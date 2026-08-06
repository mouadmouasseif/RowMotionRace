export type RaceTimingState = "IDLE" | "ARMED" | "RACING" | "FINISHED";

export interface TimingTimestamp {
  wallClockMs: number;
  monotonicMs: number;
  source: "server" | "client";
}

export interface TimingClock {
  now(): TimingTimestamp;
}

export interface TimingRace {
  raceId: string;
  state: RaceTimingState;
  start?: TimingTimestamp;
  finishes: Record<string, TimingTimestamp>;
}

export interface FinishResult {
  raceId: string;
  targetId: string;
  finish: TimingTimestamp;
  elapsedMs: number;
}

export class SystemTimingClock implements TimingClock {
  now(): TimingTimestamp {
    const monotonicMs = typeof performance === "undefined" ? Date.now() : performance.timeOrigin + performance.now();
    return { wallClockMs: Date.now(), monotonicMs, source: "client" };
  }
}

export class TimingEngine {
  private races = new Map<string, TimingRace>();

  constructor(private readonly clock: TimingClock = new SystemTimingClock()) {}

  armRace(raceId: string) {
    const current = this.races.get(raceId);
    if (current?.state === "RACING") throw new Error("Cannot arm a race that is already racing");
    this.races.set(raceId, { raceId, state: "ARMED", finishes: {} });
  }

  startRace(raceId: string, timestamp = this.clock.now()) {
    const current = this.races.get(raceId);
    if (current && current.state !== "ARMED" && current.state !== "IDLE") throw new Error("Race must be armed before start");
    const race: TimingRace = { raceId, state: "RACING", start: timestamp, finishes: {} };
    this.races.set(raceId, race);
    return race;
  }

  recordFinish(raceId: string, targetId: string, timestamp = this.clock.now()): FinishResult {
    const race = this.races.get(raceId);
    if (!race?.start || race.state !== "RACING") throw new Error("Cannot finish a race that has not started");
    if (race.finishes[targetId]) throw new Error("Finish already recorded for this target");

    race.finishes[targetId] = timestamp;
    const elapsedMs = Math.max(0, Math.round(timestamp.monotonicMs - race.start.monotonicMs));
    return { raceId, targetId, finish: timestamp, elapsedMs };
  }

  finishRace(raceId: string) {
    const race = this.races.get(raceId);
    if (!race?.start) throw new Error("Cannot finish a race that has not started");
    race.state = "FINISHED";
    return race;
  }

  getRace(raceId: string) {
    return this.races.get(raceId) ?? null;
  }

  resetRace(raceId: string) {
    this.races.delete(raceId);
  }
}

export function formatOfficialTime(ms: number, mode: "auto" | "hh" | "mm" | "ss" = "auto") {
  const safe = Math.max(0, Math.floor(ms));
  const hours = Math.floor(safe / 3600000);
  const minutes = Math.floor((safe % 3600000) / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const millis = safe % 1000;

  if (mode === "hh" || (mode === "auto" && hours > 0)) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
  }
  if (mode === "ss" || (mode === "auto" && minutes === 0)) {
    return `${seconds}.${String(millis).padStart(3, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}
