export type Priority = 'HIGH' | 'MED' | 'LOW';

export interface Developer {
  id: string;
  name: string;
  role: string;
  skills: string[];
  load: number;
  prs: number;
  color: string;
  avatarUrl: string;
  totalHours: number;
  meetings: number;
  pto: number;
  overhead: number;
  assignedCoding: number;
  availableCoding: number;
}

export interface Ticket {
  id: string;
  title: string;
  skills: string[];
  priority: Priority;
  sp: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeId?: string;
}

export interface MatchScore {
  devId: string;
  score: number;
  skillsMatched: string[];
  skillsMissing: string[];
}
