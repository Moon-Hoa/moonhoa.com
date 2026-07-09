import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import DuesTable from "@/components/DuesTable";

export const metadata: Metadata = {
  title: "Dues Schedule — Moon Homeowners Association",
};

export default function DuesPage() {
  return (
    <SiteShell sectionLabel="§ 10.0 — Financial Obligations" title="Dues Schedule">
      <p>
        All amounts are denominated in moon dollars (₸), a currency whose
        exchange rate the Board has never disclosed and does not intend
        to. Dues are assessed monthly and are due regardless of whether
        you have visited your lot, can visit your lot, or believe your
        lot exists.
      </p>

      <DuesTable />

      <div className="notice" style={{ marginTop: 32 }}>
        <h3>Insurance Requirements (Part XIII)</h3>
        <p>
          Per §13.1.1, every registered resident must separately maintain an
          individual Lunar Habitation Policy providing no less than 500,000
          oxygen credits of structural and liability coverage, naming the
          Association as an additional interested party. Proof of current
          coverage must be filed annually alongside dues (§13.1.2) — lapsed
          coverage is treated as a compliance violation under §6.3.
        </p>
        <p style={{ marginBottom: 0 }}>
          The Association&apos;s own Master Policy (§13.2.1) covers common
          amenities and shared utility infrastructure, but expressly
          excludes any Legacy Structure under Part IX — the Board is not
          prepared to explain fifty-year-old hardware it did not build to an
          underwriter.
        </p>
      </div>
    </SiteShell>
  );
}
