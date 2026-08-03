"use client";

import { addDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import type { Race, RaceStatus } from "@/types/live-race";
import { raceDoc, racesCollection } from "./livePaths";
import { createLiveEvent } from "./liveEventService";

export function subscribeRaces(competitionId: string, onChange: (races: Race[]) => void, onError?: (error: Error) => void) {
  return onSnapshot(
    query(racesCollection(competitionId), orderBy("raceNumber", "asc")),
    (snapshot) => onChange(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Race)),
    onError
  );
}

export function subscribeRace(
  competitionId: string,
  raceId: string,
  onChange: (race: Race | null) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    raceDoc(competitionId, raceId),
    (snapshot) => onChange(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Race) : null),
    onError
  );
}

export async function setRaceStatus(competitionId: string, raceId: string, status: RaceStatus, userId: string) {
  await updateDoc(raceDoc(competitionId, raceId), { status });
  if (status === "READY") await createLiveEvent(competitionId, { type: "READY", raceId, userId });
}

export function createRace(competitionId: string, race: Omit<Race, "id" | "competitionId" | "createdAt">) {
  return addDoc(racesCollection(competitionId), {
    ...race,
    competitionId,
    distanceMeters: race.distanceMeters ?? race.distance ?? 2000,
    courseType: race.courseType ?? "STRAIGHT",
    lapCount: race.lapCount ?? 1,
    numberOfBoats: race.numberOfBoats ?? 0,
    numberOfLanes: race.numberOfLanes ?? 0,
    drawStatus: race.drawStatus ?? "NOT_STARTED",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    resultsStatus: race.resultsStatus ?? "PROVISIONAL"
  });
}
