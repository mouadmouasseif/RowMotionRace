import type { RowMotionUser } from "@/types/rowmotion-ai";

const privilegedRoles = new Set(["super_admin", "federation_admin", "competition_admin"]);
const baseRoles = new Set(["club_admin", "coach", "athlete"]);

export function canAccessRaceModule(profile: RowMotionUser | null) {
  return Boolean(profile?.role && (privilegedRoles.has(profile.role) || baseRoles.has(profile.role) || profile.racePermissions.includes("view_competition")));
}

export function hasRacePermission(profile: RowMotionUser | null, permission: string) {
  return Boolean(profile?.role && (privilegedRoles.has(profile.role) || profile.racePermissions.includes(permission)));
}
