"use client";

import { useMemo } from "react";
import { RoleId, VenueId } from "@/types";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useScheduleStore } from "@/store/useScheduleStore";
import { getAvailableEmployees } from "@/lib/conflict-detection";
import { VENUES } from "@/lib/constants";

interface EmployeeDropdownProps {
  date: string;
  roleId: RoleId;
  venueId: VenueId;
  currentEmployeeId: string;
  assignmentId: string;
  currentTimeSlot: { start: string; end: string };
  onSelect: (employeeId: string) => void;
}

export default function EmployeeDropdown({
  date,
  roleId,
  currentEmployeeId,
  assignmentId,
  currentTimeSlot,
  onSelect,
}: EmployeeDropdownProps) {
  const getEmployeesByRole = useEmployeeStore((s) => s.getEmployeesByRole);
  const getEmployeeById = useEmployeeStore((s) => s.getEmployeeById);
  const getAllAssignmentsForDay = useScheduleStore(
    (s) => s.getAllAssignmentsForDay
  );

  const { available, conflicting } = useMemo(() => {
    const roleEmployees = getEmployeesByRole(roleId);
    const allDayAssignments = getAllAssignmentsForDay(date);
    return getAvailableEmployees(
      roleEmployees.map((e) => e.id),
      currentTimeSlot,
      allDayAssignments,
      assignmentId
    );
  }, [
    roleId,
    date,
    currentTimeSlot,
    assignmentId,
    getEmployeesByRole,
    getAllAssignmentsForDay,
  ]);

  return (
    <select
      value={currentEmployeeId}
      onChange={(e) => onSelect(e.target.value)}
      className={`h-11 flex-1 min-w-0 px-3 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        currentEmployeeId ? "border-gray-300" : "border-amber-400 bg-amber-50"
      }`}
    >
      <option value="">-- Seleziona dipendente --</option>
      {available.map((empId) => {
        const emp = getEmployeeById(empId);
        if (!emp) return null;
        return (
          <option key={empId} value={empId}>
            {emp.name}
          </option>
        );
      })}
      {conflicting.map(({ employeeId, conflictWith }) => {
        const emp = getEmployeeById(employeeId);
        const venue = VENUES.find((v) => v.id === conflictWith.venueId);
        if (!emp) return null;
        return (
          <option key={employeeId} value={employeeId} disabled>
            {emp.name} (in {venue?.name} {conflictWith.timeSlot.start}-
            {conflictWith.timeSlot.end})
          </option>
        );
      })}
    </select>
  );
}
