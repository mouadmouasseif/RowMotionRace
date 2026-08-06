export const appwriteCollections = {
  users: ["firstName", "lastName", "email", "role", "clubId", "avatar", "active", "createdAt"],
  clubs: ["name", "shortName", "logo", "city", "country", "federationId", "active"],
  athletes: ["firstName", "lastName", "photo", "birthDate", "gender", "category", "clubId", "licenseNumber", "nationality", "weight", "height", "active"],
  competitions: ["name", "discipline", "venue", "startDate", "endDate", "status", "organizer", "logo", "distance", "numberOfLanes", "publicCode", "liveEnabled"],
  boats: ["competitionId", "boatClass", "boatNumber", "clubId", "athleteIds", "status"],
  races: ["competitionId", "raceNumber", "category", "raceType", "distanceMeters", "numberOfLanes", "status", "resultsStatus", "startTimestamp", "finishTimestamp"],
  raceEntries: ["competitionId", "raceId", "athleteId", "boatId", "lane", "status"],
  timingEvents: ["competitionId", "raceId", "deviceId", "stationId", "userId", "type", "serverTimestamp", "deviceTimestamp", "latencyMs", "sequence", "payload"],
  penalties: ["raceId", "athleteId", "boatId", "type", "value", "unit", "reason", "juryId", "timestamp", "status"],
  timingDevices: ["name", "stationType", "ip", "mac", "firmware", "battery", "signal", "latency", "lastSeen", "status"],
  auditLog: ["eventOriginal", "eventCorrection", "userId", "timestamp", "reason"]
} as const;

export const rowmotionRoles = [
  "SUPER_ADMIN",
  "FEDERATION",
  "TECHNICAL_DIRECTOR",
  "CLUB_ADMIN",
  "COACH",
  "JURY",
  "START_JUDGE",
  "FINISH_JUDGE",
  "TIMEKEEPER",
  "VIDEO_OPERATOR",
  "COMMENTATOR",
  "ATHLETE",
  "PUBLIC"
] as const;

export const appwriteEnvironmentKeys = [
  "NEXT_PUBLIC_APPWRITE_ENDPOINT",
  "NEXT_PUBLIC_APPWRITE_PROJECT_ID",
  "NEXT_PUBLIC_APPWRITE_DATABASE_ID",
  "APPWRITE_API_KEY"
] as const;
