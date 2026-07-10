import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import ViolationNoticeGenerator from "@/components/ViolationNoticeGenerator";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Strongly Worded Letter Generator — Moon Homeowners Association",
};

// So the generator picks up the live fines_schedule table once seeded,
// rather than staying frozen at "not seeded yet" from build time.
export const revalidate = 45;

export default function ViolationNoticePage() {
  return (
    <SiteShell sectionLabel="§ 6.4 — The Strongly Worded Letter Protocol" title="Draft a Strongly Worded Letter">
      <p>
        The Strongly Worded Letter is the Association&apos;s primary
        instrument of persuasion — legally non-binding, psychologically
        effective. Per §6.4.3, every letter contains a formal salutation,
        a precise description of the violation, a citation of the
        relevant Charter section, a statement of the Board&apos;s
        disappointment, required remediation, a deadline, and a closing
        line that leaves no doubt about the Board&apos;s feelings.
        Countersigned by the full sitting Board, per §6.4.4 — including
        the vacant Keeper&apos;s seat.
      </p>
      <NoticeGeneratorSection />
    </SiteShell>
  );
}

async function NoticeGeneratorSection() {
  if (!isSupabaseConfigured()) {
    return <p className="lot-picker-note">Generator isn&apos;t connected yet — Supabase hasn&apos;t been configured.</p>;
  }

  const supabase = createSupabasePublicClient();
  const { data: fines, error } = await supabase
    .from("fines_schedule")
    .select("id, charter_section, violation, standard_fine_oc, notes")
    .order("violation", { ascending: true });

  if (error || !fines || fines.length === 0) {
    return <p className="lot-picker-note">The fine schedule isn&apos;t seeded in this environment yet.</p>;
  }

  return <ViolationNoticeGenerator fines={fines} />;
}
