"use client";

import ScheduleCalendar from "@/components/calendar/ScheduleCalendar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 md:py-8">
      <ScheduleCalendar />
    </div>
  );
}
