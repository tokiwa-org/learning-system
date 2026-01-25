/**
 * 自己評価リポジトリ インターフェース (Outbound Port)
 */

import type {
  SelfEvaluation,
  SelfEvaluationWithScores,
  SaveSelfEvaluationInput
} from '@/domain/entities';

export interface SelfEvaluationRepository {
  findById(id: string): Promise<SelfEvaluation | null>;
  findByCycleId(cycleId: string): Promise<SelfEvaluationWithScores | null>;
  save(cycleId: string, employeeId: string, input: SaveSelfEvaluationInput): Promise<SelfEvaluation>;
  submit(id: string, comment?: string): Promise<SelfEvaluation>;
}
