# Real-World Mission Tie-In Playbook

The Charter's own Part IX (§9.5, §9.11.5) already anticipates this: real
national and commercial lunar missions get folded into the site as
"Pre-Association Entity" activity, using the Charter's own in-universe
framing rather than inventing new mechanics. This is the repeatable
process for doing that — copy-only, no schema/deploy risk once the
`legacy_structures` and `correspondence_log` tables exist (Phase 9.5).

See [CONTINUITY.md](./CONTINUITY.md) for facts that must stay locked
(board roster, currency, citation style) while running this process.

## The process

When a real lunar mission event happens — an Artemis milestone, a CLPS
commercial lander, an international mission:

1. **Add a dated Correspondence Log entry** (`correspondenceLog` in
   `src/lib/staticPagesContent.ts`, rendered on `/legacy-structures`).
   Mirror the Charter's own Appendix H style: anonymized recipient
   ("Operator, [mission] equipment"), a dry subject line, and — almost
   always — `"None received"` as the response. If the mission hasn't
   landed yet, use a Pre-Arrival Notification framing instead.
2. **If real hardware is left on the surface**, add it to
   `legacyStructures` with real published coordinates and a Register
   Status. Break it out as its own named entry rather than lumping it
   into the generic "Multiple commercial sites" row once it's a specific,
   citable mission.
3. **Add a Historical Incident Log-style entry** — one line, dry, mirrors
   Appendix D's tone. This can live in the same content pass as the
   Gazette blurb below rather than needing its own dedicated page.
4. **Optional: an HOA Gazette blurb** (`gazetteIssues` in
   `staticPagesContent.ts`) — a short, deadpan, in-character Board
   reaction. Mildly resentful about not being consulted, as ever.

## Why the timeline works

Per `CONTINUITY.md`, the Charter's own chronology (2088 incorporation,
"2094" as of this printing) is lore, not the site's live present. Real
mission events use real Earth dates and read, in-universe, as Part IX
"Pre-Association" activity — which by definition covers everything
before the Association's 2088 incorporation. No conflict, no need to
force-fit real-world dates into the Charter's internal year numbers.

## Cadence

Copy-only, no schema/deploy risk. Check for major mission milestones
roughly monthly, or event-driven around known mission dates. Keep this
changelog current so future updates don't duplicate or contradict
earlier entries.

## A note on current events

This playbook and its first worked example were written by an AI
assistant without real-time news access — the assistant's knowledge is
current only through its training cutoff (January 2026) plus whatever
the user has told it directly in conversation. **Before adding a new
entry, verify the mission details (dates, coordinates, outcome) against
a real source** rather than trusting an AI's assumption about "current"
events, which may be stale, speculative, or wrong by the time this runs.

## Changelog

- **2026-07 — Intuitive Machines IM-1 "Odysseus"** (first worked
  example/proof of concept). Real, historically confirmed mission
  (landed 2024-02-22, well before the assistant's January 2026 knowledge
  cutoff — chosen deliberately for that reason over a claim about more
  recent, unverifiable news). Added as its own Legacy Structures Register
  entry (previously only covered by the generic "Multiple commercial
  sites" grouping), a Correspondence Log entry, and an HOA Gazette Issue
  2 blurb. See the entries themselves for the real facts (landed near
  Malapert A crater in the lunar south polar region, came to rest on its
  side after a harder-than-planned descent).
