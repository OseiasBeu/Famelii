import { newId } from "./finance-utils";
import { localDateKey } from "./checkin-storage";
import type {
  CalendarEvent,
  CalendarStore,
  EventCategory,
} from "./types/calendar";

const STORAGE_KEY = "nucleo:v1:calendar";

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

function load(): CalendarStore {
  const s = getStorage();
  if (!s) return { version: 1, events: [] };
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, events: [] };
    const parsed = JSON.parse(raw) as CalendarStore;
    return parsed?.version === 1 ? parsed : { version: 1, events: [] };
  } catch {
    return { version: 1, events: [] };
  }
}

function save(store: CalendarStore) {
  const s = getStorage();
  if (!s) return;
  s.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function listEvents(): Promise<CalendarEvent[]> {
  return load().events;
}

export async function listEventsForMonth(
  year: number,
  month: number,
): Promise<CalendarEvent[]> {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return load().events.filter((e) => e.dateLocal.startsWith(prefix));
}

export async function listEventsForDate(
  dateLocal: string,
): Promise<CalendarEvent[]> {
  return load().events.filter((e) => e.dateLocal === dateLocal);
}

export async function addEvent(input: {
  title: string;
  description?: string;
  dateLocal: string;
  timeStart?: string;
  timeEnd?: string;
  category: EventCategory;
  assignee?: string;
  recurring?: CalendarEvent["recurring"];
}): Promise<CalendarEvent> {
  const store = load();
  const event: CalendarEvent = {
    id: newId("evt"),
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    dateLocal: input.dateLocal,
    timeStart: input.timeStart ?? "",
    timeEnd: input.timeEnd ?? "",
    category: input.category,
    assignee: input.assignee?.trim() ?? "",
    recurring: input.recurring ?? "none",
    createdAt: new Date().toISOString(),
  };
  store.events.push(event);
  store.events.sort((a, b) => {
    const d = a.dateLocal.localeCompare(b.dateLocal);
    return d !== 0 ? d : a.timeStart.localeCompare(b.timeStart);
  });
  save(store);
  return event;
}

export async function deleteEvent(id: string): Promise<void> {
  const store = load();
  store.events = store.events.filter((e) => e.id !== id);
  save(store);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

