import { ROWMOTION_COLLECTIONS } from "@/constants/firestore";
import { readCollection } from "./firestore-reader";
import { normalizeCoach } from "./normalizers";

export const getExistingCoaches = (maximum = 250) => readCollection(ROWMOTION_COLLECTIONS.coaches, normalizeCoach, maximum);
