"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  listTasks,
  listMissions,
  listEventsForMonth,
  listHearts,
  getFamily,
  listMembers,
  localDateKey,
  type FamilyTask,
  type Mission,
  type CalendarEvent,
  type Heart,
  type Family,
  type FamilyMember,
  MOOD_OPTIONS,
} from "@famelii/core";

const card = "rounded-2xl bg-[var(--nu-bg-card)] p-5";
const shadow = { boxShadow: "var(--nu-shadow)" } as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "Boa noite";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function DashboardPanel() {
  const [ready, setReady] = useState(false);
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [tasks, setTasks] = useState<FamilyTask[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [hearts, setHearts] = useState<Heart[]>([]);

  const today = localDateKey();
  const now = new Date();

  const refresh = useCallback(async () => {
    const [f, m, t, mi, ev, h] = await Promise.all([
      getFamily(),
      listMembers(),
      listTasks(),
      listMissions(),
      listEventsForMonth(now.getFullYear(), now.getMonth() + 1),
      listHearts(),
    ]);
    setFamily(f);
    setMembers(m);
    setTasks(t);
    setMissions(mi);
    setEvents(ev);
    setHearts(h);
  }, []);

  useEffect(() => { refresh().finally(() => setReady(true)); }, [refresh]);

  if (!ready) return <p className="text-sm text-[var(--nu-muted)]">A carregar…</p>;

  const pendingTasks = tasks.filter((t) => !t.done);
  const overdueTasks = pendingTasks.filter((t) => t.dueDate && t.dueDate < today);
  const todayTasks = pendingTasks.filter((t) => t.dueDate === today);
  const activeMissions = missions.filter((m) => m.status !== "done");
  const todayEvents = events.filter((e) => e.dateLocal === today);
  const upcomingEvents = events
    .filter((e) => e.dateLocal >= today)
    .sort((a, b) => a.dateLocal.localeCompare(b.dateLocal))
    .slice(0, 5);
  const recentHearts = hearts.slice(0, 3);
  const doneTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[var(--nu-accent-strong)]">{greeting()}!</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {family?.name ?? "Famelii"}
        </h1>
        <p className="mt-1 text-sm text-[var(--nu-muted)]">{today}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Tarefas pendentes"
          value={pendingTasks.length}
          color={pendingTasks.length > 0 ? "var(--nu-accent)" : "var(--nu-success)"}
          href="/app/tarefas"
        />
        <StatCard
          label="Missões ativas"
          value={activeMissions.length}
          color="#8b5cf6"
          href="/app/missoes"
        />
        <StatCard
          label="Eventos hoje"
          value={todayEvents.length}
          color="#3b82f6"
          href="/app/calendario"
        />
        <StatCard
          label="Membros"
          value={members.length}
          color="#10b981"
          href="/app/familia"
        />
      </div>

      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <Link href="/app/tarefas" className={`${card} flex items-center gap-3 border border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/20`} style={shadow}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-lg dark:bg-red-900/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-red-600">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">{overdueTasks.length} tarefa{overdueTasks.length > 1 ? "s" : ""} atrasada{overdueTasks.length > 1 ? "s" : ""}</p>
            <p className="text-xs text-red-600/70 dark:text-red-400/60">{overdueTasks.map((t) => t.title).join(", ")}</p>
          </div>
        </Link>
      )}

      {/* Check-in CTA */}
      <Link href="/app/check-in" className={`${card} block`} style={shadow}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Como estás hoje?</h2>
            <p className="mt-0.5 text-sm text-[var(--nu-muted)]">Regista o teu check-in emocional.</p>
          </div>
          <div className="flex gap-1.5">
            {MOOD_OPTIONS.slice(0, 4).map((m) => (
              <span key={m.id} className="text-xl">{m.emoji}</span>
            ))}
          </div>
        </div>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Today's tasks */}
        <div className={card} style={shadow}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Tarefas de hoje</h2>
            <Link href="/app/tarefas" className="text-xs text-[var(--nu-accent)] hover:underline">Ver todas</Link>
          </div>
          {todayTasks.length === 0 && pendingTasks.length === 0 ? (
            <p className="mt-3 text-center text-sm text-[var(--nu-muted)]">Tudo limpo!</p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {(todayTasks.length > 0 ? todayTasks : pendingTasks).slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${t.dueDate && t.dueDate < today ? "bg-red-500" : "bg-[var(--nu-accent)]"}`} />
                  <span className="truncate">{t.title}</span>
                  {t.dueDate && t.dueDate < today && <span className="ml-auto text-[10px] text-red-500">atrasada</span>}
                </li>
              ))}
            </ul>
          )}
          {totalTasks > 0 && (
            <div className="mt-3 h-1.5 rounded-full bg-[var(--nu-bg-elevated)]">
              <div className="h-full rounded-full bg-[var(--nu-success)] transition-all" style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%` }} />
            </div>
          )}
        </div>

        {/* Upcoming events */}
        <div className={card} style={shadow}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Próximos eventos</h2>
            <Link href="/app/calendario" className="text-xs text-[var(--nu-accent)] hover:underline">Ver agenda</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="mt-3 text-center text-sm text-[var(--nu-muted)]">Sem eventos.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-lg bg-[var(--nu-bg-elevated)] text-[10px] font-semibold leading-tight">
                    <span>{e.dateLocal.slice(8)}</span>
                    <span className="text-[var(--nu-muted)]">{["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][Number(e.dateLocal.slice(5, 7))]}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{e.title}</p>
                    {e.timeStart && <p className="text-xs text-[var(--nu-muted)]">{e.timeStart}{e.timeEnd ? ` – ${e.timeEnd}` : ""}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Active missions */}
        <div className={card} style={shadow}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Missões ativas</h2>
            <Link href="/app/missoes" className="text-xs text-[var(--nu-accent)] hover:underline">Ver todas</Link>
          </div>
          {activeMissions.length === 0 ? (
            <p className="mt-3 text-center text-sm text-[var(--nu-muted)]">Sem missões ativas.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {activeMissions.slice(0, 4).map((m) => (
                <li key={m.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{m.title}</span>
                  <span className={`ml-2 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    m.status === "in_progress"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-[var(--nu-bg-elevated)] text-[var(--nu-muted)]"
                  }`}>
                    {m.status === "in_progress" ? "Em curso" : "A fazer"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent hearts */}
        <div className={card} style={shadow}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Mural de afeto</h2>
            <Link href="/app/coracoes" className="text-xs text-[var(--nu-accent)] hover:underline">Ver mural</Link>
          </div>
          {recentHearts.length === 0 ? (
            <div className="mt-3 text-center">
              <p className="text-2xl">💕</p>
              <p className="mt-1 text-sm text-[var(--nu-muted)]">Envia o primeiro coração!</p>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {recentHearts.map((h) => (
                <li key={h.id} className="flex items-start gap-2 text-sm">
                  <span className="text-lg">{h.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-[var(--nu-muted)]">{h.from} → {h.to}</p>
                    <p className="truncate">{h.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Family members */}
      {members.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {members.map((m) => (
            <div key={m.id} className="flex flex-col items-center gap-1">
              <span className="flex h-12 w-12 items-center justify-center rounded-full text-2xl" style={{ backgroundColor: `${m.color}18` }}>
                {m.avatar}
              </span>
              <span className="text-[11px] text-[var(--nu-muted)]">{m.name.split(" ")[0]}</span>
            </div>
          ))}
          <Link href="/app/familia" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed text-[var(--nu-muted)] transition hover:border-[var(--nu-accent)] hover:text-[var(--nu-accent)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, href }: { label: string; value: number; color: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl bg-[var(--nu-bg-card)] p-4 transition-all hover:scale-[1.02]" style={{ boxShadow: "var(--nu-shadow)" }}>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="mt-0.5 text-[11px] text-[var(--nu-muted)]">{label}</p>
    </Link>
  );
}
