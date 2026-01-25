# 詳細設計インデックス

本ディレクトリにはNeo4jオントロジーから派生した詳細設計書が含まれています。

## 設計の源泉

**Single Source of Truth: Neo4j オントロジー**

各詳細設計書は以下のオントロジーノードから派生しています:

| 設計書 | 派生元ノード |
|-------|-------------|
| 01_エラーハンドリング仕様 | DomainEvent, NotificationType, WorkflowStatus |
| 02_ロギング仕様 | EventHandler, DomainEvent, BusinessEvent |
| 03_カリキュラム生成ロジック仕様 | NoiseType, LearningPhase, Scenario, Curriculum, WorkflowDefinition |

## ファイル一覧

| ファイル | 説明 | 主要トピック |
|---------|------|-------------|
| 01_エラーハンドリング仕様.md | エラー処理の統一仕様 | エラーコード、レスポンス形式、リトライ戦略 |
| 02_ロギング仕様.md | ログ出力の統一仕様 | ログフォーマット、監査ログ、イベントハンドラー |
| 03_カリキュラム生成ロジック仕様.md | LLM連携の詳細仕様 | ノイズ注入、学習フェーズ、ワークフロー |

## オントロジーからの生成クエリ

### エラー関連

```cypher
// ドメインイベントとワークフロー状態遷移
MATCH (e:DomainEvent)
RETURN e.code, e.name, e.description
UNION
MATCH (s1:WorkflowStatus)-[t:CAN_TRANSITION_TO]->(s2:WorkflowStatus)
RETURN s1.code as from_status, t.action, s2.code as to_status
```

### ログ関連

```cypher
// イベントハンドラー
MATCH (h:EventHandler)
RETURN h.code, h.name, h.description

// 通知タイプ
MATCH (n:NotificationType)
RETURN n.code, n.name, n.description, n.channel
```

### カリキュラム生成関連

```cypher
// ノイズタイプと学習フェーズ
MATCH (n:NoiseType)
RETURN n.code, n.name, n.description

MATCH (p:LearningPhase)
RETURN p.code, p.name, p.description, p.order

// カリキュラムワークフロー
MATCH (w:WorkflowDefinition {code: 'CURRICULUM_CREATION'})-[:HAS_STEP]->(s:WorkflowStep)
RETURN w.name, s.name, s.action, s.actor, s.order
ORDER BY s.order
```

## 実装との対応

| 詳細設計 | 実装ファイル |
|---------|-------------|
| エラーハンドリング | `src/domain/errors/`, `src/adapters/in/http/error-handler.ts` |
| ロギング | `src/infrastructure/logging/` |
| カリキュラム生成 | `src/domain/services/curriculum-generator.ts`, `src/workflows/curriculum-workflow.ts` |

## 更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-01-24 | 初版作成 (01, 02, 03) |

---

_最終更新: 2026年1月24日_
