-- Phase 9.5: seed reserve_components and committees from the real Charter
-- (Appendix M Specimen 5 Reserve Study excerpt; Part XII / §12.9).
insert into reserve_components (name, funded_pct) values
  ('Zero-Gravity Swimming Pool', 11),
  ('Moonwalk Trail', 68),
  ('Community Hall', 74),
  ('Solar Tanning Deck', 91);

insert into committees (name, chair, cadence) values
  ('Architectural Review Committee', 'Deputy Director of Surface Standards', 'Biweekly'),
  ('Aesthetic Review Committee', 'At-Large Member', 'Quarterly'),
  ('Legacy Equipment Preservation Subcommittee', 'Chief Albedo Officer (acting)', 'Monthly'),
  ('Craterscaping Subcommittee', 'At-Large Member', 'Monthly'),
  ('Social Events Committee', 'Director of Community Relations', 'Monthly, more often before the Full Moon Party'),
  ('Audit & Finance Committee', 'Treasurer', 'Monthly'),
  ('Nominating Committee', 'Chairperson (ex officio)', 'Annually, ahead of elections'),
  ('Grievance & Ethics Committee', 'Deputy Director of Surface Standards', 'As needed');
