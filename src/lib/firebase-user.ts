import { User } from "firebase/auth";
import { ref, get, set, update } from "firebase/database";
import { db } from "./firebase";
import { useUserStore } from "@/store/useUserStore";

export type UserRole = "admin" | "manager";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}

/**
 * Initialize user profile in Firebase on first sign-in
 * If user doesn't exist, create as "admin"
 * If user exists, load their profile
 */
export async function initializeUserProfile(firebaseUser: User) {
  const userRef = ref(db, `users/${firebaseUser.uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    // User exists, load profile
    const profile = snapshot.val() as UserProfile;
    useUserStore.setState({
      currentUser: firebaseUser,
      userProfile: profile,
    });
    return profile;
  } else {
    // New user, create as admin
    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName,
      role: "admin",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(userRef, newProfile);
    useUserStore.setState({
      currentUser: firebaseUser,
      userProfile: newProfile,
    });
    return newProfile;
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(uid: string, role: UserRole) {
  const userRef = ref(db, `users/${uid}`);
  await update(userRef, { role, updatedAt: Date.now() });
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);
  return snapshot.exists() ? (snapshot.val() as UserProfile) : null;
}

/**
 * Check if user is admin
 */
export function isAdmin(role: UserRole | null): boolean {
  return role === "admin";
}

/**
 * Check if user is manager
 */
export function isManager(role: UserRole | null): boolean {
  return role === "manager";
}
