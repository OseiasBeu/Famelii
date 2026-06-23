import { newId } from "./finance-utils";
import type {
  Family,
  FamilyMember,
  FamilyStore,
  MemberRole,
} from "./types/family";

const STORAGE_KEY = "famelii:v1:family";

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

function empty(): FamilyStore {
  return { version: 1, family: null, members: [] };
}

function load(): FamilyStore {
  const s = getStorage();
  if (!s) return empty();
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as FamilyStore;
    return parsed?.version === 1 ? parsed : empty();
  } catch {
    return empty();
  }
}

function save(store: FamilyStore) {
  const s = getStorage();
  if (!s) return;
  s.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function getFamily(): Promise<Family | null> {
  return load().family;
}

export async function createFamily(name: string): Promise<Family> {
  const store = load();
  const family: Family = {
    id: newId("fam"),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  store.family = family;
  save(store);
  return family;
}

export async function updateFamilyName(name: string): Promise<void> {
  const store = load();
  if (store.family) {
    store.family.name = name.trim();
    save(store);
  }
}

export async function listMembers(): Promise<FamilyMember[]> {
  return load().members;
}

export async function getMember(id: string): Promise<FamilyMember | null> {
  return load().members.find((m) => m.id === id) ?? null;
}

export async function addMember(input: {
  name: string;
  role: MemberRole;
  birthDate?: string;
  avatar?: string;
  color?: string;
}): Promise<FamilyMember> {
  const store = load();
  const member: FamilyMember = {
    id: newId("mbr"),
    name: input.name.trim(),
    role: input.role,
    birthDate: input.birthDate ?? "",
    avatar: input.avatar ?? "🧑",
    color: input.color ?? "#3b82f6",
    createdAt: new Date().toISOString(),
  };
  store.members.push(member);
  save(store);
  return member;
}

export async function updateMember(
  id: string,
  patch: Partial<Pick<FamilyMember, "name" | "role" | "birthDate" | "avatar" | "color">>,
): Promise<void> {
  const store = load();
  const m = store.members.find((x) => x.id === id);
  if (!m) return;
  Object.assign(m, patch);
  save(store);
}

export async function removeMember(id: string): Promise<void> {
  const store = load();
  store.members = store.members.filter((m) => m.id !== id);
  save(store);
}

export async function isFamilySetup(): Promise<boolean> {
  const store = load();
  return store.family !== null && store.members.length > 0;
}

export async function getMemberNames(): Promise<string[]> {
  return load().members.map((m) => m.name);
}
