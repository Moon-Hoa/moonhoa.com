import { ImageResponse } from "next/og";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { cellsForLotId, cellToDeg } from "@/lib/lots";

export const alt = "Moon HOA lot record";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lotId: string }> }) {
  const { lotId } = await params;

  let ownerLine = "Unclaimed";
  let coordsLine = "";

  try {
    const { latCell, lonCell } = cellsForLotId(lotId);
    coordsLine = `${cellToDeg(latCell).toFixed(1)}°, ${cellToDeg(lonCell).toFixed(1)}°`;
  } catch {
    // Invalid lot ID — fall through with no coordinates; the real page 404s.
  }

  if (isSupabaseConfigured()) {
    const supabase = createSupabasePublicClient();
    const { data: lot } = await supabase
      .from("lots")
      .select("owner_id")
      .eq("lot_id", lotId)
      .maybeSingle();

    if (lot?.owner_id) {
      const { data: owner } = await supabase
        .from("member_public_profiles")
        .select("display_name")
        .eq("id", lot.owner_id)
        .maybeSingle();
      if (owner?.display_name) ownerLine = `Registered to ${owner.display_name}`;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0f1e",
          color: "#dce5f0",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#8a6e2f", textTransform: "uppercase" }}>
          Moon Homeowners Association
        </div>
        <div style={{ display: "flex", fontSize: 96, color: "#e8c97e", marginTop: 24, letterSpacing: 4 }}>{lotId}</div>
        <div style={{ display: "flex", fontSize: 36, marginTop: 24, color: ownerLine === "Unclaimed" ? "#8896aa" : "#f5f0e8" }}>
          {ownerLine}
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 16, color: "#8896aa" }}>{coordsLine}</div>
      </div>
    ),
    { ...size }
  );
}
