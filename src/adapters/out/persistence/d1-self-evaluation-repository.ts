/**
 * D1 Self Evaluation Repository Implementation
 */

import type {
  SelfEvaluation,
  SelfEvaluationWithScores,
  SaveSelfEvaluationInput
} from '@/domain/entities';
import type { SelfEvaluationRepository } from '@/domain/ports/out';

export class D1SelfEvaluationRepository implements SelfEvaluationRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<SelfEvaluation | null> {
    const result = await this.db
      .prepare('SELECT * FROM self_evaluations WHERE id = ?')
      .bind(id)
      .first<SelfEvaluationRow>();

    return result ? this.mapToSelfEvaluation(result) : null;
  }

  async findByCycleId(cycleId: string): Promise<SelfEvaluationWithScores | null> {
    const selfEval = await this.db
      .prepare('SELECT * FROM self_evaluations WHERE cycle_id = ?')
      .bind(cycleId)
      .first<SelfEvaluationRow>();

    if (!selfEval) return null;

    const scores = await this.db
      .prepare(`
        SELECT
          ses.*,
          ri.id as item_id, ri.name as item_name, ri.description as item_desc, ri.category as item_category
        FROM self_evaluation_scores ses
        LEFT JOIN roadmap_items ri ON ses.roadmap_item_id = ri.id
        WHERE ses.self_evaluation_id = ?
      `)
      .bind(selfEval.id)
      .all<SelfEvaluationScoreJoinRow>();

    return {
      ...this.mapToSelfEvaluation(selfEval),
      scores: (scores.results ?? []).map(row => ({
        id: row.id,
        selfEvaluationId: row.self_evaluation_id,
        roadmapItemId: row.roadmap_item_id,
        score: row.score,
        evidence: row.evidence ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        roadmapItem: row.item_id ? {
          id: row.item_id,
          name: row.item_name,
          category: row.item_category,
          description: row.item_desc ?? undefined,
        } : undefined,
      })),
    };
  }

  async save(cycleId: string, employeeId: string, input: SaveSelfEvaluationInput): Promise<SelfEvaluation> {
    const now = new Date().toISOString();

    // Check if self evaluation exists
    let selfEval = await this.db
      .prepare('SELECT * FROM self_evaluations WHERE cycle_id = ?')
      .bind(cycleId)
      .first<SelfEvaluationRow>();

    if (!selfEval) {
      // Create new self evaluation
      const id = `selfeval_${crypto.randomUUID().slice(0, 8)}`;
      await this.db
        .prepare(`
          INSERT INTO self_evaluations (id, cycle_id, employee_id, comment, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .bind(id, cycleId, employeeId, input.comment ?? null, now, now)
        .run();

      selfEval = await this.db
        .prepare('SELECT * FROM self_evaluations WHERE id = ?')
        .bind(id)
        .first<SelfEvaluationRow>();
    } else {
      // Update existing
      await this.db
        .prepare('UPDATE self_evaluations SET comment = ?, updated_at = ? WHERE id = ?')
        .bind(input.comment ?? null, now, selfEval.id)
        .run();
    }

    // Delete existing scores
    await this.db
      .prepare('DELETE FROM self_evaluation_scores WHERE self_evaluation_id = ?')
      .bind(selfEval!.id)
      .run();

    // Insert new scores
    for (const score of input.scores) {
      const scoreId = `score_${crypto.randomUUID().slice(0, 8)}`;
      await this.db
        .prepare(`
          INSERT INTO self_evaluation_scores (id, self_evaluation_id, roadmap_item_id, score, evidence, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          scoreId,
          selfEval!.id,
          score.roadmapItemId,
          score.score,
          score.evidence ?? null,
          now,
          now
        )
        .run();
    }

    return this.findById(selfEval!.id) as Promise<SelfEvaluation>;
  }

  async submit(id: string, comment?: string): Promise<SelfEvaluation> {
    const now = new Date().toISOString();

    const updates: string[] = ['submitted_at = ?', 'updated_at = ?'];
    const params: unknown[] = [now, now];

    if (comment !== undefined) {
      updates.push('comment = ?');
      params.push(comment);
    }

    params.push(id);

    await this.db
      .prepare(`UPDATE self_evaluations SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    return this.findById(id) as Promise<SelfEvaluation>;
  }

  private mapToSelfEvaluation(row: SelfEvaluationRow): SelfEvaluation {
    return {
      id: row.id,
      cycleId: row.cycle_id,
      employeeId: row.employee_id,
      comment: row.comment ?? undefined,
      submittedAt: row.submitted_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface SelfEvaluationRow {
  id: string;
  cycle_id: string;
  employee_id: string;
  comment: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SelfEvaluationScoreJoinRow {
  id: string;
  self_evaluation_id: string;
  roadmap_item_id: string;
  score: number;
  evidence: string | null;
  created_at: string;
  updated_at: string;
  item_id: string;
  item_name: string;
  item_desc: string | null;
  item_category: string;
}
