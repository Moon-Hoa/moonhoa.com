import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import RegistryTable from "@/components/RegistryTable";

export const metadata: Metadata = {
  title: "Public Registry — Moon Homeowners Association",
};

export default function RegistryPage() {
  return (
    <SiteShell sectionLabel="§ 7.0 — Public Registry" title="Registered Members">
      <p>
        Every claimed lot and its registered owner, as recorded by the
        Association. Search by lot code or member name, or browse the
        full roll below.
      </p>

      <RegistryTable />
    </SiteShell>
  );
}
