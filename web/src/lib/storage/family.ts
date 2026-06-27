"use client";

import { db, hasDb } from "@/lib/supabase/db";
import {
  getFamily as getLocalFamily,
  createFamily as createLocalFamily,
  updateFamilyName as updateLocalFamilyName,
  listMembers as listLocalMembers,
  addMember as addLocalMember,
  updateMember as updateLocalMember,
  removeMember as removeLocalMember,
  isFamilySetup as isLocalFamilySetup,
  getMemberNames as getLocalMemberNames,
  type Family,
  type FamilyMember,
  type MemberRole,
} from "@famelii/core";

export async function getFamily(): Promise<Family | null> {
  // Check local first — Supabase needs auth to work with RLS
  const local = await getLocalFamily();
  if (local) return local;
  if (!hasDb()) return null;
  const { data } = await db()!.from("families").select("*").limit(1).single();
  if (!data) return null;
  return { id: data.id, name: data.name, createdAt: data.created_at };
}

export async function createFamily(name: string): Promise<Family> {
  if (!hasDb()) return createLocalFamily(name);
  const supabase = db()!;
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("families")
    .insert({ name: name.trim(), created_by: user?.id ?? null })
    .select()
    .single();
  if (error || !data) return createLocalFamily(name);
  return { id: data.id, name: data.name, createdAt: data.created_at };
}

export async function updateFamilyName(name: string): Promise<void> {
  if (!hasDb()) return updateLocalFamilyName(name);
  const family = await getFamily();
  if (!family) return;
  await db()!.from("families").update({ name: name.trim() }).eq("id", family.id);
}

export async function listMembers(): Promise<FamilyMember[]> {
  const local = await listLocalMembers();
  if (local.length > 0) return local;
  if (!hasDb()) return [];
  const family = await getFamily();
  if (!family) return [];
  const { data } = await db()!
    .from("family_members")
    .select("*")
    .eq("family_id", family.id)
    .order("created_at");
  if (!data) return [];
  return data.map(mapMember);
}

export async function addMember(input: {
  name: string;
  role: MemberRole;
  birthDate?: string;
  avatar?: string;
  color?: string;
}): Promise<FamilyMember> {
  if (!hasDb()) return addLocalMember(input);
  const family = await getFamily();
  if (!family) return addLocalMember(input);
  const { data, error } = await db()!
    .from("family_members")
    .insert({
      family_id: family.id,
      name: input.name.trim(),
      role: input.role,
      birth_date: input.birthDate || null,
      avatar: input.avatar ?? "🧑",
      color: input.color ?? "#3b82f6",
    })
    .select()
    .single();
  if (error || !data) return addLocalMember(input);
  return mapMember(data);
}

export async function updateMember(
  id: string,
  patch: Partial<Pick<FamilyMember, "name" | "role" | "birthDate" | "avatar" | "color">>,
): Promise<void> {
  if (!hasDb()) return updateLocalMember(id, patch);
  const dbPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.role !== undefined) dbPatch.role = patch.role;
  if (patch.birthDate !== undefined) dbPatch.birth_date = patch.birthDate || null;
  if (patch.avatar !== undefined) dbPatch.avatar = patch.avatar;
  if (patch.color !== undefined) dbPatch.color = patch.color;
  await db()!.from("family_members").update(dbPatch).eq("id", id);
}

export async function removeMember(id: string): Promise<void> {
  if (!hasDb()) return removeLocalMember(id);
  await db()!.from("family_members").delete().eq("id", id);
}

export async function isFamilySetup(): Promise<boolean> {
  // Always check localStorage first — auth may not be configured yet
  const localOk = await isLocalFamilySetup();
  if (localOk) return true;
  if (!hasDb()) return false;
  const family = await getFamily();
  if (!family) return false;
  const { count } = await db()!
    .from("family_members")
    .select("*", { count: "exact", head: true })
    .eq("family_id", family.id);
  return (count ?? 0) > 0;
}

export async function getMemberNames(): Promise<string[]> {
  if (!hasDb()) return getLocalMemberNames();
  const members = await listMembers();
  return members.map((m) => m.name);
}

function mapMember(row: Record<string, unknown>): FamilyMember {
  return {
    id: row.id as string,
    name: row.name as string,
    role: row.role as MemberRole,
    birthDate: (row.birth_date as string) ?? "",
    avatar: (row.avatar as string) ?? "🧑",
    color: (row.color as string) ?? "#3b82f6",
    createdAt: (row.created_at as string) ?? "",
  };
}
