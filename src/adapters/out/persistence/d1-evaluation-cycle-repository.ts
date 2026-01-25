/**
 * D1 Evaluation Cycle Repository Implementation
 */

import type {
  EvaluationCycle,
  EvaluationCycleWithRelations,
  CycleStatus,
  EvaluationRank
} from '@/domain/entities';
import type { EvaluationCycleRepository } from '@/domain/ports/out';

export class D1EvaluationCycleRepository implements EvaluationCycleRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<EvaluationCycle | null> {
    const result = await this.db
      .prepare('SELECT * FROM evaluation_cycles WHERE id = ?')
      .bind(id)
      .first<EvaluationCycleRow>();

    return result ? this.mapToCycle(result) : null;
  }

  async findByIdWithRelations(id: string): Promise<EvaluationCycleWithRelations | null> {
    const result = await this.db
      .prepare(`
        SELECT
          c.*,
          p.id as period_id, p.name as period_name, p.start_date as period_start, p.end_date as period_end,
          e.id as emp_id, e.name as emp_name, e.department_id as emp_dept, e.grade_id as emp_grade
        FROM evaluation_cycles c
        LEFT JOIN evaluation_periods p ON c.period_id = p.id
        LEFT JOIN employees e ON c.employee_id = e.id
        WHERE c.id = ?
      `)
      .bind(id)
      .first<EvaluationCycleJoinRow>();

    if (!result) return null;

    // Get self evaluation summary
    const selfEval = await this.db
      .prepare(`
        SELECT se.id, se.submitted_at, se.comment, COUNT(ses.id) as score_count
        FROM self_evaluations se
        LEFT JOIN self_evaluation_scores ses ON se.id = ses.self_evaluation_id
        WHERE se.cycle_id = ?
        GROUP BY se.id
      `)
      .bind(id)
      .first<{ id: string; submitted_at: string | null; comment: string | null; score_count: number }>();

    // Get peer evaluation summaries
    const peerEvals = await this.db
      .prepare(`
        SELECT pe.id, pe.evaluator_id, e.name as evaluator_name, pe.submitted_at
        FROM peer_evaluations pe
        LEFT JOIN employees e ON pe.evaluator_id = e.id
        WHERE pe.cycle_id = ?
      `)
      .bind(id)
      .all<{ id: string; evaluator_id: string; evaluator_name: string; submitted_at: string | null }>();

    // Get manager evaluation summary
    const managerEval = await this.db
      .prepare(`
        SELECT id, submitted_at, final_score, overall_comment
        FROM manager_evaluations
        WHERE cycle_id = ?
      `)
      .bind(id)
      .first<{ id: string; submitted_at: string | null; final_score: number | null; overall_comment: string | null }>();

    // Get approval history
    const approvalHistory = await this.db
      .prepare(`
        SELECT ah.id, ah.action, ah.actor_id, e.name as actor_name, e.role as actor_role, ah.comment, ah.created_at
        FROM approval_history ah
        LEFT JOIN employees e ON ah.actor_id = e.id
        WHERE ah.cycle_id = ?
        ORDER BY ah.created_at ASC
      `)
      .bind(id)
      .all<{
        id: string;
        action: string;
        actor_id: string;
        actor_name: string;
        actor_role: string;
        comment: string | null;
        created_at: string;
      }>();

    return {
      ...this.mapToCycle(result),
      period: result.period_id ? {
        id: result.period_id,
        name: result.period_name,
        startDate: result.period_start,
        endDate: result.period_end,
      } : undefined,
      employee: result.emp_id ? {
        id: result.emp_id,
        name: result.emp_name,
        departmentId: result.emp_dept,
        gradeId: result.emp_grade,
      } : undefined,
      selfEvaluation: selfEval ? {
        id: selfEval.id,
        submittedAt: selfEval.submitted_at ?? undefined,
        comment: selfEval.comment ?? undefined,
        scoreCount: selfEval.score_count,
      } : undefined,
      peerEvaluations: (peerEvals.results ?? []).map(pe => ({
        id: pe.id,
        evaluatorId: pe.evaluator_id,
        evaluatorName: pe.evaluator_name,
        submittedAt: pe.submitted_at ?? undefined,
      })),
      managerEvaluation: managerEval ? {
        id: managerEval.id,
        submittedAt: managerEval.submitted_at ?? undefined,
        finalScore: managerEval.final_score ?? undefined,
        comment: managerEval.overall_comment ?? undefined,
      } : undefined,
      approvalHistory: (approvalHistory.results ?? []).map(ah => ({
        id: ah.id,
        action: ah.action as 'APPROVE' | 'REJECT',
        actorId: ah.actor_id,
        actorName: ah.actor_name,
        actorRole: ah.actor_role,
        comment: ah.comment ?? undefined,
        createdAt: ah.created_at,
      })),
    };
  }

  async findByPeriodAndEmployee(periodId: string, employeeId: string): Promise<EvaluationCycle | null> {
    const result = await this.db
      .prepare('SELECT * FROM evaluation_cycles WHERE period_id = ? AND employee_id = ?')
      .bind(periodId, employeeId)
      .first<EvaluationCycleRow>();

    return result ? this.mapToCycle(result) : null;
  }

  async findAll(options?: {
    periodId?: string;
    employeeId?: string;
    managerId?: string;
    status?: CycleStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: EvaluationCycle[]; total: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (options?.periodId) {
      conditions.push('c.period_id = ?');
      params.push(options.periodId);
    }
    if (options?.employeeId) {
      conditions.push('c.employee_id = ?');
      params.push(options.employeeId);
    }
    if (options?.managerId) {
      conditions.push('e.manager_id = ?');
      params.push(options.managerId);
    }
    if (options?.status) {
      conditions.push('c.status = ?');
      params.push(options.status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const countResult = await this.db
      .prepare(`
        SELECT COUNT(*) as count
        FROM evaluation_cycles c
        LEFT JOIN employees e ON c.employee_id = e.id
        ${whereClause}
      `)
      .bind(...params)
      .first<{ count: number }>();

    const dataResult = await this.db
      .prepare(`
        SELECT c.*
        FROM evaluation_cycles c
        LEFT JOIN employees e ON c.employee_id = e.id
        ${whereClause}
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(...params, limit, offset)
      .all<EvaluationCycleRow>();

    return {
      data: (dataResult.results ?? []).map(row => this.mapToCycle(row)),
      total: countResult?.count ?? 0,
    };
  }

  async findByManagerId(managerId: string, periodId?: string): Promise<EvaluationCycle[]> {
    let query = `
      SELECT c.* FROM evaluation_cycles c
      INNER JOIN employees e ON c.employee_id = e.id
      WHERE e.manager_id = ?
    `;
    const params: unknown[] = [managerId];

    if (periodId) {
      query += ' AND c.period_id = ?';
      params.push(periodId);
    }

    const result = await this.db
      .prepare(query)
      .bind(...params)
      .all<EvaluationCycleRow>();

    return (result.results ?? []).map(row => this.mapToCycle(row));
  }

  async create(input: {
    periodId: string;
    employeeId: string;
    workflowInstanceId?: string;
  }): Promise<EvaluationCycle> {
    const id = `cycle_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(`
        INSERT INTO evaluation_cycles (id, period_id, employee_id, status, workflow_instance_id, created_at, updated_at)
        VALUES (?, ?, ?, 'DRAFT', ?, ?, ?)
      `)
      .bind(
        id,
        input.periodId,
        input.employeeId,
        input.workflowInstanceId ?? null,
        now,
        now
      )
      .run();

    return this.findById(id) as Promise<EvaluationCycle>;
  }

  async updateStatus(id: string, status: CycleStatus): Promise<EvaluationCycle> {
    const now = new Date().toISOString();

    await this.db
      .prepare('UPDATE evaluation_cycles SET status = ?, updated_at = ? WHERE id = ?')
      .bind(status, now, id)
      .run();

    return this.findById(id) as Promise<EvaluationCycle>;
  }

  async updateFinalResult(id: string, score: number, rank: EvaluationRank): Promise<EvaluationCycle> {
    const now = new Date().toISOString();

    await this.db
      .prepare('UPDATE evaluation_cycles SET final_score = ?, final_rank = ?, updated_at = ? WHERE id = ?')
      .bind(score, rank, now, id)
      .run();

    return this.findById(id) as Promise<EvaluationCycle>;
  }

  async setWorkflowInstanceId(id: string, workflowInstanceId: string): Promise<void> {
    const now = new Date().toISOString();

    await this.db
      .prepare('UPDATE evaluation_cycles SET workflow_instance_id = ?, updated_at = ? WHERE id = ?')
      .bind(workflowInstanceId, now, id)
      .run();
  }

  private mapToCycle(row: EvaluationCycleRow): EvaluationCycle {
    return {
      id: row.id,
      periodId: row.period_id,
      employeeId: row.employee_id,
      status: row.status as CycleStatus,
      currentStep: row.current_step ?? undefined,
      workflowInstanceId: row.workflow_instance_id ?? undefined,
      finalScore: row.final_score ?? undefined,
      finalRank: row.final_rank as EvaluationRank | undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface EvaluationCycleRow {
  id: string;
  period_id: string;
  employee_id: string;
  status: string;
  current_step: string | null;
  workflow_instance_id: string | null;
  final_score: number | null;
  final_rank: string | null;
  created_at: string;
  updated_at: string;
}

interface EvaluationCycleJoinRow extends EvaluationCycleRow {
  period_id: string;
  period_name: string;
  period_start: string;
  period_end: string;
  emp_id: string;
  emp_name: string;
  emp_dept: string;
  emp_grade: string;
}
