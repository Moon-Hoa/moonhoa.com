"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

export default function TransferForm({ lotId }: { lotId: string }) {
  const [open, setOpen] = useState(false);
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

  if (!open) {
    return (
      <button type="button" className="report-trigger" onClick={() => setOpen(true)}>
        Transfer this lot
      </button>
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

      <p style={{ fontSize: ".82rem", color: "var(--text-dim)" }}>
        We&apos;ll email the lot&apos;s current registered owner to confirm
        before anything changes hands.
      </p>

      <p style={{ fontSize: ".82rem", color: "var(--text-dim)", marginBottom: 0 }}>
        Per §2.4.2, this transfer additionally requires a Lot Transfer &amp;
        Resale Certificate (45 OC, from the Document Processing Centre),
        disclosing the property&apos;s assessment balance, open violations,
        and reserve fund status as of the date of issue. The certificate
        does not disclose, and the Association accepts no liability
        regarding, the current location of any Association amenity that
        has become separated from its registered coordinates.
      </p>

      {error && <p className="registration-error">{error}</p>}

      <button type="submit" className="registration-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Start Transfer"}
      </button>
    </form>
  );
}
