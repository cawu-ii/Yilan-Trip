import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-xl border border-paper-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-medium text-ink-soft">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
