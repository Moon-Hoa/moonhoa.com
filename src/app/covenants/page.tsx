import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import DecreeGrid from "@/components/DecreeGrid";
import { covenants } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Covenants, Conditions & Restrictions — Moon Homeowners Association",
};

export default function CovenantsPage() {
  return (
    <SiteShell sectionLabel="§ 8.0 — Covenants, Conditions & Restrictions" title="CC&Rs">
      <p>
        The following covenants run with the land — quite literally, since
        the land in question is a 0.1° selenographic cell you do not
        physically occupy. All members are bound by these restrictions
        regardless of whether they have read them, which the Board
        assumes they have not.
      </p>

      <DecreeGrid items={covenants} />
    </SiteShell>
  );
}
