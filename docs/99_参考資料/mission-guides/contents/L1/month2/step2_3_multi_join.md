# 3テーブル以上のJOINに挑戦しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 2
subStep: 3
title: "3テーブル以上のJOINに挑戦しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「『各プロジェクトのメンバー一覧を、社員名と部署名付きで出してくれ』って依頼が来た」
>
> 「えっと、projects, project_members, employees, departments...4つのテーブルが必要ですか？」
>
> 「そう。実務ではテーブルを3つ、4つと連鎖的にJOINするのは日常茶飯事だ」
>
> 「難しそう...」
>
> 「コツを覚えれば大丈夫。JOINを1つずつ積み上げていけばいい」

---

## 複数テーブルJOINの基本構文

```sql
SELECT カラム名
FROM テーブルA
JOIN テーブルB ON A.カラム = B.カラム
JOIN テーブルC ON B.カラム = C.カラム
JOIN テーブルD ON C.カラム = D.カラム;
```

JOINは**何個でもチェーンできます**。1つ目の結果に2つ目を結合し、その結果に3つ目を結合...という流れです。

---

## 実践: 2テーブルから段階的に拡張

### ステップ1: employees + departments（2テーブル）

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

### ステップ2: + project_members（3テーブル）

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    pm.role AS プロジェクト役割
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
INNER JOIN project_members pm ON e.id = pm.employee_id;
```

### ステップ3: + projects（4テーブル）

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    p.name AS プロジェクト名,
    pm.role AS プロジェクト役割
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
INNER JOIN project_members pm ON e.id = pm.employee_id
INNER JOIN projects p ON pm.project_id = p.id;
```

**結果:**

| 社員名 | 部署名 | プロジェクト名 | プロジェクト役割 |
|--------|--------|--------------|----------------|
| 田中太郎 | 開発部 | ECサイトリニューアル | PM |
| 佐藤花子 | 開発部 | ECサイトリニューアル | テックリード |
| 鈴木一郎 | 開発部 | ECサイトリニューアル | エンジニア |
| 佐藤花子 | 開発部 | 社内ツール開発 | テックリード |
| 鈴木一郎 | 開発部 | 社内ツール開発 | エンジニア |
| 高橋美咲 | 営業部 | 営業支援システム | PM |
| 伊藤健太 | 営業部 | 営業支援システム | メンバー |
| 渡辺直美 | 営業部 | 営業支援システム | メンバー |
| 小林さくら | マーケティング部 | ブランディング施策 | PM |
| 加藤翔太 | マーケティング部 | ブランディング施策 | メンバー |

> 佐藤花子と鈴木一郎は2つのプロジェクトに参加しているため、2行ずつ表示されています。

---

## JOINの結合パスを意識する

テーブルを結合するときは、**どのカラムで繋がるか**を意識しましょう。

```
employees                project_members            projects
+----+---------+-----+   +--------+-------+-----+   +----+----------+
| id | name    |dep_id|  |proj_id |emp_id |role |   | id | name     |
+----+---------+-----+   +--------+-------+-----+   +----+----------+
  ↕                         ↕        ↕                  ↕
  department_id ───→ departments.id
  id ─────────────────────→ employee_id
                    project_id ──────────────────→ id
```

### コツ: テーブルの結合順序

1. 起点となるテーブルを FROM に書く
2. そこから外部キーをたどって1つずつJOINを追加
3. 中間テーブルを経由する場合は中間テーブルを先にJOIN

---

## INNER JOINとLEFT JOINの混在

複数のJOINで、JOIN の種類を混在させることもできます。

```sql
-- 全社員を表示（プロジェクト未参加の社員も含む）
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    COALESCE(p.name, 'なし') AS プロジェクト名,
    COALESCE(pm.role, '-') AS 役割
FROM employees e
INNER JOIN departments d ON e.department_id = d.id       -- 部署は必ずある
LEFT JOIN project_members pm ON e.id = pm.employee_id     -- プロジェクトはないかも
LEFT JOIN projects p ON pm.project_id = p.id;            -- プロジェクト情報
```

**結果:**

| 社員名 | 部署名 | プロジェクト名 | 役割 |
|--------|--------|--------------|------|
| 田中太郎 | 開発部 | ECサイトリニューアル | PM |
| 佐藤花子 | 開発部 | ECサイトリニューアル | テックリード |
| 佐藤花子 | 開発部 | 社内ツール開発 | テックリード |
| 鈴木一郎 | 開発部 | ECサイトリニューアル | エンジニア |
| 鈴木一郎 | 開発部 | 社内ツール開発 | エンジニア |
| 高橋美咲 | 営業部 | 営業支援システム | PM |
| 伊藤健太 | 営業部 | 営業支援システム | メンバー |
| 渡辺直美 | 営業部 | 営業支援システム | メンバー |
| **山田花子** | **人事部** | **なし** | **-** |
| **中村大輔** | **人事部** | **なし** | **-** |
| 小林さくら | マーケティング部 | ブランディング施策 | PM |
| 加藤翔太 | マーケティング部 | ブランディング施策 | メンバー |

> 山田花子と中村大輔はプロジェクト未参加ですが、LEFT JOINのおかげで結果に含まれています。

---

## 複数JOINでの集計

### プロジェクトごとのメンバー数と部署名

```sql
SELECT
    p.name AS プロジェクト名,
    d.name AS 担当部署,
    COUNT(pm.employee_id) AS メンバー数,
    p.budget AS 予算
FROM projects p
INNER JOIN departments d ON p.department_id = d.id
INNER JOIN project_members pm ON p.id = pm.project_id
GROUP BY p.name, d.name, p.budget;
```

### 部署ごとのプロジェクト参加人数（延べ）

```sql
SELECT
    d.name AS 部署名,
    COUNT(pm.employee_id) AS プロジェクト参加延べ人数
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
INNER JOIN project_members pm ON e.id = pm.employee_id
GROUP BY d.name;
```

---

## よくある間違い

### 間違い1: ON句の条件を間違える

```sql
-- 間違い: department_id 同士を比較してしまう
INNER JOIN departments d ON e.department_id = d.department_id
-- 正しい: 外部キー = 参照先の主キー
INNER JOIN departments d ON e.department_id = d.id
```

### 間違い2: 中間テーブルを飛ばす

```sql
-- 間違い: employees と projects を直接JOIN（結合カラムがない）
FROM employees e
INNER JOIN projects p ON e.id = p.???

-- 正しい: 中間テーブル project_members を経由する
FROM employees e
INNER JOIN project_members pm ON e.id = pm.employee_id
INNER JOIN projects p ON pm.project_id = p.id
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 複数JOIN | JOINを連鎖させて3つ以上のテーブルを結合できる |
| 結合順序 | 外部キーのつながりを意識して1つずつ追加する |
| JOIN混在 | INNER JOINとLEFT JOINは同じクエリ内で混在できる |
| 中間テーブル | 多対多の関係は中間テーブルを経由してJOINする |
| 集計 | 複数JOINの結果にGROUP BYで集計できる |

### チェックリスト
- [ ] 3テーブル以上のJOINを書ける
- [ ] JOINの結合パスを説明できる
- [ ] INNER JOINとLEFT JOINを混在させられる
- [ ] 中間テーブルを経由したJOINを書ける

---

## 次のステップへ

複数テーブルのJOINができるようになりました。
次のセクションでは、同じテーブル同士を結合する「自己結合」を学びます。
上司-部下の関係を取得する、少し変わったテクニックです。

---

*推定読了時間: 30分*
