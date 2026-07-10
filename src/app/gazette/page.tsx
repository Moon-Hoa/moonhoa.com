import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { gazetteIssues } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "The HOA Gazette — Moon Homeowners Association",
};

export default function GazettePage() {
  return (
    <SiteShell sectionLabel="Community Publication" title="The HOA Gazette">
      <p>
        A recurring, informal round-up of Board announcements, compliance
        updates, and resident-submitted stories — distinct from the
        official Meeting Minutes, and considerably more fun to read.
      </p>

      {gazetteIssues.map((issue) => (
        <div key={issue.issue} style={{ marginTop: 32 }}>
          <h3>
            {issue.issue} &mdash; {issue.date}
          </h3>
          {issue.items.map((item) => (
            <div className="notice" key={item.headline} style={{ marginTop: 16 }}>
              <h3>{item.headline}</h3>
              <p style={{ marginBottom: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      ))}

      <p style={{ marginTop: 32 }}>
        Have a story of your own? <Link href="/report-a-neighbor">Submit it to the Gazette</Link>.
      </p>
    </SiteShell>
  );
}
