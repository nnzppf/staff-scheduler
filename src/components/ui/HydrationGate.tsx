"use client";

import { ReactNode } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useScheduleStore } from "@/store/useScheduleStore";

export default function HydrationGate({ children }: { children: ReactNode }) {
  const employeesHydrated = useEmployeeStore((s) => s._hasHydrated);
  const schedulesHydrated = useScheduleStore((s) => s._hasHydrated);
  const initializeEmployees = useEmployeeStore((s) => s.initializeEmployees);

  const ready = employeesHydrated && schedulesHydrated;

  // Initialize employees once hydrated
  if (ready) {
    initializeEmployees();
  }

  return (
    <div
      className={`transition-opacity duration-150 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
