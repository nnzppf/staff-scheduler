"use client";

import { useRef, useState } from "react";
import { exportBackup, importBackup } from "@/lib/backup";

export default function BackupControls() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleExport = () => {
    try {
      exportBackup();
      setMessage({ type: "success", text: "Dati salvati e scaricati con successo" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Errore durante il salvataggio" });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const success = await importBackup(file);
      if (success) {
        setMessage({ type: "success", text: "Backup ripristinato con successo" });
        // Reload per aggiornare l'interfaccia
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage({ type: "error", text: "File non valido o corrotto" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Errore durante il ripristino" });
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700">Backup & Ripristino</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleExport}
          className="flex-1 h-10 px-4 flex items-center justify-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Salva e Scarica
        </button>
        <button
          onClick={handleImportClick}
          disabled={isLoading}
          className="flex-1 h-10 px-4 flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {isLoading ? "Caricamento..." : "Carica Backup"}
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />
      {message && (
        <div
          className={`text-xs px-3 py-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="text-xs text-gray-500 text-center mt-2 leading-relaxed">
        <p>
          Salva sempre la tua sessione e scarica il salvataggio così da poterlo riutilizzare su un altro dispositivo.
          I dati rimangono sempre al sicuro nel tuo browser.
        </p>
      </div>
    </div>
  );
}
