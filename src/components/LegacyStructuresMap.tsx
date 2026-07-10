"use client";

import { useState } from "react";

export interface MapStructure {
  id: string;
  site_name: string;
  lat: number;
  lon: number;
  register_status: string;
}

// Simple equirectangular projection — real lat/lon plotted directly, not
// bucketed. Unlike /density's grid (which only covers the seeded lot
// band, roughly ±25° lat / ±35° lon, a scarcity choice for the lot game),
// Legacy Structures span the whole Moon, poles included, so this covers
// the full -90..90 / -180..180 range instead of reusing that narrower grid.
export default function LegacyStructuresMap({ structures }: { structures: MapStructure[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = structures.find((s) => s.id === activeId) ?? null;

  return (
    <div style={{ marginTop: 16 }}>
      <div className="legacy-map">
        <div className="legacy-map-gridline" style={{ top: "50%" }} />
        <div className="legacy-map-gridline" style={{ left: "50%", width: 1, height: "100%", top: 0 }} />
        <span className="legacy-map-label" style={{ top: 2, left: 4 }}>90°N</span>
        <span className="legacy-map-label" style={{ bottom: 2, left: 4 }}>90°S</span>
        <span className="legacy-map-label" style={{ top: 2, right: 4 }}>180°E</span>
        <span className="legacy-map-label" style={{ top: 2, left: "50%", transform: "translateX(-50%)" }}>0°</span>

        {structures.map((s) => {
          const left = ((s.lon + 180) / 360) * 100;
          const top = ((90 - s.lat) / 180) * 100;
          const nonConforming = s.register_status.toLowerCase().includes("non-conforming");
          return (
            <button
              type="button"
              key={s.id}
              className={`legacy-map-marker${nonConforming ? " non-conforming" : ""}${activeId === s.id ? " active" : ""}`}
              style={{ left: `${left}%`, top: `${top}%` }}
              onMouseEnter={() => setActiveId(s.id)}
              onFocus={() => setActiveId(s.id)}
              aria-label={s.site_name}
            />
          );
        })}
      </div>

      <p className="lot-picker-note" style={{ marginTop: 8 }}>
        {active ? (
          <>
            <strong style={{ color: "var(--cream)" }}>{active.site_name}</strong> — {active.register_status}
          </>
        ) : (
          "Hover a marker for the site name and Register status."
        )}
      </p>
    </div>
  );
}
