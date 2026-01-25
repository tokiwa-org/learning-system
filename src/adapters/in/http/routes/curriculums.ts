/**
 * Curriculums API Routes
 * OpenAPI: /api/v1/curriculums/*
 */

import { Hono } from 'hono';
import type { AppVariables } from '../types';
import type { Env } from '@/env';
import { requireRole } from '../middleware/auth';
import { NotFoundError, AuthorizationError } from '@/domain/errors/app-error';

export const curriculumsRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// GET /curriculums - List curriculums
curriculumsRoutes.get('/', async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const scenarioId = c.req.query('scenarioId');
  const status = c.req.query('status');
  const learningPhase = c.req.query('learningPhase');
  const pageStr = c.req.query('page');
  const limitStr = c.req.query('limit');

  const page = pageStr ? parseInt(pageStr, 10) : undefined;
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;

  // HR/Admin can see all curriculums, others see only published
  const isHrOrAdmin = user.role === 'HR' || user.role === 'ADMIN';
  const filterStatus = isHrOrAdmin ? status : 'PUBLISHED';

  const result = await container.curriculumRepository.findAll({
    scenarioId,
    status: filterStatus,
    learningPhase,
    page,
    limit,
  });

  return c.json({
    success: true,
    data: result.data,
    pagination: {
      total: result.total,
      page: page ?? 1,
      limit: limit ?? 20,
      hasNext: (page ?? 1) * (limit ?? 20) < result.total,
    },
  });
});

// GET /curriculums/my-assignments - Get my assigned curriculums
curriculumsRoutes.get('/my-assignments', async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const status = c.req.query('status');
  const pageStr = c.req.query('page');
  const limitStr = c.req.query('limit');

  const page = pageStr ? parseInt(pageStr, 10) : undefined;
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;

  const result = await container.curriculumRepository.findAssignmentsByEmployeeId(user.employeeId, {
    status,
    page,
    limit,
  });

  return c.json({
    success: true,
    data: result.data,
    pagination: {
      total: result.total,
      page: page ?? 1,
      limit: limit ?? 20,
      hasNext: (page ?? 1) * (limit ?? 20) < result.total,
    },
  });
});

// GET /curriculums/:curriculumId - Get curriculum detail
curriculumsRoutes.get('/:curriculumId', async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const { curriculumId } = c.req.param();

  const curriculum = await container.curriculumRepository.findByIdWithItems(curriculumId);

  if (!curriculum) {
    throw NotFoundError.curriculum(curriculumId);
  }

  // Non-HR/Admin can only see published curriculums
  const isHrOrAdmin = user.role === 'HR' || user.role === 'ADMIN';
  if (!isHrOrAdmin && curriculum.status !== 'PUBLISHED') {
    throw NotFoundError.curriculum(curriculumId);
  }

  return c.json({ success: true, data: curriculum });
});

// POST /curriculums - Create curriculum (HR/Admin only)
curriculumsRoutes.post('/', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const body = await c.req.json();

  const curriculum = await container.curriculumRepository.create({
    scenarioId: body.scenarioId,
    name: body.name,
    description: body.description,
    targetGrades: body.targetGrades,
    learningPhase: body.learningPhase,
    estimatedHours: body.estimatedHours,
    noiseTypes: body.noiseTypes,
    llmModel: body.llmModel,
  });

  return c.json({ success: true, data: curriculum }, 201);
});

// PUT /curriculums/:curriculumId - Update curriculum (HR/Admin only)
curriculumsRoutes.put('/:curriculumId', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { curriculumId } = c.req.param();
  const body = await c.req.json();

  const existing = await container.curriculumRepository.findById(curriculumId);
  if (!existing) {
    throw NotFoundError.curriculum(curriculumId);
  }

  const curriculum = await container.curriculumRepository.update(curriculumId, {
    name: body.name,
    description: body.description,
    targetGrades: body.targetGrades,
    learningPhase: body.learningPhase,
    estimatedHours: body.estimatedHours,
    status: body.status,
  });

  return c.json({ success: true, data: curriculum });
});

// POST /curriculums/:curriculumId/review - Review curriculum (HR/Admin only)
curriculumsRoutes.post('/:curriculumId/review', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const { curriculumId } = c.req.param();
  const body = await c.req.json();

  const existing = await container.curriculumRepository.findById(curriculumId);
  if (!existing) {
    throw NotFoundError.curriculum(curriculumId);
  }

  const now = new Date().toISOString();
  const curriculum = await container.curriculumRepository.update(curriculumId, {
    status: body.approved ? 'REVIEWED' : 'DRAFT',
    reviewedBy: user.employeeId,
    reviewedAt: now,
  });

  return c.json({ success: true, data: curriculum });
});

// POST /curriculums/:curriculumId/publish - Publish curriculum (HR/Admin only)
curriculumsRoutes.post('/:curriculumId/publish', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { curriculumId } = c.req.param();

  const existing = await container.curriculumRepository.findById(curriculumId);
  if (!existing) {
    throw NotFoundError.curriculum(curriculumId);
  }

  const now = new Date().toISOString();
  const curriculum = await container.curriculumRepository.update(curriculumId, {
    status: 'PUBLISHED',
    publishedAt: now,
  });

  return c.json({ success: true, data: curriculum });
});

// POST /curriculums/:curriculumId/assign - Assign curriculum to employee (HR/Admin/Manager)
curriculumsRoutes.post('/:curriculumId/assign', requireRole('HR', 'ADMIN', 'MANAGER'), async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const { curriculumId } = c.req.param();
  const body = await c.req.json();

  const curriculum = await container.curriculumRepository.findById(curriculumId);
  if (!curriculum) {
    throw NotFoundError.curriculum(curriculumId);
  }

  const assignment = await container.curriculumRepository.createAssignment({
    curriculumId,
    employeeId: body.employeeId,
    assignedBy: user.employeeId,
    deadline: body.deadline,
    passThreshold: body.passThreshold,
  });

  return c.json({ success: true, data: assignment }, 201);
});

// --- Learning Progress ---

// GET /curriculums/:curriculumId/progress - Get my learning progress
curriculumsRoutes.get('/:curriculumId/progress', async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const { curriculumId } = c.req.param();

  // Find assignment for current user
  const assignments = await container.curriculumRepository.findAssignmentsByEmployeeId(user.employeeId, {});
  const assignment = assignments.data.find((a) => a.curriculumId === curriculumId);

  if (!assignment) {
    throw NotFoundError.curriculumAssignment(`${curriculumId}:${user.employeeId}`);
  }

  return c.json({
    success: true,
    data: {
      curriculumId,
      assignmentId: assignment.id,
      progress: assignment.progress,
      status: assignment.status,
      progressItems: assignment.progressItems,
    },
  });
});

// PUT /curriculums/:curriculumId/progress - Update learning progress
curriculumsRoutes.put('/:curriculumId/progress', async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const { curriculumId } = c.req.param();
  const body = await c.req.json();

  // Find assignment for current user
  const assignments = await container.curriculumRepository.findAssignmentsByEmployeeId(user.employeeId, {});
  const assignment = assignments.data.find((a) => a.curriculumId === curriculumId);

  if (!assignment) {
    throw NotFoundError.curriculumAssignment(`${curriculumId}:${user.employeeId}`);
  }

  // Update progress for specific curriculum item
  if (body.curriculumItemId) {
    await container.curriculumRepository.createOrUpdateProgress(assignment.id, body.curriculumItemId, {
      status: body.status,
      score: body.score,
      maxScore: body.maxScore,
      attempts: body.attempts,
      timeSpentMinutes: body.timeSpentMinutes,
      notes: body.notes,
      startedAt: body.startedAt,
      completedAt: body.completedAt,
    });
  }

  // Update assignment progress percentage
  if (body.progress !== undefined) {
    const now = new Date().toISOString();
    await container.curriculumRepository.updateAssignment(assignment.id, {
      progress: body.progress,
      status: body.progress > 0 ? 'IN_PROGRESS' : assignment.status,
      startedAt: assignment.startedAt ?? now,
    });
  }

  return c.json({ success: true, data: { curriculumId, assignmentId: assignment.id } });
});

// POST /curriculums/:curriculumId/complete - Mark curriculum as complete
curriculumsRoutes.post('/:curriculumId/complete', async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const { curriculumId } = c.req.param();
  const body = await c.req.json();

  // Find assignment for current user
  const assignments = await container.curriculumRepository.findAssignmentsByEmployeeId(user.employeeId, {});
  const assignment = assignments.data.find((a) => a.curriculumId === curriculumId);

  if (!assignment) {
    throw NotFoundError.curriculumAssignment(`${curriculumId}:${user.employeeId}`);
  }

  const now = new Date().toISOString();
  const totalScore = body.totalScore ?? 0;
  const isPassed = totalScore >= assignment.passThreshold;

  const updatedAssignment = await container.curriculumRepository.updateAssignment(assignment.id, {
    progress: 100,
    status: 'COMPLETED',
    completedAt: now,
    totalScore,
    isPassed,
  });

  return c.json({
    success: true,
    data: {
      curriculumId,
      assignmentId: assignment.id,
      status: 'COMPLETED',
      totalScore,
      isPassed,
    },
  });
});
