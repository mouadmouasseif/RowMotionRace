"use client";

import { useEffect, useState } from "react";
import type { RaceBoat } from "@/types/live-race";
import { subscribeRaceBoats } from "@/services/courseSetupService";

export function useRaceBoats(competitionId: string, raceId?: string) {
  const [boats, setBoats] = useState<RaceBoat[]>([]);
  useEffect(() => {
    if (!competitionId || !raceId) {
      setBoats([]);
      return;
    }
    return subscribeRaceBoats(competitionId, raceId, setBoats);
  }, [competitionId, raceId]);
  return boats;
}
