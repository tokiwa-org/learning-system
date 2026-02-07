# WHERE句でサブクエリを使おう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 3
subStep: 2
title: "WHERE句でサブクエリを使おう"
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

> 「『営業部で最も給与が高い社員より給与が高い開発部の社員は誰？』って質問が来た」
>
> 「うーん、まず営業部の最高給与を調べて、それを条件にして開発部を検索して...」
>
> 「そう、その2つのステップを1つのSQLにまとめるのがサブクエリだ。WHERE句の中でいろんなパターンが使えるぞ」

---

## IN演算子とサブクエリ

`IN` は「サブクエリの結果リストに含まれるか」を判定します。

### 基本構文

```sql
SELECT カラム名
FROM テーブル
WHERE カラム IN (SELECT カラム FROM 別テーブル WHERE 条件);
```

### 例1: プロジェクトに参加している社員の一覧

```sql
SELECT name, position
FROM employees
WHERE id IN (
    SELECT employee_id FROM project_members
);
```

**結果:**

| name | position |
|------|----------|
| 田中太郎 | マネージャー |
| 佐藤花子 | シニアエンジニア |
| 鈴木一郎 | エンジニア |
| 高橋美咲 | マネージャー |
| 伊藤健太 | 営業担当 |
| 渡辺直美 | 営業担当 |
| 小林さくら | マネージャー |
| 加藤翔太 | マーケター |

### NOT IN（含まれない）

```sql
-- プロジェクトに参加していない社員
SELECT name, position
FROM employees
WHERE id NOT IN (
    SELECT employee_id FROM project_members
);
```

**結果:**

| name | position |
|------|----------|
| 山田花子 | マネージャー |
| 中村大輔 | 人事担当 |

---

## 比較演算子とサブクエリ

スカラーサブクエリを使って、比較演算子（=, >, <, >=, <=, <>）で条件を作れます。

### 例2: 全社平均より給与が高い社員

```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### 例3: 営業部の最高給与より高い社員

```sql
SELECT name, salary, position
FROM employees
WHERE salary > (
    SELECT MAX(salary)
    FROM employees
    WHERE department_id = (
        SELECT id FROM departments WHERE name = '営業部'
    )
);
```

> サブクエリの中にさらにサブクエリを書くこともできます（ネスト）。ただし、深すぎるネストは読みにくくなるので注意しましょう。

---

## ANY / ALL 演算子

### ANY（いずれかに一致）

```sql
-- マネージャーのいずれかの給与より高い社員
SELECT name, salary
FROM employees
WHERE salary > ANY (
    SELECT salary FROM employees WHERE position = 'マネージャー'
);
```

`> ANY` は「サブクエリの結果のうち最小値より大きい」と同じ意味です。

### ALL（すべてに一致）

```sql
-- すべてのマネージャーの給与より高い社員
SELECT name, salary
FROM employees
WHERE salary > ALL (
    SELECT salary FROM employees WHERE position = 'マネージャー'
);
```

`> ALL` は「サブクエリの結果のうち最大値より大きい」と同じ意味です。

### ANY / ALL の比較表

| 式 | 意味 |
|----|------|
| `> ANY (サブクエリ)` | サブクエリ結果の最小値より大きい |
| `> ALL (サブクエリ)` | サブクエリ結果の最大値より大きい |
| `< ANY (サブクエリ)` | サブクエリ結果の最大値より小さい |
| `< ALL (サブクエリ)` | サブクエリ結果の最小値より小さい |
| `= ANY (サブクエリ)` | IN と同じ |

---

## 実践的な例

### 例4: 自部署の平均給与より高い社員を探す

```sql
SELECT e.name, e.salary, d.name AS 部署名
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e.department_id
);
```

**結果:**

| name | salary | 部署名 |
|------|--------|--------|
| 田中太郎 | 500000 | 開発部 |
| 佐藤花子 | 450000 | 開発部 |
| 高橋美咲 | 480000 | 営業部 |
| 山田花子 | 460000 | 人事部 |
| 小林さくら | 470000 | マーケティング部 |

> このサブクエリは `e.department_id` を参照しているため、社員ごとに異なる部署の平均給与と比較されます（相関サブクエリ）。

### 例5: activeなプロジェクトのメンバーだけを表示

```sql
SELECT name, position
FROM employees
WHERE id IN (
    SELECT pm.employee_id
    FROM project_members pm
    INNER JOIN projects p ON pm.project_id = p.id
    WHERE p.status = 'active'
);
```

> サブクエリの中でJOINを使うこともできます。

---

## NOT IN使用時の注意

`NOT IN` はNULLが含まれると予期しない結果になります。

```sql
-- manager_id に NULL が含まれている場合
SELECT name FROM employees
WHERE id NOT IN (SELECT manager_id FROM employees);
-- → 空の結果が返る可能性がある！

-- 安全な書き方
SELECT name FROM employees
WHERE id NOT IN (
    SELECT manager_id FROM employees WHERE manager_id IS NOT NULL
);
```

> `NOT IN` のリストに NULL が含まれると、すべての比較が UNKNOWN になり、結果が空になります。`WHERE ... IS NOT NULL` で除外するか、`NOT EXISTS` を使いましょう。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| IN | サブクエリの結果リストに含まれるかチェック |
| NOT IN | リストに含まれないかチェック（NULL注意） |
| 比較演算子 | スカラーサブクエリと =, >, < 等で比較 |
| ANY | サブクエリ結果のいずれかと比較 |
| ALL | サブクエリ結果のすべてと比較 |

### チェックリスト
- [ ] IN / NOT IN でサブクエリを使える
- [ ] 比較演算子でスカラーサブクエリを使える
- [ ] ANY と ALL の違いを説明できる
- [ ] NOT IN のNULL問題を理解した

---

## 次のステップへ

WHERE句でのサブクエリをマスターしました。
次のセクションでは、FROM句でのサブクエリ（派生テーブル）と、EXISTS / NOT EXISTS を学びます。

---

*推定読了時間: 30分*
