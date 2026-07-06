import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";

// Revalidate at most every 45s per the plan's "ISR, revalidate 30-60s" call
// for the public registry.
export const revalidate = 45;

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(0, Number(searchParams.get("page") ?? 0) || 0);
  // Strip characters that would break PostgREST's `.or()` filter syntax.
  const search = (searchParams.get("search") ?? "").trim().replace(/[,()]/g, "");

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      entries: [],
      page,
      pageSize: PAGE_SIZE,
      hasMore: false,
      configured: false,
    });
  }

  const supabase = createSupabasePublicClient();
  let query = supabase
    .from("lot_registry")
    .select("lot_id, claimed_at, owner_display_name", { count: "exact" })
    .order("claimed_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (search) {
    query = query.or(`lot_id.ilike.%${search}%,owner_display_name.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    entries: data,
    page,
    pageSize: PAGE_SIZE,
    hasMore: count !== null ? (page + 1) * PAGE_SIZE < count : false,
    configured: true,
  });
}
