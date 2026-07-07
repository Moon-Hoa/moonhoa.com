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
        Report submitted. The Board will investigate with its usual thoroughness.
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" className="report-trigger" onClick={() => setOpen(true)}>
        Report this listing
      </button>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit} style={{ maxWidth: 480, marginTop: 16 }}>
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
        {status === "submitting" ? "Submitting…" : "Submit Report"}
      </button>
    </form>
  );
}
