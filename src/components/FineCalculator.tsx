"use client";

import { useMemo, useState } from "react";

export interface FineRow {
  id: string;
  charter_section: string;
  violation: string;
  standard_fine_oc: number;
  notes: string | null;
}

// Same unfavourable rate as the rest of the site (Appendix T, 2094 snapshot).
const OC_PER_USD = 1.31;

export default function FineCalculator({ fines }: { fines: FineRow[] }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return fines;
    return fines.filter(
      (f) => f.violation.toLowerCase().includes(q) || f.charter_section.includes(q)
    );
  }, [fines, search]);

  const selected = fines.find((f) => f.id === selectedId) ?? null;

  return (
    <div className="lot-picker">
      <input
        type="text"
        placeholder="Search a violation (e.g. dust drift, howling, monolith)"
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

      {selected && (
        <div className="notice" style={{ marginTop: 8 }}>
          <h3>{selected.violation}</h3>
          <p>
            <strong>§{selected.charter_section}</strong> — {selected.standard_fine_oc} OC (≈ $
            {(selected.standard_fine_oc / OC_PER_USD).toFixed(0)} at this quarter&apos;s rate, Appendix T)
          </p>
          {selected.notes && <p style={{ marginBottom: 0 }}>{selected.notes}</p>}
        </div>
      )}
    </div>
  );
}
