/**
 * D1 Roadmap Repository Implementation
 */

import type {
  RoadmapCategory,
  RoadmapItem,
  RoadmapItemWithCategory,
  RoadmapItemWithLevels,
  RoadmapLevelWithGrade,
  CreateRoadmapItemInput,
  UpdateRoadmapItemInput
} from '@/domain/entities';
import type { RoadmapRepository } from '@/domain/ports/out';

export class D1RoadmapRepository implements RoadmapRepository {
  constructor(private readonly db: D1Database) {}

  // ============================================
  // Categories
  // ============================================

  async findAllCategories(): Promise<RoadmapCategory[]> {
    const result = await this.db
      .prepare('SELECT * FROM roadmap_categories ORDER BY order_index')
      .all<RoadmapCategoryRow>();

    return (result.results ?? []).map(row => this.mapToCategory(row));
  }

  async findCategoryById(id: string): Promise<RoadmapCategory | null> {
    const result = await this.db
      .prepare('SELECT * FROM roadmap_categories WHERE id = ?')
      .bind(id)
      .first<RoadmapCategoryRow>();

    return result ? this.mapToCategory(result) : null;
  }

  // ============================================
  // Items
  // ============================================

  async findItemById(id: string): Promise<RoadmapItem | null> {
    const result = await this.db
      .prepare('SELECT * FROM roadmap_items WHERE id = ?')
      .bind(id)
      .first<RoadmapItemRow>();

    return result ? this.mapToItem(result) : null;
  }

  async findItemByIdWithLevels(id: string): Promise<RoadmapItemWithLevels | null> {
    const item = await this.db
      .prepare(`
        SELECT ri.*, rc.id as cat_id, rc.name as cat_name
        FROM roadmap_items ri
        LEFT JOIN roadmap_categories rc ON ri.category_id = rc.id
        WHERE ri.id = ?
      `)
      .bind(id)
      .first<RoadmapItemJoinRow>();

    if (!item) return null;

    const levels = await this.db
      .prepare(`
        SELECT rl.*, g.id as grade_id, g.code as grade_code, g.name as grade_name
        FROM roadmap_levels rl
        LEFT JOIN grades g ON rl.grade_id = g.id
        WHERE rl.roadmap_item_id = ?
        ORDER BY g.level
      `)
      .bind(id)
      .all<RoadmapLevelJoinRow>();

    return {
      ...this.mapToItem(item),
      category: item.cat_id ? {
        id: item.cat_id,
        name: item.cat_name,
      } : undefined,
      levels: (levels.results ?? []).map(row => ({
        id: row.id,
        roadmapItemId: row.roadmap_item_id,
        gradeId: row.grade_id,
        targetLevel: row.target_level,
        requirement: row.requirement,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        grade: row.grade_id ? {
          id: row.grade_id,
          code: row.grade_code,
          name: row.grade_name,
        } : undefined,
      })),
    };
  }

  async findAllItems(options?: {
    categoryId?: string;
    gradeId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: RoadmapItemWithCategory[]; total: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (options?.categoryId) {
      conditions.push('ri.category_id = ?');
      params.push(options.categoryId);
    }
    if (options?.gradeId) {
      conditions.push('EXISTS (SELECT 1 FROM roadmap_levels rl WHERE rl.roadmap_item_id = ri.id AND rl.grade_id = ?)');
      params.push(options.gradeId);
    }
    if (options?.isActive !== undefined) {
      conditions.push('ri.is_active = ?');
      params.push(options.isActive ? 1 : 0);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 50;
    const offset = (page - 1) * limit;

    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as count FROM roadmap_items ri ${whereClause}`)
      .bind(...params)
      .first<{ count: number }>();

    const dataResult = await this.db
      .prepare(`
        SELECT ri.*, rc.id as cat_id, rc.name as cat_name
        FROM roadmap_items ri
        LEFT JOIN roadmap_categories rc ON ri.category_id = rc.id
        ${whereClause}
        ORDER BY rc.order_index, ri.order_index
        LIMIT ? OFFSET ?
      `)
      .bind(...params, limit, offset)
      .all<RoadmapItemJoinRow>();

    return {
      data: (dataResult.results ?? []).map(row => ({
        ...this.mapToItem(row),
        category: row.cat_id ? {
          id: row.cat_id,
          name: row.cat_name,
        } : undefined,
      })),
      total: countResult?.count ?? 0,
    };
  }

  async findItemsByGrade(gradeId: string): Promise<RoadmapItemWithLevels[]> {
    const items = await this.db
      .prepare(`
        SELECT ri.*, rc.id as cat_id, rc.name as cat_name,
               rl.id as level_id, rl.target_level, rl.requirement, rl.created_at as level_created, rl.updated_at as level_updated
        FROM roadmap_items ri
        LEFT JOIN roadmap_categories rc ON ri.category_id = rc.id
        INNER JOIN roadmap_levels rl ON ri.id = rl.roadmap_item_id
        WHERE rl.grade_id = ? AND ri.is_active = 1
        ORDER BY rc.order_index, ri.order_index
      `)
      .bind(gradeId)
      .all<RoadmapItemWithLevelRow>();

    return (items.results ?? []).map(row => ({
      ...this.mapToItem(row),
      category: row.cat_id ? {
        id: row.cat_id,
        name: row.cat_name,
      } : undefined,
      levels: [{
        id: row.level_id,
        roadmapItemId: row.id,
        gradeId: gradeId,
        targetLevel: row.target_level,
        requirement: row.requirement,
        createdAt: row.level_created,
        updatedAt: row.level_updated,
      }],
    }));
  }

  async createItem(input: CreateRoadmapItemInput): Promise<RoadmapItem> {
    const id = `ri_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    // Get max order index if not provided
    let orderIndex = input.orderIndex;
    if (orderIndex === undefined) {
      const maxResult = await this.db
        .prepare('SELECT MAX(order_index) as max_order FROM roadmap_items WHERE category_id = ?')
        .bind(input.categoryId)
        .first<{ max_order: number | null }>();
      orderIndex = (maxResult?.max_order ?? 0) + 1;
    }

    await this.db
      .prepare(`
        INSERT INTO roadmap_items (id, category_id, code, name, description, evaluation_criteria, order_index, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `)
      .bind(
        id,
        input.categoryId,
        input.code,
        input.name,
        input.description ?? null,
        input.evaluationCriteria ?? null,
        orderIndex,
        now,
        now
      )
      .run();

    return this.findItemById(id) as Promise<RoadmapItem>;
  }

  async updateItem(id: string, input: UpdateRoadmapItemInput): Promise<RoadmapItem> {
    const sets: string[] = [];
    const params: unknown[] = [];

    if (input.categoryId !== undefined) {
      sets.push('category_id = ?');
      params.push(input.categoryId);
    }
    if (input.code !== undefined) {
      sets.push('code = ?');
      params.push(input.code);
    }
    if (input.name !== undefined) {
      sets.push('name = ?');
      params.push(input.name);
    }
    if (input.description !== undefined) {
      sets.push('description = ?');
      params.push(input.description);
    }
    if (input.evaluationCriteria !== undefined) {
      sets.push('evaluation_criteria = ?');
      params.push(input.evaluationCriteria);
    }
    if (input.orderIndex !== undefined) {
      sets.push('order_index = ?');
      params.push(input.orderIndex);
    }
    if (input.isActive !== undefined) {
      sets.push('is_active = ?');
      params.push(input.isActive ? 1 : 0);
    }

    sets.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    await this.db
      .prepare(`UPDATE roadmap_items SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    return this.findItemById(id) as Promise<RoadmapItem>;
  }

  async deleteItem(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM roadmap_items WHERE id = ?').bind(id).run();
  }

  // ============================================
  // Levels
  // ============================================

  async setItemLevel(roadmapItemId: string, gradeId: string, targetLevel: number, requirement: string): Promise<void> {
    const id = `rl_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(`
        INSERT INTO roadmap_levels (id, roadmap_item_id, grade_id, target_level, requirement, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (roadmap_item_id, grade_id) DO UPDATE SET
          target_level = excluded.target_level,
          requirement = excluded.requirement,
          updated_at = excluded.updated_at
      `)
      .bind(id, roadmapItemId, gradeId, targetLevel, requirement, now, now)
      .run();
  }

  async removeItemLevel(roadmapItemId: string, gradeId: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM roadmap_levels WHERE roadmap_item_id = ? AND grade_id = ?')
      .bind(roadmapItemId, gradeId)
      .run();
  }

  // ============================================
  // Mappers
  // ============================================

  private mapToCategory(row: RoadmapCategoryRow): RoadmapCategory {
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapToItem(row: RoadmapItemRow): RoadmapItem {
    return {
      id: row.id,
      categoryId: row.category_id,
      code: row.code,
      name: row.name,
      description: row.description ?? undefined,
      evaluationCriteria: row.evaluation_criteria ?? undefined,
      orderIndex: row.order_index,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

// Row types
interface RoadmapCategoryRow {
  id: string;
  name: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface RoadmapItemRow {
  id: string;
  category_id: string;
  code: string;
  name: string;
  description: string | null;
  evaluation_criteria: string | null;
  order_index: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface RoadmapItemJoinRow extends RoadmapItemRow {
  cat_id: string;
  cat_name: string;
}

interface RoadmapItemWithLevelRow extends RoadmapItemJoinRow {
  level_id: string;
  target_level: number;
  requirement: string;
  level_created: string;
  level_updated: string;
}

interface RoadmapLevelJoinRow {
  id: string;
  roadmap_item_id: string;
  grade_id: string;
  target_level: number;
  requirement: string;
  created_at: string;
  updated_at: string;
  grade_code: string;
  grade_name: string;
}
