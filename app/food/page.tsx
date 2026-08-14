"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import { CategoryChips } from "@/components/food/CategoryChips";
import { FoodItemCard } from "@/components/food/FoodItemCard";
import { FoodItemForm } from "@/components/food/FoodItemForm";
import { Button } from "@/components/ui/Button";
import { useIdentityContext } from "@/components/layout/IdentityProvider";
import { fetcher, sendJson } from "@/lib/fetcher";
import { usePeople } from "@/lib/people";
import type { FoodCategory, FoodItem } from "@/types";

const EMPTY_STATE_IMAGE: Record<
  FoodCategory,
  { src: string; width: number; height: number }
> = {
  night_market: { src: "/assets/cropped/11 (2).png", width: 93, height: 72 },
  restaurant: { src: "/assets/cropped/11 (5).png", width: 80, height: 72 },
  souvenir: { src: "/assets/cropped/11 (9).png", width: 68, height: 72 },
};

export default function FoodPage() {
  const [category, setCategory] = useState<FoodCategory>("night_market");
  const [editing, setEditing] = useState<FoodItem | null | "new">(null);
  const people = usePeople();
  const { identity } = useIdentityContext();
  const { mutate } = useSWRConfig();

  const { data: items, isLoading } = useSWR<FoodItem[]>("/api/food", fetcher, {
    refreshInterval: 45000,
  });
  const catItems = (items ?? []).filter((i) => i.category === category);

  async function toggleVisited(item: FoodItem) {
    if (!identity) return;
    await sendJson(`/api/food/${item.id}`, "PATCH", {
      visited: !item.visited,
      personId: identity.personId,
    });
    await mutate("/api/food");
  }

  async function handleDelete(item: FoodItem) {
    if (!confirm(`確定要刪除「${item.name}」嗎？`)) return;
    await sendJson(`/api/food/${item.id}`, "DELETE");
    await mutate("/api/food");
  }

  const emptyImage = EMPTY_STATE_IMAGE[category];

  return (
    <div className="pb-6">
      <div className="relative mx-5 mt-4 flex items-center justify-center rounded-2xl bg-paper-soft py-3">
        <Image src="/assets/cropped/11 (6).png" alt="" width={106} height={88} />
        <Image
          src="/assets/cropped/11 (3).png"
          alt=""
          aria-hidden
          width={52}
          height={48}
          className="pointer-events-none absolute -right-1 -top-2 -rotate-6"
        />
      </div>
      <CategoryChips category={category} onChange={setCategory} />

      {isLoading ? (
        <p className="px-5 py-10 text-center text-sm text-ink-soft">載入中…</p>
      ) : catItems.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-8 text-center">
          <Image
            src={emptyImage.src}
            alt=""
            width={emptyImage.width}
            height={emptyImage.height}
            className="opacity-70"
          />
          <p className="mt-2 text-sm text-ink-soft">
            這個分類還沒有項目，點下面新增
          </p>
        </div>
      ) : (
        <div className="space-y-3 px-5 py-4">
          {catItems.map((item) => (
            <FoodItemCard
              key={item.id}
              item={item}
              people={people}
              onToggleVisited={() => toggleVisited(item)}
              onEdit={() => setEditing(item)}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </div>
      )}

      <div className="px-5">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setEditing("new")}
        >
          <Plus size={16} />
          新增美食
        </Button>
      </div>

      {editing && (
        <FoodItemForm
          category={category}
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
