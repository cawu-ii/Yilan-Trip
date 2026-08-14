import { getDb } from "@/lib/db";
import { mapPerson } from "@/lib/mappers";

export async function GET() {
  const db = getDb();
  const { rows } = await db.execute("SELECT * FROM people ORDER BY id ASC");
  return Response.json(rows.map(mapPerson));
}
