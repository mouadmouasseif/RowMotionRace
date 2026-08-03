"use client";

import { addDoc, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import type { CompetitionDrawSettings, CompetitionRegistration, HeatDrawEntry } from "@/types/federation";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import { auditLogsCollection, competitionDrawsCollection } from "./livePaths";

const defaultSettings: CompetitionDrawSettings = {
  randomizeAthletes: true,
  randomizeBoats: true,
  randomizeLanes: true,
  randomizeHeats: true,
  keepClubAthletesSeparated: false,
  avoidSameClubInSameHeat: false,
  useSeeding: false,
  usePreviousRanking: false
};

function shuffle<T>(items: T[]) {
  return [...items].map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
}

export function generateHeatDraw({ registrations, maxEntriesPerHeat, category, gender, boatClass, seeded = false }: { registrations: CompetitionRegistration[]; maxEntriesPerHeat: number; category?: string; gender?: string; boatClass?: string; seeded?: boolean }) {
  const eligible = registrations.filter((registration) => registration.status === "CONFIRMED" || registration.status === "SUBMITTED");
  const ordered = seeded ? eligible : shuffle(eligible);
  const heatCount = Math.max(1, Math.ceil(ordered.length / Math.max(1, maxEntriesPerHeat)));
  const entries: HeatDrawEntry[] = [];
  ordered.forEach((registration, index) => {
    const heatNumber = seeded ? (index % heatCount) + 1 : Math.floor(index / maxEntriesPerHeat) + 1;
    entries.push({
      registrationId: registration.id,
      athleteId: registration.athleteId,
      athleteName: registration.athleteName,
      clubId: registration.clubId,
      clubName: registration.clubName,
      heatNumber,
      lane: (entries.filter((entry) => entry.heatNumber === heatNumber).length % maxEntriesPerHeat) + 1
    });
  });
  return { category, gender, boatClass, heatCount, entries };
}

export function detectDrawConflicts(entries: HeatDrawEntry[], maxEntriesPerHeat: number) {
  const conflicts: string[] = [];
  const athletes = new Set<string>();
  const heatLane = new Set<string>();
  entries.forEach((entry) => {
    if (athletes.has(entry.athleteId)) conflicts.push("Athlete registered twice");
    athletes.add(entry.athleteId);
    const key = `${entry.heatNumber}:${entry.lane}`;
    if (heatLane.has(key)) conflicts.push("Lane unavailable");
    heatLane.add(key);
  });
  const heatCounts = new Map<number, number>();
  entries.forEach((entry) => heatCounts.set(entry.heatNumber, (heatCounts.get(entry.heatNumber) ?? 0) + 1));
  heatCounts.forEach((count) => {
    if (count > maxEntriesPerHeat) conflicts.push("Race capacity exceeded");
  });
  return Array.from(new Set(conflicts));
}

export async function createDraftHeatDraw(competitionId: string, eventId: string, entries: HeatDrawEntry[], userId: string, role: string) {
  const draw = {
    competitionId,
    eventId,
    type: "HEAT_DRAW",
    mode: "HEATS",
    strategy: "RANDOM",
    settings: defaultSettings,
    entries,
    versions: [{ version: 1, createdBy: userId, createdAt: serverTimestamp(), entries, status: "DRAFT" }],
    status: "DRAFT",
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(competitionDrawsCollection(competitionId), draw);
  await addDoc(auditLogsCollection(competitionId), { action: "DRAW_GENERATED", userId, role, after: { id: docRef.id, eventId, entries }, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function confirmCompetitionDraw(competitionId: string, drawId: string, userId: string, role: string) {
  await runTransaction(getFirebaseClientDb(), async (transaction) => {
    const ref = doc(competitionDrawsCollection(competitionId), drawId);
    const before = await transaction.get(ref);
    if (!before.exists()) throw new Error("Draw not found");
    if (before.data().status === "LOCKED") throw new Error("Draw already locked");
    transaction.update(ref, { status: "CONFIRMED", updatedAt: serverTimestamp() });
    transaction.set(doc(auditLogsCollection(competitionId)), { action: "DRAW_CONFIRMED", userId, role, before: before.data(), after: { drawId, status: "CONFIRMED" }, createdAt: serverTimestamp() });
  });
}
