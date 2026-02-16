"use client";

import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useScheduleStore } from "@/store/useScheduleStore";
import BackupControls from "@/components/ui/BackupControls";

export default function ScheduleCalendar() {
  const router = useRouter();
  const getDatesWithSchedules = useScheduleStore(
    (s) => s.getDatesWithSchedules
  );

  const scheduledDates = useMemo(() => {
    return getDatesWithSchedules().map((d) => new Date(d + "T00:00:00"));
  }, [getDatesWithSchedules]);

  const handleDayClick = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    router.push(`/day/${dateStr}`);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          Seleziona un giorno
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          I giorni con sfondo blu hanno già una programmazione salvata
        </p>

        {/* Calendario responsive */}
        <div className="w-full flex justify-center bg-white rounded-lg border border-gray-200 p-4 md:p-6 [--rdp-accent-color:#3b82f6] [--rdp-accent-background-color:#dbeafe] overflow-x-auto">
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
