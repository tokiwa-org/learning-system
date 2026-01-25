/**
 * Get Self Evaluation Use Case
 */

import type { UserContext } from '@/env';
import type { SelfEvaluationWithScores } from '@/domain/entities';
import type { EvaluationCycleRepository, SelfEvaluationRepository } from '@/domain/ports/out';
import { NotFoundError, AuthorizationError, BusinessRuleError } from '@/domain/errors/app-error';

export interface GetSelfEvaluationInput {
  cycleId: string;
  user: UserContext;
}

export interface GetSelfEvaluationOutput extends SelfEvaluationWithScores {}

export class GetSelfEvaluationUseCase {
  constructor(
    private readonly cycleRepository: EvaluationCycleRepository,
    private readonly selfEvaluationRepository: SelfEvaluationRepository
  ) {}

  async execute(input: GetSelfEvaluationInput): Promise<GetSelfEvaluationOutput | null> {
    // Get cycle first for authorization
    const cycle = await this.cycleRepository.findById(input.cycleId);
    if (!cycle) {
      throw new NotFoundError('EvaluationCycle', input.cycleId);
    }

    // Authorization: Only cycle owner, their manager, HR, or Admin can view
    if (!this.canAccess(cycle.employeeId, input.user)) {
      throw new AuthorizationError('AUTHZ_SELF_EVAL_ACCESS_DENIED', 'この自己評価へのアクセス権限がありません');
    }

    const selfEvaluation = await this.selfEvaluationRepository.findByCycleId(input.cycleId);
    return selfEvaluation;
  }

  private canAccess(cycleEmployeeId: string, user: UserContext): boolean {
    if (user.role === 'ADMIN' || user.role === 'HR') {
      return true;
    }
    if (cycleEmployeeId === user.employeeId) {
      return true;
    }
    // Manager access would need additional logic
    return user.role === 'MANAGER';
  }
}
