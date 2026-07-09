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
    <SiteShell sectionLabel="§ 15.0 — Annual General Meeting" title="Annual Meeting — Perigee Session, 2089">
      <p>
        Held virtually via the Earth Communication Array. Expect a
        2.6-second lag on all rebuttals. Attendance is mandatory in
        spirit, optional in practice, and recorded regardless.
      </p>

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
