import { getDb } from "@/lib/db";
import { mapItineraryItem } from "@/lib/mappers";
import { broadcast } from "@/lib/pusher-server";
import { itineraryItemCreateSchema } from "@/lib/validation";

export async function GET() {
  const db = getDb();
  const { rows } = await db.execute(
    "SELECT * FROM itinerary_items ORDER BY day ASC, sort_order ASC"
  );
  return Response.json(rows.map(mapItineraryItem));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = itineraryItemCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "輸入格式錯誤" },
      { status: 400 }
    );
  }
  const { day, time, title, location, mapUrl, note, personId } = parsed.data;

  const db = getDb();
  const { rows: maxRows } = await db.execute({
    sql: "SELECT COALESCE(MAX(sort_order), 0) as m FROM itinerary_items WHERE day = ?",
    args: [day],
  });
  const nextOrder = Number(maxRows[0]?.m ?? 0) + 10;

  const { rows } = await db.execute({
    sql: `INSERT INTO itinerary_items
            (day, sort_order, time, title, location, map_url, note, created_by, updated_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          RETURNING *`,
    args: [
      day,
      nextOrder,
      time,
      title,
      location,
      mapUrl,
      note,
      personId,
      personId,
    ],
  });

  await broadcast("itinerary-update", "create");
  return Response.json(mapItineraryItem(rows[0]), { status: 201 });
}
