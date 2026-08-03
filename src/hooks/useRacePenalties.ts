"use client";

import { useEffect, useState } from "react";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import type { RacePenalty } from "@/types/live-race";
import { penaltiesCollection } from "@/services/livePaths";

export function useRacePenalties(competitionId: string, raceId?: string) {
  const [penalties, setPenalties] = useState<RacePenalty[]>([]);

  useEffect(() => {
    if (!competitionId || !raceId) {
      setPenalties([]);
      return;
    }
    return onSnapshot(query(penaltiesCollection(competitionId), orderBy("createdAt", "desc")), (snapshot) => {
      setPenalties(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RacePenalty).filter((penalty) => penalty.raceId === raceId));
    });
  }, [competitionId, raceId]);

  return penalties;
}
