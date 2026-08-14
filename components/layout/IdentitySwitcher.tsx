"use client";

import { colorClasses } from "@/lib/colors";
import { useIdentityContext } from "./IdentityProvider";

export function IdentitySwitcher() {
  const { identity, hydrated, openSwitcher } = useIdentityContext();

  if (!hydrated || !identity) {
    return <span className="h-8 w-16 rounded-full bg-white/30" />;
  }

  const c = colorClasses(identity.color);

  return (
    <button
      onClick={openSwitcher}
      className={`tap-scale inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium ${c.ink} shadow-sm`}
    >
      <span className={`h-2 w-2 rounded-full ${c.dot}`} />
      {identity.name}
    </button>
  );
}
