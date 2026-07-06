import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import BoardGrid from "@/components/BoardGrid";

export const metadata: Metadata = {
  title: "Board Members — Moon Homeowners Association",
};

export default function BoardPage() {
  return (
    <>
      <Starfield />
      <SiteNav />

      <main>
        <section>
          <SectionLabel>§ 11.0 — Governance</SectionLabel>
          <h2>Board Members</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          <p>
            The Board is elected by the general membership every two years,
            or has been re-elected unopposed for enough consecutive terms
            that the distinction is largely academic. Meet your
            representatives below.
          </p>

          <BoardGrid />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
