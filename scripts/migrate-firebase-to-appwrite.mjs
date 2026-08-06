import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const root = process.cwd();
loadEnv(path.join(root, ".env.local"));
loadEnv(path.join(root, ".env"));

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "rowmotion-race";
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) fail("Missing Appwrite endpoint, project id or API key.");
if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  fail("Missing Firebase Admin credentials.");
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

const firestore = getFirestore();
const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey
};

let written = 0;
const competitions = await firestore.collection("competitions").get();

for (const competitionDoc of competitions.docs) {
  const competition = competitionDoc.data();
  await upsert("competitions", competitionDoc.id, clean({
    name: competition.name,
    discipline: competition.discipline ?? competition.type ?? "ROWING",
    venue: competition.venue ?? competition.location,
    status: competition.status ?? "DRAFT",
    distance: numberOrNull(competition.distance),
    numberOfLanes: numberOrNull(competition.numberOfLanes),
    publicCode: competition.publicCode ?? competition.competitionCode,
    liveEnabled: Boolean(competition.liveEnabled)
  }));

  const races = await competitionDoc.ref.collection("races").get();
  for (const raceDoc of races.docs) {
    const race = raceDoc.data();
    await upsert("races", raceDoc.id, clean({
      competitionId: competitionDoc.id,
      raceNumber: numberOrNull(race.raceNumber) ?? 0,
      category: race.categoryName ?? race.category,
      raceType: race.raceType ?? "LANE_RACE",
      distanceMeters: numberOrNull(race.distanceMeters ?? race.distance) ?? 0,
      numberOfLanes: numberOrNull(race.numberOfLanes),
      status: race.status ?? "DRAFT",
      resultsStatus: race.resultsStatus,
      startTimestamp: timestampMs(race.startTimestamp ?? race.startedAt),
      finishTimestamp: timestampMs(race.finishTimestamp ?? race.finishedAt)
    }));

    await migrateSubcollection(raceDoc.ref, "entries", "raceEntries", (entry, id) => clean({
      competitionId: competitionDoc.id,
      raceId: raceDoc.id,
      athleteId: entry.athleteId,
      boatId: entry.boatId,
      lane: numberOrNull(entry.lane),
      status: entry.status ?? "WAITING",
      sourceEntryId: id
    }));

    await migrateSubcollection(raceDoc.ref, "finishes", "finishes", (finish, id) => clean({
      competitionId: competitionDoc.id,
      raceId: raceDoc.id,
      entryId: id,
      athleteId: finish.athleteId,
      boatId: finish.boatId,
      lane: numberOrNull(finish.lane),
      finishTimeMs: numberOrNull(finish.finishTimeMs) ?? 0,
      officialTime: numberOrNull(finish.officialTime) ?? numberOrNull(finish.finishTimeMs) ?? 0,
      rank: numberOrNull(finish.rank),
      reviewStatus: finish.reviewStatus ?? "RECORDED",
      timingSource: finish.timingSource ?? "MIGRATED_FIREBASE"
    }));

    await migrateSubcollection(raceDoc.ref, "timingEvents", "timingEvents", (event, id) => clean({
      eventId: event.eventId ?? id,
      competitionId: competitionDoc.id,
      raceId: raceDoc.id,
      entryId: event.entryId,
      stationId: event.stationId,
      deviceId: event.deviceId,
      userId: event.userId ?? "migration",
      type: event.type ?? "CORRECTION",
      sequence: numberOrNull(event.sequence),
      deviceTimestamp: numberOrNull(event.deviceTimestamp),
      clientCapturedAt: numberOrNull(event.clientCapturedAt) ?? Date.now(),
      serverTimestamp: timestampMs(event.serverTimestamp) ?? Date.now(),
      payload: typeof event.payload === "string" ? event.payload : JSON.stringify(event.payload ?? {}),
      appendOnly: true
    }));
  }

  const penalties = await competitionDoc.ref.collection("penalties").get();
  for (const penaltyDoc of penalties.docs) {
    const penalty = penaltyDoc.data();
    await upsert("penalties", penaltyDoc.id, clean({
      raceId: penalty.raceId,
      athleteId: penalty.athleteId,
      boatId: penalty.boatId,
      type: penalty.type ?? "OTHER",
      value: numberOrNull(penalty.value ?? penalty.penaltyMs),
      unit: penalty.unit ?? "ms",
      reason: penalty.reason,
      juryId: penalty.juryId ?? penalty.createdBy,
      timestamp: timestampMs(penalty.timestamp ?? penalty.createdAt) ?? Date.now(),
      status: penalty.status ?? "ACTIVE"
    }));
  }
}

console.log(`Firebase to Appwrite migration complete. Documents written or updated: ${written}`);

async function migrateSubcollection(parentRef, sourceName, targetName, mapper) {
  const snapshot = await parentRef.collection(sourceName).get();
  for (const item of snapshot.docs) await upsert(targetName, item.id, mapper(item.data(), item.id));
}

async function upsert(collectionId, sourceId, data) {
  const documentId = safeId(sourceId);
  const path = `/databases/${databaseId}/collections/${collectionId}/documents/${documentId}`;
  const exists = await request(path, { method: "GET" }).then(() => true).catch((error) => {
    if (error.status === 404) return false;
    throw error;
  });

  if (exists) await request(path, { method: "PATCH", body: { data } });
  else await request(`/databases/${databaseId}/collections/${collectionId}/documents`, { method: "POST", body: { documentId, data } });
  written += 1;
}

async function request(pathname, options = {}) {
  const response = await fetch(`${endpoint}${pathname}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(data.message || `Appwrite ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function clean(data) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function timestampMs(value) {
  if (!value) return null;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value === "number") return value;
  return null;
}

function safeId(id) {
  return String(id).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 36);
}

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
