"use client";

import PusherClient from "pusher-js";

export const TRIP_CHANNEL = "trip-ylrd";

let client: PusherClient | null | undefined;

/** Returns null if NEXT_PUBLIC_PUSHER_KEY/CLUSTER aren't set yet. */
export function getPusherClient(): PusherClient | null {
  if (client !== undefined) return client;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  if (!key || !cluster) {
    client = null;
    return client;
  }
  client = new PusherClient(key, { cluster });
  return client;
}
