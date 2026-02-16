"use client";

import { useState, useEffect, ReactNode } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";

export default function HydrationGate({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const initializeEmployees = useEmployeeStore((s) => s.initializeEmployees);

  useEffect(() => {
    initializeEmployees();
    setHydrated(true);
  }, [initializeEmployees]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-lg">Caricamento...</div>
      </div>
    );
  }

  return <>{children}</>;
}
