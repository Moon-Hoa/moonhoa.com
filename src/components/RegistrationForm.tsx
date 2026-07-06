"use client";

import { useState } from "react";
import LotPicker from "./LotPicker";
import Turnstile from "./Turnstile";

type Status = "idle" | "submitting" | "sent" | "error";

export default function RegistrationForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [lotId, setLotId] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!lotId) {
      setError("Pick a lot first.");
      return;
    }
    if (!turnstileToken) {
      setError("Please complete the verification challenge.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, lotId, turnstileToken }),
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
        <h3>Check Your Email</h3>
        <p>
          We&apos;ve sent a verification link to <strong>{email}</strong>.
          Click it to confirm your membership and claim <strong>{lotId}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
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

      <label className="registration-field">
        <span>Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>

      <div className="registration-field">
        <span>{lotId ? `Selected lot: ${lotId}` : "Choose your lot"}</span>
        <LotPicker selectedLotId={lotId} onSelect={setLotId} />
      </div>

      <div className="registration-field">
        <Turnstile
          siteKey={turnstileSiteKey}
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
        />
      </div>

      {error && <p className="registration-error">{error}</p>}

      <button type="submit" className="registration-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Register"}
      </button>
    </form>
  );
}
