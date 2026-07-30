import { describe, expect, it } from "vitest";
import { normalizeAthlete, normalizeCategory, normalizeClub, normalizeCoach, normalizeUser } from "./normalizers";

describe("normalisation RowMotion AI", () => {
  it("conserve l’identifiant d’un athlète existant", () => {
    const raw = { prenom: "Aya", nom: "El Mansouri", numeroLicence: "MAR-2048", clubId: "club-1" };
    expect(normalizeAthlete("athlete-1", raw)).toMatchObject({ id: "athlete-1", displayName: "Aya El Mansouri", licenseNumber: "MAR-2048", clubId: "club-1", raw });
  });
  it("ne fabrique pas les champs absents d’un club", () => {
    expect(normalizeClub("club-1", { nom: "Aviron Rabat" })).toMatchObject({ id: "club-1", name: "Aviron Rabat", city: null, logoURL: null });
  });
  it("lit les utilisateurs, coachs et catégories existants", () => {
    expect(normalizeUser("u1", { name: "Samir", role: "coach", racePermissions: ["view_competition"] })).toMatchObject({ displayName: "Samir", role: "coach" });
    expect(normalizeCoach("c1", { prenom: "Nadia", nom: "Amrani" }).displayName).toBe("Nadia Amrani");
    expect(normalizeCategory("cat1", { label: "Senior" }).name).toBe("Senior");
  });
});
