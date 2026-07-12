import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import DensityGrid from "@/components/DensityGrid";
import MoonViewerClientWrapper from "@/components/moon/MoonViewerClientWrapper";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { DensityCell } from "@/lib/moonDensityTexture";

export const metadata: Metadata = {
  title: "3D Moon View — Moon Homeowners Association",
};

// Same cadence as /density, which this page's density overlay reuses data from.
export const revalidate = 45;

export default async function MoonPage() {
  const densityCells = await fetchDensityCells();

  return (
    <SiteShell sectionLabel="§ 7.3 — Interactive Cartography" title="3D Moon View">
      <p>
        A rotatable, zoomable rendering of the Association&apos;s jurisdiction —
        drag to orbit, scroll to zoom. Gold markers are historic surface
        sites and named features; zoom in anywhere on the sphere — near
        side, far side, or the poles — to browse individual lots.
      </p>
      <MoonViewerClientWrapper
        densityCells={densityCells}
        fallback={
          <>
            <p className="registration-error">
              The 3D view isn&apos;t available on this device — showing the
              flat density map instead.
            </p>
            <DensityGrid />
          </>
        }
      />
      <p className="lot-picker-note">
        Prefer a flat view? See the <Link href="/density">Lot Density Map</Link>.
      </p>
    </SiteShell>
  );
}

async function fetchDensityCells(): Promise<DensityCell[] | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabasePublicClient();
  const { data: cells } = await supabase
    .from("lot_density_grid")
    .select("lat_bucket, lon_bucket, total_lots, claimed_lots");

  return cells ?? null;
}
