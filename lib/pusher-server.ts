import Pusher from "pusher";

export const TRIP_CHANNEL = "trip-ylrd";

export type BroadcastEvent =
  | "itinerary-update"
  | "expense-update"
  | "food-update";

let pusherClient: Pusher | null | undefined;

function getPusher(): Pusher | null {
  if (pusherClient !== undefined) return pusherClient;
  const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } =
    process.env;
  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
    // Pusher not configured yet — clients still work via the SWR polling
    // fallback, they just won't get near-instant push updates.
    pusherClient = null;
    return pusherClient;
  }
  pusherClient = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });
  return pusherClient;
}

/**
 * Fire-and-forget change notification. Payload intentionally tiny — clients
 * treat this as "go refetch", never as the actual data.
 */
export async function broadcast(event: BroadcastEvent, action: string) {
  const client = getPusher();
  if (!client) return;
  try {
    await client.trigger(TRIP_CHANNEL, event, { action, at: Date.now() });
  } catch (err) {
    console.error("[pusher] broadcast failed:", err);
  }
}
