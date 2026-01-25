/**
 * 達成度レポートリポジトリ インターフェース (Outbound Port)
 */

import type {
  AchievementReport,
  AchievementReportDetail,
  AchievementReportWithDetails,
  AxisCode,
  AchievementStatus
} from '@/domain/entities';

export interface AchievementReportRepository {
  /**
   * IDでレポートを取得
   */
  findById(id: string): Promise<AchievementReport | null>;

  /**
   * IDでレポートを詳細付きで取得
   */
  findByIdWithDetails(id: string): Promise<AchievementReportWithDetails | null>;

  /**
   * 評価サイクルIDでレポートを取得
   */
  findByCycleId(cycleId: string): Promise<AchievementReport | null>;

  /**
   * 評価サイクルIDでレポートを詳細付きで取得
   */
  findByCycleIdWithDetails(cycleId: string): Promise<AchievementReportWithDetails | null>;

  /**
   * 評価期間IDでレポート一覧を取得
   */
  findByPeriodId(periodId: string, options?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: AchievementReport[]; total: number }>;

  /**
   * 社員IDでレポート一覧を取得
   */
  findByEmployeeId(employeeId: string, options?: {
    periodId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: AchievementReport[]; total: number }>;

  /**
   * レポートを作成
   */
  create(input: CreateAchievementReportInput): Promise<AchievementReport>;

  /**
   * レポート詳細を一括作成
   */
  createDetails(reportId: string, details: CreateAchievementReportDetailInput[]): Promise<AchievementReportDetail[]>;

  /**
   * レポートを更新
   */
  update(id: string, input: UpdateAchievementReportInput): Promise<AchievementReport>;

  /**
   * レポートを削除
   */
  delete(id: string): Promise<void>;

  /**
   * 評価サイクルIDでレポートが存在するか確認
   */
  existsByCycleId(cycleId: string): Promise<boolean>;
}

/**
 * レポート作成入力
 */
export interface CreateAchievementReportInput {
  cycleId: string;
  employeeId: string;
  periodId: string;
  employeeGradeId: string;
  employeeStep: number;
  baseSalary: number;
  gradeSalary: number;
  completionRate: number;
  totalItems: number;
  achievedItems: number;
  inProgressItems: number;
  strengthsJson: string;
  improvementsJson: string;
  skillScoreCalculated: number;
  skillItemsCount: number;
  skillAchievedCount: number;
  competencyScoreCalculated: number;
  competencyItemsCount: number;
  competencyAchievedCount: number;
  behaviorScoreCalculated: number;
  behaviorItemsCount: number;
  behaviorAchievedCount: number;
  totalScoreCalculated: number;
  suggestedRank?: string;
}

/**
 * レポート詳細作成入力
 */
export interface CreateAchievementReportDetailInput {
  roadmapItemId: string;
  roadmapItemNumber: number;
  axisCode: AxisCode;
  status: AchievementStatus;
  evidence?: string;
  curriculumCompletionRate?: number;
  scenarioScore?: number;
}

/**
 * レポート更新入力
 */
export interface UpdateAchievementReportInput {
  completionRate?: number;
  totalItems?: number;
  achievedItems?: number;
  inProgressItems?: number;
  strengthsJson?: string;
  improvementsJson?: string;
  skillScoreCalculated?: number;
  competencyScoreCalculated?: number;
  behaviorScoreCalculated?: number;
  totalScoreCalculated?: number;
  suggestedRank?: string;
}
