"use client";

import { useMemo, useState } from "react";
import type { FineRow } from "./FineCalculator";

const BOARD_SIGNATURES = [
  "Chairperson Adaeze Okafor",
  "Deputy Director of Surface Standards Tobias Renn",
  "[Position Vacant — Intent Endorsed.] (Keeper of the Dust Drift Ledger)",
  "Director of Community Relations Youssef Haddad",
  "Chief Albedo Officer Priya Anand",
  "Treasurer Marcus Ilves",
  "At-Large Member Ingrid Solheim",
];

export default function ViolationNoticeGenerator({ fines }: { fines: FineRow[] }) {
  const [lotId, setLotId] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return fines;
    return fines.filter((f) => f.violation.toLowerCase().includes(q));
  }, [fines, search]);

  const selected = fines.find((f) => f.id === selectedId) ?? null;

  if (generated && selected) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14);

    return (
      <div className="certificate" style={{ textAlign: "left", padding: "32px 36px" }}>
        <div className="certificate-eyebrow" style={{ textAlign: "center" }}>
          Office of the Chairperson &middot; Moon Homeowners Association
        </div>
        <div className="certificate-title" style={{ textAlign: "center", fontSize: "1.3rem" }}>
          Strongly Worded Letter
        </div>

        <p className="oath-text" style={{ fontStyle: "normal", marginTop: 24 }}>
          To the Registered Resident of <strong>{lotId || "[LOT NOT SPECIFIED]"}</strong>:
        </p>
        <p className="oath-text" style={{ fontStyle: "normal" }}>
          It has come to the Board&apos;s attention that your property is in
          violation of <strong>§{selected.charter_section}</strong> (
          {selected.violation}). The Board wishes to convey its
          disappointment — not anger, disappointment, which as every
          resident eventually learns is considerably worse.
        </p>
        <p className="oath-text" style={{ fontStyle: "normal" }}>
          The standard fine for this violation is{" "}
          <strong>{selected.standard_fine_oc} OC</strong>. You are required
          to remediate the underlying condition and remit payment no later
          than <strong>{deadline.toLocaleDateString()}</strong>. Failure to do so will result in
          escalation per the standard enforcement sequence at §6.3.2.
        </p>
        {selected.notes && <p className="oath-text" style={{ fontStyle: "normal" }}>{selected.notes}</p>}
        <p className="oath-text" style={{ fontStyle: "normal" }}>
          The Board trusts this letter finds you well, all things
          considered.
        </p>

        <div style={{ marginTop: 24, fontSize: ".78rem", color: "var(--text-dim)" }}>
          Countersigned by the full sitting Board, per §6.4.4:
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            {BOARD_SIGNATURES.map((sig) => (
              <li key={sig}>{sig}</li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="registration-submit"
          style={{ marginTop: 8 }}
          onClick={() => setGenerated(false)}
        >
          Generate Another
        </button>
      </div>
    );
  }

  return (
    <div className="lot-picker">
      <input
        type="text"
        placeholder="Lot code (e.g. MOON-0472-1188)"
        value={lotId}
        onChange={(e) => setLotId(e.target.value)}
        className="lot-picker-search"
      />
      <input
        type="text"
        placeholder="Search a violation"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="lot-picker-search"
      />

      {filtered.length === 0 ? (
        <p className="lot-picker-note">No matching violation on file.</p>
      ) : (
        <div className="lot-picker-grid" style={{ maxHeight: 220 }}>
          {filtered.map((f) => (
            <button
              type="button"
              key={f.id}
              className={`lot-picker-item${f.id === selectedId ? " selected" : ""}`}
              onClick={() => setSelectedId(f.id)}
              style={{ textAlign: "left", height: "auto", padding: "8px 10px" }}
            >
              {f.violation} (§{f.charter_section})
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="registration-submit"
        disabled={!selected}
        onClick={() => setGenerated(true)}
      >
        Draft Strongly Worded Letter
      </button>
    </div>
  );
}
