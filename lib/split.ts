/** Equal split: floor division, remainder (in whole NTD) given to the
 * lowest-id participants first — deterministic, no floating point. */
export function computeEqualShares(
  amount: number,
  participantIds: number[]
): Record<number, number> {
  const sorted = [...participantIds].sort((a, b) => a - b);
  const n = sorted.length;
  const base = Math.floor(amount / n);
  const remainder = amount - base * n;
  const shares: Record<number, number> = {};
  sorted.forEach((id, idx) => {
    shares[id] = base + (idx < remainder ? 1 : 0);
  });
  return shares;
}

export interface Settlement {
  fromPersonId: number;
  toPersonId: number;
  amount: number;
}

/** Nets every expense down to one final amount per pair of people —
 * cross-directional debts between the same two people (e.g. A covers
 * dinner, B covers drinks) collapse into a single settlement instead of
 * two separate ones. Recorded repayments (`payments`) are netted in the
 * same pass so a marked-as-paid debt actually disappears from the result. */
export function computeSettlements(
  expenses: { paidBy: number; participants: { personId: number; shareAmount: number }[] }[],
  payments: { fromPersonId: number; toPersonId: number; amount: number }[] = []
): Settlement[] {
  const net = new Map<string, number>();

  function applyDebt(ower: number, payee: number, amount: number) {
    const lo = Math.min(ower, payee);
    const hi = Math.max(ower, payee);
    const key = `${lo}-${hi}`;
    const delta = ower === hi ? amount : -amount;
    net.set(key, (net.get(key) ?? 0) + delta);
  }

  for (const expense of expenses) {
    for (const participant of expense.participants) {
      if (participant.personId === expense.paidBy) continue;
      applyDebt(participant.personId, expense.paidBy, participant.shareAmount);
    }
  }

  // A repayment cancels debt in the same direction it was owed, which is
  // the same as accruing a debt with the ower/payee roles swapped.
  for (const payment of payments) {
    applyDebt(payment.toPersonId, payment.fromPersonId, payment.amount);
  }

  const settlements: Settlement[] = [];
  for (const [key, value] of net) {
    if (value === 0) continue;
    const [lo, hi] = key.split("-").map(Number);
    settlements.push(
      value > 0
        ? { fromPersonId: hi, toPersonId: lo, amount: value }
        : { fromPersonId: lo, toPersonId: hi, amount: -value }
    );
  }
  return settlements;
}
