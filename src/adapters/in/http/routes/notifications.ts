/**
 * Notifications API Routes
 * OpenAPI: /api/v1/notifications/*
 */

import { Hono } from 'hono';
import type { AppVariables } from '../types';
import type { Env } from '@/env';

export const notificationsRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// GET /notifications - List notifications
notificationsRoutes.get('/', async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const unreadOnly = c.req.query('unreadOnly') === 'true';
  const pageStr = c.req.query('page');
  const limitStr = c.req.query('limit');

  const page = pageStr ? parseInt(pageStr, 10) : undefined;
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;

  const result = await container.listNotifications.execute({
    employeeId: user.employeeId,
    unreadOnly,
    page,
    limit,
  });

  return c.json({
    success: true,
    data: result.notifications,
    pagination: result.pagination,
  });
});

// PUT /notifications/:notificationId/read - Mark as read
notificationsRoutes.put('/:notificationId/read', async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const { notificationId } = c.req.param();

  const result = await container.markNotificationRead.execute({
    notificationId,
    employeeId: user.employeeId,
  });

  return c.json({ success: true, data: result.notification });
});

// PUT /notifications/read-all - Mark all as read
notificationsRoutes.put('/read-all', async (c) => {
  const container = c.get('container');
  const user = c.get('user');

  const result = await container.markAllNotificationsRead.execute({
    employeeId: user.employeeId,
  });

  return c.json({ success: true, data: { updatedCount: result.updatedCount } });
});
