// One-off DB bootstrap script.
// Local dev (no env vars set):   node scripts/init-db.mjs
// Against Turso (production):    TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... node scripts/init-db.mjs
//
// Applies db/schema.sql (idempotent, CREATE TABLE IF NOT EXISTS), then
// db/seed.sql only if the `people` table is currently empty — safe to
// re-run any time without duplicating seed rows.

import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function splitStatements(sql) {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL || "file:./local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const db = createClient(authToken ? { url, authToken } : { url });

  console.log(`[init-db] target: ${url}`);

  const schema = readFileSync(path.join(root, "db", "schema.sql"), "utf-8");
  for (const stmt of splitStatements(schema)) {
    await db.execute(stmt);
  }
  console.log("[init-db] schema applied");

  const { rows } = await db.execute("SELECT COUNT(*) as c FROM people");
  const count = Number(rows[0]?.c ?? 0);

  if (count > 0) {
    console.log(`[init-db] people table already has ${count} rows — skipping seed`);
    return;
  }

  const seed = readFileSync(path.join(root, "db", "seed.sql"), "utf-8");
  for (const stmt of splitStatements(seed)) {
    await db.execute(stmt);
  }
  console.log("[init-db] seed data inserted");
}

main()
  .then(() => {
    console.log("[init-db] done");
    process.exit(0);
  })
  .catch((err) => {
    console.error("[init-db] failed:", err);
    process.exit(1);
  });
