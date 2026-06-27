"use client";

import { db, hasDb } from "@/lib/supabase/db";
import {
  listHearts as listLocal,
  addHeart as addLocal,
  deleteHeart as deleteLocal,
  type Heart,
} from "@famelii/core";
import { localDateKey } from "@famelii/core";

export async function listHearts(familyId?: string): Promise<Heart[]> {
  if (!hasDb() || !familyId) return listLocal();
  const { data } = await db()!
    .from("hearts")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });
  if (!data) return [];
  return data.map(mapHeart);
}

export async function addHeart(input: {
  from: string;
  to: string;
  message: string;
  emoji?: string;
}, familyId?: string): Promise<Heart> {
  if (!hasDb() || !familyId) return addLocal(input);
  const { data, error } = await db()!
    .from("hearts")
    .insert({
      family_id: familyId,
      from_member_id: input.from,
      to_member_id: input.to,
      message: input.message.trim(),
      emoji: input.emoji ?? "❤️",
      date_local: localDateKey(),
    })
    .select()
    .single();
  if (error || !data) return addLocal(input);
  return mapHeart(data);
}

export async function deleteHeart(id: string): Promise<void> {
  if (!hasDb()) return deleteLocal(id);
  await db()!.from("hearts").delete().eq("id", id);
}

function mapHeart(row: Record<string, unknown>): Heart {
  return {
    id: row.id as string,
    from: (row.from_member_id as string) ?? "",
    to: (row.to_member_id as string) ?? "",
    message: (row.message as string) ?? "",
    emoji: (row.emoji as string) ?? "❤️",
    dateLocal: (row.date_local as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
  };
}
