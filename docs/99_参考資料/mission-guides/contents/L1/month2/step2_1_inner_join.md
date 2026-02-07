# INNER JOINでテーブルを結合しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 2
subStep: 1
title: "INNER JOINでテーブルを結合しよう"
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

> 「さて、いよいよJOINだ。本番DBの調査で一番使う技術だぞ」
>
> 「社員一覧に部署名も表示したいって依頼が来たんですが、どうすれば...」
>
> 「employees テーブルには department_id しかないからね。departments テーブルと結合して、部署名を取ってくる必要がある」
>
> 「それが JOIN ですか！」
>
> 「そう。まずは一番基本の INNER JOIN から覚えよう」

---

## JOINとは

JOINは、**2つ以上のテーブルを共通のカラムで結合**して、1つの結果セットにする操作です。

### JOINがない場合

```sql
-- 社員一覧
SELECT id, name, department_id FROM employees;
```

| id | name | department_id |
|----|------|--------------|
| 1 | 田中太郎 | 1 |
| 2 | 佐藤花子 | 1 |
| 3 | 鈴木一郎 | 1 |

department_id が「1」... これは何部？

### JOINを使った場合

```sql
SELECT employees.name, departments.name AS department_name
FROM employees
INNER JOIN departments ON employees.department_id = departments.id;
```

| name | department_name |
|------|----------------|
| 田中太郎 | 開発部 |
| 佐藤花子 | 開発部 |
| 鈴木一郎 | 開発部 |

部署名がわかるようになりました。

---

## INNER JOINの構文

```sql
SELECT カラム名
FROM テーブルA
INNER JOIN テーブルB ON テーブルA.カラム = テーブルB.カラム;
```

### 重要なポイント

- **ON** の後に結合条件を指定する
- 結合条件は通常「外部キー = 主キー」
- **INNER JOIN** は両方のテーブルに一致するデータのみ返す

---

## テーブルのエイリアス（別名）

テーブル名が長いと書くのが大変なので、エイリアス（別名）を使います。

```sql
-- エイリアスなし（長い）
SELECT employees.name, departments.name
FROM employees
INNER JOIN departments ON employees.department_id = departments.id;

-- エイリアスあり（短い）
SELECT e.name, d.name AS department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

> `employees e` と書くと、以降 `e` でテーブルを参照できます。

---

## 実践例

### 例1: 社員と部署の結合

```sql
SELECT
    e.id,
    e.name AS 社員名,
    d.name AS 部署名,
    e.position AS 役職,
    e.salary AS 月給
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

**結果:**

| id | 社員名 | 部署名 | 役職 | 月給 |
|----|--------|--------|------|------|
| 1 | 田中太郎 | 開発部 | マネージャー | 500000 |
| 2 | 佐藤花子 | 開発部 | シニアエンジニア | 450000 |
| 3 | 鈴木一郎 | 開発部 | エンジニア | 380000 |
| 4 | 高橋美咲 | 営業部 | マネージャー | 480000 |
| ... | ... | ... | ... | ... |

### 例2: 部署ごとの社員数

```sql
SELECT
    d.name AS 部署名,
    COUNT(e.id) AS 社員数,
    AVG(e.salary) AS 平均給与
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
GROUP BY d.name;
```

**結果:**

| 部署名 | 社員数 | 平均給与 |
|--------|--------|---------|
| 開発部 | 3 | 443333 |
| 営業部 | 3 | 386666 |
| 人事部 | 2 | 400000 |
| マーケティング部 | 2 | 415000 |

### 例3: プロジェクトと担当部署

```sql
SELECT
    p.name AS プロジェクト名,
    d.name AS 担当部署,
    p.budget AS 予算,
    p.status AS 状態
FROM projects p
INNER JOIN departments d ON p.department_id = d.id;
```

**結果:**

| プロジェクト名 | 担当部署 | 予算 | 状態 |
|--------------|---------|------|------|
| ECサイトリニューアル | 開発部 | 3000000 | active |
| 社内ツール開発 | 開発部 | 1000000 | active |
| 営業支援システム | 営業部 | 2000000 | completed |
| ブランディング施策 | マーケティング部 | 1500000 | active |

---

## INNER JOINの動作原理

INNER JOINは、結合条件に一致する行の組み合わせだけを返します。

```
employees テーブル          departments テーブル
+----+----------+-------+   +----+--------+
| id | name     | dep_id|   | id | name   |
+----+----------+-------+   +----+--------+
| 1  | 田中太郎 | 1     |   | 1  | 開発部 |
| 2  | 佐藤花子 | 1     |   | 2  | 営業部 |
| 3  | 鈴木一郎 | 1     |   | 3  | 人事部 |
+----+----------+-------+   +----+--------+

INNER JOIN ON e.department_id = d.id

結果:
+----------+--------+
| name     | dept   |
+----------+--------+
| 田中太郎 | 開発部 |  ← dep_id=1 と id=1 が一致
| 佐藤花子 | 開発部 |  ← dep_id=1 と id=1 が一致
| 鈴木一郎 | 開発部 |  ← dep_id=1 と id=1 が一致
+----------+--------+
```

> **一致しない行は結果に含まれません。** これがINNER JOINの特徴です。

---

## WHERE句との組み合わせ

JOINした結果に対して、さらにWHEREでフィルタリングできます。

```sql
-- 開発部の社員だけを取得
SELECT e.name, d.name AS department_name, e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE d.name = '開発部';

-- 給与40万以上の社員と所属部署
SELECT e.name, d.name AS department_name, e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary >= 400000
ORDER BY e.salary DESC;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| INNER JOIN | 2つのテーブルを共通カラムで結合する |
| ON句 | 結合条件を指定する（通常は外部キー = 主キー） |
| エイリアス | テーブルに短い別名をつけて読みやすくする |
| 動作 | 両方のテーブルに一致するデータのみ返す |
| WHERE | JOINの結果をさらにフィルタリングできる |

### チェックリスト
- [ ] INNER JOINの構文を書ける
- [ ] テーブルのエイリアスを使える
- [ ] ON句で結合条件を指定できる
- [ ] JOINの結果にWHEREを組み合わせられる

---

## 次のステップへ

INNER JOINを覚えました。
しかし、INNER JOINでは「一致しないデータ」が消えてしまいます。
次のセクションでは、一致しないデータも保持する LEFT JOIN を学びます。

---

*推定読了時間: 30分*
