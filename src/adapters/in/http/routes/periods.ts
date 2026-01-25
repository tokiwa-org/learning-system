/**
 * 評価期間 API Routes
 * OpenAPI: /api/v1/periods/*
 */

import { Hono } from 'hono';
import type { Env, UserContext } from '@/env';
import { requireRole } from '../middleware/auth';

export const periodsRoutes = new Hono<{ Bindings: Env; Variables: { requestId: string; user: UserContext } }>();

// GET /periods - 評価期間一覧取得
periodsRoutes.get('/', async (c) => {
  const container = c.get('container');
  const status = c.req.query('status') as 'PREPARING' | 'ACTIVE' | 'CLOSED' | undefined;
  const year = c.req.query('year') ? Number(c.req.query('year')) : undefined;
  const page = c.req.query('page') ? Number(c.req.query('page')) : 1;
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : 20;

  const result = await container.listPeriods.execute({
    status,
    year,
    page,
    limit,
  });

  return c.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

// GET /periods/:periodId - 評価期間詳細取得
periodsRoutes.get('/:periodId', async (c) => {
  const { periodId } = c.req.param();
  const container = c.get('container');

  const period = await container.getPeriod.execute({ periodId });

  return c.json({
    success: true,
    data: period,
  });
});

// POST /periods - 評価期間作成 (HR/Admin only)
periodsRoutes.post('/', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const body = await c.req.json<{
    name: string;
    startDate: string;
    endDate: string;
    evaluationMonth: number;
  }>();

  const period = await container.createPeriod.execute(body);

  return c.json({ success: true, data: period }, 201);
});

// PUT /periods/:periodId - 評価期間更新 (HR/Admin only)
periodsRoutes.put('/:periodId', requireRole('HR', 'ADMIN'), async (c) => {
  const { periodId } = c.req.param();
  // TODO: Implement with use case
  return c.json({ success: true, data: { id: periodId } });
});

// POST /periods/:periodId/activate - 評価期間開始 (HR/Admin only)
periodsRoutes.post('/:periodId/activate', requireRole('HR', 'ADMIN'), async (c) => {
  const { periodId } = c.req.param();
  // TODO: Implement with use case - trigger EvaluationWorkflow
  return c.json({ success: true, data: { id: periodId, status: 'ACTIVE' } });
});
