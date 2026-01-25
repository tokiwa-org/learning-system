/**
 * 同僚評価エンティティ
 */

export interface PeerEvaluation {
  id: string;
  cycleId: string;
  evaluatorId: string;    // 評価者
  evaluateeId: string;    // 被評価者
  comment?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PeerEvaluationScore {
  id: string;
  peerEvaluationId: string;
  roadmapItemId: string;
  score: number;          // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PeerEvaluationWithScores extends PeerEvaluation {
  evaluator?: {
    id: string;
    name: string;
    department?: string;
  };
  scores: PeerEvaluationScoreWithItem[];
}

export interface PeerEvaluationScoreWithItem extends PeerEvaluationScore {
  roadmapItem?: {
    id: string;
    name: string;
    category: string;
  };
}

export interface SavePeerEvaluationInput {
  comment?: string;
  scores: {
    roadmapItemId: string;
    score: number;
    comment?: string;
  }[];
}

export interface PeerAssignment {
  id: string;
  cycleId: string;
  evaluatorId: string;
  evaluateeId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
