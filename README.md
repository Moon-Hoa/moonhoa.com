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

Not needed yet for the current static homepage. Once registration/auth
land (Phase 1), create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only: registration, claim endpoint, admin, seed script — never expose to the client
```

## Database

Schema lives in `supabase/migrations/`. Once a Supabase project exists,
apply it with the Supabase CLI (`supabase link`, then `supabase db push`)
or paste the SQL into the project's SQL editor.

### Seeding the lot grid

```bash
npm run seed:lots -- --dry-run   # writes scripts/out/lots.csv, no DB needed
npm run seed:lots                # requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
```

Grid bounds (how many lots exist, i.e. how scarce they are) are set in
`src/lib/lots.ts` — reconsider before the real seed run.

## Deployment

Not yet connected to Vercel. `moonhoa.com` currently still points at the
old GitHub Pages static site (see `CNAME`); cutting it over to this app
is a Phase 5 task.

## Project structure

- `src/app/` — routes (App Router)
- `src/components/` — shared design-system components ported from the
  original static site (starfield, seal, decree grid, amenity cards, etc.)
- `src/lib/content.ts` — static site copy (regulations, amenities, events, notices)
- `src/lib/lots.ts` — lot grid math (cell <-> lot code encoding)
- `supabase/migrations/` — SQL schema
- `scripts/seed-lots.ts` — lot grid seed script
