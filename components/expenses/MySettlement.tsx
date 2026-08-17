"use client";

import { Check } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import { useIdentityContext } from "@/components/layout/IdentityProvider";
import { colorClasses } from "@/lib/colors";
import { fetcher, sendJson } from "@/lib/fetcher";
import { computeSettlements, type Settlement } from "@/lib/split";
import { personById, usePeople } from "@/lib/people";
import type { Expense, SettlementPayment } from "@/types";

export function MySettlement({ expenses }: { expenses: Expense[] }) {
  const { identity } = useIdentityContext();
  const people = usePeople();
  const { mutate } = useSWRConfig();
  const { data: payments } = useSWR<SettlementPayment[]>(
    "/api/settlements",
    fetcher,
    { refreshInterval: 45000 }
  );

  if (!identity) return null;

  const mine = computeSettlements(expenses, payments ?? []).filter(
    (s) => s.fromPersonId === identity.personId || s.toPersonId === identity.personId
  );

  async function markSettled(s: Settlement) {
    if (!confirm(`確定要標記這筆 NT$${s.amount.toLocaleString()} 已還款嗎？`)) return;
    await sendJson("/api/settlements", "POST", {
      fromPersonId: s.fromPersonId,
      toPersonId: s.toPersonId,
      amount: s.amount,
      personId: identity!.personId,
    });
    await mutate("/api/settlements");
  }

  return (
    <div className="mt-3 px-5">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-medium text-ink-soft">我的結算</p>
        {mine.length === 0 ? (
          <p className="text-sm text-ink-soft">目前沒有要付或要收的款項</p>
        ) : (
          <div className="space-y-2">
            {mine.map((s) => {
              const iOwe = s.fromPersonId === identity.personId;
              const otherId = iOwe ? s.toPersonId : s.fromPersonId;
              const other = personById(people, otherId);
              if (!other) return null;
              const c = colorClasses(other.color);
              return (
                <div
                  key={`${s.fromPersonId}-${s.toPersonId}`}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-ink">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                    <span className="truncate">
                      {iOwe ? `要給 ${other.name}` : `${other.name} 要給我`}
                    </span>
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        iOwe ? "text-red-500" : "text-emerald-600"
                      }`}
                    >
                      NT$ {s.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => markSettled(s)}
                      aria-label="標記已還款"
                      title="標記已還款"
                      className="tap-scale flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-paper-line text-transparent hover:border-emerald-400 hover:text-emerald-400"
                    >
                      <Check size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
