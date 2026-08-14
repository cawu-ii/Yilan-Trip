"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSWRConfig } from "swr";
import { Sheet } from "@/components/ui/Sheet";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useIdentityContext } from "@/components/layout/IdentityProvider";
import { colorClasses } from "@/lib/colors";
import { usePeople } from "@/lib/people";
import { sendJson } from "@/lib/fetcher";
import type { Day, Expense, SplitType } from "@/types";

export function ExpenseForm({
  expense,
  onClose,
}: {
  expense?: Expense | null;
  onClose: () => void;
}) {
  const { identity } = useIdentityContext();
  const people = usePeople();
  const { mutate } = useSWRConfig();

  const [day, setDay] = useState<Day>(expense?.day ?? 1);
  const [title, setTitle] = useState(expense?.title ?? "");
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [paidBy, setPaidBy] = useState<number>(
    expense?.paidBy ?? identity?.personId ?? 1
  );
  const [participantIds, setParticipantIds] = useState<number[]>(
    expense
      ? expense.participants.map((p) => p.personId)
      : people.map((p) => p.id)
  );
  const [splitType, setSplitType] = useState<SplitType>(
    expense?.splitType ?? "equal"
  );
  const [customShares, setCustomShares] = useState<Record<number, string>>(
    () => {
      if (expense && expense.splitType === "custom") {
        return Object.fromEntries(
          expense.participants.map((p) => [p.personId, String(p.shareAmount)])
        );
      }
      return {};
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountNum = Number(amount) || 0;

  const equalPreview = useMemo(() => {
    if (participantIds.length === 0) return {} as Record<number, number>;
    const sorted = [...participantIds].sort((a, b) => a - b);
    const base = Math.floor(amountNum / sorted.length);
    const remainder = amountNum - base * sorted.length;
    const map: Record<number, number> = {};
    sorted.forEach((id, idx) => {
      map[id] = base + (idx < remainder ? 1 : 0);
    });
    return map;
  }, [amountNum, participantIds]);

  const customSum = participantIds.reduce(
    (acc, id) => acc + (Number(customShares[id]) || 0),
    0
  );

  function toggleParticipant(id: number) {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!identity) return;
    if (!title.trim()) {
      setError("請輸入項目名稱");
      return;
    }
    if (amountNum <= 0) {
      setError("請輸入金額");
      return;
    }
    if (participantIds.length === 0) {
      setError("至少選一位分攤者");
      return;
    }
    if (splitType === "custom" && customSum !== amountNum) {
      setError(`自訂金額總和（${customSum}）需等於總金額（${amountNum}）`);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        day,
        title: title.trim(),
        amount: amountNum,
        paidBy,
        splitType,
        participantIds,
        customShares:
          splitType === "custom"
            ? Object.fromEntries(
                participantIds.map((id) => [
                  String(id),
                  Number(customShares[id]) || 0,
                ])
              )
            : undefined,
        personId: identity.personId,
      };
      if (expense) {
        await sendJson(`/api/expenses/${expense.id}`, "PATCH", payload);
      } else {
        await sendJson("/api/expenses", "POST", payload);
      }
      await mutate("/api/expenses");
      await mutate("/api/expenses/summary");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤，請再試一次");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!expense) return;
    setSaving(true);
    setError(null);
    try {
      await sendJson(`/api/expenses/${expense.id}`, "DELETE");
      await mutate("/api/expenses");
      await mutate("/api/expenses/summary");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除失敗");
      setSaving(false);
    }
  }

  return (
    <Sheet title={expense ? "編輯記帳" : "新增記帳"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Field label="日期">
          <div className="flex gap-2">
            {([1, 2] as Day[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDay(d)}
                className={`tap-scale flex-1 rounded-xl border py-2 text-sm font-medium ${
                  day === d
                    ? "border-accent bg-accent-soft text-accent-dark"
                    : "border-paper-line bg-white text-ink-soft"
                }`}
              >
                Day {d}（{d === 1 ? "8/15" : "8/16"}）
              </button>
            ))}
          </div>
        </Field>

        <Field label="項目名稱">
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：晚餐"
          />
        </Field>

        <Field label="金額（NTD）">
          <input
            className={inputClass}
            type="number"
            inputMode="numeric"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </Field>

        <Field label="誰付的">
          <div className="flex flex-wrap gap-2">
            {people.map((p) => {
              const c = colorClasses(p.color);
              const active = paidBy === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaidBy(p.id)}
                  className={`tap-scale rounded-full border px-3 py-1.5 text-xs font-medium ${
                    active
                      ? `${c.soft} ${c.ink} ${c.border}`
                      : "border-paper-line bg-white text-ink-soft"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="誰要分攤這筆">
          <div className="flex flex-wrap gap-2">
            {people.map((p) => {
              const c = colorClasses(p.color);
              const active = participantIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleParticipant(p.id)}
                  className={`tap-scale rounded-full border px-3 py-1.5 text-xs font-medium ${
                    active
                      ? `${c.soft} ${c.ink} ${c.border}`
                      : "border-paper-line bg-white text-ink-soft opacity-60"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="怎麼分">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSplitType("equal")}
              className={`tap-scale flex-1 rounded-xl border py-2 text-sm font-medium ${
                splitType === "equal"
                  ? "border-accent bg-accent-soft text-accent-dark"
                  : "border-paper-line bg-white text-ink-soft"
              }`}
            >
              平分
            </button>
            <button
              type="button"
              onClick={() => setSplitType("custom")}
              className={`tap-scale flex-1 rounded-xl border py-2 text-sm font-medium ${
                splitType === "custom"
                  ? "border-accent bg-accent-soft text-accent-dark"
                  : "border-paper-line bg-white text-ink-soft"
              }`}
            >
              自訂金額
            </button>
          </div>
        </Field>

        {splitType === "equal" ? (
          <div className="mb-3 space-y-1 rounded-xl bg-paper-soft px-3 py-2 text-xs text-ink-soft">
            {participantIds.map((id) => {
              const p = people.find((pp) => pp.id === id);
              if (!p) return null;
              return (
                <div key={id} className="flex justify-between">
                  <span>{p.name}</span>
                  <span>${equalPreview[id] ?? 0}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mb-3 space-y-2">
            {participantIds.map((id) => {
              const p = people.find((pp) => pp.id === id);
              if (!p) return null;
              return (
                <div key={id} className="flex items-center gap-2">
                  <span className="w-12 shrink-0 text-xs text-ink-soft">
                    {p.name}
                  </span>
                  <input
                    className={inputClass}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={customShares[id] ?? ""}
                    onChange={(e) =>
                      setCustomShares((prev) => ({
                        ...prev,
                        [id]: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              );
            })}
            <p
              className={`text-right text-xs ${
                customSum === amountNum ? "text-ink-soft" : "text-red-500"
              }`}
            >
              合計 ${customSum} / ${amountNum}
            </p>
          </div>
        )}

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        <div className="mt-2 flex gap-2">
          {expense && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={saving}
            >
              刪除
            </Button>
          )}
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? "儲存中…" : "儲存"}
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
