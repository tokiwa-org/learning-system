# 環境構築の確認

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 2
subStep: 5
title: "環境構築の確認"
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

> Day 1の終盤。環境構築、Gitリポジトリ、データベースの準備が終わった。
>
> 「ちょっと待って。本当に全部できてるかな？」
>
> 月8で学んだ「セルフチェック」を思い出す。
>
> 次のステップに進む前に、今日やったことを確認しておこう。

---

## ミッション概要

Day 1で構築した環境が正しく設定されているか確認してください。

### 達成条件

- [ ] プロジェクト構造が正しいことを確認した
- [ ] Gitリポジトリが正しく設定されていることを確認した
- [ ] データベースが正しく作成されていることを確認した
- [ ] 全ての確認項目をパスした

---

## Part 1: プロジェクト構造の確認

### タスク 1-1: ディレクトリ構造の確認

```bash
cd ~/projects/internal-tools-page

# ディレクトリ構造を表示
ls -la
ls -la data/
ls -la docs/
ls -la docs/daily/
ls -la docs/report/
```

### 期待される構造

```
internal-tools-page/
├── .git/                    # Gitディレクトリ
├── .gitignore               # Git除外設定
├── data/
│   ├── .gitkeep
│   ├── create_tables.sql    # テーブル定義
│   ├── insert_data.sql      # サンプルデータ
│   └── tools.db             # データベースファイル
└── docs/
    ├── .gitkeep
    ├── daily/
    │   ├── .gitkeep
    │   └── day1.md          # Day 1日報
    └── report/
        └── .gitkeep
```

### チェックリスト

| # | 確認項目 | 確認コマンド | OK? |
|---|---------|-------------|-----|
| 1 | プロジェクトフォルダが存在する | `ls ~/projects/internal-tools-page` | [ ] |
| 2 | .gitignore が存在する | `ls -la \| grep .gitignore` | [ ] |
| 3 | data/ ディレクトリが存在する | `ls data/` | [ ] |
| 4 | docs/ ディレクトリが存在する | `ls docs/` | [ ] |
| 5 | docs/daily/ が存在する | `ls docs/daily/` | [ ] |
| 6 | docs/report/ が存在する | `ls docs/report/` | [ ] |

---

## Part 2: Gitリポジトリの確認

### タスク 2-1: Gitの状態確認

```bash
cd ~/projects/internal-tools-page

# Git設定の確認
git status

# コミット履歴の確認
git log --oneline
```

### 期待される出力

**git status:**
```
On branch main
nothing to commit, working tree clean
```

**git log --oneline:**
```
xxxxxxx Day 1 日報を追加
xxxxxxx サンプルデータ投入用SQLスクリプトを追加
xxxxxxx データベーステーブル定義のSQLスクリプトを追加
xxxxxxx プロジェクトの初期構造を作成
```

### タスク 2-2: .gitignore の確認

```bash
cat .gitignore
```

### 期待される内容

```
# Database files
*.db

# OS generated files
.DS_Store
Thumbs.db

# Editor files
*.swp
*.swo
*~
.vscode/
.idea/
```

### タスク 2-3: 追跡ファイルの確認

```bash
# Gitが追跡しているファイル一覧
git ls-files
```

**重要:** `.db` ファイルが含まれていないことを確認してください。

### チェックリスト

| # | 確認項目 | OK? |
|---|---------|-----|
| 1 | `git status` で "working tree clean" と表示される | [ ] |
| 2 | コミットが4件以上ある | [ ] |
| 3 | .gitignore に *.db が含まれている | [ ] |
| 4 | `git ls-files` に .db ファイルが含まれていない | [ ] |

---

## Part 3: データベースの確認

### タスク 3-1: データベースファイルの存在確認

```bash
ls -la data/tools.db
```

ファイルサイズが 0 より大きいことを確認してください。

### タスク 3-2: テーブル構造の確認

```bash
sqlite3 data/tools.db ".schema tools"
```

### 期待される出力

```sql
CREATE TABLE tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    url TEXT,
    rating REAL
);
```

### タスク 3-3: データ件数の確認

```bash
sqlite3 data/tools.db "SELECT COUNT(*) FROM tools;"
```

### 期待される出力

```
10
```

### タスク 3-4: サンプルデータの確認

```bash
sqlite3 -header -column data/tools.db "SELECT id, name, category FROM tools;"
```

### 期待される出力（例）

```
id  name         category
--  -----------  ------------------
1   Slack        コミュニケーション
2   VS Code      開発ツール
3   GitHub       開発ツール
...
```

10件のデータが表示されればOKです。

### チェックリスト

| # | 確認項目 | OK? |
|---|---------|-----|
| 1 | tools.db ファイルが存在する | [ ] |
| 2 | tools テーブルが存在する | [ ] |
| 3 | データが10件登録されている | [ ] |
| 4 | 各レコードに name, category, url, rating がある | [ ] |

---

## Part 4: SQLスクリプトの確認

### タスク 4-1: テーブル定義スクリプトの確認

```bash
cat data/create_tables.sql
```

CREATE TABLE 文が含まれていることを確認してください。

### タスク 4-2: データ投入スクリプトの確認

```bash
cat data/insert_data.sql
```

10件の INSERT 文が含まれていることを確認してください。

### タスク 4-3: データベースの再作成テスト（オプション）

スクリプトが正しく動作するか確認したい場合：

```bash
# バックアップを作成
cp data/tools.db data/tools.db.backup

# 新しいDBで再作成テスト
rm data/tools.db
sqlite3 data/tools.db < data/create_tables.sql
sqlite3 data/tools.db < data/insert_data.sql

# 確認
sqlite3 data/tools.db "SELECT COUNT(*) FROM tools;"
# 出力: 10

# バックアップを削除（正常に動作した場合）
rm data/tools.db.backup
```

---

## Part 5: 総合確認

### Day 1 完了チェックリスト

全ての項目にチェックが入れば、Day 1の作業は完了です。

#### プロジェクト構造

- [ ] プロジェクトフォルダが作成されている
- [ ] 必要なサブディレクトリ（data/, docs/, docs/daily/, docs/report/）が存在する
- [ ] .gitignore が作成されている

#### Gitリポジトリ

- [ ] Gitリポジトリが初期化されている
- [ ] 4件以上のコミットがある
- [ ] .db ファイルが追跡から除外されている
- [ ] working tree が clean である

#### データベース

- [ ] tools.db が存在する
- [ ] tools テーブルが正しい構造で作成されている
- [ ] 10件のサンプルデータが投入されている
- [ ] SQLスクリプト（create_tables.sql, insert_data.sql）が保存されている

#### ドキュメント

- [ ] Day 1の日報が作成されている

---

## 問題があった場合

### よくある問題と解決方法

| 問題 | 原因 | 解決方法 |
|------|------|---------|
| .db ファイルがGitに追跡されている | .gitignore の作成順序 | `git rm --cached data/tools.db` |
| データベースが空 | INSERT の実行忘れ | `sqlite3 data/tools.db < data/insert_data.sql` |
| コミットが足りない | add/commit の漏れ | 漏れたファイルを add & commit |
| ディレクトリがない | mkdir の実行忘れ | `mkdir -p docs/daily docs/report` |

---

## まとめ

| カテゴリ | 確認ポイント |
|----------|-------------|
| プロジェクト構造 | ディレクトリ、.gitignore |
| Git | コミット数、追跡ファイル、状態 |
| データベース | テーブル構造、データ件数 |
| ドキュメント | 日報 |

- [ ] プロジェクト構造を確認した
- [ ] Gitリポジトリを確認した
- [ ] データベースを確認した
- [ ] 全ての確認項目をパスした

---

## 次のステップへ

環境構築の確認お疲れさまでした。

全ての確認項目をパスしたら、Step 2の最終チェックポイント（クイズ）に進みましょう。
Day 1の作業内容を振り返ります。

---

*推定所要時間: 30分*
