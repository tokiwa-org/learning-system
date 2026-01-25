/**
 * 評価期間リポジトリ インターフェース (Outbound Port)
 */

import type {
  EvaluationPeriod,
  EvaluationPeriodWithStats,
  CreatePeriodInput,
  UpdatePeriodInput,
  PeriodStatus
} from '@/domain/entities';

export interface EvaluationPeriodRepository {
  findById(id: string): Promise<EvaluationPeriod | null>;
  findByIdWithStats(id: string): Promise<EvaluationPeriodWithStats | null>;
  findAll(options?: {
    status?: PeriodStatus;
    year?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: EvaluationPeriod[]; total: number }>;
  findActive(): Promise<EvaluationPeriod | null>;
  create(input: CreatePeriodInput): Promise<EvaluationPeriod>;
  update(id: string, input: UpdatePeriodInput): Promise<EvaluationPeriod>;
  updateStatus(id: string, status: PeriodStatus): Promise<EvaluationPeriod>;
  delete(id: string): Promise<void>;
}
