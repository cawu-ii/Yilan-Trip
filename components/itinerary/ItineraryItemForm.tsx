"use client";

import { useState, type FormEvent } from "react";
import { useSWRConfig } from "swr";
import { Sheet } from "@/components/ui/Sheet";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useIdentityContext } from "@/components/layout/IdentityProvider";
import { sendJson } from "@/lib/fetcher";
import type { Day, ItineraryItem } from "@/types";

export function ItineraryItemForm({
  day,
  item,
  onClose,
}: {
  day: Day;
  item?: ItineraryItem | null;
  onClose: () => void;
}) {
  const { identity } = useIdentityContext();
  const { mutate } = useSWRConfig();
  const [time, setTime] = useState(item?.time ?? "");
  const [title, setTitle] = useState(item?.title ?? "");
  const [location, setLocation] = useState(item?.location ?? "");
  const [mapUrl, setMapUrl] = useState(item?.mapUrl ?? "");
  const [note, setNote] = useState(item?.note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(item);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!identity) return;
    if (!title.trim()) {
      setError("請輸入標題");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        day,
        time: time.trim() || null,
        title: title.trim(),
        location: location.trim() || null,
        mapUrl: mapUrl.trim() || null,
        note: note.trim() || null,
        personId: identity.personId,
      };
      if (item) {
        await sendJson(`/api/itinerary/${item.id}`, "PATCH", payload);
      } else {
        await sendJson("/api/itinerary", "POST", payload);
      }
      await mutate("/api/itinerary");
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
      await sendJson(`/api/itinerary/${item.id}`, "DELETE");
      await mutate("/api/itinerary");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除失敗");
      setSaving(false);
    }
  }

  return (
    <Sheet title={isEdit ? "編輯行程" : "新增行程"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Field label="時間（選填）" hint="例如 11:00">
          <input
            className={inputClass}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="11:00"
          />
        </Field>
        <Field label="標題">
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：午餐"
            required
          />
        </Field>
        <Field label="地點（選填）">
          <input
            className={inputClass}
            value={location ?? ""}
            onChange={(e) => setLocation(e.target.value)}
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
        <Field label="備註（選填）">
          <textarea
            className={inputClass}
            rows={2}
            value={note ?? ""}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        <div className="mt-4 flex gap-2">
          {isEdit && (
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
