/**
 * ダッシュボード API Routes
 * OpenAPI: /api/v1/dashboard/*
 */

import { Hono } from 'hono';
import type { Env, UserContext } from '@/env';
import { requireRole } from '../middleware/auth';

export const dashboardRoutes = new Hono<{ Bindings: Env; Variables: { requestId: string; user: UserContext } }>();

// GET /dashboard - 個人ダッシュボード取得
dashboardRoutes.get('/', async (c) => {
  const user = c.get('user');
  const container = c.get('container');

  const dashboard = await container.getDashboard.execute({ user });

  return c.json({
    success: true,
    data: dashboard,
  });
});

// GET /dashboard/overview - 全体概況 (HR/Admin only)
dashboardRoutes.get('/overview', requireRole('HR', 'ADMIN'), async (c) => {
  const user = c.get('user');
  const container = c.get('container');

  // Use the same dashboard use case which returns organization summary for HR/Admin
  const dashboard = await container.getDashboard.execute({ user });

  return c.json({
    success: true,
    data: {
      activePeriod: dashboard.currentPeriod,
      evaluationStats: dashboard.organizationSummary ? {
        total: dashboard.organizationSummary.totalCycles,
        ...dashboard.organizationSummary.byStatus,
        completionRate: dashboard.organizationSummary.completionRate,
      } : null,
      pendingTasks: dashboard.pendingTasks,
    },
  });
});
