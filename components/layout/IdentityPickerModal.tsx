"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { colorClasses } from "@/lib/colors";
import type { Person } from "@/types";

export function IdentityPickerModal({
  people,
  currentPersonId,
  dismissible,
  onDismiss,
  onSelect,
}: {
  people: Person[];
  currentPersonId: number | null;
  dismissible: boolean;
  onDismiss: () => void;
  onSelect: (person: Person) => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-6 backdrop-blur-[2px]">
      <div className="relative w-full max-w-sm rounded-3xl bg-paper p-6 shadow-xl">
        {dismissible && (
          <button
            onClick={onDismiss}
            aria-label="關閉"
            className="tap-scale absolute right-4 top-4 rounded-full p-1.5 text-ink-soft hover:bg-paper-soft"
          >
            <X size={20} />
          </button>
        )}
        <Image
          src="/assets/cropped/11 (1).png"
          alt=""
          width={148}
          height={71}
          className="-ml-1"
        />
        <p className="mb-1 mt-2 text-xs font-medium tracking-wide text-ink-soft">
          宜蘭羅東小旅行
        </p>
        <h2 className="mb-5 font-display text-xl font-bold text-ink">
          你是誰？
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {people.map((person) => {
            const c = colorClasses(person.color);
            const active = person.id === currentPersonId;
            return (
              <button
                key={person.id}
                onClick={() => onSelect(person)}
                className={`tap-scale flex flex-col items-center gap-2 rounded-2xl border-2 py-5 ${c.soft} ${
                  active ? c.border : "border-transparent"
                }`}
              >
                <span
                  className={`h-9 w-9 rounded-full ${c.dot} flex items-center justify-center text-sm font-bold text-white`}
                >
                  {person.name.slice(0, 1)}
                </span>
                <span className={`font-display text-base font-bold ${c.ink}`}>
                  {person.name}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-center text-xs text-ink-soft">
          選好之後會記在這個裝置上，之後可以隨時在右上角切換
        </p>
      </div>
    </div>
  );
}
