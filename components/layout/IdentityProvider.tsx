"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useIdentity, type Identity } from "@/lib/identity";
import { usePeople } from "@/lib/people";
import { IdentityPickerModal } from "./IdentityPickerModal";

interface IdentityContextValue {
  identity: Identity | null;
  hydrated: boolean;
  openSwitcher: () => void;
}

const IdentityCtx = createContext<IdentityContextValue | null>(null);

export function IdentityProvider({ children }: { children: ReactNode }) {
  const { identity, hydrated, setPerson } = useIdentity();
  const people = usePeople();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const mustPick = hydrated && !identity;
  const showModal = mustPick || switcherOpen;

  return (
    <IdentityCtx.Provider
      value={{ identity, hydrated, openSwitcher: () => setSwitcherOpen(true) }}
    >
      {children}
      {showModal && (
        <IdentityPickerModal
          people={people}
          currentPersonId={identity?.personId ?? null}
          dismissible={!mustPick}
          onDismiss={() => setSwitcherOpen(false)}
          onSelect={(person) => {
            setPerson({
              personId: person.id,
              name: person.name,
              color: person.color,
            });
            setSwitcherOpen(false);
          }}
        />
      )}
    </IdentityCtx.Provider>
  );
}

export function useIdentityContext() {
  const ctx = useContext(IdentityCtx);
  if (!ctx) {
    throw new Error("useIdentityContext must be used within IdentityProvider");
  }
  return ctx;
}
