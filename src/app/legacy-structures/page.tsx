import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import LegacyStructureGrid from "@/components/LegacyStructureGrid";
import LegacyStructuresMap from "@/components/LegacyStructuresMap";
import { Panel, PanelRow } from "@/components/Panel";
import { legacyStructures, correspondenceLog } from "@/lib/staticPagesContent";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Legacy Structures Register — Moon Homeowners Association",
};

// So the map picks up the live legacy_structures table once seeded,
// rather than staying frozen at "not seeded yet" from build time.
export const revalidate = 45;

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

      <h3 style={{ marginTop: 32 }}>Register Map</h3>
      <p>
        Plotted from the Register&apos;s published coordinates. Grouped
        entries with restricted or unpublished coordinates (the Soviet/
        Russian, Chinese, Indian, and generic commercial groupings below)
        aren&apos;t plottable as a single point and are omitted from the
        map — see the full table for those.
      </p>
      <LegacyStructuresMapSection />

      <h3 style={{ marginTop: 32 }}>Full Register</h3>
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

      <h3 style={{ marginTop: 40 }}>Correspondence Log (§9.5, Appendix H)</h3>
      <p>
        A running log of correspondence sent to Pre-Association Entities,
        and the near-uniform absence of response, maintained for
        transparency and, the Board admits, a certain amount of
        institutional catharsis. Extended whenever a real mission event
        happens — see the Real-World Mission Tie-In Playbook.
      </p>
      <Panel>
        {correspondenceLog.map((entry, i) => (
          <PanelRow className="correspondence-row" key={`${entry.date}-${i}`}>
            <span className="correspondence-date">{entry.date}</span>
            <span>
              <span className="correspondence-recipient">{entry.recipient}</span>
              <span className="correspondence-subject"> — {entry.subject}</span>
            </span>
            <span className="correspondence-response">{entry.response}</span>
          </PanelRow>
        ))}
      </Panel>
    </SiteShell>
  );
}

async function LegacyStructuresMapSection() {
  if (!isSupabaseConfigured()) {
    return <p className="lot-picker-note">Map isn&apos;t connected yet — Supabase hasn&apos;t been configured.</p>;
  }

  const supabase = createSupabasePublicClient();
  const { data: structures, error } = await supabase
    .from("legacy_structures")
    .select("id, site_name, lat, lon, register_status")
    .not("lat", "is", null)
    .not("lon", "is", null);

  if (error || !structures || structures.length === 0) {
    return <p className="lot-picker-note">The Register isn&apos;t seeded in this environment yet — see the full table below instead.</p>;
  }

  return <LegacyStructuresMap structures={structures} />;
}
