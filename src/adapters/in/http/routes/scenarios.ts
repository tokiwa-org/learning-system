/**
 * Scenarios API Routes
 * OpenAPI: /api/v1/scenarios/*
 */

import { Hono } from 'hono';
import type { AppVariables } from '../types';
import type { Env } from '@/env';
import { requireRole } from '../middleware/auth';
import { NotFoundError } from '@/domain/errors/app-error';

export const scenariosRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// GET /scenarios - List scenarios (HR/Admin only)
scenariosRoutes.get('/', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const status = c.req.query('status');
  const difficulty = c.req.query('difficulty');
  const skillCategory = c.req.query('skillCategory');
  const pageStr = c.req.query('page');
  const limitStr = c.req.query('limit');

  const page = pageStr ? parseInt(pageStr, 10) : undefined;
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;

  const result = await container.scenarioRepository.findAll({
    status,
    difficulty,
    skillCategory,
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

// GET /scenarios/:scenarioId - Get scenario detail (HR/Admin only)
scenariosRoutes.get('/:scenarioId', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { scenarioId } = c.req.param();

  const scenario = await container.scenarioRepository.findByIdWithQuestions(scenarioId);

  if (!scenario) {
    throw NotFoundError.scenario(scenarioId);
  }

  return c.json({ success: true, data: scenario });
});

// POST /scenarios - Create scenario (HR/Admin only)
scenariosRoutes.post('/', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const body = await c.req.json();

  const scenario = await container.scenarioRepository.create({
    title: body.title,
    description: body.description,
    targetGrades: body.targetGrades,
    skillCategory: body.skillCategory,
    difficulty: body.difficulty,
    createdBy: user.employeeId,
  });

  return c.json({ success: true, data: scenario }, 201);
});

// PUT /scenarios/:scenarioId - Update scenario (HR/Admin only)
scenariosRoutes.put('/:scenarioId', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { scenarioId } = c.req.param();
  const body = await c.req.json();

  const existing = await container.scenarioRepository.findById(scenarioId);
  if (!existing) {
    throw NotFoundError.scenario(scenarioId);
  }

  const scenario = await container.scenarioRepository.update(scenarioId, {
    title: body.title,
    description: body.description,
    targetGrades: body.targetGrades,
    skillCategory: body.skillCategory,
    difficulty: body.difficulty,
    status: body.status,
  });

  return c.json({ success: true, data: scenario });
});

// DELETE /scenarios/:scenarioId - Delete scenario (Admin only)
scenariosRoutes.delete('/:scenarioId', requireRole('ADMIN'), async (c) => {
  const container = c.get('container');
  const { scenarioId } = c.req.param();

  const existing = await container.scenarioRepository.findById(scenarioId);
  if (!existing) {
    throw NotFoundError.scenario(scenarioId);
  }

  await container.scenarioRepository.delete(scenarioId);

  return c.json({ success: true });
});

// POST /scenarios/:scenarioId/questions - Add question (HR/Admin only)
scenariosRoutes.post('/:scenarioId/questions', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { scenarioId } = c.req.param();
  const body = await c.req.json();

  const existing = await container.scenarioRepository.findById(scenarioId);
  if (!existing) {
    throw NotFoundError.scenario(scenarioId);
  }

  const question = await container.scenarioRepository.createQuestion({
    scenarioId,
    questionNumber: body.questionNumber,
    questionType: body.questionType,
    questionText: body.questionText,
    options: body.options,
    correctAnswer: body.correctAnswer,
    explanation: body.explanation,
    points: body.points,
    relatedRoadmapItems: body.relatedRoadmapItems,
  });

  return c.json({ success: true, data: question }, 201);
});

// POST /scenarios/:scenarioId/generate-curriculum - Generate curriculum (HR/Admin only)
scenariosRoutes.post('/:scenarioId/generate-curriculum', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { scenarioId } = c.req.param();

  const existing = await container.scenarioRepository.findById(scenarioId);
  if (!existing) {
    throw NotFoundError.scenario(scenarioId);
  }

  // TODO: Trigger CurriculumWorkflow via Cloudflare Workflows
  // For now, return a placeholder response
  return c.json({
    success: true,
    data: {
      scenarioId,
      workflowInstanceId: `wfi_${crypto.randomUUID().slice(0, 8)}`,
      status: 'GENERATING',
    },
  });
});

// POST /scenarios/:scenarioId/review - Review scenario (HR/Admin only)
scenariosRoutes.post('/:scenarioId/review', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const { scenarioId } = c.req.param();
  const body = await c.req.json();

  const existing = await container.scenarioRepository.findById(scenarioId);
  if (!existing) {
    throw NotFoundError.scenario(scenarioId);
  }

  const now = new Date().toISOString();
  const scenario = await container.scenarioRepository.update(scenarioId, {
    status: body.approved ? 'REVIEWED' : 'DRAFT',
    reviewedBy: user.employeeId,
    reviewedAt: now,
  });

  return c.json({ success: true, data: scenario });
});

// POST /scenarios/:scenarioId/publish - Publish scenario (HR/Admin only)
scenariosRoutes.post('/:scenarioId/publish', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { scenarioId } = c.req.param();

  const existing = await container.scenarioRepository.findById(scenarioId);
  if (!existing) {
    throw NotFoundError.scenario(scenarioId);
  }

  const now = new Date().toISOString();
  const scenario = await container.scenarioRepository.update(scenarioId, {
    status: 'PUBLISHED',
    publishedAt: now,
  });

  return c.json({ success: true, data: scenario });
});
