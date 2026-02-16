"use client";

import { useScheduleStore } from "@/store/useScheduleStore";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { generateSchedulePdf } from "@/lib/pdf-generator";

interface PdfExporterProps {
  date: string;
}

export default function PdfExporter({ date }: PdfExporterProps) {
  const schedules = useScheduleStore((s) => s.schedules);
  const getEmployeeById = useEmployeeStore((s) => s.getEmployeeById);

  const handleExport = () => {
    const schedule = schedules[date];
    if (!schedule) return;

    generateSchedulePdf(schedule, (id) => {
      const emp = getEmployeeById(id);
      return emp?.name || "N/A";
    });
  };

  const hasAssignments = schedules[date]?.venues.some(
    (vs) => vs.assignments.some((a) => a.employeeId)
  );

  return (
    <button
      onClick={handleExport}
      disabled={!hasAssignments}
      className={`h-12 px-6 flex items-center gap-2 rounded-xl font-medium text-sm transition-colors ${
        hasAssignments
          ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
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
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="12" y2="18" />
        <line x1="15" y1="15" x2="12" y2="18" />
      </svg>
      Esporta PDF
    </button>
  );
}
