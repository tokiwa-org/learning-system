/**
 * Scenario Repository Port (Outbound)
 */

import type {
  Scenario,
  ScenarioQuestion,
  ScenarioWithQuestions,
  CreateScenarioInput,
  UpdateScenarioInput,
  CreateScenarioQuestionInput,
} from '@/domain/entities';

export interface ScenarioRepository {
  // Scenarios
  findById(id: string): Promise<Scenario | null>;

  findByIdWithQuestions(id: string): Promise<ScenarioWithQuestions | null>;

  findAll(options?: {
    status?: string;
    difficulty?: string;
    skillCategory?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Scenario[]; total: number }>;

  create(input: CreateScenarioInput): Promise<Scenario>;

  update(id: string, input: UpdateScenarioInput): Promise<Scenario>;

  delete(id: string): Promise<void>;

  // Questions
  findQuestionsByScenarioId(scenarioId: string): Promise<ScenarioQuestion[]>;

  createQuestion(input: CreateScenarioQuestionInput): Promise<ScenarioQuestion>;

  updateQuestion(id: string, input: Partial<CreateScenarioQuestionInput>): Promise<ScenarioQuestion>;

  deleteQuestion(id: string): Promise<void>;
}
