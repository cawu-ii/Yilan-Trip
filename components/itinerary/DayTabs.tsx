"use client";

import type { Day } from "@/types";

const DAYS: { day: Day; date: string }[] = [
  { day: 1, date: "8/15（六）" },
  { day: 2, date: "8/16（日）" },
];

export function DayTabs({
  day,
  onChange,
}: {
  day: Day;
  onChange: (day: Day) => void;
}) {
  return (
    <div className="flex gap-2 px-5 pt-4">
      {DAYS.map(({ day: d, date }) => {
        const active = d === day;
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`tap-scale flex-1 rounded-2xl border py-2 text-center transition-colors ${
              active
                ? "border-accent bg-accent-soft text-accent-dark"
                : "border-paper-line bg-white text-ink-soft"
            }`}
          >
            <div className="font-display text-sm font-bold">Day {d}</div>
            <div className="text-[11px]">{date}</div>
          </button>
        );
      })}
    </div>
  );
}
