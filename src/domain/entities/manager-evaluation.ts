/**
 * 上司評価エンティティ
 */

import type { EvaluationRank } from './evaluation-cycle';

export interface ManagerEvaluation {
  id: string;
  cycleId: string;
  managerId: string;
  employeeId: string;
  finalScore?: number;
  finalRank?: EvaluationRank;
  overallComment?: string;
  strengthsComment?: string;
  improvementComment?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManagerEvaluationScore {
  id: string;
  managerEvaluationId: string;
  roadmapItemId: string;
  score: number;          // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManagerEvaluationWithScores extends ManagerEvaluation {
  scores: ManagerEvaluationScoreWithItem[];
}

export interface ManagerEvaluationScoreWithItem extends ManagerEvaluationScore {
  roadmapItem?: {
    id: string;
    name: string;
    category: string;
  };
  selfScore?: number;
  peerAverageScore?: number;
}

export interface SaveManagerEvaluationInput {
  overallComment?: string;
  strengthsComment?: string;
  improvementComment?: string;
  scores: {
    roadmapItemId: string;
    score: number;
    comment?: string;
  }[];
}

export interface SubmitManagerEvaluationInput {
  finalScore: number;
  finalRank: EvaluationRank;
  overallComment?: string;
}
