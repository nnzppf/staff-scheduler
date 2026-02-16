"use client";

import { Assignment, RoleId, VenueId } from "@/types";
import { useScheduleStore } from "@/store/useScheduleStore";
import { ROLES } from "@/lib/constants";
import EmployeeSlot from "./EmployeeSlot";

interface RoleSectionProps {
  date: string;
  venueId: VenueId;
  roleId: RoleId;
  assignments: Assignment[];
}

export default function RoleSection({
  date,
  venueId,
  roleId,
  assignments,
}: RoleSectionProps) {
  const addAssignment = useScheduleStore((s) => s.addAssignment);
  const role = ROLES.find((r) => r.id === roleId);

  const handleAdd = () => {
    addAssignment(date, venueId, roleId);
  };

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-700">
            {role?.name || roleId}
          </h4>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {assignments.length}
          </span>
        </div>
        <button
          onClick={handleAdd}
          className="h-9 px-3 flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Aggiungi
        </button>
      </div>
      {assignments.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-2">
          Nessun dipendente assegnato
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {assignments.map((assignment) => (
            <EmployeeSlot
              key={assignment.id}
              date={date}
              venueId={venueId}
              assignment={assignment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
