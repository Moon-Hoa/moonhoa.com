import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import NoticeCard from "@/components/NoticeCard";
import { meetingMinutes } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Meeting Minutes — Moon Homeowners Association",
};

export default function MinutesPage() {
  return (
    <SiteShell sectionLabel="§ 5.3 — Meeting Procedures" title="Meeting Minutes">
      <p>
        Regular Board meetings are held the first Earth-Saturday of each
        month at 14:00 UTC. Minutes are archived and, per §5.3.5, made
        available on request to residents in Good Standing. Full committee
        minutes archives are available through a Records Request (§15.4).
      </p>

      {meetingMinutes.map((entry, i) => (
        <NoticeCard key={entry.title} notice={entry} style={i > 0 ? { marginTop: 16 } : undefined} />
      ))}
    </SiteShell>
  );
}
