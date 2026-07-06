import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import DuesTable from "@/components/DuesTable";

export const metadata: Metadata = {
  title: "Dues Schedule — Moon Homeowners Association",
};

export default function DuesPage() {
  return (
    <>
      <Starfield />
      <SiteNav />

      <main>
        <section>
          <SectionLabel>§ 10.0 — Financial Obligations</SectionLabel>
          <h2>Dues Schedule</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          <p>
            All amounts are denominated in moon dollars (₸), a currency whose
            exchange rate the Board has never disclosed and does not intend
            to. Dues are assessed monthly and are due regardless of whether
            you have visited your lot, can visit your lot, or believe your
            lot exists.
          </p>

          <DuesTable />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
