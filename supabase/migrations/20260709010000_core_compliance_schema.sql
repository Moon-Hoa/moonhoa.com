-- Phase 9.5: core compliance/enforcement schema (fines, violations, reserve
-- components, assessments, forms, records requests, committees), plus the
-- good_standing view. See CONTINUITY.md for the facts this data mirrors.

-- Single source of truth for every fine amount quoted anywhere on the site
-- (Appendix B). Reference data — publicly readable, same as the Charter
-- text itself.
create table fines_schedule (
  id uuid primary key default gen_random_uuid(),
  charter_section text not null,   -- e.g. '4.5.1'
  violation text not null,
  standard_fine_oc numeric not null,
  notes text
);

-- Per-lot violation records. Unlike fines_schedule, this ties a specific
-- lot to specific enforcement activity — moderation-sensitive in the same
-- way `reports` is (see 20260707000000_reports.sql), so it gets the same
-- treatment: RLS enabled, no public policies, service-role only. The
-- public-facing signal is the derived `good_standing` view below, which
-- mirrors §2.5.3's own practice of posting standing "by lot number only."
create table violations (
  id uuid primary key default gen_random_uuid(),
  lot_id text not null references lots(lot_id),
  fines_schedule_id uuid references fines_schedule(id),
  tier int,                              -- dust drift tier, where applicable
  status text not null default 'open',   -- open | paid | referred_to_tribunal
  created_at timestamptz not null default now()
);

-- Per §6.5 — Reserve Components & the Reserve Study. Reference data.
create table reserve_components (
  id uuid primary key default gen_random_uuid(),
  name text not null,               -- 'Zero-Gravity Swimming Pool', ...
  funded_pct numeric not null
);

-- Per-lot special assessment ledger. Same moderation-sensitivity
-- reasoning as `violations` — a specific lot's payment status is not
-- public, even though the assessment notice itself (amount, reason) is
-- published as static content on /special-assessment.
create table assessments (
  id uuid primary key default gen_random_uuid(),
  lot_id text not null references lots(lot_id),
  resolution_id text not null,      -- e.g. '2094-R-09'
  reserve_component_id uuid references reserve_components(id),
  amount_oc numeric not null,
  due_date date not null,
  paid boolean not null default false
);

-- Per Appendix A — Full Schedule of Forms. Reference data.
create table forms (
  id uuid primary key default gen_random_uuid(),
  form_number text unique not null, -- 'LRA-VIO-1', 'LRA-COMPLAINT-1', ...
  title text not null,
  charter_ref text
);

-- Per §15.4 — Records Requests. Contains a specific resident's request;
-- same treatment as `violations`/`assessments`.
create table records_requests (
  id uuid primary key default gen_random_uuid(),
  ticket_id text unique not null,   -- 'LRA-514-#####'
  lot_id text references lots(lot_id),
  request_type text not null default 'general',
  status text not null default 'under_review',
  submitted_at timestamptz not null default now()
);

-- Per Part XII / §12.9. Reference data.
create table committees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  chair text not null,
  cadence text not null
);

create index violations_lot_id_idx on violations (lot_id);
create index violations_status_idx on violations (status);
create index assessments_lot_id_idx on assessments (lot_id);
create index records_requests_lot_id_idx on records_requests (lot_id);

alter table violations enable row level security;
alter table assessments enable row level security;
alter table records_requests enable row level security;

-- Reference tables: publicly readable, no RLS needed (same rationale as
-- `lots`/`ownership_transfers` in the init migration — nothing sensitive).
grant select on fines_schedule to anon, authenticated;
grant select on reserve_components to anon, authenticated;
grant select on forms to anon, authenticated;
grant select on committees to anon, authenticated;

-- Derived, lot-level-only standing signal — mirrors §2.5.1's definition
-- (no unresolved Tier 2/3 violation) and §2.5.3's practice of posting
-- standing "by lot number only." This is what the public registry/lot
-- pages should read, never the raw `violations` table.
create view good_standing
  with (security_invoker = false) as
  select
    l.lot_id,
    not exists (
      select 1 from violations v
      where v.lot_id = l.lot_id and v.status = 'open' and v.tier >= 2
    ) as in_good_standing
  from lots l;

grant select on good_standing to anon, authenticated;
