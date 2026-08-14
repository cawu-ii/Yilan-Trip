import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

/**
 * Returns a singleton libSQL client.
 * - In production, set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN to point at Turso.
 * - Locally (no env vars), falls back to a file-based SQLite db (./local.db)
 *   using the exact same client/query code.
 */
export function getDb(): Client {
  if (client) return client;
  const url = process.env.TURSO_DATABASE_URL || "file:./local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  client = createClient(authToken ? { url, authToken } : { url });
  return client;
}
