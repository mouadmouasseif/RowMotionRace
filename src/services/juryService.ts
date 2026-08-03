"use client";

import { addDoc, doc, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import type { JudgeRole } from "@/types/live-race";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import { auditLogsCollection, judgesCollection, raceDoc } from "./livePaths";
import { createLiveEvent } from "./liveEventService";

export function assignJudge(competitionId: string, userId: string, role: JudgeRole, assignedBy: string) {
  return addDoc(judgesCollection(competitionId), {
    userId,
    role,
    enabled: true,
    assignedBy,
    assignedAt: serverTimestamp()
  });
}

export async function validateResults(competitionId: string, raceId: string, userId: string, role: string) {
  const db = getFirebaseClientDb();
  await runTransaction(db, async (transaction) => {
    transaction.update(raceDoc(competitionId, raceId), {
      status: "VALIDATED",
      resultsStatus: "OFFICIAL",
      validatedAt: serverTimestamp(),
      validatedBy: userId
    });
    transaction.set(doc(auditLogsCollection(competitionId)), {
      userId,
      role,
      action: "RESULTS_VALIDATED",
      after: { raceId, status: "VALIDATED", resultsStatus: "OFFICIAL" },
      createdAt: serverTimestamp()
    });
  });
  await createLiveEvent(competitionId, { type: "VALIDATED", raceId, userId });
}

export function updateRaceResultStatus(competitionId: string, raceId: string, userId: string, resultsStatus: "PROVISIONAL" | "OFFICIAL") {
  return updateDoc(raceDoc(competitionId, raceId), { resultsStatus, updatedBy: userId, updatedAt: serverTimestamp() });
}
