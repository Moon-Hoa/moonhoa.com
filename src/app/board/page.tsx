import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import BoardGrid from "@/components/BoardGrid";

export const metadata: Metadata = {
  title: "Board Members — Moon Homeowners Association",
};

export default function BoardPage() {
  return (
    <SiteShell sectionLabel="§ 5.1 — Board Composition & Election" title="Board Members">
      <p>
        The Board consists of seven members serving three-year terms.
        Elections are held annually for whichever seats are available; the
        Chairperson&apos;s seat is not subject to election and serves
        &ldquo;at the pleasure of the Board,&rdquo; which in practice means
        indefinitely. Meet your representatives below.
      </p>

      <BoardGrid />
    </SiteShell>
  );
}
