import { newId } from "./finance-utils";
import { localDateKey } from "./checkin-storage";
import type { Heart, HeartsStore } from "./types/hearts";

const STORAGE_KEY = "nucleo:v1:hearts";

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

function load(): HeartsStore {
  const s = getStorage();
  if (!s) return { version: 1, hearts: [] };
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, hearts: [] };
    const parsed = JSON.parse(raw) as HeartsStore;
    return parsed?.version === 1 ? parsed : { version: 1, hearts: [] };
  } catch {
    return { version: 1, hearts: [] };
  }
}

function save(store: HeartsStore) {
  const s = getStorage();
  if (!s) return;
  s.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function listHearts(): Promise<Heart[]> {
  return load().hearts;
}

export async function addHeart(input: {
  from: string;
  to: string;
  message: string;
  emoji?: string;
}): Promise<Heart> {
  const store = load();
  const heart: Heart = {
    id: newId("heart"),
    from: input.from.trim(),
    to: input.to.trim(),
    message: input.message.trim(),
    emoji: input.emoji ?? "❤️",
    dateLocal: localDateKey(),
    createdAt: new Date().toISOString(),
  };
  store.hearts.unshift(heart);
  save(store);
  return heart;
}

export async function deleteHeart(id: string): Promise<void> {
  const store = load();
  store.hearts = store.hearts.filter((h) => h.id !== id);
  save(store);
}
