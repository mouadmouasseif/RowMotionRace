import { describe, expect, it } from "vitest";
import { calculateClockSync, medianClockOffset } from "./ClockSync";

describe("ClockSync", () => {
  it("calculates round trip time, latency and offset", () => {
    const result = calculateClockSync({ clientSendMs: 1000, serverReceiveMs: 1010, serverSendMs: 1014, clientReceiveMs: 1024 });
    expect(result.roundTripTimeMs).toBe(20);
    expect(result.latencyMs).toBe(10);
    expect(result.clockOffsetMs).toBe(0);
  });

  it("returns median offset", () => {
    expect(medianClockOffset([
      { latencyMs: 1, roundTripTimeMs: 2, clockOffsetMs: -2, serverNowEstimateMs: 0 },
      { latencyMs: 1, roundTripTimeMs: 2, clockOffsetMs: 5, serverNowEstimateMs: 0 },
      { latencyMs: 1, roundTripTimeMs: 2, clockOffsetMs: 1, serverNowEstimateMs: 0 }
    ])).toBe(1);
  });
});
