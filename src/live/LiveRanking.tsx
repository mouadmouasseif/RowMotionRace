"use client";

import { Trophy } from "lucide-react";
import type { RaceEntry, RaceFinish, RacePenalty } from "@/types/live-race";
import { rankResults, type RankedResult, type ResultStatus } from "@/timing/RankingEngine";
import { cn } from "@/lib/utils";

interface LiveRankingProps {
  entries: RaceEntry[];
  finishes: RaceFinish[];
  penalties: RacePenalty[];
  status?: ResultStatus;
  compact?: boolean;
  transparent?: boolean;
}

export function LiveRanking({ entries, finishes, penalties, status = "LIVE", compact = false, transparent = false }: LiveRankingProps) {
  const ranked = rankResults(entries.map((entry) => {
    const finish = finishes.find((item) => item.reviewStatus !== "CANCELLED" && (item.id === entry.id || item.athleteId === entry.athleteId));
    const penaltyMs = penalties.filter((item) => item.entryId === entry.id && item.status !== "CANCELLED").reduce((sum, item) => sum + item.penaltyMs, 0);
    return {
      entryId: entry.id,
      lane: entry.lane,
      athleteName: entry.athleteName,
      clubName: entry.clubName,
      rawTimeMs: finish?.finishTimeMs ?? null,
      penaltyMs,
      status: finish ? "FINISHED" : entry.status === "DNS" || entry.status === "DNF" || entry.status === "DSQ" ? entry.status : "RACING"
    };
  }));

  return (
    <section className={cn(!transparent && "race-card rounded-2xl p-4", transparent && "p-4")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-race-primary/15 text-race-primary"><Trophy className="size-5" /></div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-[.14em]">Live Ranking</h2>
            <p className="text-xs text-race-muted">{status}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {ranked.finished.length === 0 ? <p className="text-sm text-race-muted">Aucun temps officiel enregistre.</p> : ranked.finished.map((item) => <RankingRow key={item.entryId} item={item} compact={compact} />)}
      </div>

      {ranked.racing.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-race-muted">Still racing</p>
          <div className="mt-2 space-y-2">
            {ranked.racing.map((item) => <RacingRow key={item.entryId} item={item} compact={compact} />)}
          </div>
        </div>
      )}

      {ranked.nonFinish.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-race-muted">Jury status</p>
          <div className="mt-2 space-y-2">
            {ranked.nonFinish.map((item) => <RacingRow key={item.entryId} item={item} compact={compact} />)}
          </div>
        </div>
      )}
    </section>
  );
}

function RankingRow({ item, compact }: { item: RankedResult; compact: boolean }) {
  return (
    <div className={cn("grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3", compact && "grid-cols-[28px_1fr]")}>
      <strong className="text-race-primary">#{item.rank}</strong>
      <div>
        <p className="text-sm font-bold">{lanePrefix(item.lane)}{item.athleteName}</p>
        <p className="text-xs text-race-muted">{item.clubName ?? "-"}{item.penaltyMs ? ` - +${(item.penaltyMs / 1000).toFixed(3)} penalty` : ""}</p>
      </div>
      <div className={cn("text-right", compact && "col-span-2")}>
        <p className="font-mono text-sm font-black tabular-nums">{item.displayTime}</p>
        {item.gap && <p className="font-mono text-xs text-race-muted">{item.gap}</p>}
      </div>
    </div>
  );
}

function RacingRow({ item, compact }: { item: RankedResult; compact: boolean }) {
  return (
    <div className={cn("grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3", compact && "text-sm")}>
      <div>
        <p className="font-semibold">{lanePrefix(item.lane)}{item.athleteName}</p>
        <p className="text-xs text-race-muted">{item.clubName ?? "-"}</p>
      </div>
      <p className="font-mono text-sm text-race-muted">{item.displayTime}</p>
    </div>
  );
}

function lanePrefix(lane?: number) {
  return lane == null ? "" : `Lane ${lane} - `;
}
