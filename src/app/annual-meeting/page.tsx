import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import DecreeGrid from "@/components/DecreeGrid";
import AnnualMeetingBallot from "@/components/AnnualMeetingBallot";
import { annualMeetingAgenda } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Annual Meeting — Moon Homeowners Association",
};

export default function AnnualMeetingPage() {
  return (
    <>
      <Starfield />
      <SiteNav />

      <main>
        <section>
          <SectionLabel>§ 15.0 — Annual General Meeting</SectionLabel>
          <h2>Annual Meeting — Perigee Session, 2089</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

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
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
