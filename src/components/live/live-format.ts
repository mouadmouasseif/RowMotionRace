import type { RaceStatus } from "@/types/live-race";
import { formatRaceTime } from "@/hooks/useRaceChronometer";

export const unavailable = "Not available";

export function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return unavailable;
  return String(value);
}

export function formatDistance(distance?: number) {
  return typeof distance === "number" ? `${distance} m` : unavailable;
}

export function raceDistanceMeters(race?: { distanceMeters?: number; distance?: number } | null) {
  return race?.distanceMeters ?? race?.distance;
}

export function formatMs(ms?: number) {
  return typeof ms === "number" ? formatRaceTime(ms) : unavailable;
}

export function statusTone(status?: RaceStatus) {
  if (status === "RACING" || status === "FINISHING") return "border-race-success/40 bg-race-success/10 text-race-success";
  if (status === "VALIDATED" || status === "FINISHED") return "border-race-primary/40 bg-race-primary/10 text-race-primary";
  if (status === "CANCELLED") return "border-race-danger/40 bg-race-danger/10 text-race-danger";
  return "border-race-warning/35 bg-race-warning/10 text-race-warning";
}
