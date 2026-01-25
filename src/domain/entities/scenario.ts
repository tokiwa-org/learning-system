/**
 * Scenario Entity
 */

export type ScenarioDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type ScenarioStatus = 'DRAFT' | 'GENERATED' | 'REVIEWED' | 'PUBLISHED' | 'ARCHIVED';
export type QuestionType = 'MULTIPLE_CHOICE' | 'FREE_TEXT' | 'CODE_REVIEW' | 'SCENARIO_RESPONSE';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  targetGrades: string[];
  skillCategory: string;
  difficulty: ScenarioDifficulty;
  status: ScenarioStatus;
  createdBy: string;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioQuestion {
  id: string;
  scenarioId: string;
  questionNumber: number;
  questionType: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
  relatedRoadmapItems?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioResponse {
  id: string;
  scenarioId: string;
  questionId: string;
  employeeId: string;
  assignmentId: string;
  responseText?: string;
  selectedOption?: string;
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  gradedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioWithQuestions extends Scenario {
  questions: ScenarioQuestion[];
}

export interface CreateScenarioInput {
  title: string;
  description: string;
  targetGrades: string[];
  skillCategory: string;
  difficulty: ScenarioDifficulty;
  createdBy: string;
}

export interface UpdateScenarioInput {
  title?: string;
  description?: string;
  targetGrades?: string[];
  skillCategory?: string;
  difficulty?: ScenarioDifficulty;
  status?: ScenarioStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
}

export interface CreateScenarioQuestionInput {
  scenarioId: string;
  questionNumber: number;
  questionType: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points?: number;
  relatedRoadmapItems?: string[];
}
