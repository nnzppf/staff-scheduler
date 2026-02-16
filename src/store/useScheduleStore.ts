import { create } from "zustand";
import {
  DaySchedule,
  Assignment,
  VenueId,
  RoleId,
  TimeSlot,
  VenueSchedule,
} from "@/types";
import { VENUES, DEFAULT_START_TIME, DEFAULT_END_TIME } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";
import { ref, set, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase";

interface ScheduleState {
  schedules: Record<string, DaySchedule>;
  _isListening: boolean;

  // Firebase real-time listener
  startListening: () => void;
  stopListening: () => void;

  // Actions (write to Firebase, store updates via listener)
  getOrCreateDaySchedule: (date: string) => DaySchedule;
  addAssignment: (date: string, venueId: VenueId, roleId: RoleId) => string;
  updateAssignmentEmployee: (
    date: string,
    venueId: VenueId,
    assignmentId: string,
    employeeId: string
  ) => void;
  updateAssignmentTime: (
    date: string,
    venueId: VenueId,
    assignmentId: string,
    timeSlot: TimeSlot
  ) => void;
  removeAssignment: (
    date: string,
    venueId: VenueId,
    assignmentId: string
  ) => void;
  getAllAssignmentsForDay: (date: string) => Assignment[];
  getDatesWithSchedules: () => string[];
}

function createEmptyVenueSchedule(venueId: VenueId): VenueSchedule {
  return {
    venueId,
    assignments: [],
  };
}

function createEmptyDaySchedule(date: string): DaySchedule {
  return {
    date,
    venues: VENUES.map((v) => createEmptyVenueSchedule(v.id)),
  };
}

/**
 * Helper: save a full day schedule to Firebase
 */
function saveDayToFirebase(date: string, schedule: DaySchedule) {
  const dateRef = ref(db, `schedules/${date}`);
  set(dateRef, schedule).catch((err) =>
    console.error(`Firebase write error for ${date}:`, err)
  );
}

/**
 * Helper: normalize Firebase data (arrays may come back as objects with numeric keys)
 */
function normalizeSchedules(
  data: Record<string, unknown>
): Record<string, DaySchedule> {
  const result: Record<string, DaySchedule> = {};

  for (const [date, raw] of Object.entries(data)) {
    const dayData = raw as Record<string, unknown>;
    if (!dayData || !dayData.venues) continue;

    // Firebase may store arrays as objects with numeric keys
    const rawVenues = dayData.venues as Record<string, unknown> | unknown[];
    const venuesArray = Array.isArray(rawVenues)
      ? rawVenues
      : Object.values(rawVenues);

    const venues: VenueSchedule[] = venuesArray.map(
      (v: unknown) => {
        const venue = v as Record<string, unknown>;
        const rawAssignments =
          (venue.assignments as Record<string, unknown> | unknown[]) || [];
        const assignments = Array.isArray(rawAssignments)
          ? rawAssignments
          : Object.values(rawAssignments);

        return {
          venueId: venue.venueId as VenueId,
          assignments: assignments.filter(Boolean) as Assignment[],
        };
      }
    );

    result[date] = {
      date: (dayData.date as string) || date,
      venues,
    };
  }

  return result;
}

export const useScheduleStore = create<ScheduleState>()((set, get) => ({
  schedules: {},
  _isListening: false,

  startListening: () => {
    if (get()._isListening) return;

    const schedulesRef = ref(db, "schedules");
    onValue(schedulesRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val() as Record<string, unknown>;
        const normalized = normalizeSchedules(raw);
        set({ schedules: normalized });
      } else {
        set({ schedules: {} });
      }
    });

    set({ _isListening: true });
    console.log("✓ Firebase real-time listener active");
  },

  stopListening: () => {
    const schedulesRef = ref(db, "schedules");
    off(schedulesRef);
    set({ _isListening: false });
  },

  getOrCreateDaySchedule: (date: string) => {
    const existing = get().schedules[date];
    if (existing) return existing;

    const newSchedule = createEmptyDaySchedule(date);
    // Save to Firebase → listener will update local state
    saveDayToFirebase(date, newSchedule);
    // Also set locally immediately for responsiveness
    set((state) => ({
      schedules: { ...state.schedules, [date]: newSchedule },
    }));
    return newSchedule;
  },

  addAssignment: (date, venueId, roleId) => {
    const assignmentId = uuidv4();
    const schedule =
      get().schedules[date] || createEmptyDaySchedule(date);

    const updatedVenues = schedule.venues.map((vs) => {
      if (vs.venueId !== venueId) return vs;
      return {
        ...vs,
        assignments: [
          ...vs.assignments,
          {
            id: assignmentId,
            employeeId: "",
            venueId,
            roleId,
            timeSlot: {
              start: DEFAULT_START_TIME,
              end: DEFAULT_END_TIME,
            },
          },
        ],
      };
    });

    const updatedSchedule = { ...schedule, venues: updatedVenues };

    // Update local immediately for responsiveness
    set((state) => ({
      schedules: { ...state.schedules, [date]: updatedSchedule },
    }));

    // Save to Firebase
    saveDayToFirebase(date, updatedSchedule);

    return assignmentId;
  },

  updateAssignmentEmployee: (date, venueId, assignmentId, employeeId) => {
    const schedule = get().schedules[date];
    if (!schedule) return;

    const updatedVenues = schedule.venues.map((vs) => {
      if (vs.venueId !== venueId) return vs;
      return {
        ...vs,
        assignments: vs.assignments.map((a) =>
          a.id === assignmentId ? { ...a, employeeId } : a
        ),
      };
    });

    const updatedSchedule = { ...schedule, venues: updatedVenues };
    set((state) => ({
      schedules: { ...state.schedules, [date]: updatedSchedule },
    }));
    saveDayToFirebase(date, updatedSchedule);
  },

  updateAssignmentTime: (date, venueId, assignmentId, timeSlot) => {
    const schedule = get().schedules[date];
    if (!schedule) return;

    const updatedVenues = schedule.venues.map((vs) => {
      if (vs.venueId !== venueId) return vs;
      return {
        ...vs,
        assignments: vs.assignments.map((a) =>
          a.id === assignmentId ? { ...a, timeSlot } : a
        ),
      };
    });

    const updatedSchedule = { ...schedule, venues: updatedVenues };
    set((state) => ({
      schedules: { ...state.schedules, [date]: updatedSchedule },
    }));
    saveDayToFirebase(date, updatedSchedule);
  },

  removeAssignment: (date, venueId, assignmentId) => {
    const schedule = get().schedules[date];
    if (!schedule) return;

    const updatedVenues = schedule.venues.map((vs) => {
      if (vs.venueId !== venueId) return vs;
      return {
        ...vs,
        assignments: vs.assignments.filter((a) => a.id !== assignmentId),
      };
    });

    const updatedSchedule = { ...schedule, venues: updatedVenues };
    set((state) => ({
      schedules: { ...state.schedules, [date]: updatedSchedule },
    }));
    saveDayToFirebase(date, updatedSchedule);
  },

  getAllAssignmentsForDay: (date: string) => {
    const schedule = get().schedules[date];
    if (!schedule) return [];
    return schedule.venues.flatMap((vs) => vs.assignments);
  },

  getDatesWithSchedules: () => {
    const schedules = get().schedules;
    return Object.keys(schedules).filter((date) => {
      const schedule = schedules[date];
      return schedule.venues.some((vs) => vs.assignments.length > 0);
    });
  },
}));
