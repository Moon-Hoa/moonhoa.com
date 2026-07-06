-- Moon HOA core schema: lots, members, ownership_transfers.
-- See Notion "Architecture & Phased Implementation Plan" for the full design rationale.

create extension if not exists pgcrypto;

create table members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text not null,
  created_at timestamptz not null default now(),
  is_banned boolean not null default false
);

create table lots (
  lot_id text primary key, -- e.g. 'MOON-0472-1188'
  lat_cell integer not null,
  lon_cell integer not null,
  owner_id uuid references members(id) on delete set null,
  claimed_at timestamptz,
  unique (lat_cell, lon_cell)
);

create table ownership_transfers (
  id uuid primary key default gen_random_uuid(),
  lot_id text not null references lots(lot_id),
  from_owner_id uuid references members(id),
  to_owner_id uuid references members(id),
  transferred_at timestamptz not null default now()
);

-- Lookups the public registry and lot pages need (Phase 2).
create index lots_owner_id_idx on lots (owner_id);
create index members_display_name_idx on members (display_name);
create index ownership_transfers_lot_id_idx on ownership_transfers (lot_id);

-- RLS
--
-- `lots` and `ownership_transfers` hold nothing sensitive (lot codes,
-- coordinates, UUID references, timestamps), so they're publicly readable —
-- the registry/lot-lookup pages (Phase 2) can query them directly.
--
-- `members` holds email addresses, so it gets NO public select policy; RLS
-- defaults to deny. Only the service role (used by registration, the claim
-- endpoint, and the admin dashboard — all server-side) can read/write it,
-- since the service role bypasses RLS entirely. Public code that needs an
-- owner's display name (never their email) reads it through the
-- `member_public_profiles` view below instead of the base table.
alter table members enable row level security;
alter table lots enable row level security;
alter table ownership_transfers enable row level security;

create policy "lots are publicly readable" on lots
  for select using (true);

create policy "ownership_transfers are publicly readable" on ownership_transfers
  for select using (true);

grant select on lots to anon, authenticated;
grant select on ownership_transfers to anon, authenticated;

-- Safe public projection of members: id + display_name only, never email.
create view member_public_profiles
  with (security_invoker = false) as
  select id, display_name
  from members
  where is_banned = false;

grant select on member_public_profiles to anon, authenticated;
