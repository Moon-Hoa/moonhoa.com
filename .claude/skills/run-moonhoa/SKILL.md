---
name: run-moonhoa
description: Launch the Moon HOA Next.js dev server and screenshot it with a headless browser to verify UI changes actually render.
---

# Running Moon HOA

Next.js app (App Router, TS). No external services required yet — the
homepage is fully static, no Supabase/env vars needed for local dev.

## Launch

```bash
npm install   # first time only
npm run dev & echo $! > /tmp/moonhoa-dev.pid
timeout 30 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'
```

Stop with `kill $(cat /tmp/moonhoa-dev.pid)` before relaunching, or the
next run hits `EADDRINUSE`.

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
