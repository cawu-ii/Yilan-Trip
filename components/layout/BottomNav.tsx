"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, UtensilsCrossed, Wallet } from "lucide-react";

const TABS = [
  { href: "/itinerary", label: "行程", icon: CalendarDays },
  { href: "/expenses", label: "記帳", icon: Wallet },
  { href: "/food", label: "美食", icon: UtensilsCrossed },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-40 flex items-stretch justify-around border-t border-paper-line bg-paper/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`tap-scale flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-xs font-medium ${
              active ? "text-accent-dark" : "text-ink-soft"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
