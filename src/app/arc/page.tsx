import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import DecreeGrid from "@/components/DecreeGrid";
import CommitteeTable from "@/components/CommitteeTable";
import { arcSteps, committees } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Committees & Subcommittees — Moon Homeowners Association",
};

export default function ArcPage() {
  return (
    <SiteShell sectionLabel="Part XII" title="Committees & Subcommittees">
      <p>
        All committees and subcommittees established under this Part report
        to the Board. Two are frequently confused with each other, so this
        page keeps them separate.
      </p>

      <h3 style={{ marginTop: 32 }}>Architectural Review Committee (§12.1)</h3>
      <p>
        Any construction, modification, or non-reflective surface
        treatment visible from a neighboring lot must first be approved by
        the Architectural Review Committee. This includes domes,
        greenhouses, flagpoles, and satellite dishes (subject to the
        Legacy Equipment carve-out at §9.4). The process below is designed
        to be thorough, fair, and biweekly.
      </p>
      <DecreeGrid items={arcSteps} />

      <h3 style={{ marginTop: 40 }}>Aesthetic Review Committee (§12.2)</h3>
      <p>
        A distinct body from the Architectural Review Committee above,
        meeting quarterly to review exterior decoration flagged by
        neighbours or Board members under §3.4.3. Its decisions are not,
        by the terms of its own charter, subject to appeal — a point the
        Tribunal has upheld on the several occasions it has been asked to
        reconsider this.
      </p>

      <h3 style={{ marginTop: 40 }}>All Committees &amp; Subcommittees (§12.9)</h3>
      <CommitteeTable items={committees} />
    </SiteShell>
  );
}
