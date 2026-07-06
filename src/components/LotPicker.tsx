"use client";

import { useEffect, useState } from "react";

interface Lot {
  lot_id: string;
  lat_cell: number;
  lon_cell: number;
}

interface AvailableLotsResponse {
  lots: Lot[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  source: "supabase" | "local-fallback";
}

export default function LotPicker({
  selectedLotId,
  onSelect,
}: {
  selectedLotId: string | null;
  onSelect: (lotId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [lots, setLots] = useState<Lot[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [source, setSource] = useState<AvailableLotsResponse["source"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    function load() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);

      return fetch(`/api/lots/available?${params}`);
    }

    load()
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load lots.");
        return res.json() as Promise<AvailableLotsResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        setLots(data.lots ?? []);
        setHasMore(Boolean(data.hasMore));
        setSource(data.source ?? null);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load available lots. Try again shortly.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search]);

  return (
    <div className="lot-picker">
      <input
        type="text"
        placeholder="Search lot code (e.g. 0650)"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        className="lot-picker-search"
      />

      {source === "local-fallback" && (
        <p className="lot-picker-note">
          Demo mode — Supabase isn&apos;t connected yet, so these lots are
          generated locally rather than read from a live registry.
        </p>
      )}

      {error && <p className="registration-error">{error}</p>}

      {loading ? (
        <p className="lot-picker-note">Loading available lots…</p>
      ) : (
        <div className="lot-picker-grid">
          {lots.map((lot) => (
            <button
              type="button"
              key={lot.lot_id}
              className={`lot-picker-item${lot.lot_id === selectedLotId ? " selected" : ""}`}
              onClick={() => onSelect(lot.lot_id)}
            >
              {lot.lot_id}
            </button>
          ))}
        </div>
      )}

      <div className="lot-picker-pagination">
        <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button type="button" onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
          Next
        </button>
      </div>
    </div>
  );
}
