import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

// Step 2: the owner, now authenticated via the magic link from /initiate,
// confirms the transfer. Recipient email is re-read from their verified
// session metadata, never trusted from the request body.
export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Transfers aren't live yet — Supabase hasn't been connected." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const lotId = typeof body?.lotId === "string" ? body.lotId : "";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Your confirmation link has expired. Please start the transfer again." }, { status: 401 });
  }

  const metaLotId = user.user_metadata?.transfer_lot_id as string | undefined;
  const recipientEmail = user.user_metadata?.transfer_recipient_email as string | undefined;

  if (!metaLotId || metaLotId !== lotId || !recipientEmail) {
    return NextResponse.json({ error: "This confirmation link doesn't match a pending transfer." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: lot } = await admin.from("lots").select("owner_id").eq("lot_id", lotId).maybeSingle();

  if (!lot || lot.owner_id !== user.id) {
    return NextResponse.json({ error: "You no longer own this lot." }, { status: 403 });
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: recipientEmail,
    options: {
      emailRedirectTo: `${request.nextUrl.origin}/auth/callback?next=/lots/${lotId}/transfer/accept`,
      data: { accept_transfer_lot_id: lotId, transfer_from_owner_id: user.id },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, recipientEmail });
}
