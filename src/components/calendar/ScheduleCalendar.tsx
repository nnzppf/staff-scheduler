"use client";

import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useAppShell } from "@/components/ui/AppShell";
import BackupControls from "@/components/ui/BackupControls";

export default function ScheduleCalendar() {
  const { setSelectedDate } = useAppShell();
  const schedules = useScheduleStore((s) => s.schedules);

  const scheduledDates = useMemo(() => {
    return Object.keys(schedules)
      .filter((date) => {
        const schedule = schedules[date];
        return schedule?.venues?.some((vs) => vs.assignments.length > 0);
      })
      .map((d) => new Date(d + "T00:00:00"));
  }, [schedules]);

  const handleDayClick = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    setSelectedDate(dateStr);
  };

  return (
    <div className="flex flex-col items-center gap-3 md:gap-6 py-4 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          Seleziona un giorno
        </h1>
        <p className="text-sm text-gray-500 text-center mb-4 md:mb-6">
          I giorni con sfondo blu hanno già una programmazione salvata
        </p>

        {/* Calendario responsive */}
        <div className="w-full flex justify-center bg-white rounded-lg border border-gray-200 p-4 md:p-6 [--rdp-accent-color:#3b82f6] [--rdp-accent-background-color:#dbeafe] overflow-x-auto min-h-[350px]">
          <DayPicker
            mode="single"
            locale={it}
            onSelect={(day) => day && handleDayClick(day)}
            modifiers={{ scheduled: scheduledDates }}
            modifiersStyles={{
              scheduled: {
                fontWeight: "bold",
                backgroundColor: "#dbeafe",
                borderRadius: "8px",
              },
            }}
          />
        </div>
      </div>

      {/* Backup Controls */}
      <div className="w-full max-w-2xl">
        <BackupControls />
      </div>
    </div>
  );
}
