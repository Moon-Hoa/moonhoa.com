import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";

export const metadata: Metadata = {
  title: "Welcome — Moon Homeowners Association",
};

export default async function RegistrationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ lot?: string }>;
}) {
  const { lot } = await searchParams;

  return (
    <>
      <Starfield />
      <SiteNav />

      <main>
        <section>
          <SectionLabel>§ 6.1 — Welcome, Homesteader</SectionLabel>
          <h2>You&apos;re Officially Registered</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          {lot ? (
            <p>
              Congratulations — you are now the registered owner of lot{" "}
              <strong>{lot}</strong>. A strongly worded letter will follow
              shortly, as tradition dictates.
            </p>
          ) : (
            <p>
              Your membership is confirmed, though a lot wasn&apos;t
              assigned. The Board regrets any inconvenience and reminds you
              that regret is not the same as a refund.
            </p>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
