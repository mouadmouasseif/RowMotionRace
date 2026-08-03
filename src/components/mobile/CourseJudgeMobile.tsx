"use client";

import type { RaceEntry } from "@/types/live-race";
import { JuryPenaltyPanel } from "@/components/jury/JuryPenaltyPanel";

export function CourseJudgeMobile(props: { competitionId: string; raceId?: string; entries: RaceEntry[]; userId: string; role: string }) {
  return <div className="mx-auto max-w-sm"><JuryPenaltyPanel {...props} /></div>;
}
