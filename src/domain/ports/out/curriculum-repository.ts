/**
 * Curriculum Repository Port (Outbound)
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
} from '@/domain/entities';

export interface CurriculumRepository {
  // Curriculums
  findById(id: string): Promise<Curriculum | null>;

  findByIdWithItems(id: string): Promise<CurriculumWithItems | null>;

  findAll(options?: {
    scenarioId?: string;
    status?: string;
    learningPhase?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Curriculum[]; total: number }>;

  create(input: CreateCurriculumInput): Promise<Curriculum>;

  update(id: string, input: UpdateCurriculumInput): Promise<Curriculum>;

  delete(id: string): Promise<void>;

  // Curriculum Items
  findItemsByCurriculumId(curriculumId: string): Promise<CurriculumItem[]>;

  createItem(input: {
    curriculumId: string;
    itemNumber: number;
    itemType: string;
    title: string;
    content?: string;
    estimatedMinutes?: number;
    orderIndex: number;
    parentItemId?: string;
  }): Promise<CurriculumItem>;

  // Assignments
  findAssignmentById(id: string): Promise<CurriculumAssignment | null>;

  findAssignmentByIdWithProgress(id: string): Promise<CurriculumAssignmentWithProgress | null>;

  findAssignmentsByEmployeeId(
    employeeId: string,
    options?: {
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ data: CurriculumAssignmentWithProgress[]; total: number }>;

  findAssignmentsByCurriculumId(curriculumId: string): Promise<CurriculumAssignment[]>;

  createAssignment(input: CreateCurriculumAssignmentInput): Promise<CurriculumAssignment>;

  updateAssignment(id: string, input: UpdateCurriculumAssignmentInput): Promise<CurriculumAssignment>;

  // Learning Progress
  findProgressByAssignmentId(assignmentId: string): Promise<LearningProgress[]>;

  findProgressByAssignmentAndItem(assignmentId: string, curriculumItemId: string): Promise<LearningProgress | null>;

  createOrUpdateProgress(
    assignmentId: string,
    curriculumItemId: string,
    input: UpdateLearningProgressInput
  ): Promise<LearningProgress>;
}
