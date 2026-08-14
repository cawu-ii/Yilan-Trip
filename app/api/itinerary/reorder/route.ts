import { getDb } from "@/lib/db";
import { broadcast } from "@/lib/pusher-server";
import { reorderSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "輸入格式錯誤" },
      { status: 400 }
    );
  }
  const { day, orderedIds } = parsed.data;

  const db = getDb();
  const statements = orderedIds.map((id, index) => ({
    sql: "UPDATE itinerary_items SET sort_order = ? WHERE id = ? AND day = ?",
    args: [(index + 1) * 10, id, day],
  }));
  await db.batch(statements, "write");

  await broadcast("itinerary-update", "reorder");
  return Response.json({ ok: true });
}
