"use client";

import type { Race, RaceEntry } from "@/types/live-race";
import { LiveStartControl } from "@/components/live/LiveStartControl";

export function StartJudgeMobile(props: { competitionId: string; race: Race | null; races: Race[]; entries: RaceEntry[]; onRaceChange: (raceId: string) => void; userId: string }) {
  return <div className="mx-auto max-w-sm"><LiveStartControl {...props} /></div>;
}
