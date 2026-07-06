// Supabase isn't provisioned yet (no live project — see repo README). Every
// call site that needs it checks this first and fails soft (a clear error
// message) instead of throwing an opaque "fetch failed" deep in a request.
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase isn't configured yet. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY (see README) once a project exists."
    );
    this.name = "SupabaseNotConfiguredError";
  }
}
