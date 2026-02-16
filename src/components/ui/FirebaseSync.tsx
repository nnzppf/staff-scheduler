"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useScheduleStore } from "@/store/useScheduleStore";
import { migrateSchedulesToFirebase, loadSchedulesFromFirebase } from "@/lib/firebase-sync";

/**
 * Component that handles Firebase sync on app startup
 * - Migrates localStorage data to Firebase (one-time)
 * - Loads schedules from Firebase
 */
export default function FirebaseSync() {
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const syncData = async () => {
      // Wait for both stores to be hydrated from localStorage
      const userHydrated = useUserStore.getState()._hasHydrated;
      const scheduleHydrated = useScheduleStore.getState()._hasHydrated;

      if (!userHydrated || !scheduleHydrated) {
        console.log("Waiting for stores to hydrate...", { userHydrated, scheduleHydrated });
        // Try again in 300ms
        setTimeout(syncData, 300);
        return;
      }

      // Additional delay to ensure localStorage data is fully loaded into store
      await new Promise((resolve) => setTimeout(resolve, 300));

      const userProfile = useUserStore.getState().userProfile;

      // Only sync if user is logged in
      if (!userProfile) {
        console.log("User not logged in, skipping sync");
        setHasChecked(true);
        return;
      }

      try {
        console.log("Starting Firebase sync...");

        // Load schedules from Firebase
        await loadSchedulesFromFirebase();

        // Migration: move data from localStorage to Firebase (one-time)
        // This only happens if there's data in localStorage
        const localSchedules = localStorage.getItem("staff-scheduler-schedules");
        if (localSchedules) {
          try {
            console.log("Found local schedules, migrating to Firebase...");
            await migrateSchedulesToFirebase();
            console.log("✓ Migration complete");
            // Optional: clear localStorage after successful migration
            // localStorage.removeItem("staff-scheduler-schedules");
          } catch (error) {
            console.warn("Migration skipped or failed", error);
          }
        } else {
          console.log("No local schedules to migrate");
        }

        setHasChecked(true);
      } catch (error) {
        console.error("Firebase sync error:", error);
        setHasChecked(true);
      }
    };

    if (!hasChecked) {
      syncData();
    }
  }, [hasChecked]);

  return null; // This component doesn't render anything
}
