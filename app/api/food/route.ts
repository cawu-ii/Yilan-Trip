import { getDb } from "@/lib/db";
import { mapFoodItem } from "@/lib/mappers";
import { broadcast } from "@/lib/pusher-server";
import { foodItemCreateSchema } from "@/lib/validation";

export async function GET() {
  const db = getDb();
  const { rows } = await db.execute(
    "SELECT * FROM food_items ORDER BY category ASC, id ASC"
  );
  return Response.json(rows.map(mapFoodItem));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = foodItemCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "輸入格式錯誤" },
      { status: 400 }
    );
  }
  const { category, name, note, mapUrl, personId } = parsed.data;

  const db = getDb();
  const { rows } = await db.execute({
    sql: `INSERT INTO food_items (category, name, note, map_url, created_by, updated_by)
          VALUES (?, ?, ?, ?, ?, ?)
          RETURNING *`,
    args: [category, name, note, mapUrl, personId, personId],
  });

  await broadcast("food-update", "create");
  return Response.json(mapFoodItem(rows[0]), { status: 201 });
}
