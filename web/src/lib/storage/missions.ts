"use client";

import { db, hasDb } from "@/lib/supabase/db";
import {
  listMissions as listLocal,
  addMission as addLocal,
  updateMissionStatus as updateLocal,
  deleteMission as deleteLocal,
  type Mission,
  type MissionPriority,
  type MissionStatus,
} from "@famelii/core";

export async function listMissions(familyId?: string): Promise<Mission[]> {
  if (!hasDb() || !familyId) return listLocal();
  const { data } = await db()!
    .from("missions")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });
  if (!data) return [];
  return data.map(mapMission);
}

export async function addMission(input: {
  title: string;
  description?: string;
  assignee?: string;
  priority?: MissionPriority;
  dueDate?: string;
  category?: string;
}, familyId?: string): Promise<Mission> {
  if (!hasDb() || !familyId) return addLocal(input);
  const { data, error } = await db()!
    .from("missions")
    .insert({
      family_id: familyId,
      title: input.title.trim(),
      description: input.description?.trim() ?? "",
      priority: input.priority ?? "medium",
      status: "todo",
      due_date: input.dueDate || null,
      category: input.category?.trim() ?? "",
    })
    .select()
    .single();
  if (error || !data) return addLocal(input);
  return mapMission(data);
}

export async function updateMissionStatus(id: string, status: MissionStatus): Promise<void> {
  if (!hasDb()) return updateLocal(id, status);
  await db()!.from("missions").update({
    status,
    completed_at: status === "done" ? new Date().toISOString() : null,
  }).eq("id", id);
}

export async function deleteMission(id: string): Promise<void> {
  if (!hasDb()) return deleteLocal(id);
  await db()!.from("missions").delete().eq("id", id);
}

function mapMission(row: Record<string, unknown>): Mission {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    assignee: "",
    priority: (row.priority as MissionPriority) ?? "medium",
    status: (row.status as MissionStatus) ?? "todo",
    dueDate: (row.due_date as string) ?? "",
    category: (row.category as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
    completedAt: (row.completed_at as string) ?? null,
  };
}
