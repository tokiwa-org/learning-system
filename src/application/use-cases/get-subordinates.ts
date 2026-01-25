/**
 * Get Subordinates Use Case (for managers)
 */

import type { UserContext } from '@/env';
import type { Employee } from '@/domain/entities';
import type { EmployeeRepository } from '@/domain/ports/out';
import { AuthorizationError } from '@/domain/errors/app-error';

export interface GetSubordinatesInput {
  user: UserContext;
}

export interface GetSubordinatesOutput {
  data: Employee[];
}

export class GetSubordinatesUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(input: GetSubordinatesInput): Promise<GetSubordinatesOutput> {
    // Authorization: Only managers can get subordinates
    if (input.user.role !== 'MANAGER' && input.user.role !== 'HR' && input.user.role !== 'ADMIN') {
      throw new AuthorizationError('AUTHZ_INSUFFICIENT_ROLE', '部下一覧へのアクセス権限がありません');
    }

    if (!input.user.employeeId) {
      return { data: [] };
    }

    const subordinates = await this.employeeRepository.findSubordinates(input.user.employeeId);

    return { data: subordinates };
  }
}
