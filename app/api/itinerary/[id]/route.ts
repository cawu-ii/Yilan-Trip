import { getDb } from "@/lib/db";
import { mapItineraryItem } from "@/lib/mappers";
import { broadcast } from "@/lib/pusher-server";
import { itineraryItemUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) {
    return Response.json({ error: "無效的項目編號" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = itineraryItemUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "輸入格式錯誤" },
      { status: 400 }
    );
  }
  const { time, title, location, mapUrl, note, personId } = parsed.data;

  const db = getDb();
  const { rows: existingRows } = await db.execute({
    sql: "SELECT * FROM itinerary_items WHERE id = ?",
    args: [itemId],
  });
  if (existingRows.length === 0) {
    return Response.json({ error: "找不到這筆行程" }, { status: 404 });
  }
  const existing = existingRows[0];

  const { rows } = await db.execute({
    sql: `UPDATE itinerary_items SET
            time = ?, title = ?, location = ?, map_url = ?, note = ?,
            updated_by = ?, updated_at = datetime('now')
          WHERE id = ?
          RETURNING *`,
    args: [
      time !== undefined ? time : existing.time,
      title !== undefined ? title : existing.title,
      location !== undefined ? location : existing.location,
      mapUrl !== undefined ? mapUrl : existing.map_url,
      note !== undefined ? note : existing.note,
      personId,
      itemId,
    ],
  });

  await broadcast("itinerary-update", "update");
  return Response.json(mapItineraryItem(rows[0]));
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) {
    return Response.json({ error: "無效的項目編號" }, { status: 400 });
  }

  const db = getDb();
  await db.execute({
    sql: "DELETE FROM itinerary_items WHERE id = ?",
    args: [itemId],
  });

  await broadcast("itinerary-update", "delete");
  return Response.json({ ok: true });
}
