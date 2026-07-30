import { ROWMOTION_COLLECTIONS } from "@/constants/firestore";
import { readDocument } from "./firestore-reader";
import { normalizeUser } from "./normalizers";

export const getExistingUserById = (id: string) => readDocument(ROWMOTION_COLLECTIONS.users, id, normalizeUser);
