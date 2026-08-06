import type { RowMotionAthlete, RowMotionCategory, RowMotionClub, RowMotionCoach, RowMotionUser, UnknownRecord } from "@/types/rowmotion-ai";

export function firstString(raw: UnknownRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export function firstNumber(raw: UnknownRecord, keys: string[]): number | null {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  }
  return null;
}

export function normalizeUser(id: string, raw: UnknownRecord): RowMotionUser {
  const permissions = raw.racePermissions ?? raw.permissions;
  return {
    id,
    displayName: firstString(raw, ["displayName", "fullName", "name", "nomComplet"]) ?? "Utilisateur",
    email: firstString(raw, ["email", "emailAddress"]),
    role: firstString(raw, ["role", "userRole", "type"]),
    racePermissions: Array.isArray(permissions) ? permissions.filter((value): value is string => typeof value === "string") : [],
    raw
  };
}

export function normalizeAthlete(id: string, raw: UnknownRecord): RowMotionAthlete {
  const firstName = firstString(raw, ["firstName", "prenom", "givenName"]) ?? "";
  const lastName = firstString(raw, ["lastName", "nom", "familyName"]) ?? "";
  return {
    id,
    firstName,
    lastName,
    displayName: firstString(raw, ["displayName", "fullName", "nomComplet", "name"]) ?? ([firstName, lastName].filter(Boolean).join(" ") || "Athlete sans nom"),
    licenseNumber: firstString(raw, ["licenseNumber", "licenceNumber", "numeroLicence", "license", "licence"]),
    clubId: firstString(raw, ["clubId", "club_id", "idClub"]),
    clubName: firstString(raw, ["clubName", "nomClub", "club", "clubDisplayName"]),
    categoryId: firstString(raw, ["categoryId", "category_id", "categorieId"]),
    coachId: firstString(raw, ["coachId", "coach_id", "entraineurId"]),
    photoURL: firstString(raw, ["photoURL", "photoUrl", "profilePhotoURL", "avatarUrl", "imageUrl", "imageURL", "photo", "avatar"]),
    score: firstNumber(raw, ["score", "scort", "points", "rankingScore", "performanceScore", "totalScore"]),
    ranking: firstNumber(raw, ["ranking", "rank", "classement", "nationalRank", "position"]),
    performanceLabel: firstString(raw, ["performanceLabel", "level", "niveau", "categoryLabel", "rating"]),
    raw
  };
}

export function normalizeClub(id: string, raw: UnknownRecord): RowMotionClub {
  return {
    id,
    name: firstString(raw, ["name", "nom", "clubName", "displayName"]) ?? "Club sans nom",
    shortName: firstString(raw, ["shortName", "acronym", "sigle"]),
    logoURL: firstString(raw, ["logoURL", "logoUrl", "logo", "imageURL"]),
    city: firstString(raw, ["city", "ville"]),
    federationId: firstString(raw, ["federationId", "federation_id"]),
    raw
  };
}

export function normalizeCoach(id: string, raw: UnknownRecord): RowMotionCoach {
  const firstName = firstString(raw, ["firstName", "prenom"]) ?? "";
  const lastName = firstString(raw, ["lastName", "nom"]) ?? "";
  return {
    id,
    displayName: firstString(raw, ["displayName", "fullName", "name"]) ?? ([firstName, lastName].filter(Boolean).join(" ") || "Coach sans nom"),
    clubId: firstString(raw, ["clubId", "club_id"]),
    raw
  };
}

export function normalizeCategory(id: string, raw: UnknownRecord): RowMotionCategory {
  return {
    id,
    name: firstString(raw, ["name", "nom", "label", "displayName"]) ?? "Categorie sans nom",
    code: firstString(raw, ["code", "slug", "shortName"]),
    raw
  };
}
