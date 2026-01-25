/**
 * Roadmap API Routes
 * OpenAPI: /api/v1/roadmap/*
 */

import { Hono } from 'hono';
import type { AppVariables } from '../types';
import type { Env } from '@/env';
import { requireRole } from '../middleware/auth';

export const roadmapRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// GET /roadmap - List roadmap items
roadmapRoutes.get('/', async (c) => {
  const container = c.get('container');
  const categoryId = c.req.query('category');
  const gradeId = c.req.query('grade');
  const isActiveStr = c.req.query('isActive');
  const pageStr = c.req.query('page');
  const limitStr = c.req.query('limit');

  const isActive = isActiveStr === 'true' ? true : isActiveStr === 'false' ? false : undefined;
  const page = pageStr ? parseInt(pageStr, 10) : undefined;
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;

  const result = await container.listRoadmapItems.execute({
    categoryId,
    gradeId,
    isActive,
    page,
    limit,
  });

  return c.json({
    success: true,
    data: {
      categories: result.categories,
      items: result.items,
    },
    pagination: result.pagination,
  });
});

// GET /roadmap/grade/:gradeId - Get roadmap items for a specific grade
roadmapRoutes.get('/grade/:gradeId', async (c) => {
  const container = c.get('container');
  const { gradeId } = c.req.param();

  const result = await container.getRoadmapForGrade.execute({ gradeId });

  return c.json({
    success: true,
    data: {
      gradeId: result.gradeId,
      categories: result.categories,
      items: result.items,
    },
  });
});

// GET /roadmap/:itemId - Get roadmap item detail
roadmapRoutes.get('/:itemId', async (c) => {
  const container = c.get('container');
  const { itemId } = c.req.param();

  const item = await container.roadmapRepository.findItemByIdWithLevels(itemId);

  if (!item) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Roadmap item not found' } }, 404);
  }

  return c.json({ success: true, data: item });
});

// POST /roadmap - Create roadmap item (HR/Admin only)
roadmapRoutes.post('/', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const body = await c.req.json();

  const item = await container.roadmapRepository.createItem({
    categoryId: body.categoryId,
    code: body.code,
    name: body.name,
    description: body.description,
    evaluationCriteria: body.evaluationCriteria,
    orderIndex: body.orderIndex,
  });

  return c.json({ success: true, data: item }, 201);
});

// PUT /roadmap/:itemId - Update roadmap item (HR/Admin only)
roadmapRoutes.put('/:itemId', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { itemId } = c.req.param();
  const body = await c.req.json();

  const existing = await container.roadmapRepository.findItemById(itemId);
  if (!existing) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Roadmap item not found' } }, 404);
  }

  const item = await container.roadmapRepository.updateItem(itemId, {
    categoryId: body.categoryId,
    code: body.code,
    name: body.name,
    description: body.description,
    evaluationCriteria: body.evaluationCriteria,
    orderIndex: body.orderIndex,
    isActive: body.isActive,
  });

  return c.json({ success: true, data: item });
});

// DELETE /roadmap/:itemId - Delete roadmap item (Admin only)
roadmapRoutes.delete('/:itemId', requireRole('ADMIN'), async (c) => {
  const container = c.get('container');
  const { itemId } = c.req.param();

  const existing = await container.roadmapRepository.findItemById(itemId);
  if (!existing) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Roadmap item not found' } }, 404);
  }

  await container.roadmapRepository.deleteItem(itemId);

  return c.json({ success: true });
});

// PUT /roadmap/:itemId/levels/:gradeId - Set level for grade (HR/Admin only)
roadmapRoutes.put('/:itemId/levels/:gradeId', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { itemId, gradeId } = c.req.param();
  const body = await c.req.json();

  const existing = await container.roadmapRepository.findItemById(itemId);
  if (!existing) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Roadmap item not found' } }, 404);
  }

  await container.roadmapRepository.setItemLevel(
    itemId,
    gradeId,
    body.targetLevel,
    body.requirement
  );

  return c.json({ success: true });
});

// DELETE /roadmap/:itemId/levels/:gradeId - Remove level for grade (HR/Admin only)
roadmapRoutes.delete('/:itemId/levels/:gradeId', requireRole('HR', 'ADMIN'), async (c) => {
  const container = c.get('container');
  const { itemId, gradeId } = c.req.param();

  await container.roadmapRepository.removeItemLevel(itemId, gradeId);

  return c.json({ success: true });
});
