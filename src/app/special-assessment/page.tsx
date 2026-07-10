import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Special Assessment Notice — Moon Homeowners Association",
};

export default function SpecialAssessmentPage() {
  return (
    <SiteShell sectionLabel="§ 6.6 — Special Assessments" title="Notice of Special Assessment">
      <p>
        Where a Reserve Component&apos;s shortfall cannot be absorbed by
        ordinary dues, the Board may levy a Special Assessment against all
        registered properties by resolution, specifying the amount, the
        reason, and a due date no sooner than 45 days from notice. The
        current assessment in effect is reproduced below.
      </p>

      <div className="notice" style={{ marginTop: 32 }}>
        <div className="notice-stamp">Active</div>
        <h3>Notice of Special Assessment</h3>
        <p>
          Pursuant to §6.6 of the Lunar Residential Charter, the Board
          hereby levies a Special Assessment against all registered
          properties in the amount of <strong>85 oxygen credits</strong>,
          due no sooner than 45 days from the date of this notice.
        </p>
        <p>
          <strong>Reason for Assessment:</strong> The Zero-Gravity Swimming
          Pool Reserve Component is currently funded at 11% of its
          recommended target, a figure the most recent Reserve Study
          classifies as a critical shortfall. This Special Assessment is
          intended to fund location and recovery efforts, and, contingent
          on recovery, structural recertification.
        </p>
        <p>
          Payment plans of 12 to 24 lunar cycles are available on written
          request. Properties with an outstanding balance 45 days past
          this due date will enter the collections process at §6.7.
        </p>
        <p style={{ marginBottom: 0 }}>
          The Board regrets the necessity of this Assessment and wishes to
          note, for context, that the pool&apos;s disappearance predates
          the current Board&apos;s term by a considerable margin.
        </p>
      </div>

      <p style={{ marginTop: 32 }}>
        Special Assessment notices must disclose the relevant Reserve
        Component&apos;s funding percentage as of the most recent Reserve
        Study — see the{" "}
        <a href="/reserve-study">current Reserve Study Summary</a> for the
        full picture across all Association infrastructure.
      </p>
    </SiteShell>
  );
}
