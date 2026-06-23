"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addMission,
  deleteMission,
  listMissions,
  updateMissionStatus,
  MISSION_PRIORITIES,
  MISSION_STATUSES,
  type Mission,
  type MissionPriority,
  type MissionStatus,
} from "@famelii/core";

const card = "rounded-2xl bg-[var(--nu-bg-card)] p-5";
const shadow = { boxShadow: "var(--nu-shadow)" } as const;
const input = "w-full rounded-xl border bg-[var(--nu-bg)] px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[var(--nu-accent)]/40";
const btnPrimary = "rounded-xl bg-[var(--nu-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110";

function priorityEmoji(p: MissionPriority) {
  return MISSION_PRIORITIES.find((x) => x.id === p)?.emoji ?? "";
}

export function MissionsPanel() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<MissionStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<MissionPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");

  const refresh = useCallback(async () => { setMissions(await listMissions()); }, []);
  useEffect(() => { refresh().finally(() => setReady(true)); }, [refresh]);

  const filtered = filter === "all" ? missions : missions.filter((m) => m.status === filter);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await addMission({ title, description, assignee, priority, dueDate, category });
    setTitle(""); setDescription(""); setAssignee(""); setDueDate(""); setCategory("");
    setShowForm(false);
    await refresh();
  }

  const counts = {
    todo: missions.filter((m) => m.status === "todo").length,
    in_progress: missions.filter((m) => m.status === "in_progress").length,
    done: missions.filter((m) => m.status === "done").length,
  };

  if (!ready) return <p className="text-sm text-[var(--nu-muted)]">A carregar…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl bg-[var(--nu-bg-elevated)] p-1">
          {([["all", "Todas", null], ["todo", "A fazer", counts.todo], ["in_progress", "Em curso", counts.in_progress], ["done", "Feitas", counts.done]] as const).map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === id
                  ? "bg-[var(--nu-bg-card)] text-[var(--nu-ink)]"
                  : "text-[var(--nu-muted)] hover:text-[var(--nu-ink)]"
              }`}
              style={filter === id ? shadow : undefined}
            >
              {label}{count !== null && <span className="ml-1 opacity-50">{count}</span>}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)} className={btnPrimary}>
          {showForm ? "Cancelar" : "+ Missão"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className={card} style={shadow}>
          <h3 className="mb-4 text-base font-semibold">Nova missão</h3>
          <div className="flex flex-col gap-3">
            <input placeholder="Título da missão" value={title} onChange={(e) => setTitle(e.target.value)} className={input} required />
            <input placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} className={input} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Responsável" value={assignee} onChange={(e) => setAssignee(e.target.value)} className={input} />
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={input} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={priority} onChange={(e) => setPriority(e.target.value as MissionPriority)} className={input}>
                {MISSION_PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.label}</option>)}
              </select>
              <input placeholder="Categoria (opcional)" value={category} onChange={(e) => setCategory(e.target.value)} className={input} />
            </div>
            <button type="submit" className={`${btnPrimary} w-fit`}>Criar missão</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-12 text-center">
          <p className="text-3xl">🎯</p>
          <p className="mt-3 text-sm text-[var(--nu-muted)]">
            {filter !== "all" ? "Nenhuma missão neste estado." : "Nenhuma missão ainda. Cria a primeira!"}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((m) => (
            <li key={m.id} className={card} style={shadow}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{priorityEmoji(m.priority)}</span>
                    <h3 className={`font-semibold ${m.status === "done" ? "text-[var(--nu-muted)] line-through" : ""}`}>
                      {m.title}
                    </h3>
                  </div>
                  {m.description && <p className="mt-1.5 text-sm text-[var(--nu-muted)]">{m.description}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.assignee && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--nu-bg-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--nu-muted)]">
                        👤 {m.assignee}
                      </span>
                    )}
                    {m.dueDate && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--nu-bg-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--nu-muted)]">
                        📅 {m.dueDate}
                      </span>
                    )}
                    {m.category && (
                      <span className="inline-flex items-center rounded-lg bg-[var(--nu-accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--nu-accent-strong)]">
                        {m.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <select
                    value={m.status}
                    onChange={(e) => updateMissionStatus(m.id, e.target.value as MissionStatus).then(refresh)}
                    className="rounded-lg border bg-[var(--nu-bg)] px-2 py-1.5 text-xs font-medium outline-none"
                  >
                    {MISSION_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <button type="button" onClick={() => deleteMission(m.id).then(refresh)} className="text-xs text-[var(--nu-danger)] hover:underline">
                    Apagar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
