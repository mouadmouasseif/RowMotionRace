import type { FieldValue, Timestamp } from "firebase/firestore";

export type RaceStatus =
  | "DRAFT"
  | "PREPARATION"
  | "READY"
  | "START_SEQUENCE"
  | "RACING"
  | "FINISHING"
  | "FINISHED"
  | "VALIDATED"
  | "CANCELLED";

export type ResultsStatus = "PROVISIONAL" | "OFFICIAL";
export type CameraType = "START" | "COURSE" | "FINISH" | "JURY" | "DRONE" | "OTHER";
export type CameraStatus = "ONLINE" | "OFFLINE";
export type JudgeRole = "START_JUDGE" | "FINISH_JUDGE" | "COURSE_JUDGE" | "CHIEF_JUDGE" | "TIMEKEEPER" | "ADMIN";
export type EntryStatus = "WAITING" | "PRESENT" | "READY" | "DNS" | "RACING" | "FINISHED" | "DNF" | "DSQ";
export type PenaltyStatus = "ACTIVE" | "MODIFIED" | "CANCELLED";
export type PenaltyType =
  | "WARNING"
  | "FALSE_START"
  | "DISQUALIFIED"
  | "DNS"
  | "DNF"
  | "DSQ"
  | "TIME_PENALTY"
  | "LANE_VIOLATION"
  | "INTERFERENCE"
  | "TECHNICAL_FAULT"
  | "OTHER";

export type LiveEventType =
  | "READY"
  | "ATTENTION"
  | "START"
  | "FALSE_START"
  | "PENALTY"
  | "FINISH"
  | "RESULT_CHANGE"
  | "DSQ"
  | "DNF"
  | "DNS"
  | "VALIDATED";

export type CourseType = "STRAIGHT" | "OUT_AND_BACK" | "LOOP" | "MULTI_LAP" | "SPRINT" | "HEAD_RACE" | "CUSTOM";
export type DrawStatus = "NOT_STARTED" | "DRAFT" | "CONFIRMED" | "LOCKED";
export type DrawMode = "BOATS" | "LANES" | "FULL";
export type RaceBoatStatus = "REGISTERED" | "ASSIGNED" | "READY" | "DNS" | "DNF" | "DSQ";
export type RaceDrawStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";
export type RaceDrawType = "BOAT_DRAW" | "LANE_DRAW" | "FULL_DRAW";
export type CheckpointType = "START" | "SPLIT" | "TURN" | "FINISH";

export interface Race {
  id: string;
  competitionId: string;
  name: string;
  raceNumber: number;
  category?: string;
  categoryId?: string;
  categoryName?: string;
  gender: string;
  boatClass: string;
  raceType: string;
  distance?: number;
  distanceMeters: number;
  courseType: CourseType;
  lapCount: number;
  numberOfBoats: number;
  numberOfLanes: number;
  drawStatus: DrawStatus;
  status: RaceStatus;
  resultsStatus?: ResultsStatus;
  startedAt?: Timestamp;
  startTimestamp?: Timestamp;
  finishedAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  location?: string;
  competitionName?: string;
  competitionDate?: string;
  competitionType?: string;
}

export interface RaceEntry {
  id: string;
  athleteId: string;
  athleteName: string;
  clubId: string;
  clubName: string;
  clubLogo?: string | null;
  category: string;
  gender: string;
  boatId: string;
  boatNumber: string;
  lane: number;
  status: EntryStatus;
  crewMembers?: Array<{ athleteId: string; athleteName: string }>;
}

export interface RaceBoat {
  id: string;
  competitionId: string;
  raceId: string;
  boatNumber: number;
  athleteId?: string;
  athleteName?: string;
  crewIds?: string[];
  clubId?: string;
  clubName?: string;
  lane?: number;
  drawPosition?: number;
  status: RaceBoatStatus;
}

export interface RaceLane {
  id: string;
  number: number;
  enabled: boolean;
  boatId?: string;
  athleteId?: string;
}

export interface RaceDrawEntry {
  boatId: string;
  athleteId?: string;
  lane?: number;
  boatNumber?: number;
  drawPosition: number;
}

export interface RaceDraw {
  id: string;
  raceId: string;
  type: RaceDrawType;
  mode: DrawMode;
  entries: RaceDrawEntry[];
  createdBy: string;
  createdAt?: Timestamp;
  status: RaceDrawStatus;
}

export interface RaceCheckpoint {
  id: string;
  name: string;
  distanceMeters: number;
  type: CheckpointType;
  cameraId?: string;
}

export interface RaceSplit {
  id: string;
  boatId: string;
  athleteId?: string;
  checkpointId: string;
  splitTimestamp?: Timestamp;
  splitTimeMs: number;
}

export interface RaceCamera {
  id: string;
  name: string;
  type: CameraType;
  location?: string;
  streamUrl?: string;
  enabled: boolean;
  status: CameraStatus;
  connectedAt?: Timestamp;
}

export interface RaceFinish {
  id: string;
  athleteId: string;
  boatId: string;
  lane: number;
  finishTimestamp?: Timestamp;
  finishedAt?: Timestamp;
  finishTimeMs: number;
  officialTime: number;
  rank: number;
  status?: EntryStatus;
  finishDetectionConfidence?: number;
  autoDetectedAt?: Timestamp;
  manualValidatedAt?: Timestamp;
}

export interface RacePenalty {
  id: string;
  raceId: string;
  entryId: string;
  athleteId: string;
  boatId: string;
  lane: number;
  type: PenaltyType;
  reason: string;
  comment?: string;
  penaltyMs: number;
  status: PenaltyStatus;
  createdBy: string;
  modifiedBy?: string;
  createdAt?: Timestamp;
  modifiedAt?: Timestamp;
}

export interface LiveEvent {
  id: string;
  type: LiveEventType;
  raceId: string;
  athleteId?: string;
  boatId?: string;
  userId: string;
  timestamp?: Timestamp;
  metadata?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  userId: string;
  role: string;
  action: string;
  before?: unknown;
  after?: unknown;
  createdAt?: Timestamp | FieldValue;
}

export interface RaceCategory {
  id: string;
  name: string;
  minAge?: number;
  maxAge?: number;
  gender: "ALL" | "MEN" | "WOMEN" | "MIXED";
  enabled: boolean;
}

export interface RaceContext {
  competitionId: string;
  raceId: string;
  category: string;
  gender: string;
  boatClass: string;
  raceType: string;
  distance: number;
  distanceMeters?: number;
  role?: JudgeRole;
}

export interface ResetScope {
  kind:
    | "LIVE_RACE"
    | "CURRENT_RACE"
    | "COMPETITION_RESULTS"
    | "PENALTIES"
    | "CHRONOMETERS"
    | "CAMERAS"
    | "TEST_DATA"
    | "FULL_COMPETITION";
  competitionId: string;
  raceId?: string;
}
