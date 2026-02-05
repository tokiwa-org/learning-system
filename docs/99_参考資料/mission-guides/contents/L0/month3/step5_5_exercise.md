# 演習：データ分析に挑戦

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 5
subStep: 5
title: "演習：データ分析に挑戦"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「大変だ！上司から分析レポートを頼まれた！」
>
> 「どんなレポート？」
>
> 「社員と商品のデータを使って、いくつかの集計データを出してほしいって...」
>
> 「大丈夫、Step 5で学んだことを使えば全部できるよ。一つずつやっていこう」

---

## ミッション概要

ここまで学んだORDER BY、LIMIT、集計関数、GROUP BYを使って、8つの分析ミッションに挑戦しましょう。

### 前提データ

以下のテーブルとデータがある状態で進めます。

**employees（8行）**:

| id | name | department | salary |
|----|------|-----------|--------|
| 1 | 田中太郎 | 開発部 | 350000 |
| 2 | 佐藤花子 | 営業部 | 320000 |
| 3 | 鈴木一郎 | 開発部 | 400000 |
| 4 | 高橋美咲 | 人事部 | 300000 |
| 5 | 伊藤健太 | 営業部 | 280000 |
| 6 | 山田次郎 | 開発部 | 290000 |
| 7 | 中村美月 | 営業部 | 310000 |
| 8 | 小林大輔 | 人事部 | 330000 |

**products（10行）**:

| id | name | category | price | stock |
|----|------|---------|-------|-------|
| 1 | ノートPC | 電子機器 | 89000 | 15 |
| 2 | マウス | 電子機器 | 2500 | 100 |
| 3 | デスク | 家具 | 35000 | 8 |
| 4 | チェア | 家具 | 45000 | 12 |
| 5 | モニター | 電子機器 | 32000 | 20 |
| 6 | キーボード | 電子機器 | 8000 | 50 |
| 7 | ヘッドセット | 電子機器 | 12000 | 30 |
| 8 | ブックシェルフ | 家具 | 18000 | 5 |
| 9 | ウェブカメラ | 電子機器 | 5000 | 25 |
| 10 | デスクライト | 家具 | 7000 | 40 |

---

## 準備

```sql
-- SQLiteを起動
-- sqlite3 practice.db

-- 表示設定
.mode column
.headers on

-- データの確認
SELECT * FROM employees;
SELECT * FROM products;
```

---

## Mission 1: 社員を給料の高い順に表示（ORDER BY）

社員全員を **給料の高い順** に並べて表示してください。

<details>
<summary>ヒント</summary>

ORDER BY と DESC を使います。

</details>

<details>
<summary>解答</summary>

```sql
SELECT * FROM employees ORDER BY salary DESC;
```

実行結果：

```
id  name      department  salary
--  --------  ----------  ------
3   鈴木一郎  開発部      400000
1   田中太郎  開発部      350000
8   小林大輔  人事部      330000
2   佐藤花子  営業部      320000
7   中村美月  営業部      310000
4   高橋美咲  人事部      300000
6   山田次郎  開発部      290000
5   伊藤健太  営業部      280000
```

</details>

---

## Mission 2: 価格の安い商品TOP3（ORDER BY + LIMIT）

商品を **価格の安い順** に並べて、**上位3件だけ** 表示してください。

<details>
<summary>ヒント</summary>

ORDER BY で昇順（ASC）に並べて、LIMIT 3 で件数を制限します。

</details>

<details>
<summary>解答</summary>

```sql
SELECT * FROM products ORDER BY price ASC LIMIT 3;
```

実行結果：

```
id  name          category  price  stock
--  ------------  --------  -----  -----
2   マウス        電子機器  2500   100
9   ウェブカメラ  電子機器  5000   25
10  デスクライト  家具      7000   40
```

</details>

---

## Mission 3: 社員の総数を求める（COUNT）

社員の **総数** を求めてください。結果のカラム名は「社員数」にしてください。

<details>
<summary>ヒント</summary>

COUNT(*) と AS を使います。

</details>

<details>
<summary>解答</summary>

```sql
SELECT COUNT(*) AS 社員数 FROM employees;
```

実行結果：

```
社員数
------
8
```

</details>

---

## Mission 4: 全社員の平均給料を求める（AVG）

全社員の **平均給料** を求めてください。結果のカラム名は「平均給料」にしてください。

<details>
<summary>ヒント</summary>

AVG(salary) と AS を使います。

</details>

<details>
<summary>解答</summary>

```sql
SELECT AVG(salary) AS 平均給料 FROM employees;
```

実行結果：

```
平均給料
--------
335000.0
```

</details>

---

## Mission 5: 商品の最高価格と最低価格を求める（MAX / MIN）

商品の **最高価格** と **最低価格** を同時に求めてください。
それぞれ「最高価格」「最低価格」というカラム名にしてください。

<details>
<summary>ヒント</summary>

MAX(price) と MIN(price) を1つのSELECT文で同時に使います。

</details>

<details>
<summary>解答</summary>

```sql
SELECT MAX(price) AS 最高価格, MIN(price) AS 最低価格 FROM products;
```

実行結果：

```
最高価格  最低価格
--------  --------
89000     2500
```

</details>

---

## Mission 6: 部署ごとの社員数と平均給料（GROUP BY）

**部署ごと** の社員数と平均給料を表示してください。
カラム名は「部署」「社員数」「平均給料」にしてください。

<details>
<summary>ヒント</summary>

GROUP BY department を使い、COUNT(*) と AVG(salary) で集計します。

</details>

<details>
<summary>解答</summary>

```sql
SELECT
    department AS 部署,
    COUNT(*) AS 社員数,
    AVG(salary) AS 平均給料
FROM employees
GROUP BY department;
```

実行結果：

```
部署    社員数  平均給料
------  ------  ----------------
開発部  3       346666.666666667
営業部  3       303333.333333333
人事部  2       315000.0
```

</details>

---

## Mission 7: カテゴリごとの商品数・平均価格・合計在庫（GROUP BY + 複数集計）

**カテゴリごと** の商品数、平均価格、合計在庫を表示してください。
カラム名は「カテゴリ」「商品数」「平均価格」「合計在庫」にしてください。

<details>
<summary>ヒント</summary>

GROUP BY category を使い、COUNT(*)、AVG(price)、SUM(stock) で集計します。

</details>

<details>
<summary>解答</summary>

```sql
SELECT
    category AS カテゴリ,
    COUNT(*) AS 商品数,
    AVG(price) AS 平均価格,
    SUM(stock) AS 合計在庫
FROM products
GROUP BY category;
```

実行結果：

```
カテゴリ  商品数  平均価格  合計在庫
--------  ------  --------  --------
電子機器  6       24750.0   240
家具      4       26250.0   65
```

</details>

---

## Mission 8: 平均給料31万円以上の部署を高い順に（Challenge）

**平均給料が31万円以上の部署** を、**平均給料の高い順** に表示してください。
カラム名は「部署」「平均給料」にしてください。

> これはGROUP BY + HAVING + ORDER BY の組み合わせです。

<details>
<summary>ヒント</summary>

1. GROUP BY で部署ごとにグループ化
2. HAVING で平均給料31万円以上をフィルタ
3. ORDER BY で平均給料の降順に並べる

</details>

<details>
<summary>解答</summary>

```sql
SELECT
    department AS 部署,
    AVG(salary) AS 平均給料
FROM employees
GROUP BY department
HAVING AVG(salary) >= 310000
ORDER BY 平均給料 DESC;
```

実行結果：

```
部署    平均給料
------  ----------------
開発部  346666.666666667
人事部  315000.0
```

営業部（平均約303,333円）は31万円未満なので除外されています。

</details>

---

## 達成度チェック

| ミッション | 内容 | 完了 |
|-----------|------|------|
| Mission 1 | ORDER BY DESC で降順ソート | □ |
| Mission 2 | ORDER BY + LIMIT でTop N | □ |
| Mission 3 | COUNT(*) で行数カウント | □ |
| Mission 4 | AVG() で平均値 | □ |
| Mission 5 | MAX() / MIN() で最大・最小 | □ |
| Mission 6 | GROUP BY で部署別集計 | □ |
| Mission 7 | GROUP BY + 複数集計関数 | □ |
| Mission 8 | GROUP BY + HAVING + ORDER BY | □ |

**すべてクリア** → Step 5 演習クリア！

---

## まとめ

この演習で使ったSQL構文：

| 構文 | 用途 |
|------|------|
| `ORDER BY ... DESC` | 降順に並び替え |
| `ORDER BY ... LIMIT N` | 上位N件の取得 |
| `COUNT(*)` | 行数のカウント |
| `AVG(カラム)` | 平均値の計算 |
| `MAX(カラム)` / `MIN(カラム)` | 最大値・最小値 |
| `GROUP BY カラム` | グループ化して集計 |
| `HAVING 条件` | グループ化後のフィルタ |
| `AS 別名` | 結果にわかりやすい名前をつける |

---

## 次のステップへ

8つのミッションをクリアできましたか？

次のセクションでは、Step 5の理解度チェック（クイズ）に挑戦します。
ORDER BY、LIMIT、集計関数、GROUP BYの知識を最終確認しましょう！

---

*推定所要時間: 90分*
