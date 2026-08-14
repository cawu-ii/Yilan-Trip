"use client";

import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { colorClasses } from "@/lib/colors";
import type { ExpenseSummary as Summary } from "@/types";

export function ExpenseSummary() {
  const { data } = useSWR<Summary>("/api/expenses/summary", fetcher, {
    refreshInterval: 45000,
  });

  if (!data) return null;

  return (
    <div className="px-5 pt-4">
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
        <Image
          src="/assets/cropped/3.png"
          alt=""
          aria-hidden
          width={24}
          height={32}
          className="pointer-events-none absolute right-4 top-3 opacity-70"
        />
        <p className="text-xs font-medium text-ink-soft">總花費</p>
        <p className="mt-0.5 font-display text-2xl font-bold text-ink">
          NT$ {data.totalTrip.toLocaleString()}
        </p>
        <div className="ticket-divider mt-3 grid grid-cols-2 gap-2 pt-3 text-xs text-ink-soft">
          {data.perDay.map((d) => (
            <div key={d.day} className="flex justify-between">
              <span>Day {d.day}</span>
              <span>NT$ {d.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-medium text-ink-soft">目前結餘</p>
        <div className="space-y-2">
          {data.balances.map((b) => {
            const c = colorClasses(b.color);
            return (
              <div
                key={b.personId}
                className="flex items-center justify-between"
              >
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-medium ${c.ink}`}
                >
                  <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                  {b.name}
                </span>
                <span
                  className={`font-mono text-sm font-semibold ${
                    b.net > 0
                      ? "text-emerald-600"
                      : b.net < 0
                        ? "text-red-500"
                        : "text-ink-soft"
                  }`}
                >
                  {b.net > 0 ? "+" : ""}
                  {b.net.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
