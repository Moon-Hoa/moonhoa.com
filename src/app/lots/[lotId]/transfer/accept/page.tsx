import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import TransferAcceptForm from "@/components/TransferAcceptForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Accept Transfer — Moon Homeowners Association",
};

const EXPIRED_MESSAGE = "This confirmation link is invalid or has expired.";

export default async function TransferAcceptPage({
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
      {error ? <p className="registration-error">{EXPIRED_MESSAGE}</p> : <AcceptBody lotId={lotId} />}
    </Shell>
  );
}

async function AcceptBody({ lotId }: { lotId: string }) {
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

  const metaLotId = user.user_metadata?.accept_transfer_lot_id as string | undefined;
  const fromOwnerId = user.user_metadata?.transfer_from_owner_id as string | undefined;

  if (!metaLotId || metaLotId !== lotId || !fromOwnerId) {
    return <p className="registration-error">This confirmation link doesn&apos;t match a pending transfer.</p>;
  }

  const admin = createSupabaseAdminClient();
  const { data: lot } = await admin.from("lots").select("owner_id").eq("lot_id", lotId).maybeSingle();

  if (!lot || lot.owner_id !== fromOwnerId) {
    return (
      <p className="registration-error">
        This lot has already changed hands since the transfer was confirmed.
      </p>
    );
  }

  const { data: existingMember } = await admin.from("members").select("id").eq("id", user.id).maybeSingle();

  return (
    <>
      <p>
        You&apos;ve been offered ownership of <strong>{lotId}</strong>.
      </p>
      <TransferAcceptForm lotId={lotId} needsDisplayName={!existingMember} />
    </>
  );
}

function Shell({ lotId, children }: { lotId: string; children: React.ReactNode }) {
  return (
    <SiteShell sectionLabel="§ 14.1 — Accept Ownership" title={`Accept ${lotId}`}>
      {children}
    </SiteShell>
  );
}
