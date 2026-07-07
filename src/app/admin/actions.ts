"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/admin";

// Every action re-checks admin authorization itself — this file has no
// public HTTP surface of its own (Server Actions are POSTs Next.js wires up
// automatically), but per Next's security guidance, render-time gating
// (only showing the admin page's forms to admins) isn't a security
// boundary on its own.
async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorized.");
}

/** Bans a member and delists every lot they own — the plan's "nuke" action, member-scoped. */
export async function banMember(memberId: string) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();

  await admin.from("members").update({ is_banned: true }).eq("id", memberId);
  await admin.from("lots").update({ owner_id: null, claimed_at: null }).eq("owner_id", memberId);

  revalidatePath("/admin");
}

export async function unbanMember(memberId: string) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  await admin.from("members").update({ is_banned: false }).eq("id", memberId);
  revalidatePath("/admin");
}

/** Delists a single lot without touching the owner's membership — the plan's "nuke" action, lot-scoped. */
export async function delistLot(lotId: string) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  await admin.from("lots").update({ owner_id: null, claimed_at: null }).eq("lot_id", lotId);
  revalidatePath("/admin");
}

export async function dismissReport(reportId: string) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  await admin.from("reports").update({ status: "dismissed" }).eq("id", reportId);
  revalidatePath("/admin");
}

export async function actionReport(reportId: string) {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  await admin.from("reports").update({ status: "actioned" }).eq("id", reportId);
  revalidatePath("/admin");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
}
