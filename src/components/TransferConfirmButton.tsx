"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

export default function TransferConfirmButton({
  lotId,
  recipientEmail,
}: {
  lotId: string;
  recipientEmail: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/transfer/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lotId }),
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
      <div className="registration-success">
        <h3>Confirmation Sent</h3>
        <p>
          We&apos;ve emailed <strong>{recipientEmail}</strong> to accept
          ownership of <strong>{lotId}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      {error && <p className="registration-error">{error}</p>}
      <button
        type="button"
        className="registration-submit"
        onClick={handleConfirm}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Confirming…" : `Confirm Transfer to ${recipientEmail}`}
      </button>
    </div>
  );
}
