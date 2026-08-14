"use client";

import { FOOD_CATEGORY_LABEL, type FoodCategory } from "@/types";

const CATEGORIES: FoodCategory[] = ["night_market", "restaurant", "souvenir"];

export function CategoryChips({
  category,
  onChange,
}: {
  category: FoodCategory;
  onChange: (category: FoodCategory) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-5 pb-1 pt-4">
      {CATEGORIES.map((c) => {
        const active = c === category;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`tap-scale shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium ${
              active
                ? "border-accent bg-accent-soft text-accent-dark"
                : "border-paper-line bg-white text-ink-soft"
            }`}
          >
            {FOOD_CATEGORY_LABEL[c]}
          </button>
        );
      })}
    </div>
  );
}
