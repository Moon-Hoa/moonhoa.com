-- Storage optimization ahead of the whole-sphere reseed (issue #134): the
-- production Supabase project hit its disk quota partway through seeding
-- ~6.49M lots (4.61M rows in, ~775MB total, no headroom left). Two of the
-- lots table's four indexes were avoidable weight:
--
-- 1. unique(lat_cell, lon_cell) duplicated the identity guarantee lot_id's
--    primary key already provides -- lot_id is a deterministic, bijective
--    encoding of (lat_cell, lon_cell) (see lotIdForCell/cellsForLotId in
--    src/lib/lots.ts), so two rows can never collide on (lat_cell, lon_cell)
--    without also colliding on lot_id, which the PK already rejects. No
--    foreign key references (lat_cell, lon_cell) -- every FK to this table
--    targets lot_id -- so dropping this constraint is safe. The query-
--    performance role it used to serve is now covered by
--    lots_lat_lon_covering_idx (added just before this migration).
-- 2. lots_owner_id_idx indexed every row, even though the overwhelming
--    majority of lots are (and will remain) unclaimed -- owner_id is null
--    for them. A partial index over only claimed rows serves every real
--    query ("lots owned by member X") at a fraction of the size, and grows
--    with adoption rather than with total lot count.
alter table lots drop constraint lots_lat_cell_lon_cell_key;

drop index lots_owner_id_idx;
create index lots_owner_id_idx on lots (owner_id) where owner_id is not null;
