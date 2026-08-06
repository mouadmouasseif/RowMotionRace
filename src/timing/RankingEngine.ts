import { formatOfficialTime } from "./TimingEngine";

export type ResultStatus = "LIVE" | "PROVISIONAL" | "OFFICIAL";
export type NonFinishStatus = "DNS" | "DNF" | "DSQ" | "DNC";

export interface RankingInput {
  entryId: string;
  lane?: number;
  athleteName: string;
  clubName?: string;
  rawTimeMs?: number | null;
  penaltyMs?: number;
  status?: "RACING" | "FINISHED" | NonFinishStatus;
}

export interface RankedResult extends RankingInput {
  officialTimeMs: number | null;
  displayTime: string;
  rank: number | null;
  gapMs: number | null;
  gap: string;
}

const nonFinishOrder: Record<NonFinishStatus, number> = { DNS: 1, DNF: 2, DNC: 3, DSQ: 4 };

export function rankResults(inputs: RankingInput[]) {
  const finished = inputs
    .filter((input) => input.status === "FINISHED" && input.rawTimeMs != null)
    .map((input) => ({ ...input, officialTimeMs: Math.max(0, Math.floor(input.rawTimeMs ?? 0) + Math.max(0, input.penaltyMs ?? 0)) }))
    .sort((a, b) => a.officialTimeMs - b.officialTimeMs || (a.lane ?? 999) - (b.lane ?? 999));

  const leaderTime = finished[0]?.officialTimeMs ?? null;
  const rankedFinished: RankedResult[] = finished.map((input, index) => {
    const gapMs = leaderTime == null ? null : input.officialTimeMs - leaderTime;
    return {
      ...input,
      rank: index + 1,
      gapMs,
      displayTime: formatOfficialTime(input.officialTimeMs),
      gap: gapMs == null || gapMs === 0 ? "" : `+${(gapMs / 1000).toFixed(3)}`
    };
  });

  const racing = inputs
    .filter((input) => input.status === "RACING" || (!input.status && input.rawTimeMs == null))
    .sort((a, b) => (a.lane ?? 999) - (b.lane ?? 999))
    .map<RankedResult>((input) => ({
      ...input,
      officialTimeMs: null,
      displayTime: input.rawTimeMs == null ? "--" : formatOfficialTime(input.rawTimeMs),
      rank: null,
      gapMs: null,
      gap: ""
    }));

  const nonFinish = inputs
    .filter((input): input is RankingInput & { status: NonFinishStatus } => input.status === "DNS" || input.status === "DNF" || input.status === "DSQ" || input.status === "DNC")
    .sort((a, b) => nonFinishOrder[a.status] - nonFinishOrder[b.status] || (a.lane ?? 999) - (b.lane ?? 999))
    .map<RankedResult>((input) => ({
      ...input,
      officialTimeMs: null,
      displayTime: input.status,
      rank: null,
      gapMs: null,
      gap: ""
    }));

  return { finished: rankedFinished, racing, nonFinish };
}
