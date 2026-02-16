"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ScheduleCalendar from "@/components/calendar/ScheduleCalendar";
import HistoryList from "@/components/history/HistoryList";
import EmployeeList from "@/components/employees/EmployeeList";
import DayScheduleView from "@/components/day/DayScheduleView";

export type TabId = "calendario" | "storico" | "dipendenti";

interface AppShellContextType {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
}

const AppShellContext = createContext<AppShellContextType>({
  activeTab: "calendario",
  setActiveTab: () => {},
  selectedDate: null,
  setSelectedDate: () => {},
});

export function useAppShell() {
  return useContext(AppShellContext);
}

export default function AppShell({ children }: { children?: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>("calendario");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <AppShellContext.Provider value={{ activeTab, setActiveTab, selectedDate, setSelectedDate }}>
      {children}

      <main className="max-w-7xl mx-auto px-4 py-4 pb-safe">
        {/* Day view (overlays tabs when a date is selected) */}
        {selectedDate ? (
          <DayScheduleView date={selectedDate} />
        ) : (
          <>
            {/* Calendario */}
            <div className={activeTab === "calendario" ? "block" : "hidden"}>
              <div className="flex flex-col items-center justify-start md:justify-center pt-2 md:py-8">
                <ScheduleCalendar />
              </div>
            </div>

            {/* Storico */}
            <div className={activeTab === "storico" ? "block" : "hidden"}>
              <div className="py-4 px-4 max-w-4xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">Storico turni</h1>
                  <p className="text-sm text-gray-500">
                    Visualizza tutti i turni assegnati, filtrabile per ruolo e locale
                  </p>
                </div>
                <HistoryList />
              </div>
            </div>

            {/* Dipendenti */}
            <div className={activeTab === "dipendenti" ? "block" : "hidden"}>
              <div className="py-4">
                <EmployeeList />
              </div>
            </div>
          </>
        )}
      </main>
    </AppShellContext.Provider>
  );
}
