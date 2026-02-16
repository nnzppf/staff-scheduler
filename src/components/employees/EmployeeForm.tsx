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
  const [selectedRoles, setSelectedRoles] = useState<RoleId[]>(
    employee?.roles || ["sala"]
  );
  const addEmployee = useEmployeeStore((s) => s.addEmployee);
  const updateEmployee = useEmployeeStore((s) => s.updateEmployee);

  const toggleRole = (roleId: RoleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || selectedRoles.length === 0) return;

    if (employee) {
      updateEmployee(employee.id, trimmed, selectedRoles);
    } else {
      addEmployee(trimmed, selectedRoles);
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ruoli (seleziona uno o più)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <label
              key={r.id}
              className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedRoles.includes(r.id)}
                onChange={() => toggleRole(r.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {r.name}
              </span>
            </label>
          ))}
        </div>
        {selectedRoles.length === 0 && (
          <p className="text-sm text-red-500 mt-2">Seleziona almeno un ruolo</p>
        )}
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
          disabled={!name.trim() || selectedRoles.length === 0}
          className="h-10 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {employee ? "Salva" : "Aggiungi"}
        </button>
      </div>
    </form>
  );
}
