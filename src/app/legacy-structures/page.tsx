import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import LegacyStructureGrid from "@/components/LegacyStructureGrid";
import { legacyStructures } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Legacy Structures Register — Moon Homeowners Association",
};

export default function LegacyStructuresPage() {
  return (
    <SiteShell sectionLabel="Part IX — Appendix C" title="Register of Pre-Existing Historic Surface Structures">
      <p>
        The Association&apos;s incorporation in 2088 did not occur on an
        empty lunar surface. Per §9.1, the Board discovered upon
        incorporation that it had inherited jurisdiction over a
        considerable quantity of pre-existing equipment it had no hand in
        placing and no legal ability to remove. Every entry below is
        deemed a Grandfathered Non-Conformance (§9.3.1) — exempt from
        Parts III, IV, and VI regardless of albedo, structural approval,
        curfew, or aesthetic standards it would otherwise violate.
      </p>
      <p>
        Coordinates are planetocentric degrees, rounded, as published in
        Appendix C. Enthusiast residents have cross-referenced them
        against public astronomical charts and confirmed them to be, in
        every case checked, real. The Board neither confirms nor denies
        that this was intentional.
      </p>

      <LegacyStructureGrid items={legacyStructures} />

      <div className="notice" style={{ marginTop: 32 }}>
        <h3>No-Removal Policy (§9.10)</h3>
        <p style={{ marginBottom: 0 }}>
          No resident, contractor, or permit holder may remove, relocate,
          or take possession of any catalogued item, regardless of
          apparent condition, abandonment, or resale value. Residents who
          discover an uncatalogued item within a Buffer Zone must report
          it to the Legacy Equipment Preservation Subcommittee (§12.3) for
          potential Register inclusion — failure to report carries the
          fine at Appendix B for Interfering with a Legacy Structure.
        </p>
      </div>
    </SiteShell>
  );
}
