# D1 Database Migrations

人事考課システムのCloudflare D1データベースマイグレーションファイル群です。

## ディレクトリ構成

```
database/
└── migrations/
    └── 0001_initial_schema.sql  # 初期スキーマ
```

## マイグレーション適用方法

### 開発環境

```bash
# ローカルD1へ適用
wrangler d1 execute evaluation-db --local --file=./database/migrations/0001_initial_schema.sql

# データベース確認
wrangler d1 execute evaluation-db --local --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 本番環境

```bash
# リモートD1へ適用
wrangler d1 execute evaluation-db --file=./database/migrations/0001_initial_schema.sql

# データ確認
wrangler d1 execute evaluation-db --command="SELECT * FROM grades;"
```

## スキーマ概要

### テーブル一覧

| テーブル名                 | 日本語名               | ドメイン     |
| -------------------------- | ---------------------- | ------------ |
| departments                | 部署                   | ORGANIZATION |
| grades                     | 職級                   | ORGANIZATION |
| employees                  | 社員                   | ORGANIZATION |
| evaluation_periods         | 評価期間               | EVALUATION   |
| evaluation_criteria        | 評価基準               | EVALUATION   |
| evaluation_cycles          | 評価サイクル           | EVALUATION   |
| self_evaluations           | 自己評価               | EVALUATION   |
| self_evaluation_details    | 自己評価明細           | EVALUATION   |
| peer_evaluations           | 同僚評価               | EVALUATION   |
| peer_evaluation_details    | 同僚評価明細           | EVALUATION   |
| manager_evaluations        | 上司評価               | EVALUATION   |
| manager_evaluation_details | 上司評価明細           | EVALUATION   |
| approval_histories         | 承認履歴               | EVALUATION   |
| roadmap_levels             | ロードマップレベル     | SKILL        |
| roadmap_items              | ロードマップ項目       | SKILL        |
| achievement_statuses       | 達成状況               | SKILL        |
| period_roadmap_snapshots   | 期間別スナップショット | SKILL        |
| promotion_requirements     | 昇格要件               | COMPENSATION |
| grade_salary_tables        | 職級給テーブル         | COMPENSATION |
| base_salary_tables         | 基礎給テーブル         | COMPENSATION |
| notifications              | 通知                   | -            |

### ER図（簡易）

```
┌─────────────────┐
│  departments    │
└───────┬─────────┘
        │1:n
┌───────┴─────────┐      ┌─────────────┐
│   employees     │──────│   grades    │
└───────┬─────────┘      └─────────────┘
        │1:n
┌───────┴─────────────────────────────────┐
│          evaluation_cycles              │
└───────┬──────────┬──────────┬───────────┘
        │          │          │
        │1:1       │1:n       │1:1
        ▼          ▼          ▼
┌───────────┐ ┌──────────┐ ┌─────────────────┐
│self_eval  │ │peer_eval │ │manager_eval     │
└───────────┘ └──────────┘ └─────────────────┘
```

## 初期データ

マイグレーション実行時に以下のマスタデータが挿入されます：

### 職級マスタ

- L1: Entry-level（新入社員・若手）
- L2: Mid-level（中堅社員）
- L3: Senior（シニア）
- L4: Lead（リード・チームリーダー）
- L5: Manager（マネージャー）

### ロードマップレベル

- COMMON: 共通スキル
- TECHNICAL: 技術スキル
- BUSINESS: ビジネススキル
- LEADERSHIP: リーダーシップ

### 昇格要件

- L1→L2: 在籍12ヶ月、B以上、達成率70%
- L2→L3: 在籍24ヶ月、A以上、達成率80%
- L3→L4: 在籍36ヶ月、A以上、達成率85%
- L4→L5: 在籍48ヶ月、S、達成率90%

## オントロジーとの対応

このスキーマはNeo4jオントロジーから自動生成されています。オントロジーの変更時は以下のCypherクエリでDDLを再生成できます：

```cypher
MATCH (e:Entity)-[:HAS_ATTRIBUTE]->(a:Attribute)
WITH e, collect(a) as attrs
RETURN e.name, attrs
ORDER BY e.name
```

---

_生成日: 2026年1月24日_ _オントロジーバージョン: v2.0_
