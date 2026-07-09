import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import RecordsRequestForm from "@/components/RecordsRequestForm";
import { recordsFaq } from "@/lib/staticPagesContent";

export const metadata: Metadata = {
  title: "Records Request Portal — Moon Homeowners Association",
};

export default function RecordsRequestPage() {
  return (
    <SiteShell sectionLabel="§ 15.4 — Records Requests" title="Records Request Portal">
      <p>
        Registered residents may request copies of financial statements,
        meeting minutes, the current Reserve Study, and contractor bids.
        Requests are assigned a ticket number and an estimated response
        time of 1–3 lunar cycles. The Association is committed to
        transparency and processes all requests in the order received.
      </p>

      <RecordsRequestForm />

      <h3 style={{ marginTop: 40 }}>Frequently Submitted Requests (Appendix P)</h3>
      <p>
        The following questions account for a large share of Portal
        submissions. Standard responses are reproduced here so residents
        may skip the queue where their question is already answered.
      </p>
      {recordsFaq.map((item) => (
        <div key={item.question} style={{ marginTop: 20 }}>
          <div className="decree-title">{item.question}</div>
          <p className="decree-text" style={{ marginBottom: 0 }}>{item.response}</p>
        </div>
      ))}
    </SiteShell>
  );
}
