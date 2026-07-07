-- Lot density by coarse selenographic region (Phase 5 stretch). Buckets the
-- seeded grid into 5°x5° regions (50 cells at the 0.1° step) and counts
-- total vs. claimed lots per bucket. Public, like lot_registry — aggregate
-- counts only, nothing sensitive.
create view lot_density_grid
  with (security_invoker = false) as
  select
    floor(lat_cell / 50.0)::int as lat_bucket,
    floor(lon_cell / 50.0)::int as lon_bucket,
    count(*) as total_lots,
    count(owner_id) as claimed_lots
  from lots
  group by 1, 2
  order by 1, 2;

grant select on lot_density_grid to anon, authenticated;
