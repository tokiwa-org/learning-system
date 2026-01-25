/**
 * 評価サイクル API Routes
 * OpenAPI: /api/v1/cycles/*
 */

import { Hono } from 'hono';
import type { Env, UserContext } from '@/env';
import { requireRole } from '../middleware/auth';

export const cyclesRoutes = new Hono<{ Bindings: Env; Variables: { requestId: string; user: UserContext } }>();

// GET /cycles - 評価サイクル一覧取得
cyclesRoutes.get('/', async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const periodId = c.req.query('periodId');
  const status = c.req.query('status') as any;
  const page = c.req.query('page') ? Number(c.req.query('page')) : 1;
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : 20;

  const result = await container.listCycles.execute({
    user,
    periodId,
    status,
    page,
    limit,
  });

  return c.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

// GET /cycles/:cycleId - 評価サイクル詳細取得
cyclesRoutes.get('/:cycleId', async (c) => {
  const { cycleId } = c.req.param();
  const user = c.get('user');
  const container = c.get('container');

  const cycle = await container.getCycle.execute({ cycleId, user });

  return c.json({ success: true, data: cycle });
});

// --- 自己評価 ---

// GET /cycles/:cycleId/self-evaluation - 自己評価取得
cyclesRoutes.get('/:cycleId/self-evaluation', async (c) => {
  const { cycleId } = c.req.param();
  const user = c.get('user');
  const container = c.get('container');

  const selfEvaluation = await container.getSelfEvaluation.execute({ cycleId, user });

  return c.json({
    success: true,
    data: selfEvaluation ?? { cycleId, scores: [] },
  });
});

// PUT /cycles/:cycleId/self-evaluation - 自己評価保存
cyclesRoutes.put('/:cycleId/self-evaluation', async (c) => {
  const { cycleId } = c.req.param();
  const user = c.get('user');
  const container = c.get('container');
  const body = await c.req.json<{
    comment?: string;
    scores: { roadmapItemId: string; score: number; evidence?: string }[];
  }>();

  const result = await container.saveSelfEvaluation.execute({
    cycleId,
    user,
    data: body,
  });

  return c.json({
    success: true,
    data: result.selfEvaluation,
  });
});

// POST /cycles/:cycleId/self-evaluation/submit - 自己評価提出
cyclesRoutes.post('/:cycleId/self-evaluation/submit', async (c) => {
  const { cycleId } = c.req.param();
  const user = c.get('user');
  const container = c.get('container');
  const body = await c.req.json<{ comment?: string }>().catch(() => ({ comment: undefined }));

  const result = await container.submitSelfEvaluation.execute(
    {
      cycleId,
      user,
      comment: body.comment,
    },
    c.env
  );

  return c.json({
    success: true,
    data: {
      cycle: result.cycle,
      selfEvaluation: result.selfEvaluation,
    },
  });
});

// --- 同僚評価 ---

// GET /cycles/:cycleId/peer-evaluations - 同僚評価一覧取得
cyclesRoutes.get('/:cycleId/peer-evaluations', async (c) => {
  const { cycleId } = c.req.param();
  // TODO: Implement with use case
  return c.json({ success: true, data: [] });
});

// PUT /cycles/:cycleId/peer-evaluations/:peerId - 同僚評価保存
cyclesRoutes.put('/:cycleId/peer-evaluations/:peerId', async (c) => {
  const { cycleId, peerId } = c.req.param();
  // TODO: Implement with use case
  return c.json({ success: true, data: { cycleId, peerId } });
});

// POST /cycles/:cycleId/peer-evaluations/:peerId/submit - 同僚評価提出
cyclesRoutes.post('/:cycleId/peer-evaluations/:peerId/submit', async (c) => {
  const { cycleId, peerId } = c.req.param();
  // TODO: Implement with use case
  return c.json({ success: true, data: { cycleId, peerId, submitted: true } });
});

// --- 上司評価 ---

// GET /cycles/:cycleId/manager-evaluation - 上司評価取得 (Manager only)
cyclesRoutes.get('/:cycleId/manager-evaluation', requireRole('MANAGER', 'HR', 'ADMIN'), async (c) => {
  const { cycleId } = c.req.param();
  // TODO: Implement with use case
  return c.json({ success: true, data: { cycleId } });
});

// PUT /cycles/:cycleId/manager-evaluation - 上司評価保存 (Manager only)
cyclesRoutes.put('/:cycleId/manager-evaluation', requireRole('MANAGER', 'HR', 'ADMIN'), async (c) => {
  const { cycleId } = c.req.param();
  // TODO: Implement with use case
  return c.json({ success: true, data: { cycleId } });
});

// POST /cycles/:cycleId/manager-evaluation/submit - 上司評価提出 (Manager only)
cyclesRoutes.post('/:cycleId/manager-evaluation/submit', requireRole('MANAGER', 'HR', 'ADMIN'), async (c) => {
  const { cycleId } = c.req.param();
  // TODO: Implement with use case
  return c.json({ success: true, data: { cycleId, status: 'MANAGER_SUBMITTED' } });
});

// --- 承認 ---

// POST /cycles/:cycleId/approve - 承認 (Manager/HR only)
cyclesRoutes.post('/:cycleId/approve', requireRole('MANAGER', 'HR', 'ADMIN'), async (c) => {
  const { cycleId } = c.req.param();
  // TODO: Implement with use case - send event to EvaluationWorkflow
  return c.json({ success: true, data: { cycleId } });
});

// POST /cycles/:cycleId/reject - 差戻し (Manager/HR only)
cyclesRoutes.post('/:cycleId/reject', requireRole('MANAGER', 'HR', 'ADMIN'), async (c) => {
  const { cycleId } = c.req.param();
  // TODO: Implement with use case - send event to EvaluationWorkflow
  return c.json({ success: true, data: { cycleId, status: 'REJECTED' } });
});
