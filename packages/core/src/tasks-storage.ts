import { newId } from "./finance-utils";
import type { FamilyTask, TaskPriority, TaskStore } from "./types/tasks";

const STORAGE_KEY = "nucleo:v1:tasks";

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

function empty(): TaskStore {
  return { version: 1, tasks: [], sections: [] };
}

function load(): TaskStore {
  const s = getStorage();
  if (!s) return empty();
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as TaskStore;
    if (parsed?.version !== 1) return empty();
    return {
      ...parsed,
      tasks: (parsed.tasks ?? []).map((t) => ({
        ...t,
        description: t.description ?? "",
        priority: t.priority ?? 4,
        section: t.section ?? "",
        completedAt: t.completedAt ?? null,
      })),
      sections: parsed.sections ?? [],
    };
  } catch {
    return empty();
  }
}

function save(store: TaskStore) {
  const s = getStorage();
  if (!s) return;
  s.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function listTasks(): Promise<FamilyTask[]> {
  return load().tasks;
}

export async function listSections(): Promise<string[]> {
  return load().sections;
}

export async function addSection(label: string): Promise<void> {
  const store = load();
  const trimmed = label.trim();
  if (!trimmed || store.sections.includes(trimmed)) return;
  store.sections.push(trimmed);
  save(store);
}

export async function removeSection(label: string): Promise<void> {
  const store = load();
  store.sections = store.sections.filter((s) => s !== label);
  store.tasks = store.tasks.map((t) =>
    t.section === label ? { ...t, section: "" } : t,
  );
  save(store);
}

export async function addTask(input: {
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: TaskPriority;
  section?: string;
}): Promise<FamilyTask> {
  const store = load();
  const task: FamilyTask = {
    id: newId("task"),
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    assignee: input.assignee?.trim() ?? "",
    done: false,
    priority: input.priority ?? 4,
    dueDate: input.dueDate ?? "",
    section: input.section?.trim() ?? "",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  store.tasks.unshift(task);
  save(store);
  return task;
}

export async function updateTask(
  id: string,
  patch: Partial<Pick<FamilyTask, "title" | "description" | "assignee" | "dueDate" | "priority" | "section">>,
): Promise<void> {
  const store = load();
  const t = store.tasks.find((x) => x.id === id);
  if (!t) return;
  Object.assign(t, patch);
  save(store);
}

export async function toggleTask(id: string): Promise<void> {
  const store = load();
  const t = store.tasks.find((x) => x.id === id);
  if (!t) return;
  t.done = !t.done;
  t.completedAt = t.done ? new Date().toISOString() : null;
  save(store);
}

export async function deleteTask(id: string): Promise<void> {
  const store = load();
  store.tasks = store.tasks.filter((t) => t.id !== id);
  save(store);
}
