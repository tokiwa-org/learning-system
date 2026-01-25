/**
 * List Evaluation Periods Use Case
 */

import type { EvaluationPeriod, PeriodStatus } from '@/domain/entities';
import type { EvaluationPeriodRepository } from '@/domain/ports/out';

export interface ListPeriodsInput {
  status?: PeriodStatus;
  year?: number;
  page?: number;
  limit?: number;
}

export interface ListPeriodsOutput {
  data: EvaluationPeriod[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  };
}

export class ListPeriodsUseCase {
  constructor(private readonly periodRepository: EvaluationPeriodRepository) {}

  async execute(input: ListPeriodsInput): Promise<ListPeriodsOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    const result = await this.periodRepository.findAll({
      status: input.status,
      year: input.year,
      page,
      limit,
    });

    return {
      data: result.data,
      pagination: {
        total: result.total,
        page,
        limit,
        hasNext: page * limit < result.total,
      },
    };
  }
}
