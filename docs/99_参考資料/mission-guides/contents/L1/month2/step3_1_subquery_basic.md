# サブクエリの基本

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 3
subStep: 1
title: "サブクエリの基本"
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

> 「JOINはマスターしたな。次は、クエリの中にクエリを書く技術だ」
>
> 「クエリの中にクエリ...？」
>
> 「例えば『全社員の平均給与より高い給与の社員を探す』場合、まず平均を出して、それを条件に使うよね。これを1つのSQLで書ける」
>
> 「便利ですね。JOINだけだと書けないケースもあるんですか？」
>
> 「ある。サブクエリを覚えれば、書けるクエリの幅が一気に広がるぞ」

---

## サブクエリとは

サブクエリ（副問い合わせ）は、**SQL文の中に埋め込まれた別のSQL文**です。

```sql
-- 外側のクエリ（メインクエリ）
SELECT name, salary
FROM employees
WHERE salary > (
    -- 内側のクエリ（サブクエリ）
    SELECT AVG(salary) FROM employees
);
```

### サブクエリの実行順序

1. **サブクエリ（内側）**が先に実行される
2. その結果を使って**メインクエリ（外側）**が実行される

```
1. SELECT AVG(salary) FROM employees → 412000
2. SELECT name, salary FROM employees WHERE salary > 412000
```

---

## サブクエリの種類

| 種類 | 返す値 | 使う場所 |
|------|--------|---------|
| スカラーサブクエリ | 1つの値 | SELECT句、WHERE句 |
| 行サブクエリ | 1行 | WHERE句 |
| テーブルサブクエリ | 複数行・複数列 | FROM句、IN句 |

---

## スカラーサブクエリ

**1つの値**（単一の行・単一の列）を返すサブクエリです。

### SELECT句での使用

```sql
SELECT
    name AS 社員名,
    salary AS 月給,
    (SELECT AVG(salary) FROM employees) AS 全社平均給与,
    salary - (SELECT AVG(salary) FROM employees) AS 平均との差
FROM employees;
```

**結果:**

| 社員名 | 月給 | 全社平均給与 | 平均との差 |
|--------|------|------------|-----------|
| 田中太郎 | 500000 | 412000 | 88000 |
| 佐藤花子 | 450000 | 412000 | 38000 |
| 鈴木一郎 | 380000 | 412000 | -32000 |
| ... | ... | ... | ... |

> SELECT句の中にサブクエリを書くと、各行に同じ計算結果が付与されます。

### WHERE句での使用

```sql
-- 平均給与より高い社員
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

**結果:**

| name | salary |
|------|--------|
| 田中太郎 | 500000 |
| 佐藤花子 | 450000 |
| 高橋美咲 | 480000 |
| 山田花子 | 460000 |
| 小林さくら | 470000 |

---

## サブクエリ vs JOIN

同じ結果を得るのに、JOINでもサブクエリでも書けるケースがあります。

### 例: 開発部の社員一覧

**JOINで書く場合:**

```sql
SELECT e.name, e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE d.name = '開発部';
```

**サブクエリで書く場合:**

```sql
SELECT name, salary
FROM employees
WHERE department_id = (
    SELECT id FROM departments WHERE name = '開発部'
);
```

### 使い分けの目安

| ケース | 推奨 |
|--------|------|
| 結合して両テーブルのカラムを表示 | JOIN |
| 条件の値だけ別テーブルから取得 | サブクエリ |
| 集計結果を条件に使う | サブクエリ |
| 存在チェック | サブクエリ（EXISTS） |

---

## 部署ごとの集計をサブクエリで比較

```sql
-- 各社員の給与と、所属部署の平均給与を比較
SELECT
    e.name AS 社員名,
    e.salary AS 月給,
    d.name AS 部署名,
    (SELECT AVG(e2.salary)
     FROM employees e2
     WHERE e2.department_id = e.department_id) AS 部署平均給与
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

> このサブクエリは、外側のクエリの値（`e.department_id`）を参照しています。これを**相関サブクエリ**（Correlated Subquery）と呼びます。次のレッスンで詳しく学びます。

---

## よくある間違い

### 間違い: スカラーサブクエリが複数行を返す

```sql
-- エラーになる例
SELECT name FROM employees
WHERE salary = (SELECT salary FROM employees WHERE position = '営業担当');
-- → 営業担当は2人いるので、サブクエリが2つの値を返してエラー
```

**解決策:** 複数の値を返す場合は `IN` を使います。

```sql
SELECT name FROM employees
WHERE salary IN (SELECT salary FROM employees WHERE position = '営業担当');
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| サブクエリ | SQLの中に埋め込まれた別のSQL |
| 実行順序 | サブクエリ（内側）→ メインクエリ（外側） |
| スカラーサブクエリ | 1つの値を返す（SELECT句、WHERE句で使用） |
| サブクエリ vs JOIN | 用途に応じて使い分ける |
| 注意点 | スカラーサブクエリは必ず1つの値を返す必要がある |

### チェックリスト
- [ ] サブクエリの構文と実行順序を理解した
- [ ] SELECT句でスカラーサブクエリを使える
- [ ] WHERE句でスカラーサブクエリを使える
- [ ] JOINとサブクエリの使い分けの目安を把握した

---

## 次のステップへ

サブクエリの基本を学びました。
次のセクションでは、WHERE句でサブクエリをより高度に使うテクニック（IN、ANY、ALL）を学びます。

---

*推定読了時間: 30分*
