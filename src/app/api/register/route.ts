import { NextRequest, NextResponse } from "next/server";
import { checkDisplayName } from "@/lib/profanity";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { cellsForLotId } from "@/lib/lots";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "Registration isn't live yet — Supabase hasn't been connected. Try again once the site's off the ground.",
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { displayName, email, lotId, turnstileToken } = body as Record<string, unknown>;

  if (
    typeof displayName !== "string" ||
    typeof email !== "string" ||
    typeof lotId !== "string" ||
    typeof turnstileToken !== "string"
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const nameCheck = checkDisplayName(displayName);
  if (!nameCheck.clean) {
    return NextResponse.json({ error: nameCheck.reason }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  try {
    cellsForLotId(lotId);
  } catch {
    return NextResponse.json({ error: "Invalid lot code." }, { status: 400 });
  }

  const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const turnstileOk = await verifyTurnstileToken(turnstileToken, remoteIp);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Verification challenge failed. Please try again." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Optimistic pre-check so we don't send a magic link for an already-gone
  // lot. Not the safety guarantee itself — that's the race-safe UPDATE in
  // /auth/callback at actual claim time.
  const { data: lot, error: lotError } = await admin
    .from("lots")
    .select("owner_id")
    .eq("lot_id", lotId)
    .maybeSingle();

  if (lotError) {
    return NextResponse.json({ error: "Couldn't look up that lot." }, { status: 500 });
  }
  if (!lot) {
    return NextResponse.json({ error: "That lot doesn't exist." }, { status: 404 });
  }
  if (lot.owner_id) {
    return NextResponse.json({ error: "That lot has already been claimed." }, { status: 409 });
  }

  const supabase = await createSupabaseServerClient();
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
      data: { display_name: displayName.trim(), lot_id: lotId },
    },
  });

  if (otpError) {
    return NextResponse.json({ error: otpError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
