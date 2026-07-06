import { NextRequest, NextResponse } from "next/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateGridCells, lotIdForCell, LOT_GRID } from "@/lib/lots";

const PAGE_SIZE = 24;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(0, Number(searchParams.get("page") ?? 0) || 0);
  const search = (searchParams.get("search") ?? "").trim().toUpperCase();

  if (isSupabaseAdminConfigured()) {
    const supabase = createSupabaseAdminClient();
    let query = supabase
      .from("lots")
      .select("lot_id, lat_cell, lon_cell", { count: "exact" })
      .is("owner_id", null)
      .order("lot_id")
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (search) query = query.ilike("lot_id", `%${search}%`);

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      lots: data,
      page,
      pageSize: PAGE_SIZE,
      hasMore: count !== null ? (page + 1) * PAGE_SIZE < count : false,
      source: "supabase",
    });
  }

  // Local dev fallback so the picker is demoable before Supabase exists:
  // every lot in the seeded grid is "available" since nothing has ever been
  // claimed. Never used once NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
  // are set.
  const matches: { lot_id: string; lat_cell: number; lon_cell: number }[] = [];
  const needed = (page + 1) * PAGE_SIZE + 1;

  for (const { latCell, lonCell } of generateGridCells(LOT_GRID)) {
    const lotId = lotIdForCell(latCell, lonCell);
    if (search && !lotId.includes(search)) continue;
    matches.push({ lot_id: lotId, lat_cell: latCell, lon_cell: lonCell });
    if (matches.length >= needed) break;
  }

  const slice = matches.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return NextResponse.json({
    lots: slice,
    page,
    pageSize: PAGE_SIZE,
    hasMore: matches.length > (page + 1) * PAGE_SIZE,
    source: "local-fallback",
  });
}
