/**
 * Generate Achievement Report Use Case
 *
 * 評価期間開始時に達成度レポートを自動生成する
 * - 社員の現時点でのスナップショット情報を取得
 * - ロードマップ達成状況を集計
 * - スコアを自動計算
 */

import type { UserContext } from '@/env';
import type {
  AchievementReport,
  AchievementReportDetail,
  GenerateReportOutput,
  AxisCode,
  AchievementStatus,
  EvaluationRank
} from '@/domain/entities';
import { SCORE_WEIGHTS, calculateRank } from '@/domain/entities/achievement-report';
import type {
  AchievementReportRepository,
  EvaluationCycleRepository,
  EmployeeRepository,
  EvaluationPeriodRepository
} from '@/domain/ports/out';
import { NotFoundError, BusinessError, AuthorizationError } from '@/domain/errors/app-error';

export interface GenerateAchievementReportInput {
  cycleId: string;
  user: UserContext;
}

export interface GenerateAchievementReportOutput extends GenerateReportOutput {}

/**
 * 達成度レポート生成ユースケース
 */
export class GenerateAchievementReportUseCase {
  constructor(
    private readonly achievementReportRepository: AchievementReportRepository,
    private readonly cycleRepository: EvaluationCycleRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly periodRepository: EvaluationPeriodRepository,
    private readonly db: D1Database
  ) {}

  async execute(input: GenerateAchievementReportInput): Promise<GenerateAchievementReportOutput> {
    // Authorization: Only SYSTEM or ADMIN can generate reports
    if (input.user.role !== 'ADMIN' && input.user.role !== 'SYSTEM') {
      throw new AuthorizationError(
        'AUTHZ_REPORT_GENERATION_DENIED',
        'レポート生成権限がありません'
      );
    }

    // Get cycle
    const cycle = await this.cycleRepository.findById(input.cycleId);
    if (!cycle) {
      throw new NotFoundError('EvaluationCycle', input.cycleId);
    }

    // Check if report already exists
    const existingReport = await this.achievementReportRepository.existsByCycleId(input.cycleId);
    if (existingReport) {
      throw new BusinessError(
        'REPORT_ALREADY_EXISTS',
        'このサイクルのレポートは既に生成されています'
      );
    }

    // Get employee with grade info
    const employee = await this.getEmployeeWithGrade(cycle.employeeId);
    if (!employee) {
      throw new NotFoundError('Employee', cycle.employeeId);
    }

    // Get salary info
    const salaryInfo = await this.getSalaryInfo(employee.id, employee.gradeId, employee.currentStep);

    // Get roadmap items for employee's grade
    const roadmapData = await this.getRoadmapAchievements(
      employee.id,
      employee.gradeId
    );

    // Calculate scores by axis
    const skillScore = this.calculateAxisScore(roadmapData.details, 'SKILL', SCORE_WEIGHTS.SKILL);
    const competencyScore = this.calculateAxisScore(roadmapData.details, 'COMPETENCY', SCORE_WEIGHTS.COMPETENCY);
    const behaviorScore = this.calculateAxisScore(roadmapData.details, 'BEHAVIOR', SCORE_WEIGHTS.BEHAVIOR);

    const totalScore = skillScore.score + competencyScore.score + behaviorScore.score;
    const suggestedRank = calculateRank(totalScore);

    // Create report
    const report = await this.achievementReportRepository.create({
      cycleId: input.cycleId,
      employeeId: employee.id,
      periodId: cycle.periodId,
      employeeGradeId: employee.gradeId,
      employeeStep: employee.currentStep,
      baseSalary: salaryInfo.baseSalary,
      gradeSalary: salaryInfo.gradeSalary,
      completionRate: roadmapData.completionRate,
      totalItems: roadmapData.totalItems,
      achievedItems: roadmapData.achievedItems,
      inProgressItems: roadmapData.inProgressItems,
      strengthsJson: JSON.stringify(roadmapData.strengths),
      improvementsJson: JSON.stringify(roadmapData.improvements),
      skillScoreCalculated: skillScore.score,
      skillItemsCount: skillScore.totalCount,
      skillAchievedCount: skillScore.achievedCount,
      competencyScoreCalculated: competencyScore.score,
      competencyItemsCount: competencyScore.totalCount,
      competencyAchievedCount: competencyScore.achievedCount,
      behaviorScoreCalculated: behaviorScore.score,
      behaviorItemsCount: behaviorScore.totalCount,
      behaviorAchievedCount: behaviorScore.achievedCount,
      totalScoreCalculated: totalScore,
      suggestedRank,
    });

    // Create report details
    const details = await this.achievementReportRepository.createDetails(
      report.id,
      roadmapData.details.map(d => ({
        roadmapItemId: d.roadmapItemId,
        roadmapItemNumber: d.itemNumber,
        axisCode: d.axisCode,
        status: d.status,
        evidence: d.evidence,
        curriculumCompletionRate: d.curriculumCompletionRate,
        scenarioScore: d.scenarioScore,
      }))
    );

    // Update cycle status to REPORT_GENERATED
    await this.cycleRepository.updateStatus(input.cycleId, 'REPORT_GENERATED');

    return { report, details };
  }

  /**
   * 社員情報と職級情報を取得
   */
  private async getEmployeeWithGrade(employeeId: string): Promise<{
    id: string;
    name: string;
    gradeId: string;
    gradeName: string;
    gradeLevel: number;
    currentStep: number;
  } | null> {
    const result = await this.db
      .prepare(`
        SELECT
          e.id, e.name, e.grade_id, e.current_step,
          g.name as grade_name, g.level as grade_level
        FROM employees e
        LEFT JOIN grades g ON e.grade_id = g.id
        WHERE e.id = ?
      `)
      .bind(employeeId)
      .first<{
        id: string;
        name: string;
        grade_id: string;
        current_step: number;
        grade_name: string;
        grade_level: number;
      }>();

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      gradeId: result.grade_id,
      gradeName: result.grade_name,
      gradeLevel: result.grade_level,
      currentStep: result.current_step,
    };
  }

  /**
   * 給与情報を取得
   */
  private async getSalaryInfo(employeeId: string, gradeId: string, step: number): Promise<{
    baseSalary: number;
    gradeSalary: number;
  }> {
    // Get current base salary
    const baseSalaryResult = await this.db
      .prepare(`
        SELECT base_salary FROM base_salary_tables
        WHERE employee_id = ?
        AND effective_from <= date('now')
        AND (effective_to IS NULL OR effective_to > date('now'))
        ORDER BY effective_from DESC
        LIMIT 1
      `)
      .bind(employeeId)
      .first<{ base_salary: number }>();

    // Get grade salary for current step
    const gradeSalaryResult = await this.db
      .prepare(`
        SELECT base_salary FROM grade_salary_tables
        WHERE grade_id = ? AND step = ?
        AND effective_from <= date('now')
        AND (effective_to IS NULL OR effective_to > date('now'))
        ORDER BY effective_from DESC
        LIMIT 1
      `)
      .bind(gradeId, step)
      .first<{ base_salary: number }>();

    return {
      baseSalary: baseSalaryResult?.base_salary ?? 0,
      gradeSalary: gradeSalaryResult?.base_salary ?? 0,
    };
  }

  /**
   * ロードマップ達成状況を取得
   */
  private async getRoadmapAchievements(employeeId: string, gradeId: string): Promise<{
    completionRate: number;
    totalItems: number;
    achievedItems: number;
    inProgressItems: number;
    strengths: string[];
    improvements: string[];
    details: RoadmapItemAchievement[];
  }> {
    // Get roadmap items required for employee's grade
    const roadmapItems = await this.db
      .prepare(`
        SELECT
          ri.id, ri.number, ri.name, ri.axis_code,
          COALESCE(ast.status, 'NOT_STARTED') as achievement_status,
          ast.evidence
        FROM roadmap_items ri
        LEFT JOIN achievement_statuses ast ON ri.id = ast.roadmap_item_id AND ast.employee_id = ?
        WHERE ri.required_for_grades LIKE '%' || ? || '%'
        ORDER BY ri.number ASC
      `)
      .bind(employeeId, gradeId)
      .all<{
        id: string;
        number: number;
        name: string;
        axis_code: string;
        achievement_status: string;
        evidence: string | null;
      }>();

    const items = roadmapItems.results ?? [];

    // Get curriculum completion rates for each item
    const curriculumRates = await this.getCurriculumCompletionRates(employeeId);

    // Get scenario scores for each item
    const scenarioScores = await this.getScenarioScores(employeeId);

    // Build details
    const details: RoadmapItemAchievement[] = items.map(item => ({
      roadmapItemId: item.id,
      itemNumber: item.number,
      itemName: item.name,
      axisCode: item.axis_code as AxisCode,
      status: item.achievement_status as AchievementStatus,
      evidence: item.evidence ?? undefined,
      curriculumCompletionRate: curriculumRates.get(item.id),
      scenarioScore: scenarioScores.get(item.id),
    }));

    // Calculate statistics
    const totalItems = details.length;
    const achievedItems = details.filter(d => d.status === 'ACHIEVED').length;
    const inProgressItems = details.filter(d => d.status === 'IN_PROGRESS').length;
    const completionRate = totalItems > 0 ? achievedItems / totalItems : 0;

    // Extract strengths and improvements
    const strengths = details
      .filter(d => d.status === 'ACHIEVED')
      .map(d => d.itemName);
    const improvements = details
      .filter(d => d.status !== 'ACHIEVED')
      .map(d => d.itemName);

    return {
      completionRate,
      totalItems,
      achievedItems,
      inProgressItems,
      strengths,
      improvements,
      details,
    };
  }

  /**
   * カリキュラム完了率を取得
   */
  private async getCurriculumCompletionRates(employeeId: string): Promise<Map<string, number>> {
    const result = await this.db
      .prepare(`
        SELECT
          ci.roadmap_item_id,
          AVG(CASE WHEN lp.status = 'COMPLETED' THEN 1.0 ELSE 0.0 END) as completion_rate
        FROM curriculum_items ci
        JOIN curriculum_assignments ca ON ci.curriculum_id = ca.curriculum_id
        LEFT JOIN learning_progress lp ON ci.id = lp.curriculum_item_id AND lp.employee_id = ?
        WHERE ca.employee_id = ?
        AND ci.roadmap_item_id IS NOT NULL
        GROUP BY ci.roadmap_item_id
      `)
      .bind(employeeId, employeeId)
      .all<{ roadmap_item_id: string; completion_rate: number }>();

    const rates = new Map<string, number>();
    for (const row of result.results ?? []) {
      rates.set(row.roadmap_item_id, row.completion_rate);
    }
    return rates;
  }

  /**
   * シナリオスコアを取得
   */
  private async getScenarioScores(employeeId: string): Promise<Map<string, number>> {
    const result = await this.db
      .prepare(`
        SELECT
          sq.roadmap_item_id,
          AVG(sr.score) as avg_score
        FROM scenario_questions sq
        JOIN scenario_responses sr ON sq.id = sr.question_id
        WHERE sr.employee_id = ?
        AND sq.roadmap_item_id IS NOT NULL
        GROUP BY sq.roadmap_item_id
      `)
      .bind(employeeId)
      .all<{ roadmap_item_id: string; avg_score: number }>();

    const scores = new Map<string, number>();
    for (const row of result.results ?? []) {
      scores.set(row.roadmap_item_id, row.avg_score);
    }
    return scores;
  }

  /**
   * 軸ごとのスコアを計算
   */
  private calculateAxisScore(
    details: RoadmapItemAchievement[],
    axisCode: AxisCode,
    maxScore: number
  ): { score: number; totalCount: number; achievedCount: number } {
    const axisItems = details.filter(d => d.axisCode === axisCode);
    const totalCount = axisItems.length;
    const achievedCount = axisItems.filter(d => d.status === 'ACHIEVED').length;

    // Score = (achieved / total) * maxScore
    const score = totalCount > 0
      ? Math.round((achievedCount / totalCount) * maxScore * 10) / 10
      : 0;

    return { score, totalCount, achievedCount };
  }
}

/**
 * ロードマップ項目達成状況
 */
interface RoadmapItemAchievement {
  roadmapItemId: string;
  itemNumber: number;
  itemName: string;
  axisCode: AxisCode;
  status: AchievementStatus;
  evidence?: string;
  curriculumCompletionRate?: number;
  scenarioScore?: number;
}

/**
 * 評価期間の全社員に対してレポートを一括生成するユースケース
 */
export class GenerateAllReportsForPeriodUseCase {
  constructor(
    private readonly generateReportUseCase: GenerateAchievementReportUseCase,
    private readonly cycleRepository: EvaluationCycleRepository,
    private readonly periodRepository: EvaluationPeriodRepository
  ) {}

  async execute(input: {
    periodId: string;
    user: UserContext;
  }): Promise<{ generated: number; failed: number; errors: string[] }> {
    // Authorization: Only ADMIN can bulk generate
    if (input.user.role !== 'ADMIN') {
      throw new AuthorizationError(
        'AUTHZ_BULK_GENERATION_DENIED',
        '一括レポート生成権限がありません'
      );
    }

    // Get period
    const period = await this.periodRepository.findById(input.periodId);
    if (!period) {
      throw new NotFoundError('EvaluationPeriod', input.periodId);
    }

    // Get all cycles for the period
    const { data: cycles } = await this.cycleRepository.findAll({
      periodId: input.periodId,
    });

    let generated = 0;
    let failed = 0;
    const errors: string[] = [];

    // Generate report for each cycle
    for (const cycle of cycles) {
      try {
        await this.generateReportUseCase.execute({
          cycleId: cycle.id,
          user: { ...input.user, role: 'SYSTEM' }, // Use SYSTEM role for generation
        });
        generated++;
      } catch (error) {
        failed++;
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`Cycle ${cycle.id}: ${message}`);
      }
    }

    return { generated, failed, errors };
  }
}
