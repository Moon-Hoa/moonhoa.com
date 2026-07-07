import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import TransferConfirmButton from "@/components/TransferConfirmButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Confirm Transfer — Moon Homeowners Association",
};

const EXPIRED_MESSAGE =
  "This confirmation link is invalid or has expired. Please start the transfer again from the lot page.";

export default async function TransferConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ lotId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { lotId } = await params;
  const { error } = await searchParams;

  return (
    <Shell lotId={lotId}>
      {error ? <p className="registration-error">{EXPIRED_MESSAGE}</p> : <ConfirmBody lotId={lotId} />}
    </Shell>
  );
}

async function ConfirmBody({ lotId }: { lotId: string }) {
  if (!isSupabaseAdminConfigured()) {
    return (
      <p className="registration-error">
        Transfers aren&apos;t live yet — Supabase hasn&apos;t been connected.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="registration-error">{EXPIRED_MESSAGE}</p>;
  }

  const metaLotId = user.user_metadata?.transfer_lot_id as string | undefined;
  const recipientEmail = user.user_metadata?.transfer_recipient_email as string | undefined;

  if (!metaLotId || metaLotId !== lotId || !recipientEmail) {
    return <p className="registration-error">This confirmation link doesn&apos;t match a pending transfer.</p>;
  }

  const admin = createSupabaseAdminClient();
  const { data: lot } = await admin.from("lots").select("owner_id").eq("lot_id", lotId).maybeSingle();

  if (!lot || lot.owner_id !== user.id) {
    return <p className="registration-error">You no longer own this lot.</p>;
  }

  return (
    <>
      <p>
        You are about to transfer <strong>{lotId}</strong> to{" "}
        <strong>{recipientEmail}</strong>.
      </p>
      <TransferConfirmButton lotId={lotId} recipientEmail={recipientEmail} />
    </>
  );
}

function Shell({ lotId, children }: { lotId: string; children: React.ReactNode }) {
  return (
    <>
      <Starfield />
      <SiteNav />
      <main>
        <section>
          <SectionLabel>§ 14.0 — Ownership Transfer</SectionLabel>
          <h2>Confirm Transfer of {lotId}</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>
          {children}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
