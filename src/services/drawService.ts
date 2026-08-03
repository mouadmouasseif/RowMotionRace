"use client";

import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import type { DrawMode, RaceBoat, RaceDrawEntry, RaceLane } from "@/types/live-race";
import { auditLogsCollection, raceBoatsCollection, raceDoc, raceDrawsCollection, raceEntriesCollection, raceLanesCollection } from "./livePaths";

function shuffle<T>(items: T[]) {
  return [...items].map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
}

export function generateRaceDraw({ boats, availableLanes, mode }: { boats: RaceBoat[]; availableLanes: RaceLane[]; mode: DrawMode }) {
  const shuffledBoats = shuffle(boats.filter((boat) => boat.status !== "DNS"));
  const shuffledLanes = shuffle(availableLanes.filter((lane) => lane.enabled));
  return shuffledBoats.map((boat, index) => ({
    boatId: boat.id,
    athleteId: boat.athleteId,
    boatNumber: mode === "LANES" ? boat.boatNumber : shuffledBoats[index]?.boatNumber,
    lane: mode === "BOATS" ? boat.lane : shuffledLanes[index]?.number,
    drawPosition: index + 1
  })) satisfies RaceDrawEntry[];
}

export async function confirmRaceDraw(
  competitionId: string,
  raceId: string,
  mode: DrawMode,
  entries: RaceDrawEntry[],
  userId: string,
  role: string
) {
  const db = getFirebaseClientDb();
  const drawRef = doc(raceDrawsCollection(competitionId, raceId));
  await runTransaction(db, async (transaction) => {
    const raceRef = raceDoc(competitionId, raceId);
    const raceSnapshot = await transaction.get(raceRef);
    const raceData = raceSnapshot.data();
    if (raceData?.drawStatus === "LOCKED") throw new Error("Draw is locked");

    entries.forEach((entry) => {
      const boatRef = doc(raceBoatsCollection(competitionId, raceId), entry.boatId);
      transaction.set(boatRef, { drawPosition: entry.drawPosition, lane: entry.lane, boatNumber: entry.boatNumber, status: "READY" }, { merge: true });
      transaction.set(doc(raceEntriesCollection(competitionId, raceId), entry.boatId), { boatId: entry.boatId, boatNumber: String(entry.boatNumber ?? ""), lane: entry.lane ?? 0, status: "PRESENT" }, { merge: true });
      if (entry.lane) transaction.set(doc(raceLanesCollection(competitionId, raceId), `lane-${entry.lane}`), { boatId: entry.boatId, athleteId: entry.athleteId }, { merge: true });
    });

    const type = mode === "BOATS" ? "BOAT_DRAW" : mode === "LANES" ? "LANE_DRAW" : "FULL_DRAW";
    const draw = { raceId, type, mode, entries, createdBy: userId, createdAt: serverTimestamp(), status: "CONFIRMED" };
    transaction.set(drawRef, draw);
    transaction.update(raceRef, { drawStatus: "CONFIRMED", updatedAt: serverTimestamp() });
    transaction.set(doc(auditLogsCollection(competitionId)), { action: `${type}_CONFIRMED`, userId, role, raceId, after: draw, createdAt: serverTimestamp() });
  });
}

export async function lockDraw(competitionId: string, raceId: string, userId: string, role: string) {
  await runTransaction(getFirebaseClientDb(), async (transaction) => {
    const raceRef = raceDoc(competitionId, raceId);
    const before = await transaction.get(raceRef);
    transaction.update(raceRef, { drawStatus: "LOCKED", updatedAt: serverTimestamp() });
    transaction.set(doc(auditLogsCollection(competitionId)), { action: "DRAW_LOCKED", userId, role, raceId, before: before.data() ?? null, after: { drawStatus: "LOCKED" }, createdAt: serverTimestamp() });
  });
}
