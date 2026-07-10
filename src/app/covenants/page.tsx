import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import DecreeGrid from "@/components/DecreeGrid";
import { propertyStandards, behaviouralStandards } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Property Standards & Behavioural Covenants — Moon Homeowners Association",
};

export default function CovenantsPage() {
  return (
    <SiteShell sectionLabel="Parts III & IV" title="Property Standards & Behavioural Covenants">
      <p>
        The following covenants run with the land — quite literally, since
        the land in question is a 0.1° selenographic cell you do not
        physically occupy. All members are bound by these restrictions
        regardless of whether they have read them, which the Board
        assumes they have not. Fine amounts are denominated in Oxygen
        Credits (OC) per §6.2 and the Appendix B master schedule.
      </p>

      <h3 style={{ marginTop: 32 }}>Property Standards &amp; Surface Maintenance (Part III)</h3>
      <DecreeGrid items={propertyStandards} />

      <h3 style={{ marginTop: 40 }}>Behavioural Standards (Part IV)</h3>
      <DecreeGrid items={behaviouralStandards} />
    </SiteShell>
  );
}
