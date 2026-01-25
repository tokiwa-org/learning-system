/**
 * 評価サイクルリポジトリ インターフェース (Outbound Port)
 */

import type {
  EvaluationCycle,
  EvaluationCycleWithRelations,
  CycleStatus,
  EvaluationRank
} from '@/domain/entities';

export interface EvaluationCycleRepository {
  findById(id: string): Promise<EvaluationCycle | null>;
  findByIdWithRelations(id: string): Promise<EvaluationCycleWithRelations | null>;
  findByPeriodAndEmployee(periodId: string, employeeId: string): Promise<EvaluationCycle | null>;
  findAll(options?: {
    periodId?: string;
    employeeId?: string;
    managerId?: string;
    status?: CycleStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: EvaluationCycle[]; total: number }>;
  findByManagerId(managerId: string, periodId?: string): Promise<EvaluationCycle[]>;
  create(input: {
    periodId: string;
    employeeId: string;
    workflowInstanceId?: string;
  }): Promise<EvaluationCycle>;
  updateStatus(id: string, status: CycleStatus): Promise<EvaluationCycle>;
  updateFinalResult(id: string, score: number, rank: EvaluationRank): Promise<EvaluationCycle>;
  setWorkflowInstanceId(id: string, workflowInstanceId: string): Promise<void>;
}
