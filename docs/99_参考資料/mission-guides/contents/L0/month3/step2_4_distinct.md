# DISTINCTで重複を除こう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 2
subStep: 4
title: "DISTINCTで重複を除こう"
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

> 「部署の一覧が欲しいんだけど、重複があるなぁ」
>
> 「どういうことですか？」
>
> 「やってみせるよ。`SELECT department FROM employees;` を実行してみて」
>
> 「あ、開発部が2回、営業部が2回出てきますね...」
>
> 「そう。これを重複なしで表示したいときに使うのが `DISTINCT` だよ」

---

## 問題を確認しよう

まずは重複がある状態を見てみましょう。

```sql
SELECT department FROM employees;
```

出力：
```
department
----------
開発部
営業部
開発部
人事部
営業部
```

`開発部` と `営業部` が **2回ずつ** 表示されています。
部署の一覧が欲しいだけなのに、これでは見づらいですね。

---

## DISTINCTとは

**DISTINCT**は、SELECT文の結果から **重複する行を除外** するキーワードです。

### 基本構文

```sql
SELECT DISTINCT カラム名 FROM テーブル名;
```

`SELECT` の直後に `DISTINCT` を付けるだけです。

---

## 実際にやってみよう

### 部署の一覧（重複なし）

```sql
SELECT DISTINCT department FROM employees;
```

出力：
```
department
----------
開発部
営業部
人事部
```

3つの部署が **1回ずつ** だけ表示されました。

### 比較してみよう

```sql
-- DISTINCTなし（5行）
SELECT department FROM employees;

-- DISTINCTあり（3行）
SELECT DISTINCT department FROM employees;
```

---

## productsテーブルで使ってみよう

### カテゴリの一覧（重複なし）

```sql
SELECT DISTINCT category FROM products;
```

出力：
```
category
--------
電子機器
家具
```

商品は8件ありますが、カテゴリは `電子機器` と `家具` の2種類だけです。

### 重複ありと比較

```sql
-- DISTINCTなし（8行 - 全商品分）
SELECT category FROM products;

-- DISTINCTあり（2行 - カテゴリ種類だけ）
SELECT DISTINCT category FROM products;
```

---

## 複数カラムでDISTINCT

DISTINCTは複数カラムの **組み合わせ** に対しても使えます。

```sql
SELECT DISTINCT department, salary FROM employees;
```

出力：
```
department  salary
----------  ------
開発部      350000
営業部      320000
開発部      400000
人事部      300000
営業部      280000
```

この場合、`department` と `salary` の **組み合わせ** が同じ行が除外されます。
今回はすべての組み合わせが異なるので、5行すべてが表示されています。

> **ポイント**: 複数カラムでDISTINCTを使うと、「すべてのカラムの値が一致する行」だけが重複とみなされます。

---

## COUNTとDISTINCTの組み合わせ

「重複を除いた数を数えたい」という場面も多いです。

### 部署の数を数える

```sql
SELECT COUNT(DISTINCT department) FROM employees;
```

出力：
```
COUNT(DISTINCT department)
--------------------------
3
```

社員は5人いますが、部署は **3種類** だとわかります。

### カテゴリの数を数える

```sql
SELECT COUNT(DISTINCT category) FROM products;
```

出力：
```
COUNT(DISTINCT category)
------------------------
2
```

商品は8件ありますが、カテゴリは **2種類** です。

### 比較: COUNTだけの場合

```sql
-- 全行数をカウント（5）
SELECT COUNT(department) FROM employees;

-- 重複を除いてカウント（3）
SELECT COUNT(DISTINCT department) FROM employees;
```

`COUNT` だけだと重複も含めて数えるので `5`、`COUNT(DISTINCT ...)` だと重複を除いて `3` になります。

---

## DISTINCTの注意点

### 1. DISTINCTはSELECTの直後に書く

```sql
-- 正しい
SELECT DISTINCT department FROM employees;

-- 間違い
SELECT department DISTINCT FROM employees;
```

### 2. 全カラムに対して効く

```sql
SELECT DISTINCT name, department FROM employees;
```

この場合、`name` だけ、`department` だけではなく、**両方のカラムの組み合わせ** で重複判定されます。

### 3. NULLも1つにまとめられる

もしNULLが複数行にあった場合、DISTINCTは **NULLを1つだけ** 残します。

---

## よくある間違い

### DISTINCTの位置を間違える

```sql
-- 間違い
SELECT name, DISTINCT department FROM employees;

-- 正しい
SELECT DISTINCT name, department FROM employees;
```

`DISTINCT` は必ず `SELECT` の直後に置きます。

### 1つのカラムだけにDISTINCTを適用したい

```sql
-- こうは書けない
SELECT name, DISTINCT department FROM employees;
```

DISTINCTは行全体に対して効くので、特定のカラムだけに適用することはできません。

---

## ハンズオン

以下のSQLを順番に実行してください。

```sql
-- 1. 部署一覧を重複ありで表示
SELECT department FROM employees;

-- 2. 部署一覧を重複なしで表示
SELECT DISTINCT department FROM employees;

-- 3. カテゴリ一覧を重複なしで表示
SELECT DISTINCT category FROM products;

-- 4. 部署の数をカウント
SELECT COUNT(DISTINCT department) FROM employees;

-- 5. カテゴリの数をカウント
SELECT COUNT(DISTINCT category) FROM products;

-- 6. 複数カラムでDISTINCT
SELECT DISTINCT department, salary FROM employees;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| DISTINCT | 重複する行を除外して表示する |
| 基本構文 | `SELECT DISTINCT カラム名 FROM テーブル名;` |
| 位置 | `SELECT` の直後に書く |
| 複数カラム | すべてのカラムの組み合わせで重複判定 |
| COUNTと組み合わせ | `COUNT(DISTINCT カラム名)` で種類数を数える |

### チェックリスト

- [ ] `DISTINCT` で重複を除いた一覧を取得できた
- [ ] `COUNT(DISTINCT ...)` で種類の数を数えられた
- [ ] 複数カラムでのDISTINCTの動作を理解できた

---

## 次のステップへ

DISTINCTで重複を除けるようになりましたね。

次のセクションでは、Step 2で学んだ内容を総合的に使う演習問題に挑戦します。
先輩からのデータ取得依頼をこなしてみましょう！

---

*推定読了時間: 30分*
