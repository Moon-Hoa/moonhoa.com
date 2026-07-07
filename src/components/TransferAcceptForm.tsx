"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "done" | "error";

export default function TransferAcceptForm({
  lotId,
  needsDisplayName,
}: {
  lotId: string;
  needsDisplayName: boolean;
}) {
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/transfer/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lotId, displayName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="registration-success">
        <h3>It&apos;s Yours</h3>
        <p>
          You are now the registered owner of <strong>{lotId}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      {needsDisplayName && (
        <label className="registration-field">
          <span>Display name</span>
          <input
            type="text"
            required
            maxLength={40}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Tycho Homesteader"
          />
        </label>
      )}

      {error && <p className="registration-error">{error}</p>}

      <button type="submit" className="registration-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Accepting…" : "Accept Ownership"}
      </button>
    </form>
  );
}
