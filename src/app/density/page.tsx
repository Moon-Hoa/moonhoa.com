import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { densityColor } from "@/lib/densityColor";

export const metadata: Metadata = {
  title: "Lot Density Map — Moon Homeowners Association",
};

// Lazily cached like the registry — this is aggregate, non-personal data,
// so ISR at the same cadence is fine.
export const revalidate = 45;

interface DensityCell {
  lat_bucket: number;
  lon_bucket: number;
  total_lots: number;
  claimed_lots: number;
}

export default async function DensityPage() {
  return (
    <SiteShell sectionLabel="§ 7.2 — Settlement Patterns" title="Lot Density Map">
      <p>
        Claim density across the Association&apos;s jurisdiction, binned
        into 5°×5° selenographic regions. Darker cells are mostly
        unclaimed; brighter cells are hot property.
      </p>
      <DensityGrid />
    </SiteShell>
  );
}

async function DensityGrid() {
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
      <div
        className="density-grid"
        style={{ gridTemplateColumns: `repeat(${lonBuckets.length}, 1fr)` }}
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
