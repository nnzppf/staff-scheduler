# Staff Scheduler

Web app per pianificare i turni dei dipendenti su 5 locali notturni. Deploy su Vercel.

## URL
- **Live:** https://staff-scheduler-filippo-zanons-projects.vercel.app
- **Repo:** https://github.com/nnzppf/staff-scheduler

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Zustand (stato + localStorage persistence)
- react-day-picker v9 (calendario)
- jsPDF + jspdf-autotable (export PDF)
- date-fns (date in italiano)

## Locali
1. Studios
2. Too Late
3. La Casa dei Gelsi
4. Tenuta Villa Peggy's
5. Villa Peggy's

## Ruoli dipendenti
- Sala (72), Bar (23), Cassa (20), Pass (4), Guardaroba (13)
- 131 dipendenti totali precaricati in `src/lib/employees-seed.ts`

## Struttura chiave

```
src/
├── app/
│   ├── page.tsx                    # Home: calendario
│   ├── day/[date]/page.tsx         # Pianificazione giorno
│   └── employees/page.tsx          # Gestione dipendenti
├── components/
│   ├── calendar/ScheduleCalendar   # Calendario con react-day-picker v9
│   ├── day/                        # DayScheduleView > VenueCard > RoleSection > EmployeeSlot
│   │   ├── EmployeeDropdown        # Select filtrato per ruolo + disponibilità
│   │   └── TimeSelector            # Select orario (ogni 15 min, 18:00-06:00)
│   ├── employees/                  # EmployeeList, EmployeeForm
│   ├── pdf/PdfExporter             # Bottone export PDF
│   └── ui/                         # Header, Modal, HydrationGate
├── store/
│   ├── useEmployeeStore.ts         # CRUD dipendenti (localStorage: staff-scheduler-employees)
│   └── useScheduleStore.ts         # Turni/assegnazioni (localStorage: staff-scheduler-schedules)
├── lib/
│   ├── constants.ts                # VENUES, ROLES, TIME_OPTIONS
│   ├── employees-seed.ts           # Dati iniziali 131 dipendenti
│   ├── conflict-detection.ts       # Logica sovrapposizione orari overnight
│   └── pdf-generator.ts            # Generazione PDF con jsPDF
└── types/index.ts                  # Employee, Assignment, DaySchedule, VenueSchedule
```

## Logica conflitti
- Orari normalizzati: 18:00 = minuto 0, 00:00-06:00 trattati come "giorno dopo"
- Due turni si sovrappongono se `startA < endB AND startB < endA`
- Dipendente può lavorare in 2 locali solo se orari NON si sovrappongono
- EmployeeDropdown mostra in grigio/disabilitati i dipendenti in conflitto

## Flusso UX
1. Calendario > click giorno > 5 card locali (collassabili)
2. Per ogni ruolo: tasto "+" aggiunge slot dipendente
3. Ogni slot: dropdown dipendente + orario inizio/fine
4. Bottone "Esporta PDF" sticky in basso

## Comandi
- `npm run dev` - dev server
- `npm run build` - build produzione
- Deploy automatico su Vercel ad ogni push su main

## Note
- L'app è in italiano (date, label, UI)
- Mobile-first, select nativi per iOS Safari
- Dati salvati in localStorage (persistono tra sessioni)
- PWA manifest in public/manifest.json
