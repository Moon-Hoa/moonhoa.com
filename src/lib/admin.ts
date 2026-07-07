import "server-only";
import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

// Bootstrap-simple admin model: a comma-separated allowlist of emails, not a
// DB role column. Avoids the chicken-and-egg problem of needing DB access
// to grant the first admin — reconsider if this ever needs more than a
// couple of trusted operators.
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/** The current session's user, only if they're an authorized admin. */
export async function getAdminUser() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}
