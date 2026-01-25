/**
 * 社員エンティティ
 */

import type { UserRole } from '@/env';

export interface Employee {
  id: string;
  email: string;
  name: string;
  nameKana?: string;
  departmentId: string;
  gradeId: string;
  managerId?: string;
  role: UserRole;
  hireDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeWithRelations extends Employee {
  department?: {
    id: string;
    name: string;
  };
  grade?: {
    id: string;
    code: string;
    name: string;
    level: number;
  };
  manager?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateEmployeeInput {
  email: string;
  name: string;
  nameKana?: string;
  departmentId: string;
  gradeId: string;
  managerId?: string;
  role: UserRole;
  hireDate: string;
}

export interface UpdateEmployeeInput {
  name?: string;
  nameKana?: string;
  departmentId?: string;
  gradeId?: string;
  managerId?: string;
  role?: UserRole;
  isActive?: boolean;
}
