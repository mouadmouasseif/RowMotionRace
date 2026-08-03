"use client";

import { addDoc, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import type { CourseType, RaceBoat, RaceCheckpoint, RaceLane } from "@/types/live-race";
import { auditLogsCollection, raceBoatsCollection, raceCheckpointsCollection, raceDoc, raceLanesCollection } from "./livePaths";

export function distanceToMeters(value: number, unit: "m" | "km") {
  return Math.max(0, Math.round(unit === "km" ? value * 1000 : value));
}

export function calculateLapDistance(distanceMeters: number, lapCount: number) {
  return lapCount > 0 ? distanceMeters / lapCount : distanceMeters;
}

export function subscribeRaceBoats(competitionId: string, raceId: string, onChange: (boats: RaceBoat[]) => void) {
  return onSnapshot(query(raceBoatsCollection(competitionId, raceId), orderBy("boatNumber", "asc")), (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as RaceBoat));
  });
}

export function subscribeRaceLanes(competitionId: string, raceId: string, onChange: (lanes: RaceLane[]) => void) {
  return onSnapshot(query(raceLanesCollection(competitionId, raceId), orderBy("number", "asc")), (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as RaceLane));
  });
}

export function subscribeRaceCheckpoints(competitionId: string, raceId: string, onChange: (checkpoints: RaceCheckpoint[]) => void) {
  return onSnapshot(query(raceCheckpointsCollection(competitionId, raceId), orderBy("distanceMeters", "asc")), (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as RaceCheckpoint));
  });
}

export async function saveRaceCourseConfiguration(
  competitionId: string,
  raceId: string,
  config: { distanceMeters: number; courseType: CourseType; lapCount: number; startLabel: string; finishLabel: string },
  userId: string,
  role: string
) {
  await updateDoc(raceDoc(competitionId, raceId), { ...config, updatedAt: serverTimestamp() });
  await addDoc(auditLogsCollection(competitionId), { action: "COURSE_CONFIGURATION_UPDATED", userId, role, raceId, after: config, createdAt: serverTimestamp() });
}

export async function generateBoatPlaces(competitionId: string, raceId: string, numberOfBoats: number, userId: string, role: string) {
  const batch = writeBatch(getFirebaseClientDb());
  batch.update(raceDoc(competitionId, raceId), { numberOfBoats, updatedAt: serverTimestamp() });
  for (let index = 1; index <= numberOfBoats; index += 1) {
    const boatRef = doc(raceBoatsCollection(competitionId, raceId), `boat-${index}`);
    batch.set(boatRef, { competitionId, raceId, boatNumber: index, status: "REGISTERED" }, { merge: true });
  }
  batch.set(doc(auditLogsCollection(competitionId)), { action: "BOAT_PLACES_GENERATED", userId, role, raceId, after: { numberOfBoats }, createdAt: serverTimestamp() });
  await batch.commit();
}

export async function generateLanes(competitionId: string, raceId: string, numberOfLanes: number, userId: string, role: string) {
  const batch = writeBatch(getFirebaseClientDb());
  batch.update(raceDoc(competitionId, raceId), { numberOfLanes, updatedAt: serverTimestamp() });
  for (let index = 1; index <= numberOfLanes; index += 1) {
    batch.set(doc(raceLanesCollection(competitionId, raceId), `lane-${index}`), { number: index, enabled: true }, { merge: true });
  }
  batch.set(doc(auditLogsCollection(competitionId)), { action: "LANES_GENERATED", userId, role, raceId, after: { numberOfLanes }, createdAt: serverTimestamp() });
  await batch.commit();
}

export async function updateBoatAssignment(competitionId: string, raceId: string, boatId: string, changes: Partial<RaceBoat>, userId: string, role: string) {
  await runTransaction(getFirebaseClientDb(), async (transaction) => {
    const ref = doc(raceBoatsCollection(competitionId, raceId), boatId);
    const before = await transaction.get(ref);
    transaction.set(ref, { ...changes, status: changes.status ?? "ASSIGNED" }, { merge: true });
    transaction.set(doc(auditLogsCollection(competitionId)), { action: "DRAW_MODIFIED", userId, role, raceId, before: before.data() ?? null, after: changes, createdAt: serverTimestamp() });
  });
}

export async function setLaneEnabled(competitionId: string, raceId: string, laneId: string, enabled: boolean, userId: string, role: string) {
  await updateDoc(doc(raceLanesCollection(competitionId, raceId), laneId), { enabled });
  await addDoc(auditLogsCollection(competitionId), { action: "DRAW_MODIFIED", userId, role, raceId, after: { laneId, enabled }, createdAt: serverTimestamp() });
}

export async function saveCheckpoints(competitionId: string, raceId: string, checkpoints: RaceCheckpoint[], userId: string, role: string) {
  const batch = writeBatch(getFirebaseClientDb());
  checkpoints.forEach((checkpoint) => batch.set(doc(raceCheckpointsCollection(competitionId, raceId), checkpoint.id), checkpoint));
  batch.set(doc(auditLogsCollection(competitionId)), { action: "CHECKPOINTS_UPDATED", userId, role, raceId, after: checkpoints, createdAt: serverTimestamp() });
  await batch.commit();
}
