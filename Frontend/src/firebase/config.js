import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configured credentials for Bait Guard Web App (loaded securely from environment)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bait-guard-6f470.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://bait-guard-6f470-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bait-guard-6f470",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bait-guard-6f470.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "609454017958",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:609454017958:web:7e2c5b584bd0878ec8d367",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5BRL68FG0Y"
};

// Initialize Firebase (prevents duplicate app initialization in frameworks like Next.js)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let analyticsInstance = null;
if (typeof window !== "undefined") {
  try {
    analyticsInstance = getAnalytics(app);
  } catch {
    // Analytics is disabled or unavailable in this environment
  }
}
export const analytics = analyticsInstance;

/** Facility ID to friendly label mapping per Agent.MD Step 7 */
export const SEEDED_FACILITY_MAP = {
  site_1: 'Warehouse A',
  site_2: 'Warehouse B',
  site_3: 'Distribution Center',
  site_4: 'Cold Storage',
  site_5: 'Manufacturing Plant',
};

export function getFacilityName(facilityId) {
  return SEEDED_FACILITY_MAP[facilityId] || facilityId || 'Warehouse A';
}
