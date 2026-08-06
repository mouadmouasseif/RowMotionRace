import { describe, expect, it } from "vitest";
import { createTimingEvent, isDuplicateTimingEvent } from "./TimingEvents";

describe("TimingEvents", () => {
  it("detects duplicate device sequence acknowledgements", () => {
    const previous = createTimingEvent({ raceId: "race-18", stationId: "finish-01", type: "FINISH", sequence: 182, serverTimestamp: 1000 });
    expect(isDuplicateTimingEvent(previous, { raceId: "race-18", stationId: "finish-01", type: "FINISH", sequence: 182, serverTimestamp: 5000 })).toBe(true);
  });

  it("detects rapid double click from the same station", () => {
    const previous = createTimingEvent({ raceId: "race-18", stationId: "finish-01", type: "FINISH", serverTimestamp: 1000 });
    expect(isDuplicateTimingEvent(previous, { raceId: "race-18", stationId: "finish-01", type: "FINISH", serverTimestamp: 1200 })).toBe(true);
  });
});
