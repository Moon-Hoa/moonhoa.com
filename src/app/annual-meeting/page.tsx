import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import DecreeGrid from "@/components/DecreeGrid";
import AnnualMeetingBallot from "@/components/AnnualMeetingBallot";
import { annualMeetingAgenda } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Annual Meeting — Moon Homeowners Association",
};

export default function AnnualMeetingPage() {
  return (
    <SiteShell sectionLabel="§ 5.3.6 — Annual HOA Meeting" title="Annual HOA Meeting">
      <p>
        Held the first Saturday of the fourth quarter at the Moon HOA
        Community Hall. Remote attendance via the Earth Communication
        Array is permitted but regarded with mild suspicion.
      </p>

      <div className="notice" style={{ marginTop: 24 }}>
        <h3>Quorum Requirement</h3>
        <p style={{ marginBottom: 0 }}>
          Per §5.3.6, binding votes — budget ratification, Board elections
          — require attendance or proxy from at least 25% of registered
          lots. Meetings falling short of this threshold proceed as
          informal gatherings; refreshments are served regardless. This
          gathering is distinct from the Full Moon Party (§7.3), which has
          its own — considerably stricter — seating chart for residents
          with pending mutual dust drift complaints against each other.
        </p>
      </div>

      <h3 style={{ marginTop: 32 }}>Agenda</h3>
      <DecreeGrid items={annualMeetingAgenda} />

      <h3 style={{ marginTop: 40 }}>Ballot</h3>
      <p>
        Cast your vote on this session&apos;s resolutions below. Results
        will be announced in the next Meeting Minutes, then promptly
        ignored.
      </p>
      <AnnualMeetingBallot />
    </SiteShell>
  );
}
