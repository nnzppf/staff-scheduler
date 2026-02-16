import { TimeSlot, Assignment } from "@/types";
import { CHIUSURA } from "./constants";

/** Max end time in normalized minutes (06:00 next day) */
const MAX_END_MINUTES = (6 + 24) * 60 - 18 * 60; // 720

/**
 * Converts "HH:MM" or "Chiusura" to minutes on a normalized timeline starting at 18:00.
 * Times 00:00-17:59 are treated as next day (+ 24h).
 * "Chiusura" is treated as the latest possible time (06:00).
 */
function timeToMinutes(time: string): number {
  if (time === CHIUSURA) return MAX_END_MINUTES;
  const [hours, minutes] = time.split(":").map(Number);
  let total = hours * 60 + minutes;
  if (hours < 18) {
    total += 24 * 60;
  }
  return total - 18 * 60;
}

export function doTimeSlotsOverlap(a: TimeSlot, b: TimeSlot): boolean {
  const aStart = timeToMinutes(a.start);
  const aEnd = timeToMinutes(a.end);
  const bStart = timeToMinutes(b.start);
  const bEnd = timeToMinutes(b.end);
  return aStart < bEnd && bStart < aEnd;
}

export function findConflict(
  employeeId: string,
  candidateTimeSlot: TimeSlot,
  allDayAssignments: Assignment[],
  excludeAssignmentId?: string
): Assignment | null {
  for (const assignment of allDayAssignments) {
    if (assignment.id === excludeAssignmentId) continue;
    if (assignment.employeeId !== employeeId) continue;
    if (!assignment.employeeId) continue;
    if (doTimeSlotsOverlap(candidateTimeSlot, assignment.timeSlot)) {
      return assignment;
    }
  }
  return null;
}

export function getAvailableEmployees(
  employeeIds: string[],
  candidateTimeSlot: TimeSlot,
  allDayAssignments: Assignment[],
  currentAssignmentId?: string
): {
  available: string[];
  conflicting: { employeeId: string; conflictWith: Assignment }[];
} {
  const available: string[] = [];
  const conflicting: { employeeId: string; conflictWith: Assignment }[] = [];

  for (const employeeId of employeeIds) {
    const conflict = findConflict(
      employeeId,
      candidateTimeSlot,
      allDayAssignments,
      currentAssignmentId
    );
    if (conflict) {
      conflicting.push({ employeeId, conflictWith: conflict });
    } else {
      available.push(employeeId);
    }
  }

  return { available, conflicting };
}
