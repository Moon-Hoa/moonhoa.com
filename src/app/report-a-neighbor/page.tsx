import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import HorrorStoryForm from "@/components/HorrorStoryForm";

export const metadata: Metadata = {
  title: "Report a Neighbor — Moon Homeowners Association",
};

export default function ReportANeighborPage() {
  return (
    <SiteShell sectionLabel="HOA Horror Stories" title="Report a Neighbor">
      <p>
        Not every story belongs in front of the Tribunal. Some just belong
        in the <Link href="/gazette">Gazette</Link>. Share your best
        (worst?) Moon HOA experience below — inflatable Martians, dust
        drift disputes, unexplained surface writing, or anything else
        that happened to you under this Charter.
      </p>

      <HorrorStoryForm />
    </SiteShell>
  );
}
