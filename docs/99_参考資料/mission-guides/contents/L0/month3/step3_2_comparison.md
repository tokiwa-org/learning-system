# 比較演算子を使おう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 3
subStep: 2
title: "比較演算子を使おう"
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

> 「WHERE句で特定の値を指定して絞り込めるようになりました！」
>
> 「いいね。でも、給料が30万円以上の社員を探したいときはどうする？」
>
> 「えっと... `= 300000` だとぴったり30万の人しか出ない...」
>
> 「そう。そこで比較演算子の出番だよ」

---

## 比較演算子とは

WHERE句で使える「比較の条件」を指定する記号です。

### 一覧

| 演算子 | 意味 | 例 |
|--------|------|-----|
| `=` | 等しい | `salary = 300000` |
| `!=` または `<>` | 等しくない | `department != '人事部'` |
| `<` | より小さい | `price < 10000` |
| `>` | より大きい | `salary > 300000` |
| `<=` | 以下 | `stock <= 10` |
| `>=` | 以上 | `salary >= 300000` |

---

## 数値の比較

### 給料が30万円以上の社員

```sql
SELECT * FROM employees WHERE salary >= 300000;
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
2  | 佐藤花子 | 営業部     | 320000
3  | 鈴木一郎 | 開発部     | 400000
4  | 高橋美咲 | 人事部     | 300000
```

> 30万ちょうどの高橋さんも含まれます。`>=` は「以上」なので300000も対象です。

### 給料が30万円より大きい社員

```sql
SELECT * FROM employees WHERE salary > 300000;
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
2  | 佐藤花子 | 営業部     | 320000
3  | 鈴木一郎 | 開発部     | 400000
```

> `>` は「より大きい」なので、ちょうど300000の高橋さんは含まれません。

### `>=` と `>` の違い

```
>=  「以上」  300000を含む
>   「超」    300000を含まない
```

同様に：

```
<=  「以下」  300000を含む
<   「未満」  300000を含まない
```

---

## 価格での比較

### 1万円未満の商品

```sql
SELECT * FROM products WHERE price < 10000;
```

実行結果：

```
id | name       | category | price | stock
---+------------+----------+-------+------
2  | マウス     | 電子機器 | 2500  | 100
6  | キーボード | 電子機器 | 8000  | 50
```

### 3万円以上の商品

```sql
SELECT name, price FROM products WHERE price >= 30000;
```

実行結果：

```
name     | price
---------+------
ノートPC | 89000
デスク   | 35000
チェア   | 45000
モニター | 32000
```

---

## 等しくない（!=）

### 人事部以外の社員

```sql
SELECT * FROM employees WHERE department != '人事部';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
2  | 佐藤花子 | 営業部     | 320000
3  | 鈴木一郎 | 開発部     | 400000
5  | 伊藤健太 | 営業部     | 280000
```

> `!=` の代わりに `<>` も使えます。どちらも「等しくない」を意味します。

```sql
-- これも同じ結果
SELECT * FROM employees WHERE department <> '人事部';
```

---

## IS NULL / IS NOT NULL

データベースには「値がない」ことを表す **NULL** という特別な値があります。

### NULLとは

- 「未入力」「不明」「該当なし」を表す
- 空文字 `''` や数値の `0` とは違う
- NULLの比較には `=` ではなく `IS NULL` を使う

### 構文

```sql
-- NULLのデータを探す
SELECT * FROM テーブル WHERE カラム IS NULL;

-- NULLでないデータを探す
SELECT * FROM テーブル WHERE カラム IS NOT NULL;
```

### 注意点

```sql
-- これは正しく動かない！
SELECT * FROM employees WHERE department = NULL;

-- こう書く！
SELECT * FROM employees WHERE department IS NULL;
```

> NULLは「値がない」状態なので、`=` で比較できません。必ず `IS NULL` を使いましょう。

---

## カラムを選んで比較

WHEREで絞り込みつつ、必要なカラムだけ表示する組み合わせが実務では多いです。

### 給料30万以上の社員の名前と給料

```sql
SELECT name, salary FROM employees WHERE salary >= 300000;
```

実行結果：

```
name     | salary
---------+-------
田中太郎 | 350000
佐藤花子 | 320000
鈴木一郎 | 400000
高橋美咲 | 300000
```

### 在庫10個以下の商品名と在庫数

```sql
SELECT name, stock FROM products WHERE stock <= 10;
```

実行結果：

```
name           | stock
---------------+------
デスク         | 8
ブックシェルフ | 5
```

---

## ハンズオン

### 練習1: 給料が32万以上の社員

```sql
SELECT * FROM employees WHERE salary >= 320000;
```

### 練習2: 価格が1万円未満の商品

```sql
SELECT name, price FROM products WHERE price < 10000;
```

### 練習3: 在庫が20より多い商品

```sql
SELECT name, stock FROM products WHERE stock > 20;
```

### 練習4: 開発部以外の社員

```sql
SELECT name, department FROM employees WHERE department != '開発部';
```

### 練習5: 価格が5万円以上の商品

```sql
SELECT * FROM products WHERE price >= 50000;
```

<details>
<summary>練習5の期待される結果</summary>

```
id | name     | category | price | stock
---+----------+----------+-------+------
1  | ノートPC | 電子機器 | 89000 | 15
```

ノートPCだけが該当します。

</details>

---

## まとめ

| 演算子 | 意味 | 使用例 |
|--------|------|--------|
| `=` | 等しい | `WHERE salary = 300000` |
| `!=` / `<>` | 等しくない | `WHERE department != '人事部'` |
| `>` | より大きい | `WHERE salary > 300000` |
| `>=` | 以上 | `WHERE salary >= 300000` |
| `<` | より小さい | `WHERE price < 10000` |
| `<=` | 以下 | `WHERE stock <= 10` |
| `IS NULL` | NULLである | `WHERE カラム IS NULL` |
| `IS NOT NULL` | NULLでない | `WHERE カラム IS NOT NULL` |

### チェックリスト

- [ ] 6つの比較演算子を理解できた
- [ ] `>=` と `>` の違いを説明できる
- [ ] `!=` と `<>` がどちらも「等しくない」だと分かった
- [ ] `IS NULL` の使い方を理解できた

---

## 次のステップへ

比較演算子はマスターできましたか？

次のセクションでは、条件を組み合わせる `AND` と `OR` を学びます。
「開発部で、かつ給料が35万以上」のような複合条件が書けるようになりますよ！

---

*推定読了時間: 30分*
