"use client";

import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useScheduleStore } from "@/store/useScheduleStore";

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
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Seleziona un giorno</h1>
      <div className="w-full max-w-md [--rdp-accent-color:#3b82f6] [--rdp-accent-background-color:#dbeafe]">
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
      <p className="mt-4 text-sm text-gray-500">
        I giorni con sfondo blu hanno gia una programmazione salvata
      </p>
    </div>
  );
}
