"use client";

import { db, hasDb } from "@/lib/supabase/db";
import {
  loadCheckIn as loadLocal,
  saveCheckIn as saveLocal,
  type EmotionalCheckIn,
} from "@famelii/core";

export async function loadCheckIn(dateLocal: string, memberId?: string): Promise<EmotionalCheckIn | null> {
  if (!hasDb() || !memberId) return loadLocal(dateLocal);
  const { data } = await db()!
    .from("check_ins")
    .select("*")
    .eq("member_id", memberId)
    .eq("date_local", dateLocal)
    .single();
  if (!data) return null;
  return {
    dateLocal: data.date_local,
    mood: data.mood,
    note: data.note ?? "",
    privacy: data.privacy,
    updatedAt: data.updated_at,
  };
}

export async function saveCheckIn(entry: EmotionalCheckIn, memberId?: string, familyId?: string): Promise<void> {
  if (!hasDb() || !memberId || !familyId) return saveLocal(entry);
  await db()!.from("check_ins").upsert({
    family_id: familyId,
    member_id: memberId,
    date_local: entry.dateLocal,
    mood: entry.mood,
    note: entry.note,
    privacy: entry.privacy,
    updated_at: new Date().toISOString(),
  }, { onConflict: "member_id,date_local" });
}
