import { getDb } from "@/lib/db";
import { mapFoodItem } from "@/lib/mappers";
import { broadcast } from "@/lib/pusher-server";
import { foodItemUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) {
    return Response.json({ error: "無效的項目編號" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = foodItemUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "輸入格式錯誤" },
      { status: 400 }
    );
  }
  const { category, name, note, mapUrl, visited, personId } = parsed.data;

  const db = getDb();
  const { rows: existingRows } = await db.execute({
    sql: "SELECT * FROM food_items WHERE id = ?",
    args: [itemId],
  });
  if (existingRows.length === 0) {
    return Response.json({ error: "找不到這筆美食" }, { status: 404 });
  }
  const existing = existingRows[0];

  const { rows } = await db.execute({
    sql: `UPDATE food_items SET
            category = ?, name = ?, note = ?, map_url = ?, visited = ?,
            updated_by = ?, updated_at = datetime('now')
          WHERE id = ?
          RETURNING *`,
    args: [
      category !== undefined ? category : existing.category,
      name !== undefined ? name : existing.name,
      note !== undefined ? note : existing.note,
      mapUrl !== undefined ? mapUrl : existing.map_url,
      visited !== undefined ? (visited ? 1 : 0) : existing.visited,
      personId,
      itemId,
    ],
  });

  await broadcast("food-update", "update");
  return Response.json(mapFoodItem(rows[0]));
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) {
    return Response.json({ error: "無效的項目編號" }, { status: 400 });
  }

  const db = getDb();
  await db.execute({ sql: "DELETE FROM food_items WHERE id = ?", args: [itemId] });

  await broadcast("food-update", "delete");
  return Response.json({ ok: true });
}
