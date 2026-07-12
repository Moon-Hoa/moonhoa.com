-- Fixes lot_density_grid's bucket size after the whole-sphere resolution
-- change (issue #134): the view bucketed by a fixed CELL COUNT (50), which
-- was only 5° per bucket because LOT_GRID.stepDeg was 0.1° at the time
-- (50 * 0.1 = 5). Now that stepDeg is 0.25°, the same divisor would produce
-- 12.5° buckets while the client (moonDensityTexture.ts's BUCKET_DEG=5,
-- and DensityGrid.tsx's flat rendering) still assumes 5° -- misplacing and
-- overlapping the density overlay. Using 20 cells at the 0.25° step
-- restores the original 5° bucket size (20 * 0.25 = 5) with no client
-- changes needed.
create or replace view lot_density_grid
  with (security_invoker = false) as
  select
    floor(lat_cell / 20.0)::int as lat_bucket,
    floor(lon_cell / 20.0)::int as lon_bucket,
    count(*) as total_lots,
    count(owner_id) as claimed_lots
  from lots
  group by 1, 2
  order by 1, 2;

grant select on lot_density_grid to anon, authenticated;
