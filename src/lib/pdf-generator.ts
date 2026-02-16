import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DaySchedule } from "@/types";
import { VENUES, ROLES } from "@/lib/constants";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export function generateSchedulePdf(
  daySchedule: DaySchedule,
  getEmployeeName: (id: string) => string
): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const formattedDate = format(
    new Date(daySchedule.date + "T00:00:00"),
    "EEEE d MMMM yyyy",
    { locale: it }
  );

  // Title
  doc.setFontSize(18);
  doc.text(`Programmazione - ${formattedDate}`, 14, 15);

  let yPosition = 25;

  for (const venueSchedule of daySchedule.venues) {
    const venue = VENUES.find((v) => v.id === venueSchedule.venueId);
    if (!venue) continue;

    const assignedCount = venueSchedule.assignments.filter(
      (a) => a.employeeId
    ).length;
    if (assignedCount === 0) continue;

    // Check if we need a new page
    if (yPosition > 170) {
      doc.addPage();
      yPosition = 15;
    }

    // Venue header
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(venue.name, 14, yPosition);
    yPosition += 3;

    const tableHead = [["Ruolo", "Dipendente", "Inizio", "Fine"]];
    const tableBody: string[][] = [];

    for (const role of ROLES) {
      const roleAssignments = venueSchedule.assignments.filter(
        (a) => a.roleId === role.id && a.employeeId
      );

      for (const assignment of roleAssignments) {
        tableBody.push([
          role.name,
          getEmployeeName(assignment.employeeId),
          assignment.timeSlot.start,
          assignment.timeSlot.end,
        ]);
      }
    }

    if (tableBody.length > 0) {
      autoTable(doc, {
        startY: yPosition,
        head: tableHead,
        body: tableBody,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10,
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 90 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  doc.save(`programmazione-${daySchedule.date}.pdf`);
}
