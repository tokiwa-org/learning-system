/**
 * Get Current User Use Case
 */

import type { UserContext } from '@/env';
import type { EmployeeWithRelations } from '@/domain/entities';
import type { EmployeeRepository } from '@/domain/ports/out';
import { NotFoundError } from '@/domain/errors/app-error';

export interface GetCurrentUserInput {
  user: UserContext;
}

export interface GetCurrentUserOutput {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: {
    id: string;
    name: string;
  };
  grade?: {
    id: string;
    code: string;
    name: string;
  };
  manager?: {
    id: string;
    name: string;
  };
}

export class GetCurrentUserUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(input: GetCurrentUserInput): Promise<GetCurrentUserOutput> {
    const employee = await this.employeeRepository.findByEmail(input.user.email);

    if (!employee) {
      // Return basic info from JWT if employee not in DB
      return {
        id: input.user.id,
        email: input.user.email,
        name: input.user.email.split('@')[0],
        role: input.user.role,
      };
    }

    const employeeWithRelations = await this.employeeRepository.findByIdWithRelations(employee.id);

    if (!employeeWithRelations) {
      throw new NotFoundError('Employee', employee.id);
    }

    return {
      id: employeeWithRelations.id,
      email: employeeWithRelations.email,
      name: employeeWithRelations.name,
      role: employeeWithRelations.role,
      department: employeeWithRelations.department,
      grade: employeeWithRelations.grade,
      manager: employeeWithRelations.manager,
    };
  }
}
