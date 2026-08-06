"use client";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { raceTimingEventsCollection } from "./livePaths";

export type OfficialTimingJournalType = "START_ARMED" | "START" | "FINISH" | "UNDO" | "CORRECTION" | "VALIDATION";

export interface OfficialTimingJournalInput {
  type: OfficialTimingJournalType;
  raceId: string;
  competitionId: string;
  entryId?: string;
  stationId?: string;
  deviceId?: string;
  userId: string;
  sequence?: number;
  deviceTimestamp?: number;
  clientCapturedAt?: number;
  payload?: Record<string, unknown>;
}

export async function appendTimingJournalEvent(input: OfficialTimingJournalInput) {
  const clientCapturedAt = input.clientCapturedAt ?? Date.now();
  const eventId = [
    input.raceId,
    input.type,
    input.entryId ?? input.stationId ?? "race",
    input.sequence ?? clientCapturedAt
  ].join("-");

  const appwriteResponse = await fetch("/api/timing/journal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, eventId, clientCapturedAt })
  }).catch(() => null);

  if (appwriteResponse?.ok) return eventId;

  await setDoc(doc(raceTimingEventsCollection(input.competitionId, input.raceId), eventId), {
    eventId,
    type: input.type,
    raceId: input.raceId,
    entryId: input.entryId ?? null,
    stationId: input.stationId ?? null,
    deviceId: input.deviceId ?? null,
    userId: input.userId,
    sequence: input.sequence ?? null,
    deviceTimestamp: input.deviceTimestamp ?? null,
    clientCapturedAt,
    serverTimestamp: serverTimestamp(),
    payload: input.payload ?? {},
    appendOnly: true
  });

  return eventId;
}
