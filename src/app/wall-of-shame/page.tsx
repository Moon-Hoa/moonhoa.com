import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { Panel, PanelRow } from "@/components/Panel";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Wall of Shame — Moon Homeowners Association",
};

// Revalidates at the same cadence as the registry/density pages — this is
// aggregate, non-personal data.
export const revalidate = 45;

export default async function WallOfShamePage() {
  return (
    <SiteShell sectionLabel="Most Contested Lots" title="Wall of Shame">
      <p>
        Not a violation leaderboard — the Board keeps compliance records
        confidential (§14.2 complaints are handled privately, and only
        the Board reviews them). This is simpler and, frankly, funnier:
        the lots that have changed hands the most since incorporation.
        Somebody keeps letting these go.
      </p>
      <ShameTable />
    </SiteShell>
  );
}

async function ShameTable() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="registration-error">
        The Wall of Shame isn&apos;t connected yet — Supabase hasn&apos;t
        been configured. Try again once the site&apos;s off the ground.
      </p>
    );
  }

  const supabase = createSupabasePublicClient();
  const { data: rows } = await supabase
    .from("most_transferred_lots")
    .select("lot_id, transfer_count")
    .limit(20);

  if (!rows || rows.length === 0) {
    return <p className="lot-picker-note">No transfers recorded yet. A clean slate — for now.</p>;
  }

  return (
    <Panel>
      {rows.map((row) => (
        <PanelRow href={`/lots/${row.lot_id}`} className="admin-row admin-row-compact" key={row.lot_id}>
          <span className="admin-cell-lot">{row.lot_id}</span>
          <span className="admin-cell-date">
            {row.transfer_count} transfer{row.transfer_count === 1 ? "" : "s"}
          </span>
        </PanelRow>
      ))}
    </Panel>
  );
}
