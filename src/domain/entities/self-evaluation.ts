/**
 * 自己評価エンティティ
 */

export interface SelfEvaluation {
  id: string;
  cycleId: string;
  employeeId: string;
  comment?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelfEvaluationScore {
  id: string;
  selfEvaluationId: string;
  roadmapItemId: string;
  score: number;         // 1-5
  evidence?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelfEvaluationWithScores extends SelfEvaluation {
  scores: SelfEvaluationScoreWithItem[];
}

export interface SelfEvaluationScoreWithItem extends SelfEvaluationScore {
  roadmapItem?: {
    id: string;
    name: string;
    category: string;
    description?: string;
  };
}

export interface SaveSelfEvaluationInput {
  comment?: string;
  scores: {
    roadmapItemId: string;
    score: number;
    evidence?: string;
  }[];
}

export interface SubmitSelfEvaluationInput {
  comment?: string;
}
