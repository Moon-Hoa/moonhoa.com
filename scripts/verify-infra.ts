// Checks the real infrastructure this app depends on: Supabase schema +
// data, Turnstile secret key validity, and (if VERCEL_TOKEN is set) the
// Vercel project's config and latest deployment. Read-only — makes no
// changes. Meant to be re-run any time during/after setup to get a clear
// "what's done, what's not" picture.
//
// Usage: node --env-file=.env.local -r tsx/cjs scripts/verify-infra.ts
//   or:  npm run verify:infra   (loads .env.local automatically)
import { createClient } from "@supabase/supabase-js";

const CHECK = "✔";
const CROSS = "✘";
const WARN = "⚠";

function log(ok: "pass" | "fail" | "warn", label: string, detail?: string) {
  const icon = ok === "pass" ? CHECK : ok === "fail" ? CROSS : WARN;
  console.log(`${icon} ${label}${detail ? ` — ${detail}` : ""}`);
}

async function checkSupabase() {
  console.log("\n=== Supabase ===");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    log("fail", "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
    return;
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  const expectedTables = ["members", "lots", "ownership_transfers", "reports"];
  const expectedViews = [
    "member_public_profiles",
    "lot_registry",
    "registrations_by_day",
    "most_reported_lots",
    "most_transferred_lots",
    "lot_density_grid",
  ];

  let schemaOk = true;
  for (const table of [...expectedTables, ...expectedViews]) {
    // Deliberately NOT `head: true` here — HEAD responses have no body for
    // supabase-js to parse a PostgREST error out of, so a 404 (e.g. "not in
    // schema cache") silently reads as success. A real GET with limit(0)
    // still returns zero rows cheaply but surfaces errors properly.
    const { error } = await admin.from(table).select("*", { count: "exact" }).limit(0);
    if (error) {
      log("fail", `relation "${table}"`, error.message);
      schemaOk = false;
    } else {
      log("pass", `relation "${table}" exists`);
    }
  }

  if (!schemaOk) {
    console.log("  -> schema is incomplete; apply the migrations from supabase/migrations/ in order.");
    return;
  }

  const { count: lotCount } = await admin.from("lots").select("*", { count: "exact", head: true });
  const { count: claimedCount } = await admin
    .from("lots")
    .select("*", { count: "exact", head: true })
    .not("owner_id", "is", null);
  const { count: memberCount } = await admin.from("members").select("*", { count: "exact", head: true });

  if (!lotCount) {
    log("warn", "lot grid is empty", "run `npm run seed:lots` once schema is confirmed good");
  } else {
    log("pass", `lot grid seeded`, `${lotCount.toLocaleString()} lots, ${claimedCount ?? 0} claimed`);
  }
  log("pass", "members table reachable", `${memberCount ?? 0} member(s) so far`);
}

async function checkTurnstile() {
  console.log("\n=== Cloudflare Turnstile ===");
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    log("fail", "TURNSTILE_SECRET_KEY not set");
    return;
  }

  // A deliberately invalid token — we're not testing a real challenge here,
  // just distinguishing "bad secret key" from "bad/expired token" via
  // Cloudflare's error codes.
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: "verification-check-dummy-token" }),
  });
  const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };

  const errors = data["error-codes"] ?? [];
  if (errors.includes("invalid-input-secret")) {
    log("fail", "TURNSTILE_SECRET_KEY is invalid", "Cloudflare rejected the secret key itself");
  } else if (errors.includes("invalid-input-response") || errors.includes("timeout-or-duplicate")) {
    log("pass", "TURNSTILE_SECRET_KEY is valid", "rejected the dummy token as expected — that's correct");
  } else {
    log("warn", "Unexpected Turnstile response", JSON.stringify(data));
  }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) {
    log("fail", "NEXT_PUBLIC_TURNSTILE_SITE_KEY not set");
  } else {
    log("pass", "NEXT_PUBLIC_TURNSTILE_SITE_KEY is set");
  }
}

async function checkAdmin() {
  console.log("\n=== Admin access ===");
  const emails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  if (emails.length === 0) {
    log("fail", "ADMIN_EMAILS not set", "no one can reach /admin");
  } else {
    log("pass", "ADMIN_EMAILS set", emails.join(", "));
  }
}

async function checkVercel() {
  console.log("\n=== Vercel ===");
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    log("warn", "VERCEL_TOKEN not set", "skipping — set it in .env.local if you want this checked automatically");
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  const projectsRes = await fetch("https://api.vercel.com/v9/projects?search=moonhoa", { headers });
  if (!projectsRes.ok) {
    log("fail", "Vercel API request failed", `${projectsRes.status} ${await projectsRes.text()}`);
    return;
  }
  const { projects } = (await projectsRes.json()) as { projects: Array<Record<string, unknown>> };

  if (!projects || projects.length === 0) {
    log("fail", "No Vercel project found matching 'moonhoa'", "has it been created/imported yet?");
    return;
  }

  for (const project of projects) {
    const name = project.name as string;
    const id = project.id as string;
    log("pass", `Project found: ${name}`);

    const link = project.link as { productionBranch?: string } | undefined;
    const prodBranch = link?.productionBranch;
    if (prodBranch === "main") {
      log("warn", `Production branch is "main"`, "should be \"newsite\" until the deliberate cutover (see LAUNCH.md)");
    } else if (prodBranch) {
      log("pass", `Production branch: ${prodBranch}`);
    } else {
      log("warn", "Could not determine production branch from API response");
    }

    const envRes = await fetch(`https://api.vercel.com/v10/projects/${id}/env`, { headers });
    if (envRes.ok) {
      const { envs } = (await envRes.json()) as { envs: Array<{ key: string; target: string[] }> };
      const required = [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
        "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
        "TURNSTILE_SECRET_KEY",
        "ADMIN_EMAILS",
      ];
      const present = new Set(envs.map((e) => e.key));
      for (const key of required) {
        if (present.has(key)) {
          log("pass", `Env var set in Vercel: ${key}`);
        } else {
          log("fail", `Env var missing in Vercel: ${key}`);
        }
      }
    } else {
      log("warn", "Could not list Vercel env vars", `${envRes.status}`);
    }

    const deploysRes = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${id}&limit=1`,
      { headers }
    );
    if (deploysRes.ok) {
      const { deployments } = (await deploysRes.json()) as {
        deployments: Array<{ url: string; state: string; target?: string; source?: string }>;
      };
      const latest = deployments[0];
      if (latest) {
        log(
          latest.state === "READY" ? "pass" : "warn",
          `Latest deployment: ${latest.state}`,
          `https://${latest.url}`
        );
      } else {
        log("warn", "No deployments yet");
      }
    }
  }
}

async function main() {
  await checkSupabase();
  await checkTurnstile();
  await checkAdmin();
  await checkVercel();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
