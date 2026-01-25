/**
 * 達成度レポートエンティティ
 *
 * 評価期間開始時に自動生成されるレポート
 * - 社員の現時点でのスナップショット情報
 * - ロードマップ達成状況の集計
 * - スコアの自動計算
 */

import { EvaluationRank } from './evaluation-cycle';

export type AxisCode = 'SKILL' | 'COMPETENCY' | 'BEHAVIOR';
export type AchievementStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ACHIEVED';

/**
 * 達成度レポート
 */
export interface AchievementReport {
  id: string;
  cycleId: string;
  employeeId: string;
  periodId: string;

  // 社員スナップショット
  employeeGradeId: string;
  employeeStep: number;
  baseSalary: number;
  gradeSalary: number;

  // 達成状況サマリ
  completionRate: number;           // 0.0 - 1.0
  totalItems: number;
  achievedItems: number;
  inProgressItems: number;
  strengths: string[];              // 強み（達成項目名リスト）
  improvements: string[];           // 課題（未達項目名リスト）

  // スキル習得度 (50点満点)
  skillScoreCalculated: number;
  skillItemsCount: number;
  skillAchievedCount: number;

  // 職能発揮力 (30点満点)
  competencyScoreCalculated: number;
  competencyItemsCount: number;
  competencyAchievedCount: number;

  // 行動・貢献 (20点満点)
  behaviorScoreCalculated: number;
  behaviorItemsCount: number;
  behaviorAchievedCount: number;

  // 暫定スコア
  totalScoreCalculated: number;
  suggestedRank?: EvaluationRank;

  // メタデータ
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 達成度レポート詳細（各ロードマップ項目の詳細）
 */
export interface AchievementReportDetail {
  id: string;
  reportId: string;
  roadmapItemId: string;
  roadmapItemNumber: number;
  roadmapItemName?: string;
  axisCode: AxisCode;
  status: AchievementStatus;
  evidence?: string;
  curriculumCompletionRate?: number;
  scenarioScore?: number;
  createdAt: string;
}

/**
 * 達成度レポート（詳細付き）
 */
export interface AchievementReportWithDetails extends AchievementReport {
  details: AchievementReportDetail[];
  employee?: {
    id: string;
    name: string;
    employeeCode: string;
    email: string;
  };
  grade?: {
    id: string;
    code: string;
    name: string;
    level: number;
  };
  period?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
}

/**
 * スコア計算用定数
 */
export const SCORE_WEIGHTS = {
  SKILL: 50,        // スキル習得度: 50点満点
  COMPETENCY: 30,   // 職能発揮力: 30点満点
  BEHAVIOR: 20      // 行動・貢献: 20点満点
} as const;

/**
 * ランク判定閾値
 */
export const RANK_THRESHOLDS: { rank: EvaluationRank; minScore: number }[] = [
  { rank: 'S', minScore: 95 },
  { rank: 'A', minScore: 85 },
  { rank: 'B', minScore: 70 },
  { rank: 'C', minScore: 55 },
  { rank: 'D', minScore: 0 }
];

/**
 * ランク別昇給率
 */
export const SALARY_INCREMENT_RATES: Record<EvaluationRank, number> = {
  S: 0.05,  // 5%
  A: 0.04,  // 4%
  B: 0.03,  // 3%
  C: 0.02,  // 2%
  D: 0.00   // 0%
};

/**
 * スコアからランクを算出
 */
export function calculateRank(totalScore: number): EvaluationRank {
  for (const threshold of RANK_THRESHOLDS) {
    if (totalScore >= threshold.minScore) {
      return threshold.rank;
    }
  }
  return 'D';
}

/**
 * 軸コードからスコア重みを取得
 */
export function getScoreWeight(axisCode: AxisCode): number {
  return SCORE_WEIGHTS[axisCode];
}

/**
 * 達成状況から達成済みかどうかを判定
 */
export function isAchieved(status: AchievementStatus): boolean {
  return status === 'ACHIEVED';
}

/**
 * レポート生成入力
 */
export interface GenerateReportInput {
  cycleId: string;
  periodId: string;
  employeeId: string;
}

/**
 * レポート生成結果
 */
export interface GenerateReportOutput {
  report: AchievementReport;
  details: AchievementReportDetail[];
}
