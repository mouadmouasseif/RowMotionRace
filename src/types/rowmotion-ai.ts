export type UnknownRecord = Record<string, unknown>;

export interface RowMotionUser {
  id: string;
  displayName: string;
  email: string | null;
  role: string | null;
  racePermissions: string[];
  raw: UnknownRecord;
}

export interface RowMotionAthlete {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  licenseNumber: string | null;
  clubId: string | null;
  clubName: string | null;
  categoryId: string | null;
  coachId: string | null;
  photoURL: string | null;
  score: number | null;
  ranking: number | null;
  performanceLabel: string | null;
  raw: UnknownRecord;
}

export interface RowMotionClub {
  id: string;
  name: string;
  shortName: string | null;
  logoURL: string | null;
  city: string | null;
  federationId: string | null;
  raw: UnknownRecord;
}

export interface RowMotionCoach {
  id: string;
  displayName: string;
  clubId: string | null;
  raw: UnknownRecord;
}

export interface RowMotionCategory {
  id: string;
  name: string;
  code: string | null;
  raw: UnknownRecord;
}
