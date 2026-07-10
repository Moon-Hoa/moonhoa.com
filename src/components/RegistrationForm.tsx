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
  const [oathSworn, setOathSworn] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!lotId) {
      setError("Pick a lot first.");
      return;
    }
    if (!oathSworn) {
      setError("The Oath of Lunar Civic Responsibility must be sworn before registration can proceed (§2.3.1).");
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

      <div className="oath-block">
        <div className="oath-eyebrow">§2.3.3 — Oath of Lunar Civic Responsibility</div>
        <p className="oath-text">
          I, <strong>{displayName || "[NAME]"}</strong>, of{" "}
          <strong>{lotId || "[CRATER ADDRESS]"}</strong>, do hereby solemnly
          swear to uphold the standards, regulations, and general aesthetic
          preferences of the Moon Homeowners Association. I acknowledge
          that my dust is my responsibility. I acknowledge that Earth can
          see me. I commit to never landing without notice, to keeping my
          reflectivity above 12%, and to attending the Annual HOA Meeting
          even if I have a prior engagement, which the Board will want
          documented. I accept that the Board&apos;s decisions are final.
          I accept that the Tribunal is not truly independent. I accept
          that my correspondence will go to spam. I do this not under
          duress, but because I want to live on the Moon, and this is
          what living on the Moon currently requires.
        </p>
        <label className="ballot-option">
          <input
            type="checkbox"
            checked={oathSworn}
            onChange={(e) => setOathSworn(e.target.checked)}
          />
          I swear this Oath.
        </label>
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
