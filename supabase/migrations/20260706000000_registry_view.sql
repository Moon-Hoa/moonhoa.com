-- Public registry: claimed lots joined to their owner's safe public profile.
-- Excludes banned members and unclaimed lots (inner join drops them), and
-- exposes only display_name — never email — same rationale as
-- member_public_profiles in the initial schema migration.
create view lot_registry
  with (security_invoker = false) as
  select
    l.lot_id,
    l.lat_cell,
    l.lon_cell,
    l.claimed_at,
    m.display_name as owner_display_name
  from lots l
  join members m on m.id = l.owner_id
  where m.is_banned = false;

grant select on lot_registry to anon, authenticated;
