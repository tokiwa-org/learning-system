/**
 * D1 Achievement Report Repository Implementation
 */

import type {
  AchievementReport,
  AchievementReportDetail,
  AchievementReportWithDetails,
  AxisCode,
  AchievementStatus,
  EvaluationRank
} from '@/domain/entities';
import type {
  AchievementReportRepository,
  CreateAchievementReportInput,
  CreateAchievementReportDetailInput,
  UpdateAchievementReportInput
} from '@/domain/ports/out';

export class D1AchievementReportRepository implements AchievementReportRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<AchievementReport | null> {
    const result = await this.db
      .prepare('SELECT * FROM achievement_reports WHERE id = ?')
      .bind(id)
      .first<AchievementReportRow>();

    return result ? this.mapToReport(result) : null;
  }

  async findByIdWithDetails(id: string): Promise<AchievementReportWithDetails | null> {
    const report = await this.findById(id);
    if (!report) return null;

    return this.enrichWithDetails(report);
  }

  async findByCycleId(cycleId: string): Promise<AchievementReport | null> {
    const result = await this.db
      .prepare('SELECT * FROM achievement_reports WHERE cycle_id = ?')
      .bind(cycleId)
      .first<AchievementReportRow>();

    return result ? this.mapToReport(result) : null;
  }

  async findByCycleIdWithDetails(cycleId: string): Promise<AchievementReportWithDetails | null> {
    const report = await this.findByCycleId(cycleId);
    if (!report) return null;

    return this.enrichWithDetails(report);
  }

  async findByPeriodId(periodId: string, options?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: AchievementReport[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const countResult = await this.db
      .prepare('SELECT COUNT(*) as count FROM achievement_reports WHERE period_id = ?')
      .bind(periodId)
      .first<{ count: number }>();

    const dataResult = await this.db
      .prepare(`
        SELECT * FROM achievement_reports
        WHERE period_id = ?
        ORDER BY generated_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(periodId, limit, offset)
      .all<AchievementReportRow>();

    return {
      data: (dataResult.results ?? []).map(row => this.mapToReport(row)),
      total: countResult?.count ?? 0,
    };
  }

  async findByEmployeeId(employeeId: string, options?: {
    periodId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: AchievementReport[]; total: number }> {
    const conditions: string[] = ['employee_id = ?'];
    const params: unknown[] = [employeeId];

    if (options?.periodId) {
      conditions.push('period_id = ?');
      params.push(options.periodId);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as count FROM achievement_reports ${whereClause}`)
      .bind(...params)
      .first<{ count: number }>();

    const dataResult = await this.db
      .prepare(`
        SELECT * FROM achievement_reports
        ${whereClause}
        ORDER BY generated_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(...params, limit, offset)
      .all<AchievementReportRow>();

    return {
      data: (dataResult.results ?? []).map(row => this.mapToReport(row)),
      total: countResult?.count ?? 0,
    };
  }

  async create(input: CreateAchievementReportInput): Promise<AchievementReport> {
    const id = `ar_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(`
        INSERT INTO achievement_reports (
          id, cycle_id, employee_id, period_id,
          employee_grade_id, employee_step, base_salary, grade_salary,
          completion_rate, total_items, achieved_items, in_progress_items,
          strengths_json, improvements_json,
          skill_score_calculated, skill_items_count, skill_achieved_count,
          competency_score_calculated, competency_items_count, competency_achieved_count,
          behavior_score_calculated, behavior_items_count, behavior_achieved_count,
          total_score_calculated, suggested_rank,
          generated_at, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?,
          ?, ?, ?
        )
      `)
      .bind(
        id, input.cycleId, input.employeeId, input.periodId,
        input.employeeGradeId, input.employeeStep, input.baseSalary, input.gradeSalary,
        input.completionRate, input.totalItems, input.achievedItems, input.inProgressItems,
        input.strengthsJson, input.improvementsJson,
        input.skillScoreCalculated, input.skillItemsCount, input.skillAchievedCount,
        input.competencyScoreCalculated, input.competencyItemsCount, input.competencyAchievedCount,
        input.behaviorScoreCalculated, input.behaviorItemsCount, input.behaviorAchievedCount,
        input.totalScoreCalculated, input.suggestedRank ?? null,
        now, now, now
      )
      .run();

    return this.findById(id) as Promise<AchievementReport>;
  }

  async createDetails(
    reportId: string,
    details: CreateAchievementReportDetailInput[]
  ): Promise<AchievementReportDetail[]> {
    const now = new Date().toISOString();
    const createdDetails: AchievementReportDetail[] = [];

    for (const detail of details) {
      const id = `ard_${crypto.randomUUID().slice(0, 8)}`;

      await this.db
        .prepare(`
          INSERT INTO achievement_report_details (
            id, report_id, roadmap_item_id, roadmap_item_number,
            axis_code, status, evidence,
            curriculum_completion_rate, scenario_score, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          id, reportId, detail.roadmapItemId, detail.roadmapItemNumber,
          detail.axisCode, detail.status, detail.evidence ?? null,
          detail.curriculumCompletionRate ?? null, detail.scenarioScore ?? null, now
        )
        .run();

      createdDetails.push({
        id,
        reportId,
        roadmapItemId: detail.roadmapItemId,
        roadmapItemNumber: detail.roadmapItemNumber,
        axisCode: detail.axisCode,
        status: detail.status,
        evidence: detail.evidence,
        curriculumCompletionRate: detail.curriculumCompletionRate,
        scenarioScore: detail.scenarioScore,
        createdAt: now,
      });
    }

    return createdDetails;
  }

  async update(id: string, input: UpdateAchievementReportInput): Promise<AchievementReport> {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (input.completionRate !== undefined) {
      updates.push('completion_rate = ?');
      params.push(input.completionRate);
    }
    if (input.totalItems !== undefined) {
      updates.push('total_items = ?');
      params.push(input.totalItems);
    }
    if (input.achievedItems !== undefined) {
      updates.push('achieved_items = ?');
      params.push(input.achievedItems);
    }
    if (input.inProgressItems !== undefined) {
      updates.push('in_progress_items = ?');
      params.push(input.inProgressItems);
    }
    if (input.strengthsJson !== undefined) {
      updates.push('strengths_json = ?');
      params.push(input.strengthsJson);
    }
    if (input.improvementsJson !== undefined) {
      updates.push('improvements_json = ?');
      params.push(input.improvementsJson);
    }
    if (input.skillScoreCalculated !== undefined) {
      updates.push('skill_score_calculated = ?');
      params.push(input.skillScoreCalculated);
    }
    if (input.competencyScoreCalculated !== undefined) {
      updates.push('competency_score_calculated = ?');
      params.push(input.competencyScoreCalculated);
    }
    if (input.behaviorScoreCalculated !== undefined) {
      updates.push('behavior_score_calculated = ?');
      params.push(input.behaviorScoreCalculated);
    }
    if (input.totalScoreCalculated !== undefined) {
      updates.push('total_score_calculated = ?');
      params.push(input.totalScoreCalculated);
    }
    if (input.suggestedRank !== undefined) {
      updates.push('suggested_rank = ?');
      params.push(input.suggestedRank);
    }

    if (updates.length > 0) {
      updates.push('updated_at = ?');
      params.push(new Date().toISOString());
      params.push(id);

      await this.db
        .prepare(`UPDATE achievement_reports SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...params)
        .run();
    }

    return this.findById(id) as Promise<AchievementReport>;
  }

  async delete(id: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM achievement_reports WHERE id = ?')
      .bind(id)
      .run();
  }

  async existsByCycleId(cycleId: string): Promise<boolean> {
    const result = await this.db
      .prepare('SELECT 1 FROM achievement_reports WHERE cycle_id = ? LIMIT 1')
      .bind(cycleId)
      .first();

    return result !== null;
  }

  private async enrichWithDetails(report: AchievementReport): Promise<AchievementReportWithDetails> {
    // Get details
    const detailsResult = await this.db
      .prepare(`
        SELECT ard.*, ri.name as item_name
        FROM achievement_report_details ard
        LEFT JOIN roadmap_items ri ON ard.roadmap_item_id = ri.id
        WHERE ard.report_id = ?
        ORDER BY ard.roadmap_item_number ASC
      `)
      .bind(report.id)
      .all<AchievementReportDetailRow & { item_name: string }>();

    // Get employee info
    const employee = await this.db
      .prepare('SELECT id, name, employee_code, email FROM employees WHERE id = ?')
      .bind(report.employeeId)
      .first<{ id: string; name: string; employee_code: string; email: string }>();

    // Get grade info
    const grade = await this.db
      .prepare('SELECT id, code, name, level FROM grades WHERE id = ?')
      .bind(report.employeeGradeId)
      .first<{ id: string; code: string; name: string; level: number }>();

    // Get period info
    const period = await this.db
      .prepare('SELECT id, name, start_date, end_date FROM evaluation_periods WHERE id = ?')
      .bind(report.periodId)
      .first<{ id: string; name: string; start_date: string; end_date: string }>();

    return {
      ...report,
      details: (detailsResult.results ?? []).map(row => this.mapToDetail(row, row.item_name)),
      employee: employee ? {
        id: employee.id,
        name: employee.name,
        employeeCode: employee.employee_code,
        email: employee.email,
      } : undefined,
      grade: grade ? {
        id: grade.id,
        code: grade.code,
        name: grade.name,
        level: grade.level,
      } : undefined,
      period: period ? {
        id: period.id,
        name: period.name,
        startDate: period.start_date,
        endDate: period.end_date,
      } : undefined,
    };
  }

  private mapToReport(row: AchievementReportRow): AchievementReport {
    return {
      id: row.id,
      cycleId: row.cycle_id,
      employeeId: row.employee_id,
      periodId: row.period_id,
      employeeGradeId: row.employee_grade_id,
      employeeStep: row.employee_step,
      baseSalary: row.base_salary,
      gradeSalary: row.grade_salary,
      completionRate: row.completion_rate,
      totalItems: row.total_items,
      achievedItems: row.achieved_items,
      inProgressItems: row.in_progress_items,
      strengths: row.strengths_json ? JSON.parse(row.strengths_json) : [],
      improvements: row.improvements_json ? JSON.parse(row.improvements_json) : [],
      skillScoreCalculated: row.skill_score_calculated,
      skillItemsCount: row.skill_items_count,
      skillAchievedCount: row.skill_achieved_count,
      competencyScoreCalculated: row.competency_score_calculated,
      competencyItemsCount: row.competency_items_count,
      competencyAchievedCount: row.competency_achieved_count,
      behaviorScoreCalculated: row.behavior_score_calculated,
      behaviorItemsCount: row.behavior_items_count,
      behaviorAchievedCount: row.behavior_achieved_count,
      totalScoreCalculated: row.total_score_calculated,
      suggestedRank: row.suggested_rank as EvaluationRank | undefined,
      generatedAt: row.generated_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapToDetail(row: AchievementReportDetailRow, itemName?: string): AchievementReportDetail {
    return {
      id: row.id,
      reportId: row.report_id,
      roadmapItemId: row.roadmap_item_id,
      roadmapItemNumber: row.roadmap_item_number,
      roadmapItemName: itemName,
      axisCode: row.axis_code as AxisCode,
      status: row.status as AchievementStatus,
      evidence: row.evidence ?? undefined,
      curriculumCompletionRate: row.curriculum_completion_rate ?? undefined,
      scenarioScore: row.scenario_score ?? undefined,
      createdAt: row.created_at,
    };
  }
}

interface AchievementReportRow {
  id: string;
  cycle_id: string;
  employee_id: string;
  period_id: string;
  employee_grade_id: string;
  employee_step: number;
  base_salary: number;
  grade_salary: number;
  completion_rate: number;
  total_items: number;
  achieved_items: number;
  in_progress_items: number;
  strengths_json: string | null;
  improvements_json: string | null;
  skill_score_calculated: number;
  skill_items_count: number;
  skill_achieved_count: number;
  competency_score_calculated: number;
  competency_items_count: number;
  competency_achieved_count: number;
  behavior_score_calculated: number;
  behavior_items_count: number;
  behavior_achieved_count: number;
  total_score_calculated: number;
  suggested_rank: string | null;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

interface AchievementReportDetailRow {
  id: string;
  report_id: string;
  roadmap_item_id: string;
  roadmap_item_number: number;
  axis_code: string;
  status: string;
  evidence: string | null;
  curriculum_completion_rate: number | null;
  scenario_score: number | null;
  created_at: string;
}
