import { createClient } from "./client";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null | undefined;

export function db(): SupabaseClient | null {
  if (_client === undefined) {
    _client = createClient();
  }
  return _client;
}

export function hasDb(): boolean {
  return db() !== null;
}
