"use client";

import Image from "next/image";
import { ItineraryItemCard } from "./ItineraryItemCard";
import type { ItineraryItem } from "@/types";

export function ItineraryTimeline({
  items,
  onEdit,
  onDelete,
}: {
  items: ItineraryItem[];
  onEdit: (item: ItineraryItem) => void;
  onDelete: (item: ItineraryItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center px-5 py-8 text-center">
        <Image
          src="/assets/cropped/6.png"
          alt=""
          width={90}
          height={72}
          className="opacity-70"
        />
        <p className="mt-2 text-sm text-ink-soft">
          這天還沒有安排行程，點下面「新增行程」加第一筆吧
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-5 py-4">
      {items.map((item) => (
        <ItineraryItemCard
          key={item.id}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
        />
      ))}
    </div>
  );
}
