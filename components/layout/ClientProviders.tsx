"use client";

import type { ReactNode } from "react";
import { IdentityProvider } from "./IdentityProvider";
import { RealtimeListener } from "./RealtimeListener";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <IdentityProvider>
      <RealtimeListener />
      {children}
    </IdentityProvider>
  );
}
