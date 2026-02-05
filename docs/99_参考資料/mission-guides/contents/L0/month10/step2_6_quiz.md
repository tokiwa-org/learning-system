# チェックポイント：環境構築

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 2
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "総合"
  category: "総合演習"
  target_level: "L0"
```

---

## このチェックポイントについて

Step 2（Day 1: 環境構築）で行った作業を確認します。

- 全8問
- 合格ライン：6問以上正解

---

## 問題

### Q1: プロジェクトのディレクトリ構造で、データベースファイルを置くべきディレクトリは？

A) docs/
B) data/
C) src/
D) db/

<details>
<summary>答えを見る</summary>

**正解: B) data/**

データに関するファイル（データベース、SQLスクリプト）は `data/` ディレクトリに配置します。`docs/` はドキュメント用です。

</details>

---

### Q2: .gitignore に `*.db` を追加する理由は？

A) データベースファイルは大きすぎるから
B) データベースファイルにはパスワードが含まれるから
C) バイナリファイルはGitで管理しづらく、SQLスクリプトで再現できるから
D) GitHubの容量制限に引っかかるから

<details>
<summary>答えを見る</summary>

**正解: C) バイナリファイルはGitで管理しづらく、SQLスクリプトで再現できるから**

データベースファイルはバイナリ形式で差分管理が難しいです。代わりにSQLスクリプト（create_tables.sql, insert_data.sql）をバージョン管理することで、データベースを再現できます。

</details>

---

### Q3: Gitリポジトリを初期化するコマンドは？

A) `git create`
B) `git new`
C) `git init`
D) `git start`

<details>
<summary>答えを見る</summary>

**正解: C) `git init`**

`git init` でカレントディレクトリにGitリポジトリを初期化します。これにより `.git/` ディレクトリが作成され、バージョン管理が開始されます。

</details>

---

### Q4: SQLiteでテーブルを作成するSQLコマンドは？

A) `MAKE TABLE`
B) `NEW TABLE`
C) `CREATE TABLE`
D) `BUILD TABLE`

<details>
<summary>答えを見る</summary>

**正解: C) `CREATE TABLE`**

テーブルを作成するには `CREATE TABLE テーブル名 (列定義...)` を使用します。これは月3で学んだSQL文法です。

</details>

---

### Q5: SQLiteでデータを挿入するコマンドは？

A) `ADD INTO`
B) `INSERT INTO`
C) `PUT INTO`
D) `SET INTO`

<details>
<summary>答えを見る</summary>

**正解: B) `INSERT INTO`**

データを挿入するには `INSERT INTO テーブル名 (列名...) VALUES (値...)` を使用します。

</details>

---

### Q6: 以下のうち、Day 1で作成すべきでないファイルは？

A) .gitignore
B) data/create_tables.sql
C) index.html
D) docs/daily/day1.md

<details>
<summary>答えを見る</summary>

**正解: C) index.html**

`index.html`（Webページ）はDay 3で作成します。Day 1は環境構築とデータベース準備に集中します。計画に沿って作業を進めることが大切です。

</details>

---

### Q7: 日報に必ず含めるべき項目でないものは？

A) 今日やったこと
B) 明日やること
C) 先輩の評価
D) 困っていること

<details>
<summary>答えを見る</summary>

**正解: C) 先輩の評価**

日報には「今日やったこと」「明日やること」「困っていること」「所感」を書きます。先輩の評価は日報の内容ではなく、日報を読んだ後に先輩が行うものです。

</details>

---

### Q8: Gitで「変更をステージングエリアに追加し、コミットする」正しいコマンドの組み合わせは？

A) `git commit` → `git add`
B) `git add` → `git commit`
C) `git push` → `git commit`
D) `git save` → `git store`

<details>
<summary>答えを見る</summary>

**正解: B) `git add` → `git commit`**

まず `git add` で変更をステージングエリアに追加し、次に `git commit` でコミット（記録）します。この順番は月2で学んだ基本的なGitのワークフローです。

</details>

---

## 採点

| 正解数 | 判定 |
|--------|------|
| 8問 | 完璧！Day 1の作業を完全に理解しています |
| 6-7問 | 合格！基本を押さえています |
| 4-5問 | もう少し。Step 2を振り返りましょう |
| 3問以下 | 復習が必要です |

---

## 復習ポイント

間違えた問題があれば、以下のセクションを復習してください。

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q2 | Step 2-1: 作業環境を準備しよう |
| Q3 | Step 2-2: Gitリポジトリを作成しよう |
| Q4, Q5 | Step 2-3: データベースを準備しよう |
| Q6 | Step 1-3: 作業計画を立てよう |
| Q7 | Step 2-4: 初日の日報を書こう |
| Q8 | 月2: Git/バージョン管理 |

---

## Day 1 完了サマリー

### 作業内容

| タスク | 状態 |
|--------|------|
| プロジェクトフォルダ作成 | 完了 |
| Gitリポジトリ初期化 | 完了 |
| .gitignore 作成 | 完了 |
| SQLiteデータベース作成 | 完了 |
| テーブル定義 | 完了 |
| サンプルデータ10件投入 | 完了 |
| Day 1日報作成 | 完了 |

### 成果物

- プロジェクト構造（ディレクトリ、.gitignore）
- データベース（tools.db）
- SQLスクリプト（create_tables.sql, insert_data.sql）
- Day 1日報

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ディレクトリ構成 | data/, docs/, docs/daily/, docs/report/ |
| Git | init → add → commit の流れ |
| SQLite | CREATE TABLE, INSERT INTO |
| 日報 | やったこと、明日やること、困りごと、所感 |

- [ ] 8問中6問以上正解した
- [ ] 間違えた問題の復習ができた
- [ ] Day 2に進む準備ができた

---

## 次のステップへ

Day 1 チェックポイントお疲れさまでした。

次のStep 3では、Day 2の作業に入ります。
データベースから本格的にデータを取得・分析します。
月3で学んだSQL操作をフル活用しましょう。

「Day 2: データの日」のスタートです！

---

*推定所要時間: 30分*
