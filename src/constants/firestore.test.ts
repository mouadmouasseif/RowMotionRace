import { describe, expect, it } from "vitest";
import { ROWMOTION_COLLECTIONS } from "./firestore";

describe("collections partagées", () => {
  it("utilise les noms RowMotion AI fournis", () => {
    expect(ROWMOTION_COLLECTIONS).toEqual({ users: "users", athletes: "athletes", coaches: "coaches", clubs: "clubs", federations: "federations", categories: "categories", notifications: "notifications" });
  });
  it("ne définit aucune collection parallèle de profils", () => {
    expect(Object.values(ROWMOTION_COLLECTIONS)).not.toEqual(expect.arrayContaining(["raceAthletes", "raceClubs", "raceUsers"]));
  });
});
