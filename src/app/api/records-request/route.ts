import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

function generateTicketId() {
  const id = Math.floor(10000 + Math.random() * 89999);
  return `LRA-514-${id}`;
}

export async function POST(request: NextRequest) {
  const ticketId = generateTicketId();

  // Degrades gracefully to a client-only ticket if Supabase (or the
  // Phase 9.5 records_requests table specifically) isn't available yet —
  // §15.4 processing is a black box either way from the resident's side.
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ ticketId, persisted: false });
  }

  const body = await request.json().catch(() => null);
  const requestType = typeof body?.requestType === "string" ? body.requestType.slice(0, 100) : "general";
  const lotId = typeof body?.lotId === "string" && body.lotId.trim() ? body.lotId.trim() : null;

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("records_requests")
    .insert({ ticket_id: ticketId, lot_id: lotId, request_type: requestType });

  return NextResponse.json({ ticketId, persisted: !error });
}
