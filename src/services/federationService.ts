"use client";

import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import type { Competition, CompetitionEvent, CompetitionRegistration, FederationMetrics } from "@/types/federation";
import type { Race, RacePenalty } from "@/types/live-race";
import { auditLogsCollection, competitionEventsCollection, competitionRegistrationsCollection, competitionsCollection, penaltiesCollection, racesCollection } from "./livePaths";

export function subscribeCompetitions(onChange: (competitions: Competition[]) => void, onError?: (error: Error) => void) {
  return onSnapshot(
    query(competitionsCollection(), orderBy("startsAt", "desc"), limit(100)),
    (snapshot) => onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Competition)),
    onError
  );
}

export function subscribeCompetition(competitionId: string, onChange: (competition: Competition | null) => void, onError?: (error: Error) => void) {
  return onSnapshot(doc(getFirebaseClientDb(), "competitions", competitionId), (snapshot) => {
    onChange(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Competition) : null);
  }, onError);
}

export async function createCompetition(input: Omit<Competition, "id" | "createdAt" | "updatedAt">, userId: string, role: string) {
  const docRef = await addDoc(competitionsCollection(), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await addDoc(auditLogsCollection(docRef.id), { action: "COMPETITION_CREATED", userId, role, after: { ...input, id: docRef.id }, createdAt: serverTimestamp() });
  return docRef.id;
}

export function subscribeCompetitionEvents(competitionId: string, onChange: (events: CompetitionEvent[]) => void) {
  return onSnapshot(query(competitionEventsCollection(competitionId), orderBy("name", "asc")), (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as CompetitionEvent));
  });
}

export async function createCompetitionEvent(competitionId: string, input: Omit<CompetitionEvent, "id" | "competitionId" | "createdAt" | "updatedAt">, userId: string, role: string) {
  const docRef = await addDoc(competitionEventsCollection(competitionId), { ...input, competitionId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await addDoc(auditLogsCollection(competitionId), { action: "EVENT_CREATED", userId, role, after: { ...input, id: docRef.id }, createdAt: serverTimestamp() });
  return docRef.id;
}

export function subscribeRegistrations(competitionId: string, onChange: (registrations: CompetitionRegistration[]) => void) {
  return onSnapshot(query(competitionRegistrationsCollection(competitionId), orderBy("createdAt", "desc")), (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as CompetitionRegistration));
  });
}

export async function createRegistration(competitionId: string, input: Omit<CompetitionRegistration, "id" | "competitionId" | "createdAt" | "updatedAt">, userId: string, role: string) {
  const docRef = await addDoc(competitionRegistrationsCollection(competitionId), { ...input, competitionId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await addDoc(auditLogsCollection(competitionId), { action: "REGISTRATION_CREATED", userId, role, after: { ...input, id: docRef.id }, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function updateRegistrationStatus(competitionId: string, registrationId: string, status: CompetitionRegistration["status"], userId: string, role: string) {
  await updateDoc(doc(competitionRegistrationsCollection(competitionId), registrationId), { status, updatedAt: serverTimestamp() });
  await addDoc(auditLogsCollection(competitionId), { action: status === "CONFIRMED" ? "REGISTRATION_APPROVED" : "REGISTRATION_STATUS_CHANGED", userId, role, after: { registrationId, status }, createdAt: serverTimestamp() });
}

export async function loadFederationMetrics(): Promise<FederationMetrics> {
  const competitions = (await getDocs(query(competitionsCollection(), limit(200)))).docs.map((item) => ({ id: item.id, ...item.data() }) as Competition);
  const now = Date.now();
  const activeCompetitions = competitions.filter((item) => item.status === "LIVE" || item.status === "REGISTRATION_OPEN").length;
  const upcomingCompetitions = competitions.filter((item) => item.startsAt?.toMillis && item.startsAt.toMillis() > now).length;
  let liveRaces = 0;
  let racesToday = 0;
  let registeredAthletes = 0;
  const clubIds = new Set<string>();
  let activeJudges = 0;
  let assignedBoats = 0;
  let pendingResults = 0;
  let openPenalties = 0;

  await Promise.all(competitions.slice(0, 40).map(async (competition) => {
    const [registrations, races, penalties, judges] = await Promise.all([
      getDocs(query(competitionRegistrationsCollection(competition.id), limit(500))),
      getDocs(query(racesCollection(competition.id), limit(200))),
      getDocs(query(penaltiesCollection(competition.id), limit(200))),
      getDocs(query(collection(getFirebaseClientDb(), "competitions", competition.id, "judges"), limit(100)))
    ]);
    registeredAthletes += registrations.size;
    registrations.docs.forEach((item) => {
      const data = item.data() as CompetitionRegistration;
      if (data.clubId) clubIds.add(data.clubId);
    });
    races.docs.forEach((item) => {
      const race = item.data() as Race;
      if (race.status === "RACING" || race.status === "FINISHING") liveRaces += 1;
      if (race.resultsStatus === "PROVISIONAL" && (race.status === "FINISHED" || race.status === "FINISHING")) pendingResults += 1;
      if (race.numberOfBoats) assignedBoats += race.numberOfBoats;
      const created = race.createdAt?.toMillis?.();
      if (created && new Date(created).toDateString() === new Date().toDateString()) racesToday += 1;
    });
    penalties.docs.forEach((item) => {
      const penalty = item.data() as RacePenalty;
      if (penalty.status === "ACTIVE" || penalty.status === "MODIFIED") openPenalties += 1;
    });
    activeJudges += judges.size;
  }));

  return { activeCompetitions, upcomingCompetitions, racesToday, liveRaces, registeredAthletes, participatingClubs: clubIds.size, activeJudges, assignedBoats, pendingResults, openPenalties };
}

export async function findLiveRace() {
  const competitions = (await getDocs(query(competitionsCollection(), limit(50)))).docs.map((item) => ({ id: item.id, ...item.data() }) as Competition);
  for (const competition of competitions) {
    const races = await getDocs(query(racesCollection(competition.id), where("status", "in", ["RACING", "FINISHING"]), limit(1)));
    const race = races.docs[0];
    if (race) return { competition, race: { id: race.id, ...race.data() } as Race };
  }
  return null;
}
