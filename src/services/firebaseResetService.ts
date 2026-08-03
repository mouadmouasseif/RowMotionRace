"use client";

import { addDoc, serverTimestamp } from "firebase/firestore";
import type { ResetScope } from "@/types/live-race";
import { auditLogsCollection } from "./livePaths";

export const resetLabels: Record<ResetScope["kind"], string> = {
  LIVE_RACE: "Reset Live Race",
  CURRENT_RACE: "Reset Current Race",
  COMPETITION_RESULTS: "Reset Competition Results",
  PENALTIES: "Reset Penalties",
  CHRONOMETERS: "Reset Chronometers",
  CAMERAS: "Reset Cameras",
  TEST_DATA: "Reset Test Data",
  FULL_COMPETITION: "Full Competition Reset"
};

export function getResetConfirmationText(competitionName: string) {
  return `RESET ${competitionName.toUpperCase()}`;
}

export async function requestReset(scope: ResetScope, userId: string, role: string, confirmation: string, competitionName: string) {
  if (scope.kind === "FULL_COMPETITION" && role !== "SUPER_ADMIN") throw new Error("Only SUPER_ADMIN can run a full reset");
  if (confirmation !== getResetConfirmationText(competitionName)) throw new Error("Reset confirmation does not match");
  await addDoc(auditLogsCollection(scope.competitionId), {
    userId,
    role,
    action: `RESET_REQUESTED_${scope.kind}`,
    after: scope,
    createdAt: serverTimestamp()
  });
}
