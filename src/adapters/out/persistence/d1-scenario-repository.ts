/**
 * D1 Scenario Repository Implementation
 */

import type {
  Scenario,
  ScenarioQuestion,
  ScenarioWithQuestions,
  CreateScenarioInput,
  UpdateScenarioInput,
  CreateScenarioQuestionInput,
  ScenarioDifficulty,
  ScenarioStatus,
  QuestionType,
} from '@/domain/entities';
import type { ScenarioRepository } from '@/domain/ports/out';

export class D1ScenarioRepository implements ScenarioRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<Scenario | null> {
    const result = await this.db
      .prepare('SELECT * FROM scenarios WHERE id = ?')
      .bind(id)
      .first<ScenarioRow>();

    return result ? this.mapToScenario(result) : null;
  }

  async findByIdWithQuestions(id: string): Promise<ScenarioWithQuestions | null> {
    const scenario = await this.findById(id);
    if (!scenario) return null;

    const questions = await this.findQuestionsByScenarioId(id);

    return { ...scenario, questions };
  }

  async findAll(options?: {
    status?: string;
    difficulty?: string;
    skillCategory?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Scenario[]; total: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (options?.status) {
      conditions.push('status = ?');
      params.push(options.status);
    }
    if (options?.difficulty) {
      conditions.push('difficulty = ?');
      params.push(options.difficulty);
    }
    if (options?.skillCategory) {
      conditions.push('skill_category = ?');
      params.push(options.skillCategory);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as count FROM scenarios ${whereClause}`)
      .bind(...params)
      .first<{ count: number }>();

    const dataResult = await this.db
      .prepare(`SELECT * FROM scenarios ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .bind(...params, limit, offset)
      .all<ScenarioRow>();

    return {
      data: (dataResult.results ?? []).map((row) => this.mapToScenario(row)),
      total: countResult?.count ?? 0,
    };
  }

  async create(input: CreateScenarioInput): Promise<Scenario> {
    const id = `scn_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO scenarios (id, title, description, target_grades, skill_category, difficulty, status, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?)`
      )
      .bind(
        id,
        input.title,
        input.description,
        JSON.stringify(input.targetGrades),
        input.skillCategory,
        input.difficulty,
        input.createdBy,
        now,
        now
      )
      .run();

    return this.findById(id) as Promise<Scenario>;
  }

  async update(id: string, input: UpdateScenarioInput): Promise<Scenario> {
    const sets: string[] = [];
    const params: unknown[] = [];

    if (input.title !== undefined) {
      sets.push('title = ?');
      params.push(input.title);
    }
    if (input.description !== undefined) {
      sets.push('description = ?');
      params.push(input.description);
    }
    if (input.targetGrades !== undefined) {
      sets.push('target_grades = ?');
      params.push(JSON.stringify(input.targetGrades));
    }
    if (input.skillCategory !== undefined) {
      sets.push('skill_category = ?');
      params.push(input.skillCategory);
    }
    if (input.difficulty !== undefined) {
      sets.push('difficulty = ?');
      params.push(input.difficulty);
    }
    if (input.status !== undefined) {
      sets.push('status = ?');
      params.push(input.status);
    }
    if (input.reviewedBy !== undefined) {
      sets.push('reviewed_by = ?');
      params.push(input.reviewedBy);
    }
    if (input.reviewedAt !== undefined) {
      sets.push('reviewed_at = ?');
      params.push(input.reviewedAt);
    }
    if (input.publishedAt !== undefined) {
      sets.push('published_at = ?');
      params.push(input.publishedAt);
    }

    sets.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    await this.db
      .prepare(`UPDATE scenarios SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    return this.findById(id) as Promise<Scenario>;
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM scenarios WHERE id = ?').bind(id).run();
  }

  async findQuestionsByScenarioId(scenarioId: string): Promise<ScenarioQuestion[]> {
    const result = await this.db
      .prepare('SELECT * FROM scenario_questions WHERE scenario_id = ? ORDER BY question_number')
      .bind(scenarioId)
      .all<ScenarioQuestionRow>();

    return (result.results ?? []).map((row) => this.mapToQuestion(row));
  }

  async createQuestion(input: CreateScenarioQuestionInput): Promise<ScenarioQuestion> {
    const id = `sq_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO scenario_questions (id, scenario_id, question_number, question_type, question_text, options, correct_answer, explanation, points, related_roadmap_items, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.scenarioId,
        input.questionNumber,
        input.questionType,
        input.questionText,
        input.options ? JSON.stringify(input.options) : null,
        input.correctAnswer ?? null,
        input.explanation ?? null,
        input.points ?? 10,
        input.relatedRoadmapItems ? JSON.stringify(input.relatedRoadmapItems) : null,
        now,
        now
      )
      .run();

    const result = await this.db
      .prepare('SELECT * FROM scenario_questions WHERE id = ?')
      .bind(id)
      .first<ScenarioQuestionRow>();

    return this.mapToQuestion(result!);
  }

  async updateQuestion(id: string, input: Partial<CreateScenarioQuestionInput>): Promise<ScenarioQuestion> {
    const sets: string[] = [];
    const params: unknown[] = [];

    if (input.questionNumber !== undefined) {
      sets.push('question_number = ?');
      params.push(input.questionNumber);
    }
    if (input.questionType !== undefined) {
      sets.push('question_type = ?');
      params.push(input.questionType);
    }
    if (input.questionText !== undefined) {
      sets.push('question_text = ?');
      params.push(input.questionText);
    }
    if (input.options !== undefined) {
      sets.push('options = ?');
      params.push(JSON.stringify(input.options));
    }
    if (input.correctAnswer !== undefined) {
      sets.push('correct_answer = ?');
      params.push(input.correctAnswer);
    }
    if (input.explanation !== undefined) {
      sets.push('explanation = ?');
      params.push(input.explanation);
    }
    if (input.points !== undefined) {
      sets.push('points = ?');
      params.push(input.points);
    }
    if (input.relatedRoadmapItems !== undefined) {
      sets.push('related_roadmap_items = ?');
      params.push(JSON.stringify(input.relatedRoadmapItems));
    }

    sets.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    await this.db
      .prepare(`UPDATE scenario_questions SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    const result = await this.db
      .prepare('SELECT * FROM scenario_questions WHERE id = ?')
      .bind(id)
      .first<ScenarioQuestionRow>();

    return this.mapToQuestion(result!);
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM scenario_questions WHERE id = ?').bind(id).run();
  }

  private mapToScenario(row: ScenarioRow): Scenario {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      targetGrades: JSON.parse(row.target_grades),
      skillCategory: row.skill_category,
      difficulty: row.difficulty as ScenarioDifficulty,
      status: row.status as ScenarioStatus,
      createdBy: row.created_by,
      reviewedBy: row.reviewed_by ?? undefined,
      reviewedAt: row.reviewed_at ?? undefined,
      publishedAt: row.published_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapToQuestion(row: ScenarioQuestionRow): ScenarioQuestion {
    return {
      id: row.id,
      scenarioId: row.scenario_id,
      questionNumber: row.question_number,
      questionType: row.question_type as QuestionType,
      questionText: row.question_text,
      options: row.options ? JSON.parse(row.options) : undefined,
      correctAnswer: row.correct_answer ?? undefined,
      explanation: row.explanation ?? undefined,
      points: row.points,
      relatedRoadmapItems: row.related_roadmap_items ? JSON.parse(row.related_roadmap_items) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface ScenarioRow {
  id: string;
  title: string;
  description: string;
  target_grades: string;
  skill_category: string;
  difficulty: string;
  status: string;
  created_by: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ScenarioQuestionRow {
  id: string;
  scenario_id: string;
  question_number: number;
  question_type: string;
  question_text: string;
  options: string | null;
  correct_answer: string | null;
  explanation: string | null;
  points: number;
  related_roadmap_items: string | null;
  created_at: string;
  updated_at: string;
}
