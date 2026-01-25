/**
 * D1 Employee Repository Implementation
 */

import type {
  Employee,
  EmployeeWithRelations,
  CreateEmployeeInput,
  UpdateEmployeeInput
} from '@/domain/entities';
import type { EmployeeRepository } from '@/domain/ports/out';

export class D1EmployeeRepository implements EmployeeRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<Employee | null> {
    const result = await this.db
      .prepare('SELECT * FROM employees WHERE id = ?')
      .bind(id)
      .first<Employee>();

    return result ?? null;
  }

  async findByIdWithRelations(id: string): Promise<EmployeeWithRelations | null> {
    const result = await this.db
      .prepare(`
        SELECT
          e.*,
          d.id as dept_id, d.name as dept_name,
          g.id as grade_id, g.code as grade_code, g.name as grade_name, g.level as grade_level,
          m.id as manager_id, m.name as manager_name, m.email as manager_email
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN grades g ON e.grade_id = g.id
        LEFT JOIN employees m ON e.manager_id = m.id
        WHERE e.id = ?
      `)
      .bind(id)
      .first();

    if (!result) return null;

    return this.mapToEmployeeWithRelations(result);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const result = await this.db
      .prepare('SELECT * FROM employees WHERE email = ?')
      .bind(email)
      .first<Employee>();

    return result ?? null;
  }

  async findAll(options?: {
    departmentId?: string;
    gradeId?: string;
    managerId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: Employee[]; total: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (options?.departmentId) {
      conditions.push('department_id = ?');
      params.push(options.departmentId);
    }
    if (options?.gradeId) {
      conditions.push('grade_id = ?');
      params.push(options.gradeId);
    }
    if (options?.managerId) {
      conditions.push('manager_id = ?');
      params.push(options.managerId);
    }
    if (options?.isActive !== undefined) {
      conditions.push('is_active = ?');
      params.push(options.isActive ? 1 : 0);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as count FROM employees ${whereClause}`)
      .bind(...params)
      .first<{ count: number }>();

    // Get paginated data
    const dataResult = await this.db
      .prepare(`SELECT * FROM employees ${whereClause} ORDER BY name LIMIT ? OFFSET ?`)
      .bind(...params, limit, offset)
      .all<Employee>();

    return {
      data: dataResult.results ?? [],
      total: countResult?.count ?? 0,
    };
  }

  async findSubordinates(managerId: string): Promise<Employee[]> {
    const result = await this.db
      .prepare('SELECT * FROM employees WHERE manager_id = ? AND is_active = 1')
      .bind(managerId)
      .all<Employee>();

    return result.results ?? [];
  }

  async create(input: CreateEmployeeInput): Promise<Employee> {
    const id = `emp_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(`
        INSERT INTO employees (id, email, name, name_kana, department_id, grade_id, manager_id, role, hire_date, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `)
      .bind(
        id,
        input.email,
        input.name,
        input.nameKana ?? null,
        input.departmentId,
        input.gradeId,
        input.managerId ?? null,
        input.role,
        input.hireDate,
        now,
        now
      )
      .run();

    return this.findById(id) as Promise<Employee>;
  }

  async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const sets: string[] = [];
    const params: unknown[] = [];

    if (input.name !== undefined) {
      sets.push('name = ?');
      params.push(input.name);
    }
    if (input.nameKana !== undefined) {
      sets.push('name_kana = ?');
      params.push(input.nameKana);
    }
    if (input.departmentId !== undefined) {
      sets.push('department_id = ?');
      params.push(input.departmentId);
    }
    if (input.gradeId !== undefined) {
      sets.push('grade_id = ?');
      params.push(input.gradeId);
    }
    if (input.managerId !== undefined) {
      sets.push('manager_id = ?');
      params.push(input.managerId);
    }
    if (input.role !== undefined) {
      sets.push('role = ?');
      params.push(input.role);
    }
    if (input.isActive !== undefined) {
      sets.push('is_active = ?');
      params.push(input.isActive ? 1 : 0);
    }

    sets.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    await this.db
      .prepare(`UPDATE employees SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    return this.findById(id) as Promise<Employee>;
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM employees WHERE id = ?').bind(id).run();
  }

  private mapToEmployeeWithRelations(row: any): EmployeeWithRelations {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      nameKana: row.name_kana,
      departmentId: row.department_id,
      gradeId: row.grade_id,
      managerId: row.manager_id,
      role: row.role,
      hireDate: row.hire_date,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      department: row.dept_id ? {
        id: row.dept_id,
        name: row.dept_name,
      } : undefined,
      grade: row.grade_id ? {
        id: row.grade_id,
        code: row.grade_code,
        name: row.grade_name,
        level: row.grade_level,
      } : undefined,
      manager: row.manager_id ? {
        id: row.manager_id,
        name: row.manager_name,
        email: row.manager_email,
      } : undefined,
    };
  }
}
