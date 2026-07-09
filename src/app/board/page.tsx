import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import BoardGrid from "@/components/BoardGrid";

export const metadata: Metadata = {
  title: "Board Members — Moon Homeowners Association",
};

export default function BoardPage() {
  return (
    <SiteShell sectionLabel="§ 11.0 — Governance" title="Board Members">
      <p>
        The Board is elected by the general membership every two years,
        or has been re-elected unopposed for enough consecutive terms
        that the distinction is largely academic. Meet your
        representatives below.
      </p>

      <BoardGrid />
    </SiteShell>
  );
}
