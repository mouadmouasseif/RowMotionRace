"use client";

import { doc, getDocs, runTransaction, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import type { RaceFinish } from "@/types/live-race";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import { raceDoc, raceEntriesCollection, raceFinishesCollection } from "./livePaths";
import { createLiveEvent } from "./liveEventService";

export async function registerFinish(competitionId: string, raceId: string, entryId: string, userId: string) {
  const db = getFirebaseClientDb();
  const raceRef = raceDoc(competitionId, raceId);
  const entryRef = doc(raceEntriesCollection(competitionId, raceId), entryId);
  const finishRef = doc(raceFinishesCollection(competitionId, raceId), entryId);

  const finish = await runTransaction(db, async (transaction) => {
    const [raceSnapshot, entrySnapshot, finishSnapshot, existingFinishes] = await Promise.all([
      transaction.get(raceRef),
      transaction.get(entryRef),
      transaction.get(finishRef),
      getDocs(raceFinishesCollection(competitionId, raceId))
    ]);
    if (!raceSnapshot.exists()) throw new Error("Race not configured");
    if (!entrySnapshot.exists()) throw new Error("Entry not configured");
    if (finishSnapshot.exists()) throw new Error("Finish already registered");

    const race = raceSnapshot.data();
    const startTimestamp = race.startTimestamp as Timestamp | undefined;
    if (!startTimestamp) throw new Error("Start timestamp not available");

    const finishTimestamp = Timestamp.now();
    const finishTimeMs = finishTimestamp.toMillis() - startTimestamp.toMillis();
    const rank = existingFinishes.size + 1;
    const entry = entrySnapshot.data();
    const nextFinish: Omit<RaceFinish, "id"> = {
      athleteId: String(entry.athleteId ?? ""),
      boatId: String(entry.boatId ?? ""),
      lane: Number(entry.lane ?? 0),
      finishTimestamp,
      finishedAt: finishTimestamp,
      finishTimeMs,
      officialTime: finishTimeMs,
      rank,
      status: "FINISHED",
      manualValidatedAt: finishTimestamp
    };

    transaction.set(finishRef, nextFinish);
    transaction.update(entryRef, { status: "FINISHED" });
    transaction.update(raceRef, { status: "FINISHING" });
    return { id: finishRef.id, ...nextFinish };
  });

  await createLiveEvent(competitionId, {
    type: "FINISH",
    raceId,
    athleteId: finish.athleteId,
    boatId: finish.boatId,
    userId,
    metadata: { lane: finish.lane, rank: finish.rank, finishTimeMs: finish.finishTimeMs }
  });
  return finish;
}

export async function completeRace(competitionId: string, raceId: string) {
  await updateDoc(raceDoc(competitionId, raceId), { status: "FINISHED", finishedAt: serverTimestamp() });
}
