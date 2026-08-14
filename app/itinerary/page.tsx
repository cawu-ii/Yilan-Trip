"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import { DayTabs } from "@/components/itinerary/DayTabs";
import { ItineraryTimeline } from "@/components/itinerary/ItineraryTimeline";
import { ItineraryItemForm } from "@/components/itinerary/ItineraryItemForm";
import { Button } from "@/components/ui/Button";
import { fetcher, sendJson } from "@/lib/fetcher";
import type { Day, ItineraryItem } from "@/types";

export default function ItineraryPage() {
  const [day, setDay] = useState<Day>(1);
  const [editing, setEditing] = useState<ItineraryItem | null | "new">(null);
  const { mutate } = useSWRConfig();

  const { data: items, isLoading } = useSWR<ItineraryItem[]>(
    "/api/itinerary",
    fetcher,
    { refreshInterval: 45000 }
  );

  const dayItems = (items ?? []).filter((i) => i.day === day);

  async function handleDelete(item: ItineraryItem) {
    if (!confirm(`確定要刪除「${item.title}」嗎？`)) return;
    await sendJson(`/api/itinerary/${item.id}`, "DELETE");
    await mutate("/api/itinerary");
  }

  return (
    <div className="pb-6">
      <div className="mx-5 mt-4 flex items-center justify-center rounded-2xl bg-paper-soft py-3">
        <Image
          src="/assets/cropped/1.png"
          alt=""
          width={147}
          height={80}
        />
      </div>
      <DayTabs day={day} onChange={setDay} />

      {isLoading ? (
        <p className="px-5 py-10 text-center text-sm text-ink-soft">載入中…</p>
      ) : (
        <ItineraryTimeline
          items={dayItems}
          onEdit={(item) => setEditing(item)}
          onDelete={handleDelete}
        />
      )}

      <div className="px-5">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setEditing("new")}
        >
          <Plus size={16} />
          新增行程
        </Button>
      </div>

      {editing && (
        <ItineraryItemForm
          day={day}
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
