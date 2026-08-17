import { getDb } from "@/lib/db";
import { mapSettlementPayment } from "@/lib/mappers";
import { broadcast } from "@/lib/pusher-server";
import { settlementPaymentCreateSchema } from "@/lib/validation";

export async function GET() {
  const db = getDb();
  const { rows } = await db.execute(
    "SELECT * FROM settlement_payments ORDER BY created_at ASC"
  );
  return Response.json(rows.map(mapSettlementPayment));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = settlementPaymentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "輸入格式錯誤" },
      { status: 400 }
    );
  }
  const { fromPersonId, toPersonId, amount, personId } = parsed.data;

  const db = getDb();
  const { rows } = await db.execute({
    sql: `INSERT INTO settlement_payments (from_person_id, to_person_id, amount, created_by)
          VALUES (?, ?, ?, ?)
          RETURNING *`,
    args: [fromPersonId, toPersonId, amount, personId],
  });

  await broadcast("settlement-update", "create");
  return Response.json(mapSettlementPayment(rows[0]), { status: 201 });
}
