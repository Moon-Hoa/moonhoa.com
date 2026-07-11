import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import DensityGrid from "@/components/DensityGrid";

export const metadata: Metadata = {
  title: "Lot Density Map — Moon Homeowners Association",
};

// Lazily cached like the registry — this is aggregate, non-personal data,
// so ISR at the same cadence is fine.
export const revalidate = 45;

export default async function DensityPage() {
  return (
    <SiteShell sectionLabel="§ 7.2 — Settlement Patterns" title="Lot Density Map">
      <p>
        Claim density across the Association&apos;s jurisdiction, binned
        into 5°×5° selenographic regions. Darker cells are mostly
        unclaimed; brighter cells are hot property.
      </p>
      <DensityGrid />
      <p className="lot-picker-note">
        Prefer to see it on the Moon itself? Try the <Link href="/moon">interactive 3D view</Link>.
      </p>
    </SiteShell>
  );
}
