-- Phase 9.5: seed legacy_structures + correspondence_log from the real
-- Charter Appendix C / Appendix H, mirroring src/lib/staticPagesContent.ts
-- (legacyStructures, correspondenceLog) — kept in sync manually since the
-- static pages read the TS arrays directly and only the interactive map
-- (#105) reads this table. Grouped "Various"/restricted entries get null
-- lat/lon deliberately; the map skips unplottable rows rather than
-- guessing at a coordinate the Charter itself doesn't give precisely.
insert into legacy_structures (site_name, lat, lon, origin, era, contents, buffer_zone_m, register_status, is_memorial) values
  ('Tranquility Base', 0.67, 23.47, 'United States', 'Late 20th c. — first crewed landing', 'Descent stage, flag, seismometer, laser-ranging retroreflector, tools, and an estimated 100+ smaller discarded items', 500, 'Registered — Grandfathered', false),
  ('Ocean of Storms site', -3.01, -23.42, 'United States', 'Late 20th c.', 'Descent stage, instrument package; a nearby robotic probe visited and partially sampled by the crew', 300, 'Registered — Grandfathered', false),
  ('Fra Mauro highlands site', -3.65, -17.47, 'United States', 'Early 1970s', 'Descent stage, instrument package, and two recreational sporting items left during an unscheduled demonstration', 300, 'Registered — Grandfathered', false),
  ('Hadley Rille site', 26.13, 3.63, 'United States', 'Early 1970s', 'Descent stage, first lunar roving vehicle, a small memorial sculpture and plaque, and apparatus from a public physics demonstration', 300, 'Registered — Grandfathered; memorial under special protection, § 9.3.4', true),
  ('Descartes Highlands site', -8.97, 15.50, 'United States', 'Early 1970s', 'Descent stage, second lunar roving vehicle, and a personal family photograph left by a crew member', 300, 'Registered — Grandfathered', false),
  ('Taurus-Littrow site', 20.19, 30.77, 'United States', 'Early 1970s', 'Descent stage, third lunar roving vehicle, commemorative plaque, and surface inscriptions left by the final crew to walk on the surface', 300, 'Registered — Grandfathered', false),
  ('Multiple sites, near side', null, null, 'Soviet Union / Russian Federation', 'Mid-late 20th c.', 'Robotic landers and two teleoperated rovers; two retroreflectors still used in active laser-ranging work', 200, 'Registered — Grandfathered', false),
  ('Multiple sites, incl. one far-side', null, null, 'China (CNSA)', '21st c.', 'Robotic landers and rovers, including the first successful far-side soft landing and two robotic sample-return missions', 200, 'Registered — Grandfathered; far-side site outside enforcement range, § 1.2.2', false),
  ('South polar region site', null, null, 'India (ISRO)', '21st c.', 'Robotic lander and rover, first successful soft landing in the lunar south polar region — exact coordinates restricted per the published Register', null, 'Registered — Grandfathered', false),
  ('Odysseus landing site (Malapert A vicinity)', -80.13, 1.44, 'Intuitive Machines (IM-1), United States', '21st c. — first US commercial lunar landing, first US lunar landing since 1972', 'Robotic lander, came to rest on its side after a harder-than-planned descent', 150, 'Registered — Grandfathered; Non-Conforming, § 9.6.3', false),
  ('Multiple commercial sites', null, null, 'Private aerospace companies, multiple nations', '21st c.', 'A growing set of robotic landers, several resting at an angle the Board considers structurally undignified', 150, 'Registered — Grandfathered; several Non-Conforming', false),
  ('Scattered impact & debris sites', null, null, 'Multiple, uncatalogued below 50kg', 'Mid-20th c. onward', 'Discarded rocket stages and uncontrolled impact debris', null, 'Partially Registered', false);

insert into correspondence_log (sent_date, recipient, subject, response) values
  ('2024-02-23', 'Operator, IM-1 Odysseus lander', 'Welcome and Grandfathered-registration notice, Malapert A vicinity site', 'None received'),
  ('2024-02-23', 'Operator, IM-1 Odysseus lander', 'Reflectivity Audit scheduling request', 'None received');
