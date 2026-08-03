"use client";

import { addDoc, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import type { PenaltyType, RacePenalty } from "@/types/live-race";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import { auditLogsCollection, penaltiesCollection } from "./livePaths";
import { createLiveEvent } from "./liveEventService";

export async function applyPenalty(
  competitionId: string,
  penalty: Omit<RacePenalty, "id" | "createdAt" | "modifiedAt" | "status">,
  role: string
) {
  const docRef = await addDoc(penaltiesCollection(competitionId), {
    ...penalty,
    status: "ACTIVE",
    createdAt: serverTimestamp()
  });
  await addDoc(auditLogsCollection(competitionId), {
    userId: penalty.createdBy,
    role,
    action: "PENALTY_CREATED",
    after: { ...penalty, id: docRef.id },
    createdAt: serverTimestamp()
  });
  await createLiveEvent(competitionId, {
    type: "PENALTY",
    raceId: penalty.raceId,
    athleteId: penalty.athleteId,
    boatId: penalty.boatId,
    userId: penalty.createdBy,
    metadata: { penaltyMs: penalty.penaltyMs, type: penalty.type }
  });
  return docRef.id;
}

export async function modifyPenalty(
  competitionId: string,
  penaltyId: string,
  changes: Partial<Pick<RacePenalty, "type" | "reason" | "comment" | "penaltyMs" | "status">>,
  modifiedBy: string,
  role: string
) {
  const db = getFirebaseClientDb();
  const penaltyRef = doc(penaltiesCollection(competitionId), penaltyId);
  await runTransaction(db, async (transaction) => {
    const current = await transaction.get(penaltyRef);
    if (!current.exists()) throw new Error("Penalty not found");
    const before = current.data();
    transaction.update(penaltyRef, { ...changes, modifiedBy, modifiedAt: serverTimestamp(), status: changes.status ?? "MODIFIED" });
    transaction.set(doc(auditLogsCollection(competitionId)), {
      userId: modifiedBy,
      role,
      action: changes.status === "CANCELLED" ? "PENALTY_CANCELLED" : "PENALTY_MODIFIED",
      before,
      after: changes,
      createdAt: serverTimestamp()
    });
  });
}

export async function cancelPenalty(competitionId: string, penaltyId: string, userId: string, role: string) {
  await modifyPenalty(competitionId, penaltyId, { status: "CANCELLED" }, userId, role);
}

export function penaltyLabel(type: PenaltyType) {
  return type.replaceAll("_", " ");
}
