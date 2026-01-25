/**
 * Submit Self Evaluation Use Case
 */

import type { UserContext, Env } from '@/env';
import type { EvaluationCycle, SelfEvaluation } from '@/domain/entities';
import type { EvaluationCycleRepository, SelfEvaluationRepository } from '@/domain/ports/out';
import {
  NotFoundError,
  AuthorizationError,
  WorkflowError,
  BusinessRuleError
} from '@/domain/errors/app-error';
import { canTransition, getNextStatus } from '@/domain/entities/evaluation-cycle';

export interface SubmitSelfEvaluationInput {
  cycleId: string;
  user: UserContext;
  comment?: string;
}

export interface SubmitSelfEvaluationOutput {
  cycle: EvaluationCycle;
  selfEvaluation: SelfEvaluation;
}

export class SubmitSelfEvaluationUseCase {
  constructor(
    private readonly cycleRepository: EvaluationCycleRepository,
    private readonly selfEvaluationRepository: SelfEvaluationRepository,
  ) {}

  async execute(input: SubmitSelfEvaluationInput, env: Env): Promise<SubmitSelfEvaluationOutput> {
    // 1. Get cycle
    const cycle = await this.cycleRepository.findById(input.cycleId);
    if (!cycle) {
      throw new NotFoundError('EvaluationCycle', input.cycleId);
    }

    // 2. Authorization: Must be the cycle's employee
    if (cycle.employeeId !== input.user.employeeId && input.user.role !== 'ADMIN') {
      throw BusinessRuleError.selfEvaluationOwnOnly();
    }

    // 3. Validate workflow transition
    if (!canTransition(cycle.status, 'submitSelfEvaluation')) {
      throw WorkflowError.invalidTransition(cycle.status, 'submitSelfEvaluation');
    }

    // 4. Get self evaluation
    const selfEvaluation = await this.selfEvaluationRepository.findByCycleId(input.cycleId);
    if (!selfEvaluation || !selfEvaluation.scores || selfEvaluation.scores.length === 0) {
      throw new WorkflowError('WORKFLOW_SELF_NOT_SUBMITTED', '自己評価が入力されていません');
    }

    // 5. Submit self evaluation
    const submittedSelfEvaluation = await this.selfEvaluationRepository.submit(
      selfEvaluation.id,
      input.comment
    );

    // 6. Update cycle status
    const nextStatus = getNextStatus(cycle.status, 'submitSelfEvaluation')!;
    const updatedCycle = await this.cycleRepository.updateStatus(cycle.id, nextStatus);

    // 7. Send event to workflow (if workflow instance exists)
    if (cycle.workflowInstanceId) {
      try {
        const workflow = await env.EVALUATION_WORKFLOW.get(cycle.workflowInstanceId);
        await workflow.sendEvent({
          type: 'self-evaluation-submitted',
          payload: {
            cycleId: cycle.id,
            employeeId: cycle.employeeId,
            submittedAt: submittedSelfEvaluation.submittedAt,
          },
        });
      } catch (error) {
        // Log but don't fail the operation
        console.error('Failed to send event to workflow:', error);
      }
    }

    return {
      cycle: updatedCycle,
      selfEvaluation: submittedSelfEvaluation,
    };
  }
}
