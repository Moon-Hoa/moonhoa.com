import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { cellsForLotId } from "@/lib/lots";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Step 1 of the transfer handshake: a visitor on /lots/[lotId] names a
// recipient. We never trust a claimed "I am the owner" email typed into a
// form — instead we look up the real owner's email server-side and send
// *them* the confirmation link, so only someone who actually controls that
// inbox can move the transfer forward.
export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Transfers aren't live yet — Supabase hasn't been connected." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const lotId = typeof body?.lotId === "string" ? body.lotId : "";
  const recipientEmail = typeof body?.recipientEmail === "string" ? body.recipientEmail.trim() : "";

  try {
    cellsForLotId(lotId);
  } catch {
    return NextResponse.json({ error: "Invalid lot code." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(recipientEmail)) {
    return NextResponse.json({ error: "Please enter a valid recipient email." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  const { data: lot } = await admin.from("lots").select("owner_id").eq("lot_id", lotId).maybeSingle();
  if (!lot?.owner_id) {
    return NextResponse.json({ error: "This lot is unclaimed and has no owner to transfer from." }, { status: 400 });
  }

  const { data: owner } = await admin
    .from("members")
    .select("email, is_banned")
    .eq("id", lot.owner_id)
    .maybeSingle();
  if (!owner) {
    return NextResponse.json({ error: "Couldn't find the current owner's record." }, { status: 500 });
  }

  if (recipientEmail.toLowerCase() === owner.email.toLowerCase()) {
    return NextResponse.json({ error: "That's already the current owner." }, { status: 400 });
  }

  const { data: recipientMember } = await admin
    .from("members")
    .select("is_banned")
    .eq("email", recipientEmail)
    .maybeSingle();
  if (recipientMember?.is_banned) {
    return NextResponse.json({ error: "That member has been banned and cannot receive lots." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: owner.email,
    options: {
      emailRedirectTo: `${request.nextUrl.origin}/auth/callback?next=/lots/${lotId}/transfer/confirm`,
      data: { transfer_lot_id: lotId, transfer_recipient_email: recipientEmail },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
