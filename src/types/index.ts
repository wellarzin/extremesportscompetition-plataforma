export type UserRole = 'athlete' | 'admin' | 'professional';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio: string;
  city: string;
  state: string;
  age: number;
  team?: string;
  stravaConnected: boolean;
  bodyScanConnected: boolean;
  createdAt: string;
  stats: {
    totalActivities: number;
    totalPoints: number;
    rankingPosition: number;
    achievementsEarned: number;
    hoursTraining: number;
    eventsParticipated: number;
  };
}

export type EventPhase = 'estadual' | 'nacional' | 'final';
export type EventStatus = 'draft' | 'active' | 'ongoing' | 'finished';
export type Modality =
  | 'atletismo'
  | 'crossfit'
  | 'body-scan'
  | 'natacao'
  | 'ciclismo'
  | 'escalada'
  | 'surf'
  | 'mma'
  | 'gymnastics';

export interface Event {
  id: string;
  name: string;
  modality: Modality;
  phase: EventPhase;
  status: EventStatus;
  date: string;
  endDate: string;
  location: string;
  state: string;
  city: string;
  description: string;
  maxTeams: number;
  registeredTeams: number;
  maxAthletesPerTeam: number;
  minAthletes: number;
  minMale: number;
  minFemale: number;
  prizePool: number;
  image: string;
  rules: string[];
  provas: string[];
}

export type ActivityType =
  | 'burpees'
  | 'pull-ups'
  | 'push-ups'
  | 'box-jumps'
  | 'double-unders'
  | 'rowing'
  | 'running'
  | 'air-squats'
  | 'dips'
  | 'handstand-push-ups'
  | 'toes-to-bar'
  | 'muscle-ups'
  | 'ring-dips'
  | 'jump-rope'
  | 'strava-run'
  | 'strava-ride'
  | 'strava-swim';

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  name: string;
  duration: number; // minutes
  distance?: number; // meters
  reps?: number;
  sets?: number;
  notes?: string;
  date: string;
  points: number;
  verified: boolean;
  source: 'manual' | 'strava';
  videoUrl?: string;
}

export type AchievementCategory = 'consistencia' | 'competicao' | 'forca' | 'velocidade' | 'comunidade';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number; // 0-100
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Team {
  id: string;
  name: string;
  state: string;
  city: string;
  athletes: string[]; // user IDs
  events: string[]; // event IDs
  totalPoints: number;
  status: 'active' | 'inactive';
}

export interface AthleteResult {
  athleteId: string;
  athleteName: string;
  gender: 'M' | 'F';
  time: number; // seconds
  position?: number;
  points?: number;
  validated: boolean;
}

export interface ProvaResult {
  prova: string;
  distance: string;
  results: AthleteResult[];
}

export interface TeamResult {
  teamId: string;
  teamName: string;
  state: string;
  totalTime: number;
  totalPoints: number;
  position: number;
  status: 'classificado' | 'em-disputa' | 'desclassificado';
  provaResults: ProvaResult[];
}

export interface ScoringEvent {
  eventId: string;
  phase: EventPhase;
  teamResults: TeamResult[];
}

export interface BodyScan {
  id: string;
  userId: string;
  date: string;
  imc: number;
  fatPercentage: number;
  muscleMass: number; // kg
  hydration: number; // percentage
  boneMass: number; // kg
  metabolicAge: number;
  visceralFat: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  read: boolean;
  createdAt: string;
}

export interface WeeklyGoal {
  label: string;
  current: number;
  target: number;
  unit: string;
  percentage: number;
}
