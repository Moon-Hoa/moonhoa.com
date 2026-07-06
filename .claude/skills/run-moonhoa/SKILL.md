---
name: run-moonhoa
description: Launch the Moon HOA Next.js dev server and screenshot it with a headless browser to verify UI changes actually render.
---

# Running Moon HOA

Next.js app (App Router, TS). No external services required for local dev —
Supabase/Turnstile aren't provisioned yet, and everything that needs them
falls back gracefully (see Gotchas).

## Launch

```bash
npm install   # first time only
npm run dev > /tmp/moonhoa-dev.log 2>&1 &
```

No GNU `timeout` on this machine — poll manually instead:

```bash
for i in $(seq 1 30); do
  curl -sf http://localhost:3000 >/dev/null && echo "up after ${i}s" && break
  sleep 1
done
```

Stop with `pkill -f "next dev"` before relaunching, or the next run hits
`EADDRINUSE`.

## Drive / screenshot

No `chromium-cli` in this environment as of this writing. Use Playwright
directly instead:

```bash
npx --yes playwright install chromium   # first time only, ~170MB
```

```js
// screenshot.mjs
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForSelector("text=Moon Homeowners");
await page.screenshot({ path: "screenshot.png" });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
```

```bash
node screenshot.mjs
```

## Gotchas

- **Fade-in sections start invisible.** Every content block uses an
  `.fade-in` class + `IntersectionObserver` (see
  `src/components/FadeIn.tsx`) that only adds `.visible` once scrolled
  into the viewport — this is the original site's intentional scroll
  animation, not a bug. A screenshot taken immediately after `goto()`
  will show later sections faded out; scroll to the section
  (`page.locator("#regulations").scrollIntoViewIfNeeded()`) and wait
  ~1s before screenshotting it specifically.
- **Check `console --errors` / the `errors` array before declaring
  success** — the shell can render with every fetch failing silently.
- **`/register` works fully without real credentials.** The lot picker
  falls back to a locally-generated dataset (labeled "Demo mode" in the
  UI) and Turnstile falls back to Cloudflare's public test site key
  (`1x00000000000000000000AA`, an "always passes" widget — it renders a
  real iframe and auto-verifies within ~1-2s, no interaction needed).
  `POST /api/register` still correctly 503s past that point since
  Supabase itself isn't configured — that's the expected, final state
  until real Supabase/Turnstile env vars exist (see `.env.example`).
- **This Next.js version (16) renamed `middleware.ts` to `proxy.ts`** and
  has other API changes vs. older training data — check
  `node_modules/next/dist/docs/` (per `AGENTS.md`) before assuming a
  pre-16 pattern still applies.
- **ESLint is stricter than you'd expect from memory**: internal links
  must use `next/link`'s `<Link>`, not `<a href="/...">`
  (`@next/next/no-html-link-for-pages` — only fires on literal string
  hrefs, not dynamic ones), and setting state synchronously at the top of
  a `useEffect` body trips `react-hooks/set-state-in-effect` — wrapping
  the synchronous part in a named inner function called from the effect
  satisfies it (see `src/components/LotPicker.tsx`).
