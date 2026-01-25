/**
 * ロードマップ（スキル項目）エンティティ
 */

export interface RoadmapCategory {
  id: string;
  name: string;
  description?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapItem {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  description?: string;
  evaluationCriteria?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapItemWithCategory extends RoadmapItem {
  category?: {
    id: string;
    name: string;
  };
}

export interface RoadmapLevel {
  id: string;
  roadmapItemId: string;
  gradeId: string;
  targetLevel: number;        // 1-5
  requirement: string;        // 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL'
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapItemWithLevels extends RoadmapItem {
  category?: {
    id: string;
    name: string;
  };
  levels: RoadmapLevelWithGrade[];
}

export interface RoadmapLevelWithGrade extends RoadmapLevel {
  grade?: {
    id: string;
    code: string;
    name: string;
  };
}

export interface CreateRoadmapItemInput {
  categoryId: string;
  code: string;
  name: string;
  description?: string;
  evaluationCriteria?: string;
  orderIndex?: number;
}

export interface UpdateRoadmapItemInput {
  categoryId?: string;
  code?: string;
  name?: string;
  description?: string;
  evaluationCriteria?: string;
  orderIndex?: number;
  isActive?: boolean;
}
