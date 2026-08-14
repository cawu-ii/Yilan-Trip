"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 backdrop-blur-[1px] sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-paper p-5 pb-8 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="tap-scale rounded-full p-1.5 text-ink-soft hover:bg-paper-soft"
            aria-label="關閉"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
