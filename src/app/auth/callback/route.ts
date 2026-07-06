import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Where magic links (registration, and later transfer confirmation) land.
// Exchanges the code for a session, then — for a fresh registration —
// creates the member row and runs the race-safe lot claim.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/register?error=missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/register?error=verification_failed`);
  }

  const { user } = data;
  const displayName = (user.user_metadata?.display_name as string | undefined) ?? "Anonymous Homesteader";
  const lotId = user.user_metadata?.lot_id as string | undefined;

  const admin = createSupabaseAdminClient();

  const { data: member, error: memberError } = await admin
    .from("members")
    .upsert({ id: user.id, email: user.email!, display_name: displayName }, { onConflict: "id" })
    .select("id")
    .single();

  if (memberError || !member) {
    return NextResponse.redirect(`${origin}/register?error=member_creation_failed`);
  }

  if (!lotId) {
    return NextResponse.redirect(`${origin}/register/success`);
  }

  // Race-safe claim: only succeeds if nobody else claimed this lot between
  // registration and email verification.
  const { data: claimed, error: claimError } = await admin
    .from("lots")
    .update({ owner_id: member.id, claimed_at: new Date().toISOString() })
    .eq("lot_id", lotId)
    .is("owner_id", null)
    .select("lot_id")
    .maybeSingle();

  if (claimError || !claimed) {
    // Membership is still valid — just without the originally chosen lot.
    return NextResponse.redirect(`${origin}/register?error=lot_taken`);
  }

  return NextResponse.redirect(`${origin}/register/success?lot=${claimed.lot_id}`);
}
