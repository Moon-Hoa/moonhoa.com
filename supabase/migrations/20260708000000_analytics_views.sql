-- Basic analytics for the admin dashboard (Phase 5). Admin-only — no
-- public grants — since "most reported lots" in particular is
-- moderation-sensitive.
create view registrations_by_day
  with (security_invoker = false) as
  select date_trunc('day', created_at)::date as day, count(*) as registrations
  from members
  group by 1
  order by 1 desc;

-- "Most contested" cuts both ways for an HOA satire site: lots people keep
-- reporting (moderation-contested) and lots that keep changing hands
-- (market-contested).
create view most_reported_lots
  with (security_invoker = false) as
  select lot_id, count(*) as report_count
  from reports
  group by lot_id
  order by report_count desc
  limit 20;

create view most_transferred_lots
  with (security_invoker = false) as
  select lot_id, count(*) as transfer_count
  from ownership_transfers
  group by lot_id
  order by transfer_count desc
  limit 20;
