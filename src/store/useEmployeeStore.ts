import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Employee, RoleId } from "@/types";
import { generateSeedEmployees } from "@/lib/employees-seed";
import { v4 as uuidv4 } from "uuid";

interface EmployeeState {
  employees: Employee[];
  initialized: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  initializeEmployees: () => void;
  addEmployee: (name: string, roles: RoleId[]) => void;
  updateEmployee: (id: string, name: string, roles: RoleId[]) => void;
  deleteEmployee: (id: string) => void;
  addRoleToEmployee: (id: string, role: RoleId) => void;
  removeRoleFromEmployee: (id: string, role: RoleId) => void;
  getEmployeesByRole: (role: RoleId) => Employee[];
  getEmployeeById: (id: string) => Employee | undefined;
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      employees: [],
      initialized: false,
      _hasHydrated: false,
      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),

      initializeEmployees: () => {
        if (!get().initialized) {
          set({ employees: generateSeedEmployees(), initialized: true });
        }
      },

      addEmployee: (name, roles) => {
        set((state) => ({
          employees: [
            ...state.employees,
            { id: uuidv4(), name, roles, active: true },
          ],
        }));
      },

      updateEmployee: (id, name, roles) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, name, roles } : e
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

      addRoleToEmployee: (id, role) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id && !e.roles.includes(role)
              ? { ...e, roles: [...e.roles, role] }
              : e
          ),
        }));
      },

      removeRoleFromEmployee: (id, role) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, roles: e.roles.filter((r) => r !== role) } : e
          ),
        }));
      },

      getEmployeesByRole: (role) => {
        return get().employees.filter((e) => e.roles.includes(role) && e.active);
      },

      getEmployeeById: (id) => {
        return get().employees.find((e) => e.id === id);
      },
    }),
    {
      name: "staff-scheduler-employees",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
