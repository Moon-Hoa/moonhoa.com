import Starfield from "./Starfield";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import SectionLabel from "./SectionLabel";

// Shared shell for every single-section content page (all routes except the
// homepage, which has its own multi-section layout). Centralizes the
// Starfield/SiteNav/SiteFooter boilerplate that used to be duplicated on
// each page, and intentionally drops the "❧" Ornament divider that used to
// sit under every h2 — with only one section per page, it separated a
// heading from nothing. It stays on the homepage where multiple sections
// genuinely need a break between them.
export default function SiteShell({
  sectionLabel,
  title,
  children,
  starfieldDensity = "subtle",
}: {
  sectionLabel: string;
  title: React.ReactNode;
  children: React.ReactNode;
  starfieldDensity?: "full" | "subtle";
}) {
  return (
    <>
      <Starfield density={starfieldDensity} />
      <SiteNav />
      <main>
        <section>
          <SectionLabel>{sectionLabel}</SectionLabel>
          <h2>{title}</h2>
          {children}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
