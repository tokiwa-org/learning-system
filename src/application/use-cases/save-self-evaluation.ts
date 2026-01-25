/**
 * Save Self Evaluation Use Case (draft saving)
 */

import type { UserContext } from '@/env';
import type { SelfEvaluation, SaveSelfEvaluationInput } from '@/domain/entities';
import type { EvaluationCycleRepository, SelfEvaluationRepository } from '@/domain/ports/out';
import { NotFoundError, BusinessRuleError, WorkflowError } from '@/domain/errors/app-error';
import { canTransition } from '@/domain/entities/evaluation-cycle';

export interface SaveSelfEvaluationUseCaseInput {
  cycleId: string;
  user: UserContext;
  data: SaveSelfEvaluationInput;
}

export interface SaveSelfEvaluationOutput {
  selfEvaluation: SelfEvaluation;
}

export class SaveSelfEvaluationUseCase {
  constructor(
    private readonly cycleRepository: EvaluationCycleRepository,
    private readonly selfEvaluationRepository: SelfEvaluationRepository
  ) {}

  async execute(input: SaveSelfEvaluationUseCaseInput): Promise<SaveSelfEvaluationOutput> {
    // 1. Get cycle
    const cycle = await this.cycleRepository.findById(input.cycleId);
    if (!cycle) {
      throw new NotFoundError('EvaluationCycle', input.cycleId);
    }

    // 2. Authorization: Must be the cycle's employee
    if (cycle.employeeId !== input.user.employeeId && input.user.role !== 'ADMIN') {
      throw BusinessRuleError.selfEvaluationOwnOnly();
    }

    // 3. Check if cycle is in editable state (DRAFT only for self evaluation)
    if (cycle.status !== 'DRAFT') {
      throw WorkflowError.invalidTransition(cycle.status, 'save');
    }

    // 4. Save self evaluation
    const selfEvaluation = await this.selfEvaluationRepository.save(
      input.cycleId,
      cycle.employeeId,
      input.data
    );

    return { selfEvaluation };
  }
}
