"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useScheduleStore } from "@/store/useScheduleStore";
import VenueCard from "./VenueCard";
import PdfExporter from "../pdf/PdfExporter";

interface DayScheduleViewProps {
  date: string;
}

export default function DayScheduleView({ date }: DayScheduleViewProps) {
  const getOrCreateDaySchedule = useScheduleStore(
    (s) => s.getOrCreateDaySchedule
  );

  const daySchedule = useMemo(
    () => getOrCreateDaySchedule(date),
    [date, getOrCreateDaySchedule]
  );

  // Re-read from store to get live updates
  const schedules = useScheduleStore((s) => s.schedules);
  const liveSchedule = schedules[date] || daySchedule;

  const formattedDate = format(
    new Date(date + "T00:00:00"),
    "EEEE d MMMM yyyy",
    { locale: it }
  );

  return (
    <div className="pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
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
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold capitalize">{formattedDate}</h1>
          <p className="text-sm text-gray-500">
            Pianificazione turni
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {liveSchedule.venues.map((vs) => (
          <VenueCard key={vs.venueId} date={date} venueSchedule={vs} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe flex justify-center z-40">
        <PdfExporter date={date} />
      </div>
    </div>
  );
}
