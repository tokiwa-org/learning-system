# SELECT文の基本

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 2
subStep: 1
title: "SELECT文の基本"
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

> 「じゃあ、データベースからデータを取り出してみよう」
>
> 「Step 1で作ったテーブルにデータを入れたんですよね？」
>
> 「そう。データベースに入れたデータは、SQLで取り出せるんだ。一番使うのが SELECT 文だよ」
>
> 「SELECT...選ぶ、ってことですか？」
>
> 「そのとおり。実はSQLの80%以上はSELECTだと言われているんだ。まずはここからマスターしよう」

---

## 練習用テーブルを追加しよう

Step 1で作った `practice.db` にはすでに `employees` テーブルがあります。
今回のStep 2で使う `products` テーブルも追加しましょう。

### SQLiteを起動

```bash
sqlite3 practice.db
```

### productsテーブルを作成

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price INTEGER,
    stock INTEGER
);
```

### データを投入

```sql
INSERT INTO products VALUES (1, 'ノートPC', '電子機器', 89000, 15);
INSERT INTO products VALUES (2, 'マウス', '電子機器', 2500, 100);
INSERT INTO products VALUES (3, 'デスク', '家具', 35000, 8);
INSERT INTO products VALUES (4, 'チェア', '家具', 45000, 12);
INSERT INTO products VALUES (5, 'モニター', '電子機器', 32000, 20);
INSERT INTO products VALUES (6, 'キーボード', '電子機器', 8000, 50);
INSERT INTO products VALUES (7, 'ヘッドセット', '電子機器', 12000, 30);
INSERT INTO products VALUES (8, 'ブックシェルフ', '家具', 18000, 5);
```

### テーブルが作られたか確認

```sql
.tables
```

出力：
```
employees  products
```

2つのテーブルが表示されれば準備完了です。

---

## SELECT文とは

**SELECT文**は、テーブルからデータを取り出すためのSQL文です。

SQLで最も使用頻度が高く、実務でのSQL操作の **80%以上** がSELECTだと言われています。

---

## 基本構文

```sql
SELECT * FROM テーブル名;
```

| 要素 | 意味 |
|------|------|
| `SELECT` | 「取り出す」という命令 |
| `*` | 「すべてのカラム」を意味する記号（アスタリスク） |
| `FROM` | 「〜から」 |
| `テーブル名` | データを取り出すテーブル |
| `;` | SQL文の終わりを示す記号 |

> `SELECT * FROM employees;` を日本語にすると、
> 「employeesテーブルから、すべてのカラムを取り出して」という意味です。

---

## 実際にやってみよう

### employeesテーブルのデータを取り出す

```sql
SELECT * FROM employees;
```

出力：
```
1|田中太郎|開発部|350000
2|佐藤花子|営業部|320000
3|鈴木一郎|開発部|400000
4|高橋美咲|人事部|300000
5|伊藤健太|営業部|280000
```

5人の社員データがすべて表示されました！

### 出力を見やすくする

SQLiteの出力が見にくい場合は、以下の設定を実行してください。

```sql
.mode column
.headers on
```

もう一度実行してみましょう。

```sql
SELECT * FROM employees;
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
1   田中太郎  開発部      350000
2   佐藤花子  営業部      320000
3   鈴木一郎  開発部      400000
4   高橋美咲  人事部      300000
5   伊藤健太  営業部      280000
```

カラム名がヘッダーとして表示され、見やすくなりました。

---

## productsテーブルも見てみよう

```sql
SELECT * FROM products;
```

出力：
```
id  name            category  price  stock
--  --------------  --------  -----  -----
1   ノートPC        電子機器  89000  15
2   マウス          電子機器  2500   100
3   デスク          家具      35000  8
4   チェア          家具      45000  12
5   モニター        電子機器  32000  20
6   キーボード      電子機器  8000   50
7   ヘッドセット    電子機器  12000  30
8   ブックシェルフ  家具      18000  5
```

8件の商品データがすべて表示されました。

---

## SELECT文のルール

### 1. 大文字・小文字は区別されない

```sql
SELECT * FROM employees;
select * from employees;
Select * From Employees;
```

どれも同じ結果になります。ただし、**SQL文のキーワードは大文字**で書くのが慣習です。

### 2. セミコロン（;）を忘れない

```sql
SELECT * FROM employees
```

セミコロンがないと、SQLiteは「まだ続きがある」と思って待ち続けます。

もし入力待ちになってしまったら、`;` を入力してEnterを押してください。

### 3. テーブル名は正確に

```sql
SELECT * FROM employee;  -- 's' が抜けている！
```

エラー：
```
Error: no such table: employee
```

テーブル名を間違えるとエラーになります。`.tables` で確認しましょう。

---

## よくあるトラブル

### 「何も表示されない」

テーブルにデータが入っていない可能性があります。

```sql
.tables
```

でテーブルの存在を確認し、データを再投入してください。

### 「Error: no such table」

テーブル名が間違っているか、別のデータベースファイルを開いている可能性があります。

```sql
.tables  -- テーブル一覧を確認
```

### 「...>」と表示されて入力待ちになる

セミコロン（`;`）を忘れています。`;` を入力してEnterを押してください。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```sql
-- 1. SQLiteを起動（まだの場合）
-- sqlite3 practice.db

-- 2. 表示設定
.mode column
.headers on

-- 3. テーブル一覧を確認
.tables

-- 4. employeesテーブルの全データを取り出す
SELECT * FROM employees;

-- 5. productsテーブルの全データを取り出す
SELECT * FROM products;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| SELECT文 | テーブルからデータを取り出すSQL文 |
| `*`（アスタリスク） | すべてのカラムを意味する |
| `FROM テーブル名` | どのテーブルから取り出すか指定する |
| `;`（セミコロン） | SQL文の終わりを示す（必須） |
| 使用頻度 | SQLの80%以上がSELECT文 |

### チェックリスト

- [ ] `SELECT * FROM employees;` でデータを取り出せた
- [ ] `SELECT * FROM products;` でデータを取り出せた
- [ ] 出力結果の意味を理解できた

---

## 次のステップへ

SELECT文で全データを取り出せるようになりましたね。

次のセクションでは、必要なカラムだけを選んで取り出す方法を学びます。
「全部じゃなくて、名前と給料だけ欲しい」という場面で使えますよ！

---

*推定読了時間: 30分*
