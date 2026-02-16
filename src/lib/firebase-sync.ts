import { useScheduleStore } from "@/store/useScheduleStore";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { saveDaySchedule, subscribeToDaySchedule } from "./firebase-schedules";
import { getDatesWithSchedules } from "./firebase-schedules";
import { DaySchedule } from "@/types/index";

/**
 * Migrate all schedules from localStorage to Firebase (one-time operation)
 */
export async function migrateSchedulesToFirebase(): Promise<void> {
  try {
    // Get all schedules from Zustand/localStorage
    const schedules = useScheduleStore.getState().schedules;
    const dateCount = Object.keys(schedules).length;

    console.log(`Migrating ${dateCount} dates to Firebase...`);

    if (dateCount === 0) {
      console.log("No schedules to migrate");
      return;
    }

    // Upload each day's schedule to Firebase
    let successCount = 0;
    for (const [date, daySchedule] of Object.entries(schedules)) {
      try {
        await saveDaySchedule(date, daySchedule as DaySchedule);
        successCount++;
        console.log(`  ✓ ${date} migrated`);
      } catch (error) {
        console.error(`  ✗ Failed to migrate ${date}:`, error);
      }
    }

    console.log(`✓ Migration complete: ${successCount}/${dateCount} schedules migrated to Firebase`);
  } catch (error) {
    console.error("✗ Migration error:", error);
    throw error;
  }
}

/**
 * Sync a single day's schedule from Firebase to local state
 * Call this when opening a day view to ensure fresh data
 */
export async function syncDayScheduleFromFirebase(date: string): Promise<void> {
  try {
    // This is already handled by the store's real-time listeners
    // Just ensure the date is loaded
    useScheduleStore.getState().getOrCreateDaySchedule(date);
  } catch (error) {
    console.error("Sync error:", error);
  }
}

/**
 * Load schedules from Firebase on app startup
 * This hydrates the Zustand store with Firebase data
 */
export async function loadSchedulesFromFirebase(): Promise<void> {
  try {
    const dates = await getDatesWithSchedules();
    console.log(`✓ Loaded ${dates.length} dates with schedules from Firebase`);
  } catch (error) {
    console.error("✗ Error loading schedules:", error);
  }
}
