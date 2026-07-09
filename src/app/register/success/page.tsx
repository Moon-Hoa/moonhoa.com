import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";

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
    <SiteShell sectionLabel="§ 6.1 — Welcome, Homesteader" title="You're Officially Registered">
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
    </SiteShell>
  );
}
