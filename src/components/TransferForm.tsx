"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";
type Step = "closed" | "certificate" | "form";

export default function TransferForm({
  lotId,
  inGoodStanding,
  poolFundedPct,
}: {
  lotId: string;
  inGoodStanding: boolean | null;
  poolFundedPct: number | null;
}) {
  const [step, setStep] = useState<Step>("closed");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/transfer/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lotId, recipientEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="lot-picker-note">
        If {recipientEmail} matches this lot&apos;s registered owner, a
        confirmation link is on its way to their inbox.
      </p>
    );
  }

  if (step === "closed") {
    return (
      <button type="button" className="report-trigger" onClick={() => setStep("certificate")}>
        Transfer this lot
      </button>
    );
  }

  if (step === "certificate") {
    return (
      <div className="certificate" style={{ maxWidth: 420, marginTop: 16, padding: "24px 28px" }}>
        <div className="certificate-eyebrow">Document Processing Centre</div>
        <div className="certificate-title" style={{ fontSize: "1.1rem" }}>
          Lot Transfer &amp; Resale Certificate
        </div>
        <p style={{ fontSize: ".85rem", color: "var(--text-dim)", marginBottom: 16 }}>
          Per §2.4.2, required for every property transfer. Discloses the
          property&apos;s standing, open violations, and reserve fund
          status as of the date of issue.
        </p>

        <div className="certificate-field">
          <div className="certificate-field-label">Standing (§2.5)</div>
          <div className="certificate-field-value" style={{ fontSize: ".95rem" }}>
            {inGoodStanding === null ? "Not on file" : inGoodStanding ? "Good Standing — no open Tier 2/3 violations" : "Not in Good Standing"}
          </div>
        </div>
        <div className="certificate-field">
          <div className="certificate-field-label">Reserve Fund Status (§6.5)</div>
          <div className="certificate-field-value" style={{ fontSize: ".95rem" }}>
            {poolFundedPct === null
              ? "Not on file"
              : `Zero-Gravity Swimming Pool Reserve Component: ${poolFundedPct}% funded${poolFundedPct < 30 ? " — critical shortfall" : ""}`}
          </div>
        </div>
        <div className="certificate-field">
          <div className="certificate-field-label">Certificate Fee</div>
          <div className="certificate-field-value" style={{ fontSize: ".95rem" }}>45 OC</div>
        </div>

        <p className="certificate-footer">
          Does not disclose, and the Association accepts no liability
          regarding, the current location of any Association amenity that
          has become separated from its registered coordinates.
        </p>

        <button
          type="button"
          className="registration-submit"
          style={{ marginTop: 16 }}
          onClick={() => setStep("form")}
        >
          Issue Certificate (45 OC) &amp; Continue
        </button>
      </div>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit} style={{ maxWidth: 420, marginTop: 16 }}>
      <label className="registration-field">
        <span>Recipient&apos;s email</span>
        <input
          type="email"
          required
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="newowner@example.com"
        />
      </label>

      <p style={{ fontSize: ".82rem", color: "var(--text-dim)", marginBottom: 0 }}>
        We&apos;ll email the lot&apos;s current registered owner to confirm
        before anything changes hands. Certificate issued above.
      </p>

      {error && <p className="registration-error">{error}</p>}

      <button type="submit" className="registration-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Start Transfer"}
      </button>
    </form>
  );
}
