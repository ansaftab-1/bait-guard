import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { apiClient } from '../api/client';

/**
 * Normalizes email: trim whitespace and convert to lowercase.
 */
export function normalizeEmail(email) {
  return email ? email.trim().toLowerCase() : '';
}

/**
 * Signs in a user and validates their Firestore application profile.
 * Rejects disabled users or accounts without a Firestore profile.
 */
export async function loginUser(email, password) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !password) {
    throw new Error('Please provide both email and password.');
  }

  // 1. Firebase Auth Sign-in
  const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
  const firebaseUser = userCredential.user;

  // 2. Fetch User Profile from Firestore
  const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  if (!profileDoc.exists()) {
    await signOut(auth);
    throw new Error('Your user profile does not exist. Please contact an administrator.');
  }

  const profile = profileDoc.data();

  // 3. Verify Account Status
  if (profile.status !== 'active') {
    await signOut(auth);
    throw new Error('Your account has been disabled. Please contact your facility administrator.');
  }

  // 4. Return user and profile containing role ('admin' | 'technician' | 'viewer') and facilityIds
  return {
    uid: firebaseUser.uid,
    email: cleanEmail,
    displayName: profile.displayName || cleanEmail,
    role: profile.role,
    status: profile.status,
    facilityIds: profile.facilityIds || [],
    company: profile.company || '',
  };
}

/**
 * Signs out the currently authenticated user.
 */
export async function logoutUser() {
  await signOut(auth);
  localStorage.removeItem('baitguard_user');
}

/**
 * Sends a password reset email using Firebase's default flow.
 */
export async function sendPasswordReset(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) throw new Error('Please enter your email address.');
  await sendPasswordResetEmail(auth, cleanEmail);
}

/**
 * Subscribes to authentication state changes and loads profile.
 * Use this in your App/Router layout.
 */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({ user: null, profile: null, loading: false });
      return;
    }

    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists() && snap.data().status === 'active') {
        callback({ user, profile: snap.data(), loading: false });
      } else {
        await signOut(auth);
        callback({ user: null, profile: null, loading: false });
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      callback({ user: null, profile: null, loading: false, error: err.message });
    }
  });
}

/**
 * authService.js — BaitGuard Authentication Service
 *
 * Fully integrated with Firebase Authentication, Firestore (users/{uid}),
 * and centralized Backend REST API with offline/fallback resilience.
 */

// ─── Role keys (used throughout the app) ────────────────────────────────────
export const ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
  TECHNICIAN: 'technician',
};

// ─── Human-readable labels ──────────────────────────────────────────────────
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'System Administrator',
  [ROLES.VIEWER]: 'Read-Only Viewer',
  [ROLES.TECHNICIAN]: 'Field Technician',
};

// ─── Role → default dashboard path ─────────────────────────────────────────
export const ROLE_DASHBOARD_MAP = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.TECHNICIAN]: '/dashboard/technician',
  [ROLES.VIEWER]: '/dashboard/viewer',
};

// ─── Permission matrix ─────────────────────────────────────────────────────
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    manageUsers: true,
    editEvents: true,
    exportReports: true,
    manageStations: true,
  },
  [ROLES.TECHNICIAN]: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    manageUsers: true,
    editEvents: true,
    exportReports: true,
    manageStations: true,
  },
  [ROLES.VIEWER]: {
    view: true,
    create: false,
    edit: false,
    delete: false,
    manageUsers: false,
    editEvents: false,
    exportReports: false,
    manageStations: false,
  },
};

// ─── Mock test accounts for offline/demo fallback ───────────────────────────
export const PROTECTED_TEST_EMAILS = [
  'admin@baitguard.com',
  'technician@baitguard.com',
  'user@baitguard.com',
];

export const SEED_USERS = [
  {
    id: 'usr-admin-001',
    name: 'Admin User',
    initials: 'AU',
    email: 'admin@baitguard.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    facilityIds: ['site_1', 'site_2', 'site_3', 'site_4', 'site_5'],
  },
  {
    id: 'usr-tech-001',
    name: 'Tech User',
    initials: 'TU',
    email: 'technician@baitguard.com',
    password: 'tech123',
    role: ROLES.TECHNICIAN,
    facilityIds: ['site_1', 'site_2'],
  },
  {
    id: 'usr-viewer-001',
    name: 'Viewer User',
    initials: 'VU',
    email: 'user@baitguard.com',
    password: 'user123',
    role: ROLES.VIEWER,
    facilityIds: ['site_1'],
  },
];

const STORAGE_KEYS = {
  USER: 'baitguard_user',
  USERS_DB: 'baitguard_users_db',
};

function getAllUsers() {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  let customUsers = [];
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        customUsers = parsed.filter(
          (u) => !PROTECTED_TEST_EMAILS.includes((u.email || '').toLowerCase())
        );
      }
    } catch {
      // ignore
    }
  }
  // SEED_USERS test accounts always remain fixed with their designated testing roles
  const merged = [...SEED_USERS, ...customUsers];
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(merged));
  return merged;
}

function saveAllUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
}

function sanitizeUser(user) {
  if (!user) return null;
  const safe = { ...user };
  delete safe.password;
  return safe;
}

/**
 * Authenticate user via Firebase Auth + Firestore profile,
 * falling back to backend server / local credentials.
 */
export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  // Test accounts quick fill protection — test accounts always log into their canonical role
  const protectedTestAccount = SEED_USERS.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (protectedTestAccount) {
    if (protectedTestAccount.password !== password) {
      throw new Error('Invalid email or password. Please try again.');
    }
    const safeTestUser = sanitizeUser(protectedTestAccount);
    try {
      const serverRes = await apiClient.post('/auth/login', { email: normalizedEmail, password });
      if (serverRes && serverRes.token) {
        safeTestUser.token = serverRes.token;
      }
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeTestUser));
    return { user: safeTestUser };
  }

  // 1. Try Firebase Authentication directly (Agent.MD Step 3)
  try {
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const firebaseUser = userCredential.user;

    // Load User Profile from Firestore users/{uid}
    let profile = null;
    try {
      const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (profileDoc.exists()) {
        profile = profileDoc.data();
        if (profile.status && profile.status !== 'active') {
          await signOut(auth);
          throw new Error('Your account has been disabled. Please contact an administrator.');
        }
      }
    } catch (fsErr) {
      console.warn('[Firestore] Profile lookup:', fsErr.message);
    }

    const appUser = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: profile?.displayName || firebaseUser.displayName || normalizedEmail.split('@')[0],
      initials: (profile?.displayName || normalizedEmail)
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      role: profile?.role || ROLES.VIEWER,
      facilityIds: profile?.facilityIds || ['site_1'],
      company: profile?.company || '',
      department: profile?.department || '',
      phone: profile?.phone || '',
      jobTitle: profile?.jobTitle || '',
    };

    // Obtain signed backend JWT token for API authorization
    try {
      const serverRes = await apiClient.post('/auth/login', { email: normalizedEmail, password });
      if (serverRes && serverRes.token) {
        appUser.token = serverRes.token;
        if (serverRes.user?.role) {
          appUser.role = serverRes.user.role;
        }
      }
    } catch {
      // offline fallback
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(appUser));
    return { user: appUser };
  } catch (firebaseErr) {
    console.info('[Firebase Auth] Not matched or offline:', firebaseErr.message);

    // If account was explicitly disabled, do not fall back
    if (firebaseErr.message.includes('disabled')) {
      throw firebaseErr;
    }
  }

  // 2. Try real Backend REST login endpoint
  const serverRes = await apiClient.post('/auth/login', { email: normalizedEmail, password });
  if (serverRes && serverRes.user) {
    const userWithToken = {
      ...serverRes.user,
      token: serverRes.token,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithToken));
    return { user: userWithToken };
  }

  // 3. Fallback local mock authentication
  await new Promise((r) => setTimeout(r, 250));

  const users = getAllUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!match) {
    throw new Error('Invalid email or password. Please try again.');
  }

  const safe = sanitizeUser(match);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safe));
  return { user: safe };
}

/** Register new user with server or fallback */
export async function signup(email, password, role, name) {
  const normalizedEmail = email.trim().toLowerCase();

  // Try real backend REST signup endpoint
  const serverRes = await apiClient.post('/auth/signup', { email: normalizedEmail, password, role, name });
  if (serverRes && serverRes.user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(serverRes.user));
    return serverRes;
  }

  // Fallback local mock signup
  await new Promise((r) => setTimeout(r, 300));

  const users = getAllUsers();
  const exists = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (exists) {
    throw new Error('An account with this email already exists.');
  }

  const displayName = name || email.split('@')[0];
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const newUser = {
    id: 'usr-' + Date.now(),
    name: displayName,
    initials,
    email: normalizedEmail,
    password,
    role: role || ROLES.VIEWER,
    facilityIds: ['site_1'],
  };

  users.push(newUser);
  saveAllUsers(users);

  const safe = sanitizeUser(newUser);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safe));
  return { user: safe };
}

export async function logout() {
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
  await apiClient.post('/auth/logout').catch(() => {});
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getCurrentUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.email) {
        const lowerEmail = parsed.email.toLowerCase();
        if (lowerEmail === 'admin@baitguard.com') {
          parsed.role = ROLES.ADMIN;
          parsed.facilityIds = ['site_1', 'site_2', 'site_3', 'site_4', 'site_5'];
        } else if (lowerEmail === 'technician@baitguard.com') {
          parsed.role = ROLES.TECHNICIAN;
          parsed.facilityIds = ['site_1', 'site_2'];
        } else if (lowerEmail === 'user@baitguard.com') {
          parsed.role = ROLES.VIEWER;
          parsed.facilityIds = ['site_1'];
        }
      }
      return parsed;
    }
    const defaultUser = {
      id: 'usr-admin-001',
      name: 'Admin User',
      initials: 'AU',
      email: 'admin@baitguard.com',
      role: ROLES.ADMIN,
      facilityIds: ['site_1', 'site_2', 'site_3', 'site_4', 'site_5'],
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
    return defaultUser;
  } catch {
    return null;
  }
}

export function hasPermission(role, action) {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return Boolean(perms[action]);
}

export function getDashboardForRole(role) {
  return ROLE_DASHBOARD_MAP[role] || '/overview';
}

/**
 * Re-fetch the authenticated user's profile directly from the backend database.
 * Updates local cache and notifies all listeners if role/facilities changed.
 */
export async function fetchCurrentUserProfile() {
  try {
    const res = await apiClient.get('/auth/me');
    if (res && res.user) {
      const stored = getCurrentUser() || {};
      const updated = {
        ...stored,
        ...res.user,
        role: res.user.role,
        roleLabel: res.user.roleLabel,
        facilityIds: res.user.facilityIds,
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      window.dispatchEvent(new Event('baitguard_user_changed'));
      return updated;
    }
  } catch (err) {
    console.warn('[fetchCurrentUserProfile] notice:', err.message);
  }
  return getCurrentUser();
}

