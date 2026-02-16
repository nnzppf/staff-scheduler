import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

interface ScheduleState {
  schedules: Record<string, DaySchedule>;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  getOrCreateDaySchedule: (date: string) => DaySchedule;
  addAssignment: (
    date: string,
    venueId: VenueId,
    roleId: RoleId
  ) => string;
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

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      schedules: {},
      _hasHydrated: false,
      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),

      getOrCreateDaySchedule: (date: string) => {
        const existing = get().schedules[date];
        if (existing) return existing;
        const newSchedule = createEmptyDaySchedule(date);
        set((state) => ({
          schedules: { ...state.schedules, [date]: newSchedule },
        }));
        return newSchedule;
      },

      addAssignment: (date, venueId, roleId) => {
        const assignmentId = uuidv4();
        set((state) => {
          const schedule =
            state.schedules[date] || createEmptyDaySchedule(date);
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
          return {
            schedules: {
              ...state.schedules,
              [date]: { ...schedule, venues: updatedVenues },
            },
          };
        });
        return assignmentId;
      },

      updateAssignmentEmployee: (date, venueId, assignmentId, employeeId) => {
        set((state) => {
          const schedule = state.schedules[date];
          if (!schedule) return state;
          const updatedVenues = schedule.venues.map((vs) => {
            if (vs.venueId !== venueId) return vs;
            return {
              ...vs,
              assignments: vs.assignments.map((a) =>
                a.id === assignmentId ? { ...a, employeeId } : a
              ),
            };
          });
          return {
            schedules: {
              ...state.schedules,
              [date]: { ...schedule, venues: updatedVenues },
            },
          };
        });
      },

      updateAssignmentTime: (date, venueId, assignmentId, timeSlot) => {
        set((state) => {
          const schedule = state.schedules[date];
          if (!schedule) return state;
          const updatedVenues = schedule.venues.map((vs) => {
            if (vs.venueId !== venueId) return vs;
            return {
              ...vs,
              assignments: vs.assignments.map((a) =>
                a.id === assignmentId ? { ...a, timeSlot } : a
              ),
            };
          });
          return {
            schedules: {
              ...state.schedules,
              [date]: { ...schedule, venues: updatedVenues },
            },
          };
        });
      },

      removeAssignment: (date, venueId, assignmentId) => {
        set((state) => {
          const schedule = state.schedules[date];
          if (!schedule) return state;
          const updatedVenues = schedule.venues.map((vs) => {
            if (vs.venueId !== venueId) return vs;
            return {
              ...vs,
              assignments: vs.assignments.filter((a) => a.id !== assignmentId),
            };
          });
          return {
            schedules: {
              ...state.schedules,
              [date]: { ...schedule, venues: updatedVenues },
            },
          };
        });
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
    }),
    {
      name: "staff-scheduler-schedules",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
