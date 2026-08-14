import Image from "next/image";
import type { ReactNode } from "react";

export function PhoneCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh justify-center overflow-hidden sm:h-auto sm:items-center sm:py-8">
      <div className="relative flex h-dvh w-full max-w-md flex-col overflow-hidden bg-paper sm:h-[844px] sm:rounded-[2.5rem] sm:shadow-2xl sm:ring-8 sm:ring-white">
        <Image
          src="/assets/cropped/5.png"
          alt=""
          aria-hidden
          width={230}
          height={251}
          className="pointer-events-none absolute -right-10 bottom-16 -z-10 opacity-[0.06]"
        />
        {children}
      </div>
    </div>
  );
}
