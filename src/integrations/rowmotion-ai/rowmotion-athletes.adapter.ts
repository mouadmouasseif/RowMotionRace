import { ROWMOTION_COLLECTIONS } from "@/constants/firestore";
import type { RowMotionAthlete } from "@/types/rowmotion-ai";
import { readCollection, readDocument } from "./firestore-reader";
import { normalizeAthlete } from "./normalizers";

export const getExistingAthletes = (maximum = 250): Promise<RowMotionAthlete[]> => readCollection(ROWMOTION_COLLECTIONS.athletes, normalizeAthlete, maximum);
export const getExistingAthleteById = (id: string): Promise<RowMotionAthlete | null> => readDocument(ROWMOTION_COLLECTIONS.athletes, id, normalizeAthlete);

export async function searchExistingAthletes(term: string, filters: { clubId?: string; categoryId?: string } = {}) {
  const needle = term.trim().toLocaleLowerCase("fr");
  return (await getExistingAthletes()).filter((athlete) =>
    [athlete.displayName, athlete.licenseNumber].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(needle) &&
    (!filters.clubId || athlete.clubId === filters.clubId) &&
    (!filters.categoryId || athlete.categoryId === filters.categoryId)
  );
}
