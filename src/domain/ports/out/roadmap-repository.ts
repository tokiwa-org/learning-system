/**
 * ロードマップリポジトリ インターフェース (Outbound Port)
 */

import type {
  RoadmapCategory,
  RoadmapItem,
  RoadmapItemWithCategory,
  RoadmapItemWithLevels,
  CreateRoadmapItemInput,
  UpdateRoadmapItemInput
} from '@/domain/entities';

export interface RoadmapRepository {
  // Categories
  findAllCategories(): Promise<RoadmapCategory[]>;
  findCategoryById(id: string): Promise<RoadmapCategory | null>;

  // Items
  findItemById(id: string): Promise<RoadmapItem | null>;
  findItemByIdWithLevels(id: string): Promise<RoadmapItemWithLevels | null>;
  findAllItems(options?: {
    categoryId?: string;
    gradeId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: RoadmapItemWithCategory[]; total: number }>;
  findItemsByGrade(gradeId: string): Promise<RoadmapItemWithLevels[]>;
  createItem(input: CreateRoadmapItemInput): Promise<RoadmapItem>;
  updateItem(id: string, input: UpdateRoadmapItemInput): Promise<RoadmapItem>;
  deleteItem(id: string): Promise<void>;

  // Levels
  setItemLevel(roadmapItemId: string, gradeId: string, targetLevel: number, requirement: string): Promise<void>;
  removeItemLevel(roadmapItemId: string, gradeId: string): Promise<void>;
}
