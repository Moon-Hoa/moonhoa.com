-- Lightweight "report this listing" flow (Phase 3).
create table reports (
  id uuid primary key default gen_random_uuid(),
  lot_id text not null references lots(lot_id),
  reason text,
  status text not null default 'open', -- open | dismissed | actioned
  created_at timestamptz not null default now()
);

create index reports_lot_id_idx on reports (lot_id);
create index reports_status_idx on reports (status);

-- No public policies: reports may contain moderation-sensitive notes about
-- other members, so only the service role (used by POST /api/reports and
-- the admin dashboard, both server-side) can read or write this table. RLS
-- enabled with zero policies defaults to deny for anon/authenticated.
alter table reports enable row level security;
