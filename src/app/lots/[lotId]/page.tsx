import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Starfield from "@/components/Starfield";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SectionLabel from "@/components/SectionLabel";
import Ornament from "@/components/Ornament";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { cellsForLotId, cellToDeg } from "@/lib/lots";

// Lazily generated + cached per lot on first visit, revalidated at most every
// 45s — the same ISR cadence as the registry, applied per lot page instead
// of pre-rendering all ~350k lots at build time.
export const revalidate = 45;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lotId: string }>;
}): Promise<Metadata> {
  const { lotId } = await params;
  return { title: `${lotId} — Moon Homeowners Association Registry` };
}

export default async function LotLookupPage({ params }: { params: Promise<{ lotId: string }> }) {
  const { lotId } = await params;

  try {
    cellsForLotId(lotId);
  } catch {
    notFound();
  }

  if (!isSupabaseConfigured()) {
    return (
      <LotLookupShell lotId={lotId}>
        <p className="registration-error">
          The registry isn&apos;t connected yet — Supabase hasn&apos;t been
          configured. Try again once the site&apos;s off the ground.
        </p>
      </LotLookupShell>
    );
  }

  const supabase = createSupabasePublicClient();

  const { data: lot } = await supabase
    .from("lots")
    .select("lot_id, lat_cell, lon_cell, owner_id, claimed_at")
    .eq("lot_id", lotId)
    .maybeSingle();

  if (!lot) notFound();

  let ownerName: string | null = null;
  if (lot.owner_id) {
    const { data: owner } = await supabase
      .from("member_public_profiles")
      .select("display_name")
      .eq("id", lot.owner_id)
      .maybeSingle();
    ownerName = owner?.display_name ?? null;
  }

  const { data: transfers } = await supabase
    .from("ownership_transfers")
    .select("transferred_at")
    .eq("lot_id", lotId)
    .order("transferred_at", { ascending: false });

  const transferCount = transfers?.length ?? 0;

  return (
    <LotLookupShell lotId={lotId}>
      <div className="lot-detail">
        <div className="lot-detail-row">
          <span>Selenographic coordinates</span>
          <strong>
            {cellToDeg(lot.lat_cell).toFixed(1)}°, {cellToDeg(lot.lon_cell).toFixed(1)}°
          </strong>
        </div>
        <div className="lot-detail-row">
          <span>Status</span>
          <strong>{ownerName ? "Claimed" : "Unclaimed"}</strong>
        </div>
        {ownerName && (
          <div className="lot-detail-row">
            <span>Registered owner</span>
            <strong>{ownerName}</strong>
          </div>
        )}
        {lot.claimed_at && (
          <div className="lot-detail-row">
            <span>Claimed</span>
            <strong>{new Date(lot.claimed_at).toLocaleDateString()}</strong>
          </div>
        )}
        <div className="lot-detail-row">
          <span>Ownership history</span>
          <strong>
            {transferCount === 0
              ? "Never changed hands"
              : `Changed hands ${transferCount} time${transferCount === 1 ? "" : "s"}`}
          </strong>
        </div>
      </div>

      {!ownerName && (
        <p style={{ marginTop: 24 }}>
          This lot is unclaimed. <Link href="/register">Register</Link> to make it yours.
        </p>
      )}
    </LotLookupShell>
  );
}

function LotLookupShell({ lotId, children }: { lotId: string; children: React.ReactNode }) {
  return (
    <>
      <Starfield />
      <SiteNav />
      <main>
        <section>
          <SectionLabel>§ 7.1 — Lot Lookup</SectionLabel>
          <h2>{lotId}</h2>
          <Ornament style={{ marginBottom: 32 }}>❧</Ornament>
          {children}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
