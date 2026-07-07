import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Only allow relative, same-site redirects — `next` is attacker-controlled
// query input reflected straight into a redirect.
function safeNext(next: string | null): string | null {
  if (!next) return null;
  return next.startsWith("/") && !next.startsWith("//") ? next : null;
}

// Where every magic link lands (registration, and plain sign-in flows like
// admin). With no `next` param, this runs the full registration completion:
// creates the member row and runs the race-safe lot claim. With a `next`
// param (e.g. `?next=/admin`), it's a plain sign-in — no member/lot side
// effects, just redirect once the session is established.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}${next ?? "/register"}?error=missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}${next ?? "/register"}?error=verification_failed`);
  }

  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
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
