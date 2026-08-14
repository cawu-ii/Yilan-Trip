import { getDb } from "@/lib/db";
import type { Day, ExpenseSummary, PersonBalance } from "@/types";

export async function GET() {
  const db = getDb();
  const [peopleRes, totalRes, perDayRes, paidRes, owedRes] = await Promise.all([
    db.execute("SELECT * FROM people ORDER BY id ASC"),
    db.execute("SELECT COALESCE(SUM(amount), 0) as total FROM expenses"),
    db.execute(
      "SELECT day, COALESCE(SUM(amount), 0) as total FROM expenses GROUP BY day"
    ),
    db.execute(
      "SELECT paid_by as person_id, COALESCE(SUM(amount), 0) as total FROM expenses GROUP BY paid_by"
    ),
    db.execute(
      "SELECT person_id, COALESCE(SUM(share_amount), 0) as total FROM expense_participants GROUP BY person_id"
    ),
  ]);

  const paidMap = new Map<number, number>(
    paidRes.rows.map((r) => [Number(r.person_id), Number(r.total)])
  );
  const owedMap = new Map<number, number>(
    owedRes.rows.map((r) => [Number(r.person_id), Number(r.total)])
  );

  const balances: PersonBalance[] = peopleRes.rows.map((row) => {
    const personId = Number(row.id);
    const paid = paidMap.get(personId) ?? 0;
    const owed = owedMap.get(personId) ?? 0;
    return {
      personId,
      name: String(row.name),
      color: String(row.color),
      paid,
      owed,
      net: paid - owed,
    };
  });

  const perDay = ([1, 2] as Day[]).map((day) => {
    const found = perDayRes.rows.find((r) => Number(r.day) === day);
    return { day, total: found ? Number(found.total) : 0 };
  });

  const summary: ExpenseSummary = {
    totalTrip: Number(totalRes.rows[0]?.total ?? 0),
    perDay,
    balances,
  };

  return Response.json(summary);
}
