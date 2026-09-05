import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * Live visual indicator for Firebase connection status per Section 2.3.
 */
export function FirebaseStatusChecker() {
  const [status, setStatus] = useState({
    initialized: false,
    authConnected: false,
    firestoreConnected: false,
    currentUser: null,
    error: null,
  });

  useEffect(() => {
    async function check() {
      try {
        // 1. Init
        const isInit = Boolean(auth.app && auth.app.options.projectId === "bait-guard-6f470");

        // 2. Auth
        onAuthStateChanged(auth, async (user) => {
          let firestoreOk = false;
          let errorMessage = null;

          try {
            const testDoc = await getDoc(doc(db, "_health_check", "ping"));
            firestoreOk = true;
          } catch (e) {
            // permission-denied proves server responded
            if (e.code === "permission-denied" || e.code === "not-found") {
              firestoreOk = true;
            } else {
              errorMessage = `${e.code}: ${e.message}`;
            }
          }

          setStatus({
            initialized: isInit,
            authConnected: true,
            firestoreConnected: firestoreOk,
            currentUser: user ? user.email : "Not signed in",
            error: errorMessage,
          });
        });
      } catch (err) {
        setStatus((prev) => ({ ...prev, error: err.message }));
      }
    }
    check();
  }, []);

  return (
    <div style={{ padding: 16, border: "1px solid #E2E8F0", borderRadius: 8, background: "#F8FAFC", maxWidth: 450, fontFamily: "sans-serif" }}>
      <h4 style={{ margin: "0 0 12px 0", color: "#0F172A" }}>🔥 Firebase Connection Status</h4>
      <div style={{ fontSize: 14, lineHeight: "24px" }}>
        <div>Project ID: <b>bait-guard-6f470</b></div>
        <div>Firebase App: {status.initialized ? "🟢 Initialized" : "🔴 Failed"}</div>
        <div>Auth Service: {status.authConnected ? "🟢 Connected" : "🟡 Checking..."}</div>
        <div>Firestore DB: {status.firestoreConnected ? "🟢 Connected" : "🟡 Checking..."}</div>
        <div>Auth State: <b>{status.currentUser || "Checking..."}</b></div>
      </div>
      {status.error && (
        <div style={{ marginTop: 8, color: "#EF4444", fontSize: 12 }}>
          ⚠️ Error: {status.error}
        </div>
      )}
    </div>
  );
}

export default FirebaseStatusChecker;
