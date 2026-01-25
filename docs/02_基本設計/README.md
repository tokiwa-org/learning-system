# 基本設計インデックス

本ディレクトリの設計書はNeo4jオントロジーから派生しています。

## 設計の源泉

**Single Source of Truth: Neo4j オントロジー**

オントロジーの詳細は以下を参照してください：

- [オントロジー設計書](../00_概要/02_オントロジー設計.md)

## オントロジーからの設計書生成

各設計書はオントロジーのCypherクエリから再生成可能です：

### データモデル設計

```cypher
MATCH (e:Entity)-[:HAS_ATTRIBUTE]->(a:Attribute)
WITH e, collect(a) as attrs
RETURN e.name, attrs
ORDER BY e.name
```

### API設計

```cypher
MATCH (api:APIEndpoint)
OPTIONAL MATCH (api)-[:OPERATES_ON]->(e:Entity)
RETURN api.method, api.path, api.name, collect(e.name) as entities
ORDER BY api.path
```

### ワークフロー設計

```cypher
MATCH (s1:WorkflowStatus)-[t:CAN_TRANSITION_TO]->(s2:WorkflowStatus)
RETURN s1.code, t.action, s2.code, t.actor
```

### 画面設計

```cypher
MATCH (s:Screen)
OPTIONAL MATCH (s)-[:DISPLAYS]->(e:Entity)
RETURN s.code, s.name, s.path, collect(e.name) as displays
ORDER BY s.code
```

## ファイル一覧

| ファイル                | 説明           | オントロジー対応   |
| ----------------------- | -------------- | ------------------ |
| 01\_データモデル設計.md | D1テーブル設計 | Entity + Attribute |
| 01\_基本設計書.md       | 全体設計概要   | 全ノード           |
| 02_API設計.md           | REST API設計   | APIEndpoint        |
| 03\_ワークフロー設計.md | 状態遷移設計   | WorkflowStatus     |
| 04\_画面設計.md         | UI/UX設計      | Screen             |
| 05\_インフラ構成設計.md | Cloudflare構成 | Infrastructure     |

## 注意事項

- オントロジーを変更した場合は、対応する設計書も更新してください
- 設計書とオントロジーの乖離が発生した場合は、オントロジーを正とします
- 新しい設計要素を追加する場合は、まずオントロジーに追加してください

---

_最終更新: 2026年1月24日_
