import { newId } from "./finance-utils";
import { localDateKey } from "./checkin-storage";
import type {
  Mission,
  MissionPriority,
  MissionStatus,
  MissionStore,
} from "./types/missions";

const STORAGE_KEY = "nucleo:v1:missions";

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

function load(): MissionStore {
  const s = getStorage();
  if (!s) return { version: 1, missions: [] };
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, missions: [] };
    const parsed = JSON.parse(raw) as MissionStore;
    return parsed?.version === 1 ? parsed : { version: 1, missions: [] };
  } catch {
    return { version: 1, missions: [] };
  }
}

function save(store: MissionStore) {
  const s = getStorage();
  if (!s) return;
  s.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function listMissions(): Promise<Mission[]> {
  return load().missions;
}

export async function listActiveMissions(): Promise<Mission[]> {
  return load().missions.filter((m) => m.status !== "done");
}

export async function addMission(input: {
  title: string;
  description?: string;
  assignee?: string;
  priority?: MissionPriority;
  dueDate?: string;
  category?: string;
}): Promise<Mission> {
  const store = load();
  const mission: Mission = {
    id: newId("mis"),
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    assignee: input.assignee?.trim() ?? "",
    priority: input.priority ?? "medium",
    status: "todo",
    dueDate: input.dueDate ?? "",
    category: input.category?.trim() ?? "",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  store.missions.unshift(mission);
  save(store);
  return mission;
}

export async function updateMissionStatus(
  id: string,
  status: MissionStatus,
): Promise<void> {
  const store = load();
  const m = store.missions.find((x) => x.id === id);
  if (!m) return;
  m.status = status;
  m.completedAt = status === "done" ? new Date().toISOString() : null;
  save(store);
}

export async function deleteMission(id: string): Promise<void> {
  const store = load();
  store.missions = store.missions.filter((m) => m.id !== id);
  save(store);
}

