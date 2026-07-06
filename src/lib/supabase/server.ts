import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseNotConfiguredError, isSupabaseConfigured } from "./config";

/**
 * Anon-key client bound to the current request's cookies. Use this in Route
 * Handlers / Server Actions for anything auth-related (signInWithOtp,
 * exchangeCodeForSession) so the resulting session cookie gets written to
 * the response. Server Components can also read from it, but can't write
 * cookies — the `setAll` below no-ops there instead of throwing.
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) throw new SupabaseNotConfiguredError();

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, which can't set cookies.
            // Fine here: nothing in this app currently depends on a
            // Server Component refreshing the session — every auth-writing
            // call happens in a Route Handler.
          }
        },
      },
    }
  );
}
