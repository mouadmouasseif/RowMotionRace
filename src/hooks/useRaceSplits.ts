"use client";

import { useEffect, useState } from "react";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import type { RaceSplit } from "@/types/live-race";
import { raceSplitsCollection } from "@/services/livePaths";

export function useRaceSplits(competitionId: string, raceId?: string) {
  const [splits, setSplits] = useState<RaceSplit[]>([]);
  useEffect(() => {
    if (!competitionId || !raceId) {
      setSplits([]);
      return;
    }
    return onSnapshot(query(raceSplitsCollection(competitionId, raceId), orderBy("splitTimeMs", "asc")), (snapshot) => {
      setSplits(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as RaceSplit));
    });
  }, [competitionId, raceId]);
  return splits;
}
