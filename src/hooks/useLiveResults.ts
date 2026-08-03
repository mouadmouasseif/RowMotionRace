"use client";

import { useEffect, useMemo, useState } from "react";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import type { RaceFinish, RacePenalty } from "@/types/live-race";
import { penaltiesCollection, raceFinishesCollection } from "@/services/livePaths";

export function useLiveResults(competitionId: string, raceId?: string) {
  const [finishes, setFinishes] = useState<RaceFinish[]>([]);
  const [penalties, setPenalties] = useState<RacePenalty[]>([]);

  useEffect(() => {
    if (!competitionId || !raceId) {
      setFinishes([]);
      return;
    }
    return onSnapshot(query(raceFinishesCollection(competitionId, raceId), orderBy("rank", "asc")), (snapshot) => {
      setFinishes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RaceFinish));
    });
  }, [competitionId, raceId]);

  useEffect(() => {
    if (!competitionId || !raceId) {
      setPenalties([]);
      return;
    }
    return onSnapshot(penaltiesCollection(competitionId), (snapshot) => {
      setPenalties(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RacePenalty).filter((penalty) => penalty.raceId === raceId));
    });
  }, [competitionId, raceId]);

  const penaltyMsByEntry = useMemo(() => {
    const totals = new Map<string, number>();
    penalties.filter((penalty) => penalty.status !== "CANCELLED").forEach((penalty) => {
      totals.set(penalty.entryId, (totals.get(penalty.entryId) ?? 0) + penalty.penaltyMs);
    });
    return totals;
  }, [penalties]);

  return { finishes, penalties, penaltyMsByEntry };
}
