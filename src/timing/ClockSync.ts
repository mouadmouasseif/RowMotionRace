export interface ClockSyncSample {
  clientSendMs: number;
  serverReceiveMs: number;
  serverSendMs: number;
  clientReceiveMs: number;
}

export interface ClockSyncResult {
  latencyMs: number;
  roundTripTimeMs: number;
  clockOffsetMs: number;
  serverNowEstimateMs: number;
}

export function calculateClockSync(sample: ClockSyncSample): ClockSyncResult {
  const roundTripTimeMs = Math.max(0, sample.clientReceiveMs - sample.clientSendMs - (sample.serverSendMs - sample.serverReceiveMs));
  const latencyMs = roundTripTimeMs / 2;
  const clockOffsetMs = (sample.serverReceiveMs - sample.clientSendMs + sample.serverSendMs - sample.clientReceiveMs) / 2;
  return {
    latencyMs,
    roundTripTimeMs,
    clockOffsetMs,
    serverNowEstimateMs: sample.clientReceiveMs + clockOffsetMs
  };
}

export function medianClockOffset(results: ClockSyncResult[]) {
  if (results.length === 0) return 0;
  const sorted = results.map((result) => result.clockOffsetMs).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}
