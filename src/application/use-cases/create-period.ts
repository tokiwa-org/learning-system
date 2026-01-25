/**
 * Create Evaluation Period Use Case
 */

import type { EvaluationPeriod, CreatePeriodInput } from '@/domain/entities';
import type { EvaluationPeriodRepository } from '@/domain/ports/out';
import { ValidationError } from '@/domain/errors/app-error';

export interface CreatePeriodOutput extends EvaluationPeriod {}

export class CreatePeriodUseCase {
  constructor(private readonly periodRepository: EvaluationPeriodRepository) {}

  async execute(input: CreatePeriodInput): Promise<CreatePeriodOutput> {
    // Validate dates
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (endDate <= startDate) {
      throw ValidationError.invalidDateRange();
    }

    if (input.evaluationMonth < 1 || input.evaluationMonth > 12) {
      throw new ValidationError('評価月は1-12の範囲で指定してください', [
        { field: 'evaluationMonth', message: '評価月は1-12の範囲で指定してください' }
      ]);
    }

    const period = await this.periodRepository.create(input);
    return period;
  }
}
