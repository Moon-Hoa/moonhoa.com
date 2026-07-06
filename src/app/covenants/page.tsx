import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import DecreeGrid from "@/components/DecreeGrid";
import { covenants } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Covenants, Conditions & Restrictions — Moon Homeowners Association",
};

export default function CovenantsPage() {
  return (
    <>
      <Starfield />
      <SiteNav />

      <main>
        <section>
          <SectionLabel>§ 8.0 — Covenants, Conditions &amp; Restrictions</SectionLabel>
          <h2>CC&amp;Rs</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          <p>
            The following covenants run with the land — quite literally, since
            the land in question is a 0.1° selenographic cell you do not
            physically occupy. All members are bound by these restrictions
            regardless of whether they have read them, which the Board
            assumes they have not.
          </p>

          <DecreeGrid items={covenants} />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
