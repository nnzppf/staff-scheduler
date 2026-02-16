"use client";

import { useEffect } from "react";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { auth } from "@/lib/firebase";

/**
 * Component that activates Firebase real-time listeners when user is logged in.
 * - Starts schedule & employee listeners on login
 * - Stops listeners on logout
 * - Initializes employees (seeds) on first run
 */
export default function FirebaseSync() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User logged in → start real-time listeners
        useScheduleStore.getState().startListening();
        useEmployeeStore.getState().startListening();

        // Initialize employees if not yet done (first-time seed)
        try {
          await useEmployeeStore.getState().initializeEmployees();
        } catch (err) {
          console.error("Employee initialization error:", err);
        }

        console.log("✓ Firebase sync active for", user.email);
      } else {
        // User logged out → stop listeners
        useScheduleStore.getState().stopListening();
        useEmployeeStore.getState().stopListening();
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
