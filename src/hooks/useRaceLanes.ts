"use client";

import { useEffect, useState } from "react";
import type { RaceLane } from "@/types/live-race";
import { subscribeRaceLanes } from "@/services/courseSetupService";

export function useRaceLanes(competitionId: string, raceId?: string) {
  const [lanes, setLanes] = useState<RaceLane[]>([]);
  useEffect(() => {
    if (!competitionId || !raceId) {
      setLanes([]);
      return;
    }
    return subscribeRaceLanes(competitionId, raceId, setLanes);
  }, [competitionId, raceId]);
  return lanes;
}
