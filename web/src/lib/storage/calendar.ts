"use client";

import { db, hasDb } from "@/lib/supabase/db";
import {
  listEventsForMonth as listLocal,
  addEvent as addLocal,
  deleteEvent as deleteLocal,
  type CalendarEvent,
  type EventCategory,
} from "@famelii/core";

export { getDaysInMonth, getFirstDayOfWeek } from "@famelii/core";

export async function listEventsForMonth(year: number, month: number, familyId?: string): Promise<CalendarEvent[]> {
  if (!hasDb() || !familyId) return listLocal(year, month);
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = month === 12
    ? `${year + 1}-01-01`
    : `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const { data } = await db()!
    .from("calendar_events")
    .select("*")
    .eq("family_id", familyId)
    .gte("date_local", startDate)
    .lt("date_local", endDate)
    .order("date_local")
    .order("time_start");
  if (!data) return [];
  return data.map(mapEvent);
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
}, familyId?: string): Promise<CalendarEvent> {
  if (!hasDb() || !familyId) return addLocal(input);
  const { data, error } = await db()!
    .from("calendar_events")
    .insert({
      family_id: familyId,
      title: input.title.trim(),
      description: input.description?.trim() ?? "",
      date_local: input.dateLocal,
      time_start: input.timeStart || null,
      time_end: input.timeEnd || null,
      category: input.category,
      recurring: input.recurring ?? "none",
    })
    .select()
    .single();
  if (error || !data) return addLocal(input);
  return mapEvent(data);
}

export async function deleteEvent(id: string): Promise<void> {
  if (!hasDb()) return deleteLocal(id);
  await db()!.from("calendar_events").delete().eq("id", id);
}

function mapEvent(row: Record<string, unknown>): CalendarEvent {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    dateLocal: row.date_local as string,
    timeStart: (row.time_start as string) ?? "",
    timeEnd: (row.time_end as string) ?? "",
    category: row.category as EventCategory,
    assignee: "",
    recurring: (row.recurring as CalendarEvent["recurring"]) ?? "none",
    createdAt: (row.created_at as string) ?? "",
  };
}
