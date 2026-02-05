# 演習：条件検索マスター

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 3
subStep: 5
title: "演習：条件検索マスター"
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

> 「先輩から色々な条件でデータを取り出すよう頼まれたんです」
>
> 「いいね！WHERE句の総まとめだ。Step 3で学んだテクニックをフル活用して挑戦してみよう」
>
> 「等号、比較演算子、AND、OR、LIKE、BETWEEN...全部使うんですか？」
>
> 「そう。実際の仕事でもこういうリクエストは日常的にあるよ」

---

## 使用するテーブル

### employees テーブル

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
2  | 佐藤花子 | 営業部     | 320000
3  | 鈴木一郎 | 開発部     | 400000
4  | 高橋美咲 | 人事部     | 300000
5  | 伊藤健太 | 営業部     | 280000
```

### products テーブル

```
id | name           | category | price | stock
---+----------------+----------+-------+------
1  | ノートPC       | 電子機器 | 89000 | 15
2  | マウス         | 電子機器 | 2500  | 100
3  | デスク         | 家具     | 35000 | 8
4  | チェア         | 家具     | 45000 | 12
5  | モニター       | 電子機器 | 32000 | 20
6  | キーボード     | 電子機器 | 8000  | 50
7  | ヘッドセット   | 電子機器 | 12000 | 30
8  | ブックシェルフ | 家具     | 18000 | 5
```

---

## Mission 1: 部署で絞り込もう

### タスク

開発部の社員を全て表示してください。

<details>
<summary>ヒント</summary>

`WHERE` と `=` で部署を指定します。文字列はシングルクォートで囲みましょう。

</details>

<details>
<summary>解答</summary>

```sql
SELECT * FROM employees WHERE department = '開発部';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
3  | 鈴木一郎 | 開発部     | 400000
```

</details>

---

## Mission 2: 比較演算子を使おう

### タスク

給料が32万円以上の社員の **名前と給料** を表示してください。

<details>
<summary>ヒント</summary>

`>=` を使います。カラムを指定して `SELECT name, salary` とします。

</details>

<details>
<summary>解答</summary>

```sql
SELECT name, salary FROM employees WHERE salary >= 320000;
```

実行結果：

```
name     | salary
---------+-------
田中太郎 | 350000
佐藤花子 | 320000
鈴木一郎 | 400000
```

</details>

---

## Mission 3: カテゴリで絞り込もう

### タスク

電子機器カテゴリの商品を全て表示してください。

<details>
<summary>ヒント</summary>

`WHERE category = '電子機器'` を使います。

</details>

<details>
<summary>解答</summary>

```sql
SELECT * FROM products WHERE category = '電子機器';
```

実行結果：

```
id | name         | category | price | stock
---+--------------+----------+-------+------
1  | ノートPC     | 電子機器 | 89000 | 15
2  | マウス       | 電子機器 | 2500  | 100
5  | モニター     | 電子機器 | 32000 | 20
6  | キーボード   | 電子機器 | 8000  | 50
7  | ヘッドセット | 電子機器 | 12000 | 30
```

</details>

---

## Mission 4: BETWEENで範囲指定しよう

### タスク

価格が1万円以上5万円以下の商品を表示してください。

<details>
<summary>ヒント</summary>

`BETWEEN` を使うと範囲指定が簡単にできます。`BETWEEN 10000 AND 50000` のように書きます。

</details>

<details>
<summary>解答</summary>

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

</details>

---

## Mission 5: IN演算子を使おう

### タスク

開発部または営業部の社員を表示してください。`IN` 演算子を使うこと。

<details>
<summary>ヒント</summary>

`WHERE department IN ('値1', '値2')` の形で書きます。

</details>

<details>
<summary>解答</summary>

```sql
SELECT * FROM employees WHERE department IN ('開発部', '営業部');
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

</details>

---

## Mission 6: LIKEでパターン検索しよう

### タスク

名前に「藤」が含まれる社員を検索してください。

<details>
<summary>ヒント</summary>

`LIKE '%藤%'` で「藤」を含む文字列を検索できます。

</details>

<details>
<summary>解答</summary>

```sql
SELECT * FROM employees WHERE name LIKE '%藤%';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
2  | 佐藤花子 | 営業部     | 320000
5  | 伊藤健太 | 営業部     | 280000
```

</details>

---

## Mission 7: ANDで複合条件を使おう

### タスク

在庫が20個以上で、かつ価格が1万円以下の商品を表示してください。

<details>
<summary>ヒント</summary>

`AND` で2つの条件を組み合わせます。`stock >= 20 AND price <= 10000` です。

</details>

<details>
<summary>解答</summary>

```sql
SELECT * FROM products WHERE stock >= 20 AND price <= 10000;
```

実行結果：

```
id | name       | category | price | stock
---+------------+----------+-------+------
2  | マウス     | 電子機器 | 2500  | 100
6  | キーボード | 電子機器 | 8000  | 50
```

</details>

---

## Mission 8: チャレンジ - AND + OR + 括弧

### タスク

以下の条件に合う社員を表示してください。

- **開発部で給料35万以上の社員**、または
- **営業部で給料30万以上の社員**

<details>
<summary>ヒント</summary>

`AND` と `OR` を組み合わせます。括弧 `()` で条件をグループ化するのがポイントです。

```sql
WHERE (条件A AND 条件B) OR (条件C AND 条件D)
```

</details>

<details>
<summary>解答</summary>

```sql
SELECT * FROM employees
WHERE (department = '開発部' AND salary >= 350000)
   OR (department = '営業部' AND salary >= 300000);
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
2  | 佐藤花子 | 営業部     | 320000
3  | 鈴木一郎 | 開発部     | 400000
```

解説：
- 田中太郎：開発部で35万 → 該当
- 佐藤花子：営業部で32万（30万以上） → 該当
- 鈴木一郎：開発部で40万（35万以上） → 該当
- 高橋美咲：人事部 → どちらの条件にも該当しない
- 伊藤健太：営業部で28万（30万未満） → 該当しない

</details>

---

## 達成度チェック

| Mission | 内容 | 使用テクニック | 完了 |
|---------|------|---------------|------|
| 1 | 部署で絞り込み | WHERE = | [ ] |
| 2 | 給料で比較 | >= | [ ] |
| 3 | カテゴリで絞り込み | WHERE = | [ ] |
| 4 | 価格の範囲指定 | BETWEEN | [ ] |
| 5 | 複数部署を指定 | IN | [ ] |
| 6 | 名前のパターン検索 | LIKE | [ ] |
| 7 | 複合条件 | AND | [ ] |
| 8 | 高度な複合条件 | AND + OR + () | [ ] |

### 採点基準

| クリア数 | 判定 |
|----------|------|
| 8問 | 完璧！条件検索マスター！ |
| 6-7問 | 合格！実務で使えるレベル |
| 4-5問 | もう少し。苦手な部分を復習しよう |
| 3問以下 | Step 3の各レッスンを復習しよう |

---

## チェックリスト

- [ ] 等号 `=` で文字列・数値の絞り込みができた
- [ ] 比較演算子 `>=`, `<=` を使えた
- [ ] `BETWEEN` で範囲指定ができた
- [ ] `IN` で複数の値を指定できた
- [ ] `LIKE` でパターン検索ができた
- [ ] `AND` で複合条件を書けた
- [ ] `AND` + `OR` + 括弧で高度な条件を書けた

---

## 次のステップへ

演習お疲れさまでした！

次のセクションでは、Step 3の理解度チェックです。
クイズに挑戦して、WHERE句のスキルを確認しましょう！

---

*推定所要時間: 90分*
