import Starfield from "@/components/Starfield";
import FadeIn from "@/components/FadeIn";
import SiteHeader from "@/components/SiteHeader";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import StatRow from "@/components/StatRow";
import DecreeGrid from "@/components/DecreeGrid";
import AmenityGrid from "@/components/AmenityGrid";
import EventList from "@/components/EventList";
import NoticeCard from "@/components/NoticeCard";
import ResolutionBlock from "@/components/ResolutionBlock";
import ContactBlock from "@/components/ContactBlock";
import { notices } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Starfield />
      <SiteHeader />
      <SiteNav />

      <main>
        <StatRow />

        <section id="welcome">
          <SectionLabel>§ 0.1 — Introduction</SectionLabel>
          <h2>Welcome to the Lunar Community</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          <FadeIn className="welcome-block">
            <p>
              Congratulations on securing your crater-side property. As a
              duly registered member of the Moon Homeowners Association, you
              are now entitled to the full array of rights, privileges, and
              obligations as enumerated in the{" "}
              <em>Lunar Residential Charter of 2069</em> — a document that
              spans 4,200 pages and has never been read in its entirety by
              any living human being.
            </p>
            <p style={{ marginBottom: 0 }}>
              We are confident your tenure here will be orderly, compliant,
              and of appropriate reflectivity. Should you have questions,
              please consult Section 7, Subsection 14, Appendix C, Footnote
              38b. The answer is almost certainly &ldquo;no.&rdquo;
            </p>
          </FadeIn>
        </section>

        <section id="regulations">
          <SectionLabel>§ 1.0 — Bylaws &amp; Regulatory Decrees</SectionLabel>
          <h2>Rules &amp; Regulations</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>
          <DecreeGrid />
        </section>

        <section id="amenities">
          <SectionLabel>§ 2.0 — Community Infrastructure</SectionLabel>
          <h2>Resident Amenities</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>
          <AmenityGrid />
        </section>

        <section id="calendar">
          <SectionLabel>§ 3.0 — Official Event Calendar</SectionLabel>
          <h2>Upcoming Community Events</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>
          <EventList />
        </section>

        <section id="notices">
          <SectionLabel>§ 4.0 — Official Notices &amp; Bulletins</SectionLabel>
          <h2>Active Notices</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          {notices.map((notice, i) => (
            <NoticeCard
              key={notice.title}
              notice={notice}
              style={i > 0 ? { marginTop: 16 } : undefined}
            />
          ))}

          <ResolutionBlock />
        </section>

        <section id="contact">
          <SectionLabel>§ 5.0 — Correspondence &amp; Administration</SectionLabel>
          <h2>Contact the Association</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>
          <ContactBlock />
        </section>

        <section id="charter">
          <div style={{ width: "100%", maxWidth: 900, margin: "auto" }}>
            <iframe
              src="/lunar-residential-charter-2069.pdf"
              style={{ width: "100%", height: "80vh", border: "none" }}
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
