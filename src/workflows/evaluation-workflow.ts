/**
 * 評価サイクルワークフロー v2.0
 *
 * Cloudflare Workflowsを使用した評価サイクルの状態管理。
 * 評価期間開始時に達成度レポートを自動生成し、上司評価→承認→確定の流れで処理。
 *
 * 新ワークフロー（自己評価・同僚評価廃止）:
 *   REPORT_GENERATED → MANAGER_EVALUATED → MANAGER_APPROVED → HR_APPROVED → FINALIZED
 *                   ↓ (差戻し)
 *               REJECTED → MANAGER_EVALUATED (再提出)
 */

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import {
  SCORE_WEIGHTS,
  SALARY_INCREMENT_RATES,
  calculateRank
} from '@/domain/entities/achievement-report';

// ============================================
// 型定義
// ============================================

export interface EvaluationWorkflowParams {
  cycleId: string;
  periodId: string;
  employeeId: string;
  managerId: string;
}

export interface EvaluationWorkflowResult {
  status: 'FINALIZED' | 'REJECTED' | 'TIMEOUT' | 'CANCELLED';
  cycleId: string;
  finalScore?: number;
  finalRank?: string;
  salaryIncrementRate?: number;
  rejectedAt?: string;
  rejectedBy?: string;
  completedAt: string;
}

// イベントペイロード型
export interface ManagerEvaluationSubmittedEvent {
  submittedAt: string;
  skillScoreAdjusted?: number;
  competencyScoreAdjusted?: number;
  behaviorScoreAdjusted?: number;
  totalScoreAdjusted?: number;
  rankSuggestion: string;
  adjustmentReason?: string;
}

export interface ApprovalEvent {
  action: 'APPROVE' | 'REJECT';
  actorId: string;
  comment?: string;
}

// データ型
interface Cycle {
  id: string;
  period_id: string;
  employee_id: string;
  status: string;
  current_step: string | null;
  workflow_instance_id: string | null;
  final_score: number | null;
  final_rank: string | null;
  salary_increment_rate: number | null;
  created_at: string;
  updated_at: string;
}

interface AchievementReportRow {
  id: string;
  cycle_id: string;
  employee_id: string;
  total_score_calculated: number;
  suggested_rank: string | null;
  skill_score_calculated: number;
  competency_score_calculated: number;
  behavior_score_calculated: number;
}

interface ManagerEvaluationRow {
  id: string;
  cycle_id: string;
  skill_score: number;
  competency_score: number;
  behavior_score: number;
  total_score: number;
  skill_score_adjusted: number | null;
  competency_score_adjusted: number | null;
  behavior_score_adjusted: number | null;
  total_score_adjusted: number | null;
  rank_suggestion: string;
}

// 環境変数型
export interface Env {
  DB: D1Database;
  EVALUATION_WORKFLOW: Workflow;
  NOTIFICATION_QUEUE: Queue;
}

// ============================================
// ワークフロー実装
// ============================================

export class EvaluationWorkflow extends WorkflowEntrypoint<Env, EvaluationWorkflowParams> {
  async run(event: WorkflowEvent<EvaluationWorkflowParams>, step: WorkflowStep): Promise<EvaluationWorkflowResult> {
    const { cycleId, periodId, employeeId, managerId } = event.payload;

    // ============================================
    // Step 0: 初期化
    // ============================================
    await step.do('initialize-workflow', async () => {
      await this.createWorkflowInstance(cycleId, event.instanceId);
    });

    // ============================================
    // Step 1: 達成度レポート自動生成
    // ============================================
    await this.generateAchievementReport(cycleId, periodId, employeeId, step);

    // ============================================
    // Step 2: 上司評価待ち
    // ============================================
    await this.waitForManagerEvaluation(cycleId, managerId, step);

    // ============================================
    // Step 3: 上司承認待ち（差戻しループあり）
    // ============================================
    const managerApprovalResult = await this.waitForManagerApproval(cycleId, managerId, step);
    if (managerApprovalResult.rejected) {
      return {
        status: 'REJECTED',
        cycleId,
        rejectedAt: 'MANAGER_APPROVAL',
        rejectedBy: managerApprovalResult.actorId,
        completedAt: new Date().toISOString(),
      };
    }

    // ============================================
    // Step 4: HR承認待ち
    // ============================================
    const hrApprovalResult = await this.waitForHRApproval(cycleId, managerId, step);
    if (hrApprovalResult.rejected) {
      return {
        status: 'REJECTED',
        cycleId,
        rejectedAt: 'HR_APPROVAL',
        rejectedBy: hrApprovalResult.actorId,
        completedAt: new Date().toISOString(),
      };
    }

    // ============================================
    // Step 5: 確定処理
    // ============================================
    const finalResult = await this.finalize(cycleId, step);

    return {
      status: 'FINALIZED',
      cycleId,
      finalScore: finalResult.finalScore,
      finalRank: finalResult.finalRank,
      salaryIncrementRate: finalResult.salaryIncrementRate,
      completedAt: new Date().toISOString(),
    };
  }

  // ============================================
  // Step 1: 達成度レポート自動生成
  // ============================================
  private async generateAchievementReport(
    cycleId: string,
    periodId: string,
    employeeId: string,
    step: WorkflowStep
  ): Promise<void> {
    await step.do('generate-achievement-report', async () => {
      // 社員の現在の情報を取得
      const employeeInfo = await this.getEmployeeInfo(employeeId);
      if (!employeeInfo) {
        throw new Error(`Employee not found: ${employeeId}`);
      }

      // 給与情報を取得
      const salaryInfo = await this.getSalaryInfo(employeeId, employeeInfo.gradeId, employeeInfo.currentStep);

      // ロードマップ達成状況を集計
      const achievements = await this.aggregateAchievements(employeeId, employeeInfo.gradeId);

      // スコア計算
      const skillScore = this.calculateAxisScore(achievements.skillAchieved, achievements.skillTotal, SCORE_WEIGHTS.SKILL);
      const competencyScore = this.calculateAxisScore(achievements.competencyAchieved, achievements.competencyTotal, SCORE_WEIGHTS.COMPETENCY);
      const behaviorScore = this.calculateAxisScore(achievements.behaviorAchieved, achievements.behaviorTotal, SCORE_WEIGHTS.BEHAVIOR);
      const totalScore = skillScore + competencyScore + behaviorScore;
      const suggestedRank = calculateRank(totalScore);

      // レポートを作成
      const reportId = `ar_${crypto.randomUUID().slice(0, 8)}`;
      const now = new Date().toISOString();

      await this.env.DB.prepare(`
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
      `).bind(
        reportId, cycleId, employeeId, periodId,
        employeeInfo.gradeId, employeeInfo.currentStep, salaryInfo.baseSalary, salaryInfo.gradeSalary,
        achievements.completionRate, achievements.totalItems, achievements.achievedItems, achievements.inProgressItems,
        JSON.stringify(achievements.strengths), JSON.stringify(achievements.improvements),
        skillScore, achievements.skillTotal, achievements.skillAchieved,
        competencyScore, achievements.competencyTotal, achievements.competencyAchieved,
        behaviorScore, achievements.behaviorTotal, achievements.behaviorAchieved,
        totalScore, suggestedRank,
        now, now, now
      ).run();

      // サイクルのステータスを更新
      await this.updateCycleStatus(cycleId, 'REPORT_GENERATED', 'MANAGER_EVALUATION');

      // 監査ログ
      await this.logAudit(cycleId, 'REPORT_GENERATED', {
        reportId,
        totalScore,
        suggestedRank,
      });
    });
  }

  // ============================================
  // Step 2: 上司評価待ち
  // ============================================
  private async waitForManagerEvaluation(
    cycleId: string,
    managerId: string,
    step: WorkflowStep
  ): Promise<void> {
    // 上司に通知
    await step.do('notify-manager-evaluation', async () => {
      const cycle = await this.getCycle(cycleId);
      await this.sendNotification({
        type: 'MANAGER_EVALUATION_REQUEST',
        employeeId: managerId,
        cycleId,
        title: '部下の評価をお願いします',
        message: '達成度レポートが生成されました。評価を入力してください。',
      });
    });

    // 上司評価提出を待機（タイムアウト: 14日）
    try {
      await step.waitForEvent<ManagerEvaluationSubmittedEvent>('wait-manager-evaluation', {
        type: 'manager-evaluation-submitted',
        timeout: '14 days',
      });
    } catch (error) {
      // タイムアウト時はエスカレーション通知
      await step.do('handle-manager-evaluation-timeout', async () => {
        await this.sendNotification({
          type: 'DEADLINE_EXCEEDED',
          employeeId: managerId,
          cycleId,
          title: '評価の期限が過ぎています',
          message: '至急、評価を入力してください。',
        });
        await this.notifyAdmins('MANAGER_EVALUATION_OVERDUE', cycleId, managerId);
      });

      // 再度待機（延長）
      await step.waitForEvent<ManagerEvaluationSubmittedEvent>('wait-manager-evaluation-extended', {
        type: 'manager-evaluation-submitted',
        timeout: '30 days',
      });
    }

    // ステータス更新
    await step.do('update-status-manager-evaluated', async () => {
      await this.updateCycleStatus(cycleId, 'MANAGER_EVALUATED', 'MANAGER_APPROVAL');
    });
  }

  // ============================================
  // Step 3: 上司承認待ち（差戻しループ対応）
  // ============================================
  private async waitForManagerApproval(
    cycleId: string,
    managerId: string,
    step: WorkflowStep
  ): Promise<{ approved: boolean; rejected: boolean; actorId?: string }> {
    let approved = false;
    let rejected = false;
    let actorId: string | undefined;

    while (!approved && !rejected) {
      // 承認/差戻しを待機
      const result = await step.waitForEvent<ApprovalEvent>('wait-manager-approval', {
        type: 'manager-approval-decision',
        timeout: '7 days',
      });

      if (result.payload.action === 'APPROVE') {
        approved = true;
        await step.do('update-status-manager-approved', async () => {
          await this.updateCycleStatus(cycleId, 'MANAGER_APPROVED', 'HR_APPROVAL');
          await this.recordApprovalHistory(
            cycleId,
            'MANAGER_APPROVAL',
            'APPROVE',
            result.payload.actorId,
            'MANAGER_EVALUATED',
            'MANAGER_APPROVED',
            result.payload.comment
          );
        });
      } else if (result.payload.action === 'REJECT') {
        // 差戻し：再評価を要求
        rejected = true;
        actorId = result.payload.actorId;
        await step.do('handle-manager-rejection', async () => {
          await this.updateCycleStatus(cycleId, 'REJECTED', 'MANAGER_EVALUATION');
          await this.recordApprovalHistory(
            cycleId,
            'MANAGER_APPROVAL',
            'REJECT',
            result.payload.actorId,
            'MANAGER_EVALUATED',
            'REJECTED',
            result.payload.comment
          );
          await this.sendNotification({
            type: 'EVALUATION_REJECTED',
            employeeId: managerId,
            cycleId,
            title: '評価が差し戻されました',
            message: result.payload.comment || '内容を確認して再評価してください。',
          });
        });
      }
    }

    return { approved, rejected, actorId };
  }

  // ============================================
  // Step 4: HR承認待ち
  // ============================================
  private async waitForHRApproval(
    cycleId: string,
    managerId: string,
    step: WorkflowStep
  ): Promise<{ approved: boolean; rejected: boolean; actorId?: string }> {
    // HR担当者に通知
    await step.do('notify-hr-approval', async () => {
      await this.sendNotification({
        type: 'HR_APPROVAL_REQUEST',
        employeeId: 'HR_GROUP',
        cycleId,
        title: '評価の承認をお願いします',
        message: '上司承認が完了しました。最終確認をお願いします。',
      });
    });

    let approved = false;
    let rejected = false;
    let actorId: string | undefined;

    while (!approved && !rejected) {
      const result = await step.waitForEvent<ApprovalEvent>('wait-hr-approval', {
        type: 'hr-approval-decision',
        timeout: '14 days',
      });

      if (result.payload.action === 'APPROVE') {
        approved = true;
        await step.do('update-status-hr-approved', async () => {
          await this.updateCycleStatus(cycleId, 'HR_APPROVED', 'FINALIZATION');
          await this.recordApprovalHistory(
            cycleId,
            'HR_APPROVAL',
            'APPROVE',
            result.payload.actorId,
            'MANAGER_APPROVED',
            'HR_APPROVED',
            result.payload.comment
          );
        });
      } else if (result.payload.action === 'REJECT') {
        // 上司へ差戻し
        await step.do('handle-hr-rejection', async () => {
          await this.updateCycleStatus(cycleId, 'MANAGER_EVALUATED', 'MANAGER_APPROVAL');
          await this.recordApprovalHistory(
            cycleId,
            'HR_APPROVAL',
            'REJECT',
            result.payload.actorId,
            'MANAGER_APPROVED',
            'MANAGER_EVALUATED',
            result.payload.comment
          );
          await this.sendNotification({
            type: 'EVALUATION_REJECTED_BY_HR',
            employeeId: managerId,
            cycleId,
            title: 'HRから評価が差し戻されました',
            message: result.payload.comment || '内容を確認して再評価してください。',
          });
        });

        // 上司承認を再度待機
        const reApprovalResult = await this.waitForManagerApproval(cycleId, managerId, step);
        if (reApprovalResult.rejected) {
          rejected = true;
          actorId = reApprovalResult.actorId;
        }
      }
    }

    return { approved, rejected, actorId };
  }

  // ============================================
  // Step 5: 確定処理
  // ============================================
  private async finalize(
    cycleId: string,
    step: WorkflowStep
  ): Promise<{ finalScore: number; finalRank: string; salaryIncrementRate: number }> {
    return await step.do('finalize-evaluation', async () => {
      // 1. 最終スコア・ランク取得（上司の調整後スコアを優先）
      const scores = await this.getFinalScores(cycleId);

      // 2. 昇給率決定
      const salaryIncrementRate = SALARY_INCREMENT_RATES[scores.finalRank as keyof typeof SALARY_INCREMENT_RATES] ?? 0;

      // 3. DB更新
      await this.env.DB.prepare(`
        UPDATE evaluation_cycles
        SET status = 'FINALIZED',
            final_score = ?,
            final_rank = ?,
            salary_increment_rate = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `).bind(scores.totalScore, scores.finalRank, salaryIncrementRate, cycleId).run();

      // 4. 本人に通知
      const cycle = await this.getCycle(cycleId);
      await this.sendNotification({
        type: 'EVALUATION_FINALIZED',
        employeeId: cycle.employee_id,
        cycleId,
        title: '評価が確定しました',
        message: '評価が確定しました。結果をご確認ください。',
      });

      // 5. 監査ログ
      await this.logAudit(cycleId, 'EVALUATION_FINALIZED', {
        finalScore: scores.totalScore,
        finalRank: scores.finalRank,
        salaryIncrementRate,
      });

      return {
        finalScore: scores.totalScore,
        finalRank: scores.finalRank,
        salaryIncrementRate,
      };
    });
  }

  // ============================================
  // ヘルパーメソッド
  // ============================================

  private async getEmployeeInfo(employeeId: string): Promise<{
    id: string;
    name: string;
    gradeId: string;
    currentStep: number;
  } | null> {
    const result = await this.env.DB.prepare(`
      SELECT id, name, grade_id, current_step
      FROM employees WHERE id = ?
    `).bind(employeeId).first<{
      id: string;
      name: string;
      grade_id: string;
      current_step: number;
    }>();

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      gradeId: result.grade_id,
      currentStep: result.current_step,
    };
  }

  private async getSalaryInfo(employeeId: string, gradeId: string, step: number): Promise<{
    baseSalary: number;
    gradeSalary: number;
  }> {
    const baseSalaryResult = await this.env.DB.prepare(`
      SELECT base_salary FROM base_salary_tables
      WHERE employee_id = ?
      AND effective_from <= date('now')
      AND (effective_to IS NULL OR effective_to > date('now'))
      ORDER BY effective_from DESC LIMIT 1
    `).bind(employeeId).first<{ base_salary: number }>();

    const gradeSalaryResult = await this.env.DB.prepare(`
      SELECT base_salary FROM grade_salary_tables
      WHERE grade_id = ? AND step = ?
      AND effective_from <= date('now')
      AND (effective_to IS NULL OR effective_to > date('now'))
      ORDER BY effective_from DESC LIMIT 1
    `).bind(gradeId, step).first<{ base_salary: number }>();

    return {
      baseSalary: baseSalaryResult?.base_salary ?? 0,
      gradeSalary: gradeSalaryResult?.base_salary ?? 0,
    };
  }

  private async aggregateAchievements(employeeId: string, gradeId: string): Promise<{
    completionRate: number;
    totalItems: number;
    achievedItems: number;
    inProgressItems: number;
    skillTotal: number;
    skillAchieved: number;
    competencyTotal: number;
    competencyAchieved: number;
    behaviorTotal: number;
    behaviorAchieved: number;
    strengths: string[];
    improvements: string[];
  }> {
    // ロードマップ項目と達成状況を取得
    const items = await this.env.DB.prepare(`
      SELECT
        ri.id, ri.number, ri.name, ri.axis_code,
        COALESCE(ast.status, 'NOT_STARTED') as achievement_status
      FROM roadmap_items ri
      LEFT JOIN achievement_statuses ast ON ri.id = ast.roadmap_item_id AND ast.employee_id = ?
      WHERE ri.required_for_grades LIKE '%' || ? || '%'
      ORDER BY ri.number ASC
    `).bind(employeeId, gradeId).all<{
      id: string;
      number: number;
      name: string;
      axis_code: string;
      achievement_status: string;
    }>();

    const results = items.results ?? [];

    // 統計計算
    const totalItems = results.length;
    const achievedItems = results.filter(r => r.achievement_status === 'ACHIEVED').length;
    const inProgressItems = results.filter(r => r.achievement_status === 'IN_PROGRESS').length;
    const completionRate = totalItems > 0 ? achievedItems / totalItems : 0;

    // 軸別集計
    const skillItems = results.filter(r => r.axis_code === 'SKILL');
    const competencyItems = results.filter(r => r.axis_code === 'COMPETENCY');
    const behaviorItems = results.filter(r => r.axis_code === 'BEHAVIOR');

    // 強み・課題抽出
    const strengths = results
      .filter(r => r.achievement_status === 'ACHIEVED')
      .map(r => r.name);
    const improvements = results
      .filter(r => r.achievement_status !== 'ACHIEVED')
      .map(r => r.name);

    return {
      completionRate,
      totalItems,
      achievedItems,
      inProgressItems,
      skillTotal: skillItems.length,
      skillAchieved: skillItems.filter(r => r.achievement_status === 'ACHIEVED').length,
      competencyTotal: competencyItems.length,
      competencyAchieved: competencyItems.filter(r => r.achievement_status === 'ACHIEVED').length,
      behaviorTotal: behaviorItems.length,
      behaviorAchieved: behaviorItems.filter(r => r.achievement_status === 'ACHIEVED').length,
      strengths,
      improvements,
    };
  }

  private calculateAxisScore(achieved: number, total: number, maxScore: number): number {
    if (total === 0) return 0;
    return Math.round((achieved / total) * maxScore * 10) / 10;
  }

  private async getFinalScores(cycleId: string): Promise<{
    totalScore: number;
    finalRank: string;
  }> {
    // まず上司評価を取得（調整後スコアを優先）
    const managerEval = await this.env.DB.prepare(`
      SELECT
        COALESCE(total_score_adjusted, total_score) as final_total_score,
        rank_suggestion
      FROM manager_evaluations
      WHERE cycle_id = ?
    `).bind(cycleId).first<{
      final_total_score: number;
      rank_suggestion: string;
    }>();

    if (managerEval) {
      return {
        totalScore: managerEval.final_total_score,
        finalRank: managerEval.rank_suggestion,
      };
    }

    // 上司評価がない場合は自動生成レポートの値を使用
    const report = await this.env.DB.prepare(`
      SELECT total_score_calculated, suggested_rank
      FROM achievement_reports
      WHERE cycle_id = ?
    `).bind(cycleId).first<{
      total_score_calculated: number;
      suggested_rank: string | null;
    }>();

    return {
      totalScore: report?.total_score_calculated ?? 0,
      finalRank: report?.suggested_rank ?? 'C',
    };
  }

  private async updateCycleStatus(cycleId: string, status: string, currentStep: string): Promise<void> {
    await this.env.DB.prepare(`
      UPDATE evaluation_cycles
      SET status = ?, current_step = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, currentStep, cycleId).run();
  }

  private async createWorkflowInstance(cycleId: string, workflowInstanceId: string): Promise<void> {
    const id = crypto.randomUUID();
    await this.env.DB.prepare(`
      INSERT INTO workflow_instances (id, workflow_definition_id, entity_type, entity_id, cf_workflow_instance_id, status, started_at)
      VALUES (?, 'wf_evaluation', 'EVALUATION_CYCLE', ?, ?, 'RUNNING', datetime('now'))
    `).bind(id, cycleId, workflowInstanceId).run();
  }

  private async sendNotification(params: {
    type: string;
    employeeId: string;
    cycleId: string;
    title: string;
    message: string;
  }): Promise<void> {
    await this.env.NOTIFICATION_QUEUE.send({
      type: params.type,
      employeeId: params.employeeId,
      cycleId: params.cycleId,
      title: params.title,
      message: params.message,
      createdAt: new Date().toISOString(),
    });
  }

  private async notifyAdmins(type: string, cycleId: string, targetId: string): Promise<void> {
    await this.env.NOTIFICATION_QUEUE.send({
      type,
      employeeId: 'ADMIN_GROUP',
      cycleId,
      targetId,
      createdAt: new Date().toISOString(),
    });
  }

  private async recordApprovalHistory(
    cycleId: string,
    step: string,
    action: string,
    actorId: string,
    previousStatus: string,
    newStatus: string,
    comment?: string
  ): Promise<void> {
    const id = crypto.randomUUID();
    await this.env.DB.prepare(`
      INSERT INTO approval_histories (id, cycle_id, step, action, actor_id, previous_status, new_status, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(id, cycleId, step, action, actorId, previousStatus, newStatus, comment || null).run();
  }

  private async logAudit(cycleId: string, action: string, data: Record<string, unknown>): Promise<void> {
    const id = crypto.randomUUID();
    await this.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, new_value, created_at)
      VALUES (?, 'SYSTEM', ?, 'EVALUATION_CYCLE', ?, ?, datetime('now'))
    `).bind(id, action, cycleId, JSON.stringify(data)).run();
  }

  private async getCycle(cycleId: string): Promise<Cycle> {
    const result = await this.env.DB.prepare('SELECT * FROM evaluation_cycles WHERE id = ?').bind(cycleId).first<Cycle>();
    return result!;
  }
}
