# カラムを指定して取り出そう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 2
subStep: 2
title: "カラムを指定して取り出そう"
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

> 「全部のカラムは要らないときもあるよね」
>
> 「えっ、毎回 `*` で全部取り出すんじゃないんですか？」
>
> 「実務では必要なカラムだけ取り出すことが多いんだ。テーブルに何十列もある場合、全部表示したら見づらいでしょ？」
>
> 「確かに...名前と給料だけ見たいときもありますよね」
>
> 「そう！それをやってみよう」

---

## 特定のカラムを指定する構文

```sql
SELECT カラム名1, カラム名2 FROM テーブル名;
```

`*` の代わりに、**取り出したいカラム名をカンマ区切り**で指定します。

---

## 実際にやってみよう

### 名前だけ取り出す

```sql
SELECT name FROM employees;
```

出力：
```
name
--------
田中太郎
佐藤花子
鈴木一郎
高橋美咲
伊藤健太
```

`name` カラムだけが表示されました。

### 名前と給料を取り出す

```sql
SELECT name, salary FROM employees;
```

出力：
```
name      salary
--------  ------
田中太郎  350000
佐藤花子  320000
鈴木一郎  400000
高橋美咲  300000
伊藤健太  280000
```

指定した `name` と `salary` の2つだけが表示されます。

### 名前と部署を取り出す

```sql
SELECT name, department FROM employees;
```

出力：
```
name      department
--------  ----------
田中太郎  開発部
佐藤花子  営業部
鈴木一郎  開発部
高橋美咲  人事部
伊藤健太  営業部
```

---

## カラムの順番を変えられる

SELECT文で指定した順番どおりに結果が表示されます。

### 部署→名前の順

```sql
SELECT department, name FROM employees;
```

出力：
```
department  name
----------  --------
開発部      田中太郎
営業部      佐藤花子
開発部      鈴木一郎
人事部      高橋美咲
営業部      伊藤健太
```

テーブルの定義では `name` が先ですが、SELECT文で `department` を先に書いたので、出力も `department` が左に来ています。

### 比較してみよう

```sql
-- テーブルの定義順
SELECT name, department FROM employees;

-- 逆順で指定
SELECT department, name FROM employees;
```

> **ポイント**: SELECT文のカラムの順番 = 出力の表示順

---

## productsテーブルでも練習

### 商品名と価格だけ

```sql
SELECT name, price FROM products;
```

出力：
```
name            price
--------------  -----
ノートPC        89000
マウス          2500
デスク          35000
チェア          45000
モニター        32000
キーボード      8000
ヘッドセット    12000
ブックシェルフ  18000
```

### 商品名と在庫数

```sql
SELECT name, stock FROM products;
```

出力：
```
name            stock
--------------  -----
ノートPC        15
マウス          100
デスク          8
チェア          12
モニター        20
キーボード      50
ヘッドセット    30
ブックシェルフ  5
```

### カテゴリと商品名と価格

```sql
SELECT category, name, price FROM products;
```

出力：
```
category  name            price
--------  --------------  -----
電子機器  ノートPC        89000
電子機器  マウス          2500
家具      デスク          35000
家具      チェア          45000
電子機器  モニター        32000
電子機器  キーボード      8000
電子機器  ヘッドセット    12000
家具      ブックシェルフ  18000
```

---

## `*` とカラム指定の使い分け

| 方法 | 使う場面 |
|------|----------|
| `SELECT *` | テーブルの中身をざっと確認したいとき |
| `SELECT カラム名` | 必要な情報だけ取り出したいとき |

### 実務では `*` の使いすぎに注意

`SELECT *` は便利ですが、実務では以下の理由からカラム指定が推奨されます。

1. **不要なデータを取り出さないので効率的**
2. **結果が見やすい**（必要な情報だけ表示）
3. **テーブル構造が変わっても影響を受けにくい**

> ただし、学習中やデータの確認時は `SELECT *` を気軽に使って大丈夫です。

---

## よくある間違い

### カンマの付け忘れ

```sql
SELECT name salary FROM employees;
```

エラーになるか、意図しない結果になります。

正しくは：
```sql
SELECT name, salary FROM employees;
```

### 存在しないカラム名

```sql
SELECT namae FROM employees;
```

エラー：
```
Error: no such column: namae
```

カラム名を確認しましょう。

```sql
PRAGMA table_info(employees);
```

---

## ハンズオン

以下のSQLを順番に実行してください。

```sql
-- 1. employeesテーブルから名前だけ取り出す
SELECT name FROM employees;

-- 2. 名前と給料を取り出す
SELECT name, salary FROM employees;

-- 3. 部署と名前を逆順で取り出す
SELECT department, name FROM employees;

-- 4. productsテーブルから商品名と価格を取り出す
SELECT name, price FROM products;

-- 5. productsテーブルからカテゴリ・商品名・在庫を取り出す
SELECT category, name, stock FROM products;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| カラム指定 | `SELECT カラム名1, カラム名2 FROM テーブル名;` |
| カンマ区切り | 複数カラムはカンマ `,` で区切る |
| 表示順 | SELECTで指定した順番どおりに出力される |
| 使い分け | 確認は `*`、実務ではカラム指定が推奨 |

### チェックリスト

- [ ] 特定のカラムだけを取り出せた
- [ ] 複数のカラムをカンマ区切りで指定できた
- [ ] カラムの順番を変えて出力できた

---

## 次のステップへ

必要なカラムだけを取り出せるようになりましたね。

次のセクションでは、`AS` 句を使ってカラム名に別名（エイリアス）を付ける方法を学びます。
英語のカラム名をわかりやすい日本語で表示できるようになりますよ！

---

*推定読了時間: 30分*
