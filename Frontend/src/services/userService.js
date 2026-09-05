import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Fetches user profile by UID.
 */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Self-service: User updates their own personal profile fields.
 * Security rules only permit personal fields; role/status/facilities cannot be changed here.
 */
export async function updateSelfProfile(uid, { firstName = "", lastName = "", jobTitle = "", department = "", phone = "", bio = "" }) {
  const userRef = doc(db, "users", uid);
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

  await updateDoc(userRef, {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    displayName: fullName || "User",
    jobTitle: jobTitle.trim(),
    department: department.trim(),
    phone: phone.trim(),
    bio: bio.trim(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Admin function: Get all users in the system.
 */
export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

/**
 * Admin function: Update non-admin user role, application status, or facility IDs.
 * Strictly enforced: Cannot modify other admins or self.
 */
export async function adminManageUser(targetUid, { role, status, facilityIds }) {
  if (!["technician", "viewer"].includes(role)) {
    throw new Error("Role must be 'technician' or 'viewer'. Admins cannot be assigned via client.");
  }
  if (!["active", "disabled"].includes(status)) {
    throw new Error("Status must be 'active' or 'disabled'.");
  }
  if (!facilityIds || facilityIds.length === 0) {
    throw new Error("User must have at least one facility assigned.");
  }

  const targetRef = doc(db, "users", targetUid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(targetRef);
    if (!snap.exists()) throw new Error("Target user profile does not exist.");
    if (snap.data().role === "admin") {
      throw new Error("Admin profiles cannot be modified from the client.");
    }

    transaction.update(targetRef, {
      role,
      status,
      facilityIds,
      updatedAt: serverTimestamp(),
    });
  });
}
