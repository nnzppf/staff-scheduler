export type VenueId =
  | "studios"
  | "too-late"
  | "la-casa-dei-gelsi"
  | "tenuta-villa-peggys"
  | "villa-peggys";

export type RoleId = "sala" | "bar" | "cassa" | "pass" | "guardaroba";

export interface Venue {
  id: VenueId;
  name: string;
  color: string;
}

export interface Role {
  id: RoleId;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  roles: RoleId[]; // Multiple roles supported
  active: boolean;
}

export interface TimeSlot {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

export interface Assignment {
  id: string;
  employeeId: string;
  venueId: VenueId;
  roleId: RoleId;
  timeSlot: TimeSlot;
}

export interface VenueSchedule {
  venueId: VenueId;
  assignments: Assignment[];
}

export interface DaySchedule {
  date: string; // "YYYY-MM-DD"
  venues: VenueSchedule[];
}
