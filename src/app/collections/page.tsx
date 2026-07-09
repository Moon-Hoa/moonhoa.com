import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { Panel, PanelRow } from "@/components/Panel";
import { collectionsStages } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Collections & Delinquency Policy — Moon Homeowners Association",
};

export default function CollectionsPage() {
  return (
    <SiteShell sectionLabel="§ 6.7 — Collections & Delinquency Policy" title="Collections & Delinquency Policy">
      <p>
        Assessments and fines are due within 45 days of notice unless
        otherwise stated. The Association&apos;s collections process
        proceeds in five stages.
      </p>

      <Panel>
        {collectionsStages.map((row) => (
          <PanelRow className="stage-row" key={row.stage}>
            <span className="stage-number">{row.stage}</span>
            <span className="stage-day">Day {row.day}</span>
            <span className="stage-action">{row.action}</span>
          </PanelRow>
        ))}
      </Panel>

      <div className="notice" style={{ marginTop: 32 }}>
        <div className="notice-stamp">Important</div>
        <h3>Foreclosure Notice</h3>
        <p style={{ marginBottom: 0 }}>
          IF YOUR PROPERTY IS PLACED IN FORECLOSURE BECAUSE YOU ARE BEHIND
          ON ASSESSMENTS, IT MAY BE SOLD WITHOUT FURTHER PROCEEDINGS. The
          Board wishes to state plainly that foreclosure is a measure of
          last resort and has been pursued to completion on exactly zero
          occasions since incorporation. The Board would very much like
          to keep that number at zero.
        </p>
      </div>

      <p style={{ marginTop: 32 }}>
        Amenity access (pool privileges, meeting hall entry, broom
        checkout at the Crater Cleanup Station) may be suspended for any
        account more than 30 days delinquent, regardless of collections
        stage. A resident may dispute a delinquency determination through
        mediation (§14.1) prior to lien filing.
      </p>

      <h3 style={{ marginTop: 32 }}>A Better Way: The Compliance Rebate Programme (§6.9)</h3>
      <p style={{ marginBottom: 0 }}>
        A resident maintaining Good Standing for 24 consecutive months
        without a single violation is eligible for a Compliance Rebate of
        20 oxygen credits against the following year&apos;s dues. The
        Board established this Programme in response to resident feedback
        that the Charter contains &ldquo;rather a lot of ways to be
        punished and comparatively few ways to be rewarded.&rdquo;
      </p>
    </SiteShell>
  );
}
