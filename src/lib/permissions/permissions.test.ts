import { describe, expect, it } from "vitest";
import { canAccessRaceModule, hasRacePermission } from "./permissions";
import type { RowMotionUser } from "@/types/rowmotion-ai";

const profile = (role: string, racePermissions: string[] = []): RowMotionUser => ({ id: "u1", displayName: "Test", email: null, role, racePermissions, raw: {} });
describe("permissions Race", () => {
  it("réutilise un rôle RowMotion AI", () => expect(canAccessRaceModule(profile("coach"))).toBe(true));
  it("accepte le droit complémentaire", () => expect(canAccessRaceModule(profile("viewer", ["view_competition"]))).toBe(true));
  it("accorde les droits aux administrateurs", () => expect(hasRacePermission(profile("competition_admin"), "manage_competition")).toBe(true));
});
