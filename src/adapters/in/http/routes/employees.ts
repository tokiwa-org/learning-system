/**
 * 社員管理 API Routes
 * OpenAPI: /api/v1/employees/*
 */

import { Hono } from 'hono';
import type { Env, UserContext } from '@/env';
import { requireRole } from '../middleware/auth';

export const employeesRoutes = new Hono<{ Bindings: Env; Variables: { requestId: string; user: UserContext } }>();

// GET /employees - 社員一覧取得 (Manager/HR/Admin)
employeesRoutes.get('/', requireRole('MANAGER', 'HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const user = c.get('user');
  const departmentId = c.req.query('departmentId');
  const gradeId = c.req.query('gradeId');
  const managerId = c.req.query('managerId');
  const isActive = c.req.query('isActive') === 'true' ? true : c.req.query('isActive') === 'false' ? false : undefined;
  const page = c.req.query('page') ? Number(c.req.query('page')) : 1;
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : 20;

  const result = await container.listEmployees.execute({
    user,
    departmentId,
    gradeId,
    managerId,
    isActive,
    page,
    limit,
  });

  return c.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

// GET /employees/:employeeId - 社員詳細取得
employeesRoutes.get('/:employeeId', async (c) => {
  const { employeeId } = c.req.param();
  const user = c.get('user');
  const container = c.get('container');

  const employee = await container.getEmployee.execute({ employeeId, user });

  return c.json({ success: true, data: employee });
});

// POST /employees - 社員登録 (HR/Admin only)
employeesRoutes.post('/', requireRole('HR', 'ADMIN'), async (c) => {
  // TODO: Implement with use case
  return c.json({ success: true, data: {} }, 201);
});

// PUT /employees/:employeeId - 社員更新 (HR/Admin only)
employeesRoutes.put('/:employeeId', requireRole('HR', 'ADMIN'), async (c) => {
  const { employeeId } = c.req.param();
  // TODO: Implement with use case
  return c.json({ success: true, data: { id: employeeId } });
});

// GET /employees/:employeeId/subordinates - 部下一覧取得 (Manager/HR/Admin)
employeesRoutes.get('/:employeeId/subordinates', requireRole('MANAGER', 'HR', 'ADMIN'), async (c) => {
  const user = c.get('user');
  const container = c.get('container');

  const result = await container.getSubordinates.execute({ user });

  return c.json({ success: true, data: result.data });
});
