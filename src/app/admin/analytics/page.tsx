import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import AdminLoginForm from "@/components/AdminLoginForm";
import { Panel, PanelRow } from "@/components/Panel";
import { getAdminUser } from "@/lib/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Analytics — Moon Homeowners Association Admin",
};

export default async function AdminAnalyticsPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <Shell>
        <p>Sign in with an authorized administrator email to continue.</p>
        <AdminLoginForm />
      </Shell>
    );
  }

  if (!isSupabaseAdminConfigured()) {
    return (
      <Shell>
        <p className="registration-error">
          Analytics needs the service-role key configured — see README.
        </p>
      </Shell>
    );
  }

  const admin = createSupabaseAdminClient();

  const [{ data: byDay }, { data: mostReported }, { data: mostTransferred }] = await Promise.all([
    admin.from("registrations_by_day").select("day, registrations").limit(14),
    admin.from("most_reported_lots").select("lot_id, report_count").limit(10),
    admin.from("most_transferred_lots").select("lot_id, transfer_count").limit(10),
  ]);

  const maxRegistrations = Math.max(1, ...(byDay ?? []).map((row) => row.registrations));

  return (
    <Shell>
      <h3>Registrations, Last 14 Days</h3>
      {(byDay ?? []).length === 0 ? (
        <p className="lot-picker-note">No registrations yet.</p>
      ) : (
        <div className="analytics-bars">
          {byDay!.map((row) => (
            <div className="analytics-bar-row" key={row.day}>
              <span className="analytics-bar-label">{new Date(row.day).toLocaleDateString()}</span>
              <div className="analytics-bar-track">
                <div
                  className="analytics-bar-fill"
                  style={{ width: `${(row.registrations / maxRegistrations) * 100}%` }}
                />
              </div>
              <span className="analytics-bar-value">{row.registrations}</span>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: 40 }}>Most Reported Lots</h3>
      {(mostReported ?? []).length === 0 ? (
        <p className="lot-picker-note">No reports filed yet.</p>
      ) : (
        <Panel>
          {mostReported!.map((row) => (
            <PanelRow href={`/lots/${row.lot_id}`} className="admin-row admin-row-compact" key={row.lot_id}>
              <span className="admin-cell-lot">{row.lot_id}</span>
              <span className="admin-cell-date">
                {row.report_count} report{row.report_count === 1 ? "" : "s"}
              </span>
            </PanelRow>
          ))}
        </Panel>
      )}

      <h3 style={{ marginTop: 40 }}>Most Transferred Lots</h3>
      {(mostTransferred ?? []).length === 0 ? (
        <p className="lot-picker-note">No transfers yet.</p>
      ) : (
        <Panel>
          {mostTransferred!.map((row) => (
            <PanelRow href={`/lots/${row.lot_id}`} className="admin-row admin-row-compact" key={row.lot_id}>
              <span className="admin-cell-lot">{row.lot_id}</span>
              <span className="admin-cell-date">
                {row.transfer_count} transfer{row.transfer_count === 1 ? "" : "s"}
              </span>
            </PanelRow>
          ))}
        </Panel>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell sectionLabel="§ 13.1 — Administration" title="Analytics">
      <p>
        <Link href="/admin">&larr; Back to the admin dashboard</Link>
      </p>
      {children}
    </SiteShell>
  );
}
