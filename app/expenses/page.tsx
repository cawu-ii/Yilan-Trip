"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import useSWR from "swr";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { MySettlement } from "@/components/expenses/MySettlement";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Button } from "@/components/ui/Button";
import { fetcher } from "@/lib/fetcher";
import { usePeople } from "@/lib/people";
import type { Expense } from "@/types";

export default function ExpensesPage() {
  const [editing, setEditing] = useState<Expense | null | "new">(null);
  const people = usePeople();
  const { data: expenses, isLoading } = useSWR<Expense[]>(
    "/api/expenses",
    fetcher,
    { refreshInterval: 45000 }
  );

  return (
    <div className="pb-6">
      <ExpenseSummary />
      <MySettlement expenses={expenses ?? []} />

      {isLoading ? (
        <p className="px-5 py-10 text-center text-sm text-ink-soft">載入中…</p>
      ) : (
        <ExpenseList
          expenses={expenses ?? []}
          people={people}
          onEdit={setEditing}
        />
      )}

      <div className="px-5">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setEditing("new")}
        >
          <Plus size={16} />
          新增記帳
        </Button>
      </div>

      {editing && (
        <ExpenseForm
          expense={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
