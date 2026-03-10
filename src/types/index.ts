export interface Phone {
  id: string;
  brand: string;
  model: string;
  photo: string;
}

export interface Expert {
  id: string;
  name: string;
  isTeacher: boolean;
}

export interface Vote {
  expertId: string;
  prioritizedPhoneIds: string[];
  timestamp: number;
}

// НОВІ ТИПИ ДЛЯ ЛАБИ 2
export interface Heuristic {
  id: string;
  description: string;
}

export interface HeuristicVote {
  expertId: string;
  heuristicIds: string[];
  timestamp: number;
}