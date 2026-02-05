# データベースを準備しよう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 2
subStep: 3
title: "データベースを準備しよう"
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

> 「次はデータベースの準備だ。月3で学んだSQLiteを使おう」
>
> 先輩からの指示は「サンプルデータとして10個くらいツールを入れてね」だった。
>
> 社内で実際に使われているツールを思い出しながら、データを入れていく。

---

## ミッション概要

SQLiteデータベースを作成し、社内ツールのサンプルデータを10件投入してください。

### 達成条件

- [ ] SQLiteデータベースファイルを作成できた
- [ ] toolsテーブルを作成できた
- [ ] サンプルデータ10件を投入できた
- [ ] SELECTで全データを確認できた
- [ ] SQLスクリプトをコミットした

---

## Part 1: データベースの作成

### タスク 1-1: SQLiteデータベースの作成

```bash
# プロジェクトフォルダに移動
cd ~/projects/internal-tools-page

# SQLiteでデータベースを作成（作成と同時にテーブル定義を実行）
sqlite3 data/tools.db < data/create_tables.sql
```

### タスク 1-2: テーブルの確認

```bash
# SQLiteに接続してテーブルを確認
sqlite3 data/tools.db ".tables"
```

期待される出力：
```
tools
```

### タスク 1-3: テーブル構造の確認

```bash
sqlite3 data/tools.db ".schema tools"
```

期待される出力：
```
CREATE TABLE tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT,
    rating REAL DEFAULT 0.0
);
```

---

## Part 2: サンプルデータの投入

### タスク 2-1: INSERTスクリプトの作成

以下の内容で `data/insert_data.sql` を作成してください。

```bash
cat > data/insert_data.sql << 'EOF'
-- 社内ツール サンプルデータ
-- 10件の社内ツール情報

INSERT INTO tools (name, description, category, url, rating) VALUES
('Slack', 'チーム内のリアルタイムコミュニケーションツール。チャンネルごとに話題を整理できる。', 'コミュニケーション', 'https://slack.com', 4.5);

INSERT INTO tools (name, description, category, url, rating) VALUES
('VS Code', '軽量で高機能なコードエディタ。拡張機能が豊富で多くの言語に対応。', '開発ツール', 'https://code.visualstudio.com', 4.8);

INSERT INTO tools (name, description, category, url, rating) VALUES
('GitHub', 'Gitリポジトリのホスティングサービス。コードレビューやCI/CDも利用可能。', '開発ツール', 'https://github.com', 4.7);

INSERT INTO tools (name, description, category, url, rating) VALUES
('Docker', 'コンテナ型仮想化プラットフォーム。開発環境の統一に活用。', '開発ツール', 'https://www.docker.com', 4.3);

INSERT INTO tools (name, description, category, url, rating) VALUES
('Notion', 'オールインワンのワークスペース。ドキュメント、Wiki、プロジェクト管理に対応。', 'ドキュメント', 'https://www.notion.so', 4.4);

INSERT INTO tools (name, description, category, url, rating) VALUES
('Figma', 'ブラウザベースのUIデザインツール。チームでのリアルタイム共同編集が可能。', 'デザイン', 'https://www.figma.com', 4.6);

INSERT INTO tools (name, description, category, url, rating) VALUES
('Jira', 'プロジェクト管理・課題追跡ツール。アジャイル開発のスプリント管理に対応。', 'プロジェクト管理', 'https://www.atlassian.com/software/jira', 4.0);

INSERT INTO tools (name, description, category, url, rating) VALUES
('Confluence', 'チームWikiとドキュメント共有プラットフォーム。Jiraとの連携が強力。', 'ドキュメント', 'https://www.atlassian.com/software/confluence', 3.9);

INSERT INTO tools (name, description, category, url, rating) VALUES
('Zoom', 'ビデオ会議ツール。オンラインミーティングやウェビナーに利用。', 'コミュニケーション', 'https://zoom.us', 4.2);

INSERT INTO tools (name, description, category, url, rating) VALUES
('Google Workspace', 'メール、カレンダー、ドキュメントなどのビジネス向け統合ツール。', 'コミュニケーション', 'https://workspace.google.com', 4.5);
EOF
```

### タスク 2-2: データの投入

```bash
sqlite3 data/tools.db < data/insert_data.sql
```

### タスク 2-3: データの確認

```bash
# 全データを確認
sqlite3 -header -column data/tools.db "SELECT * FROM tools;"
```

期待される出力（一部）：
```
id  name              description                                          category          url                                          rating
--  ----------------  ---------------------------------------------------  ----------------  -------------------------------------------  ------
1   Slack             チーム内のリアルタイムコミュニケーションツール...     コミュニケーション  https://slack.com                             4.5
2   VS Code           軽量で高機能なコードエディタ...                      開発ツール         https://code.visualstudio.com                  4.8
...
```

10件のデータが表示されればOKです。

### タスク 2-4: 件数の確認

```bash
sqlite3 data/tools.db "SELECT COUNT(*) FROM tools;"
```

期待される出力：
```
10
```

---

## Part 3: 基本的なクエリの実行

データが正しく入っているか、いくつかのクエリで確認しましょう。

### タスク 3-1: カテゴリの一覧

```bash
sqlite3 data/tools.db "SELECT DISTINCT category FROM tools;"
```

期待される出力：
```
コミュニケーション
開発ツール
ドキュメント
デザイン
プロジェクト管理
```

### タスク 3-2: 評価の高い順に表示

```bash
sqlite3 -header -column data/tools.db "SELECT name, rating FROM tools ORDER BY rating DESC;"
```

### タスク 3-3: カテゴリ別の件数

```bash
sqlite3 -header -column data/tools.db "SELECT category, COUNT(*) as count FROM tools GROUP BY category;"
```

---

## Part 4: SQLスクリプトのコミット

### タスク 4-1: コミット

```bash
cd ~/projects/internal-tools-page

# INSERTスクリプトをステージング
git add data/insert_data.sql

# コミット
git commit -m "サンプルデータ投入用SQLスクリプトを追加"
```

### タスク 4-2: 履歴の確認

```bash
git log --oneline
```

期待される出力（例）：
```
ghi9012 サンプルデータ投入用SQLスクリプトを追加
def5678 データベーステーブル定義のSQLスクリプトを追加
abc1234 プロジェクトの初期構造を作成
```

3つのコミットが表示されていれば成功です。

---

## データベースの全体像

### テーブル構造

```
tools テーブル
+----+------------------+-------------+-------------------+-----+--------+
| id | name             | description | category          | url | rating |
+----+------------------+-------------+-------------------+-----+--------+
| 1  | Slack            | ...         | コミュニケーション | ... | 4.5    |
| 2  | VS Code          | ...         | 開発ツール         | ... | 4.8    |
| 3  | GitHub           | ...         | 開発ツール         | ... | 4.7    |
| 4  | Docker           | ...         | 開発ツール         | ... | 4.3    |
| 5  | Notion           | ...         | ドキュメント       | ... | 4.4    |
| 6  | Figma            | ...         | デザイン           | ... | 4.6    |
| 7  | Jira             | ...         | プロジェクト管理   | ... | 4.0    |
| 8  | Confluence       | ...         | ドキュメント       | ... | 3.9    |
| 9  | Zoom             | ...         | コミュニケーション | ... | 4.2    |
| 10 | Google Workspace | ...         | コミュニケーション | ... | 4.5    |
+----+------------------+-------------+-------------------+-----+--------+
```

### カテゴリ分布

| カテゴリ | 件数 |
|---------|------|
| コミュニケーション | 3 |
| 開発ツール | 3 |
| ドキュメント | 2 |
| デザイン | 1 |
| プロジェクト管理 | 1 |

---

## まとめ

| 操作 | コマンド |
|------|----------|
| DB作成 | `sqlite3 data/tools.db < data/create_tables.sql` |
| データ投入 | `sqlite3 data/tools.db < data/insert_data.sql` |
| データ確認 | `sqlite3 -header -column data/tools.db "SELECT ..."` |
| 件数確認 | `SELECT COUNT(*) FROM tools;` |

- [ ] データベースファイルを作成した
- [ ] toolsテーブルを作成した
- [ ] 10件のサンプルデータを投入した
- [ ] SELECTで全データを確認した
- [ ] SQLスクリプトをコミットした

---

## 次のステップへ

データベースの準備が完了しました。

次のセクションでは、Day 1の終わりに日報を書きます。
今日の作業内容を振り返って報告しましょう。

---

*推定所要時間: 45分*
