// Load-tests the race-safe UPDATE patterns used by the claim endpoint
// (/auth/callback) and the transfer-accept endpoint (/api/transfer/accept)
// against a real local Postgres — not Supabase itself, but the same
// database engine and the exact SQL those endpoints run, so this is a
// meaningful test of the actual race-safety guarantee without needing a
// live Supabase project.
//
// Spins up a throwaway Postgres container, applies every migration,
// fires N concurrent claim/accept attempts at the same row from separate
// connections, and verifies exactly one wins. Tears the container down
// when done (including on failure).
//
// Usage: npm run test:race
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";

const CONTAINER_NAME = "moonhoa-race-test-pg";
const PORT = 55432;
const DB_URL = `postgres://postgres:test@localhost:${PORT}/postgres`;
const CONCURRENCY = 50;

function run(cmd: string) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function checkDockerAvailable() {
  try {
    execSync("docker info", { stdio: "ignore" });
  } catch {
    throw new Error("Docker isn't available/running — required to run this test against a real Postgres.");
  }
}

async function waitForPg() {
  for (let i = 0; i < 30; i++) {
    try {
      const client = new Client({ connectionString: DB_URL });
      await client.connect();
      await client.end();
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Postgres did not become ready in time.");
}

async function applyMigrations() {
  const dir = path.join(__dirname, "..", "supabase", "migrations");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  // Migrations grant to Supabase's platform-provided `anon`/`authenticated`
  // roles, which only exist on a real Supabase instance. Stub them in on
  // vanilla Postgres so the migrations apply unmodified — what's under
  // test here is the race-safety of the UPDATE statements, not RLS grants.
  await client.query(`
    do $$
    begin
      if not exists (select from pg_roles where rolname = 'anon') then
        create role anon;
      end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then
        create role authenticated;
      end if;
    end
    $$;
  `);

  for (const file of files) {
    console.log(`Applying ${file}`);
    await client.query(readFileSync(path.join(dir, file), "utf8"));
  }
  await client.end();
}

/** Mirrors the claim UPDATE in /auth/callback: N members race to claim one unowned lot. */
async function testClaimRace(): Promise<boolean> {
  const lotId = "MOON-RACE-TEST-CLAIM";

  const setup = new Client({ connectionString: DB_URL });
  await setup.connect();
  await setup.query(`insert into lots (lot_id, lat_cell, lon_cell) values ($1, 0, 0)`, [lotId]);

  const memberIds: string[] = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    const { rows } = await setup.query(
      `insert into members (email, display_name) values ($1, $2) returning id`,
      [`claim-racer-${i}@example.com`, `Claim Racer ${i}`]
    );
    memberIds.push(rows[0].id);
  }
  await setup.end();

  const clients = await Promise.all(
    memberIds.map(async () => {
      const c = new Client({ connectionString: DB_URL });
      await c.connect();
      return c;
    })
  );

  const results = await Promise.all(
    clients.map((c, i) =>
      c.query(
        `update lots set owner_id = $1, claimed_at = now() where lot_id = $2 and owner_id is null returning lot_id`,
        [memberIds[i], lotId]
      )
    )
  );
  await Promise.all(clients.map((c) => c.end()));

  const successes = results.filter((r) => r.rowCount === 1).length;

  const verify = new Client({ connectionString: DB_URL });
  await verify.connect();
  const { rows: finalState } = await verify.query(`select owner_id from lots where lot_id = $1`, [lotId]);
  await verify.end();

  const ownerIsOneOfRacers = memberIds.includes(finalState[0]?.owner_id);

  console.log(
    `Claim race: ${CONCURRENCY} concurrent claim attempts on one unowned lot -> ${successes} succeeded (expected exactly 1)`
  );
  console.log(`Final owner_id belongs to one of the racers: ${ownerIsOneOfRacers}`);

  return successes === 1 && ownerIsOneOfRacers;
}

/** Mirrors the UPDATE in /api/transfer/accept: N recipients race to accept one pending transfer. */
async function testTransferAcceptRace(): Promise<boolean> {
  const lotId = "MOON-RACE-TEST-TRANSFER";

  const setup = new Client({ connectionString: DB_URL });
  await setup.connect();

  const {
    rows: [fromOwner],
  } = await setup.query(`insert into members (email, display_name) values ($1, $2) returning id`, [
    "transfer-from-owner@example.com",
    "Original Owner",
  ]);

  await setup.query(
    `insert into lots (lot_id, lat_cell, lon_cell, owner_id, claimed_at) values ($1, 1, 1, $2, now())`,
    [lotId, fromOwner.id]
  );

  const recipientIds: string[] = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    const { rows } = await setup.query(
      `insert into members (email, display_name) values ($1, $2) returning id`,
      [`accept-racer-${i}@example.com`, `Accept Racer ${i}`]
    );
    recipientIds.push(rows[0].id);
  }
  await setup.end();

  const clients = await Promise.all(
    recipientIds.map(async () => {
      const c = new Client({ connectionString: DB_URL });
      await c.connect();
      return c;
    })
  );

  const results = await Promise.all(
    clients.map((c, i) =>
      c.query(
        `update lots set owner_id = $1, claimed_at = now() where lot_id = $2 and owner_id = $3 returning lot_id`,
        [recipientIds[i], lotId, fromOwner.id]
      )
    )
  );
  await Promise.all(clients.map((c) => c.end()));

  const successes = results.filter((r) => r.rowCount === 1).length;

  const verify = new Client({ connectionString: DB_URL });
  await verify.connect();
  const { rows: finalState } = await verify.query(`select owner_id from lots where lot_id = $1`, [lotId]);
  await verify.end();

  const ownerIsOneOfRecipients = recipientIds.includes(finalState[0]?.owner_id);

  console.log(
    `Transfer-accept race: ${CONCURRENCY} concurrent accept attempts on one pending transfer -> ${successes} succeeded (expected exactly 1)`
  );
  console.log(`Final owner_id belongs to one of the recipients: ${ownerIsOneOfRecipients}`);

  return successes === 1 && ownerIsOneOfRecipients;
}

async function main() {
  checkDockerAvailable();

  run(`docker rm -f ${CONTAINER_NAME} >/dev/null 2>&1 || true`);
  run(`docker run --rm -d --name ${CONTAINER_NAME} -e POSTGRES_PASSWORD=test -p ${PORT}:5432 postgres:16 >/dev/null`);

  try {
    console.log("Waiting for Postgres to be ready...");
    await waitForPg();

    console.log("\nApplying migrations...");
    await applyMigrations();

    console.log("\nRunning race-condition tests...\n");
    const claimOk = await testClaimRace();
    const transferOk = await testTransferAcceptRace();

    console.log(claimOk && transferOk ? "\n✔ All race-safety checks passed." : "\n✘ SOME CHECKS FAILED.");
    process.exitCode = claimOk && transferOk ? 0 : 1;
  } finally {
    run(`docker rm -f ${CONTAINER_NAME} >/dev/null 2>&1 || true`);
  }
}

main().catch((err) => {
  console.error(err);
  run(`docker rm -f ${CONTAINER_NAME} >/dev/null 2>&1 || true`);
  process.exit(1);
});
