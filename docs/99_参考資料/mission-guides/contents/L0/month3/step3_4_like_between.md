# LIKEとBETWEENで柔軟に検索しよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 3
subStep: 4
title: "LIKEとBETWEENで柔軟に検索しよう"
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

> 「名前に"藤"がつく社員を探したいんだけど...」
>
> 「完全一致じゃなくて、部分一致で検索したいんだね。LIKE を使えばパターン検索ができるよ」
>
> 「あと、給料が30万から35万の範囲の人も調べたいんですが...」
>
> 「それなら BETWEEN が便利だよ。範囲指定が簡単にできるんだ」

---

## LIKE（パターン検索）

LIKE は **文字列のパターンに一致する**データを検索します。

### ワイルドカード

| 記号 | 意味 | 例 |
|------|------|-----|
| `%` | 0文字以上の任意の文字列 | `'%藤%'` → 藤を含む |
| `_` | 1文字の任意の文字 | `'田_'` → 田＋1文字 |

---

## %（パーセント）の使い方

### 「含む」検索

```sql
-- 名前に「藤」を含む社員
SELECT * FROM employees WHERE name LIKE '%藤%';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
2  | 佐藤花子 | 営業部     | 320000
5  | 伊藤健太 | 営業部     | 280000
```

> `%藤%` は「前に何があっても、後ろに何があっても、"藤"を含む」を意味します。

### 「で始まる」検索

```sql
-- 名前が「田」で始まる社員
SELECT * FROM employees WHERE name LIKE '田%';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
```

> `田%` は「"田"で始まり、後ろは何でもOK」を意味します。

### 「で終わる」検索

```sql
-- 名前が「郎」で終わる社員
SELECT * FROM employees WHERE name LIKE '%郎';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
3  | 鈴木一郎 | 開発部     | 400000
```

> `%郎` は「前は何でもOKで、"郎"で終わる」を意味します。

### パターンまとめ

| パターン | 意味 | マッチ例 |
|----------|------|----------|
| `'%藤%'` | 「藤」を含む | 佐藤花子、伊藤健太 |
| `'田%'` | 「田」で始まる | 田中太郎 |
| `'%郎'` | 「郎」で終わる | 田中太郎、鈴木一郎 |
| `'%ート%'` | 「ート」を含む | ノートPC、ヘッドセット |

---

## _（アンダースコア）の使い方

`_` は **ちょうど1文字**に対応します。

```sql
-- 名前が「田中」＋2文字の社員
SELECT * FROM employees WHERE name LIKE '田中__';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
```

> `_` 1つが1文字に対応するので、`__`（2つ）は2文字に対応します。

---

## NOT LIKE

パターンに一致 **しない** データを取り出します。

```sql
-- 名前に「藤」を含まない社員
SELECT * FROM employees WHERE name NOT LIKE '%藤%';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
3  | 鈴木一郎 | 開発部     | 400000
4  | 高橋美咲 | 人事部     | 300000
```

---

## BETWEEN（範囲指定）

BETWEEN は **指定した範囲内**のデータを検索します。

### 構文

```sql
SELECT * FROM テーブル WHERE カラム BETWEEN 最小値 AND 最大値;
```

### 給料が30万以上35万以下の社員

```sql
SELECT * FROM employees WHERE salary BETWEEN 300000 AND 350000;
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
2  | 佐藤花子 | 営業部     | 320000
4  | 高橋美咲 | 人事部     | 300000
```

### BETWEENのポイント

- **両端を含む**（30万 <= salary <= 35万）
- 以下の書き方と同じ意味：

```sql
-- BETWEENを使わない場合
SELECT * FROM employees WHERE salary >= 300000 AND salary <= 350000;

-- BETWEENを使う場合（同じ結果、読みやすい）
SELECT * FROM employees WHERE salary BETWEEN 300000 AND 350000;
```

---

## 価格の範囲で検索

### 1万円以上5万円以下の商品

```sql
SELECT * FROM products WHERE price BETWEEN 10000 AND 50000;
```

実行結果：

```
id | name           | category | price | stock
---+----------------+----------+-------+------
3  | デスク         | 家具     | 35000 | 8
4  | チェア         | 家具     | 45000 | 12
5  | モニター       | 電子機器 | 32000 | 20
7  | ヘッドセット   | 電子機器 | 12000 | 30
8  | ブックシェルフ | 家具     | 18000 | 5
```

### 在庫が10個以上30個以下の商品

```sql
SELECT name, stock FROM products WHERE stock BETWEEN 10 AND 30;
```

実行結果：

```
name           | stock
---------------+------
ノートPC       | 15
チェア         | 12
モニター       | 20
ヘッドセット   | 30
```

---

## NOT BETWEEN

範囲 **外** のデータを取り出します。

```sql
-- 価格が1万円未満または5万円を超える商品
SELECT * FROM products WHERE price NOT BETWEEN 10000 AND 50000;
```

実行結果：

```
id | name     | category | price | stock
---+----------+----------+-------+------
1  | ノートPC | 電子機器 | 89000 | 15
2  | マウス   | 電子機器 | 2500  | 100
6  | キーボード | 電子機器 | 8000  | 50
```

---

## LIKEとBETWEENを他の条件と組み合わせる

### 電子機器カテゴリで、価格が1万円以上の商品

```sql
SELECT * FROM products
WHERE category = '電子機器' AND price BETWEEN 10000 AND 50000;
```

実行結果：

```
id | name         | category | price | stock
---+--------------+----------+-------+------
5  | モニター     | 電子機器 | 32000 | 20
7  | ヘッドセット | 電子機器 | 12000 | 30
```

### 名前に「藤」を含む営業部の社員

```sql
SELECT * FROM employees
WHERE name LIKE '%藤%' AND department = '営業部';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
2  | 佐藤花子 | 営業部     | 320000
5  | 伊藤健太 | 営業部     | 280000
```

---

## ハンズオン

### 練習1: 名前に「木」を含む社員

```sql
SELECT * FROM employees WHERE name LIKE '%木%';
```

<details>
<summary>期待される結果</summary>

```
id | name     | department | salary
---+----------+------------+-------
3  | 鈴木一郎 | 開発部     | 400000
```

</details>

### 練習2: 商品名が「ー」を含む商品

```sql
SELECT name, price FROM products WHERE name LIKE '%ー%';
```

### 練習3: 価格が5000円から20000円の商品

```sql
SELECT * FROM products WHERE price BETWEEN 5000 AND 20000;
```

<details>
<summary>期待される結果</summary>

```
id | name           | category | price | stock
---+----------------+----------+-------+------
6  | キーボード     | 電子機器 | 8000  | 50
7  | ヘッドセット   | 電子機器 | 12000 | 30
8  | ブックシェルフ | 家具     | 18000 | 5
```

</details>

### 練習4: 名前が「高」で始まる社員

```sql
SELECT * FROM employees WHERE name LIKE '高%';
```

### 練習5: 組み合わせ - 家具カテゴリで価格が2万円以上

```sql
SELECT name, price FROM products
WHERE category = '家具' AND price >= 20000;
```

---

## まとめ

| 機能 | 構文 | 説明 |
|------|------|------|
| 含む | `LIKE '%藤%'` | 「藤」を含む |
| で始まる | `LIKE '田%'` | 「田」で始まる |
| で終わる | `LIKE '%郎'` | 「郎」で終わる |
| 1文字ワイルドカード | `LIKE '田_'` | 「田」＋任意の1文字 |
| 含まない | `NOT LIKE '%藤%'` | 「藤」を含まない |
| 範囲指定 | `BETWEEN 100 AND 500` | 100以上500以下 |
| 範囲外 | `NOT BETWEEN 100 AND 500` | 100未満または500超 |

### チェックリスト

- [ ] `%` で部分一致検索ができた
- [ ] `_` で1文字ワイルドカードを使えた
- [ ] `BETWEEN` で範囲指定ができた
- [ ] `BETWEEN` が両端を含むことを理解した
- [ ] `NOT LIKE` / `NOT BETWEEN` を使えた

---

## 次のステップへ

LIKEとBETWEENはマスターできましたか？

次のセクションでは、ここまで学んだWHERE句の全テクニックを使った演習問題に挑戦します。
実践的な条件検索で、SQLの絞り込みスキルを仕上げましょう！

---

*推定読了時間: 30分*
