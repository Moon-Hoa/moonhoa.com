import { createClient } from "@supabase/supabase-js";
import { SupabaseNotConfiguredError, isSupabaseConfigured } from "./config";

/**
 * Anon-key client for public, read-only data (the registry, lot lookups).
 * No cookie/session handling needed — Server Components and cached Route
 * Handlers can create one per call.
 */
export function createSupabasePublicClient() {
  if (!isSupabaseConfigured()) throw new SupabaseNotConfiguredError();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
