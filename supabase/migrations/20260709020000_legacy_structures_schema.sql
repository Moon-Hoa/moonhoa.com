-- Phase 9.5: Legacy Structures Register + Correspondence Log schema
-- (Part IX / Appendix C, §9.5 / Appendix H). Both are published reference
-- data — no RLS restrictions needed, same as fines_schedule/committees.

create table legacy_structures (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,          -- 'Tranquility Base', 'Hadley Rille site', ...
  lat numeric,
  lon numeric,
  origin text not null,             -- 'United States', 'Soviet Union / Russian Federation', ...
  era text,
  contents text,
  buffer_zone_m int,
  register_status text not null,    -- 'Registered — Grandfathered' | 'Partially Registered' | 'Non-Conforming, No Enforcement Action Available'
  is_memorial boolean not null default false
);

-- Extended over time per MISSION_TIEIN_PLAYBOOK.md as real missions happen.
create table correspondence_log (
  id uuid primary key default gen_random_uuid(),
  sent_date date not null,
  recipient text not null,          -- anonymized per the Charter's own practice, e.g. 'Operator, [mission] equipment'
  subject text not null,
  response text not null default 'None received'
);

create index legacy_structures_site_name_idx on legacy_structures (site_name);
create index correspondence_log_sent_date_idx on correspondence_log (sent_date desc);

grant select on legacy_structures to anon, authenticated;
grant select on correspondence_log to anon, authenticated;
