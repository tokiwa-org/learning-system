/**
 * Get Roadmap Items for Grade Use Case
 * Returns roadmap items with target levels for a specific grade
 */

import type { RoadmapItemWithLevels, RoadmapCategory } from '@/domain/entities';
import type { RoadmapRepository } from '@/domain/ports/out';

export interface GetRoadmapForGradeInput {
  gradeId: string;
}

export interface GetRoadmapForGradeOutput {
  gradeId: string;
  categories: RoadmapCategory[];
  items: RoadmapItemWithLevels[];
}

export class GetRoadmapForGradeUseCase {
  constructor(private readonly roadmapRepository: RoadmapRepository) {}

  async execute(input: GetRoadmapForGradeInput): Promise<GetRoadmapForGradeOutput> {
    const categories = await this.roadmapRepository.findAllCategories();
    const items = await this.roadmapRepository.findItemsByGrade(input.gradeId);

    return {
      gradeId: input.gradeId,
      categories,
      items,
    };
  }
}
