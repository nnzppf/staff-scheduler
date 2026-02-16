"use client";

import { useState } from "react";
import { VenueSchedule } from "@/types";
import { VENUES, ROLES } from "@/lib/constants";
import RoleSection from "./RoleSection";

interface VenueCardProps {
  date: string;
  venueSchedule: VenueSchedule;
}

export default function VenueCard({ date, venueSchedule }: VenueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const venue = VENUES.find((v) => v.id === venueSchedule.venueId);
  const totalAssigned = venueSchedule.assignments.length;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
      style={{ borderLeftWidth: "4px", borderLeftColor: venue?.color }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold">{venue?.name}</h3>
          {totalAssigned > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {totalAssigned} assegnati
            </span>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-400 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {ROLES.map((role) => {
            const roleAssignments = venueSchedule.assignments.filter(
              (a) => a.roleId === role.id
            );
            return (
              <RoleSection
                key={role.id}
                date={date}
                venueId={venueSchedule.venueId}
                roleId={role.id}
                assignments={roleAssignments}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
