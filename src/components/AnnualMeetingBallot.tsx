"use client";

import { useState } from "react";
import { ballotResolutions } from "@/lib/staticPagesContent";

type Vote = "yes" | "no" | "abstain";

export default function AnnualMeetingBallot() {
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [submitted, setSubmitted] = useState(false);

  const allVoted = ballotResolutions.every((r) => votes[r.id]);

  if (submitted) {
    return (
      <div className="registration-success">
        <h3>Ballot Recorded</h3>
        <p>
          Your vote has been recorded and will have no bearing on the
          outcome, per longstanding Board precedent. Thank you for
          participating in Association democracy.
        </p>
      </div>
    );
  }

  return (
    <form
      className="registration-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      {ballotResolutions.map((resolution) => (
        <div className="registration-field" key={resolution.id}>
          <span>
            {resolution.title}: {resolution.description}
          </span>
          <div className="ballot-options">
            {(["yes", "no", "abstain"] as const).map((option) => (
              <label className="ballot-option" key={option}>
                <input
                  type="radio"
                  name={resolution.id}
                  value={option}
                  required
                  checked={votes[resolution.id] === option}
                  onChange={() => setVotes((prev) => ({ ...prev, [resolution.id]: option }))}
                />
                {option === "yes" ? "Yes" : option === "no" ? "No" : "Abstain"}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button type="submit" className="registration-submit" disabled={!allVoted}>
        Cast Ballot
      </button>
    </form>
  );
}
