export const ROWMOTION_COLLECTIONS = {
  users: "users",
  athletes: "athletes",
  coaches: "coaches",
  clubs: "clubs",
  federations: "federations",
  judges: "judges",
  boats: "boats",
  categories: "categories",
  notifications: "notifications",
  competitions: "competitions"
} as const;

export const LIVE_COMPETITION_COLLECTIONS = {
  categories: "categories",
  judges: "judges",
  cameras: "cameras",
  races: "races",
  penalties: "penalties",
  auditLogs: "auditLogs",
  liveEvents: "liveEvents"
} as const;

export const LIVE_RACE_COLLECTIONS = {
  entries: "entries",
  boats: "boats",
  lanes: "lanes",
  draws: "draws",
  checkpoints: "checkpoints",
  splits: "splits",
  start: "start",
  penalties: "penalties",
  finishes: "finishes",
  results: "results",
  liveEvents: "liveEvents"
} as const;

export type RowMotionCollectionName = (typeof ROWMOTION_COLLECTIONS)[keyof typeof ROWMOTION_COLLECTIONS];
