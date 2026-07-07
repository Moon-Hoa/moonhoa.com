import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { cellsForLotId } from "@/lib/lots";

const MAX_REASON_LENGTH = 500;

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Reporting isn't live yet — Supabase hasn't been connected." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const lotId = typeof body?.lotId === "string" ? body.lotId : "";
  const reason =
    typeof body?.reason === "string" && body.reason.trim()
      ? body.reason.trim().slice(0, MAX_REASON_LENGTH)
      : null;

  try {
    cellsForLotId(lotId);
  } catch {
    return NextResponse.json({ error: "Invalid lot code." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  const { data: lot } = await admin.from("lots").select("lot_id").eq("lot_id", lotId).maybeSingle();
  if (!lot) {
    return NextResponse.json({ error: "That lot doesn't exist." }, { status: 404 });
  }

  const { error } = await admin.from("reports").insert({ lot_id: lotId, reason });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
