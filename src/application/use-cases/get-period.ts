/**
 * Get Evaluation Period Use Case
 */

import type { EvaluationPeriodWithStats } from '@/domain/entities';
import type { EvaluationPeriodRepository } from '@/domain/ports/out';
import { NotFoundError } from '@/domain/errors/app-error';

export interface GetPeriodInput {
  periodId: string;
}

export interface GetPeriodOutput extends EvaluationPeriodWithStats {}

export class GetPeriodUseCase {
  constructor(private readonly periodRepository: EvaluationPeriodRepository) {}

  async execute(input: GetPeriodInput): Promise<GetPeriodOutput> {
    const period = await this.periodRepository.findByIdWithStats(input.periodId);

    if (!period) {
      throw new NotFoundError('EvaluationPeriod', input.periodId);
    }

    return period;
  }
}
