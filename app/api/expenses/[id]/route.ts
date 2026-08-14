import { getDb } from "@/lib/db";
import { mapExpense } from "@/lib/mappers";
import { broadcast } from "@/lib/pusher-server";
import { computeEqualShares } from "@/lib/split";
import { expenseUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const expenseId = Number(id);
  if (!Number.isInteger(expenseId)) {
    return Response.json({ error: "無效的項目編號" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = expenseUpdateSchema.safeParse(body);
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
          participantIds.map((pid) => [pid, customShares?.[String(pid)] ?? 0])
        );

  const db = getDb();
  const { rows } = await db.execute({
    sql: `UPDATE expenses SET
            day = ?, title = ?, amount = ?, paid_by = ?, split_type = ?,
            updated_at = datetime('now')
          WHERE id = ?
          RETURNING *`,
    args: [day, title, amount, paidBy, splitType, expenseId],
  });
  if (rows.length === 0) {
    return Response.json({ error: "找不到這筆記帳" }, { status: 404 });
  }

  await db.execute({
    sql: "DELETE FROM expense_participants WHERE expense_id = ?",
    args: [expenseId],
  });
  await db.batch(
    participantIds.map((pid) => ({
      sql: "INSERT INTO expense_participants (expense_id, person_id, share_amount) VALUES (?, ?, ?)",
      args: [expenseId, pid, shares[pid]],
    })),
    "write"
  );

  // personId (who's making the edit) is accepted for parity with other
  // routes/attribution but expenses only track created_by, not updated_by.
  void personId;

  await broadcast("expense-update", "update");
  return Response.json(
    mapExpense(
      rows[0],
      participantIds.map((pid) => ({ personId: pid, shareAmount: shares[pid] }))
    )
  );
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const expenseId = Number(id);
  if (!Number.isInteger(expenseId)) {
    return Response.json({ error: "無效的項目編號" }, { status: 400 });
  }

  const db = getDb();
  await db.execute({
    sql: "DELETE FROM expenses WHERE id = ?",
    args: [expenseId],
  });

  await broadcast("expense-update", "delete");
  return Response.json({ ok: true });
}
