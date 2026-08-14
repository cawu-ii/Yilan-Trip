"use client";

import { Check, MapPin, Pencil, Trash2 } from "lucide-react";
import { colorClasses } from "@/lib/colors";
import { personById } from "@/lib/people";
import type { FoodItem, Person } from "@/types";

export function FoodItemCard({
  item,
  people,
  onToggleVisited,
  onEdit,
  onDelete,
}: {
  item: FoodItem;
  people: Person[];
  onToggleVisited: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const editor = personById(people, item.updatedBy ?? item.createdBy);
  const borderColor = editor ? colorClasses(editor.color).border : "border-paper-line";

  return (
    <div
      className={`ticket-stub rounded-2xl border border-paper-line bg-white px-4 py-3 shadow-sm ${borderColor} ${
        item.visited ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-display text-base font-bold text-ink ${
              item.visited ? "line-through decoration-ink-soft/50" : ""
            }`}
          >
            {item.name}
          </h3>
          {item.note && <p className="mt-1 text-xs text-ink-soft">{item.note}</p>}
        </div>
        <button
          onClick={onToggleVisited}
          aria-label="標記已吃過"
          className={`tap-scale flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
            item.visited
              ? "border-emerald-400 bg-emerald-400 text-white"
              : "border-paper-line text-transparent"
          }`}
        >
          <Check size={14} />
        </button>
      </div>

      <div className="ticket-divider mt-2.5 flex items-center justify-between pt-2">
        {item.mapUrl ? (
          <a
            href={item.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="tap-scale inline-flex items-center gap-1 text-xs font-medium text-accent-dark"
          >
            <MapPin size={13} />
            Google 地圖
          </a>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            aria-label="編輯"
            className="tap-scale rounded-full p-1.5 text-ink-soft hover:bg-paper-soft"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            aria-label="刪除"
            className="tap-scale rounded-full p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
