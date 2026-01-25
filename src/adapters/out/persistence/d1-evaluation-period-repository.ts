/**
 * D1 Evaluation Period Repository Implementation
 */

import type {
  EvaluationPeriod,
  EvaluationPeriodWithStats,
  CreatePeriodInput,
  UpdatePeriodInput,
  PeriodStatus
} from '@/domain/entities';
import type { EvaluationPeriodRepository } from '@/domain/ports/out';

export class D1EvaluationPeriodRepository implements EvaluationPeriodRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<EvaluationPeriod | null> {
    const result = await this.db
      .prepare('SELECT * FROM evaluation_periods WHERE id = ?')
      .bind(id)
      .first<EvaluationPeriodRow>();

    return result ? this.mapToPeriod(result) : null;
  }

  async findByIdWithStats(id: string): Promise<EvaluationPeriodWithStats | null> {
    const period = await this.findById(id);
    if (!period) return null;

    const statsResult = await this.db
      .prepare(`
        SELECT
          status,
          COUNT(*) as count
        FROM evaluation_cycles
        WHERE period_id = ?
        GROUP BY status
      `)
      .bind(id)
      .all<{ status: string; count: number }>();

    const byStatus: Record<string, number> = {};
    let total = 0;

    for (const row of statsResult.results ?? []) {
      byStatus[row.status] = row.count;
      total += row.count;
    }

    return {
      ...period,
      cycleStats: { total, byStatus },
    };
  }

  async findAll(options?: {
    status?: PeriodStatus;
    year?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: EvaluationPeriod[]; total: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (options?.status) {
      conditions.push('status = ?');
      params.push(options.status);
    }
    if (options?.year) {
      conditions.push("strftime('%Y', start_date) = ?");
      params.push(String(options.year));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as count FROM evaluation_periods ${whereClause}`)
      .bind(...params)
      .first<{ count: number }>();

    const dataResult = await this.db
      .prepare(`
        SELECT * FROM evaluation_periods ${whereClause}
        ORDER BY start_date DESC
        LIMIT ? OFFSET ?
      `)
      .bind(...params, limit, offset)
      .all<EvaluationPeriodRow>();

    return {
      data: (dataResult.results ?? []).map(row => this.mapToPeriod(row)),
      total: countResult?.count ?? 0,
    };
  }

  async findActive(): Promise<EvaluationPeriod | null> {
    const result = await this.db
      .prepare("SELECT * FROM evaluation_periods WHERE status = 'ACTIVE' LIMIT 1")
      .first<EvaluationPeriodRow>();

    return result ? this.mapToPeriod(result) : null;
  }

  async create(input: CreatePeriodInput): Promise<EvaluationPeriod> {
    const id = `period_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(`
        INSERT INTO evaluation_periods (id, name, start_date, end_date, evaluation_month, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'PREPARING', ?, ?)
      `)
      .bind(
        id,
        input.name,
        input.startDate,
        input.endDate,
        input.evaluationMonth,
        now,
        now
      )
      .run();

    return this.findById(id) as Promise<EvaluationPeriod>;
  }

  async update(id: string, input: UpdatePeriodInput): Promise<EvaluationPeriod> {
    const sets: string[] = [];
    const params: unknown[] = [];

    if (input.name !== undefined) {
      sets.push('name = ?');
      params.push(input.name);
    }
    if (input.startDate !== undefined) {
      sets.push('start_date = ?');
      params.push(input.startDate);
    }
    if (input.endDate !== undefined) {
      sets.push('end_date = ?');
      params.push(input.endDate);
    }
    if (input.evaluationMonth !== undefined) {
      sets.push('evaluation_month = ?');
      params.push(input.evaluationMonth);
    }

    sets.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    await this.db
      .prepare(`UPDATE evaluation_periods SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    return this.findById(id) as Promise<EvaluationPeriod>;
  }

  async updateStatus(id: string, status: PeriodStatus): Promise<EvaluationPeriod> {
    const now = new Date().toISOString();

    await this.db
      .prepare('UPDATE evaluation_periods SET status = ?, updated_at = ? WHERE id = ?')
      .bind(status, now, id)
      .run();

    return this.findById(id) as Promise<EvaluationPeriod>;
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM evaluation_periods WHERE id = ?').bind(id).run();
  }

  private mapToPeriod(row: EvaluationPeriodRow): EvaluationPeriod {
    return {
      id: row.id,
      name: row.name,
      startDate: row.start_date,
      endDate: row.end_date,
      evaluationMonth: row.evaluation_month,
      status: row.status as PeriodStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface EvaluationPeriodRow {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  evaluation_month: number;
  status: string;
  created_at: string;
  updated_at: string;
}
