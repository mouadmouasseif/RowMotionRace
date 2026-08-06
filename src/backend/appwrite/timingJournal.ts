import { ID } from "appwrite";
import { getAppwriteConfig } from "./client";
import { appwriteRest } from "./rest";
import type { OfficialTimingJournalInput } from "@/services/timingJournalService";

export async function writeAppwriteTimingJournalEvent(input: OfficialTimingJournalInput & { eventId: string; clientCapturedAt: number }) {
  const config = getAppwriteConfig();
  return appwriteRest(`/databases/${config.databaseId}/collections/timingEvents/documents`, {
    method: "POST",
    body: {
      documentId: ID.unique(),
      data: {
        eventId: input.eventId,
        competitionId: input.competitionId,
        raceId: input.raceId,
        entryId: input.entryId ?? null,
        stationId: input.stationId ?? null,
        deviceId: input.deviceId ?? null,
        userId: input.userId,
        type: input.type,
        sequence: input.sequence ?? null,
        deviceTimestamp: input.deviceTimestamp ?? null,
        clientCapturedAt: input.clientCapturedAt,
        serverTimestamp: Date.now(),
        payload: JSON.stringify(input.payload ?? {}),
        appendOnly: true
      }
    }
  });
}
