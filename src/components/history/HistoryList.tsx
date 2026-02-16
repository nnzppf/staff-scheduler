"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { VENUES, ROLES } from "@/lib/constants";

export default function HistoryList() {
  const schedules = useScheduleStore((s) => s.schedules);
  const getEmployeeById = useEmployeeStore((s) => s.getEmployeeById);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterVenue, setFilterVenue] = useState<string>("all");

  const allAssignments = useMemo(() => {
    const assignments: Array<{
      date: string;
      employeeName: string;
      venue: string;
      role: string;
      start: string;
      end: string;
    }> = [];

    Object.entries(schedules).forEach(([date, schedule]) => {
      schedule.venues.forEach((venueSchedule) => {
        venueSchedule.assignments.forEach((assignment) => {
          if (assignment.employeeId) {
            const employee = getEmployeeById(assignment.employeeId);
            const venue = VENUES.find((v) => v.id === venueSchedule.venueId);
            const role = ROLES.find((r) => r.id === assignment.roleId);

            if (employee && venue && role) {
              assignments.push({
                date,
                employeeName: employee.name,
                venue: venue.name,
                role: role.name,
                start: assignment.timeSlot.start,
                end: assignment.timeSlot.end,
              });
            }
          }
        });
      });
    });

    return assignments.sort((a, b) => b.date.localeCompare(a.date));
  }, [schedules, getEmployeeById]);

  const filtered = useMemo(() => {
    return allAssignments.filter((a) => {
      if (filterRole !== "all" && a.role !== filterRole) return false;
      if (filterVenue !== "all" && a.venue !== filterVenue) return false;
      return true;
    });
  }, [allAssignments, filterRole, filterVenue]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filtri */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Ruolo
          </label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tutti i ruoli</option>
            {ROLES.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Locale
          </label>
          <select
            value={filterVenue}
            onChange={(e) => setFilterVenue(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tutti i locali</option>
            {VENUES.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista turni */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Nessun turno trovato
          </div>
        ) : (
          filtered.map((assignment, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {assignment.employeeName}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-2">
                    {assignment.role}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {assignment.venue}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:text-right">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {assignment.start} - {assignment.end}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(parseISO(assignment.date), "EEE d MMM", {
                      locale: it,
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          Totale turni: {filtered.length}
        </div>
      )}
    </div>
  );
}
