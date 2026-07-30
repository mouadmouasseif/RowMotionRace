export const ROWMOTION_COLLECTIONS = {
  users: "users",
  athletes: "athletes",
  coaches: "coaches",
  clubs: "clubs",
  federations: "federations",
  categories: "categories",
  notifications: "notifications"
} as const;

export type RowMotionCollectionName = (typeof ROWMOTION_COLLECTIONS)[keyof typeof ROWMOTION_COLLECTIONS];
