import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Employee, RoleId } from "@/types";
import { generateSeedEmployees } from "@/lib/employees-seed";
import { v4 as uuidv4 } from "uuid";

interface EmployeeState {
  employees: Employee[];
  initialized: boolean;
  initializeEmployees: () => void;
  addEmployee: (name: string, role: RoleId) => void;
  updateEmployee: (id: string, name: string, role: RoleId) => void;
  deleteEmployee: (id: string) => void;
  getEmployeesByRole: (role: RoleId) => Employee[];
  getEmployeeById: (id: string) => Employee | undefined;
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      employees: [],
      initialized: false,

      initializeEmployees: () => {
        if (!get().initialized) {
          set({ employees: generateSeedEmployees(), initialized: true });
        }
      },

      addEmployee: (name, role) => {
        set((state) => ({
          employees: [
            ...state.employees,
            { id: uuidv4(), name, role, active: true },
          ],
        }));
      },

      updateEmployee: (id, name, role) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, name, role } : e
          ),
        }));
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, active: false } : e
          ),
        }));
      },

      getEmployeesByRole: (role) => {
        return get().employees.filter((e) => e.role === role && e.active);
      },

      getEmployeeById: (id) => {
        return get().employees.find((e) => e.id === id);
      },
    }),
    {
      name: "staff-scheduler-employees",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
