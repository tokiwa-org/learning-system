# COUNT, SUM, AVGで集計しよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 5
subStep: 3
title: "COUNT, SUM, AVGで集計しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「先輩、社員は全部で何人ですか？平均給料はいくらですか？」
>
> 「集計関数を使えばすぐにわかるよ」
>
> 「集計関数...？」
>
> 「COUNT、SUM、AVGみたいな関数のことだよ。Excelの関数と同じ感覚で使えるんだ」

---

## 集計関数とは

集計関数 = **複数の行をまとめて1つの結果を返す関数**です。

### Excelとの対比

| Excel | SQL | 意味 |
|-------|-----|------|
| `=COUNTA(A:A)` | `COUNT(*)` | 行数を数える |
| `=SUM(D:D)` | `SUM(salary)` | 合計を求める |
| `=AVERAGE(D:D)` | `AVG(salary)` | 平均を求める |
| `=MAX(D:D)` | `MAX(salary)` | 最大値を求める |
| `=MIN(D:D)` | `MIN(salary)` | 最小値を求める |

---

## COUNT - 行数を数える

### COUNT(*) - 全行数を数える

```sql
SELECT COUNT(*) FROM employees;
```

実行結果：

```
COUNT(*)
--------
8
```

社員は全部で **8人** です。

### COUNT(カラム名) - NULLを除いて数える

```sql
SELECT COUNT(department) FROM employees;
```

実行結果：

```
COUNT(department)
-----------------
8
```

> `COUNT(*)` と `COUNT(カラム名)` の違い：
> - `COUNT(*)` → NULL を含めて全行を数える
> - `COUNT(カラム名)` → そのカラムが NULL の行を除いて数える
>
> 今回はNULLがないので同じ結果ですが、NULLがあるデータでは差が出ます。

---

## SUM - 合計を求める

```sql
SELECT SUM(salary) FROM employees;
```

実行結果：

```
SUM(salary)
-----------
2680000
```

全社員の給料の合計は **2,680,000円** です。

### 商品の在庫合計

```sql
SELECT SUM(stock) FROM products;
```

実行結果：

```
SUM(stock)
----------
305
```

---

## AVG - 平均を求める

```sql
SELECT AVG(salary) FROM employees;
```

実行結果：

```
AVG(salary)
-----------
335000.0
```

全社員の平均給料は **335,000円** です。

### 商品の平均価格

```sql
SELECT AVG(price) FROM products;
```

実行結果：

```
AVG(price)
----------
25350.0
```

---

## MAX / MIN - 最大値・最小値を求める

### 最高給料と最低給料

```sql
SELECT MAX(salary), MIN(salary) FROM employees;
```

実行結果：

```
MAX(salary)  MIN(salary)
-----------  -----------
400000       280000
```

- 最高給料: **400,000円**（鈴木一郎）
- 最低給料: **280,000円**（伊藤健太）

### 最高価格と最低価格

```sql
SELECT MAX(price), MIN(price) FROM products;
```

実行結果：

```
MAX(price)  MIN(price)
----------  ----------
89000       2500
```

---

## WHEREと組み合わせる

集計関数はWHEREで絞り込んだデータに対しても使えます。

### 電子機器の平均価格

```sql
SELECT AVG(price) FROM products WHERE category = '電子機器';
```

実行結果：

```
AVG(price)
----------
24750.0
```

### 開発部の社員数と平均給料

```sql
SELECT COUNT(*), AVG(salary) FROM employees WHERE department = '開発部';
```

実行結果：

```
COUNT(*)  AVG(salary)
--------  ----------------
3         346666.666666667
```

開発部は3人、平均給料は約346,667円です。

---

## エイリアス（AS）で結果に名前をつける

集計結果のカラム名は `COUNT(*)` や `AVG(salary)` のままだと読みにくいので、`AS` で別名（エイリアス）をつけましょう。

```sql
SELECT
    COUNT(*) AS 社員数,
    AVG(salary) AS 平均給料,
    MAX(salary) AS 最高給料,
    MIN(salary) AS 最低給料
FROM employees;
```

実行結果：

```
社員数  平均給料  最高給料  最低給料
------  --------  --------  --------
8       335000.0  400000    280000
```

> `AS` を使うと結果が格段に読みやすくなります。実務では必ず使いましょう。

---

## 複数の集計関数を同時に使う

1つのSELECT文で複数の集計関数を同時に使えます。

### 商品の統計情報

```sql
SELECT
    COUNT(*) AS 商品数,
    SUM(price) AS 価格合計,
    AVG(price) AS 平均価格,
    MAX(price) AS 最高価格,
    MIN(price) AS 最低価格
FROM products;
```

実行結果：

```
商品数  価格合計  平均価格  最高価格  最低価格
------  --------  --------  --------  --------
10      253500    25350.0   89000     2500
```

---

## ハンズオン

SQLiteを起動して、以下のSQLを実行してみましょう。

```sql
-- 1. 表示設定（まだの場合）
.mode column
.headers on

-- 2. 社員の総数を求める
SELECT COUNT(*) AS 社員数 FROM employees;

-- 3. 全社員の給料の合計を求める
SELECT SUM(salary) AS 給料合計 FROM employees;

-- 4. 全社員の平均給料を求める
SELECT AVG(salary) AS 平均給料 FROM employees;

-- 5. 最高給料と最低給料を求める
SELECT MAX(salary) AS 最高給料, MIN(salary) AS 最低給料 FROM employees;

-- 6. 商品の統計情報を一度に求める
SELECT
    COUNT(*) AS 商品数,
    AVG(price) AS 平均価格,
    MAX(price) AS 最高価格,
    MIN(price) AS 最低価格
FROM products;

-- 7. 電子機器の平均価格を求める
SELECT AVG(price) AS 電子機器平均価格 FROM products WHERE category = '電子機器';

-- 8. 家具の商品数と平均価格を求める
SELECT COUNT(*) AS 家具数, AVG(price) AS 平均価格 FROM products WHERE category = '家具';
```

---

## まとめ

| 集計関数 | 内容 |
|----------|------|
| `COUNT(*)` | 全行数を数える（NULL含む） |
| `COUNT(カラム)` | NULLを除いた行数を数える |
| `SUM(カラム)` | 合計を求める |
| `AVG(カラム)` | 平均を求める |
| `MAX(カラム)` | 最大値を求める |
| `MIN(カラム)` | 最小値を求める |
| `AS 別名` | 結果のカラムに別名をつける |

### チェックリスト

- [ ] COUNT(*)で行数を数えられた
- [ ] SUMで合計を求められた
- [ ] AVGで平均を求められた
- [ ] MAX/MINで最大値・最小値を求められた
- [ ] ASで結果に別名をつけられた
- [ ] WHEREと集計関数を組み合わせられた

---

## 次のステップへ

集計関数が使えるようになりましたね。

次のセクションでは、GROUP BYを使って「部署ごと」「カテゴリごと」にグループ化して集計する方法を学びます。
「各部署の平均給料」が一発で出せるようになりますよ！

---

*推定読了時間: 30分*
