"use client";

export type LiveSyncEventType = "pricing" | "computers" | "reservations" | "notifications" | "gallery";

interface LiveSyncMessage {
  type: LiveSyncEventType;
  data: any;
  timestamp: number;
}

let broadcastChannel: BroadcastChannel | null = null;

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!broadcastChannel && "BroadcastChannel" in window) {
    try {
      broadcastChannel = new BroadcastChannel("forza_live_sync");
    } catch {
      broadcastChannel = null;
    }
  }
  return broadcastChannel;
}

/**
 * Emit an instant update across all browser tabs, windows, and local listeners (< 5ms latency)
 */
export function emitLiveUpdate(type: LiveSyncEventType, data: any) {
  if (typeof window === "undefined") return;

  // 1. Post to BroadcastChannel (inter-tab)
  const channel = getBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage({ type, data, timestamp: Date.now() });
    } catch {}
  }

  // 2. Dispatch in-window CustomEvent
  const eventMap: Record<LiveSyncEventType, string> = {
    pricing: "forzaFiyatlarGuncellendi",
    computers: "forzaPcDurumGuncellendi",
    reservations: "forzaRezervasyonGuncellendi",
    notifications: "forzaBildirimGuncellendi",
    gallery: "forzaGaleriGuncellendi",
  };

  try {
    window.dispatchEvent(new CustomEvent(eventMap[type], { detail: data }));
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

/**
 * Subscribe to instant live updates for a specific event type
 */
export function subscribeLiveUpdate(type: LiveSyncEventType, callback: (data: any) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const channel = getBroadcastChannel();
  const eventMap: Record<LiveSyncEventType, string> = {
    pricing: "forzaFiyatlarGuncellendi",
    computers: "forzaPcDurumGuncellendi",
    reservations: "forzaRezervasyonGuncellendi",
    notifications: "forzaBildirimGuncellendi",
    gallery: "forzaGaleriGuncellendi",
  };

  const handleChannelMessage = (event: MessageEvent<LiveSyncMessage>) => {
    if (event && event.data && event.data.type === type) {
      callback(event.data.data);
    }
  };

  const handleCustomEvent = (event: any) => {
    if (event && event.detail !== undefined) {
      callback(event.detail);
    } else {
      callback(null);
    }
  };

  if (channel) {
    channel.addEventListener("message", handleChannelMessage);
  }
  window.addEventListener(eventMap[type], handleCustomEvent);

  return () => {
    if (channel) {
      channel.removeEventListener("message", handleChannelMessage);
    }
    window.removeEventListener(eventMap[type], handleCustomEvent);
  };
}
