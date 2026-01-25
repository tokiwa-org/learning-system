/**
 * List Roadmap Items Use Case
 */

import type { RoadmapItemWithCategory, RoadmapCategory } from '@/domain/entities';
import type { RoadmapRepository } from '@/domain/ports/out';

export interface ListRoadmapItemsInput {
  categoryId?: string;
  gradeId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ListRoadmapItemsOutput {
  categories: RoadmapCategory[];
  items: RoadmapItemWithCategory[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  };
}

export class ListRoadmapItemsUseCase {
  constructor(private readonly roadmapRepository: RoadmapRepository) {}

  async execute(input: ListRoadmapItemsInput): Promise<ListRoadmapItemsOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 50;

    // Get all categories
    const categories = await this.roadmapRepository.findAllCategories();

    // Get items with filtering
    const result = await this.roadmapRepository.findAllItems({
      categoryId: input.categoryId,
      gradeId: input.gradeId,
      isActive: input.isActive,
      page,
      limit,
    });

    return {
      categories,
      items: result.data,
      pagination: {
        total: result.total,
        page,
        limit,
        hasNext: page * limit < result.total,
      },
    };
  }
}
