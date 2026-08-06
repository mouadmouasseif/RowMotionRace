"use client";

import { serverTimestamp, updateDoc } from "firebase/firestore";
import { raceDoc } from "./livePaths";
import { createLiveEvent } from "./liveEventService";
import { appendTimingJournalEvent } from "./timingJournalService";

export async function markAttention(competitionId: string, raceId: string, userId: string) {
  await updateDoc(raceDoc(competitionId, raceId), { status: "START_SEQUENCE" });
  await appendTimingJournalEvent({ competitionId, raceId, type: "START_ARMED", userId, payload: { status: "START_SEQUENCE" } });
  await createLiveEvent(competitionId, { type: "ATTENTION", raceId, userId });
}

export async function startRaceClock(competitionId: string, raceId: string, userId: string) {
  const clientCapturedAt = Date.now();
  await updateDoc(raceDoc(competitionId, raceId), {
    startedAt: serverTimestamp(),
    startTimestamp: serverTimestamp(),
    startClientCapturedAt: clientCapturedAt,
    timingSource: "TIMING_SERVER",
    status: "RACING",
    resultsStatus: "PROVISIONAL"
  });
  await appendTimingJournalEvent({ competitionId, raceId, type: "START", userId, clientCapturedAt, payload: { timingSource: "TIMING_SERVER" } });
  await createLiveEvent(competitionId, { type: "START", raceId, userId });
}

export async function cancelStart(competitionId: string, raceId: string, userId: string) {
  await updateDoc(raceDoc(competitionId, raceId), { status: "PREPARATION" });
  await appendTimingJournalEvent({ competitionId, raceId, type: "UNDO", userId, payload: { action: "START_CANCELLED" } });
  await createLiveEvent(competitionId, { type: "FALSE_START", raceId, userId, metadata: { action: "START_CANCELLED" } });
}

export async function restartRace(competitionId: string, raceId: string, userId: string) {
  await updateDoc(raceDoc(competitionId, raceId), {
    startedAt: null,
    startTimestamp: null,
    finishedAt: null,
    status: "PREPARATION",
    resultsStatus: "PROVISIONAL"
  });
  await appendTimingJournalEvent({ competitionId, raceId, type: "UNDO", userId, payload: { action: "RACE_RESTARTED" } });
  await createLiveEvent(competitionId, { type: "READY", raceId, userId, metadata: { action: "RACE_RESTARTED" } });
}
