"use client";

import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { Person } from "@/types";

// Matches db/seed.sql exactly — used as instant fallback data so the UI
// never has to wait on a network round-trip just to know the 4 names.
export const FALLBACK_PEOPLE: Person[] = [
  { id: 1, name: "文文", color: "wenwen" },
  { id: 2, name: "亞軒", color: "yaxuan" },
  { id: 3, name: "莊家", color: "zhuangjia" },
  { id: 4, name: "CA", color: "qiao" },
];

export function usePeople(): Person[] {
  const { data } = useSWR<Person[]>("/api/people", fetcher, {
    fallbackData: FALLBACK_PEOPLE,
    revalidateOnFocus: false,
  });
  return data ?? FALLBACK_PEOPLE;
}

export function personById(people: Person[], id: number): Person | undefined {
  return people.find((p) => p.id === id);
}
