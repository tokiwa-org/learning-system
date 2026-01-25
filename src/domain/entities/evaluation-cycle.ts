/**
 * 評価サイクルエンティティ
 *
 * 新ワークフロー (v2.0):
 * - 自己評価・同僚評価ステップ廃止
 * - 評価期間開始時に達成度レポートを自動生成
 * - 5ステップ: REPORT_GENERATED → MANAGER_EVALUATED → MANAGER_APPROVED → HR_APPROVED → FINALIZED
 */

export type CycleStatus =
  | 'REPORT_GENERATED'    // レポート自動生成済み
  | 'MANAGER_EVALUATED'   // 上司評価済み
  | 'MANAGER_APPROVED'    // 上司承認済み
  | 'HR_APPROVED'         // HR承認済み
  | 'FINALIZED'           // 確定
  | 'REJECTED';           // 差戻し

export type EvaluationRank = 'S' | 'A' | 'B' | 'C' | 'D';

export interface EvaluationCycle {
  id: string;
  periodId: string;
  employeeId: string;
  status: CycleStatus;
  currentStep?: string;
  workflowInstanceId?: string;
  finalScore?: number;
  finalRank?: EvaluationRank;
  salaryIncrementRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationCycleWithRelations extends EvaluationCycle {
  period?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  employee?: {
    id: string;
    name: string;
    departmentId: string;
    gradeId: string;
    gradeName?: string;
    currentStep?: number;
  };
  achievementReport?: AchievementReportSummary;
  managerEvaluation?: ManagerEvaluationSummary;
  approvalHistory?: ApprovalHistoryEntry[];
}

export interface AchievementReportSummary {
  id: string;
  completionRate: number;
  totalItems: number;
  achievedItems: number;
  skillScore: number;
  competencyScore: number;
  behaviorScore: number;
  totalScore: number;
  suggestedRank?: EvaluationRank;
  generatedAt: string;
}

export interface ManagerEvaluationSummary {
  id: string;
  submittedAt?: string;
  skillScore?: number;
  competencyScore?: number;
  behaviorScore?: number;
  totalScore?: number;
  skillScoreAdjusted?: number;
  competencyScoreAdjusted?: number;
  behaviorScoreAdjusted?: number;
  totalScoreAdjusted?: number;
  adjustmentReason?: string;
  rankSuggestion?: EvaluationRank;
  overallComment?: string;
}

export interface ApprovalHistoryEntry {
  id: string;
  action: 'APPROVE' | 'REJECT';
  actorId: string;
  actorName: string;
  actorRole: string;
  step: string;
  previousStatus: CycleStatus;
  newStatus: CycleStatus;
  comment?: string;
  createdAt: string;
}

// 状態遷移定義 (新ワークフロー)
export const ALLOWED_TRANSITIONS: Record<CycleStatus, { action: string; to: CycleStatus; actor: string }[]> = {
  REPORT_GENERATED: [
    { action: 'submitManagerEvaluation', to: 'MANAGER_EVALUATED', actor: 'MANAGER' }
  ],
  MANAGER_EVALUATED: [
    { action: 'approveByManager', to: 'MANAGER_APPROVED', actor: 'MANAGER' },
    { action: 'rejectByManager', to: 'REJECTED', actor: 'MANAGER' }
  ],
  MANAGER_APPROVED: [
    { action: 'approveByHR', to: 'HR_APPROVED', actor: 'HR' },
    { action: 'rejectByHR', to: 'REJECTED', actor: 'HR' }
  ],
  HR_APPROVED: [
    { action: 'finalize', to: 'FINALIZED', actor: 'SYSTEM' }
  ],
  FINALIZED: [],
  REJECTED: [
    // 差戻し後は上司評価からやり直し
    { action: 'resubmitFromManager', to: 'MANAGER_EVALUATED', actor: 'MANAGER' }
  ]
};

/**
 * 指定されたアクションで状態遷移が可能かどうかを判定
 */
export function canTransition(currentStatus: CycleStatus, action: string): boolean {
  const transitions = ALLOWED_TRANSITIONS[currentStatus];
  return transitions.some(t => t.action === action);
}

/**
 * 指定されたアクションで遷移した場合の次のステータスを取得
 */
export function getNextStatus(currentStatus: CycleStatus, action: string): CycleStatus | null {
  const transitions = ALLOWED_TRANSITIONS[currentStatus];
  const transition = transitions.find(t => t.action === action);
  return transition?.to ?? null;
}

/**
 * ステータスに応じたアクター（担当者）を取得
 */
export function getActorForStatus(status: CycleStatus): string {
  switch (status) {
    case 'REPORT_GENERATED':
      return 'MANAGER';  // 上司が評価を開始
    case 'MANAGER_EVALUATED':
      return 'MANAGER';  // 上司が承認
    case 'MANAGER_APPROVED':
      return 'HR';       // HRが承認
    case 'HR_APPROVED':
      return 'SYSTEM';   // システムが確定
    case 'FINALIZED':
      return 'NONE';
    case 'REJECTED':
      return 'MANAGER';  // 差戻し後は上司が対応
    default:
      return 'UNKNOWN';
  }
}

/**
 * ステータスの表示名を取得
 */
export function getStatusDisplayName(status: CycleStatus): string {
  const names: Record<CycleStatus, string> = {
    REPORT_GENERATED: 'レポート生成済み',
    MANAGER_EVALUATED: '上司評価済み',
    MANAGER_APPROVED: '上司承認済み',
    HR_APPROVED: 'HR承認済み',
    FINALIZED: '確定',
    REJECTED: '差戻し'
  };
  return names[status] ?? status;
}

/**
 * 社員がレポートを閲覧可能かどうかを判定
 * 確定（FINALIZED）になるまで社員はレポートを閲覧不可
 */
export function canEmployeeViewReport(status: CycleStatus): boolean {
  return status === 'FINALIZED';
}
