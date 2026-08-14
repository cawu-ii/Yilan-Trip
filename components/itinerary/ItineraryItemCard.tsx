"use client";

import { MapPin, Pencil, Trash2 } from "lucide-react";
import type { ItineraryItem } from "@/types";

export function ItineraryItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: ItineraryItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="ticket-stub rounded-2xl border border-paper-line border-l-accent bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {item.time && (
            <p className="font-mono text-xs font-medium text-accent-dark">
              {item.time}
            </p>
          )}
          <h3 className="mt-0.5 truncate font-display text-base font-bold text-ink">
            {item.title}
          </h3>
          {item.location && (
            <p className="mt-0.5 text-xs text-ink-soft">{item.location}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={onEdit}
            aria-label="編輯"
            className="tap-scale rounded-full p-1.5 text-ink-soft hover:bg-paper-soft"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={onDelete}
            aria-label="刪除"
            className="tap-scale rounded-full p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {item.note && (
        <p className="mt-2 rounded-lg bg-paper-soft px-2.5 py-1.5 text-xs text-ink-soft">
          {item.note}
        </p>
      )}

      {item.mapUrl && (
        <div className="ticket-divider mt-2.5 pt-2">
          <a
            href={item.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="tap-scale inline-flex items-center gap-1 text-xs font-medium text-accent-dark"
          >
            <MapPin size={13} />
            Google 地圖
          </a>
        </div>
      )}
    </div>
  );
}
