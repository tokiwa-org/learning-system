# データを分析しよう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 3
subStep: 2
title: "データを分析しよう"
itemType: EXERCISE
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "総合"
  category: "総合演習"
  target_level: "L0"
```

---

## ストーリー

> データの取得方法は思い出した。次は分析だ。
>
> 「Webページの構成を考えるために、データの傾向を把握しよう」
>
> GROUP BY、COUNT、AVG...月3で学んだ集計関数を使えば、
> カテゴリ別の傾向がわかる。

---

## ミッション概要

集計関数と GROUP BY を使って、社内ツールのデータを分析してください。

### 達成条件

- [ ] カテゴリ別の集計ができた
- [ ] 評価の統計値（平均、最大、最小）を算出できた
- [ ] 分析結果をファイルに保存した
- [ ] Webページの構成方針を決められた

---

## Part 1: カテゴリ別の集計

### タスク 1-1: カテゴリ別のツール数

```bash
cd ~/projects/internal-tools-page

sqlite3 -header -column data/tools.db \
  "SELECT category, COUNT(*) as tool_count
   FROM tools
   GROUP BY category
   ORDER BY tool_count DESC;"
```

期待される出力：
```
category            tool_count
------------------  ----------
コミュニケーション    3
開発ツール            3
ドキュメント          2
デザイン              1
プロジェクト管理      1
```

### タスク 1-2: カテゴリ別の平均評価

```bash
sqlite3 -header -column data/tools.db \
  "SELECT category, ROUND(AVG(rating), 2) as avg_rating
   FROM tools
   GROUP BY category
   ORDER BY avg_rating DESC;"
```

<details>
<summary>ヒント: ROUND関数</summary>

`ROUND(AVG(rating), 2)` は、平均値を小数点以下2桁に丸めます。

- `ROUND(4.5333, 2)` → `4.53`
- `ROUND(4.5, 2)` → `4.5`

</details>

### タスク 1-3: カテゴリ別の統合分析

```bash
sqlite3 -header -column data/tools.db \
  "SELECT
     category,
     COUNT(*) as count,
     ROUND(AVG(rating), 2) as avg_rating,
     MAX(rating) as max_rating,
     MIN(rating) as min_rating
   FROM tools
   GROUP BY category
   ORDER BY avg_rating DESC;"
```

---

## Part 2: 評価の統計分析

### タスク 2-1: 全体の統計値

```bash
sqlite3 -header -column data/tools.db \
  "SELECT
     COUNT(*) as total_tools,
     ROUND(AVG(rating), 2) as avg_rating,
     MAX(rating) as max_rating,
     MIN(rating) as min_rating
   FROM tools;"
```

### タスク 2-2: 評価の分布

```bash
sqlite3 -header -column data/tools.db \
  "SELECT
     CASE
       WHEN rating >= 4.5 THEN '高評価 (4.5以上)'
       WHEN rating >= 4.0 THEN '中評価 (4.0-4.4)'
       ELSE '要改善 (4.0未満)'
     END as rating_group,
     COUNT(*) as count
   FROM tools
   GROUP BY rating_group
   ORDER BY rating_group DESC;"
```

<details>
<summary>ヒント: CASE文とは</summary>

`CASE ... WHEN ... THEN ... ELSE ... END` は、SQLの条件分岐です。
プログラミングの `if-else` に相当します。

```sql
CASE
  WHEN 条件1 THEN 結果1
  WHEN 条件2 THEN 結果2
  ELSE デフォルト結果
END
```

rating の値に応じて「高評価」「中評価」「要改善」にグループ分けしています。

</details>

### タスク 2-3: 評価トップ3とワースト3

```bash
# トップ3
sqlite3 -header -column data/tools.db \
  "SELECT name, category, rating FROM tools ORDER BY rating DESC LIMIT 3;"

# ワースト3
sqlite3 -header -column data/tools.db \
  "SELECT name, category, rating FROM tools ORDER BY rating ASC LIMIT 3;"
```

---

## Part 3: 分析結果のまとめ

### タスク 3-1: 分析レポートの作成

分析結果をファイルにまとめます。

```bash
cat > docs/analysis.md << 'EOF'
# 社内ツール分析レポート

## 全体サマリー
- 登録ツール数: 10
- 平均評価: 4.39
- 最高評価: 4.8（VS Code）
- 最低評価: 3.9（Confluence）

## カテゴリ別分析

| カテゴリ | ツール数 | 平均評価 |
|---------|---------|---------|
| コミュニケーション | 3 | 4.40 |
| 開発ツール | 3 | 4.60 |
| ドキュメント | 2 | 4.15 |
| デザイン | 1 | 4.60 |
| プロジェクト管理 | 1 | 4.00 |

## 評価トップ3
1. VS Code (4.8) - 開発ツール
2. GitHub (4.7) - 開発ツール
3. Figma (4.6) - デザイン

## Webページへの反映方針
- カテゴリ別にセクションを分けて表示する
- カテゴリの表示順: 開発ツール → コミュニケーション → ドキュメント → デザイン → プロジェクト管理
  （ツール数の多い順）
- 各カテゴリ内は評価の高い順に表示する
EOF
```

### タスク 3-2: コミット

```bash
git add docs/analysis.md
git commit -m "データ分析レポートを追加"
```

---

## Part 4: Webページの構成を決める

分析結果をもとに、Webページの構成を考えます。

### ページ構成案

```
┌─────────────────────────────┐
│  ヘッダー: 社内ツール紹介    │
├─────────────────────────────┤
│  ナビゲーション              │
│  [開発] [コミュニケーション]  │
│  [ドキュメント] [デザイン]   │
│  [プロジェクト管理]          │
├─────────────────────────────┤
│  サマリー                    │
│  全10ツール、5カテゴリ       │
├─────────────────────────────┤
│  開発ツール (3)              │
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │VS   │ │Git  │ │Doc  │  │
│  │Code │ │Hub  │ │ker  │  │
│  └─────┘ └─────┘ └─────┘  │
├─────────────────────────────┤
│  コミュニケーション (3)      │
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │Slack│ │G.W. │ │Zoom │  │
│  └─────┘ └─────┘ └─────┘  │
├─────────────────────────────┤
│  ... 他カテゴリ              │
├─────────────────────────────┤
│  フッター                    │
└─────────────────────────────┘
```

---

## まとめ

| 操作 | SQL |
|------|-----|
| カテゴリ別集計 | `GROUP BY category` |
| 件数 | `COUNT(*)` |
| 平均 | `AVG(rating)` |
| 最大/最小 | `MAX(rating)` / `MIN(rating)` |
| 小数丸め | `ROUND(value, 2)` |
| 条件分岐 | `CASE WHEN ... THEN ... END` |

- [ ] カテゴリ別の集計ができた
- [ ] 評価の統計値を算出できた
- [ ] 分析レポートを作成した
- [ ] Webページの構成方針を決めた
- [ ] 分析レポートをコミットした

---

## 次のステップへ

データ分析が完了し、Webページの構成も決まりました。

次のセクションでは、ツールのURLにアクセスできるか調査します。
月4で学んだネットワークの知識を使いましょう。

---

*推定所要時間: 60分*
