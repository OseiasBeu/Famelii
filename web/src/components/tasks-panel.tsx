"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addSection,
  addTask,
  deleteTask,
  listSections,
  listTasks,
  toggleTask,
  updateTask,
  TASK_PRIORITY_COLORS,
  type FamilyTask,
  type TaskPriority,
} from "@famelii/core";

/* ── Todoist-style circular checkbox ── */
function PriorityCheckbox({
  priority,
  checked,
  onChange,
}: {
  priority: TaskPriority;
  checked: boolean;
  onChange: () => void;
}) {
  const color = TASK_PRIORITY_COLORS[priority];
  return (
    <button
      type="button"
      onClick={onChange}
      className="group/cb flex h-5 w-5 shrink-0 items-center justify-center"
      aria-label={checked ? "Desmarcar" : "Concluir"}
    >
      {checked ? (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" style={{ color }}>
          <circle cx="12" cy="12" r="11" fill="currentColor" opacity={0.15} stroke="currentColor" strokeWidth={2} />
          <path d="M7 12.5l3.5 3.5 6.5-7" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] transition-transform group-hover/cb:scale-110" style={{ color }}>
          <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth={2} opacity={0.5} />
          <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth={2} className="opacity-0 group-hover/cb:opacity-30" />
        </svg>
      )}
    </button>
  );
}

/* ── Inline add task row ── */
function AddTaskInline({
  section,
  onAdd,
}: {
  section: string;
  onAdd: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(4);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function handleSubmit() {
    if (!title.trim()) return;
    await addTask({ title, description, dueDate, assignee, priority, section });
    setTitle(""); setDescription(""); setDueDate(""); setAssignee(""); setPriority(4);
    setOpen(false);
    onAdd();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-sm text-[var(--nu-muted)] transition hover:text-[var(--nu-accent)]"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[var(--nu-accent)] transition-colors group-hover:bg-[var(--nu-accent)] group-hover:text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
        Adicionar tarefa
      </button>
    );
  }

  return (
    <div className="rounded-2xl border bg-[var(--nu-bg-card)] p-3" style={{ boxShadow: "var(--nu-shadow)" }}>
      <input
        ref={inputRef}
        placeholder="Nome da tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
        className="w-full bg-transparent text-sm font-medium text-[var(--nu-ink)] outline-none placeholder:text-[var(--nu-muted)]"
      />
      <input
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-1 w-full bg-transparent text-xs text-[var(--nu-muted)] outline-none placeholder:text-[var(--nu-muted)]/60"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border bg-[var(--nu-bg)] px-2 py-1 text-xs outline-none"
        />
        <input
          placeholder="Responsável"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="rounded-lg border bg-[var(--nu-bg)] px-2 py-1 text-xs outline-none"
        />
        <div className="flex gap-0.5">
          {([1, 2, 3, 4] as TaskPriority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex h-6 w-6 items-center justify-center rounded-md text-xs transition ${
                priority === p ? "ring-2 ring-offset-1" : "opacity-40 hover:opacity-80"
              }`}
              style={{ color: TASK_PRIORITY_COLORS[p], ringColor: TASK_PRIORITY_COLORS[p] }}
              title={`Prioridade ${p}`}
            >
              <svg viewBox="0 0 24 24" fill={priority === p ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 border-t pt-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="rounded-lg bg-[var(--nu-accent)] px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setTitle(""); setDescription(""); }}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--nu-muted)] transition hover:bg-[var(--nu-bg-elevated)]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* ── Date formatting ── */
function formatDue(date: string) {
  if (!date) return null;
  const today = new Date();
  const d = new Date(date + "T00:00:00");
  const diff = Math.round((d.getTime() - today.setHours(0, 0, 0, 0)) / 86400000);

  let label: string;
  let colorClass: string;

  if (diff < 0) { label = "Atrasada"; colorClass = "text-[var(--nu-danger)]"; }
  else if (diff === 0) { label = "Hoje"; colorClass = "text-[var(--nu-success)]"; }
  else if (diff === 1) { label = "Amanhã"; colorClass = "text-[var(--nu-accent)]"; }
  else if (diff < 7) {
    label = d.toLocaleDateString("pt-PT", { weekday: "short" });
    colorClass = "text-[var(--nu-info)]";
  } else {
    label = d.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
    colorClass = "text-[var(--nu-muted)]";
  }
  return { label, colorClass };
}

/* ── Single task row ── */
function TaskRow({
  task,
  onRefresh,
}: {
  task: FamilyTask;
  onRefresh: () => void;
}) {
  const due = formatDue(task.dueDate);
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className={`group flex items-start gap-3 border-b px-2 py-2.5 transition-colors last:border-b-0 hover:bg-[var(--nu-bg-elevated)]/50 ${
        task.done ? "opacity-50" : ""
      }`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="pt-0.5">
        <PriorityCheckbox
          priority={task.priority}
          checked={task.done}
          onChange={() => toggleTask(task.id).then(onRefresh)}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${task.done ? "text-[var(--nu-muted)] line-through" : "text-[var(--nu-ink)]"}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-xs leading-snug text-[var(--nu-muted)]">{task.description}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          {due && (
            <span className={`flex items-center gap-1 text-[11px] font-medium ${due.colorClass}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {due.label}
            </span>
          )}
          {task.assignee && (
            <span className="text-[11px] text-[var(--nu-muted)]">
              {task.assignee}
            </span>
          )}
        </div>
      </div>
      <div className={`flex shrink-0 items-center gap-1 transition-opacity ${hovering ? "opacity-100" : "opacity-0"}`}>
        {!task.done && (
          <select
            value={task.priority}
            onChange={(e) => updateTask(task.id, { priority: Number(e.target.value) as TaskPriority }).then(onRefresh)}
            className="h-6 rounded border bg-[var(--nu-bg)] px-1 text-[10px] outline-none"
            title="Prioridade"
          >
            <option value={1}>P1</option>
            <option value={2}>P2</option>
            <option value={3}>P3</option>
            <option value={4}>P4</option>
          </select>
        )}
        <button
          type="button"
          onClick={() => deleteTask(task.id).then(onRefresh)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--nu-muted)] transition hover:bg-[var(--nu-bg-elevated)] hover:text-[var(--nu-danger)]"
          title="Apagar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Main panel ── */
export function TasksPanel() {
  const [tasks, setTasks] = useState<FamilyTask[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [newSection, setNewSection] = useState("");
  const [addingSection, setAddingSection] = useState(false);

  const refresh = useCallback(async () => {
    const [t, s] = await Promise.all([listTasks(), listSections()]);
    setTasks(t);
    setSections(s);
  }, []);

  useEffect(() => { refresh().finally(() => setReady(true)); }, [refresh]);

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const unsectioned = pending.filter((t) => !t.section);
  const sectionTasks = (s: string) => pending.filter((t) => t.section === s);

  async function handleAddSection() {
    if (!newSection.trim()) return;
    await addSection(newSection);
    setNewSection("");
    setAddingSection(false);
    await refresh();
  }

  if (!ready) return <p className="text-sm text-[var(--nu-muted)]">A carregar…</p>;

  return (
    <div className="flex flex-col gap-4">
      {/* Overdue count */}
      {pending.filter((t) => t.dueDate && formatDue(t.dueDate)?.label === "Atrasada").length > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-medium text-[var(--nu-danger)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {pending.filter((t) => t.dueDate && formatDue(t.dueDate)?.label === "Atrasada").length} tarefa(s) atrasada(s)
        </div>
      )}

      {/* Unsectioned tasks */}
      {unsectioned.length > 0 && (
        <div>
          {unsectioned.map((t) => (
            <TaskRow key={t.id} task={t} onRefresh={refresh} />
          ))}
        </div>
      )}

      <AddTaskInline section="" onAdd={refresh} />

      {/* Sections */}
      {sections.map((sec) => {
        const secTasks = sectionTasks(sec);
        return (
          <div key={sec}>
            <div className="mb-1 flex items-center gap-2 border-b pb-1.5">
              <h3 className="text-sm font-bold text-[var(--nu-ink)]">{sec}</h3>
              <span className="text-xs text-[var(--nu-muted)]">{secTasks.length}</span>
            </div>
            {secTasks.map((t) => (
              <TaskRow key={t.id} task={t} onRefresh={refresh} />
            ))}
            <AddTaskInline section={sec} onAdd={refresh} />
          </div>
        );
      })}

      {/* Add section */}
      {addingSection ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            placeholder="Nome da secção"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddSection(); if (e.key === "Escape") setAddingSection(false); }}
            className="rounded-lg border bg-[var(--nu-bg)] px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--nu-accent)]/40"
          />
          <button type="button" onClick={handleAddSection} className="rounded-lg bg-[var(--nu-accent)] px-3 py-1.5 text-xs font-semibold text-white">
            Adicionar
          </button>
          <button type="button" onClick={() => setAddingSection(false)} className="text-xs text-[var(--nu-muted)]">
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 text-xs font-medium text-[var(--nu-muted)] transition hover:text-[var(--nu-accent)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar secção
        </button>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowDone(!showDone)}
            className="flex items-center gap-2 text-xs font-medium text-[var(--nu-muted)] transition hover:text-[var(--nu-ink)]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-3 w-3 transition-transform"
              style={{ transform: showDone ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Concluídas ({done.length})
          </button>
          {showDone && (
            <div className="mt-2">
              {done.map((t) => (
                <TaskRow key={t.id} task={t} onRefresh={refresh} />
              ))}
            </div>
          )}
        </div>
      )}

      {tasks.length === 0 && (
        <div className="py-16 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto h-12 w-12 text-[var(--nu-muted)]/40">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <p className="mt-4 text-sm font-medium text-[var(--nu-ink)]">Tudo limpo!</p>
          <p className="mt-1 text-xs text-[var(--nu-muted)]">Adiciona a tua primeira tarefa acima.</p>
        </div>
      )}
    </div>
  );
}
