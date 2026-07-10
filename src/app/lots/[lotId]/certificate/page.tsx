import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { cellsForLotId, cellToDeg } from "@/lib/lots";

export const revalidate = 45;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lotId: string }>;
}): Promise<Metadata> {
  const { lotId } = await params;
  return { title: `Certificate of Lunar Lot Ownership — ${lotId}` };
}

export default async function CertificatePage({ params }: { params: Promise<{ lotId: string }> }) {
  const { lotId } = await params;

  try {
    cellsForLotId(lotId);
  } catch {
    notFound();
  }

  if (!isSupabaseConfigured()) {
    return (
      <SiteShell sectionLabel="§ 15.3 — Registry Profile & Certificate Standards" title={lotId}>
        <p className="registration-error">
          The registry isn&apos;t connected yet — Supabase hasn&apos;t been
          configured. Try again once the site&apos;s off the ground.
        </p>
      </SiteShell>
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

  if (!ownerName) {
    return (
      <SiteShell sectionLabel="§ 15.3 — Registry Profile & Certificate Standards" title={lotId}>
        <p>
          This lot is unclaimed, so no Certificate has been issued.{" "}
          <Link href="/register">Register</Link> to claim it and generate
          one.
        </p>
      </SiteShell>
    );
  }

  return (
    <SiteShell sectionLabel="§ 15.3 — Registry Profile & Certificate Standards" title="Certificate of Lunar Lot Ownership">
      <p>
        Per §15.3.1, every successful lot registration is issued a
        Certificate of Lunar Lot Ownership, reflecting the registered
        coordinates, the resident&apos;s name, and their compliance
        obligations under the Charter. The Certificate carries no voting
        rights independent of the quorum requirements at §5.3.6.
      </p>

      <div className="certificate">
        <div className="certificate-seal">🌕</div>
        <div className="certificate-eyebrow">Moon Homeowners Association</div>
        <div className="certificate-title">Certificate of Lunar Lot Ownership</div>

        <div className="certificate-lot">{lot.lot_id}</div>

        <div className="certificate-field">
          <div className="certificate-field-label">Registered Owner</div>
          <div className="certificate-field-value">{ownerName}</div>
        </div>
        <div className="certificate-field">
          <div className="certificate-field-label">Selenographic Coordinates</div>
          <div className="certificate-field-value">
            {cellToDeg(lot.lat_cell).toFixed(1)}°, {cellToDeg(lot.lon_cell).toFixed(1)}°
          </div>
        </div>
        {lot.claimed_at && (
          <div className="certificate-field">
            <div className="certificate-field-label">Registered</div>
            <div className="certificate-field-value">{new Date(lot.claimed_at).toLocaleDateString()}</div>
          </div>
        )}

        <p className="certificate-footer">
          Issued subject to all provisions of the Lunar Residential
          Charter, including but not limited to compliance obligations
          under Parts III, IV, and VI. Carries no voting rights
          independent of quorum requirements under §5.3.6.
        </p>
      </div>

      <p style={{ marginTop: 24 }}>
        <Link href={`/lots/${lotId}`}>&larr; Back to lot details</Link>
      </p>
    </SiteShell>
  );
}
