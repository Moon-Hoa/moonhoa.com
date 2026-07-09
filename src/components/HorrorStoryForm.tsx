"use client";

import { useState } from "react";

export default function HorrorStoryForm() {
  const [story, setStory] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="registration-success">
        <h3>Story Received</h3>
        <p style={{ marginBottom: 0 }}>
          Thank you for your submission. It has been forwarded to the
          Director of Community Relations for consideration in a future
          HOA Gazette. The Board reviews all submissions and is under no
          obligation to publish them, consistent with its general
          practice under §5.2.
        </p>
      </div>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <label className="registration-field">
        <span>Your Story</span>
        <input
          type="text"
          required
          value={story}
          onChange={(e) => setStory(e.target.value)}
          maxLength={500}
          placeholder="e.g. My neighbor's inflatable Martian appeared overnight..."
        />
      </label>

      <p style={{ fontSize: ".82rem", color: "var(--text-dim)", marginBottom: 0 }}>
        This is a Gazette submission, not a formal §14.2 complaint — it
        won&apos;t trigger an investigation. To file an official complaint
        about a specific lot, use the report tool on that lot&apos;s page
        instead.
      </p>

      <button type="submit" className="registration-submit">
        Submit Story
      </button>
    </form>
  );
}
