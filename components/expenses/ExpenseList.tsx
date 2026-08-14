"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { colorClasses } from "@/lib/colors";
import { personById } from "@/lib/people";
import type { Day, Expense, Person } from "@/types";

const DAY_LABEL: Record<Day, string> = { 1: "8/15", 2: "8/16" };

export function ExpenseList({
  expenses,
  people,
  onEdit,
}: {
  expenses: Expense[];
  people: Person[];
  onEdit: (expense: Expense) => void;
}) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center px-5 py-8 text-center">
        <Image
          src="/assets/cropped/7.png"
          alt=""
          width={96}
          height={72}
          className="opacity-70"
        />
        <p className="mt-2 text-sm text-ink-soft">
          還沒有任何記帳，點下面「新增記帳」開始記第一筆
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-5 py-4">
      {([1, 2] as Day[]).map((day) => {
        const dayExpenses = expenses.filter((e) => e.day === day);
        if (dayExpenses.length === 0) return null;
        return (
          <div key={day}>
            <p className="mb-2 text-xs font-semibold text-ink-soft">
              Day {day}（{DAY_LABEL[day]}）
            </p>
            <div className="space-y-2">
              {dayExpenses.map((expense) => {
                const payer = personById(people, expense.paidBy);
                const c = payer ? colorClasses(payer.color) : null;
                return (
                  <button
                    key={expense.id}
                    onClick={() => onEdit(expense)}
                    className={`ticket-stub tap-scale flex w-full items-center justify-between rounded-2xl border border-paper-line bg-white px-4 py-3 text-left shadow-sm ${
                      c?.border ?? ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold text-ink">
                        {expense.title}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {payer?.name ?? "?"} 付款・
                        {expense.splitType === "equal" ? "平分" : "自訂分攤"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-ink">
                        NT$ {expense.amount.toLocaleString()}
                      </span>
                      <Pencil size={14} className="text-ink-soft" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
