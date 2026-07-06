import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import NoticeCard from "@/components/NoticeCard";
import { meetingMinutes } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Meeting Minutes — Moon Homeowners Association",
};

export default function MinutesPage() {
  return (
    <>
      <Starfield />
      <SiteNav />

      <main>
        <section>
          <SectionLabel>§ 12.0 — Official Record</SectionLabel>
          <h2>Meeting Minutes</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          <p>
            Minutes are recorded by whichever board member remembers to bring
            a notepad. Approved minutes are final; contested minutes remain
            contested indefinitely.
          </p>

          {meetingMinutes.map((entry, i) => (
            <NoticeCard key={entry.title} notice={entry} style={i > 0 ? { marginTop: 16 } : undefined} />
          ))}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
