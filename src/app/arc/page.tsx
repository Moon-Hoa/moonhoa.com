import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import DecreeGrid from "@/components/DecreeGrid";
import { arcSteps } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Architectural Review Committee — Moon Homeowners Association",
};

export default function ArcPage() {
  return (
    <SiteShell sectionLabel="§ 9.0 — Architectural Review" title="ARC Approval Process">
      <p>
        Any construction, modification, or non-reflective surface
        treatment visible from a neighboring lot must first be approved
        by the Architectural Review Committee. This includes domes,
        greenhouses, flagpoles (see §8.1), and satellite dishes (see
        §8.3). The process below is designed to be thorough, fair, and
        approximately as long as a lunar year.
      </p>

      <DecreeGrid items={arcSteps} />
    </SiteShell>
  );
}
