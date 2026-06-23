import type { EmotionalCheckIn } from "./types/emotional-checkin";

const PREFIX = "nucleo:v1:checkin:";

export type CheckInKeyValueStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

let storage: CheckInKeyValueStorage | null = null;

/** Configura armazenamento (ex.: AsyncStorage no mobile). */
export function configureCheckInStorage(adapter: CheckInKeyValueStorage): void {
  storage = adapter;
}

export function createBrowserCheckInStorage(): CheckInKeyValueStorage | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    },
  };
}

function getStorage(): CheckInKeyValueStorage | null {
  return storage ?? createBrowserCheckInStorage();
}

export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function storageKeyForDate(dateLocal: string): string {
  return `${PREFIX}${dateLocal}`;
}

export async function loadCheckIn(
  dateLocal: string,
): Promise<EmotionalCheckIn | null> {
  const s = getStorage();
  if (!s) return null;
  try {
    const raw = await s.getItem(storageKeyForDate(dateLocal));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EmotionalCheckIn;
    if (!parsed?.mood || !parsed?.dateLocal) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveCheckIn(entry: EmotionalCheckIn): Promise<void> {
  const s = getStorage();
  if (!s) return;
  await s.setItem(storageKeyForDate(entry.dateLocal), JSON.stringify(entry));
}
