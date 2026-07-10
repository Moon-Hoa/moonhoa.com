-- Phase 9.5: seed fines_schedule from the real Charter Appendix B (Master
-- Schedule of Fines). A few Appendix B rows are intentionally omitted —
-- non-monetary outcomes ("committee assignment removal," "Board censure,"
-- "not applicable to residents") don't fit a numeric standard_fine_oc
-- column and aren't fines in the OC sense this table models.
--
-- The "Unauthorised surface writing" row deliberately keeps Appendix B's
-- 75 OC rather than §6.2's 50 OC — see CONTINUITY.md. This is the
-- Charter's own acknowledged, unresolved discrepancy; do not "fix" it.
insert into fines_schedule (charter_section, violation, standard_fine_oc, notes) values
  ('3.2.2', 'Dust drift, Tier 1', 20, null),
  ('3.2.2', 'Dust drift, Tier 2', 60, null),
  ('3.2.2', 'Dust drift, Tier 3 (Dust Event)', 200, 'Plus mandatory remediation.'),
  ('3.1.3', 'Albedo non-compliance, per cycle', 40, null),
  ('4.2.2', 'Unauthorised late landing', 40, null),
  ('3.3.1', 'Unlicensed structure', 80, null),
  ('4.1.4', 'Howling outside permitted hours', 25, '35 OC if during Board meeting hours.'),
  ('3.4.2', 'Unapproved lawn ornament', 30, null),
  ('3.4.2', 'Unauthorised additional inflatable ornament', 100, 'Also cites § 4.5.1.'),
  ('4.5.1', 'Unauthorised surface writing', 75, 'The Charter itself lists this at 50 OC in § 6.2 and 75 OC here in Appendix B — "either a clerical error or a test. It has not decided which." This row (Appendix B) is the master schedule; do not reconcile the two figures.'),
  ('4.5.1', 'Impersonating a Board member', 250, null),
  ('4.5.1', 'Attempted secession', 500, 'Secession is not recognised regardless of payment.'),
  ('3.4.2', 'New monolith installation', 1000, 'Non-negotiable.'),
  ('14.2.2', 'Filing a knowingly false complaint', 150, null),
  ('3.3.2', 'Retroactive structural approval (temporary structure over 30 days)', 80, 'Plus standard fee.'),
  ('3.5.1', 'Crater modification without approval', 150, 'Plus remediation.'),
  ('3.5.3', 'Filling in a crater entirely', 1000, 'Plus full restoration, where possible.'),
  ('4.5.1', 'Interfering with a Legacy Structure', 1000, 'Minimum; also cites Part IX.'),
  ('9.3.4', 'Disturbing a memorial site', 2000, 'Minimum, and immediate Tribunal referral.'),
  ('9.6.1', 'Operating an unregistered post-incorporation lander beyond 180 days', 300, 'Rarely collectible; see § 9.5.2.'),
  ('10.1.2', 'Unpermitted disturbance in a Conservation Crater', 60, null),
  ('10.2.1', 'Light pollution / unshielded exterior lighting', 25, null),
  ('10.4.1', 'Failure to maintain solar flare shelter access', 100, null),
  ('11.5.1', 'Utility easement encroachment', 80, 'Or higher fine if also a Part X violation.'),
  ('11.3.1', 'Solar easement shadow violation', 40, null),
  ('11.4.1', 'Communications easement obstruction', 50, null),
  ('13.1.2', 'Lapsed individual insurance coverage', 50, 'Per audit cycle.'),
  ('13.3.2', 'Contractor operating without proof of liability coverage', 200, 'Contractor barred pending compliance.'),
  ('15.2.1', 'Harassment or impersonation via Association digital systems', 150, null),
  ('15.2.1', 'Submission of knowingly false compliance data to the Registry', 200, null),
  ('6.1.2', 'Late dues, 30–60 days', 15, 'Surcharge.'),
  ('6.1.2', 'Late dues, 60–90 days', 20, 'Additional surcharge.'),
  ('3.6.3', 'Boundary marker tampering', 80, 'Treated as § 4.5.1 conduct.'),
  ('3.6.2', 'Unapproved fencing beyond marker', 30, null),
  ('3.7.1', 'Signage beyond size or timing limits', 20, null),
  ('3.8.1', 'Unapproved exterior finish (Palette violation)', 30, null),
  ('4.6.1', 'Unregistered secondary vehicle', 40, null),
  ('4.6.3', 'Vehicle idling in a utility easement', 80, 'Plus 40 OC parking violation.'),
  ('4.7.2', 'Unregistered companion organism', 25, null),
  ('4.7.1', 'Companion organism beyond household limit', 50, 'Per additional organism.'),
  ('9.9.1', 'Heritage filming without permit', 500, null),
  ('9.10.2', 'Failure to report uncatalogued Legacy item', 500, null),
  ('9.10.1', 'Removal or possession of a Register item', 2000, 'Minimum, and Tribunal referral.'),
  ('10.6.1', 'Unauthorised surface dumping', 60, 'Treated as Tier 2 dust drift.'),
  ('10.6.3', 'Registering a self-created toss zone', 150, 'Plus denial of Legacy Structure status.'),
  ('7.5.1', 'Short-Term Occupancy without permit', 100, null),
  ('7.5.3', 'Heritage-tourism short-term let without sign-off', 150, null),
  ('7.6.1', 'Holiday decoration outside display window', 20, null);
