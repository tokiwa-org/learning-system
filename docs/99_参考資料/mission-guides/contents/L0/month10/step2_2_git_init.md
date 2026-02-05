# Gitリポジトリを作成しよう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 2
subStep: 2
title: "Gitリポジトリを作成しよう"
itemType: EXERCISE
estimatedMinutes: 45
noiseLevel: MINIMAL
roadmap:
  skill: "総合"
  category: "総合演習"
  target_level: "L0"
```

---

## ストーリー

> 「環境は整った。次はGitリポジトリの初期化だ」
>
> 月2で学んだ `git init` を思い出す。
>
> 「最初のコミットは『プロジェクトの骨格を作成』でいいかな」
>
> こまめなコミットで作業の履歴を残す。これも先輩に教わったことだ。

---

## ミッション概要

プロジェクトフォルダをGitリポジトリとして初期化し、最初のコミットを行ってください。

### 達成条件

- [ ] `git init` でリポジトリを初期化できた
- [ ] Git設定（user.name, user.email）を確認した
- [ ] 最初のコミットを作成できた
- [ ] `git log` でコミットが確認できた

---

## Part 1: リポジトリの初期化

### タスク 1-1: git init

```bash
# プロジェクトフォルダに移動
cd ~/projects/internal-tools-page

# リポジトリを初期化
git init
```

期待される出力：
```
Initialized empty Git repository in /home/yourname/projects/internal-tools-page/.git/
```

### タスク 1-2: Git設定の確認

```bash
# ユーザー名の確認
git config user.name

# メールアドレスの確認
git config user.email
```

<details>
<summary>ヒント: 設定がされていない場合</summary>

```bash
# ユーザー名を設定
git config --global user.name "あなたの名前"

# メールアドレスを設定
git config --global user.email "your.email@example.com"
```

</details>

### タスク 1-3: 状態の確認

```bash
git status
```

期待される出力：
```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .gitignore
        index.html
        style.css

nothing added to commit but untracked files present (use "git add" to track)
```

> `data/` と `docs/` が表示されないのは、空のフォルダはGitが追跡しないためです。

---

## Part 2: 空フォルダをGitで管理する

Gitは空のフォルダを追跡しません。フォルダ構造を保持するために `.gitkeep` ファイルを配置します。

### タスク 2-1: .gitkeep の配置

```bash
# 各フォルダに .gitkeep を作成
touch data/.gitkeep
touch docs/daily/.gitkeep
touch docs/report/.gitkeep
```

### タスク 2-2: 確認

```bash
# ファイルが作成されたか確認
find . -name ".gitkeep"
```

期待される出力：
```
./data/.gitkeep
./docs/daily/.gitkeep
./docs/report/.gitkeep
```

<details>
<summary>ヒント: .gitkeep とは？</summary>

`.gitkeep` はGitの公式機能ではなく、慣習的に使われる空ファイルです。Gitは空のディレクトリを追跡できないため、このファイルを置くことでディレクトリ構造を保持します。

名前は何でもよいのですが、`.gitkeep` が広く使われています。

</details>

---

## Part 3: 最初のコミット

### タスク 3-1: ファイルをステージング

```bash
# すべてのファイルをステージング
git add .

# 状態確認
git status
```

期待される出力：
```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   .gitignore
        new file:   data/.gitkeep
        new file:   docs/daily/.gitkeep
        new file:   docs/report/.gitkeep
        new file:   index.html
        new file:   style.css
```

### タスク 3-2: 最初のコミット

```bash
git commit -m "プロジェクトの初期構造を作成"
```

<details>
<summary>ヒント: コミットメッセージのポイント</summary>

最初のコミットは「プロジェクトの骨格を作った」ことが伝わるメッセージにします。

良い例：
- `プロジェクトの初期構造を作成`
- `初期セットアップ`
- `プロジェクト骨格を構築`

避けたい例：
- `first commit`（何をしたかわからない）
- `test`（意味がない）

</details>

### タスク 3-3: コミットの確認

```bash
# コミット履歴を確認
git log --oneline
```

期待される出力（例）：
```
abc1234 プロジェクトの初期構造を作成
```

---

## Part 4: SQLスクリプトの準備

データベースの作成手順をSQLファイルとして保存します。こうすることで、誰でもデータベースを再現できます。

### タスク 4-1: SQLスクリプトファイルの作成

```bash
cat > data/create_tables.sql << 'EOF'
-- 社内ツール紹介ページ用データベース
-- テーブル作成スクリプト

CREATE TABLE IF NOT EXISTS tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT,
    rating REAL DEFAULT 0.0
);
EOF
```

### タスク 4-2: コミット

```bash
git add data/create_tables.sql
git commit -m "データベーステーブル定義のSQLスクリプトを追加"
```

### タスク 4-3: 履歴の確認

```bash
git log --oneline
```

期待される出力（例）：
```
def5678 データベーステーブル定義のSQLスクリプトを追加
abc1234 プロジェクトの初期構造を作成
```

2つのコミットが表示されていれば成功です。

---

## 達成度チェック

```bash
# コミット数を確認
git log --oneline | wc -l
```

- 2以上 → 基本課題クリア！

```bash
# 追跡ファイル一覧を確認
git ls-files
```

期待される出力：
```
.gitignore
data/.gitkeep
data/create_tables.sql
docs/daily/.gitkeep
docs/report/.gitkeep
index.html
style.css
```

---

## まとめ

| 操作 | コマンド |
|------|----------|
| リポジトリ初期化 | `git init` |
| 設定確認 | `git config user.name` |
| ステージング | `git add .` |
| コミット | `git commit -m "メッセージ"` |
| 履歴確認 | `git log --oneline` |

- [ ] リポジトリを初期化できた
- [ ] Git設定を確認した
- [ ] 最初のコミットを作成した
- [ ] SQLスクリプトをコミットした
- [ ] 2つのコミットが記録されている

---

## 次のステップへ

Gitリポジトリの準備が完了しました。

次のセクションでは、SQLiteデータベースを作成し、サンプルデータを投入します。
月3で学んだデータベース操作の出番です。

---

*推定所要時間: 45分*
