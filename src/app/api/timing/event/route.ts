import { NextResponse, type NextRequest } from "next/server";
import { createTimingEvent, isDuplicateTimingEvent, type TimingEventPayload, type TimingEventType } from "@/timing/TimingEvents";

interface TimingEventRequest {
  stationId?: string;
  raceId?: string;
  type?: TimingEventType;
  deviceTimestamp?: number;
  sequence?: number;
  payload?: Record<string, unknown>;
}

const timingJournal = globalThis as typeof globalThis & {
  rowmotionTimingJournal?: TimingEventPayload[];
};

function journal() {
  timingJournal.rowmotionTimingJournal ??= [];
  return timingJournal.rowmotionTimingJournal;
}

export async function POST(request: NextRequest) {
  const receivedAt = Date.now();
  const body = (await request.json().catch(() => null)) as TimingEventRequest | null;

  if (!body?.raceId || !body.stationId || !body.type) {
    return NextResponse.json({ ok: false, error: "raceId, stationId and type are required" }, { status: 400 });
  }

  const latencyMs = body.deviceTimestamp ? Math.max(0, receivedAt - body.deviceTimestamp) : undefined;
  const previous = [...journal()].reverse().find((event) => event.stationId === body.stationId);
  const duplicate = isDuplicateTimingEvent(previous, {
    stationId: body.stationId,
    raceId: body.raceId,
    type: body.type,
    sequence: body.sequence,
    serverTimestamp: receivedAt
  });

  if (duplicate && previous) {
    return NextResponse.json({ ok: true, duplicate: true, acknowledgedEventId: previous.eventId, serverTimestamp: receivedAt });
  }

  const event = createTimingEvent({
    stationId: body.stationId,
    raceId: body.raceId,
    type: body.type,
    deviceTimestamp: body.deviceTimestamp,
    sequence: body.sequence,
    latencyMs,
    payload: body.payload,
    serverTimestamp: receivedAt
  });

  journal().push(event);
  return NextResponse.json({ ok: true, duplicate: false, acknowledgedEventId: event.eventId, serverTimestamp: receivedAt, latencyMs });
}

export async function GET() {
  return NextResponse.json({ ok: true, events: journal().slice(-100) });
}
