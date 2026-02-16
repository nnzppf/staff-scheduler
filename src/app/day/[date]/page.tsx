"use client";

import { use } from "react";
import DayScheduleView from "@/components/day/DayScheduleView";

export default function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Data non valida</p>
      </div>
    );
  }

  return <DayScheduleView date={date} />;
}
