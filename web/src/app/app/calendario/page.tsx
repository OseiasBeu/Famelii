import { CalendarPanel } from "@/components/calendar-panel";

export const metadata = {
  title: "Calendário — Famelii",
};

export default function CalendarioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendário familiar</h1>
        <p className="mt-2 text-sm text-[var(--nu-muted)]">
          Eventos por categorias com cores. Clica num dia para ver ou adicionar eventos.
        </p>
      </div>
      <CalendarPanel />
    </div>
  );
}
