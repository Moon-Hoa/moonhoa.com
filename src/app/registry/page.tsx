import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import RegistryTable from "@/components/RegistryTable";

export const metadata: Metadata = {
  title: "Public Registry — Moon Homeowners Association",
};

export default function RegistryPage() {
  return (
    <>
      <Starfield />
      <SiteNav />

      <main>
        <section>
          <SectionLabel>§ 7.0 — Public Registry</SectionLabel>
          <h2>Registered Members</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          <p>
            Every claimed lot and its registered owner, as recorded by the
            Association. Search by lot code or member name, or browse the
            full roll below.
          </p>

          <RegistryTable />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
