/**
 * 評価期間エンティティ
 */

export type PeriodStatus = 'PREPARING' | 'ACTIVE' | 'CLOSED';

export interface EvaluationPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  evaluationMonth: number;
  status: PeriodStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationPeriodWithStats extends EvaluationPeriod {
  cycleStats?: {
    total: number;
    byStatus: Record<string, number>;
  };
}

export interface CreatePeriodInput {
  name: string;
  startDate: string;
  endDate: string;
  evaluationMonth: number;
}

export interface UpdatePeriodInput {
  name?: string;
  startDate?: string;
  endDate?: string;
  evaluationMonth?: number;
}
