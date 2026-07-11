// One-time seed: pre-generate the full lot grid into `lots`.
//
// Without NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set (or with
// --dry-run passed explicitly), this writes a CSV to scripts/out/ instead of
// touching a database, so the generation logic can be exercised before a
// real Supabase project exists.
//
// This is a standalone script, not run through Next.js, so .env.local isn't
// loaded automatically — export the vars first, or run with
// `node --env-file=.env.local` wrapping tsx (Node 20.6+).
//
// Usage:
//   npm run seed:lots -- --dry-run
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:lots
import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { generateGridCells, gridSize, lotIdForCell, LOT_GRID } from "../src/lib/lots";

const BATCH_SIZE = 5000;
// Whole-sphere coverage is ~6.49M rows (~1,298 batches at BATCH_SIZE=5000);
// fully serial upserts would take 30+ minutes of pure round-trip overhead.
// Bounded concurrency keeps several batches in flight at once. Each worker
// still awaits its own upsertBatch() (with its own retry/backoff) before
// pulling the next batch, so this doesn't change per-batch semantics —
// it just runs several of them at the same time.
const CONCURRENCY = 4;
const dryRun = process.argv.includes("--dry-run");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  const total = gridSize(LOT_GRID);
  console.log(
    `Lot grid: lat [${LOT_GRID.latMinDeg}, ${LOT_GRID.latMaxDeg}]°, lon [${LOT_GRID.lonMinDeg}, ${LOT_GRID.lonMaxDeg}]°, step ${LOT_GRID.stepDeg}° -> ${total.toLocaleString()} lots`
  );

  if (dryRun || !supabaseUrl || !serviceRoleKey) {
    if (!dryRun) {
      console.log(
        "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — falling back to --dry-run (CSV output only)."
      );
    }
    await writeCsv(total);
    return;
  }

  await seedSupabase(supabaseUrl, serviceRoleKey, total);
}

async function writeCsv(total: number) {
  const outDir = path.join(__dirname, "out");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "lots.csv");

  const lines = ["lot_id,lat_cell,lon_cell"];
  let count = 0;
  for (const { latCell, lonCell } of generateGridCells(LOT_GRID)) {
    lines.push(`${lotIdForCell(latCell, lonCell)},${latCell},${lonCell}`);
    count++;
  }
  writeFileSync(outPath, lines.join("\n") + "\n");
  console.log(`Wrote ${count.toLocaleString()} / ${total.toLocaleString()} rows to ${outPath}`);
}

type LotRow = { lot_id: string; lat_cell: number; lon_cell: number };

async function seedSupabase(url: string, key: string, total: number) {
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const MAX_ATTEMPTS = 5;

  const upsertBatch = async (batch: LotRow[]) => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const { error } = await supabase.from("lots").upsert(batch, {
        onConflict: "lot_id",
        ignoreDuplicates: true,
      });
      if (!error) return;

      if (attempt === MAX_ATTEMPTS) {
        throw new Error(`Failed to seed batch starting with ${batch[0].lot_id} after ${MAX_ATTEMPTS} attempts: ${error.message}`);
      }
      // Transient network/connection errors under sustained load — back off
      // and retry rather than aborting the whole run over one bad request.
      const delayMs = 500 * 2 ** (attempt - 1);
      process.stdout.write(`\n  retry ${attempt}/${MAX_ATTEMPTS} for batch starting ${batch[0].lot_id} (${error.message}), waiting ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  };

  // Shared generator: each call to nextBatch() resumes it from where the
  // last call left off. Safe across concurrent workers below because JS is
  // single-threaded and nextBatch() runs synchronously to completion (no
  // `await` inside it), so calls from different workers can't interleave.
  const cells = generateGridCells(LOT_GRID);

  function nextBatch(): LotRow[] | null {
    const batch: LotRow[] = [];
    for (const { latCell, lonCell } of cells) {
      batch.push({ lot_id: lotIdForCell(latCell, lonCell), lat_cell: latCell, lon_cell: lonCell });
      if (batch.length >= BATCH_SIZE) return batch;
    }
    return batch.length > 0 ? batch : null;
  }

  let inserted = 0;

  async function worker() {
    for (;;) {
      const batch = nextBatch();
      if (!batch) return;
      await upsertBatch(batch);
      inserted += batch.length;
      process.stdout.write(`\rSeeded ${inserted.toLocaleString()} / ${total.toLocaleString()}`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log(`\nDone. Seeded ${inserted.toLocaleString()} lots.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
