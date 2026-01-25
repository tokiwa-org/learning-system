/**
 * List Evaluation Cycles Use Case
 */

import type { UserContext } from '@/env';
import type { EvaluationCycle, CycleStatus } from '@/domain/entities';
import type { EvaluationCycleRepository } from '@/domain/ports/out';

export interface ListCyclesInput {
  user: UserContext;
  periodId?: string;
  status?: CycleStatus;
  page?: number;
  limit?: number;
}

export interface ListCyclesOutput {
  data: EvaluationCycle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  };
}

export class ListCyclesUseCase {
  constructor(private readonly cycleRepository: EvaluationCycleRepository) {}

  async execute(input: ListCyclesInput): Promise<ListCyclesOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    // Build query options based on user role
    const options: Parameters<typeof this.cycleRepository.findAll>[0] = {
      periodId: input.periodId,
      status: input.status,
      page,
      limit,
    };

    // Non-admin/HR users can only see their own cycles or subordinates' cycles
    if (input.user.role === 'EMPLOYEE') {
      options.employeeId = input.user.employeeId;
    } else if (input.user.role === 'MANAGER') {
      // Manager sees subordinates' cycles
      options.managerId = input.user.employeeId;
    }
    // HR and ADMIN see all

    const result = await this.cycleRepository.findAll(options);

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
