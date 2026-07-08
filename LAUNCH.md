# Launch Runbook — moonhoa.com

Where this leaves off: `newsite` has all five phases of the rebuild (Next.js
app, Supabase schema, registration/claim, public registry, moderation,
resale/transfer, and Phase 5 polish). Every piece of it has been built and
verified as far as possible **without** live infrastructure — build/lint/
type/unit tests pass, every page has been screenshot-tested, the race-safe
SQL has been load-tested against a real local Postgres, and every
Supabase-dependent feature degrades gracefully to a clear "not connected"
state. Nothing has been run against **real** Supabase, Vercel, or Cloudflare
accounts, because those don't exist yet — that's what this runbook closes
out.

`main` is still the live static site (GitHub Pages, `moonhoa.com`, source =
`main` branch root, confirmed via `gh api repos/Moon-Hoa/website/pages`).
**The moment `main` contains the Next.js app instead of a static
`index.html`, GitHub Pages breaks** — there's no static file at the repo
root for it to serve. So the ordering below matters: get Vercel fully
working first, on a URL nobody's relying on, *then* touch `main` and DNS
together in one sitting.

Every step below is marked **[You]** (needs your account access — Vercel,
Supabase, Cloudflare, DNS/registrar dashboards) or **[Either]** (I can do it
if you want, or you can).

---

## Phase A — Provision infrastructure

1. **[You] Create a Supabase project.** Note the project URL, anon key, and
   service role key (Project Settings -> API).
2. **[Either] Apply the schema.** From `supabase/migrations/`, either:
   - `supabase link` + `supabase db push` (Supabase CLI), or
   - paste each `.sql` file into the project's SQL Editor, in filename order
     (they're numbered/dated for exactly this).
3. **[Either] Seed the lot grid.**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:lots
   ```
   Reconsider the grid bounds in `src/lib/lots.ts` first if lot scarcity
   should change — this is a one-time seed of ~350k rows and isn't meant to
   be re-run casually.
4. **[You] Create a Cloudflare Turnstile site** for `moonhoa.com` (and
   whatever preview domain Vercel gives you — Turnstile can allow multiple
   hostnames per site, or you can use the test key during preview testing
   and switch to the real one right before the domain cutover). Note the
   site key and secret key.
5. **[You] Create a Vercel project**, import `Moon-Hoa/website`. Do **not**
   set the production branch to `main` yet — deploy `newsite` directly (or
   set `newsite` as the production branch temporarily) so testing happens
   on a Vercel-assigned URL, not the live domain.
6. **[You] Set environment variables in Vercel** (Project Settings ->
   Environment Variables) — see `.env.example` for the full list:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
   `TURNSTILE_SECRET_KEY`, `ADMIN_EMAILS` (include your own email so you can
   reach `/admin`).
7. **[You] In Supabase Auth settings**, confirm the Site URL / redirect URL
   allowlist includes the Vercel preview URL (and later `https://moonhoa.com`)
   — magic links won't redirect correctly otherwise. Also worth checking the
   default magic-link expiry (Supabase's default is 1 hour) and email rate
   limits on the free tier, since registration, admin login, and both
   transfer hops all send email.

## Phase B — Smoke-test on the Vercel preview URL (not the real domain yet)

Work through this checklist against whatever `*.vercel.app` URL Vercel gives
you. Don't skip anything that sends an email — the whole point is to prove
the real round-trip works, not just that the code compiles.

- [ ] Homepage and every static page load (`/`, `/covenants`, `/arc`, `/dues`,
      `/board`, `/minutes`, `/annual-meeting`)
- [ ] `/register`: pick a real lot, register with a real email you control,
      receive the magic link, click it, land on `/register/success` with
      the lot assigned
- [ ] The lot now shows as claimed on `/registry` and `/lots/[lotId]`
- [ ] `/lots/[lotId]` -> "Transfer this lot" with a *second* real email you
      control -> confirmation link arrives at the **owner's** email (not
      whatever was typed) -> click it, confirm -> acceptance link arrives at
      the **recipient's** email -> click it, accept (naming yourself if new)
      -> ownership actually moves, and the transfer shows up in the lot's
      history
- [ ] `/admin`: sign in with an `ADMIN_EMAILS` address, confirm the
      dashboard shows the real member/lot data from the steps above
- [ ] Ban a test member from `/admin` and confirm their lot gets delisted;
      unban and confirm it reverses
- [ ] File a report from a lot page, confirm it shows up under "Open
      Reports" in `/admin`, dismiss it
- [ ] `/admin/analytics` shows the real registration you just made
- [ ] `/density` renders real density data (will look sparse with only a
      couple of test claims — that's expected)
- [ ] Turnstile widget renders with the **production** site key (not the
      Cloudflare test key) and actually gates submission
- [ ] Rate limiting: confirm normal usage isn't false-positive-blocked (a
      handful of requests in the test above shouldn't trip the 5-per-5-min
      limits); optionally confirm a deliberate burst does 429 as designed
- [ ] Check Vercel's function logs for unexpected errors during all of the
      above

Fix anything that surfaces, redeploy, and re-run the relevant checks before
moving on — this preview URL is the last checkpoint before the live domain
is involved.

## Phase C — Cut over (expect a few minutes of downtime)

Do this in one sitting, ideally at low traffic. `moonhoa.com` will be
briefly unreachable or show a generic error between disabling GitHub Pages
and DNS finishing propagation to Vercel — normal for this kind of cutover
and not worth engineering around for a satire site's traffic level.

1. **[Either] Merge `newsite` -> `main`.** This is the PR you already
   expected to do eventually — see the branching note in `CLAUDE.md`.
2. **[You] Point the Vercel project's production branch at `main`** (if it
   was set to `newsite` for testing) and confirm the resulting deployment
   is the one you already smoke-tested.
3. **[You] Add `moonhoa.com` as a custom domain** in the Vercel project.
   Vercel will show the exact DNS records it needs (typically an A record
   to its apex IP, or an ALIAS/ANAME if your DNS host supports one — Vercel
   also handles `www` redirects if you want those).
4. **[You] Disable GitHub Pages**: repo Settings -> Pages -> set source to
   "None." Do this before or immediately after the DNS change, not before
   Vercel is confirmed ready — you want the gap between "GitHub Pages off"
   and "DNS resolves to Vercel" to be as short as possible.
5. **[You] Update DNS** at wherever `moonhoa.com` is actually hosted (check
   the registrar; it may or may not be Cloudflare even though Turnstile is
   Cloudflare) to the records Vercel gave you in step 3.
6. **[Either] Wait for propagation** (usually minutes, can be longer
   depending on prior TTL settings) and confirm `https://moonhoa.com`
   serves the Vercel deployment with a valid cert.
7. **[Either] Re-run the Phase B checklist against the real domain** —
   Turnstile and Supabase Auth redirect allowlists need the real domain
   added (step A7), so this isn't purely redundant with Phase B.
8. **[Either] Clean up**: remove the now-vestigial `CNAME` file (GitHub
   Pages-specific, does nothing once Pages is disabled) in a follow-up PR
   to `main`.

## Phase D — Post-launch

- **[You] Monitor** Vercel's function logs and Supabase's dashboard
  (database load, auth email volume — free-tier email sending limits are
  easy to hit if this gets any real traffic) for the first day or so.
- **[Either] Revisit the lot-grid scarcity** (`src/lib/lots.ts` grid
  bounds) if claims are moving faster or slower than expected — re-seeding
  is possible but should be a deliberate decision, not a reflex.
- **Explicitly deferred** (per the architecture doc, only revisit if this
  goes viral): real secondary-market trading with actual money, any
  blockchain/NFT layer. Both are separate legal/payments conversations, not
  engineering ones.

## Known limitations carried into production

- Rate limiting (`src/proxy.ts`) is an in-memory sliding window — correct
  within a single instance, not a true distributed limit across Vercel's
  concurrent instances. Fine at low-to-moderate traffic; if this gets
  popular, replace with `@vercel/firewall` rules or an Upstash-backed
  limiter.
- Admin auth is an `ADMIN_EMAILS` allowlist, not a DB role — fine for one
  or two trusted operators, reconsider if the admin team grows.
- No automated test suite runs on CI (no CI is configured at all yet) —
  `npm run build`, `npm run lint`, `npx tsc --noEmit`, `npm test`, and
  `npm run test:race` are all currently run manually.
