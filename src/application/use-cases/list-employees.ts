/**
 * List Employees Use Case
 */

import type { UserContext } from '@/env';
import type { Employee } from '@/domain/entities';
import type { EmployeeRepository } from '@/domain/ports/out';
import { AuthorizationError } from '@/domain/errors/app-error';

export interface ListEmployeesInput {
  user: UserContext;
  departmentId?: string;
  gradeId?: string;
  managerId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ListEmployeesOutput {
  data: Employee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  };
}

export class ListEmployeesUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(input: ListEmployeesInput): Promise<ListEmployeesOutput> {
    // Authorization: Only HR and Admin can list all employees
    // Managers can only list their subordinates
    if (input.user.role === 'EMPLOYEE') {
      throw new AuthorizationError('AUTHZ_INSUFFICIENT_ROLE', '従業員一覧へのアクセス権限がありません');
    }

    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    // Build query options based on user role
    const options: Parameters<typeof this.employeeRepository.findAll>[0] = {
      departmentId: input.departmentId,
      gradeId: input.gradeId,
      isActive: input.isActive,
      page,
      limit,
    };

    // Managers can only see their subordinates
    if (input.user.role === 'MANAGER') {
      options.managerId = input.user.employeeId;
    } else if (input.managerId) {
      options.managerId = input.managerId;
    }

    const result = await this.employeeRepository.findAll(options);

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
