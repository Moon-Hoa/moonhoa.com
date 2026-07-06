import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SupabaseNotConfiguredError, isSupabaseAdminConfigured } from "./config";

/**
 * Service-role client that bypasses RLS. Only for trusted server code that
 * needs to write `members` or run the lot-claim transaction — never expose
 * this to a Route Handler response or import it from client code.
 */
export function createSupabaseAdminClient() {
  if (!isSupabaseAdminConfigured()) throw new SupabaseNotConfiguredError();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
