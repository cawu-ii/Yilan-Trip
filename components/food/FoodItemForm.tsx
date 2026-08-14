"use client";

import { useState, type FormEvent } from "react";
import { useSWRConfig } from "swr";
import { Sheet } from "@/components/ui/Sheet";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useIdentityContext } from "@/components/layout/IdentityProvider";
import { sendJson } from "@/lib/fetcher";
import { FOOD_CATEGORY_LABEL } from "@/types";
import type { FoodCategory, FoodItem } from "@/types";

const CATEGORIES: FoodCategory[] = ["night_market", "restaurant", "souvenir"];

export function FoodItemForm({
  category,
  item,
  onClose,
}: {
  category: FoodCategory;
  item?: FoodItem | null;
  onClose: () => void;
}) {
  const { identity } = useIdentityContext();
  const { mutate } = useSWRConfig();
  const [cat, setCat] = useState<FoodCategory>(item?.category ?? category);
  const [name, setName] = useState(item?.name ?? "");
  const [note, setNote] = useState(item?.note ?? "");
  const [mapUrl, setMapUrl] = useState(item?.mapUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!identity) return;
    if (!name.trim()) {
      setError("請輸入名稱");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        category: cat,
        name: name.trim(),
        note: note.trim() || null,
        mapUrl: mapUrl.trim() || null,
        personId: identity.personId,
      };
      if (item) {
        await sendJson(`/api/food/${item.id}`, "PATCH", payload);
      } else {
        await sendJson("/api/food", "POST", payload);
      }
      await mutate("/api/food");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤，請再試一次");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!item) return;
    setSaving(true);
    setError(null);
    try {
      await sendJson(`/api/food/${item.id}`, "DELETE");
      await mutate("/api/food");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除失敗");
      setSaving(false);
    }
  }

  return (
    <Sheet title={item ? "編輯美食" : "新增美食"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Field label="分類">
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`tap-scale flex-1 rounded-xl border py-2 text-xs font-medium ${
                  cat === c
                    ? "border-accent bg-accent-soft text-accent-dark"
                    : "border-paper-line bg-white text-ink-soft"
                }`}
              >
                {FOOD_CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="名稱">
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：阿灶伯當歸羊肉湯"
          />
        </Field>
        <Field label="備註（選填）">
          <textarea
            className={inputClass}
            rows={2}
            value={note ?? ""}
            onChange={(e) => setNote(e.target.value)}
            placeholder="推薦原因、必點品項…"
          />
        </Field>
        <Field label="Google 地圖連結（選填）">
          <input
            className={inputClass}
            value={mapUrl ?? ""}
            onChange={(e) => setMapUrl(e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
          />
        </Field>

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        <div className="mt-2 flex gap-2">
          {item && (
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
