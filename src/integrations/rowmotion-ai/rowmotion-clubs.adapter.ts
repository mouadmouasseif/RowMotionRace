import { ROWMOTION_COLLECTIONS } from "@/constants/firestore";
import type { RowMotionClub } from "@/types/rowmotion-ai";
import { readCollection, readDocument } from "./firestore-reader";
import { normalizeClub } from "./normalizers";

export const getExistingClubs = (maximum = 250): Promise<RowMotionClub[]> => readCollection(ROWMOTION_COLLECTIONS.clubs, normalizeClub, maximum);
export const getExistingClubById = (id: string): Promise<RowMotionClub | null> => readDocument(ROWMOTION_COLLECTIONS.clubs, id, normalizeClub);
export async function searchExistingClubs(term: string) {
  const needle = term.trim().toLocaleLowerCase("fr");
  return (await getExistingClubs()).filter((club) => [club.name, club.shortName, club.city].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(needle));
}
