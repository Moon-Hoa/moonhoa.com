import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import AdminLoginForm from "@/components/AdminLoginForm";
import { Panel, PanelRow } from "@/components/Panel";
import { getAdminUser } from "@/lib/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { banMember, unbanMember, delistLot, dismissReport, actionReport, signOutAdmin } from "./actions";

export const metadata: Metadata = {
  title: "Admin — Moon Homeowners Association",
};

// Not linked from the public nav — reachable only by URL, gated by
// getAdminUser() below regardless.
export default async function AdminPage() {
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
          The admin dashboard needs the service-role key configured — see README.
        </p>
      </Shell>
    );
  }

  const admin = createSupabaseAdminClient();

  const [{ data: reports }, { data: members }, { data: lots }] = await Promise.all([
    admin
      .from("reports")
      .select("id, lot_id, reason, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false }),
    admin
      .from("members")
      .select("id, email, display_name, is_banned, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    admin
      .from("lots")
      .select("lot_id, claimed_at")
      .not("owner_id", "is", null)
      .order("claimed_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <Shell>
      <div className="admin-header">
        <p style={{ marginBottom: 0 }}>Signed in as {user.email}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/admin/analytics" className="admin-signout">
            Analytics
          </Link>
          <form action={signOutAdmin}>
            <button type="submit" className="admin-signout">
              Sign Out
            </button>
          </form>
        </div>
      </div>

      <h3>Open Reports ({reports?.length ?? 0})</h3>
      {(reports ?? []).length === 0 ? (
        <p className="lot-picker-note">No open reports.</p>
      ) : (
        <Panel>
          {reports!.map((report) => (
            <PanelRow className="admin-row" key={report.id}>
              <span className="admin-cell-lot">{report.lot_id}</span>
              <span>{report.reason || "No reason given"}</span>
              <span className="admin-cell-date">{new Date(report.created_at).toLocaleDateString()}</span>
              <div className="admin-actions">
                <form action={dismissReport.bind(null, report.id)}>
                  <button type="submit">Dismiss</button>
                </form>
                <form action={actionReport.bind(null, report.id)}>
                  <button type="submit">Mark Actioned</button>
                </form>
                <form action={delistLot.bind(null, report.lot_id)}>
                  <button type="submit" className="admin-danger">
                    Delist Lot
                  </button>
                </form>
              </div>
            </PanelRow>
          ))}
        </Panel>
      )}

      <h3 style={{ marginTop: 40 }}>Members</h3>
      {(members ?? []).length === 0 ? (
        <p className="lot-picker-note">No registered members yet.</p>
      ) : (
        <Panel>
          {members!.map((member) => (
            <PanelRow className="admin-row" key={member.id}>
              <span>{member.display_name}</span>
              <span>{member.email}</span>
              <span className="admin-cell-date">{member.is_banned ? "Banned" : "Active"}</span>
              <div className="admin-actions">
                {member.is_banned ? (
                  <form action={unbanMember.bind(null, member.id)}>
                    <button type="submit">Unban</button>
                  </form>
                ) : (
                  <form action={banMember.bind(null, member.id)}>
                    <button type="submit" className="admin-danger">
                      Ban + Delist Lots
                    </button>
                  </form>
                )}
              </div>
            </PanelRow>
          ))}
        </Panel>
      )}

      <h3 style={{ marginTop: 40 }}>Claimed Lots</h3>
      {(lots ?? []).length === 0 ? (
        <p className="lot-picker-note">No claimed lots yet.</p>
      ) : (
        <Panel>
          {lots!.map((lot) => (
            <PanelRow className="admin-row" key={lot.lot_id}>
              <span className="admin-cell-lot">{lot.lot_id}</span>
              <span>{lot.claimed_at ? new Date(lot.claimed_at).toLocaleDateString() : "—"}</span>
              <span />
              <div className="admin-actions">
                <form action={delistLot.bind(null, lot.lot_id)}>
                  <button type="submit" className="admin-danger">
                    Delist
                  </button>
                </form>
              </div>
            </PanelRow>
          ))}
        </Panel>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell sectionLabel="§ 13.0 — Administration" title="Admin Dashboard">
      {children}
    </SiteShell>
  );
}
