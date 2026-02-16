"use client";

import HistoryList from "@/components/history/HistoryList";

export default function HistoryPage() {
  return (
    <div className="py-4 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Storico turni</h1>
        <p className="text-sm text-gray-500">
          Visualizza tutti i turni assegnati, filtrabile per ruolo e locale
        </p>
      </div>
      <HistoryList />
    </div>
  );
}
