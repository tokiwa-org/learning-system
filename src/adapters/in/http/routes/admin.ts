/**
 * Admin API Routes
 * OpenAPI: /api/v1/admin/*
 */

import { Hono } from 'hono';
import type { AppVariables } from '../types';
import type { Env } from '@/env';
import { requireRole } from '../middleware/auth';

export const adminRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// All admin routes require ADMIN role
adminRoutes.use('*', requireRole('ADMIN'));

// GET /admin/settings - Get system settings
adminRoutes.get('/settings', async (c) => {
  // TODO: Implement settings storage (D1 or KV)
  return c.json({
    success: true,
    data: {
      evaluationScoreRange: { min: 1, max: 5 },
      peerEvaluationLimit: 5,
      reminderDays: [7, 3, 1],
      notificationChannels: ['IN_APP', 'EMAIL', 'SLACK'],
      allowSelfPeerSelection: false,
      requireComment: true,
      autoSubmitOnDeadline: false,
    },
  });
});

// PUT /admin/settings - Update system settings
adminRoutes.put('/settings', async (c) => {
  const body = await c.req.json();
  // TODO: Implement settings update
  return c.json({ success: true, data: body });
});

// GET /admin/audit-logs - Get audit logs
adminRoutes.get('/audit-logs', async (c) => {
  const db = c.env.DB;
  const startDate = c.req.query('startDate');
  const endDate = c.req.query('endDate');
  const eventType = c.req.query('eventType');
  const userId = c.req.query('userId');
  const pageStr = c.req.query('page');
  const limitStr = c.req.query('limit');

  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const limit = limitStr ? parseInt(limitStr, 10) : 50;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (startDate) {
    conditions.push('created_at >= ?');
    params.push(startDate);
  }
  if (endDate) {
    conditions.push('created_at <= ?');
    params.push(endDate);
  }
  if (eventType) {
    conditions.push('action = ?');
    params.push(eventType);
  }
  if (userId) {
    conditions.push('user_id = ?');
    params.push(userId);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db
    .prepare(`SELECT COUNT(*) as count FROM audit_logs ${whereClause}`)
    .bind(...params)
    .first<{ count: number }>();

  const dataResult = await db
    .prepare(
      `SELECT * FROM audit_logs ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    )
    .bind(...params, limit, offset)
    .all<AuditLogRow>();

  const logs = (dataResult.results ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    oldValue: row.old_value ? JSON.parse(row.old_value) : undefined,
    newValue: row.new_value ? JSON.parse(row.new_value) : undefined,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: row.created_at,
  }));

  return c.json({
    success: true,
    data: logs,
    pagination: {
      total: countResult?.count ?? 0,
      page,
      limit,
      hasNext: page * limit < (countResult?.count ?? 0),
    },
  });
});

// POST /admin/export - Start data export job
adminRoutes.post('/export', async (c) => {
  const body = await c.req.json();
  const jobId = `export_${crypto.randomUUID().slice(0, 8)}`;

  // TODO: Implement async export via Cloudflare Queue
  // For now, return a placeholder response
  return c.json(
    {
      success: true,
      data: {
        jobId,
        status: 'PROCESSING',
        format: body.format ?? 'csv',
        entities: body.entities ?? [],
        filters: body.filters ?? {},
        estimatedCompletionTime: new Date(Date.now() + 60000).toISOString(),
      },
    },
    202
  );
});

// GET /admin/export/:jobId - Get export job status
adminRoutes.get('/export/:jobId', async (c) => {
  const { jobId } = c.req.param();

  // TODO: Implement job status lookup from KV or D1
  // For now, return a placeholder response
  return c.json({
    success: true,
    data: {
      jobId,
      status: 'COMPLETED',
      progress: 100,
      downloadUrl: `https://evaluation-exports.example.com/${jobId}.csv`,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    },
  });
});

// GET /admin/statistics - Get system statistics
adminRoutes.get('/statistics', async (c) => {
  const db = c.env.DB;

  // Get counts for various entities
  const [employees, periods, cycles, scenarios, curriculums] = await Promise.all([
    db.prepare('SELECT COUNT(*) as count FROM employees WHERE is_active = 1').first<{ count: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM evaluation_periods').first<{ count: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM evaluation_cycles').first<{ count: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM scenarios').first<{ count: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM curriculums').first<{ count: number }>(),
  ]);

  // Get active period info
  const activePeriod = await db
    .prepare("SELECT * FROM evaluation_periods WHERE status = 'ACTIVE' ORDER BY start_date DESC LIMIT 1")
    .first();

  return c.json({
    success: true,
    data: {
      totalEmployees: employees?.count ?? 0,
      totalPeriods: periods?.count ?? 0,
      totalCycles: cycles?.count ?? 0,
      totalScenarios: scenarios?.count ?? 0,
      totalCurriculums: curriculums?.count ?? 0,
      activePeriod: activePeriod
        ? {
            id: (activePeriod as Record<string, unknown>).id,
            name: (activePeriod as Record<string, unknown>).name,
            startDate: (activePeriod as Record<string, unknown>).start_date,
            endDate: (activePeriod as Record<string, unknown>).end_date,
          }
        : null,
    },
  });
});

interface AuditLogRow {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_value: string | null;
  new_value: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
