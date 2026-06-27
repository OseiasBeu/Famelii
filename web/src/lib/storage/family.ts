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

async function getAuthUser() {
  if (!hasDb()) return null;
  const { data: { user } } = await db()!.auth.getUser();
  return user;
}

export async function getFamily(): Promise<Family | null> {
  const user = await getAuthUser();

  if (user && hasDb()) {
    // 1. Check if user created a family
    const { data: owned } = await db()!
      .from("families")
      .select("*")
      .eq("created_by", user.id)
      .limit(1)
      .maybeSingle();
    if (owned) return { id: owned.id, name: owned.name, createdAt: owned.created_at };

    // 2. Check if user is a member of a family (linked by user_id)
    const { data: membership } = await db()!
      .from("family_members")
      .select("family_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    if (membership) {
      const { data: fam } = await db()!
        .from("families")
        .select("*")
        .eq("id", membership.family_id)
        .single();
      if (fam) return { id: fam.id, name: fam.name, createdAt: fam.created_at };
    }

    // 3. Check if there's a family member with the user's email (invited)
    if (user.email) {
      const { data: byEmail } = await db()!
        .from("family_members")
        .select("id, family_id")
        .eq("email", user.email)
        .limit(1)
        .maybeSingle();
      if (byEmail) {
        // Auto-link this user to the member
        await db()!.from("family_members").update({ user_id: user.id }).eq("id", byEmail.id);
        const { data: fam } = await db()!
          .from("families")
          .select("*")
          .eq("id", byEmail.family_id)
          .single();
        if (fam) return { id: fam.id, name: fam.name, createdAt: fam.created_at };
      }
    }
  }

  // Fallback to localStorage
  return getLocalFamily();
}

export async function createFamily(name: string): Promise<Family> {
  const user = await getAuthUser();

  if (user && hasDb()) {
    const { data, error } = await db()!
      .from("families")
      .insert({ name: name.trim(), created_by: user.id })
      .select()
      .single();
    if (!error && data) {
      return { id: data.id, name: data.name, createdAt: data.created_at };
    }
  }

  return createLocalFamily(name);
}

export async function deleteFamily(): Promise<void> {
  const user = await getAuthUser();
  if (user && hasDb()) {
    const family = await getFamily();
    if (family) {
      await db()!.from("families").delete().eq("id", family.id);
    }
  }
}

export async function updateFamilyName(name: string): Promise<void> {
  if (!hasDb()) return updateLocalFamilyName(name);
  const family = await getFamily();
  if (!family) return;
  await db()!.from("families").update({ name: name.trim() }).eq("id", family.id);
}

export async function listMembers(): Promise<FamilyMember[]> {
  const user = await getAuthUser();

  if (user && hasDb()) {
    const family = await getFamily();
    if (family) {
      const { data } = await db()!
        .from("family_members")
        .select("*")
        .eq("family_id", family.id)
        .order("created_at");
      if (data && data.length > 0) return data.map(mapMember);
    }
  }

  return listLocalMembers();
}

export async function addMember(input: {
  name: string;
  role: MemberRole;
  birthDate?: string;
  avatar?: string;
  color?: string;
  email?: string;
  linkUser?: boolean;
}): Promise<FamilyMember> {
  const user = await getAuthUser();

  if (user && hasDb()) {
    const family = await getFamily();
    if (family) {
      const { data, error } = await db()!
        .from("family_members")
        .insert({
          family_id: family.id,
          name: input.name.trim(),
          role: input.role,
          birth_date: input.birthDate || null,
          avatar: input.avatar ?? "🧑",
          color: input.color ?? "#3b82f6",
          email: input.email?.trim() || (input.linkUser ? user.email : null),
          user_id: input.linkUser ? user.id : null,
        })
        .select()
        .single();
      if (!error && data) return mapMember(data);
    }
  }

  return addLocalMember(input);
}

export async function linkCurrentUserToMember(memberId: string): Promise<void> {
  const user = await getAuthUser();
  if (!user || !hasDb()) return;
  await db()!.from("family_members").update({ user_id: user.id }).eq("id", memberId);
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
  const user = await getAuthUser();

  if (user && hasDb()) {
    const family = await getFamily();
    if (family) {
      const { count } = await db()!
        .from("family_members")
        .select("*", { count: "exact", head: true })
        .eq("family_id", family.id);
      return (count ?? 0) > 0;
    }
    return false;
  }

  return isLocalFamilySetup();
}

export async function getMemberNames(): Promise<string[]> {
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
