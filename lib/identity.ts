"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface Identity {
  personId: number;
  name: string;
  color: string;
}

const KEY = "ylrd-trip-identity-v1";
const CHANGE_EVENT = "ylrd-identity-change";

function parseIdentity(raw: string | null): Identity | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.personId === "number" &&
      typeof parsed?.name === "string" &&
      typeof parsed?.color === "string"
    ) {
      return parsed as Identity;
    }
    return null;
  } catch {
    return null;
  }
}

export function readIdentity(): Identity | null {
  if (typeof window === "undefined") return null;
  return parseIdentity(window.localStorage.getItem(KEY));
}

export function writeIdentity(identity: Identity) {
  window.localStorage.setItem(KEY, JSON.stringify(identity));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Cache the last-seen raw string -> parsed object so getSnapshot() returns a
// referentially stable value when nothing changed (required by
// useSyncExternalStore to avoid re-render loops).
let cachedRaw: string | null = null;
let cachedIdentity: Identity | null = null;

function getSnapshot(): Identity | null {
  const raw = window.localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedIdentity;
  cachedRaw = raw;
  cachedIdentity = parseIdentity(raw);
  return cachedIdentity;
}

function getServerSnapshot(): Identity | null {
  return null;
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/**
 * `hydrated` is true once we've reconciled with the real client-side
 * localStorage value (useSyncExternalStore renders `getServerSnapshot`
 * during SSR/first paint, then swaps to the real snapshot right after —
 * consumers use `hydrated` to avoid flashing UI before that swap happens).
 */
export function useIdentity() {
  const identity = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const setPerson = useCallback((next: Identity) => {
    writeIdentity(next);
  }, []);

  return { identity, hydrated, setPerson };
}
