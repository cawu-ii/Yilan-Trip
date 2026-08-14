import { getDb } from "@/lib/db";
import { mapExpense, mapExpenseParticipant } from "@/lib/mappers";
import { broadcast } from "@/lib/pusher-server";
import { computeEqualShares } from "@/lib/split";
import { expenseCreateSchema } from "@/lib/validation";
import type { ExpenseParticipant } from "@/types";

export async function GET() {
  const db = getDb();
  const [expensesRes, participantsRes] = await Promise.all([
    db.execute("SELECT * FROM expenses ORDER BY day ASC, created_at ASC"),
    db.execute("SELECT * FROM expense_participants"),
  ]);

  const participantsByExpense = new Map<number, ExpenseParticipant[]>();
  for (const row of participantsRes.rows) {
    const expenseId = Number(row.expense_id);
    const list = participantsByExpense.get(expenseId) ?? [];
    list.push(mapExpenseParticipant(row));
    participantsByExpense.set(expenseId, list);
  }

  const expenses = expensesRes.rows.map((row) =>
    mapExpense(row, participantsByExpense.get(Number(row.id)) ?? [])
  );
  return Response.json(expenses);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = expenseCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "輸入格式錯誤" },
      { status: 400 }
    );
  }
  const {
    day,
    title,
    amount,
    paidBy,
    splitType,
    participantIds,
    customShares,
    personId,
  } = parsed.data;

  const shares: Record<number, number> =
    splitType === "equal"
      ? computeEqualShares(amount, participantIds)
      : Object.fromEntries(
          participantIds.map((id) => [id, customShares?.[String(id)] ?? 0])
        );

  const db = getDb();
  const { rows } = await db.execute({
    sql: `INSERT INTO expenses (day, title, amount, paid_by, split_type, created_by)
          VALUES (?, ?, ?, ?, ?, ?)
          RETURNING *`,
    args: [day, title, amount, paidBy, splitType, personId],
  });
  const expenseRow = rows[0];
  const expenseId = Number(expenseRow.id);

  await db.batch(
    participantIds.map((pid) => ({
      sql: "INSERT INTO expense_participants (expense_id, person_id, share_amount) VALUES (?, ?, ?)",
      args: [expenseId, pid, shares[pid]],
    })),
    "write"
  );

  await broadcast("expense-update", "create");
  return Response.json(
    mapExpense(
      expenseRow,
      participantIds.map((pid) => ({ personId: pid, shareAmount: shares[pid] }))
    ),
    { status: 201 }
  );
}
