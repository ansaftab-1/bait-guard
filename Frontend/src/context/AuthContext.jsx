import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount & listen to Firebase Auth
  useEffect(() => {
    const persisted = authService.getCurrentUser();
    if (persisted) {
      setUser(persisted);
    }
    setLoading(false);

    // Step 3.2: Firebase Auth observer for automatic session restoration
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (profileSnap.exists()) {
              const profile = profileSnap.data();
              if (profile.status && profile.status !== 'active') {
                await authService.logout();
                setUser(null);
                return;
              }
              let assignedRole = profile.role || authService.ROLES.VIEWER;
              const em = (firebaseUser.email || '').toLowerCase();
              if (em === 'admin@baitguard.com') assignedRole = authService.ROLES.ADMIN;
              else if (em === 'technician@baitguard.com') assignedRole = authService.ROLES.TECHNICIAN;
              else if (em === 'user@baitguard.com') assignedRole = authService.ROLES.VIEWER;

              const restoredUser = {
                id: firebaseUser.uid,
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: profile.displayName || firebaseUser.displayName || firebaseUser.email.split('@')[0],
                initials: (profile.displayName || firebaseUser.email)
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2),
                role: assignedRole,
                facilityIds: profile.facilityIds || ['site_1'],
                company: profile.company || '',
                department: profile.department || '',
                phone: profile.phone || '',
                jobTitle: profile.jobTitle || '',
              };
              setUser(restoredUser);
              localStorage.setItem('baitguard_user', JSON.stringify(restoredUser));
            }
          } catch (profileErr) {
            console.warn('[AuthContext] Profile load notice:', profileErr.message);
          }
        }
      });
    } catch {
      // Firebase auth listener unavailable offline
    }

    const syncUser = () => {
      const persisted = authService.getCurrentUser();
      if (persisted) {
        setUser((prev) => {
          if (!prev) return persisted;
          if (
            prev.role !== persisted.role ||
            JSON.stringify(prev.facilityIds) !== JSON.stringify(persisted.facilityIds) ||
            prev.name !== persisted.name
          ) {
            return persisted;
          }
          return prev;
        });
      }
    };

    window.addEventListener('baitguard_user_changed', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('baitguard_user_changed', syncUser);
      window.removeEventListener('storage', syncUser);
      unsubscribe();
    };
  }, []);

  const isAuthenticated = Boolean(user);

  /**
   * Log in with email + password.
   * @throws {Error} on invalid credentials
   */
  const login = useCallback(async (email, password) => {
    const { user: loggedIn } = await authService.login(email, password);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  /**
   * Register a new account.
   * @throws {Error} if email already exists
   */
  const signup = useCallback(async (email, password, role, name) => {
    const { user: created } = await authService.signup(email, password, role, name);
    setUser(created);
    return created;
  }, []);

  /**
   * Sign out.
   */
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  /**
   * Check if the current user has a specific permission.
   * @param {string} action — permission key (e.g. 'edit', 'create', 'delete')
   * @returns {boolean}
   */
  const hasPermission = useCallback(
    (action) => {
      if (!user) return false;
      return authService.hasPermission(user.role, action);
    },
    [user]
  );

  /**
   * Get the dashboard redirect path for the current user's role.
   * @returns {string}
   */
  const getDashboardPath = useCallback(() => {
    if (!user) return '/login';
    return authService.getDashboardForRole(user.role);
  }, [user]);

  /**
   * Force refresh user data from backend database & storage
   */
  const refreshUser = useCallback(async () => {
    try {
      const latest = await authService.fetchCurrentUserProfile();
      if (latest) setUser(latest);
      return latest;
    } catch {
      const persisted = authService.getCurrentUser();
      if (persisted) setUser(persisted);
      return persisted;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      signup,
      logout,
      hasPermission,
      getDashboardPath,
      refreshUser,
    }),
    [user, loading, isAuthenticated, login, signup, logout, hasPermission, getDashboardPath, refreshUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
