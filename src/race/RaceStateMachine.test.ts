import { describe, expect, it } from "vitest";
import { canTransitionRaceState, transitionRaceState } from "./RaceStateMachine";

describe("RaceStateMachine", () => {
  it("allows the official happy path", () => {
    expect(transitionRaceState("DRAFT", "CONFIGURE")).toBe("READY");
    expect(transitionRaceState("READY", "ARM")).toBe("ARMED");
    expect(transitionRaceState("ARMED", "START")).toBe("STARTED");
    expect(transitionRaceState("STARTED", "FIRST_FINISH")).toBe("FINISHING");
    expect(transitionRaceState("FINISHING", "ALL_FINISHED")).toBe("FINISHED");
    expect(transitionRaceState("FINISHED", "PUBLISH_PROVISIONAL")).toBe("PROVISIONAL");
    expect(transitionRaceState("PROVISIONAL", "VALIDATE_OFFICIAL")).toBe("OFFICIAL");
  });

  it("blocks incoherent actions", () => {
    expect(canTransitionRaceState("DRAFT", "FIRST_FINISH")).toBe(false);
    expect(() => transitionRaceState("DRAFT", "FIRST_FINISH")).toThrow("not allowed");
  });
});
