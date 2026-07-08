// Applies every file in supabase/migrations/ directly against a real
// Postgres database via SUPABASE_DB_URL, in filename order. Stops
// immediately on the first failure rather than pushing on, so a partial
// apply is always obvious from the log rather than silently incomplete.
//
// This exists because pasting SQL through the Supabase dashboard's SQL
// Editor has no verification step — there's no reliable way to confirm
// from outside the browser that a paste actually ran. A direct connection
// removes that gap.
//
// Usage: node --env-file=.env.local --import tsx scripts/apply-migrations.ts
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";

async function main() {
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    throw new Error("SUPABASE_DB_URL not set.");
  }

  const dir = path.join(__dirname, "..", "supabase", "migrations");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`Found ${files.length} migration(s): ${files.join(", ")}`);

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected.\n");

  try {
    for (const file of files) {
      const sql = readFileSync(path.join(dir, file), "utf8");
      process.stdout.write(`Applying ${file} ... `);
      try {
        await client.query(sql);
        console.log("OK");
      } catch (err) {
        console.log("FAILED");
        throw err;
      }
    }
    console.log("\nAll migrations applied successfully.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("\n" + (err instanceof Error ? err.message : String(err)));
  process.exit(1);
});
