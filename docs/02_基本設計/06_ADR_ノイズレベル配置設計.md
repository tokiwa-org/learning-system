# ADR-001: 教育的ノイズレベルの配置場所

## ステータス

承認済み

## コンテキスト

教育的ノイズ（不確実性・複雑性）をカリキュラムに組み込むにあたり、noiseLevel をどのエンティティに配置すべきかを検討した。

### 初期設計（Neo4j オントロジー）

当初、`noiseLevel` は `RoadmapItem`（スキル項目）に付与されていた：

```
RoadmapItem {
  no: 5,
  name: "データベース",
  noiseLevel: "MINIMAL"  // ← ここに配置
}
```

**問題点**:

1. **スキルの性質 vs 学習者のレベル**: 同じスキル（例：データベース）でも、L1学習者には MINIMAL なノイズで、L5学習者には HIGH なノイズで教えるべき
2. **教育的ノイズの定義との不整合**: 「ノイズ濃度はフェーズ（学習者レベル）に応じて段階的に上げる」という設計原則に反する
3. **柔軟性の欠如**: 同じスキルを異なる対象者に異なるノイズレベルで教えられない

## 決定

**`noiseLevel` を `Curriculum` エンティティに配置する。**

```typescript
interface Curriculum {
  // ...
  noiseLevel: NoiseLevel;      // MINIMAL | LOW | MEDIUM | HIGH | MAXIMUM
  noiseTypes?: NoiseType[];    // 具体的なノイズの種類
  noiseDesignNotes?: string;   // 査閲者向け説明
}
```

### ノイズレベルの対象職級マッピング

| 対象職級 | noiseLevel | ノイズ濃度 | 推奨 noiseTypes |
|---------|------------|-----------|-----------------|
| L1（新人） | MINIMAL | 最小限 | - |
| L1→L2 | LOW | 10% | information_incomplete |
| L2→L3 | MEDIUM | 30% | technical_debt |
| L3→L4 | HIGH | 50% | excessive_choices |
| L4→L5 | MAXIMUM | 70% | context_fluctuation |

## 影響

### Neo4j オントロジー

`RoadmapItem.noiseLevel` は**参照情報として残す**が、実際のカリキュラム生成では使用しない。

残す理由：スキルの「複雑性の目安」として有用（例：アーキテクチャ設計は本質的に HIGH）

### データベース

新規マイグレーション `0006_curriculum_noise_level.sql` で以下を追加：

```sql
ALTER TABLE curriculums ADD COLUMN noise_level TEXT DEFAULT 'MINIMAL'
    CHECK (noise_level IN ('MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'MAXIMUM'));
ALTER TABLE curriculums ADD COLUMN noise_design_notes TEXT;
```

### ドメインエンティティ

`curriculum.ts` に `NoiseLevel` 型と関連フィールドを追加。

## 代替案

### 案B: オーバーライド方式

`RoadmapItem.noiseLevel` を基準として、`Curriculum` でオーバーライド可能にする。

**不採用理由**: 複雑性が増し、どちらの値が使用されるか不明確になる。

### 案C: レベル別プロパティ

`RoadmapItem` に `noiseLevelL1`, `noiseLevelL2`, ... のようにレベル別プロパティを持たせる。

**不採用理由**: スキーマが肥大化し、柔軟性が失われる。

## 参考資料

- [09_教育的ノイズ](../99_参考資料/09_教育的ノイズ.md)
- [10_改善提案](../99_参考資料/10_改善提案.md)
- [11_ミッション設計ガイド](../99_参考資料/11_ミッション設計ガイド.md)

## 日付

2026-01-25
