"use client";

import { useEffect, useState } from "react";
import type { CompetitionRegistration } from "@/types/federation";
import { subscribeRegistrations } from "@/services/federationService";

export function useRegistrations(competitionId: string) {
  const [registrations, setRegistrations] = useState<CompetitionRegistration[]>([]);
  useEffect(() => {
    if (!competitionId) return;
    return subscribeRegistrations(competitionId, setRegistrations);
  }, [competitionId]);
  return registrations;
}
