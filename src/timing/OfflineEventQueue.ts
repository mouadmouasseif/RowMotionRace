import type { TimingEventPayload } from "./TimingEvents";

const queueKey = "rowmotion.offlineTimingEvents";

export function readOfflineTimingEvents(storage: Storage = window.localStorage): TimingEventPayload[] {
  try {
    const raw = storage.getItem(queueKey);
    return raw ? (JSON.parse(raw) as TimingEventPayload[]) : [];
  } catch {
    return [];
  }
}

export function queueOfflineTimingEvent(event: TimingEventPayload, storage: Storage = window.localStorage) {
  const events = readOfflineTimingEvents(storage);
  storage.setItem(queueKey, JSON.stringify([...events, event]));
}

export function clearOfflineTimingEvents(storage: Storage = window.localStorage) {
  storage.removeItem(queueKey);
}
