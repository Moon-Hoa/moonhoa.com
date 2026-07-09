import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import FineTable from "@/components/FineTable";
import { fineSchedule, tribunalCases } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Schedule of Fines & Tribunal Appeals — Moon Homeowners Association",
};

export default function FinesPage() {
  return (
    <SiteShell sectionLabel="§ 6.2 / Appendix B, § 5.4" title="Schedule of Fines & Tribunal Appeals">
      <p>
        The following is a representative selection from the Association&apos;s
        full Master Schedule of Fines (Appendix B), which consolidates
        fine references scattered throughout Parts III, IV, VI, IX, X, XI,
        XIII, and XV. In the event of any conflict between the Appendix
        and the operative Section of the Charter, the operative Section
        governs — assuming you can determine which one that is.
      </p>

      <FineTable items={fineSchedule} />

      <div className="notice" style={{ marginTop: 32 }}>
        <h3>A Note on the Surface Writing Discrepancy</h3>
        <p style={{ marginBottom: 0 }}>
          Careful readers will notice the fine for unauthorised surface
          writing appears here as 75 OC, while §6.2 lists it as 50 OC. The
          Board has reviewed this discrepancy and would like to note that
          it is either a clerical error or a test. It has not decided
          which. Residents who report it through the Records Request
          Portal should not expect a different answer than the one
          printed above.
        </p>
      </div>

      <h3 style={{ marginTop: 40 }}>The Tribunal &amp; Appeals Process (§5.4)</h3>
      <p>
        Any resident who receives a fine, violation notice, or adverse
        decision may appeal to the Tribunal within 14 Earth days. The
        Tribunal consists of three Board members appointed by the
        Chairperson — who typically appoints herself. Hearings are
        scheduled within 60 days of filing, though in practice somewhat
        later. Prior to a hearing, residents are strongly encouraged
        (though not required) to attempt informal mediation under §14.1;
        roughly one in five disputes are resolved at that stage. The
        Tribunal&apos;s decisions are final — there is no further appeal
        within the Moon HOA system.
      </p>
      <p>
        A resident may instead appeal an individual fine directly within
        14 days per §6.8, or request a payment plan of up to 6 lunar
        cycles without appealing the underlying violation. Interest does
        not accrue on a fine under formal appeal, though it resumes,
        retroactive to the original due date, if the appeal is denied.
      </p>

      <h3 style={{ marginTop: 40 }}>Selected Tribunal Precedent (Appendix U)</h3>
      <p>
        The following general (non-Howling) cases are reproduced here as
        they are the ones most frequently requested through the Records
        Request Portal.
      </p>
      {tribunalCases.map((c) => (
        <div className="tribunal-case" key={c.caseNo}>
          <div className="tribunal-case-no">Case No. {c.caseNo}</div>
          <div className="decree-title" style={{ marginBottom: 4 }}>{c.name}</div>
          <p style={{ marginBottom: 0 }}>{c.summary}</p>
        </div>
      ))}
    </SiteShell>
  );
}
