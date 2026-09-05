import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * Step-by-step Firebase connection test script per Section 2.2.
 */
export async function testFirebaseConnection() {
  console.log("🔍 Testing Firebase Connection...");

  // 1. Check App Config
  if (!auth.app) {
    console.error("❌ Firebase App is NOT initialized.");
    return { success: false, step: "init", error: "Firebase App not initialized" };
  }
  console.log("✅ Firebase App Initialized:", auth.app.name);
  console.log("   Project ID:", auth.app.options.projectId);

  // 2. Check Auth Service
  try {
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("✅ Firebase Auth Connected. Current user:", user ? user.email : "No user signed in (Guest)");
        unsubscribe();
        resolve(user);
      });
    });
  } catch (err) {
    console.error("❌ Firebase Auth connection failed:", err.message);
    return { success: false, step: "auth", error: err.message };
  }

  // 3. Check Firestore Network Connection
  try {
    // Attempt to read a non-existent test document to verify Firestore network handshake
    const testRef = doc(db, "_health_check", "ping");
    await getDoc(testRef);
    console.log("✅ Cloud Firestore Connected successfully.");
  } catch (err) {
    // permission-denied is actually PROOF of connection! (Security rules responded)
    if (err.code === "permission-denied") {
      console.log("✅ Cloud Firestore Connected (Security Rules actively protecting database).");
    } else {
      console.error("❌ Firestore connection failed:", err.code, err.message);
      return { success: false, step: "firestore", error: err.message };
    }
  }

  console.log("🎉 All Firebase services are LIVE and connected!");
  return { success: true };
}

export default testFirebaseConnection;
