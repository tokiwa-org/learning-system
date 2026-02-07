# ウィンドウ関数入門

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 3
subStep: 4
title: "ウィンドウ関数入門"
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

> 「部署内での給与ランキングを出してほしいんだけど」
>
> 「GROUP BY で部署ごとに集計すると...あれ、個々の社員の行が消えちゃいます」
>
> 「そう、GROUP BY は行をまとめてしまうからね。行を残したまま集計したい場合は、ウィンドウ関数を使うんだ」
>
> 「ウィンドウ関数？」
>
> 「SQLの中でも特に強力な機能だ。これが使えると『できるエンジニア』って言われるぞ」

---

## ウィンドウ関数とは

ウィンドウ関数は、**行をグループ化せずに、行ごとに集計計算を行う**関数です。

### GROUP BY との違い

```
GROUP BY:     行をまとめる → 結果の行数が減る
ウィンドウ関数: 行はそのまま → 各行に集計結果を付与
```

### 具体例

```sql
-- GROUP BY: 部署ごとの平均給与（行がまとまる）
SELECT department_id, AVG(salary) FROM employees GROUP BY department_id;
-- → 4行（部署の数）

-- ウィンドウ関数: 各社員の行に部署平均を付与（行はそのまま）
SELECT name, salary, AVG(salary) OVER (PARTITION BY department_id) AS 部署平均
FROM employees;
-- → 10行（社員の数のまま）
```

---

## 基本構文

```sql
関数名() OVER (
    PARTITION BY グループ化するカラム
    ORDER BY 並び替えるカラム
)
```

| 要素 | 説明 | 省略 |
|------|------|------|
| PARTITION BY | ウィンドウ（グループ）を定義 | 省略可（全行が1グループ） |
| ORDER BY | ウィンドウ内の並び順を定義 | 省略可（ランキング関数では必須） |

---

## ROW_NUMBER(): 行番号を付ける

各行に連番を振ります。同じ値でも異なる番号がつきます。

```sql
SELECT
    name AS 社員名,
    salary AS 月給,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS 全社ランキング
FROM employees;
```

**結果:**

| 社員名 | 月給 | 全社ランキング |
|--------|------|--------------|
| 田中太郎 | 500000 | 1 |
| 高橋美咲 | 480000 | 2 |
| 小林さくら | 470000 | 3 |
| 山田花子 | 460000 | 4 |
| 佐藤花子 | 450000 | 5 |
| ... | ... | ... |

### PARTITION BY で部署内ランキング

```sql
SELECT
    name AS 社員名,
    d.name AS 部署名,
    salary AS 月給,
    ROW_NUMBER() OVER (
        PARTITION BY e.department_id
        ORDER BY salary DESC
    ) AS 部署内ランキング
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

**結果:**

| 社員名 | 部署名 | 月給 | 部署内ランキング |
|--------|--------|------|----------------|
| 田中太郎 | 開発部 | 500000 | 1 |
| 佐藤花子 | 開発部 | 450000 | 2 |
| 鈴木一郎 | 開発部 | 380000 | 3 |
| 高橋美咲 | 営業部 | 480000 | 1 |
| 伊藤健太 | 営業部 | 350000 | 2 |
| 渡辺直美 | 営業部 | 330000 | 3 |
| ... | ... | ... | ... |

> PARTITION BY で部署ごとにグループ分けし、各グループ内で ORDER BY salary DESC の順にランキングしています。

---

## RANK() と DENSE_RANK(): ランキング

| 関数 | 同順位の扱い | 次の順位 |
|------|------------|---------|
| ROW_NUMBER() | 同値でも異なる番号 | 連番 |
| RANK() | 同値は同じ番号 | 飛び番（1, 2, 2, 4） |
| DENSE_RANK() | 同値は同じ番号 | 連番（1, 2, 2, 3） |

```sql
SELECT
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
    RANK() OVER (ORDER BY salary DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;
```

---

## 集計ウィンドウ関数

通常の集計関数（SUM, AVG, COUNT, MAX, MIN）も OVER句と組み合わせられます。

### 例1: 各行に全社平均を付与

```sql
SELECT
    name AS 社員名,
    salary AS 月給,
    AVG(salary) OVER () AS 全社平均,
    salary - AVG(salary) OVER () AS 平均との差
FROM employees;
```

> `OVER ()` と空のカッコにすると、全行が1つのウィンドウになります。

### 例2: 部署平均との比較

```sql
SELECT
    name AS 社員名,
    d.name AS 部署名,
    salary AS 月給,
    ROUND(AVG(salary) OVER (PARTITION BY e.department_id)) AS 部署平均,
    salary - ROUND(AVG(salary) OVER (PARTITION BY e.department_id)) AS 部署平均との差
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

### 例3: 累計（Running Total）

```sql
SELECT
    name AS 社員名,
    salary AS 月給,
    SUM(salary) OVER (ORDER BY hire_date) AS 給与累計
FROM employees
ORDER BY hire_date;
```

**結果:**

| 社員名 | 月給 | 給与累計 |
|--------|------|---------|
| 高橋美咲 | 480000 | 480000 |
| 田中太郎 | 500000 | 980000 |
| 山田花子 | 460000 | 1440000 |
| ... | ... | ... |

> ORDER BY を指定すると、その順序で累積的に集計されます。

---

## ウィンドウ関数の活用場面

| 場面 | 使うウィンドウ関数 |
|------|-----------------|
| ランキング表示 | ROW_NUMBER(), RANK(), DENSE_RANK() |
| グループ内での相対位置 | RANK() OVER (PARTITION BY ...) |
| 累計・移動平均 | SUM() OVER (ORDER BY ...) |
| 前の行との比較 | LAG(), LEAD() |
| 全体に対する割合 | SUM(値) / SUM(値) OVER () |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ウィンドウ関数 | 行をグループ化せずに行ごとに集計を行う |
| OVER句 | PARTITION BY でグループ、ORDER BY で並び順を指定 |
| ROW_NUMBER | 連番を振る |
| RANK / DENSE_RANK | ランキング（同順位の扱いが異なる） |
| 集計 + OVER | SUM, AVG等をウィンドウ関数として使用 |

### チェックリスト
- [ ] ウィンドウ関数とGROUP BYの違いを説明できる
- [ ] OVER (PARTITION BY ... ORDER BY ...) の構文を書ける
- [ ] ROW_NUMBER, RANK, DENSE_RANK の違いを把握した
- [ ] 集計関数をウィンドウ関数として使える

---

## 次のステップへ

ウィンドウ関数の基本を学びました。
次のセクションでは、サブクエリとウィンドウ関数を組み合わせた実践演習に挑戦します。

---

*推定読了時間: 30分*
