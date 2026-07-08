# Moon HOA

Satire site where visitors register to "own" a plot of lunar land, get
assigned an HOA membership, and appear in a public registry. See the
Notion doc "Architecture & Phased Implementation Plan" for the full design.

Stack: Next.js (App Router, TS) on Vercel, Supabase (Postgres + Auth),
Cloudflare Turnstile.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in once a Supabase project and
Cloudflare Turnstile site exist. Without them:

- `/register` still renders and the lot picker works, backed by a local
  fallback dataset generated from `src/lib/lots.ts` (clearly labeled "demo
  mode" in the UI) instead of a live registry
- Turnstile falls back to Cloudflare's public "always passes" test keys
- `POST /api/register` returns a 503 rather than silently failing

## Database

Schema lives in `supabase/migrations/`. Two ways to apply it:

```bash
npm run apply:migrations   # requires SUPABASE_DB_URL — direct connection, verifiable
```

or paste the SQL files into the Supabase dashboard's SQL Editor (Supabase
"Connect" button -> "Direct" tab has the connection string). Prefer the
script if possible — pasting into the dashboard has no way to confirm
success from outside the browser, which cost real time working out that a
paste had silently not applied at all.

### Seeding the lot grid

```bash
npm run seed:lots -- --dry-run   # writes scripts/out/lots.csv, no DB needed
npm run seed:lots                # requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
```

Grid bounds (how many lots exist, i.e. how scarce they are) are set in
`src/lib/lots.ts` — reconsider before the real seed run. The upsert is
idempotent and retries transient network failures automatically, so it's
safe to just re-run if it stops partway through.

### Verifying infrastructure

```bash
npm run verify:infra   # checks Supabase schema/seed status, Turnstile keys, and (with VERCEL_TOKEN) Vercel config
```

Read-only, makes no changes. Checks real data-returning queries, not just
table existence — a `head: true` HEAD request will report success even when
PostgREST can't actually resolve the table (HEAD responses have no body to
carry a PostgREST error in), which produced a false "everything's fine"
reading once already.

## Deployment

Connected to Vercel (project `moonhoa-com`, deploying from the `newsite`
branch as production for now — not `main`, see `LAUNCH.md`). `moonhoa.com`
itself still points at the old GitHub Pages static site until the deliberate
cutover happens — see `LAUNCH.md` / the "Phase 6 — Launch & Cutover" epic
for that sequencing.

## Registration flow (Phase 1)

`/register` -> `POST /api/register` (validates name/email, runs the
profanity filter, verifies Turnstile, sends a Supabase magic-link email with
the chosen lot ID + display name attached as user metadata) -> user clicks
the email link -> `GET /auth/callback` exchanges the code for a session,
upserts the `members` row, then runs the race-safe claim
(`UPDATE lots ... WHERE owner_id IS NULL`) -> redirects to `/register/success`.

The member row and the lot claim only happen after email verification, not
at initial form submission — this is also where "verifies a real email"
from the architecture doc is actually enforced.

## Public registry & static content (Phase 2)

- `/registry` — searchable/paginated list of claimed lots and their owners,
  reading from the `lot_registry` view (never exposes email). Without
  Supabase configured, shows a clear "not connected" message rather than
  fabricating members — unlike the lot picker's demo-mode fallback, there's
  no honest way to fake real registrants.
- `/lots/[lotId]` — per-lot detail (coordinates, owner, claim date, transfer
  history). Lazily generated and cached per lot (ISR, revalidate 45s) rather
  than pre-rendered for all ~350k possible lots.
- New static pages: `/covenants` (CC&Rs), `/arc` (Architectural Review
  process), `/dues` (dues schedule), `/board` (board members), `/minutes`
  (meeting minutes) — all fully static.
- The existing homepage sections (Regulations, Amenities, Calendar, Notices,
  Contact) stay as one scrolling page rather than being split into separate
  routes — they were already static/SSG-rendered as of Phase 0, so there
  was no technical gap to close there.

## Moderation & admin (Phase 3)

- `/admin` — members, claimed lots, and open reports, with one-click "nuke"
  actions (ban a member + delist every lot they own, or delist a single lot
  without touching its owner). Not linked from the public nav; reachable
  only by URL, gated regardless by `getAdminUser()`.
- Admin auth is a simple `ADMIN_EMAILS` allowlist (see `.env.example`), not a
  DB role column — same magic-link mechanism as registration, but
  `/auth/callback` now takes an optional `?next=` param so a plain sign-in
  (no lot claim, no member creation) can redirect anywhere, not just
  `/register/success`.
- "Report this listing" button on `/lots/[lotId]` -> `POST /api/reports`,
  logged to a `reports` table admins can dismiss or mark actioned from the
  dashboard.
- Rate limiting on `/api/register`, `/api/reports`, `/api/admin/login`,
  `/api/lots/available`, and `/api/registry` via `src/proxy.ts` — an
  in-memory sliding window, best-effort within a single instance. This is
  the code-level mechanism the architecture doc calls for; it is **not** a
  substitute for real edge/CDN-level protection (Vercel Firewall rules or
  an Upstash-backed limiter) once this is actually deployed.

## Resale / ownership transfer (Phase 4)

Three-hop magic-link handshake — deliberately more cautious than the plan's
literal "current owner enters recipient's email, recipient confirms"
one-hop wording, because without a persistent login system, anything less
would let a visitor transfer away a lot just by guessing its owner's email:

1. `/lots/[lotId]` (claimed lots only) -> "Transfer this lot" -> visitor
   enters a recipient email -> `POST /api/transfer/initiate` looks up the
   *actual* current owner's email server-side (never trusts anything typed
   as "I am the owner") and sends **them** a magic link. Rejects unclaimed
   lots, transfers to the current owner's own email, and transfers to a
   banned member.
2. Owner clicks the link -> lands authenticated on
   `/lots/[lotId]/transfer/confirm`, which re-verifies they still own the
   lot, then a "Confirm Transfer" button -> `POST /api/transfer/confirm`
   sends the *recipient* a magic link (email re-read from the owner's
   verified session metadata, not the request body).
3. Recipient clicks their link -> lands authenticated on
   `/lots/[lotId]/transfer/accept` — picks a display name if they're a new
   member, otherwise just accepts -> `POST /api/transfer/accept` does the
   race-safe reassignment (`UPDATE lots ... WHERE lot_id = ? AND owner_id =
   ?`, guarding against the lot changing hands again mid-handshake) and logs
   to `ownership_transfers`.

No new tables: transfer state rides along as Supabase auth user metadata
tied to each magic-link token, so it naturally expires with the link
instead of needing a `pending_transfers` table to clean up.

## Polish & launch hardening (Phase 5)

- **Race-condition load test** (`npm run test:race`) — spins up a throwaway
  local Postgres in Docker, applies every migration, then fires 50
  concurrent claim attempts at one lot and 50 concurrent transfer-accept
  attempts at one pending transfer, asserting exactly one winner each time.
  This tests the real `UPDATE ... WHERE owner_id IS NULL` /
  `UPDATE ... WHERE owner_id = ?` SQL against genuine Postgres — not
  Supabase itself, but the same engine and the exact statements those
  endpoints run — so it's meaningful evidence without needing a live
  Supabase project. Requires Docker running locally.
- **Basic analytics** (`/admin/analytics`) — registrations over the last 14
  days as a simple bar chart, plus "most reported" and "most transferred"
  lots (two readings of "most contested" for an HOA satire site: one
  moderation, one market). Backed by three admin-only views
  (`registrations_by_day`, `most_reported_lots`, `most_transferred_lots`).
- **Lot density map** (`/density`, public) — claim density by 5°×5°
  selenographic region as a heatmap, from a public `lot_density_grid` view.
  Built per the dataviz skill: single-hue sequential ramp (navy → gold,
  validated for monotonic lightness), direct percentage labels on every
  cell so color is never the only channel carrying the value.
- **Annual meeting page** (`/annual-meeting`) — joke agenda + a client-side
  "ballot" (no backend; the joke is that voting has no effect either way).
- Fixed a real polish bug along the way: plain inline links in body copy
  (e.g. "Register" on the lot page) had no base style and rendered
  browser-default blue — added a base `a` rule; more specific rules
  (nav, footer, registry rows) already override it.

Domain cutover (`moonhoa.com` GitHub Pages -> Vercel) needs real Vercel/
Supabase/Cloudflare accounts and is tracked separately — see `LAUNCH.md`.

## Project structure

- `src/app/` — routes (App Router)
- `src/proxy.ts` — rate limiting (Next 16 renamed `middleware.ts` to `proxy.ts`)
- `src/app/register/`, `src/app/api/register/`, `src/app/auth/callback/` — registration + magic-link + claim flow
- `src/app/api/lots/available/` — paginated/searchable unclaimed-lots list for the picker
- `src/app/registry/`, `src/app/api/registry/`, `src/app/lots/[lotId]/` — public registry + lot lookup
- `src/app/covenants/`, `src/app/arc/`, `src/app/dues/`, `src/app/board/`, `src/app/minutes/` — new static content pages
- `src/app/admin/`, `src/app/api/admin/login/`, `src/app/api/reports/` — moderation + admin dashboard
- `src/app/admin/analytics/` — registrations + most-contested-lots analytics
- `src/app/density/`, `src/app/annual-meeting/` — Phase 5 stretch pages
- `src/app/lots/[lotId]/transfer/`, `src/app/api/transfer/` — resale/ownership-transfer handshake
- `src/components/` — shared design-system components ported from the
  original static site (starfield, seal, decree grid, amenity cards, etc.)
  plus the registration form, lot picker, Turnstile widget, registry table,
  dues table, board grid, admin login form, report button, transfer
  initiate/confirm/accept forms, and the annual-meeting ballot
- `src/lib/content.ts` — homepage copy (regulations, amenities, events, notices)
- `src/lib/staticPagesContent.ts` — copy for the Phase 2+ static pages
- `src/lib/lots.ts` — lot grid math (cell <-> lot code encoding)
- `src/lib/densityColor.ts` — sequential color ramp for the density map
- `src/lib/profanity.ts` — display name filter
- `src/lib/turnstile.ts` — Turnstile site key + server-side verification
- `src/lib/admin.ts` — admin email allowlist + session check
- `src/lib/supabase/` — server/admin/public Supabase client helpers
- `supabase/migrations/` — SQL schema
- `scripts/seed-lots.ts` — lot grid seed script
- `scripts/race-test.ts` — race-condition load test (needs Docker)
- `LAUNCH.md` — the actual launch/cutover runbook
