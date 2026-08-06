export type OfficialRaceState = "DRAFT" | "READY" | "ARMED" | "STARTED" | "RACING" | "FINISHING" | "FINISHED" | "PROVISIONAL" | "OFFICIAL";
export type RaceAction = "CONFIGURE" | "ARM" | "START" | "FIRST_FINISH" | "ALL_FINISHED" | "PUBLISH_PROVISIONAL" | "VALIDATE_OFFICIAL" | "REOPEN";

const transitions: Record<OfficialRaceState, Partial<Record<RaceAction, OfficialRaceState>>> = {
  DRAFT: { CONFIGURE: "READY" },
  READY: { ARM: "ARMED", REOPEN: "DRAFT" },
  ARMED: { START: "STARTED", REOPEN: "READY" },
  STARTED: { FIRST_FINISH: "FINISHING" },
  RACING: { FIRST_FINISH: "FINISHING" },
  FINISHING: { ALL_FINISHED: "FINISHED" },
  FINISHED: { PUBLISH_PROVISIONAL: "PROVISIONAL", REOPEN: "FINISHING" },
  PROVISIONAL: { VALIDATE_OFFICIAL: "OFFICIAL", REOPEN: "FINISHED" },
  OFFICIAL: { REOPEN: "PROVISIONAL" }
};

export function transitionRaceState(state: OfficialRaceState, action: RaceAction) {
  const next = transitions[state][action];
  if (!next) throw new Error(`Action ${action} is not allowed from ${state}`);
  return next;
}

export function canTransitionRaceState(state: OfficialRaceState, action: RaceAction) {
  return Boolean(transitions[state][action]);
}
