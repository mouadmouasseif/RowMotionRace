import { ROWMOTION_COLLECTIONS } from "@/constants/firestore";
import { readCollection } from "./firestore-reader";
import { normalizeCategory } from "./normalizers";

export const getExistingCategories = (maximum = 250) => readCollection(ROWMOTION_COLLECTIONS.categories, normalizeCategory, maximum);
