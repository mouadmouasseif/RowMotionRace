"use client";

import type { Race, RaceEntry, RaceFinish } from "@/types/live-race";
import { formatMs } from "./live-format";

export function LiveResults({ race, entries, finishes, penaltyMsByEntry }: { race: Race | null; entries: RaceEntry[]; finishes: RaceFinish[]; penaltyMsByEntry: Map<string, number> }) {
  const entryById = new Map(entries.map((entry) => [entry.id, entry]));
  const reviewRequired = finishes.some((finish, index) => {
    const previous = finishes[index - 1];
    return previous ? Math.abs(finish.finishTimeMs - previous.finishTimeMs) < 500 : false;
  });

  return (
    <section className="race-card rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{race?.resultsStatus === "OFFICIAL" ? "OFFICIAL RESULTS" : "PROVISIONAL RESULTS"}</h2>
        {reviewRequired && <span className="rounded-md bg-race-warning px-2 py-1 text-[10px] font-black text-black">PHOTO FINISH REVIEW REQUIRED</span>}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="text-race-muted"><tr><th className="py-2">Rank</th><th>Lane</th><th>Boat</th><th>Athlete</th><th>Club</th><th>Raw Time</th><th>Penalty</th><th>Official Time</th></tr></thead>
          <tbody className="divide-y divide-white/[0.06]">
            {finishes.length === 0 ? <tr><td colSpan={8} className="py-4 text-race-muted">Results waiting</td></tr> : finishes.map((finish) => {
              const entry = entryById.get(finish.id);
              const penaltyMs = penaltyMsByEntry.get(finish.id) ?? 0;
              return <tr key={finish.id}><td className="py-3 font-mono text-race-primary">{finish.rank}</td><td>Lane {finish.lane}</td><td>Boat {entry?.boatNumber || "Not available"}</td><td>{entry?.athleteName || "Not available"}</td><td>{entry?.clubName || "Not available"}</td><td>{formatMs(finish.finishTimeMs)}</td><td>{penaltyMs ? `+${formatMs(penaltyMs)}` : "--"}</td><td>{formatMs(finish.finishTimeMs + penaltyMs)}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
