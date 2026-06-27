"use client";

import { db, hasDb } from "@/lib/supabase/db";
import {
  listTasks as listLocal,
  listSections as listLocalSections,
  addSection as addLocalSection,
  addTask as addLocal,
  updateTask as updateLocal,
  toggleTask as toggleLocal,
  deleteTask as deleteLocal,
  type FamilyTask,
  type TaskPriority,
} from "@famelii/core";

export async function listTasks(familyId?: string): Promise<FamilyTask[]> {
  if (!hasDb() || !familyId) return listLocal();
  const { data } = await db()!
    .from("tasks")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });
  if (!data) return [];
  return data.map(mapTask);
}

export async function listSections(familyId?: string): Promise<string[]> {
  if (!hasDb() || !familyId) return listLocalSections();
  const { data } = await db()!
    .from("task_sections")
    .select("label")
    .eq("family_id", familyId)
    .order("sort_order");
  return data?.map((r) => r.label as string) ?? [];
}

export async function addSection(label: string, familyId?: string): Promise<void> {
  if (!hasDb() || !familyId) return addLocalSection(label);
  await db()!.from("task_sections").upsert(
    { family_id: familyId, label: label.trim() },
    { onConflict: "family_id,label" },
  );
}

export async function addTask(input: {
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: TaskPriority;
  section?: string;
}, familyId?: string): Promise<FamilyTask> {
  if (!hasDb() || !familyId) return addLocal(input);
  const { data, error } = await db()!
    .from("tasks")
    .insert({
      family_id: familyId,
      title: input.title.trim(),
      description: input.description?.trim() ?? "",
      priority: input.priority ?? 4,
      due_date: input.dueDate || null,
      section: input.section?.trim() ?? "",
    })
    .select()
    .single();
  if (error || !data) return addLocal(input);
  return mapTask(data);
}

export async function updateTask(
  id: string,
  patch: Partial<Pick<FamilyTask, "title" | "description" | "assignee" | "dueDate" | "priority" | "section">>,
): Promise<void> {
  if (!hasDb()) return updateLocal(id, patch);
  const dbPatch: Record<string, unknown> = {};
  if (patch.title !== undefined) dbPatch.title = patch.title;
  if (patch.description !== undefined) dbPatch.description = patch.description;
  if (patch.priority !== undefined) dbPatch.priority = patch.priority;
  if (patch.dueDate !== undefined) dbPatch.due_date = patch.dueDate || null;
  if (patch.section !== undefined) dbPatch.section = patch.section;
  await db()!.from("tasks").update(dbPatch).eq("id", id);
}

export async function toggleTask(id: string): Promise<void> {
  if (!hasDb()) return toggleLocal(id);
  const { data } = await db()!.from("tasks").select("done").eq("id", id).single();
  if (!data) return;
  const done = !data.done;
  await db()!.from("tasks").update({
    done,
    completed_at: done ? new Date().toISOString() : null,
  }).eq("id", id);
}

export async function deleteTask(id: string): Promise<void> {
  if (!hasDb()) return deleteLocal(id);
  await db()!.from("tasks").delete().eq("id", id);
}

function mapTask(row: Record<string, unknown>): FamilyTask {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    assignee: "",
    done: (row.done as boolean) ?? false,
    priority: (row.priority as TaskPriority) ?? 4,
    dueDate: (row.due_date as string) ?? "",
    section: (row.section as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
    completedAt: (row.completed_at as string) ?? null,
  };
}
