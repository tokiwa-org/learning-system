# 複雑なデータベースを構築しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 1
subStep: 3
title: "複雑なデータベースを構築しよう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「実際の業務で使うデータベースは、テーブルが1つだけってことはまずない」
>
> 先輩がデータベースの構成図を見せてくれた。
>
> 「社員管理システムを例に、4つのテーブルが連携するDBを作ろう」
>
> 「4つも！？」
>
> 「大丈夫、1つずつ見ていこう。まずはテーブルを作って、データを入れるところから」

---

## 社員管理システムの全体像

今回構築するデータベースは、以下の4つのテーブルで構成されています。

```
departments（部署）
    ↑
employees（社員）  ←→  project_members（プロジェクトメンバー）
                              ↓
                        projects（プロジェクト）
```

| テーブル | 説明 | レコード数 |
|---------|------|-----------|
| departments | 部署情報 | 4件 |
| employees | 社員情報 | 10件 |
| projects | プロジェクト情報 | 4件 |
| project_members | プロジェクトへのアサイン | 10件 |

---

## テーブル定義

### 1. departments（部署テーブル）

```sql
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    manager_id INTEGER,
    budget INTEGER
);
```

| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | 部署ID（主キー） |
| name | TEXT | 部署名 |
| manager_id | INTEGER | 部署長の社員ID |
| budget | INTEGER | 年間予算（円） |

### 2. employees（社員テーブル）

```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department_id INTEGER,
    position TEXT,
    salary INTEGER,
    hire_date TEXT,
    manager_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | 社員ID（主キー） |
| name | TEXT | 氏名 |
| department_id | INTEGER | 所属部署ID（外部キー） |
| position | TEXT | 役職 |
| salary | INTEGER | 月給（円） |
| hire_date | TEXT | 入社日 |
| manager_id | INTEGER | 上司の社員ID |

### 3. projects（プロジェクトテーブル）

```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department_id INTEGER,
    budget INTEGER,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | プロジェクトID（主キー） |
| name | TEXT | プロジェクト名 |
| department_id | INTEGER | 担当部署ID（外部キー） |
| budget | INTEGER | 予算（円） |
| start_date | TEXT | 開始日 |
| end_date | TEXT | 終了日 |
| status | TEXT | 状態（active / completed） |

### 4. project_members（プロジェクトメンバーテーブル）

```sql
CREATE TABLE project_members (
    project_id INTEGER,
    employee_id INTEGER,
    role TEXT,
    PRIMARY KEY (project_id, employee_id)
);
```

| カラム | 型 | 説明 |
|--------|-----|------|
| project_id | INTEGER | プロジェクトID（複合主キー） |
| employee_id | INTEGER | 社員ID（複合主キー） |
| role | TEXT | プロジェクト内の役割 |

> **複合主キー**: `project_id` と `employee_id` の組み合わせが主キーになっています。同じ社員が同じプロジェクトに2回アサインされることを防ぎます。

---

## サンプルデータの投入

### 部署データ

```sql
INSERT INTO departments VALUES (1, '開発部', 1, 5000000);
INSERT INTO departments VALUES (2, '営業部', 4, 3000000);
INSERT INTO departments VALUES (3, '人事部', 7, 2000000);
INSERT INTO departments VALUES (4, 'マーケティング部', 9, 4000000);
```

### 社員データ

```sql
INSERT INTO employees VALUES (1, '田中太郎', 1, 'マネージャー', 500000, '2020-04-01', NULL);
INSERT INTO employees VALUES (2, '佐藤花子', 1, 'シニアエンジニア', 450000, '2021-01-15', 1);
INSERT INTO employees VALUES (3, '鈴木一郎', 1, 'エンジニア', 380000, '2022-04-01', 1);
INSERT INTO employees VALUES (4, '高橋美咲', 2, 'マネージャー', 480000, '2019-10-01', NULL);
INSERT INTO employees VALUES (5, '伊藤健太', 2, '営業担当', 350000, '2023-04-01', 4);
INSERT INTO employees VALUES (6, '渡辺直美', 2, '営業担当', 330000, '2023-07-01', 4);
INSERT INTO employees VALUES (7, '山田花子', 3, 'マネージャー', 460000, '2020-07-01', NULL);
INSERT INTO employees VALUES (8, '中村大輔', 3, '人事担当', 340000, '2022-10-01', 7);
INSERT INTO employees VALUES (9, '小林さくら', 4, 'マネージャー', 470000, '2021-04-01', NULL);
INSERT INTO employees VALUES (10, '加藤翔太', 4, 'マーケター', 360000, '2023-01-15', 9);
```

### プロジェクトデータ

```sql
INSERT INTO projects VALUES (1, 'ECサイトリニューアル', 1, 3000000, '2024-01-01', '2024-06-30', 'active');
INSERT INTO projects VALUES (2, '社内ツール開発', 1, 1000000, '2024-03-01', '2024-09-30', 'active');
INSERT INTO projects VALUES (3, '営業支援システム', 2, 2000000, '2024-02-01', '2024-08-31', 'completed');
INSERT INTO projects VALUES (4, 'ブランディング施策', 4, 1500000, '2024-04-01', '2024-12-31', 'active');
```

### プロジェクトメンバーデータ

```sql
INSERT INTO project_members VALUES (1, 1, 'PM');
INSERT INTO project_members VALUES (1, 2, 'テックリード');
INSERT INTO project_members VALUES (1, 3, 'エンジニア');
INSERT INTO project_members VALUES (2, 2, 'テックリード');
INSERT INTO project_members VALUES (2, 3, 'エンジニア');
INSERT INTO project_members VALUES (3, 4, 'PM');
INSERT INTO project_members VALUES (3, 5, 'メンバー');
INSERT INTO project_members VALUES (3, 6, 'メンバー');
INSERT INTO project_members VALUES (4, 9, 'PM');
INSERT INTO project_members VALUES (4, 10, 'メンバー');
```

---

## データベース構築の実行

### SQLiteで実行する場合

```bash
# データベースファイルを作成
sqlite3 company.db

# 上記のCREATE TABLE文とINSERT文をすべて実行

# 確認
SELECT COUNT(*) FROM employees;    -- 10
SELECT COUNT(*) FROM departments;  -- 4
SELECT COUNT(*) FROM projects;     -- 4
SELECT COUNT(*) FROM project_members; -- 10
```

### データが入ったか確認しよう

```sql
-- 社員一覧
SELECT * FROM employees;

-- 部署一覧
SELECT * FROM departments;

-- プロジェクト一覧
SELECT * FROM projects;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| テーブル数 | 4つ（departments, employees, projects, project_members） |
| テーブル間の関係 | 外部キーで結びついている |
| 複合主キー | project_members は2つのカラムで主キーを構成 |
| サンプルデータ | 現実の社員管理システムに近い構造 |

### チェックリスト
- [ ] 4つのテーブルを作成できた
- [ ] サンプルデータを投入できた
- [ ] SELECT文で各テーブルのデータを確認できた
- [ ] テーブル間の関係をイメージできた

---

## 次のステップへ

データベースの構築ができました。
次のセクションでは、テーブル間の関係を保証する「外部キー」について深く学びます。

---

*推定読了時間: 25分*
