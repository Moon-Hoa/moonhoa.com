import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import NoticeCard from "@/components/NoticeCard";
import { meetingMinutes } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Meeting Minutes — Moon Homeowners Association",
};

export default function MinutesPage() {
  return (
    <SiteShell sectionLabel="§ 12.0 — Official Record" title="Meeting Minutes">
      <p>
        Minutes are recorded by whichever board member remembers to bring
        a notepad. Approved minutes are final; contested minutes remain
        contested indefinitely.
      </p>

      {meetingMinutes.map((entry, i) => (
        <NoticeCard key={entry.title} notice={entry} style={i > 0 ? { marginTop: 16 } : undefined} />
      ))}
    </SiteShell>
  );
}
