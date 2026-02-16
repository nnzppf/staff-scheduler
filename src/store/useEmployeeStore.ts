import { create } from "zustand";
import { Employee, RoleId } from "@/types";
import { generateSeedEmployees } from "@/lib/employees-seed";
import { v4 as uuidv4 } from "uuid";
import { ref, set, onValue, off, get } from "firebase/database";
import { db } from "@/lib/firebase";

interface EmployeeState {
  employees: Employee[];
  initialized: boolean;
  _isListening: boolean;

  // Firebase real-time listener
  startListening: () => void;
  stopListening: () => void;

  // Actions
  initializeEmployees: () => void;
  addEmployee: (name: string, roles: RoleId[]) => void;
  updateEmployee: (id: string, name: string, roles: RoleId[]) => void;
  deleteEmployee: (id: string) => void;
  addRoleToEmployee: (id: string, role: RoleId) => void;
  removeRoleFromEmployee: (id: string, role: RoleId) => void;
  getEmployeesByRole: (role: RoleId) => Employee[];
  getEmployeeById: (id: string) => Employee | undefined;
}

/**
 * Save employees to Firebase
 */
function saveEmployeesToFirebase(employees: Employee[], initialized: boolean) {
  const employeesRef = ref(db, "employees");
  set(employeesRef, { list: employees, initialized }).catch((err) =>
    console.error("Firebase employees write error:", err)
  );
}

export const useEmployeeStore = create<EmployeeState>()((setState, getState) => ({
  employees: [],
  initialized: false,
  _isListening: false,

  startListening: () => {
    if (getState()._isListening) return;

    const employeesRef = ref(db, "employees");
    onValue(employeesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = data.list || [];
        // Firebase may convert arrays to objects with numeric keys
        const employees = Array.isArray(list)
          ? list.filter(Boolean)
          : Object.values(list).filter(Boolean);
        setState({
          employees: employees as Employee[],
          initialized: data.initialized || false,
        });
      }
    });

    setState({ _isListening: true });
    console.log("✓ Firebase employees listener active");
  },

  stopListening: () => {
    const employeesRef = ref(db, "employees");
    off(employeesRef);
    setState({ _isListening: false });
  },

  initializeEmployees: async () => {
    // Check Firebase first — if already initialized there, don't re-seed
    const employeesRef = ref(db, "employees");
    const snapshot = await get(employeesRef);

    if (snapshot.exists() && snapshot.val().initialized) {
      // Already initialized in Firebase, listener will handle the data
      return;
    }

    // Not in Firebase yet — seed and save
    const seedEmployees = generateSeedEmployees();
    setState({ employees: seedEmployees, initialized: true });
    saveEmployeesToFirebase(seedEmployees, true);
  },

  addEmployee: (name, roles) => {
    const newEmployee: Employee = { id: uuidv4(), name, roles, active: true };
    const updated = [...getState().employees, newEmployee];
    setState({ employees: updated });
    saveEmployeesToFirebase(updated, true);
  },

  updateEmployee: (id, name, roles) => {
    const updated = getState().employees.map((e) =>
      e.id === id ? { ...e, name, roles } : e
    );
    setState({ employees: updated });
    saveEmployeesToFirebase(updated, true);
  },

  deleteEmployee: (id) => {
    const updated = getState().employees.map((e) =>
      e.id === id ? { ...e, active: false } : e
    );
    setState({ employees: updated });
    saveEmployeesToFirebase(updated, true);
  },

  addRoleToEmployee: (id, role) => {
    const updated = getState().employees.map((e) =>
      e.id === id && !e.roles.includes(role)
        ? { ...e, roles: [...e.roles, role] }
        : e
    );
    setState({ employees: updated });
    saveEmployeesToFirebase(updated, true);
  },

  removeRoleFromEmployee: (id, role) => {
    const updated = getState().employees.map((e) =>
      e.id === id ? { ...e, roles: e.roles.filter((r) => r !== role) } : e
    );
    setState({ employees: updated });
    saveEmployeesToFirebase(updated, true);
  },

  getEmployeesByRole: (role) => {
    return getState().employees.filter((e) => e.roles.includes(role) && e.active);
  },

  getEmployeeById: (id) => {
    return getState().employees.find((e) => e.id === id);
  },
}));
