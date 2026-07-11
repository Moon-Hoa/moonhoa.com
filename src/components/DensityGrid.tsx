import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { densityColor } from "@/lib/densityColor";

interface DensityCell {
  lat_bucket: number;
  lon_bucket: number;
  total_lots: number;
  claimed_lots: number;
}

// Extracted from density/page.tsx so both /density and /moon's no-WebGL
// fallback can render the same flat heatmap.
export default async function DensityGrid() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="registration-error">
        The density map isn&apos;t connected yet — Supabase hasn&apos;t been
        configured. Try again once the site&apos;s off the ground.
      </p>
    );
  }

  const supabase = createSupabasePublicClient();
  const { data: cells } = await supabase
    .from("lot_density_grid")
    .select("lat_bucket, lon_bucket, total_lots, claimed_lots")
    .order("lat_bucket", { ascending: false })
    .order("lon_bucket", { ascending: true });

  if (!cells || cells.length === 0) {
    return <p className="lot-picker-note">No lots seeded yet.</p>;
  }

  const latBuckets = [...new Set(cells.map((c) => c.lat_bucket))].sort((a, b) => b - a);
  const lonBuckets = [...new Set(cells.map((c) => c.lon_bucket))].sort((a, b) => a - b);
  const byKey = new Map<string, DensityCell>(cells.map((c) => [`${c.lat_bucket}:${c.lon_bucket}`, c]));

  return (
    <>
      <div className="density-grid-scroll">
        <div
          className="density-grid"
          style={{ gridTemplateColumns: `repeat(${lonBuckets.length}, 28px)` }}
        >
          {latBuckets.flatMap((lat) =>
            lonBuckets.map((lon) => {
              const cell = byKey.get(`${lat}:${lon}`);
              if (!cell) return <div className="density-cell density-cell-empty" key={`${lat}:${lon}`} />;

              const fraction = cell.total_lots > 0 ? cell.claimed_lots / cell.total_lots : 0;
              const pct = Math.round(fraction * 100);

              return (
                <div
                  className="density-cell"
                  key={`${lat}:${lon}`}
                  style={{ background: densityColor(fraction) }}
                  title={`${cell.claimed_lots} / ${cell.total_lots} lots claimed (${pct}%)`}
                >
                  {pct}%
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="density-legend">
        <span>0% claimed</span>
        <div className="density-legend-track">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{ background: densityColor(i / 19) }} />
          ))}
        </div>
        <span>100% claimed</span>
      </div>
    </>
  );
}
