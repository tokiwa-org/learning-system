/**
 * D1 Curriculum Repository Implementation
 */

import type {
  Curriculum,
  CurriculumItem,
  CurriculumAssignment,
  LearningProgress,
  CurriculumWithItems,
  CurriculumAssignmentWithProgress,
  CreateCurriculumInput,
  UpdateCurriculumInput,
  CreateCurriculumAssignmentInput,
  UpdateCurriculumAssignmentInput,
  UpdateLearningProgressInput,
  CurriculumStatus,
  LearningPhase,
  CurriculumItemType,
  AssignmentStatus,
  ProgressStatus,
  DisplayFormat,
} from '@/domain/entities';
import type { CurriculumRepository } from '@/domain/ports/out';

export class D1CurriculumRepository implements CurriculumRepository {
  constructor(private readonly db: D1Database) {}

  // Curriculums
  async findById(id: string): Promise<Curriculum | null> {
    const result = await this.db
      .prepare('SELECT * FROM curriculums WHERE id = ?')
      .bind(id)
      .first<CurriculumRow>();

    return result ? this.mapToCurriculum(result) : null;
  }

  async findByIdWithItems(id: string): Promise<CurriculumWithItems | null> {
    const curriculum = await this.findById(id);
    if (!curriculum) return null;

    const items = await this.findItemsByCurriculumId(id);

    return { ...curriculum, items };
  }

  async findAll(options?: {
    scenarioId?: string;
    status?: string;
    learningPhase?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Curriculum[]; total: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (options?.scenarioId) {
      conditions.push('scenario_id = ?');
      params.push(options.scenarioId);
    }
    if (options?.status) {
      conditions.push('status = ?');
      params.push(options.status);
    }
    if (options?.learningPhase) {
      conditions.push('learning_phase = ?');
      params.push(options.learningPhase);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as count FROM curriculums ${whereClause}`)
      .bind(...params)
      .first<{ count: number }>();

    const dataResult = await this.db
      .prepare(`SELECT * FROM curriculums ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .bind(...params, limit, offset)
      .all<CurriculumRow>();

    return {
      data: (dataResult.results ?? []).map((row) => this.mapToCurriculum(row)),
      total: countResult?.count ?? 0,
    };
  }

  async create(input: CreateCurriculumInput): Promise<Curriculum> {
    const id = `cur_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO curriculums (id, scenario_id, name, description, target_grades, learning_phase, estimated_hours, noise_types, status, llm_model, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?)`
      )
      .bind(
        id,
        input.scenarioId,
        input.name,
        input.description ?? null,
        JSON.stringify(input.targetGrades),
        input.learningPhase,
        input.estimatedHours ?? 0,
        input.noiseTypes ? JSON.stringify(input.noiseTypes) : null,
        input.llmModel ?? null,
        now,
        now
      )
      .run();

    return this.findById(id) as Promise<Curriculum>;
  }

  async update(id: string, input: UpdateCurriculumInput): Promise<Curriculum> {
    const sets: string[] = [];
    const params: unknown[] = [];

    if (input.name !== undefined) {
      sets.push('name = ?');
      params.push(input.name);
    }
    if (input.description !== undefined) {
      sets.push('description = ?');
      params.push(input.description);
    }
    if (input.targetGrades !== undefined) {
      sets.push('target_grades = ?');
      params.push(JSON.stringify(input.targetGrades));
    }
    if (input.learningPhase !== undefined) {
      sets.push('learning_phase = ?');
      params.push(input.learningPhase);
    }
    if (input.estimatedHours !== undefined) {
      sets.push('estimated_hours = ?');
      params.push(input.estimatedHours);
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
      .prepare(`UPDATE curriculums SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    return this.findById(id) as Promise<Curriculum>;
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM curriculums WHERE id = ?').bind(id).run();
  }

  // Curriculum Items
  async findItemsByCurriculumId(curriculumId: string): Promise<CurriculumItem[]> {
    const result = await this.db
      .prepare('SELECT * FROM curriculum_items WHERE curriculum_id = ? ORDER BY order_index')
      .bind(curriculumId)
      .all<CurriculumItemRow>();

    return (result.results ?? []).map((row) => this.mapToCurriculumItem(row));
  }

  async createItem(input: {
    curriculumId: string;
    itemNumber: number;
    itemType: string;
    title: string;
    content?: string;
    estimatedMinutes?: number;
    orderIndex: number;
    parentItemId?: string;
  }): Promise<CurriculumItem> {
    const id = `ci_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO curriculum_items (id, curriculum_id, item_number, item_type, title, content, estimated_minutes, order_index, parent_item_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.curriculumId,
        input.itemNumber,
        input.itemType,
        input.title,
        input.content ?? null,
        input.estimatedMinutes ?? 0,
        input.orderIndex,
        input.parentItemId ?? null,
        now,
        now
      )
      .run();

    const result = await this.db
      .prepare('SELECT * FROM curriculum_items WHERE id = ?')
      .bind(id)
      .first<CurriculumItemRow>();

    return this.mapToCurriculumItem(result!);
  }

  // Assignments
  async findAssignmentById(id: string): Promise<CurriculumAssignment | null> {
    const result = await this.db
      .prepare('SELECT * FROM curriculum_assignments WHERE id = ?')
      .bind(id)
      .first<CurriculumAssignmentRow>();

    return result ? this.mapToAssignment(result) : null;
  }

  async findAssignmentByIdWithProgress(id: string): Promise<CurriculumAssignmentWithProgress | null> {
    const assignment = await this.findAssignmentById(id);
    if (!assignment) return null;

    const curriculum = await this.findById(assignment.curriculumId);
    if (!curriculum) return null;

    const progressItems = await this.findProgressByAssignmentId(id);

    return {
      ...assignment,
      curriculum,
      progressItems,
    };
  }

  async findAssignmentsByEmployeeId(
    employeeId: string,
    options?: {
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ data: CurriculumAssignmentWithProgress[]; total: number }> {
    const conditions: string[] = ['ca.employee_id = ?'];
    const params: unknown[] = [employeeId];

    if (options?.status) {
      conditions.push('ca.status = ?');
      params.push(options.status);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as count FROM curriculum_assignments ca ${whereClause}`)
      .bind(...params)
      .first<{ count: number }>();

    const dataResult = await this.db
      .prepare(
        `SELECT ca.*, c.id as c_id, c.scenario_id, c.name, c.description, c.target_grades, c.learning_phase, c.estimated_hours, c.status as c_status, c.created_at as c_created_at, c.updated_at as c_updated_at, c.mission_title, c.mission_summary, c.background_story, c.mission_objective, c.display_format
         FROM curriculum_assignments ca
         JOIN curriculums c ON ca.curriculum_id = c.id
         ${whereClause}
         ORDER BY ca.assigned_at DESC
         LIMIT ? OFFSET ?`
      )
      .bind(...params, limit, offset)
      .all<CurriculumAssignmentJoinRow>();

    const assignments: CurriculumAssignmentWithProgress[] = [];
    for (const row of dataResult.results ?? []) {
      const progressItems = await this.findProgressByAssignmentId(row.id);
      assignments.push({
        ...this.mapToAssignment(row),
        curriculum: {
          id: row.c_id,
          scenarioId: row.scenario_id,
          name: row.name,
          description: row.description ?? undefined,
          targetGrades: JSON.parse(row.target_grades),
          learningPhase: row.learning_phase as LearningPhase,
          estimatedHours: row.estimated_hours,
          status: row.c_status as CurriculumStatus,
          createdAt: row.c_created_at,
          updatedAt: row.c_updated_at,
          // Mission format fields
          missionTitle: row.mission_title ?? undefined,
          missionSummary: row.mission_summary ?? undefined,
          backgroundStory: row.background_story ?? undefined,
          missionObjective: row.mission_objective ?? undefined,
          displayFormat: (row.display_format as DisplayFormat) ?? 'STANDARD',
        },
        progressItems,
      });
    }

    return {
      data: assignments,
      total: countResult?.count ?? 0,
    };
  }

  async findAssignmentsByCurriculumId(curriculumId: string): Promise<CurriculumAssignment[]> {
    const result = await this.db
      .prepare('SELECT * FROM curriculum_assignments WHERE curriculum_id = ?')
      .bind(curriculumId)
      .all<CurriculumAssignmentRow>();

    return (result.results ?? []).map((row) => this.mapToAssignment(row));
  }

  async createAssignment(input: CreateCurriculumAssignmentInput): Promise<CurriculumAssignment> {
    const id = `ca_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO curriculum_assignments (id, curriculum_id, employee_id, assigned_by, deadline, progress, status, pass_threshold, assigned_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 0, 'ASSIGNED', ?, ?, ?)`
      )
      .bind(
        id,
        input.curriculumId,
        input.employeeId,
        input.assignedBy,
        input.deadline ?? null,
        input.passThreshold ?? 70,
        now,
        now
      )
      .run();

    return this.findAssignmentById(id) as Promise<CurriculumAssignment>;
  }

  async updateAssignment(id: string, input: UpdateCurriculumAssignmentInput): Promise<CurriculumAssignment> {
    const sets: string[] = [];
    const params: unknown[] = [];

    if (input.progress !== undefined) {
      sets.push('progress = ?');
      params.push(input.progress);
    }
    if (input.status !== undefined) {
      sets.push('status = ?');
      params.push(input.status);
    }
    if (input.startedAt !== undefined) {
      sets.push('started_at = ?');
      params.push(input.startedAt);
    }
    if (input.completedAt !== undefined) {
      sets.push('completed_at = ?');
      params.push(input.completedAt);
    }
    if (input.totalScore !== undefined) {
      sets.push('total_score = ?');
      params.push(input.totalScore);
    }
    if (input.isPassed !== undefined) {
      sets.push('is_passed = ?');
      params.push(input.isPassed ? 1 : 0);
    }

    sets.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    await this.db
      .prepare(`UPDATE curriculum_assignments SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    return this.findAssignmentById(id) as Promise<CurriculumAssignment>;
  }

  // Learning Progress
  async findProgressByAssignmentId(assignmentId: string): Promise<LearningProgress[]> {
    const result = await this.db
      .prepare('SELECT * FROM learning_progress WHERE assignment_id = ?')
      .bind(assignmentId)
      .all<LearningProgressRow>();

    return (result.results ?? []).map((row) => this.mapToProgress(row));
  }

  async findProgressByAssignmentAndItem(assignmentId: string, curriculumItemId: string): Promise<LearningProgress | null> {
    const result = await this.db
      .prepare('SELECT * FROM learning_progress WHERE assignment_id = ? AND curriculum_item_id = ?')
      .bind(assignmentId, curriculumItemId)
      .first<LearningProgressRow>();

    return result ? this.mapToProgress(result) : null;
  }

  async createOrUpdateProgress(
    assignmentId: string,
    curriculumItemId: string,
    input: UpdateLearningProgressInput
  ): Promise<LearningProgress> {
    const existing = await this.findProgressByAssignmentAndItem(assignmentId, curriculumItemId);
    const now = new Date().toISOString();

    if (existing) {
      const sets: string[] = [];
      const params: unknown[] = [];

      if (input.status !== undefined) {
        sets.push('status = ?');
        params.push(input.status);
      }
      if (input.score !== undefined) {
        sets.push('score = ?');
        params.push(input.score);
      }
      if (input.maxScore !== undefined) {
        sets.push('max_score = ?');
        params.push(input.maxScore);
      }
      if (input.attempts !== undefined) {
        sets.push('attempts = ?');
        params.push(input.attempts);
      }
      if (input.timeSpentMinutes !== undefined) {
        sets.push('time_spent_minutes = ?');
        params.push(input.timeSpentMinutes);
      }
      if (input.notes !== undefined) {
        sets.push('notes = ?');
        params.push(input.notes);
      }
      if (input.startedAt !== undefined) {
        sets.push('started_at = ?');
        params.push(input.startedAt);
      }
      if (input.completedAt !== undefined) {
        sets.push('completed_at = ?');
        params.push(input.completedAt);
      }

      sets.push('updated_at = ?');
      params.push(now);
      params.push(existing.id);

      await this.db
        .prepare(`UPDATE learning_progress SET ${sets.join(', ')} WHERE id = ?`)
        .bind(...params)
        .run();

      return this.findProgressByAssignmentAndItem(assignmentId, curriculumItemId) as Promise<LearningProgress>;
    }

    const id = `lp_${crypto.randomUUID().slice(0, 8)}`;

    await this.db
      .prepare(
        `INSERT INTO learning_progress (id, assignment_id, curriculum_item_id, status, score, max_score, attempts, time_spent_minutes, notes, started_at, completed_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        assignmentId,
        curriculumItemId,
        input.status ?? 'NOT_STARTED',
        input.score ?? null,
        input.maxScore ?? null,
        input.attempts ?? 0,
        input.timeSpentMinutes ?? 0,
        input.notes ?? null,
        input.startedAt ?? null,
        input.completedAt ?? null,
        now,
        now
      )
      .run();

    return this.findProgressByAssignmentAndItem(assignmentId, curriculumItemId) as Promise<LearningProgress>;
  }

  // Mappers
  private mapToCurriculum(row: CurriculumRow): Curriculum {
    return {
      id: row.id,
      scenarioId: row.scenario_id,
      name: row.name,
      description: row.description ?? undefined,
      targetGrades: JSON.parse(row.target_grades),
      learningPhase: row.learning_phase as LearningPhase,
      estimatedHours: row.estimated_hours,
      externalBookId: row.external_book_id ?? undefined,
      noiseTypes: row.noise_types ? JSON.parse(row.noise_types) : undefined,
      status: row.status as CurriculumStatus,
      llmModel: row.llm_model ?? undefined,
      generatedAt: row.generated_at ?? undefined,
      reviewedBy: row.reviewed_by ?? undefined,
      reviewedAt: row.reviewed_at ?? undefined,
      publishedAt: row.published_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      // Mission format fields
      missionTitle: row.mission_title ?? undefined,
      missionSummary: row.mission_summary ?? undefined,
      backgroundStory: row.background_story ?? undefined,
      missionObjective: row.mission_objective ?? undefined,
      displayFormat: (row.display_format as DisplayFormat) ?? 'STANDARD',
    };
  }

  private mapToCurriculumItem(row: CurriculumItemRow): CurriculumItem {
    return {
      id: row.id,
      curriculumId: row.curriculum_id,
      itemNumber: row.item_number,
      itemType: row.item_type as CurriculumItemType,
      title: row.title,
      content: row.content ?? undefined,
      externalContentId: row.external_content_id ?? undefined,
      relatedRoadmapItems: row.related_roadmap_items ? JSON.parse(row.related_roadmap_items) : undefined,
      estimatedMinutes: row.estimated_minutes,
      orderIndex: row.order_index,
      parentItemId: row.parent_item_id ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      // Mission format fields
      stepTitle: row.step_title ?? undefined,
      stepContext: row.step_context ?? undefined,
    };
  }

  private mapToAssignment(row: CurriculumAssignmentRow): CurriculumAssignment {
    return {
      id: row.id,
      curriculumId: row.curriculum_id,
      employeeId: row.employee_id,
      assignedBy: row.assigned_by,
      deadline: row.deadline ?? undefined,
      progress: row.progress,
      status: row.status as AssignmentStatus,
      startedAt: row.started_at ?? undefined,
      completedAt: row.completed_at ?? undefined,
      totalScore: row.total_score ?? undefined,
      passThreshold: row.pass_threshold,
      isPassed: row.is_passed !== null ? Boolean(row.is_passed) : undefined,
      assignedAt: row.assigned_at,
      updatedAt: row.updated_at,
    };
  }

  private mapToProgress(row: LearningProgressRow): LearningProgress {
    return {
      id: row.id,
      assignmentId: row.assignment_id,
      curriculumItemId: row.curriculum_item_id,
      status: row.status as ProgressStatus,
      score: row.score ?? undefined,
      maxScore: row.max_score ?? undefined,
      attempts: row.attempts,
      timeSpentMinutes: row.time_spent_minutes,
      notes: row.notes ?? undefined,
      startedAt: row.started_at ?? undefined,
      completedAt: row.completed_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

// Row types
interface CurriculumRow {
  id: string;
  scenario_id: string;
  name: string;
  description: string | null;
  target_grades: string;
  learning_phase: string;
  estimated_hours: number;
  external_book_id: string | null;
  noise_types: string | null;
  status: string;
  llm_model: string | null;
  generated_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Mission format fields
  mission_title: string | null;
  mission_summary: string | null;
  background_story: string | null;
  mission_objective: string | null;
  display_format: string | null;
}

interface CurriculumItemRow {
  id: string;
  curriculum_id: string;
  item_number: number;
  item_type: string;
  title: string;
  content: string | null;
  external_content_id: string | null;
  related_roadmap_items: string | null;
  estimated_minutes: number;
  order_index: number;
  parent_item_id: string | null;
  created_at: string;
  updated_at: string;
  // Mission format fields
  step_title: string | null;
  step_context: string | null;
}

interface CurriculumAssignmentRow {
  id: string;
  curriculum_id: string;
  employee_id: string;
  assigned_by: string;
  deadline: string | null;
  progress: number;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  total_score: number | null;
  pass_threshold: number;
  is_passed: number | null;
  assigned_at: string;
  updated_at: string;
}

interface CurriculumAssignmentJoinRow extends CurriculumAssignmentRow {
  c_id: string;
  scenario_id: string;
  name: string;
  description: string | null;
  target_grades: string;
  learning_phase: string;
  estimated_hours: number;
  c_status: string;
  c_created_at: string;
  c_updated_at: string;
  // Mission format fields
  mission_title: string | null;
  mission_summary: string | null;
  background_story: string | null;
  mission_objective: string | null;
  display_format: string | null;
}

interface LearningProgressRow {
  id: string;
  assignment_id: string;
  curriculum_item_id: string;
  status: string;
  score: number | null;
  max_score: number | null;
  attempts: number;
  time_spent_minutes: number;
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
