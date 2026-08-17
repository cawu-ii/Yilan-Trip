"use client";

import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { getPusherClient, TRIP_CHANNEL } from "@/lib/pusher-client";

/**
 * Mounted once in the root layout. Subscribes to the shared Pusher channel
 * and, on any change event, tells SWR to refetch the relevant endpoint.
 * If Pusher isn't configured (no env vars yet), this silently no-ops and
 * each page's own SWR refreshInterval keeps things eventually-fresh.
 */
export function RealtimeListener() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    const client = getPusherClient();
    if (!client) return;

    const channel = client.subscribe(TRIP_CHANNEL);
    const onItinerary = () => mutate("/api/itinerary");
    const onExpense = () => {
      mutate("/api/expenses");
      mutate("/api/expenses/summary");
    };
    const onSettlement = () => mutate("/api/settlements");
    const onFood = () => mutate("/api/food");

    channel.bind("itinerary-update", onItinerary);
    channel.bind("expense-update", onExpense);
    channel.bind("settlement-update", onSettlement);
    channel.bind("food-update", onFood);

    return () => {
      channel.unbind("itinerary-update", onItinerary);
      channel.unbind("expense-update", onExpense);
      channel.unbind("settlement-update", onSettlement);
      channel.unbind("food-update", onFood);
      client.unsubscribe(TRIP_CHANNEL);
    };
  }, [mutate]);

  return null;
}
