"use client";

import { useEffect, useState } from "react";
import type { RaceCheckpoint } from "@/types/live-race";
import { subscribeRaceCheckpoints } from "@/services/courseSetupService";

export function useRaceCheckpoints(competitionId: string, raceId?: string) {
  const [checkpoints, setCheckpoints] = useState<RaceCheckpoint[]>([]);
  useEffect(() => {
    if (!competitionId || !raceId) {
      setCheckpoints([]);
      return;
    }
    return subscribeRaceCheckpoints(competitionId, raceId, setCheckpoints);
  }, [competitionId, raceId]);
  return checkpoints;
}
