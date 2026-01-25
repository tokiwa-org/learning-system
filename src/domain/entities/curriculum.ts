/**
 * Curriculum Entity
 */

export type CurriculumStatus = 'DRAFT' | 'GENERATED' | 'REVIEWED' | 'PUBLISHED' | 'ARCHIVED';
export type LearningPhase = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CurriculumItemType = 'CHAPTER' | 'SECTION' | 'LESSON' | 'EXERCISE' | 'QUIZ';
export type AssignmentStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
export type DisplayFormat = 'STANDARD' | 'MISSION';

/**
 * 教育的ノイズレベル
 * 学習者のレベルに応じた不確実性・複雑性の度合い
 *
 * @see docs/99_参考資料/09_教育的ノイズ.md
 * @see docs/99_参考資料/11_ミッション設計ガイド.md
 *
 * - MINIMAL: 最小限のノイズ（L1向け）- クリーンな教材、正解の型を学ぶ
 * - LOW: 低ノイズ（L1→L2）- 10%程度、情報の不完全性
 * - MEDIUM: 中程度のノイズ（L2→L3）- 30%程度、技術的負債
 * - HIGH: 高ノイズ（L3→L4）- 50%程度、選択肢の過剰
 * - MAXIMUM: 最大ノイズ（L4→L5）- 70%程度、コンテキストの揺らぎ
 */
export type NoiseLevel = 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';

/**
 * ノイズタイプ
 * カリキュラムに注入する具体的なノイズの種類
 */
export type NoiseType =
  | 'information_incomplete'  // 情報の不完全性
  | 'technical_debt'          // 技術的負債
  | 'excessive_choices'       // 選択肢の過剰
  | 'context_fluctuation'     // コンテキストの揺らぎ
  | 'search_pollution';       // 検索環境の汚染

export interface Curriculum {
  id: string;
  scenarioId: string;
  name: string;
  description?: string;
  targetGrades: string[];
  learningPhase: LearningPhase;
  estimatedHours: number;
  externalBookId?: string;
  /**
   * 注入するノイズの種類
   * @see NoiseType
   */
  noiseTypes?: NoiseType[];
  /**
   * 教育的ノイズレベル（学習者レベルに基づく）
   * @see NoiseLevel
   * @see docs/99_参考資料/09_教育的ノイズ.md
   */
  noiseLevel: NoiseLevel;
  /**
   * 査閲者向けノイズ設計説明
   * カリキュラム内でどこにどのようなノイズを配置したかの説明
   */
  noiseDesignNotes?: string;
  status: CurriculumStatus;
  llmModel?: string;
  generatedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Mission format fields
  missionTitle?: string;
  missionSummary?: string;
  backgroundStory?: string;
  missionObjective?: string;
  displayFormat: DisplayFormat;
}

export interface CurriculumItem {
  id: string;
  curriculumId: string;
  itemNumber: number;
  itemType: CurriculumItemType;
  title: string;
  content?: string;
  externalContentId?: string;
  relatedRoadmapItems?: string[];
  estimatedMinutes: number;
  orderIndex: number;
  parentItemId?: string;
  createdAt: string;
  updatedAt: string;
  // Mission format fields
  stepTitle?: string;
  stepContext?: string;
}

export interface CurriculumAssignment {
  id: string;
  curriculumId: string;
  employeeId: string;
  assignedBy: string;
  deadline?: string;
  progress: number;
  status: AssignmentStatus;
  startedAt?: string;
  completedAt?: string;
  totalScore?: number;
  passThreshold: number;
  isPassed?: boolean;
  assignedAt: string;
  updatedAt: string;
}

export interface LearningProgress {
  id: string;
  assignmentId: string;
  curriculumItemId: string;
  status: ProgressStatus;
  score?: number;
  maxScore?: number;
  attempts: number;
  timeSpentMinutes: number;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumWithItems extends Curriculum {
  items: CurriculumItem[];
}

export interface CurriculumAssignmentWithProgress extends CurriculumAssignment {
  curriculum: Curriculum;
  progressItems?: LearningProgress[];
}

export interface CreateCurriculumInput {
  scenarioId: string;
  name: string;
  description?: string;
  targetGrades: string[];
  learningPhase: LearningPhase;
  estimatedHours?: number;
  noiseTypes?: NoiseType[];
  noiseLevel?: NoiseLevel;
  noiseDesignNotes?: string;
  llmModel?: string;
  // Mission format fields
  missionTitle?: string;
  missionSummary?: string;
  backgroundStory?: string;
  missionObjective?: string;
  displayFormat?: DisplayFormat;
}

export interface UpdateCurriculumInput {
  name?: string;
  description?: string;
  targetGrades?: string[];
  learningPhase?: LearningPhase;
  estimatedHours?: number;
  noiseTypes?: NoiseType[];
  noiseLevel?: NoiseLevel;
  noiseDesignNotes?: string;
  status?: CurriculumStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
  // Mission format fields
  missionTitle?: string;
  missionSummary?: string;
  backgroundStory?: string;
  missionObjective?: string;
  displayFormat?: DisplayFormat;
}

export interface CreateCurriculumAssignmentInput {
  curriculumId: string;
  employeeId: string;
  assignedBy: string;
  deadline?: string;
  passThreshold?: number;
}

export interface UpdateCurriculumAssignmentInput {
  progress?: number;
  status?: AssignmentStatus;
  startedAt?: string;
  completedAt?: string;
  totalScore?: number;
  isPassed?: boolean;
}

export interface UpdateLearningProgressInput {
  status?: ProgressStatus;
  score?: number;
  maxScore?: number;
  attempts?: number;
  timeSpentMinutes?: number;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface CreateCurriculumItemInput {
  curriculumId: string;
  itemNumber: number;
  itemType: CurriculumItemType;
  title: string;
  content?: string;
  externalContentId?: string;
  relatedRoadmapItems?: string[];
  estimatedMinutes: number;
  orderIndex: number;
  parentItemId?: string;
  // Mission format fields
  stepTitle?: string;
  stepContext?: string;
}

export interface UpdateCurriculumItemInput {
  itemNumber?: number;
  itemType?: CurriculumItemType;
  title?: string;
  content?: string;
  externalContentId?: string;
  relatedRoadmapItems?: string[];
  estimatedMinutes?: number;
  orderIndex?: number;
  parentItemId?: string;
  // Mission format fields
  stepTitle?: string;
  stepContext?: string;
}
