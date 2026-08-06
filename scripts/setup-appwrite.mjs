import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
loadEnv(path.join(root, ".env.local"));
loadEnv(path.join(root, ".env"));

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "rowmotion-race";
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  console.error("Missing NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID or APPWRITE_API_KEY.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey
};

const collections = [
  collection("competitions", [
    string("name", 160, true),
    string("discipline", 40, true),
    string("venue", 160, false),
    string("status", 40, true),
    integer("distance", false),
    integer("numberOfLanes", false),
    string("publicCode", 64, false),
    bool("liveEnabled", false)
  ]),
  collection("races", [
    string("competitionId", 64, true),
    integer("raceNumber", true),
    string("category", 80, false),
    string("raceType", 60, true),
    integer("distanceMeters", true),
    integer("numberOfLanes", false),
    string("status", 40, true),
    string("resultsStatus", 40, false),
    integer("startTimestamp", false),
    integer("finishTimestamp", false)
  ]),
  collection("raceEntries", [
    string("competitionId", 64, true),
    string("raceId", 64, true),
    string("athleteId", 64, false),
    string("boatId", 64, false),
    integer("lane", false),
    string("status", 40, true)
  ]),
  collection("timingEvents", [
    string("eventId", 255, true),
    string("competitionId", 64, true),
    string("raceId", 64, true),
    string("entryId", 64, false),
    string("stationId", 80, false),
    string("deviceId", 80, false),
    string("userId", 80, true),
    string("type", 40, true),
    integer("sequence", false),
    integer("deviceTimestamp", false),
    integer("clientCapturedAt", true),
    integer("serverTimestamp", true),
    string("payload", 4000, false),
    bool("appendOnly", true)
  ]),
  collection("finishes", [
    string("competitionId", 64, true),
    string("raceId", 64, true),
    string("entryId", 64, true),
    string("athleteId", 64, false),
    string("boatId", 64, false),
    integer("lane", false),
    integer("finishTimeMs", true),
    integer("officialTime", true),
    integer("rank", false),
    string("reviewStatus", 40, true),
    string("timingSource", 40, true)
  ]),
  collection("penalties", [
    string("raceId", 64, true),
    string("athleteId", 64, false),
    string("boatId", 64, false),
    string("type", 60, true),
    integer("value", false),
    string("unit", 20, false),
    string("reason", 1000, false),
    string("juryId", 80, false),
    integer("timestamp", true),
    string("status", 40, true)
  ]),
  collection("timingDevices", [
    string("name", 120, true),
    string("stationType", 40, true),
    string("ip", 64, false),
    string("mac", 64, false),
    string("firmware", 64, false),
    integer("battery", false),
    integer("signal", false),
    integer("latency", false),
    integer("lastSeen", false),
    string("status", 40, true)
  ])
];

await ensureDatabase();
for (const item of collections) {
  await ensureCollection(item);
  for (const attribute of item.attributes) await ensureAttribute(item.id, attribute);
}

console.log(`Appwrite setup complete for database ${databaseId}.`);

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function collection(id, attributes) {
  return { id, attributes };
}

function string(key, size, required) {
  return { type: "string", key, size, required };
}

function integer(key, required) {
  return { type: "integer", key, required };
}

function bool(key, required) {
  return { type: "boolean", key, required };
}

async function ensureDatabase() {
  await request(`/databases/${databaseId}`, { method: "GET" }).catch(async (error) => {
    if (error.status !== 404) throw error;
    await request("/databases", { method: "POST", body: { databaseId, name: "RowMotion Race" } });
  });
}

async function ensureCollection(item) {
  await request(`/databases/${databaseId}/collections/${item.id}`, { method: "GET" }).catch(async (error) => {
    if (error.status !== 404) throw error;
    await request(`/databases/${databaseId}/collections`, {
      method: "POST",
      body: { collectionId: item.id, name: item.id, permissions: [], documentSecurity: false, enabled: true }
    });
  });
}

async function ensureAttribute(collectionId, attribute) {
  const attributePath = `/databases/${databaseId}/collections/${collectionId}/attributes/${attribute.key}`;
  const exists = await request(attributePath, { method: "GET" }).then(() => true).catch((error) => {
    if (error.status === 404) return false;
    throw error;
  });
  if (exists) return;

  const endpointByType = { string: "string", integer: "integer", boolean: "boolean" }[attribute.type];
  const body = { key: attribute.key, required: attribute.required };
  if (attribute.type === "string") body.size = attribute.size;
  await request(`/databases/${databaseId}/collections/${collectionId}/attributes/${endpointByType}`, { method: "POST", body });
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
