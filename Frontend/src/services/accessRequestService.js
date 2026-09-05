import {
  collection,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  getDocs,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
} from 'firebase/firestore';
import { getApps, initializeApp as initApp } from 'firebase/app';
import { getAuth as getSecondaryAuth, createUserWithEmailAndPassword, signOut as secondarySignOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, firebaseConfig } from '../firebase/config';
import { apiClient } from '../api/client';
import { addNotification } from './notificationService';
import { normalizeEmail } from './authService';

const PENDING_STORAGE_KEY = 'baitguard_pending_access_requests';
const ALL_STORAGE_KEY = 'baitguard_access_requests';
const EVENT_NAME = 'baitguard_access_requests_changed';

function notifySubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

/**
 * Get pending access requests list from local store
 * @returns {Array<Object>}
 */
export function getPendingAccessRequests() {
  try {
    const stored = localStorage.getItem(PENDING_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Admin function: Query pending access requests ordered newest first.
 * Requires active Admin session per Section 4.2.
 */
export async function getPendingRequests() {
  if (!auth?.currentUser) {
    return getPendingAccessRequests();
  }

  try {
    const q = query(
      collection(db, 'accessRequests'),
      where('status', '==', 'pending'),
      orderBy('submittedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    if (err.code !== 'permission-denied') {
      console.warn('[getPendingRequests] Firestore notice:', err.message);
    }
    return getPendingAccessRequests();
  }
}

/**
 * Submit Contact Administrator message from Viewer
 */
export async function submitContactAdminMessage({ subject, message, facility, requestedRole, user }) {
  const senderName = user?.name || 'Viewer User';
  const senderEmail = user?.email || 'user@baitguard.com';
  const initials = senderName
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const facilityName = facility || user?.facility || 'Warehouse A';
  const roleName = requestedRole || 'Operator';

  const payload = {
    fullName: senderName,
    initials,
    email: senderEmail,
    normalizedEmail: senderEmail.trim().toLowerCase(),
    company: `${facilityName} · Requested Role: ${roleName}`,
    facility: facilityName,
    requestedRole: roleName,
    subject: subject.trim(),
    message: message.trim(),
    status: 'pending',
  };

  // 1. Write to Firestore accessRequests collection
  let docId = `req-${Date.now()}`;
  try {
    const docRef = await addDoc(collection(db, 'accessRequests'), {
      ...payload,
      submittedAt: serverTimestamp(),
    });
    docId = docRef.id;
  } catch (fsErr) {
    console.warn('[Firestore] submitContactAdminMessage notice:', fsErr.message);
  }

  // 2. Write to Backend REST endpoint
  apiClient.post('/access-requests', { ...payload, id: docId }).catch(() => {});

  const newRequest = {
    ...payload,
    id: docId,
    submittedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    bg: '#7c3aed',
  };

  try {
    const pendingList = getPendingAccessRequests();
    pendingList.unshift(newRequest);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pendingList));

    const storedAll = localStorage.getItem(ALL_STORAGE_KEY);
    const allList = storedAll ? JSON.parse(storedAll) : [];
    allList.unshift(newRequest);
    localStorage.setItem(ALL_STORAGE_KEY, JSON.stringify(allList));

    notifySubscribers();

    addNotification({
      type: 'request',
      title: 'New Contact Admin Message',
      message: `${senderName} (${roleName}): "${subject}"`,
      priority: 'high',
      requesterName: senderName,
      requesterEmail: senderEmail,
      facility: facilityName,
      requestedRole: roleName,
      requestId: newRequest.id,
      requestStatus: 'pending',
    });
  } catch {
    // Ignore storage errors
  }

  return { success: true, request: newRequest };
}

/**
 * Public function: Submit a new access request (Section 4.2).
 * Allowed by Firestore security rules for unauthenticated users.
 */
export async function submitAccessRequest({
  fullName = '',
  email = '',
  company = '',
  phone = '',
  department = '',
  message = '',
  ...rest
}) {
  const cleanEmail = normalizeEmail(email);
  if (!fullName || !cleanEmail || !company || !phone) {
    throw new Error('Full name, email, company, and phone are required.');
  }

  const payload = {
    fullName: fullName.trim(),
    email: email.trim(),
    normalizedEmail: cleanEmail,
    company: company.trim(),
    phone: phone.trim(),
    department: department ? department.trim() : '',
    message: message ? message.trim() : '',
    status: 'pending',
    submittedAt: serverTimestamp(),
    ...(rest.password ? { password: rest.password } : {}),
  };

  let docRef;
  try {
    docRef = await addDoc(collection(db, 'accessRequests'), payload);
  } catch (fsErr) {
    console.warn('[Firestore] submitAccessRequest notice:', fsErr.message);
  }

  const docId = docRef ? docRef.id : 'req-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);

  // 2. Submit to Backend REST API
  apiClient.post('/access-requests', { ...payload, id: docId }).catch(() => {});

  const newRequest = {
    ...payload,
    id: docId,
    submittedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    bg: '#2563eb',
  };

  try {
    const pendingList = getPendingAccessRequests();
    pendingList.unshift(newRequest);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pendingList));

    const storedAll = localStorage.getItem(ALL_STORAGE_KEY);
    const allList = storedAll ? JSON.parse(storedAll) : [];
    allList.unshift(newRequest);
    localStorage.setItem(ALL_STORAGE_KEY, JSON.stringify(allList));

    notifySubscribers();

    addNotification({
      type: 'request',
      title: 'New Access Request',
      message: `${newRequest.fullName} (${newRequest.company}) requested account access.`,
      priority: 'high',
      requesterName: newRequest.fullName,
      requesterEmail: newRequest.email,
      facility: rest.facility || rest.site || 'Warehouse A',
      requestedRole: newRequest.department || 'Access Request',
      requestId: newRequest.id,
      requestStatus: 'pending',
    });
  } catch {
    // Ignore storage write error
  }

  return docId;
}

/**
 * Helper to safely provision approved user into Firebase Auth + Firestore
 * without disturbing any active session on the primary auth instance.
 */
async function provisionFirebaseUser({ email, password, name, role = 'viewer', facilityIds = ['site_1'], company = '' }) {
  try {
    const existing = getApps().find((a) => a.name === 'adminUserProvisioner');
    const provApp = existing || initApp(firebaseConfig, 'adminUserProvisioner');
    const provAuth = getSecondaryAuth(provApp);
    const cred = await createUserWithEmailAndPassword(provAuth, email, password);
    const uid = cred.user.uid;

    await setDoc(doc(db, 'users', uid), {
      uid,
      displayName: name,
      firstName: name.split(' ')[0] || '',
      lastName: name.split(' ').slice(1).join(' ') || '',
      email: email.toLowerCase(),
      role: role.toLowerCase(),
      status: 'active',
      facilityIds: facilityIds || ['site_1'],
      company: company || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await secondarySignOut(provAuth);
  } catch (err) {
    console.info('[Firebase Provisioning] Notice:', err.message);
  }
}

/**
 * Submit Demo Request from Landing Page directly for Admin Approval
 */
export async function submitDemoRequest(formData) {
  const fullName = formData.fullName || 'Demo Request Visitor';
  const email = formData.workEmail || 'demo@company.com';
  const company = formData.companyName || 'Commercial Facility';
  const phone = formData.phone || '';
  const facilities = formData.facilitiesCount || '1-5 facilities';
  const prefDate = formData.preferredDate || 'Upcoming Date';
  const prefTime = formData.preferredTime || '10:00 AM EST';
  const notes = formData.notes || 'Requested live demo walkthrough slot.';

  const initials = fullName
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const requestData = {
    fullName,
    initials,
    email,
    normalizedEmail: email.trim().toLowerCase(),
    company: `${company} (${facilities})`,
    facility: company,
    requestedRole: 'Demo Access',
    phone,
    subject: `Live Demo Request: ${prefDate} at ${prefTime}`,
    message: `[Live Demo Slot] Date/Time: ${prefDate} @ ${prefTime}. Notes: ${notes}`,
    status: 'pending',
  };

  let docId = `req-demo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // 1. Submit to Firestore
  try {
    const docRef = await addDoc(collection(db, 'accessRequests'), {
      ...requestData,
      submittedAt: serverTimestamp(),
    });
    docId = docRef.id;
  } catch (fsErr) {
    console.warn('[Firestore] submitDemoRequest notice:', fsErr.message);
  }

  // 2. Submit to Backend
  apiClient.post('/access-requests', { ...requestData, id: docId }).catch(() => {});

  const newRequest = {
    ...requestData,
    id: docId,
    submittedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    bg: '#2563eb',
  };

  try {
    const pendingList = getPendingAccessRequests();
    pendingList.unshift(newRequest);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pendingList));

    const storedAll = localStorage.getItem(ALL_STORAGE_KEY);
    const allList = storedAll ? JSON.parse(storedAll) : [];
    allList.unshift(newRequest);
    localStorage.setItem(ALL_STORAGE_KEY, JSON.stringify(allList));

    notifySubscribers();

    addNotification({
      type: 'request',
      title: 'New Live Demo Request',
      message: `${fullName} (${company}) requested demo on ${prefDate} at ${prefTime}.`,
      priority: 'medium',
      requesterName: fullName,
      requesterEmail: email,
      facility: company,
      requestedRole: 'Live Demo',
      requestId: newRequest.id,
      requestStatus: 'pending',
    });
  } catch {
    // Ignore storage write error
  }

  return { success: true, request: newRequest };
}

/**
 * Admin function: Approve a pending request (Section 4.2).
 * Assigns role ('technician' | 'viewer') and facility IDs.
 */
export async function approveAccessRequest(reqOrId, options = {}) {
  const isObject = typeof reqOrId === 'object' && reqOrId !== null;
  const requestId = isObject ? reqOrId.id : reqOrId;
  const pendingList = getPendingAccessRequests();
  const matchedReq = isObject ? (pendingList.find((r) => r.id === reqOrId.id) || reqOrId) : (pendingList.find((r) => r.id === requestId) || {});
  const userPassword = matchedReq.password || (isObject && reqOrId.password) || 'password123';

  // Normalize role
  const rawRole = (options.role || matchedReq.requestedRole || (isObject && reqOrId.requestedRole) || 'viewer').toLowerCase();
  const roleLower = rawRole.includes('tech') ? 'technician' : rawRole.includes('admin') ? 'admin' : 'viewer';
  const roleCapitalized = roleLower === 'admin' ? 'Admin' : roleLower === 'technician' ? 'Technician' : 'Viewer';

  const facilityMap = {
    'Warehouse A': 'site_1',
    'Warehouse B': 'site_2',
    'Distribution Center': 'site_3',
    'Cold Storage': 'site_4',
    'Manufacturing Plant': 'site_5',
    'Admin Wing': 'site_1',
  };
  const targetSiteId = facilityMap[matchedReq.facility || matchedReq.company] || 'site_1';
  const assignedFacilityIds = options.facilityIds || (
    roleLower === 'admin'
      ? ['site_1', 'site_2', 'site_3', 'site_4', 'site_5']
      : roleLower === 'technician'
      ? Array.from(new Set(['site_1', targetSiteId]))
      : [targetSiteId]
  );

  const reviewerUid = options.reviewerUid || 'admin';

  // 1. Run Firestore transaction per Section 4.2
  try {
    if (requestId && !requestId.startsWith('req-local-')) {
      const reqRef = doc(db, 'accessRequests', requestId);
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(reqRef);
        if (!snap.exists()) return;
        if (snap.data().status !== 'pending') {
          throw new Error('This request has already been reviewed.');
        }

        transaction.update(reqRef, {
          status: 'approved',
          assignedRole: roleLower === 'admin' ? 'technician' : roleLower,
          assignedFacilityIds,
          reviewedBy: reviewerUid,
          reviewedAt: serverTimestamp(),
          approvalSource: 'request',
        });
      });
    }
  } catch (fsErr) {
    console.warn('[Firestore] approveAccessRequest notice:', fsErr.message);
  }

  // 2. Update on Backend REST API
  apiClient.put(`/access-requests/${req.id}/approve`).catch(() => {});

  try {
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(updatedPending));

    // Update ALL_STORAGE_KEY if present
    const storedAll = localStorage.getItem(ALL_STORAGE_KEY);
    if (storedAll) {
      try {
        const allList = JSON.parse(storedAll);
        const updatedAll = allList.map((r) => (r.id === req.id ? { ...r, status: 'approved', requestedRole: roleCapitalized } : r));
        localStorage.setItem(ALL_STORAGE_KEY, JSON.stringify(updatedAll));
      } catch {
        // ignore
      }
    }

    const PROTECTED_TEST_EMAILS = [
      'admin@baitguard.com',
      'technician@baitguard.com',
      'user@baitguard.com',
    ];
    const isProtected = PROTECTED_TEST_EMAILS.includes(email);

    // 3. Register or update user in Admin System Users list (for AdminSystemPage display)
    const storedUsers = localStorage.getItem('baitguard_system_users');
    const systemUsers = storedUsers ? JSON.parse(storedUsers) : [];

    const initials = matchedReq.initials || fullName.trim().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    const existingSysIdx = systemUsers.findIndex((u) => u.email.toLowerCase() === email);

    if (existingSysIdx >= 0) {
      if (!isProtected) {
        systemUsers[existingSysIdx] = {
          ...systemUsers[existingSysIdx],
          role: roleCapitalized,
          sites: [facility],
          status: 'Active',
        };
      }
    } else if (!isProtected) {
      const newSystemUser = {
        id: `u-${Date.now()}`,
        initials,
        name: fullName,
        email,
        role: roleCapitalized,
        sites: [facility],
        status: 'Active',
      };
      systemUsers.unshift(newSystemUser);
    }
    localStorage.setItem('baitguard_system_users', JSON.stringify(systemUsers));

    // 4. Register or update credentials in baitguard_users_db (for authService.login())
    const storedAuthUsers = localStorage.getItem('baitguard_users_db');
    let authUsers = [];
    if (storedAuthUsers) {
      try {
        authUsers = JSON.parse(storedAuthUsers);
      } catch {
        authUsers = [];
      }
    }
    if (!authUsers || authUsers.length === 0) {
      authUsers = [
        { id: 'usr-admin-001', name: 'Admin User', initials: 'AU', email: 'admin@baitguard.com', password: 'admin123', role: 'admin', facilityIds: ['site_1', 'site_2', 'site_3', 'site_4', 'site_5'] },
        { id: 'usr-tech-001', name: 'Tech User', initials: 'TU', email: 'technician@baitguard.com', password: 'tech123', role: 'technician', facilityIds: ['site_1', 'site_2'] },
        { id: 'usr-viewer-001', name: 'Viewer User', initials: 'VU', email: 'user@baitguard.com', password: 'user123', role: 'viewer', facilityIds: ['site_1'] },
      ];
    }

    if (!isProtected) {
      const existingAuthUserIdx = authUsers.findIndex((u) => u.email.toLowerCase() === email);
      if (existingAuthUserIdx >= 0) {
        authUsers[existingAuthUserIdx] = {
          ...authUsers[existingAuthUserIdx],
          role: roleLower,
          facilityIds: assignedFacilityIds,
          ...(matchedReq.password ? { password: matchedReq.password } : {}),
        };
      } else {
        const newAuthUser = {
          id: `usr-${Date.now()}`,
          name: fullName,
          initials,
          email,
          password: userPassword,
          role: roleLower,
          facilityIds: assignedFacilityIds,
        };
        authUsers.push(newAuthUser);
      }
      localStorage.setItem('baitguard_users_db', JSON.stringify(authUsers));
    }

    // 5. If a custom user is currently logged in, update their active session immediately!
    if (!isProtected) {
      const storedActiveUser = localStorage.getItem('baitguard_user');
      if (storedActiveUser) {
        try {
          const activeUserObj = JSON.parse(storedActiveUser);
          if (activeUserObj.email && activeUserObj.email.toLowerCase() === email) {
            activeUserObj.role = roleLower;
            activeUserObj.facilityIds = assignedFacilityIds;
            activeUserObj.company = matchedReq.company || activeUserObj.company;
            localStorage.setItem('baitguard_user', JSON.stringify(activeUserObj));
            window.dispatchEvent(new Event('baitguard_user_changed'));
          }
        } catch {
          // ignore
        }
      }
    }

    notifySubscribers();
  } catch (err) {
    console.warn('[approveAccessRequest] storage update notice:', err.message);
  }

  // 6. Update Firestore user document if already registered (only non-test accounts)
  if (!isProtected) {
    try {
      const qUser = query(collection(db, 'users'), where('email', '==', email));
      getDocs(qUser).then((snap) => {
        snap.forEach((d) => {
          updateDoc(doc(db, 'users', d.id), {
            role: roleLower,
            facilityIds: assignedFacilityIds,
            updatedAt: serverTimestamp(),
          }).catch(() => {});
        });
      }).catch(() => {});
    } catch {
      // ignore offline
    }

    // 7. Safely provision into Firebase Auth and Firestore if brand new user
    provisionFirebaseUser({
      email,
      password: userPassword,
      name: fullName,
      role: roleLower,
      facilityIds: assignedFacilityIds,
      company: matchedReq.company || '',
    }).catch(() => {});
  }

  return updatedPending;
}

/**
 * Admin function: Reject a pending request (Section 4.2).
 */
export async function rejectAccessRequest(reqOrId, options = {}) {
  const isObject = typeof reqOrId === 'object' && reqOrId !== null;
  const requestId = isObject ? reqOrId.id : reqOrId;
  const reason = options.reason || '';
  const reviewerUid = options.reviewerUid || 'admin';

  // 1. Run Firestore transaction per Section 4.2
  try {
    if (requestId && !requestId.startsWith('req-local-')) {
      const reqRef = doc(db, 'accessRequests', requestId);
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(reqRef);
        if (!snap.exists()) return;
        if (snap.data().status !== 'pending') {
          throw new Error('This request has already been reviewed.');
        }

        transaction.update(reqRef, {
          status: 'rejected',
          rejectionReason: reason ? reason.trim() : null,
          reviewedBy: reviewerUid,
          reviewedAt: serverTimestamp(),
        });
      });
    }
  } catch (fsErr) {
    console.warn('[Firestore] rejectAccessRequest notice:', fsErr.message);
  }

  // 2. Update on Backend REST API
  apiClient.put(`/access-requests/${requestId}/reject`).catch(() => {});

  const pendingList = getPendingAccessRequests();
  const updatedPending = pendingList.filter((r) => r.id !== requestId);

  try {
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(updatedPending));
    notifySubscribers();
  } catch {
    // Ignore error
  }

  return updatedPending;
}

/**
 * Subscribe to pending access request store changes
 * (Uses Firestore onSnapshot when available, plus local event fallback)
 */
export function subscribeAccessRequests(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    callback(getPendingAccessRequests());
  };

  window.addEventListener(EVENT_NAME, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  // Real-time listener on Firestore accessRequests collection
  // Only attach when authenticated as per firestore.rules
  let fsUnsub = () => {};

  const attachListener = () => {
    fsUnsub();
    fsUnsub = () => {};

    if (!auth?.currentUser) {
      return;
    }

    try {
      const q = query(collection(db, 'accessRequests'), orderBy('submittedAt', 'desc'));
      fsUnsub = onSnapshot(
        q,
        (snapshot) => {
          const firestoreList = [];
          snapshot.forEach((d) => {
            const data = d.data();
            if (data.status === 'pending') {
              firestoreList.push({ id: d.id, ...data });
            }
          });
          if (firestoreList.length > 0) {
            callback(firestoreList);
          }
        },
        (err) => {
          // Gracefully suppress permission-denied errors when session is not an active admin doc in rules
          if (err.code === 'permission-denied') {
            return;
          }
          console.warn('[Firestore] accessRequests listener:', err.message);
        }
      );
    } catch {
      // Firestore listener unavailable offline
    }
  };

  attachListener();

  let authUnsub = () => {};
  try {
    authUnsub = onAuthStateChanged(auth, () => {
      attachListener();
    });
  } catch {
    // ignore
  }

  return () => {
    window.removeEventListener(EVENT_NAME, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
    authUnsub();
    fsUnsub();
  };
}
