/**
 * 社員リポジトリ インターフェース (Outbound Port)
 */

import type {
  Employee,
  EmployeeWithRelations,
  CreateEmployeeInput,
  UpdateEmployeeInput
} from '@/domain/entities';

export interface EmployeeRepository {
  findById(id: string): Promise<Employee | null>;
  findByIdWithRelations(id: string): Promise<EmployeeWithRelations | null>;
  findByEmail(email: string): Promise<Employee | null>;
  findAll(options?: {
    departmentId?: string;
    gradeId?: string;
    managerId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: Employee[]; total: number }>;
  findSubordinates(managerId: string): Promise<Employee[]>;
  create(input: CreateEmployeeInput): Promise<Employee>;
  update(id: string, input: UpdateEmployeeInput): Promise<Employee>;
  delete(id: string): Promise<void>;
}
