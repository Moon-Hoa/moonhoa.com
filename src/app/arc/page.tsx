import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import DecreeGrid from "@/components/DecreeGrid";
import { arcSteps } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Architectural Review Committee — Moon Homeowners Association",
};

export default function ArcPage() {
  return (
    <>
      <Starfield />
      <SiteNav />

      <main>
        <section>
          <SectionLabel>§ 9.0 — Architectural Review</SectionLabel>
          <h2>ARC Approval Process</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          <p>
            Any construction, modification, or non-reflective surface
            treatment visible from a neighboring lot must first be approved
            by the Architectural Review Committee. This includes domes,
            greenhouses, flagpoles (see §8.1), and satellite dishes (see
            §8.3). The process below is designed to be thorough, fair, and
            approximately as long as a lunar year.
          </p>

          <DecreeGrid items={arcSteps} />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
