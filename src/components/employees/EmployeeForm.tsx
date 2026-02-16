"use client";

import { useState } from "react";
import { RoleId, Employee } from "@/types";
import { ROLES } from "@/lib/constants";
import { useEmployeeStore } from "@/store/useEmployeeStore";

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
}

export default function EmployeeForm({ employee, onClose }: EmployeeFormProps) {
  const [name, setName] = useState(employee?.name || "");
  const [role, setRole] = useState<RoleId>(employee?.role || "sala");
  const addEmployee = useEmployeeStore((s) => s.addEmployee);
  const updateEmployee = useEmployeeStore((s) => s.updateEmployee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    if (employee) {
      updateEmployee(employee.id, trimmed, role);
    } else {
      addEmployee(trimmed, role);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome dipendente"
          className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ruolo
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as RoleId)}
          className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="h-10 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {employee ? "Salva" : "Aggiungi"}
        </button>
      </div>
    </form>
  );
}
