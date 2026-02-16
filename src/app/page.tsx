"use client";

import ScheduleCalendar from "@/components/calendar/ScheduleCalendar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center pt-2 md:py-8">
      <ScheduleCalendar />
    </div>
  );
}
