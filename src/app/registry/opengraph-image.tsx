import { ImageResponse } from "next/og";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const alt = "Moon HOA Public Registry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let countLine = "";

  if (isSupabaseConfigured()) {
    const supabase = createSupabasePublicClient();
    const { count } = await supabase
      .from("lot_registry")
      .select("lot_id", { count: "exact", head: true });
    if (count !== null) countLine = `${count.toLocaleString()} registered properties`;
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
        <div style={{ display: "flex", fontSize: 72, color: "#e8c97e", marginTop: 24 }}>Public Registry</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 24, color: "#f5f0e8" }}>{countLine}</div>
      </div>
    ),
    { ...size }
  );
}
