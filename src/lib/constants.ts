import { Venue, Role } from "@/types";

export const VENUES: Venue[] = [
  { id: "studios", name: "Studios", color: "#3B82F6" },
  { id: "too-late", name: "Too Late", color: "#EF4444" },
  { id: "la-casa-dei-gelsi", name: "La Casa dei Gelsi", color: "#10B981" },
  { id: "tenuta-villa-peggys", name: "Tenuta Villa Peggy's", color: "#F59E0B" },
  { id: "villa-peggys", name: "Villa Peggy's", color: "#8B5CF6" },
];

export const ROLES: Role[] = [
  { id: "sala", name: "Sala" },
  { id: "bar", name: "Bar" },
  { id: "cassa", name: "Cassa" },
  { id: "pass", name: "Pass" },
  { id: "guardaroba", name: "Guardaroba" },
];

function generateTimeOptions(): string[] {
  const times: string[] = [];
  // 18:00 - 23:45
  for (let h = 18; h <= 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  // 00:00 - 06:00
  for (let h = 0; h <= 6; h++) {
    for (let m = 0; m < 60; m += 15) {
      times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      if (h === 6 && m === 0) break;
    }
  }
  return times;
}

export const TIME_OPTIONS = generateTimeOptions();

/** Special value for "until closing time" */
export const CHIUSURA = "Chiusura";

/** End time options include "Chiusura" as first option */
export const END_TIME_OPTIONS = [CHIUSURA, ...generateTimeOptions()];

export const DEFAULT_START_TIME = "21:00";
export const DEFAULT_END_TIME = "03:00";
