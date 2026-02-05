# データをエクスポートしよう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 3
subStep: 5
title: "データをエクスポートしよう"
itemType: EXERCISE
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "総合"
  category: "総合演習"
  target_level: "L0"
```

---

## ストーリー

> Day 2の夕方が近づいてきた。データの取得、分析、URL確認が終わった。
>
> 「明日のWebページ作成に向けて、使いやすい形でデータをまとめておこう」
>
> データベースから取得した情報を、HTMLで使いやすいフォーマットにエクスポートする。
>
> これがあれば、明日のページ作成がスムーズに進むはずだ。

---

## ミッション概要

Webページ作成に向けて、データをエクスポートし、整理しておきましょう。

### 達成条件

- [ ] ツール一覧をテキストファイルにエクスポートできた
- [ ] カテゴリ別のデータ整理ができた
- [ ] HTMLで使うための情報がまとまった
- [ ] エクスポートファイルをコミットした

---

## Part 1: ツール一覧のエクスポート

### タスク 1-1: 全ツールデータをエクスポート

Webページで使う情報（名前、カテゴリ、説明、URL、評価）をエクスポートします。

```bash
cd ~/projects/internal-tools-page

# ツール一覧をテキストファイルに出力
sqlite3 -header -column data/tools.db \
  "SELECT name, category, description, url, rating
   FROM tools
   ORDER BY category, rating DESC;" > docs/tool_list.txt

# 確認
cat docs/tool_list.txt
```

### タスク 1-2: カテゴリ別にグループ化した一覧

```bash
# カテゴリごとのツール一覧
sqlite3 data/tools.db "
SELECT '## ' || category || ' (' || COUNT(*) || '件)' as header
FROM tools
GROUP BY category
ORDER BY COUNT(*) DESC;
"
```

---

## Part 2: Webページ用データの整理

### タスク 2-1: カテゴリ別ツール一覧の作成

HTMLで使いやすいように、カテゴリ別にまとめたファイルを作成します。

```bash
cat > docs/tools_by_category.md << 'EOF'
# Webページ用ツールデータ

## カテゴリ一覧（表示順）

1. 開発ツール (3件)
2. コミュニケーション (3件)
3. ドキュメント (2件)
4. デザイン (1件)
5. プロジェクト管理 (1件)

---

## 開発ツール

### VS Code
- 評価: 4.8
- 説明: 高機能コードエディタ
- URL: https://code.visualstudio.com/

### GitHub
- 評価: 4.7
- 説明: ソースコード管理・共有プラットフォーム
- URL: https://github.com/

### Docker
- 評価: 4.3
- 説明: コンテナ化プラットフォーム
- URL: https://www.docker.com/

---

## コミュニケーション

### Slack
- 評価: 4.5
- 説明: チームコミュニケーションツール
- URL: https://slack.com/

### Google Workspace
- 評価: 4.4
- 説明: ビジネス向けコラボレーションツール
- URL: https://workspace.google.com/

### Zoom
- 評価: 4.3
- 説明: ビデオ会議ツール
- URL: https://zoom.us/

---

## ドキュメント

### Notion
- 評価: 4.5
- 説明: オールインワンワークスペース
- URL: https://www.notion.so/

### Confluence
- 評価: 3.9
- 説明: チームドキュメント管理ツール
- URL: https://www.atlassian.com/software/confluence

---

## デザイン

### Figma
- 評価: 4.6
- 説明: コラボレーションデザインツール
- URL: https://www.figma.com/

---

## プロジェクト管理

### Jira
- 評価: 4.0
- 説明: プロジェクト・課題管理ツール
- URL: https://www.atlassian.com/software/jira
EOF
```

### タスク 2-2: データを確認

```bash
cat docs/tools_by_category.md
```

---

## Part 3: HTMLテンプレート用メモ

### タスク 3-1: HTMLで必要な情報のメモ

明日のHTML作成で参照するメモを作成します。

```bash
cat > docs/html_prep.md << 'EOF'
# HTMLページ作成準備メモ

## ページ構成

```
┌─────────────────────────────────┐
│ header: 社内ツール紹介           │
├─────────────────────────────────┤
│ nav: [開発] [通信] [文書] ...   │
├─────────────────────────────────┤
│ main                            │
│   section#development           │
│     カード × 3                  │
│   section#communication         │
│     カード × 3                  │
│   section#documentation         │
│     カード × 2                  │
│   section#design                │
│     カード × 1                  │
│   section#project               │
│     カード × 1                  │
├─────────────────────────────────┤
│ footer: 作成者情報              │
└─────────────────────────────────┘
```

## 使用するHTML要素

- `<header>`: ページヘッダー
- `<nav>`: カテゴリナビゲーション
- `<main>`: メインコンテンツ
- `<section>`: 各カテゴリのセクション
- `<article>` または `<div class="tool-card">`: ツールカード
- `<footer>`: フッター

## 各ツールカードの情報

1. ツール名 (`<h3>`)
2. カテゴリ (視覚的なバッジ)
3. 説明文 (`<p>`)
4. 評価 (星マークまたは数値)
5. URL (外部リンク `<a target="_blank">`)

## CSSで必要なスタイル

- ヘッダー: 背景色、中央揃え
- ナビ: 横並び（flexbox）、ホバー効果
- カード: 影、角丸、パディング
- カードの横並び: flexbox または grid
- リンク: 色、ホバー効果
- レスポンシブ: メディアクエリ（オプション）

## カテゴリIDマッピング

| カテゴリ | section id | nav href |
|---------|-----------|----------|
| 開発ツール | #development | #development |
| コミュニケーション | #communication | #communication |
| ドキュメント | #documentation | #documentation |
| デザイン | #design | #design |
| プロジェクト管理 | #project | #project |
EOF

cat docs/html_prep.md
```

---

## Part 4: コミット

### タスク 4-1: エクスポートファイルをコミット

```bash
git add docs/tool_list.txt docs/tools_by_category.md docs/html_prep.md
git commit -m "Webページ用にデータをエクスポート"
```

### タスク 4-2: コミット履歴の確認

```bash
git log --oneline
```

---

## Part 5: Day 2 完了チェック

### 本日の成果物

| # | 成果物 | ファイル | 状態 |
|---|--------|---------|------|
| 1 | データ取得クエリ | data/queries.sql | 完了 |
| 2 | ツール一覧 | docs/tool_list.txt | 完了 |
| 3 | 分析レポート | docs/analysis.md | 完了 |
| 4 | URL確認結果 | docs/url_check.md | 完了 |
| 5 | カテゴリ別データ | docs/tools_by_category.md | 完了 |
| 6 | HTML準備メモ | docs/html_prep.md | 完了 |
| 7 | Day 2日報 | docs/daily/day2.md | 完了 |

### Day 2 総括

- データ取得: SQLで全件取得、カテゴリ別フィルタ、評価順並び替え
- データ分析: カテゴリ別集計、評価統計
- URL確認: 全10件のURL疎通確認
- エクスポート: Webページ用にデータを整理

---

## まとめ

| ポイント | 内容 |
|----------|------|
| データエクスポート | SQLの結果をファイルに保存 |
| カテゴリ整理 | Webページの構成に合わせて整理 |
| HTML準備 | 明日の作業がスムーズに進むようメモ |

- [ ] ツール一覧をエクスポートした
- [ ] カテゴリ別にデータを整理した
- [ ] HTML準備メモを作成した
- [ ] エクスポートファイルをコミットした

---

## 次のステップへ

データのエクスポートが完了しました。

次のセクションでは、Day 2のチェックポイント（クイズ）に挑戦します。
データ取得・分析の内容を振り返りましょう。

---

*推定所要時間: 30分*
