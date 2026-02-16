"use client";

import { useEffect, ReactNode } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";

export default function HydrationGate({ children }: { children: ReactNode }) {
  const initializeEmployees = useEmployeeStore((s) => s.initializeEmployees);

  useEffect(() => {
    initializeEmployees();
  }, [initializeEmployees]);

  return <>{children}</>;
}
