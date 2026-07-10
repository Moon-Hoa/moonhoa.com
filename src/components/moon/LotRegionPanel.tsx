"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const HALF_SPAN_DEG = 1.5;
const DEBOUNCE_MS = 280;
// Skip re-fetching if the view center hasn't moved much — absorbs
// OrbitControls damping/inertia jitter after the user stops dragging.
const MIN_RECENTER_DEG = 0.3;

interface RegionLot {
  lot_id: string;
  lat_cell: number;
  lon_cell: number;
  claimed_at: string | null;
}

interface RegionResponse {
  lots: RegionLot[];
  inBounds: boolean;
  configured: boolean;
  error?: string;
}

export default function LotRegionPanel({ center }: { center: { latDeg: number; lonDeg: number } | null }) {
  const router = useRouter();
  const [lots, setLots] = useState<RegionLot[] | null>(null);
  const [inBounds, setInBounds] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(false);

  const lastFetchedCenter = useRef<{ latDeg: number; lonDeg: number } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!center) {
      lastFetchedCenter.current = null;
      setLots(null);
      return;
    }

    const last = lastFetchedCenter.current;
    if (
      last &&
      Math.abs(last.latDeg - center.latDeg) < MIN_RECENTER_DEG &&
      Math.abs(last.lonDeg - center.lonDeg) < MIN_RECENTER_DEG
    ) {
      return;
    }

    debounceRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      lastFetchedCenter.current = center;
      setLoading(true);

      const params = new URLSearchParams({
        latMin: String(center.latDeg - HALF_SPAN_DEG),
        latMax: String(center.latDeg + HALF_SPAN_DEG),
        lonMin: String(center.lonDeg - HALF_SPAN_DEG),
        lonMax: String(center.lonDeg + HALF_SPAN_DEG),
      });

      fetch(`/api/lots/region?${params}`, { signal: controller.signal })
        .then((res) => res.json() as Promise<RegionResponse>)
        .then((data) => {
          setLots(data.lots ?? []);
          setInBounds(data.inBounds);
          setConfigured(data.configured);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setLots([]);
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [center]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  if (!center) return null;

  return (
    <div className="moon-region-panel" role="region" aria-label="Lots in view">
      <p className="moon-region-panel-heading">
        Zoomed view — {center.latDeg.toFixed(1)}°{center.latDeg >= 0 ? "N" : "S"},{" "}
        {Math.abs(center.lonDeg).toFixed(1)}°{center.lonDeg >= 0 ? "E" : "W"}
      </p>

      {!inBounds && <p className="lot-picker-note">Outside Association jurisdiction — no lots here.</p>}
      {inBounds && !configured && (
        <p className="lot-picker-note">Demo mode — Supabase isn&apos;t connected, showing generated unclaimed lots.</p>
      )}
      {inBounds && loading && <p className="lot-picker-note">Loading lots…</p>}
      {inBounds && !loading && lots && lots.length === 0 && (
        <p className="lot-picker-note">No lots found in this view.</p>
      )}
      {inBounds && !loading && lots && lots.length > 0 && (
        <div className="moon-region-grid">
          {lots.map((lot) => (
            <button
              type="button"
              key={lot.lot_id}
              className={`moon-region-cell${lot.claimed_at ? " claimed" : ""}`}
              title={lot.lot_id}
              onClick={() => router.push(`/lots/${lot.lot_id}`)}
            >
              {lot.lot_id.replace("MOON-", "")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
