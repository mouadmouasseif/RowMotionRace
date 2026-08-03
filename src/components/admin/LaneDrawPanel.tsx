"use client";

import type { Race, RaceBoat, RaceLane } from "@/types/live-race";
import { BoatDrawPanel } from "./BoatDrawPanel";

export function LaneDrawPanel(props: { competitionId: string; race: Race | null; boats: RaceBoat[]; lanes: RaceLane[]; userId: string; role: string }) {
  return <BoatDrawPanel {...props} />;
}
