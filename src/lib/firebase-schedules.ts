import { ref, get, set, update, remove, onValue, Unsubscribe } from "firebase/database";
import { db } from "./firebase";
import { DaySchedule, Assignment, VenueSchedule } from "@/types/index";

/**
 * Get all schedules from Firebase
 */
export async function getAllSchedules(): Promise<Record<string, DaySchedule>> {
  const schedulesRef = ref(db, "schedules");
  const snapshot = await get(schedulesRef);
  return snapshot.exists() ? (snapshot.val() as Record<string, DaySchedule>) : {};
}

/**
 * Get a single day schedule
 */
export async function getDaySchedule(date: string): Promise<DaySchedule | null> {
  const dateRef = ref(db, `schedules/${date}`);
  const snapshot = await get(dateRef);
  return snapshot.exists() ? (snapshot.val() as DaySchedule) : null;
}

/**
 * Create or update a day schedule
 */
export async function saveDaySchedule(date: string, schedule: DaySchedule): Promise<void> {
  const dateRef = ref(db, `schedules/${date}`);
  await set(dateRef, schedule);
}

/**
 * Add assignment to a venue on a specific date
 */
export async function addAssignment(
  date: string,
  venueId: string,
  assignment: Assignment
): Promise<void> {
  const assignmentRef = ref(db, `schedules/${date}/venues/${venueId}/assignments/${assignment.id}`);
  await set(assignmentRef, assignment);
}

/**
 * Update assignment
 */
export async function updateAssignment(
  date: string,
  venueId: string,
  assignmentId: string,
  updates: Partial<Assignment>
): Promise<void> {
  const assignmentRef = ref(db, `schedules/${date}/venues/${venueId}/assignments/${assignmentId}`);
  await update(assignmentRef, updates);
}

/**
 * Remove assignment
 */
export async function removeAssignment(
  date: string,
  venueId: string,
  assignmentId: string
): Promise<void> {
  const assignmentRef = ref(db, `schedules/${date}/venues/${venueId}/assignments/${assignmentId}`);
  await remove(assignmentRef);
}

/**
 * Subscribe to real-time updates for a day schedule
 */
export function subscribeToDaySchedule(
  date: string,
  callback: (schedule: DaySchedule | null) => void
): Unsubscribe {
  const dateRef = ref(db, `schedules/${date}`);
  return onValue(dateRef, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.val() as DaySchedule) : null);
  });
}

/**
 * Subscribe to real-time updates for all schedules
 */
export function subscribeToAllSchedules(
  callback: (schedules: Record<string, DaySchedule>) => void
): Unsubscribe {
  const schedulesRef = ref(db, "schedules");
  return onValue(schedulesRef, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.val() as Record<string, DaySchedule>) : {});
  });
}

/**
 * Get list of dates with schedules
 */
export async function getDatesWithSchedules(): Promise<string[]> {
  const schedulesRef = ref(db, "schedules");
  const snapshot = await get(schedulesRef);

  if (!snapshot.exists()) return [];

  const schedules = snapshot.val() as Record<string, DaySchedule>;
  return Object.keys(schedules).filter((date) => {
    const schedule = schedules[date];
    return schedule.venues && schedule.venues.length > 0;
  });
}

/**
 * Get all assignments across all dates for a specific employee
 */
export async function getEmployeeAssignments(employeeId: string): Promise<Array<Assignment & { date: string; venueId: string }>> {
  const schedulesRef = ref(db, "schedules");
  const snapshot = await get(schedulesRef);

  if (!snapshot.exists()) return [];

  const schedules = snapshot.val() as Record<string, DaySchedule>;
  const assignments: Array<Assignment & { date: string; venueId: string }> = [];

  Object.entries(schedules).forEach(([date, daySchedule]) => {
    daySchedule.venues.forEach((venueSchedule) => {
      venueSchedule.assignments.forEach((assignment) => {
        if (assignment.employeeId === employeeId) {
          assignments.push({
            ...assignment,
            date,
            venueId: venueSchedule.venueId,
          });
        }
      });
    });
  });

  return assignments;
}
