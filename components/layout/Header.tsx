import Image from "next/image";
import { IdentitySwitcher } from "./IdentitySwitcher";

export function Header() {
  return (
    <header className="relative overflow-hidden bg-ink px-5 pb-6 pt-5 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
      />
      <Image
        src="/assets/cropped/4.png"
        alt=""
        aria-hidden
        width={68}
        height={59}
        className="pointer-events-none absolute -bottom-2 right-4 opacity-90 brightness-0 invert"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-white/80">
            <Image
              src="/assets/cropped/11 (1).png"
              alt=""
              aria-hidden
              width={46}
              height={22}
              className="shrink-0"
            />
            2026.08.15 — 2026.08.16 ・ 4 人小旅行
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold">
            宜蘭羅東小旅行
          </h1>
        </div>
        <IdentitySwitcher />
      </div>
    </header>
  );
}
