export type TimingEventType = "START_ARMED" | "START" | "FINISH" | "FINISH_PRESS" | "PENALTY" | "UNDO" | "CORRECTION" | "VALIDATION" | "DEVICE_OFFLINE";

export interface TimingEventPayload {
  eventId: string;
  competitionId?: string;
  raceId: string;
  deviceId?: string;
  stationId?: string;
  userId?: string;
  type: TimingEventType;
  serverTimestamp: number;
  deviceTimestamp?: number;
  latencyMs?: number;
  sequence?: number;
  payload?: Record<string, unknown>;
}

export function createTimingEvent(input: Omit<TimingEventPayload, "eventId" | "serverTimestamp"> & { serverTimestamp?: number }) {
  return {
    ...input,
    eventId: `${input.raceId}-${input.type}-${input.sequence ?? "manual"}-${input.serverTimestamp ?? Date.now()}`,
    serverTimestamp: input.serverTimestamp ?? Date.now()
  };
}

export function isDuplicateTimingEvent(previous: TimingEventPayload | undefined, next: Pick<TimingEventPayload, "stationId" | "raceId" | "type" | "sequence" | "serverTimestamp">, debounceMs = 350) {
  if (!previous) return false;
  if (previous.sequence != null && next.sequence != null && previous.stationId === next.stationId && previous.sequence === next.sequence) return true;
  return previous.stationId === next.stationId && previous.raceId === next.raceId && previous.type === next.type && next.serverTimestamp - previous.serverTimestamp < debounceMs;
}
