import { NextResponse } from "next/server";
import { writeAppwriteTimingJournalEvent } from "@/backend/appwrite/timingJournal";
import type { OfficialTimingJournalInput } from "@/services/timingJournalService";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as (OfficialTimingJournalInput & { eventId?: string; clientCapturedAt?: number }) | null;
  if (!body?.competitionId || !body.raceId || !body.type || !body.userId || !body.eventId || !body.clientCapturedAt) {
    return NextResponse.json({ ok: false, error: "Invalid timing journal payload" }, { status: 400 });
  }

  await writeAppwriteTimingJournalEvent({ ...body, eventId: body.eventId, clientCapturedAt: body.clientCapturedAt });
  return NextResponse.json({ ok: true, eventId: body.eventId, primary: "appwrite" });
}
