import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { checkDisplayName } from "@/lib/profanity";

// Step 3: the recipient, authenticated via the magic link from /confirm,
// accepts the lot. New members must pick a display name here (validated
// the same way registration does); existing members just accept.
export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Transfers aren't live yet — Supabase hasn't been connected." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const lotId = typeof body?.lotId === "string" ? body.lotId : "";
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : "";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Your confirmation link has expired. Ask the sender to start over." }, { status: 401 });
  }

  const metaLotId = user.user_metadata?.accept_transfer_lot_id as string | undefined;
  const fromOwnerId = user.user_metadata?.transfer_from_owner_id as string | undefined;

  if (!metaLotId || metaLotId !== lotId || !fromOwnerId) {
    return NextResponse.json({ error: "This confirmation link doesn't match a pending transfer." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  const { data: existingMember } = await admin
    .from("members")
    .select("id, is_banned")
    .eq("id", user.id)
    .maybeSingle();

  if (existingMember?.is_banned) {
    return NextResponse.json({ error: "Banned members cannot accept lot transfers." }, { status: 403 });
  }

  if (!existingMember) {
    const nameCheck = checkDisplayName(displayName);
    if (!nameCheck.clean) {
      return NextResponse.json({ error: nameCheck.reason }, { status: 400 });
    }

    const { error: insertError } = await admin
      .from("members")
      .insert({ id: user.id, email: user.email!, display_name: displayName.trim() });
    if (insertError) {
      return NextResponse.json({ error: "Couldn't create your member record." }, { status: 500 });
    }
  }

  // Race-safe: only succeeds if the lot hasn't changed hands (or been
  // delisted) since the owner confirmed the transfer.
  const { data: claimed, error: claimError } = await admin
    .from("lots")
    .update({ owner_id: user.id, claimed_at: new Date().toISOString() })
    .eq("lot_id", lotId)
    .eq("owner_id", fromOwnerId)
    .select("lot_id")
    .maybeSingle();

  if (claimError || !claimed) {
    return NextResponse.json(
      { error: "This lot was already transferred, delisted, or reclaimed since the transfer was confirmed." },
      { status: 409 }
    );
  }

  await admin.from("ownership_transfers").insert({
    lot_id: lotId,
    from_owner_id: fromOwnerId,
    to_owner_id: user.id,
  });

  return NextResponse.json({ ok: true });
}
