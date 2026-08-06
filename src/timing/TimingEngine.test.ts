import { describe, expect, it } from "vitest";
import { formatOfficialTime, TimingEngine, type TimingClock, type TimingTimestamp } from "./TimingEngine";

class FakeClock implements TimingClock {
  private nextMs = 0;

  set(ms: number) {
    this.nextMs = ms;
  }

  now(): TimingTimestamp {
    return { wallClockMs: this.nextMs, monotonicMs: this.nextMs, source: "server" };
  }
}

describe("TimingEngine", () => {
  it("calculates elapsed time from start and finish timestamps", () => {
    const clock = new FakeClock();
    const engine = new TimingEngine(clock);

    engine.armRace("race-18");
    clock.set(1000);
    engine.startRace("race-18");
    clock.set(89504);

    expect(engine.recordFinish("race-18", "lane-3").elapsedMs).toBe(88504);
  });

  it("rejects finish before start", () => {
    const engine = new TimingEngine(new FakeClock());
    expect(() => engine.recordFinish("race-18", "lane-3")).toThrow("Cannot finish");
  });

  it("rejects duplicate finish for the same target", () => {
    const clock = new FakeClock();
    const engine = new TimingEngine(clock);

    engine.armRace("race-18");
    engine.startRace("race-18");
    clock.set(1000);
    engine.recordFinish("race-18", "lane-3");

    expect(() => engine.recordFinish("race-18", "lane-3")).toThrow("Finish already recorded");
  });

  it("formats official times", () => {
    expect(formatOfficialTime(88504)).toBe("01:28.504");
    expect(formatOfficialTime(8312)).toBe("8.312");
    expect(formatOfficialTime(3723004)).toBe("01:02:03.004");
  });
});
