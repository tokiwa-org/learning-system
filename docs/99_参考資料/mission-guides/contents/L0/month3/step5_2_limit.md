# LIMITで件数を制限しよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 5
subStep: 2
title: "LIMITで件数を制限しよう"
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

> 「先輩、給料の高い上位3人だけ表示したいんですけど...」
>
> 「LIMITを使えば件数を絞れるよ」
>
> 「リミット...制限ってことですか？」
>
> 「そう。ORDER BYと組み合わせると "トップ3" みたいな表示が簡単にできるんだ」

---

## LIMIT句とは

`LIMIT` = **取得する行数を制限する**ための句です。

### 例え話

LIMITは「ここまで」を決めるストッパーのようなもの。

- 検索結果の「1ページ目だけ」表示する
- ランキングの「上位5件」だけ取り出す
- 大量データから「最初の10件」だけ確認する

---

## 基本構文

```sql
SELECT カラム名 FROM テーブル名 LIMIT 件数;
```

### 最初の3件だけ取得

```sql
SELECT * FROM employees LIMIT 3;
```

実行結果：

```
id  name      department  salary
--  --------  ----------  ------
1   田中太郎  開発部      350000
2   佐藤花子  営業部      320000
3   鈴木一郎  開発部      400000
```

8人いる社員から、最初の3人だけが表示されました。

> ORDER BYを指定しない場合、データの格納順に取得されます。

---

## ORDER BY + LIMIT = Top Nパターン

ORDER BYとLIMITを組み合わせると、**「上位N件」** を取り出せます。

### 給料が高い上位3人

```sql
SELECT * FROM employees ORDER BY salary DESC LIMIT 3;
```

実行結果：

```
id  name      department  salary
--  --------  ----------  ------
3   鈴木一郎  開発部      400000
1   田中太郎  開発部      350000
8   小林大輔  人事部      330000
```

> これが **Top Nパターン** です。実務で非常によく使います。

### 価格が安い商品TOP3

```sql
SELECT * FROM products ORDER BY price ASC LIMIT 3;
```

実行結果：

```
id  name        category  price  stock
--  ----------  --------  -----  -----
2   マウス      電子機器  2500   100
9   ウェブカメラ 電子機器  5000   25
10  デスクライト 家具      7000   40
```

---

## 最も高い商品TOP5

```sql
SELECT name, price FROM products ORDER BY price DESC LIMIT 5;
```

実行結果：

```
name          price
------------  -----
ノートPC      89000
チェア        45000
デスク        35000
モニター      32000
ブックシェルフ 18000
```

---

## OFFSETで先頭をスキップ

`OFFSET` を使うと、先頭の数件をスキップしてからデータを取得できます。

```sql
SELECT * FROM employees ORDER BY salary DESC LIMIT 3 OFFSET 2;
```

意味：**上位2件をスキップして、次の3件を取得**

実行結果：

```
id  name      department  salary
--  --------  ----------  ------
8   小林大輔  人事部      330000
2   佐藤花子  営業部      320000
7   中村美月  営業部      310000
```

> 給料1位（鈴木）と2位（田中）をスキップして、3位〜5位を表示しています。

---

## ページネーション（ページ分け）

OFFSETを活用すると、データを「ページ」に分けて表示できます。

### 1ページ3件の場合

```sql
-- ページ1（1〜3件目）
SELECT * FROM employees ORDER BY id LIMIT 3 OFFSET 0;

-- ページ2（4〜6件目）
SELECT * FROM employees ORDER BY id LIMIT 3 OFFSET 3;

-- ページ3（7〜8件目）
SELECT * FROM employees ORDER BY id LIMIT 3 OFFSET 6;
```

### ページネーションの計算式

```
OFFSET = (ページ番号 - 1) × 1ページあたりの件数
```

| ページ | LIMIT | OFFSET | 表示される行 |
|--------|-------|--------|-------------|
| 1ページ目 | 3 | 0 | 1〜3件目 |
| 2ページ目 | 3 | 3 | 4〜6件目 |
| 3ページ目 | 3 | 6 | 7〜8件目 |

> Webサイトの「次のページ」ボタンの裏側では、このような仕組みが使われています。

---

## 実践的な使い方

### 最も安い商品3つ

```sql
SELECT name, price FROM products ORDER BY price ASC LIMIT 3;
```

### 在庫が多い商品TOP5

```sql
SELECT name, stock FROM products ORDER BY stock DESC LIMIT 5;
```

### 給料4位〜6位の社員

```sql
SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3 OFFSET 3;
```

---

## ハンズオン

SQLiteを起動して、以下のSQLを実行してみましょう。

```sql
-- 1. 表示設定（まだの場合）
.mode column
.headers on

-- 2. 社員の最初の3件を表示
SELECT * FROM employees LIMIT 3;

-- 3. 給料が高い上位3人を表示（Top Nパターン）
SELECT * FROM employees ORDER BY salary DESC LIMIT 3;

-- 4. 価格が安い商品TOP5を表示
SELECT name, price FROM products ORDER BY price ASC LIMIT 5;

-- 5. 給料が高い順で、上位2人をスキップして3人表示
SELECT * FROM employees ORDER BY salary DESC LIMIT 3 OFFSET 2;

-- 6. 商品を価格の高い順にページ1（3件ずつ）を表示
SELECT name, price FROM products ORDER BY price DESC LIMIT 3 OFFSET 0;

-- 7. 商品を価格の高い順にページ2を表示
SELECT name, price FROM products ORDER BY price DESC LIMIT 3 OFFSET 3;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| LIMIT | 取得する行数を制限する |
| Top Nパターン | `ORDER BY ... LIMIT N` で上位N件を取得 |
| OFFSET | 先頭の指定行数をスキップする |
| ページネーション | `LIMIT` + `OFFSET` でページ分けを実現 |
| 構文の順番 | `SELECT → FROM → WHERE → ORDER BY → LIMIT` |

### チェックリスト

- [ ] LIMIT句で件数を制限できた
- [ ] ORDER BYとLIMITを組み合わせてTop Nを取得できた
- [ ] OFFSETの仕組みを理解できた
- [ ] ページネーションの考え方を理解できた

---

## 次のステップへ

LIMITで件数制限ができるようになりましたね。

次のセクションでは、COUNT、SUM、AVGなどの集計関数を学びます。
「社員は全部で何人？」「平均給料は？」がSQLだけでわかるようになりますよ！

---

*推定読了時間: 30分*
