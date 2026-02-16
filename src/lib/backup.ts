import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useScheduleStore } from "@/store/useScheduleStore";

export interface BackupData {
  version: "1.0";
  exportDate: string;
  employees: ReturnType<typeof useEmployeeStore.getState>["employees"];
  schedules: ReturnType<typeof useScheduleStore.getState>["schedules"];
}

export function exportBackup(): void {
  const employees = useEmployeeStore.getState().employees;
  const schedules = useScheduleStore.getState().schedules;

  const backup: BackupData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    employees,
    schedules,
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `staff-scheduler-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importBackup(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content) as BackupData;

        if (backup.version !== "1.0") {
          console.error("Backup version not supported");
          resolve(false);
          return;
        }

        // Ripristina dipendenti
        useEmployeeStore.setState({ employees: backup.employees });

        // Ripristina schedules
        useScheduleStore.setState({ schedules: backup.schedules });

        resolve(true);
      } catch (error) {
        console.error("Error importing backup:", error);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
}
