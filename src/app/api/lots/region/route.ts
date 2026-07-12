import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { degToCell, generateGridCells, lotIdForCell, LOT_GRID } from "@/lib/lots";

// Backs the 3D Moon view's zoomed-in lot overlay: given a small lat/lon
// bounding box, return the individual lots inside it. There's no spatial
// index on (lat_cell, lon_cell) — just the composite btree from the unique
// constraint — so the box-size clamp below is what actually bounds query
// cost, not anything server-side beyond that.
//
// Deliberately queries the base `lots` table, not `lot_registry` — that
// view inner-joins members and drops unclaimed lots, which is the majority
// of what this endpoint needs to show. And deliberately never selects
// owner_id — claimed_at is enough to color a cell "claimed"; the owner's
// display name is one click away at /lots/[lotId], which already does the
// safe member_public_profiles lookup.
const MAX_SPAN_DEG = 3;
const ROW_CAP = 900;

function clampSpan(min: number, max: number, maxSpan: number) {
  if (max - min <= maxSpan) return { min, max };
  const center = (min + max) / 2;
  return { min: center - maxSpan / 2, max: center + maxSpan / 2 };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latMinRaw = Number(searchParams.get("latMin"));
  const latMaxRaw = Number(searchParams.get("latMax"));
  const lonMinRaw = Number(searchParams.get("lonMin"));
  const lonMaxRaw = Number(searchParams.get("lonMax"));

  if (
    [latMinRaw, latMaxRaw, lonMinRaw, lonMaxRaw].some((n) => !Number.isFinite(n)) ||
    latMinRaw >= latMaxRaw ||
    lonMinRaw >= lonMaxRaw
  ) {
    return NextResponse.json({ error: "Invalid bounding box" }, { status: 400 });
  }

  const latSpan = clampSpan(latMinRaw, latMaxRaw, MAX_SPAN_DEG);
  const lonSpan = clampSpan(lonMinRaw, lonMaxRaw, MAX_SPAN_DEG);

  // Intersect with the seeded jurisdiction rectangle.
  const latMinDeg = Math.max(latSpan.min, LOT_GRID.latMinDeg);
  const latMaxDeg = Math.min(latSpan.max, LOT_GRID.latMaxDeg);
  const lonMinDeg = Math.max(lonSpan.min, LOT_GRID.lonMinDeg);
  const lonMaxDeg = Math.min(lonSpan.max, LOT_GRID.lonMaxDeg);

  if (latMinDeg >= latMaxDeg || lonMinDeg >= lonMaxDeg) {
    return NextResponse.json({ lots: [], inBounds: false, configured: isSupabaseConfigured() });
  }

  const latCellMin = degToCell(latMinDeg);
  const latCellMax = degToCell(latMaxDeg);
  const lonCellMin = degToCell(lonMinDeg);
  const lonCellMax = degToCell(lonMaxDeg);

  if (isSupabaseConfigured()) {
    const supabase = createSupabasePublicClient();
    // lot_id is deliberately not selected: it's not in the covering index
    // (lat_cell, lon_cell) include (claimed_at), and selecting it would
    // force a heap fetch per row instead of an index-only scan. It's a
    // pure function of (lat_cell, lon_cell), so it's cheaper to derive here.
    const { data, error } = await supabase
      .from("lots")
      .select("lat_cell, lon_cell, claimed_at")
      .gte("lat_cell", latCellMin)
      .lte("lat_cell", latCellMax)
      .gte("lon_cell", lonCellMin)
      .lte("lon_cell", lonCellMax)
      .limit(ROW_CAP);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const lots = data.map((row) => ({
      lot_id: lotIdForCell(row.lat_cell, row.lon_cell),
      lat_cell: row.lat_cell,
      lon_cell: row.lon_cell,
      claimed_at: row.claimed_at,
    }));

    return NextResponse.json({ lots, inBounds: true, configured: true });
  }

  // Local dev fallback — every lot in this bbox slice of the seeded grid is
  // "unclaimed" (same fiction /api/lots/available uses), so the panel is
  // fully demoable with zero Supabase.
  const bounds = {
    stepDeg: LOT_GRID.stepDeg,
    latMinDeg,
    latMaxDeg,
    lonMinDeg,
    lonMaxDeg,
  };
  const lots: { lot_id: string; lat_cell: number; lon_cell: number; claimed_at: null }[] = [];
  for (const { latCell, lonCell } of generateGridCells(bounds)) {
    lots.push({ lot_id: lotIdForCell(latCell, lonCell), lat_cell: latCell, lon_cell: lonCell, claimed_at: null });
    if (lots.length >= ROW_CAP) break;
  }

  return NextResponse.json({ lots, inBounds: true, configured: false });
}
