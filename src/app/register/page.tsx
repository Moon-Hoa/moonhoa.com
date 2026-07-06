import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import RegistrationForm from "@/components/RegistrationForm";
import { getTurnstileSiteKey } from "@/lib/turnstile";

export const metadata: Metadata = {
  title: "Register — Moon Homeowners Association",
};

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "That verification link was missing its code. Please register again.",
  verification_failed: "That verification link is invalid or has expired. Please register again.",
  member_creation_failed: "Something went wrong finishing your registration. Please try again.",
  lot_taken: "Your membership is confirmed, but someone else claimed that lot first. Register again to pick another.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const turnstileSiteKey = getTurnstileSiteKey();

  return (
    <>
      <Starfield />
      <SiteNav />

      <main>
        <section id="register">
          <SectionLabel>§ 6.0 — New Member Registration</SectionLabel>
          <h2>Claim Your Plot</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>

          <p>
            Complete the form below to register as a duly recognized Moon
            Homeowners Association member. Membership is automatic upon
            occupancy and cannot be revoked, transferred, or escaped.
          </p>

          {error && ERROR_MESSAGES[error] && (
            <p className="registration-error">{ERROR_MESSAGES[error]}</p>
          )}

          <RegistrationForm turnstileSiteKey={turnstileSiteKey} />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
