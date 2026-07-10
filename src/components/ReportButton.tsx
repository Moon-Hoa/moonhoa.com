"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

export default function ReportButton({ lotId }: { lotId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lotId, reason }),
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
        Complaint filed under §14.2. The Board will investigate with its usual thoroughness.
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" className="report-trigger" onClick={() => setOpen(true)}>
        File a Neighbour Complaint (§14.2)
      </button>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit} style={{ maxWidth: 480, marginTop: 16 }}>
      <p style={{ fontSize: ".85rem" }}>
        This is the official §14.2 Neighbour Complaint Procedure — the
        equivalent of Form LRA-COMPLAINT-1. Complaints regarding dust
        drift, noise, or exterior decoration may not be submitted
        anonymously; per §14.2.1, only complaints concerning unauthorised
        surface writing qualify for the anonymous-tip carve-out. Filing a
        knowingly false complaint is itself a violation under §4.5.1 and
        carries a 150 OC fine per §14.2.2.
      </p>
      <label className="registration-field">
        <span>Reason (optional)</span>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          placeholder="e.g. suspected duplicate claim"
        />
      </label>

      {error && <p className="registration-error">{error}</p>}

      <button type="submit" className="registration-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Submit Complaint"}
      </button>
    </form>
  );
}
