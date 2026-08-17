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
 * two separate ones. */
export function computeSettlements(
  expenses: { paidBy: number; participants: { personId: number; shareAmount: number }[] }[]
): Settlement[] {
  const net = new Map<string, number>();

  for (const expense of expenses) {
    for (const participant of expense.participants) {
      if (participant.personId === expense.paidBy) continue;
      const ower = participant.personId;
      const payee = expense.paidBy;
      const lo = Math.min(ower, payee);
      const hi = Math.max(ower, payee);
      const key = `${lo}-${hi}`;
      const delta = ower === hi ? participant.shareAmount : -participant.shareAmount;
      net.set(key, (net.get(key) ?? 0) + delta);
    }
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
