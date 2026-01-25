/**
 * カリキュラム作成ワークフロー
 *
 * シナリオ（文章題）からLLMでカリキュラムを生成し、
 * 有識者の査閲を経て社員に配信するワークフロー。
 *
 * 状態遷移:
 *   DRAFT → GENERATED → REVIEWED → PUBLISHED
 *          ↓ (修正依頼)
 *        DRAFT
 */

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';

// ============================================
// 型定義
// ============================================

export interface CurriculumWorkflowParams {
  scenarioId: string;
  targetGradeId: string;
  includeNoise: boolean;
  noiseTypes?: string[];
  createdBy: string;
}

export interface CurriculumWorkflowResult {
  status: 'PUBLISHED' | 'CANCELLED' | 'FAILED';
  scenarioId: string;
  curriculumId?: string;
  assignedCount?: number;
  completedAt: string;
}

// イベントペイロード型
export interface CurriculumGeneratedEvent {
  curriculumId: string;
  chapters: CurriculumChapter[];
  estimatedHours: number;
}

export interface ReviewCompletedEvent {
  approved: boolean;
  reviewerId: string;
  comment?: string;
  modifications?: CurriculumModification[];
}

export interface CurriculumChapter {
  id: string;
  title: string;
  content: string;
  estimatedMinutes: number;
  relatedRoadmapItems: string[];
}

export interface CurriculumModification {
  chapterId: string;
  field: string;
  oldValue: string;
  newValue: string;
}

// データ型
interface Scenario {
  id: string;
  title: string;
  description: string;
  target_grades: string[];
  difficulty: string;
  status: string;
}

interface TargetEmployee {
  id: string;
  name: string;
  email: string;
}

interface RoadmapItem {
  id: string;
  name: string;
  description?: string;
  number: number;
  requirement?: string;
  is_required?: boolean;
}

// 環境変数型
export interface Env {
  DB: D1Database;
  CURRICULUM_WORKFLOW: Workflow;
  NOTIFICATION_QUEUE: Queue;
  AI: Ai;
}

// ============================================
// ワークフロー実装
// ============================================

export class CurriculumWorkflow extends WorkflowEntrypoint<Env, CurriculumWorkflowParams> {
  async run(event: WorkflowEvent<CurriculumWorkflowParams>, step: WorkflowStep): Promise<CurriculumWorkflowResult> {
    const { scenarioId, targetGradeId, includeNoise, noiseTypes, createdBy } = event.payload;

    // ============================================
    // Step 1: シナリオ取得
    // ============================================
    const scenario = await step.do('get-scenario', async () => {
      return await this.getScenario(scenarioId);
    });

    if (!scenario) {
      return {
        status: 'FAILED',
        scenarioId,
        completedAt: new Date().toISOString(),
      };
    }

    // ============================================
    // Step 2: LLMでカリキュラム生成
    // ============================================
    const curriculum = await step.do('generate-curriculum', async () => {
      const roadmapItems = await this.getRoadmapItemsForGrade(targetGradeId);
      const generatedContent = await this.generateCurriculumWithLLM(scenario, roadmapItems, includeNoise, noiseTypes);

      // カリキュラムをDBに保存
      const curriculumId = crypto.randomUUID();
      await this.saveCurriculum(curriculumId, scenarioId, generatedContent, targetGradeId);

      return {
        curriculumId,
        ...generatedContent,
      };
    });

    // シナリオのステータスを更新
    await step.do('update-scenario-status-generated', async () => {
      await this.updateScenarioStatus(scenarioId, 'GENERATED');
    });

    // ============================================
    // Step 3: 有識者査閲待ち（修正ループあり）
    // ============================================
    let approved = false;
    let reviewAttempts = 0;
    const maxReviewAttempts = 3;

    while (!approved && reviewAttempts < maxReviewAttempts) {
      reviewAttempts++;

      // 有識者に通知
      await step.do(`notify-reviewer-attempt-${reviewAttempts}`, async () => {
        await this.notifyReviewers(scenarioId, curriculum.curriculumId);
      });

      // 査閲結果を待機
      const reviewResult = await step.waitForEvent<ReviewCompletedEvent>(`wait-review-${reviewAttempts}`, {
        type: 'review-completed',
        timeout: '7 days',
      });

      if (reviewResult.payload.approved) {
        approved = true;

        await step.do('update-scenario-status-reviewed', async () => {
          await this.updateScenarioStatus(scenarioId, 'REVIEWED');
          await this.updateCurriculumStatus(curriculum.curriculumId, 'REVIEWED', reviewResult.payload.reviewerId);
          await this.logReview(curriculum.curriculumId, reviewResult.payload);
        });
      } else {
        // 修正依頼
        await step.do(`handle-review-modifications-${reviewAttempts}`, async () => {
          if (reviewResult.payload.modifications) {
            await this.applyModifications(curriculum.curriculumId, reviewResult.payload.modifications);
          }
          await this.logReview(curriculum.curriculumId, reviewResult.payload);
        });

        // 再生成が必要な場合
        if (reviewAttempts < maxReviewAttempts) {
          await step.do(`regenerate-curriculum-${reviewAttempts}`, async () => {
            await this.regenerateCurriculum(curriculum.curriculumId, scenario, reviewResult.payload.comment);
          });
        }
      }
    }

    if (!approved) {
      // 査閲が通らなかった場合
      await step.do('handle-review-failed', async () => {
        await this.updateScenarioStatus(scenarioId, 'DRAFT');
        await this.updateCurriculumStatus(curriculum.curriculumId, 'DRAFT', null);
        await this.sendNotification({
          type: 'CURRICULUM_REVIEW_FAILED',
          employeeId: createdBy,
          title: 'カリキュラム査閲が完了しませんでした',
          message: `シナリオ「${scenario.title}」のカリキュラム生成が査閲で${maxReviewAttempts}回却下されました。`,
        });
      });

      return {
        status: 'CANCELLED',
        scenarioId,
        curriculumId: curriculum.curriculumId,
        completedAt: new Date().toISOString(),
      };
    }

    // ============================================
    // Step 4: 社員への配信
    // ============================================
    const assignmentResult = await step.do('assign-to-employees', async () => {
      const targetEmployees = await this.getTargetEmployees(targetGradeId);
      let assignedCount = 0;

      for (const employee of targetEmployees) {
        await this.assignCurriculum(curriculum.curriculumId, employee.id, createdBy);
        await this.sendNotification({
          type: 'CURRICULUM_ASSIGNED',
          employeeId: employee.id,
          title: '新しい学習課題が割り当てられました',
          message: `「${curriculum.name}」が割り当てられました。`,
        });
        assignedCount++;
      }

      return { assignedCount };
    });

    // ステータスを配信済みに更新
    await step.do('update-status-published', async () => {
      await this.updateScenarioStatus(scenarioId, 'PUBLISHED');
      await this.updateCurriculumStatus(curriculum.curriculumId, 'PUBLISHED', null);
    });

    return {
      status: 'PUBLISHED',
      scenarioId,
      curriculumId: curriculum.curriculumId,
      assignedCount: assignmentResult.assignedCount,
      completedAt: new Date().toISOString(),
    };
  }

  // ============================================
  // ヘルパーメソッド
  // ============================================

  private async getScenario(scenarioId: string): Promise<Scenario | null> {
    const result = await this.env.DB.prepare('SELECT * FROM scenarios WHERE id = ?').bind(scenarioId).first<Scenario>();
    return result ?? null;
  }

  private async getRoadmapItemsForGrade(gradeId: string): Promise<RoadmapItem[]> {
    const result = await this.env.DB.prepare(`
      SELECT ri.*, rl.requirement, rl.is_required
      FROM roadmap_items ri
      JOIN roadmap_levels rl ON ri.id = rl.roadmap_item_id
      WHERE rl.grade_id = ?
      ORDER BY ri.number
    `).bind(gradeId).all<RoadmapItem>();

    return result.results ?? [];
  }

  private async generateCurriculumWithLLM(
    scenario: Scenario,
    roadmapItems: RoadmapItem[],
    includeNoise: boolean,
    noiseTypes?: string[]
  ): Promise<{ name: string; description: string; chapters: CurriculumChapter[]; estimatedHours: number }> {
    const prompt = this.buildCurriculumPrompt(scenario, roadmapItems, includeNoise, noiseTypes);

    // Cloudflare AI (Workers AI) を使用
    const response = await this.env.AI.run('@cf/meta/llama-3-8b-instruct' as any, {
      prompt,
      max_tokens: 4096,
    });

    // レスポンスをパース
    const generatedContent = this.parseLLMResponse(response);

    return {
      name: `${scenario.title} - カリキュラム`,
      description: scenario.description,
      chapters: generatedContent.chapters,
      estimatedHours: generatedContent.estimatedHours,
    };
  }

  private buildCurriculumPrompt(
    scenario: Scenario,
    roadmapItems: RoadmapItem[],
    includeNoise: boolean,
    noiseTypes?: string[]
  ): string {
    const roadmapSummary = roadmapItems.map((item) => `- ${item.name}: ${item.description || ''}`).join('\n');

    let noiseInstruction = '';
    if (includeNoise && noiseTypes && noiseTypes.length > 0) {
      noiseInstruction = `
以下の教育的ノイズを適切に含めてください：
${noiseTypes.join(', ')}
目的は、学習者が情報の取捨選択能力を養うことです。
`;
    }

    return `
あなたは企業研修のカリキュラム設計者です。
以下のシナリオとスキルロードマップに基づいて、効果的な学習カリキュラムを作成してください。

## シナリオ
タイトル: ${scenario.title}
説明: ${scenario.description}
対象職級: ${JSON.stringify(scenario.target_grades)}
難易度: ${scenario.difficulty}

## 対象スキルロードマップ
${roadmapSummary}

${noiseInstruction}

## 出力形式
以下のJSON形式で出力してください：
{
  "chapters": [
    {
      "id": "chapter_1",
      "title": "章タイトル",
      "content": "マークダウン形式のコンテンツ",
      "estimatedMinutes": 30,
      "relatedRoadmapItems": ["item_id_1", "item_id_2"]
    }
  ],
  "estimatedHours": 12
}

各章は15〜45分程度で学習できる内容にしてください。
実践的な演習や確認クイズを含めてください。
`;
  }

  private parseLLMResponse(response: unknown): { chapters: CurriculumChapter[]; estimatedHours: number } {
    try {
      // LLMレスポンスからJSONを抽出
      const responseText = (response as { response: string }).response;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
    }

    // デフォルト値を返す
    return {
      chapters: [],
      estimatedHours: 0,
    };
  }

  private async saveCurriculum(
    curriculumId: string,
    scenarioId: string,
    content: { name: string; description: string; chapters: CurriculumChapter[]; estimatedHours: number },
    targetGradeId: string
  ): Promise<void> {
    // カリキュラム本体を保存
    await this.env.DB.prepare(`
      INSERT INTO curriculums (id, scenario_id, name, description, target_grades, estimated_hours, status, generated_at, llm_model)
      VALUES (?, ?, ?, ?, ?, ?, 'GENERATED', datetime('now'), '@cf/meta/llama-3.1-8b-instruct')
    `).bind(
      curriculumId,
      scenarioId,
      content.name,
      content.description,
      JSON.stringify([targetGradeId]),
      content.estimatedHours
    ).run();

    // 各チャプターを保存
    for (let i = 0; i < content.chapters.length; i++) {
      const chapter = content.chapters[i];
      await this.env.DB.prepare(`
        INSERT INTO curriculum_items (id, curriculum_id, item_number, item_type, title, content, related_roadmap_items, estimated_minutes, order_index)
        VALUES (?, ?, ?, 'CHAPTER', ?, ?, ?, ?, ?)
      `).bind(
        chapter.id || crypto.randomUUID(),
        curriculumId,
        i + 1,
        chapter.title,
        chapter.content,
        JSON.stringify(chapter.relatedRoadmapItems),
        chapter.estimatedMinutes,
        i
      ).run();
    }
  }

  private async updateScenarioStatus(scenarioId: string, status: string): Promise<void> {
    await this.env.DB.prepare(`
      UPDATE scenarios SET status = ?, updated_at = datetime('now') WHERE id = ?
    `).bind(status, scenarioId).run();
  }

  private async updateCurriculumStatus(curriculumId: string, status: string, reviewerId: string | null): Promise<void> {
    if (reviewerId) {
      await this.env.DB.prepare(`
        UPDATE curriculums SET status = ?, reviewed_by = ?, reviewed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?
      `).bind(status, reviewerId, curriculumId).run();
    } else {
      await this.env.DB.prepare(`
        UPDATE curriculums SET status = ?, updated_at = datetime('now') WHERE id = ?
      `).bind(status, curriculumId).run();
    }
  }

  private async notifyReviewers(scenarioId: string, curriculumId: string): Promise<void> {
    await this.sendNotification({
      type: 'CURRICULUM_REVIEW_REQUEST',
      employeeId: 'REVIEWER_GROUP',
      title: 'カリキュラムの査閲をお願いします',
      message: `新しいカリキュラムが生成されました。技術的な正確性を確認してください。`,
    });
  }

  private async logReview(curriculumId: string, review: ReviewCompletedEvent): Promise<void> {
    const id = crypto.randomUUID();
    await this.env.DB.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, new_value, created_at)
      VALUES (?, ?, 'CURRICULUM_REVIEWED', 'CURRICULUM', ?, ?, datetime('now'))
    `).bind(
      id,
      review.reviewerId,
      curriculumId,
      JSON.stringify({ approved: review.approved, comment: review.comment })
    ).run();
  }

  private async applyModifications(curriculumId: string, modifications: CurriculumModification[]): Promise<void> {
    for (const mod of modifications) {
      await this.env.DB.prepare(`
        UPDATE curriculum_items
        SET ${mod.field} = ?, updated_at = datetime('now')
        WHERE id = ? AND curriculum_id = ?
      `).bind(mod.newValue, mod.chapterId, curriculumId).run();
    }
  }

  private async regenerateCurriculum(
    curriculumId: string,
    scenario: Scenario,
    reviewComment?: string
  ): Promise<void> {
    // 既存のチャプターを取得
    const chapters = await this.env.DB.prepare(`
      SELECT * FROM curriculum_items WHERE curriculum_id = ? ORDER BY order_index
    `).bind(curriculumId).all();

    // 修正ポイントを含めた再生成プロンプトを作成
    const regeneratePrompt = `
前回のカリキュラムに対して以下のフィードバックがありました：
${reviewComment || '（フィードバックなし）'}

既存のチャプター：
${JSON.stringify(chapters.results)}

上記のフィードバックを踏まえて、カリキュラムを改善してください。
`;

    // 再生成を実行（簡略化）
    console.log('Regenerating curriculum with feedback:', regeneratePrompt);
  }

  private async getTargetEmployees(gradeId: string): Promise<TargetEmployee[]> {
    const result = await this.env.DB.prepare(`
      SELECT id, name, email FROM employees WHERE grade_id = ? AND is_active = 1
    `).bind(gradeId).all<TargetEmployee>();

    return result.results ?? [];
  }

  private async assignCurriculum(curriculumId: string, employeeId: string, assignedBy: string): Promise<void> {
    const id = crypto.randomUUID();
    await this.env.DB.prepare(`
      INSERT INTO curriculum_assignments (id, curriculum_id, employee_id, assigned_by, status, assigned_at)
      VALUES (?, ?, ?, ?, 'ASSIGNED', datetime('now'))
      ON CONFLICT (curriculum_id, employee_id) DO NOTHING
    `).bind(id, curriculumId, employeeId, assignedBy).run();
  }

  private async sendNotification(params: {
    type: string;
    employeeId: string;
    title: string;
    message: string;
  }): Promise<void> {
    await this.env.NOTIFICATION_QUEUE.send({
      type: params.type,
      employeeId: params.employeeId,
      title: params.title,
      message: params.message,
      createdAt: new Date().toISOString(),
    });
  }
}
