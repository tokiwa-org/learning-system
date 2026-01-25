/**
 * Get Employee Use Case
 */

import type { UserContext } from '@/env';
import type { EmployeeWithRelations } from '@/domain/entities';
import type { EmployeeRepository } from '@/domain/ports/out';
import { NotFoundError, AuthorizationError } from '@/domain/errors/app-error';

export interface GetEmployeeInput {
  employeeId: string;
  user: UserContext;
}

export interface GetEmployeeOutput extends EmployeeWithRelations {}

export class GetEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(input: GetEmployeeInput): Promise<GetEmployeeOutput> {
    const employee = await this.employeeRepository.findByIdWithRelations(input.employeeId);

    if (!employee) {
      throw new NotFoundError('Employee', input.employeeId);
    }

    // Authorization check
    if (!this.canAccess(employee, input.user)) {
      throw new AuthorizationError('AUTHZ_EMPLOYEE_ACCESS_DENIED', 'この従業員情報へのアクセス権限がありません');
    }

    return employee;
  }

  private canAccess(employee: EmployeeWithRelations, user: UserContext): boolean {
    // Admin and HR can access all
    if (user.role === 'ADMIN' || user.role === 'HR') {
      return true;
    }

    // Employee can access their own info
    if (employee.id === user.employeeId) {
      return true;
    }

    // Manager can access subordinates
    if (user.role === 'MANAGER' && employee.managerId === user.employeeId) {
      return true;
    }

    return false;
  }
}
