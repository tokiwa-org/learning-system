# SQLでデータを取得しよう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 3
subStep: 1
title: "SQLでデータを取得しよう"
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

> Day 2の朝。データベースの準備は昨日完了した。
>
> 「今日はデータの取得と分析だ。Webページに載せる情報を整理しよう」
>
> 月3で学んだSQLを使って、必要なデータを取り出す。
>
> SELECT、WHERE、ORDER BY...。あの頃は難しく感じたけど、今はもう手が覚えている。

---

## ミッション概要

SQLを使って社内ツールの情報を様々な条件で取得してください。

### 達成条件

- [ ] 全ツールの一覧を取得できた
- [ ] 特定のカテゴリでフィルタリングできた
- [ ] 評価順に並び替えできた
- [ ] 必要な列だけを選択できた
- [ ] クエリ結果をファイルに保存した

---

## Part 1: 基本的なデータ取得

### タスク 1-1: 全ツールの一覧を取得

```bash
cd ~/projects/internal-tools-page

sqlite3 -header -column data/tools.db "SELECT * FROM tools;"
```

すべてのツール情報が表示されることを確認してください。

### タスク 1-2: 必要な列だけを取得

Webページに表示する情報だけを取得します。

```bash
sqlite3 -header -column data/tools.db \
  "SELECT name, description, category, url FROM tools;"
```

<details>
<summary>ヒント: なぜ全列ではなく必要な列だけ取得するのか</summary>

実際の開発では、`SELECT *` は避けることが推奨されます。理由は：

1. 不要なデータまで取得するとパフォーマンスが下がる
2. どの列を使っているか明確になる
3. テーブル構造が変わっても影響を受けにくい

今回は `id` と `rating` は表示に直接使わないので、必要な4列だけ取得します。

</details>

### タスク 1-3: ツール名だけの一覧

```bash
sqlite3 data/tools.db "SELECT name FROM tools;"
```

---

## Part 2: 条件付きデータ取得（WHERE）

### タスク 2-1: カテゴリ別のツール取得

「開発ツール」カテゴリのツールだけを取得してください。

```bash
sqlite3 -header -column data/tools.db \
  "SELECT name, description FROM tools WHERE category = '開発ツール';"
```

期待される出力：
```
name     description
-------  ------------------------------------------------
VS Code  軽量で高機能なコードエディタ...
GitHub   Gitリポジトリのホスティングサービス...
Docker   コンテナ型仮想化プラットフォーム...
```

### タスク 2-2: 自分で他のカテゴリも取得してみよう

以下のカテゴリについてもクエリを実行してください。

| カテゴリ | クエリ |
|---------|--------|
| コミュニケーション | `WHERE category = 'コミュニケーション'` |
| ドキュメント | `WHERE category = 'ドキュメント'` |
| デザイン | `WHERE category = 'デザイン'` |
| プロジェクト管理 | `WHERE category = 'プロジェクト管理'` |

<details>
<summary>ヒント: コミュニケーションカテゴリの例</summary>

```bash
sqlite3 -header -column data/tools.db \
  "SELECT name, description FROM tools WHERE category = 'コミュニケーション';"
```

Slack, Zoom, Google Workspace の3件が表示されるはずです。

</details>

### タスク 2-3: 評価が高いツールの取得

評価（rating）が4.5以上のツールを取得してください。

```bash
sqlite3 -header -column data/tools.db \
  "SELECT name, category, rating FROM tools WHERE rating >= 4.5;"
```

---

## Part 3: 並び替え（ORDER BY）

### タスク 3-1: 評価の高い順に並び替え

```bash
sqlite3 -header -column data/tools.db \
  "SELECT name, category, rating FROM tools ORDER BY rating DESC;"
```

### タスク 3-2: カテゴリ別、評価順に並び替え

Webページではカテゴリ別に表示するので、カテゴリでグループ化して表示します。

```bash
sqlite3 -header -column data/tools.db \
  "SELECT category, name, rating FROM tools ORDER BY category, rating DESC;"
```

<details>
<summary>ヒント: ORDER BY に複数の列を指定する</summary>

`ORDER BY category, rating DESC` は以下の意味です：
1. まず `category` で昇順（A→Z）に並べる
2. 同じカテゴリ内では `rating` で降順（高→低）に並べる

これで、カテゴリ別に評価の高い順で表示されます。

</details>

### タスク 3-3: 名前のアルファベット順

```bash
sqlite3 -header -column data/tools.db \
  "SELECT name, category FROM tools ORDER BY name;"
```

---

## Part 4: クエリ結果の保存

Webページ作成時に参照しやすいよう、クエリ結果をファイルに保存します。

### タスク 4-1: カテゴリ別ツール一覧をファイルに保存

```bash
sqlite3 -header -column data/tools.db \
  "SELECT category, name, description, url FROM tools ORDER BY category, name;" \
  > docs/tool_list.txt
```

### タスク 4-2: 保存したファイルを確認

```bash
cat docs/tool_list.txt
```

### タスク 4-3: Webページ用のクエリをSQLファイルとして保存

```bash
cat > data/queries.sql << 'EOF'
-- Webページ用クエリ集

-- 全ツール一覧（カテゴリ別、名前順）
SELECT category, name, description, url, rating
FROM tools
ORDER BY category, name;

-- カテゴリ一覧
SELECT DISTINCT category FROM tools ORDER BY category;

-- カテゴリ別ツール数
SELECT category, COUNT(*) as tool_count
FROM tools
GROUP BY category
ORDER BY tool_count DESC;

-- 評価トップ3
SELECT name, category, rating
FROM tools
ORDER BY rating DESC
LIMIT 3;
EOF
```

### タスク 4-4: コミット

```bash
git add data/queries.sql docs/tool_list.txt
git commit -m "データ取得用クエリとツール一覧を追加"
```

---

## 達成度チェック

以下のクエリがすべて実行できることを確認してください。

```bash
# 全件取得
sqlite3 data/tools.db "SELECT COUNT(*) FROM tools;"
# → 10

# カテゴリ別フィルタ
sqlite3 data/tools.db "SELECT COUNT(*) FROM tools WHERE category = '開発ツール';"
# → 3

# 評価の高い順
sqlite3 data/tools.db "SELECT name FROM tools ORDER BY rating DESC LIMIT 1;"
# → VS Code
```

---

## まとめ

| 操作 | SQL |
|------|-----|
| 全件取得 | `SELECT * FROM tools` |
| 列の選択 | `SELECT name, category FROM tools` |
| 条件指定 | `WHERE category = '開発ツール'` |
| 並び替え | `ORDER BY rating DESC` |
| 件数制限 | `LIMIT 3` |

- [ ] 全ツール一覧を取得できた
- [ ] カテゴリ別にフィルタリングできた
- [ ] 評価順に並び替えできた
- [ ] クエリ結果をファイルに保存した
- [ ] クエリをコミットした

---

## 次のステップへ

基本的なデータ取得ができました。

次のセクションでは、GROUP BY や集計関数を使ってデータを分析します。
Webページのコンテンツ構成を決めるための情報を集めましょう。

---

*推定所要時間: 60分*
