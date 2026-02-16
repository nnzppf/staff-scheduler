"use client";

import { useState, useMemo } from "react";
import { RoleId, Employee } from "@/types";
import { ROLES } from "@/lib/constants";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import Modal from "@/components/ui/Modal";
import EmployeeForm from "./EmployeeForm";

export default function EmployeeList() {
  const employees = useEmployeeStore((s) => s.employees);
  const deleteEmployee = useEmployeeStore((s) => s.deleteEmployee);
  const [filterRole, setFilterRole] = useState<RoleId | "all">("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (!e.active) return false;
      if (filterRole !== "all" && !e.roles.includes(filterRole)) return false;
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [employees, filterRole, search]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const role of ROLES) counts[role.id] = 0;
    for (const e of employees) {
      if (!e.active) continue;
      for (const role of e.roles) {
        counts[role] = (counts[role] || 0) + 1;
      }
      counts.all += 1;
    }
    return counts;
  }, [employees]);

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEmployee(undefined);
    setModalOpen(true);
  };

  const handleDelete = (emp: Employee) => {
    if (confirm(`Rimuovere ${emp.name} dalla lista?`)) {
      deleteEmployee(emp.id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Dipendenti</h1>
        <button
          onClick={handleAdd}
          className="h-10 px-4 flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuovo
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cerca dipendente..."
        className="w-full h-11 px-3 mb-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Role filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-3 mb-3 -mx-1 px-1">
        <button
          onClick={() => setFilterRole("all")}
          className={`flex-shrink-0 h-9 px-3 text-sm font-medium rounded-lg transition-colors ${
            filterRole === "all"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tutti ({roleCounts.all})
        </button>
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => setFilterRole(role.id)}
            className={`flex-shrink-0 h-9 px-3 text-sm font-medium rounded-lg transition-colors ${
              filterRole === role.id
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {role.name} ({roleCounts[role.id] || 0})
          </button>
        ))}
      </div>

      {/* Employee list */}
      <div className="flex flex-col gap-1">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">{emp.name}</span>
              <div className="flex flex-wrap gap-1">
                {emp.roles.map((roleId) => (
                  <span
                    key={roleId}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium"
                  >
                    {ROLES.find((r) => r.id === roleId)?.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(emp)}
                className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                title="Modifica"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(emp)}
                className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                title="Rimuovi"
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
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            Nessun dipendente trovato
          </p>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEmployee ? "Modifica dipendente" : "Nuovo dipendente"}
      >
        <EmployeeForm
          employee={editingEmployee}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
