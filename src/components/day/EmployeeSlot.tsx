"use client";

import { Assignment, VenueId } from "@/types";
import { useScheduleStore } from "@/store/useScheduleStore";
import EmployeeDropdown from "./EmployeeDropdown";
import TimeSelector from "./TimeSelector";

interface EmployeeSlotProps {
  date: string;
  venueId: VenueId;
  assignment: Assignment;
}

export default function EmployeeSlot({
  date,
  venueId,
  assignment,
}: EmployeeSlotProps) {
  const updateAssignmentEmployee = useScheduleStore(
    (s) => s.updateAssignmentEmployee
  );
  const updateAssignmentTime = useScheduleStore(
    (s) => s.updateAssignmentTime
  );
  const removeAssignment = useScheduleStore((s) => s.removeAssignment);

  const handleEmployeeChange = (employeeId: string) => {
    updateAssignmentEmployee(date, venueId, assignment.id, employeeId);
  };

  const handleStartTimeChange = (start: string) => {
    updateAssignmentTime(date, venueId, assignment.id, {
      ...assignment.timeSlot,
      start,
    });
  };

  const handleEndTimeChange = (end: string) => {
    updateAssignmentTime(date, venueId, assignment.id, {
      ...assignment.timeSlot,
      end,
    });
  };

  const handleRemove = () => {
    removeAssignment(date, venueId, assignment.id);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-end p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <label className="text-xs text-gray-500 mb-1 block">Dipendente</label>
        <EmployeeDropdown
          date={date}
          roleId={assignment.roleId}
          venueId={venueId}
          currentEmployeeId={assignment.employeeId}
          assignmentId={assignment.id}
          currentTimeSlot={assignment.timeSlot}
          onSelect={handleEmployeeChange}
        />
      </div>
      <div className="flex gap-2 items-end">
        <TimeSelector
          value={assignment.timeSlot.start}
          onChange={handleStartTimeChange}
          label="Inizio"
        />
        <TimeSelector
          value={assignment.timeSlot.end}
          onChange={handleEndTimeChange}
          label="Fine"
          includeChiusura
        />
        <button
          onClick={handleRemove}
          className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          title="Rimuovi"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
