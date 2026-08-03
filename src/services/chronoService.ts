"use client";

import { serverTimestamp, updateDoc } from "firebase/firestore";
import { raceDoc } from "./livePaths";
import { createLiveEvent } from "./liveEventService";

export async function markAttention(competitionId: string, raceId: string, userId: string) {
  await updateDoc(raceDoc(competitionId, raceId), { status: "START_SEQUENCE" });
  await createLiveEvent(competitionId, { type: "ATTENTION", raceId, userId });
}

export async function startRaceClock(competitionId: string, raceId: string, userId: string) {
  await updateDoc(raceDoc(competitionId, raceId), {
    startedAt: serverTimestamp(),
    startTimestamp: serverTimestamp(),
    status: "RACING",
    resultsStatus: "PROVISIONAL"
  });
  await createLiveEvent(competitionId, { type: "START", raceId, userId });
}

export async function cancelStart(competitionId: string, raceId: string, userId: string) {
  await updateDoc(raceDoc(competitionId, raceId), { status: "PREPARATION" });
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
  await createLiveEvent(competitionId, { type: "READY", raceId, userId, metadata: { action: "RACE_RESTARTED" } });
}
