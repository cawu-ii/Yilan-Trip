"use client";

import { useIdentityContext } from "@/components/layout/IdentityProvider";
import { colorClasses } from "@/lib/colors";
import { computeSettlements } from "@/lib/split";
import { personById, usePeople } from "@/lib/people";
import type { Expense } from "@/types";

export function MySettlement({ expenses }: { expenses: Expense[] }) {
  const { identity } = useIdentityContext();
  const people = usePeople();

  if (!identity) return null;

  const mine = computeSettlements(expenses).filter(
    (s) => s.fromPersonId === identity.personId || s.toPersonId === identity.personId
  );

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
                  className="flex items-center justify-between"
                >
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                    <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                    {iOwe ? `要給 ${other.name}` : `${other.name} 要給我`}
                  </span>
                  <span
                    className={`font-mono text-sm font-semibold ${
                      iOwe ? "text-red-500" : "text-emerald-600"
                    }`}
                  >
                    NT$ {s.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
