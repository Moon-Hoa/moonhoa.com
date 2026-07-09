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
    </SiteShell>
  );
}
