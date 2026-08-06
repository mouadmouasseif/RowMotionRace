import { collection, doc } from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase/client";

export function competitionDoc(competitionId: string) {
  return doc(getFirebaseClientDb(), "competitions", competitionId);
}

export function raceDoc(competitionId: string, raceId: string) {
  return doc(getFirebaseClientDb(), "competitions", competitionId, "races", raceId);
}

export function racesCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races");
}

export function raceEntriesCollection(competitionId: string, raceId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races", raceId, "entries");
}

export function raceBoatsCollection(competitionId: string, raceId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races", raceId, "boats");
}

export function raceLanesCollection(competitionId: string, raceId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races", raceId, "lanes");
}

export function raceDrawsCollection(competitionId: string, raceId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races", raceId, "draws");
}

export function raceCheckpointsCollection(competitionId: string, raceId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races", raceId, "checkpoints");
}

export function raceSplitsCollection(competitionId: string, raceId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races", raceId, "splits");
}

export function raceFinishesCollection(competitionId: string, raceId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races", raceId, "finishes");
}

export function raceTimingEventsCollection(competitionId: string, raceId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races", raceId, "timingEvents");
}

export function raceResultsCollection(competitionId: string, raceId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "races", raceId, "results");
}

export function camerasCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "cameras");
}

export function penaltiesCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "penalties");
}

export function auditLogsCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "auditLogs");
}

export function liveEventsCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "liveEvents");
}

export function categoriesCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "categories");
}

export function judgesCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "judges");
}

export function federationsCollection() {
  return collection(getFirebaseClientDb(), "federations");
}

export function competitionsCollection() {
  return collection(getFirebaseClientDb(), "competitions");
}

export function competitionRegistrationsCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "registrations");
}

export function competitionEventsCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "events");
}

export function competitionDrawsCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "draws");
}

export function competitionStartListsCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "startLists");
}

export function competitionReportsCollection(competitionId: string) {
  return collection(getFirebaseClientDb(), "competitions", competitionId, "reports");
}

export function boatsCollection() {
  return collection(getFirebaseClientDb(), "boats");
}
