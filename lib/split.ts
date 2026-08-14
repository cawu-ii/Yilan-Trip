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
