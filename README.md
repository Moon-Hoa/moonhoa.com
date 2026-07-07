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

Schema lives in `supabase/migrations/`. Once a Supabase project exists,
apply it with the Supabase CLI (`supabase link`, then `supabase db push`)
or paste the SQL into the project's SQL editor.

### Seeding the lot grid

```bash
npm run seed:lots -- --dry-run   # writes scripts/out/lots.csv, no DB needed
npm run seed:lots                # requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
```

Grid bounds (how many lots exist, i.e. how scarce they are) are set in
`src/lib/lots.ts` — reconsider before the real seed run.

## Deployment

Not yet connected to Vercel. `moonhoa.com` currently still points at the
old GitHub Pages static site (see `CNAME`); cutting it over to this app
is a Phase 5 task.

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

## Project structure

- `src/app/` — routes (App Router)
- `src/proxy.ts` — rate limiting (Next 16 renamed `middleware.ts` to `proxy.ts`)
- `src/app/register/`, `src/app/api/register/`, `src/app/auth/callback/` — registration + magic-link + claim flow
- `src/app/api/lots/available/` — paginated/searchable unclaimed-lots list for the picker
- `src/app/registry/`, `src/app/api/registry/`, `src/app/lots/[lotId]/` — public registry + lot lookup
- `src/app/covenants/`, `src/app/arc/`, `src/app/dues/`, `src/app/board/`, `src/app/minutes/` — new static content pages
- `src/app/admin/`, `src/app/api/admin/login/`, `src/app/api/reports/` — moderation + admin dashboard
- `src/components/` — shared design-system components ported from the
  original static site (starfield, seal, decree grid, amenity cards, etc.)
  plus the registration form, lot picker, Turnstile widget, registry table,
  dues table, board grid, admin login form, and report button
- `src/lib/content.ts` — homepage copy (regulations, amenities, events, notices)
- `src/lib/staticPagesContent.ts` — copy for the Phase 2 static pages
- `src/lib/lots.ts` — lot grid math (cell <-> lot code encoding)
- `src/lib/profanity.ts` — display name filter
- `src/lib/turnstile.ts` — Turnstile site key + server-side verification
- `src/lib/admin.ts` — admin email allowlist + session check
- `src/lib/supabase/` — server/admin/public Supabase client helpers
- `supabase/migrations/` — SQL schema
- `scripts/seed-lots.ts` — lot grid seed script
