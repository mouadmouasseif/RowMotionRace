import type { Timestamp } from "firebase/firestore";
import type { CourseType, DrawMode, RaceStatus } from "./live-race";

export type CompetitionStatus = "DRAFT" | "REGISTRATION_OPEN" | "REGISTRATION_CLOSED" | "LIVE" | "COMPLETED" | "CANCELLED";
export type CompetitionType =
  | "REGATTA"
  | "CHAMPIONSHIP"
  | "CUP"
  | "NATIONAL_CHAMPIONSHIP"
  | "REGIONAL_CHAMPIONSHIP"
  | "CLUB_EVENT"
  | "QUALIFICATION"
  | "TIME_TRIAL"
  | "BEACH_SPRINT"
  | "INDOOR"
  | "HEAD_RACE"
  | "CUSTOM";
export type RegistrationStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "CONFIRMED" | "REJECTED" | "WITHDRAWN" | "WAITING_LIST";
export type EventStatus = "REGISTRATION" | "DRAW" | "READY" | "IN_PROGRESS" | "COMPLETED";
export type StartMethod = "MASS_START" | "LANE_START" | "TIME_TRIAL" | "INDIVIDUAL_START" | "BEACH_START" | "CUSTOM";
export type DrawType = "ATHLETE_DRAW" | "CREW_DRAW" | "BOAT_NUMBER_DRAW" | "LANE_DRAW" | "STARTING_ORDER_DRAW" | "HEAT_DRAW" | "FULL_DRAW";
export type DrawStrategy = "RANDOM" | "SEEDED" | "MANUAL" | "RANKING_BASED";
export type BoatStatus = "AVAILABLE" | "ASSIGNED" | "RACING" | "MAINTENANCE";

export interface FederationProfile {
  id: string;
  name: string;
  logoUrl?: string;
  country?: string;
  season?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Competition {
  id: string;
  name: string;
  organizer?: string;
  federationId?: string;
  federationName?: string;
  organizingClubId?: string;
  organizingClubName?: string;
  location?: string;
  startsAt?: Timestamp;
  endsAt?: Timestamp;
  type: CompetitionType;
  format?: string;
  status: CompetitionStatus;
  registrationOpensAt?: Timestamp;
  registrationClosesAt?: Timestamp;
  maxAthletes?: number;
  maxClubs?: number;
  logoUrl?: string;
  coverImageUrl?: string;
  publicLiveEnabled: boolean;
  publicResultsEnabled: boolean;
  competitionCode: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CompetitionEvent {
  id: string;
  competitionId: string;
  name: string;
  categoryId?: string;
  categoryName: string;
  gender: string;
  boatClass: string;
  raceType: string;
  distanceMeters: number;
  courseType?: CourseType;
  startMethod: StartMethod;
  maxEntries?: number;
  numberOfHeats?: number;
  qualificationRules?: string;
  status: EventStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CompetitionRegistration {
  id: string;
  competitionId: string;
  athleteId: string;
  athleteName?: string;
  athletePhotoURL?: string | null;
  athleteScore?: number | null;
  athleteRanking?: number | null;
  athletePerformanceLabel?: string | null;
  clubId: string;
  clubName?: string;
  events: string[];
  crewId?: string;
  status: RegistrationStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CompetitionCrew {
  id: string;
  competitionId: string;
  name: string;
  boatClass: string;
  athleteIds: string[];
  clubId: string;
  clubName?: string;
  gender: "MEN" | "WOMEN" | "MIXED";
  status: RegistrationStatus;
  createdAt?: Timestamp;
}

export interface Boat {
  id: string;
  boatNumber: string;
  clubId?: string;
  clubName?: string;
  boatClass: string;
  status: BoatStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CompetitionDrawSettings {
  randomizeAthletes: boolean;
  randomizeBoats: boolean;
  randomizeLanes: boolean;
  randomizeHeats: boolean;
  keepClubAthletesSeparated: boolean;
  avoidSameClubInSameHeat: boolean;
  useSeeding: boolean;
  usePreviousRanking: boolean;
}

export interface HeatDrawEntry {
  registrationId: string;
  athleteId: string;
  athleteName?: string;
  clubId: string;
  clubName?: string;
  heatNumber: number;
  lane?: number;
  boatNumber?: string;
  seedRank?: number;
}

export interface DrawVersion {
  version: number;
  createdBy: string;
  createdAt?: Timestamp;
  entries: HeatDrawEntry[];
  status: "DRAFT" | "OFFICIAL" | "ARCHIVED";
}

export interface CompetitionDraw {
  id: string;
  competitionId: string;
  eventId?: string;
  raceId?: string;
  type: DrawType;
  mode: DrawMode | "HEATS";
  strategy: DrawStrategy;
  settings: CompetitionDrawSettings;
  entries: HeatDrawEntry[];
  versions: DrawVersion[];
  status: "DRAFT" | "CONFIRMED" | "LOCKED" | "CANCELLED";
  createdBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FederationMetrics {
  activeCompetitions: number;
  upcomingCompetitions: number;
  racesToday: number;
  liveRaces: number;
  registeredAthletes: number;
  participatingClubs: number;
  activeJudges: number;
  assignedBoats: number;
  pendingResults: number;
  openPenalties: number;
}

export interface LaunchLiveCheck {
  ok: boolean;
  missing: string[];
  href?: string;
}

export interface CompetitionRaceSummary {
  id: string;
  competitionId: string;
  eventId?: string;
  name: string;
  raceNumber: number;
  status: RaceStatus;
  categoryName?: string;
  gender?: string;
  boatClass?: string;
  distanceMeters?: number;
  startMethod?: StartMethod;
}
