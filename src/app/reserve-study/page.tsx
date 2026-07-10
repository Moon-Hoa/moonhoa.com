import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import ReserveTable from "@/components/ReserveTable";
import { reserveComponents } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Reserve Study Summary — Moon Homeowners Association",
};

export default function ReserveStudyPage() {
  return (
    <SiteShell sectionLabel="§ 6.5 — Reserve Components & the Reserve Study" title="Reserve Study Summary">
      <p>
        The Association maintains a reserve fund, allocated across
        discrete Reserve Components, to cover major repair and
        replacement costs without resort to special assessment. A Reserve
        Study is commissioned biennially, assessing each component&apos;s
        current funding level as a percentage of its recommended target.
        Industry consensus — adopted by the Board without independent
        verification of what industry, exactly — holds that a component
        funded below 70% is inadequately funded, and below 30% is a
        critical shortfall.
      </p>

      <ReserveTable items={reserveComponents} />

      <p style={{ marginTop: 32 }}>
        Where a component is found critically underfunded, the Board
        acknowledges this in writing and does not, as a rule, consider it
        actionable at that time — see the current{" "}
        <a href="/special-assessment">Special Assessment Notice</a> for
        the one exception. A resident may request a full copy of the
        current Reserve Study through the{" "}
        <a href="/records-request">Records Request Portal</a>. Estimated
        response time is 1–3 lunar cycles.
      </p>
    </SiteShell>
  );
}
