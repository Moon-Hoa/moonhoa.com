"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface RegistryEntry {
  lot_id: string;
  claimed_at: string;
  owner_display_name: string;
}

interface RegistryResponse {
  entries: RegistryEntry[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  configured: boolean;
}

export default function RegistryTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [entries, setEntries] = useState<RegistryEntry[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    function load() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);

      return fetch(`/api/registry?${params}`);
    }

    load()
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load the registry.");
        return res.json() as Promise<RegistryResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        setEntries(data.entries ?? []);
        setHasMore(Boolean(data.hasMore));
        setConfigured(data.configured);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load the registry. Try again shortly.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search]);

  if (!loading && !configured) {
    return (
      <p className="registration-error">
        The registry isn&apos;t connected yet — Supabase hasn&apos;t been configured. Check back once the site&apos;s off the ground.
      </p>
    );
  }

  return (
    <div className="registry">
      <input
        type="text"
        placeholder="Search by lot code or owner name"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        className="lot-picker-search"
      />

      {error && <p className="registration-error">{error}</p>}

      {loading ? (
        <p className="lot-picker-note">Loading registry…</p>
      ) : entries.length === 0 ? (
        <p className="lot-picker-note">No registered members match that search.</p>
      ) : (
        <div className="registry-table">
          {entries.map((entry) => (
            <Link href={`/lots/${entry.lot_id}`} key={entry.lot_id} className="registry-row">
              <span className="registry-lot">{entry.lot_id}</span>
              <span className="registry-owner">{entry.owner_display_name}</span>
              <span className="registry-date">{new Date(entry.claimed_at).toLocaleDateString()}</span>
            </Link>
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
