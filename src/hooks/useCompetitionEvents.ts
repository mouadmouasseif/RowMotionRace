"use client";

import { useEffect, useState } from "react";
import type { CompetitionEvent } from "@/types/federation";
import { subscribeCompetitionEvents } from "@/services/federationService";

export function useCompetitionEvents(competitionId: string) {
  const [events, setEvents] = useState<CompetitionEvent[]>([]);
  useEffect(() => {
    if (!competitionId) return;
    return subscribeCompetitionEvents(competitionId, setEvents);
  }, [competitionId]);
  return events;
}
