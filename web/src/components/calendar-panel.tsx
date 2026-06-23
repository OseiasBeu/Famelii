"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addEvent,
  deleteEvent,
  getDaysInMonth,
  getFirstDayOfWeek,
  listEventsForMonth,
  EVENT_CATEGORIES,
  type CalendarEvent,
  type EventCategory,
} from "@famelii/core";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const card = "rounded-2xl bg-[var(--nu-bg-card)] p-5 sm:p-6";
const shadow = { boxShadow: "var(--nu-shadow)" } as const;
const input = "w-full rounded-xl border bg-[var(--nu-bg)] px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[var(--nu-accent)]/40";
const btnPrimary = "rounded-xl bg-[var(--nu-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110";

export function CalendarPanel() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [ready, setReady] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [category, setCategory] = useState<EventCategory>("familia");
  const [assignee, setAssignee] = useState("");

  const refresh = useCallback(async () => {
    setEvents(await listEventsForMonth(year, month));
  }, [year, month]);

  useEffect(() => { refresh().finally(() => setReady(true)); }, [refresh]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const eventsForDay = (day: number) => {
    const d = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.dateLocal === d);
  };

  const categoryColor = (cat: EventCategory) =>
    EVENT_CATEGORIES.find((c) => c.id === cat)?.color ?? "#6b7280";

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !selectedDate) return;
    await addEvent({ title, description, dateLocal: selectedDate, timeStart, timeEnd, category, assignee });
    setTitle(""); setDescription(""); setTimeStart(""); setTimeEnd(""); setAssignee("");
    setShowForm(false);
    await refresh();
  }

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(year - 1); } else setMonth(month - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(year + 1); } else setMonth(month + 1);
  }

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (!ready) return <p className="text-sm text-[var(--nu-muted)]">A carregar…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevMonth} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--nu-bg-elevated)] text-sm font-medium transition hover:bg-[var(--nu-accent-soft)]">←</button>
        <h2 className="text-lg font-bold">{MONTHS[month - 1]} {year}</h2>
        <button type="button" onClick={nextMonth} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--nu-bg-elevated)] text-sm font-medium transition hover:bg-[var(--nu-accent-soft)]">→</button>
      </div>

      <div className={card} style={shadow}>
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-[var(--nu-border)]">
          {WEEKDAYS.map((d) => (
            <div key={d} className="bg-[var(--nu-bg-elevated)] py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[var(--nu-muted)]">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} className="bg-[var(--nu-bg-card)] p-2" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = eventsForDay(day);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={day}
                type="button"
                onClick={() => { setSelectedDate(dateStr); setShowForm(false); }}
                className={`min-h-[3.5rem] bg-[var(--nu-bg-card)] p-1.5 text-left transition-colors hover:bg-[var(--nu-accent-soft)] ${
                  isSelected ? "bg-[var(--nu-accent-soft)]" : ""
                }`}
              >
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold ${
                  isToday ? "bg-[var(--nu-accent)] text-white" : ""
                }`}>
                  {day}
                </span>
                <div className="mt-0.5 flex flex-wrap gap-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <span key={ev.id} className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: categoryColor(ev.category) }} title={ev.title} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className={card} style={shadow}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{selectedDate}</h3>
            <button type="button" onClick={() => setShowForm(!showForm)} className={btnPrimary}>
              {showForm ? "Cancelar" : "+ Evento"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAdd} className="mt-5 flex flex-col gap-3">
              <input placeholder="Título do evento" value={title} onChange={(e) => setTitle(e.target.value)} className={input} required />
              <input placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} className={input} />
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="time" value={timeStart} onChange={(e) => setTimeStart(e.target.value)} className={input} />
                <input type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} className={input} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={category} onChange={(e) => setCategory(e.target.value as EventCategory)} className={input}>
                  {EVENT_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <input placeholder="Responsável" value={assignee} onChange={(e) => setAssignee(e.target.value)} className={input} />
              </div>
              <button type="submit" className={`${btnPrimary} w-fit`}>Guardar evento</button>
            </form>
          )}

          <ul className="mt-4 space-y-2">
            {events.filter((e) => e.dateLocal === selectedDate).map((ev) => (
              <li key={ev.id} className="flex items-start justify-between gap-3 rounded-xl bg-[var(--nu-bg-elevated)] p-3 text-sm">
                <div className="flex gap-2.5">
                  <span className="mt-1.5 block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: categoryColor(ev.category) }} />
                  <div>
                    <p className="font-semibold">{ev.title}</p>
                    {ev.timeStart && <p className="text-xs text-[var(--nu-muted)]">{ev.timeStart}{ev.timeEnd ? ` – ${ev.timeEnd}` : ""}</p>}
                    {ev.description && <p className="text-xs text-[var(--nu-muted)]">{ev.description}</p>}
                    {ev.assignee && <p className="text-xs text-[var(--nu-muted)]">{ev.assignee}</p>}
                  </div>
                </div>
                <button type="button" onClick={() => deleteEvent(ev.id).then(refresh)} className="text-xs text-[var(--nu-danger)] hover:underline">Apagar</button>
              </li>
            ))}
            {events.filter((e) => e.dateLocal === selectedDate).length === 0 && (
              <p className="py-4 text-center text-sm text-[var(--nu-muted)]">Sem eventos neste dia.</p>
            )}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-[var(--nu-muted)]">
        {EVENT_CATEGORIES.map((c) => (
          <span key={c.id} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
