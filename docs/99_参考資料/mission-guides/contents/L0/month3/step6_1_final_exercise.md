# 総合演習：オンラインショップのデータ分析

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 6
subStep: 1
title: "総合演習：オンラインショップのデータ分析"
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

> 「いよいよ最終演習だね。オンラインショップのデータ分析をしてもらうよ」
>
> 「ドキドキしますね...」
>
> 「大丈夫。ここまで学んだSQLを全部使えば必ずできるよ！」

---

## 演習概要

架空のオンラインショップを題材に、以下の作業を行います：

1. データベースとテーブルの作成
2. サンプルデータの投入
3. 基本的なデータ取得
4. 条件を指定した検索
5. データの追加・更新・削除
6. 並び替えと集計分析

---

## Part 1: データベースの作成（20分）

### タスク 1-1: テーブルを作成する

まずは3つのテーブルを作成します。

**顧客テーブル（customers）**:
```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    city TEXT,
    age INTEGER
);
```

**商品テーブル（items）**:
```sql
CREATE TABLE items (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price INTEGER NOT NULL,
    stock INTEGER DEFAULT 0
);
```

**注文テーブル（orders）**:
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    item_id INTEGER,
    quantity INTEGER NOT NULL,
    order_date TEXT NOT NULL
);
```

### タスク 1-2: サンプルデータを投入する

**顧客データ（8件）**:
```sql
INSERT INTO customers (id, name, email, city, age) VALUES
    (1, '山田太郎', 'yamada@example.com', '東京', 28),
    (2, '佐藤花子', 'sato@example.com', '大阪', 34),
    (3, '鈴木一郎', 'suzuki@example.com', '東京', 22),
    (4, '田中美咲', 'tanaka@example.com', '名古屋', 29),
    (5, '高橋健太', 'takahashi@example.com', '福岡', 45),
    (6, '伊藤直樹', 'ito@example.com', '大阪', 31),
    (7, '渡辺真理', 'watanabe@example.com', '東京', 26),
    (8, '小林修平', 'kobayashi@example.com', '名古屋', 38);
```

**商品データ（10件）**:
```sql
INSERT INTO items (id, name, category, price, stock) VALUES
    (1, 'SQL入門書', '書籍', 2800, 15),
    (2, 'データベース実践ガイド', '書籍', 3500, 8),
    (3, 'ワイヤレスマウス', '電子機器', 4500, 20),
    (4, 'USBハブ', '電子機器', 2200, 30),
    (5, 'ノートPC用スタンド', '電子機器', 6800, 5),
    (6, 'コーヒー豆 200g', '食品', 1200, 50),
    (7, '紅茶セット', '食品', 1800, 25),
    (8, 'プログラマーTシャツ', '衣類', 3200, 12),
    (9, 'パーカー', '衣類', 5500, 7),
    (10, 'エナジーバー 10本入', '食品', 980, 40);
```

**注文データ（12件）**:
```sql
INSERT INTO orders (id, customer_id, item_id, quantity, order_date) VALUES
    (1, 1, 1, 1, '2026-01-10'),
    (2, 1, 6, 2, '2026-01-10'),
    (3, 2, 3, 1, '2026-01-12'),
    (4, 3, 1, 1, '2026-01-15'),
    (5, 3, 10, 3, '2026-01-15'),
    (6, 4, 8, 2, '2026-01-18'),
    (7, 5, 5, 1, '2026-01-20'),
    (8, 2, 7, 1, '2026-01-22'),
    (9, 6, 2, 1, '2026-01-25'),
    (10, 7, 4, 2, '2026-01-28'),
    (11, 8, 9, 1, '2026-01-30'),
    (12, 1, 3, 1, '2026-02-01');
```

### チェックポイント

- [ ] 3つのテーブルを作成できた
- [ ] 顧客データ8件を投入できた
- [ ] 商品データ10件を投入できた
- [ ] 注文データ12件を投入できた

---

## Part 2: データの取得（15分）

### タスク 2-1: 全顧客の一覧を表示

すべての顧客情報を表示してください。

```sql
SELECT * FROM customers;
```

**期待結果**: 8件の顧客レコードが表示される

### タスク 2-2: 商品名と価格だけを表示

商品名を「商品名」、価格を「価格(円)」という列名で表示してください。

```sql
SELECT name AS '商品名', price AS '価格(円)' FROM items;
```

**期待結果**: 10件の商品が「商品名」「価格(円)」の列で表示される

### タスク 2-3: 顧客の住む都市の一覧（重複なし）

顧客が住んでいる都市を重複なしで表示してください。

```sql
SELECT DISTINCT city FROM customers;
```

**期待結果**: 東京、大阪、名古屋、福岡の4都市が表示される

### チェックポイント

- [ ] 全顧客の一覧を表示できた
- [ ] AS句で列名を変更できた
- [ ] DISTINCTで重複を除去できた

---

## Part 3: 条件検索（20分）

### タスク 3-1: 東京在住の顧客を表示

東京に住んでいる顧客を検索してください。

```sql
SELECT * FROM customers WHERE city = '東京';
```

**期待結果**: 山田太郎、鈴木一郎、渡辺真理の3件が表示される

### タスク 3-2: 価格が1000円以上5000円以下の商品を表示

BETWEENを使って価格範囲を指定してください。

```sql
SELECT * FROM items WHERE price BETWEEN 1000 AND 5000;
```

**期待結果**: SQL入門書、データベース実践ガイド、ワイヤレスマウス、USBハブ、コーヒー豆、紅茶セット、プログラマーTシャツの7件が表示される

### タスク 3-3: 書籍または食品カテゴリの商品を表示

INを使ってカテゴリを指定してください。

```sql
SELECT * FROM items WHERE category IN ('書籍', '食品');
```

**期待結果**: 書籍2件と食品3件の合計5件が表示される

### タスク 3-4: 名前に「田」がつく顧客を検索

LIKEを使って部分一致検索をしてください。

```sql
SELECT * FROM customers WHERE name LIKE '%田%';
```

**期待結果**: 山田太郎、田中美咲の2件が表示される

### チェックポイント

- [ ] WHERE句で条件検索できた
- [ ] BETWEENで範囲指定できた
- [ ] INで複数値の検索ができた
- [ ] LIKEで部分一致検索ができた

---

## Part 4: データの操作（15分）

### タスク 4-1: 新しい顧客を追加（INSERT）

新しい顧客を1件追加してください。

```sql
INSERT INTO customers (id, name, email, city, age)
VALUES (9, '中村さくら', 'nakamura@example.com', '札幌', 27);
```

追加されたか確認：
```sql
SELECT * FROM customers WHERE id = 9;
```

### タスク 4-2: 商品の価格を更新（UPDATE）

「SQL入門書」の価格を2800円から3000円に変更してください。

```sql
UPDATE items SET price = 3000 WHERE id = 1;
```

更新されたか確認：
```sql
SELECT * FROM items WHERE id = 1;
```

### タスク 4-3: 在庫が0の商品を削除（DELETE）

まず、テスト用に1つの商品の在庫を0にします。

```sql
UPDATE items SET stock = 0 WHERE id = 10;
```

在庫が0の商品を確認：
```sql
SELECT * FROM items WHERE stock = 0;
```

在庫が0の商品を削除：
```sql
DELETE FROM items WHERE stock = 0;
```

削除されたか確認：
```sql
SELECT * FROM items;
```

**期待結果**: 9件の商品が表示される（エナジーバーが削除されている）

### チェックポイント

- [ ] INSERTで新しいレコードを追加できた
- [ ] UPDATEでデータを更新できた
- [ ] DELETEでデータを削除できた

---

## Part 5: 並び替え・集計（20分）

### タスク 5-1: 商品を価格の高い順に表示

```sql
SELECT name, price FROM items ORDER BY price DESC;
```

**期待結果**: ノートPC用スタンド（6800円）が最上位に表示される

### タスク 5-2: 最も安い商品TOP3

```sql
SELECT name, price FROM items ORDER BY price ASC LIMIT 3;
```

**期待結果**: 価格の安い順に3件が表示される

### タスク 5-3: 商品の総数、平均価格、最高価格、最低価格

```sql
SELECT
    COUNT(*) AS '商品総数',
    AVG(price) AS '平均価格',
    MAX(price) AS '最高価格',
    MIN(price) AS '最低価格'
FROM items;
```

**期待結果**: 集計結果が1行で表示される

### タスク 5-4: カテゴリごとの商品数と平均価格

```sql
SELECT
    category AS 'カテゴリ',
    COUNT(*) AS '商品数',
    AVG(price) AS '平均価格'
FROM items
GROUP BY category;
```

**期待結果**: カテゴリ別に商品数と平均価格が表示される

### タスク 5-5: 顧客の平均年齢

```sql
SELECT AVG(age) AS '平均年齢' FROM customers;
```

**期待結果**: 顧客の平均年齢が表示される

### チェックポイント

- [ ] ORDER BYで並び替えができた
- [ ] LIMITで取得件数を制限できた
- [ ] 集計関数（COUNT, AVG, MAX, MIN）を使えた
- [ ] GROUP BYでグループ集計ができた

---

## 達成度チェック

| Part | 課題 | 配点 | 完了 |
|------|------|------|------|
| 1 | データベースの作成 | 20点 | □ |
| 2 | データの取得（3問） | 15点 | □ |
| 3 | 条件検索（4問） | 20点 | □ |
| 4 | データの操作（3問） | 15点 | □ |
| 5 | 並び替え・集計（5問） | 30点 | □ |
| - | **合計** | **100点** | - |

**すべてクリア** → 演習完了！

---

## 後片付け

演習が終わったら、テーブルを削除してデータベースをきれいにしましょう。

```sql
DROP TABLE orders;
DROP TABLE items;
DROP TABLE customers;
```

---

## まとめ

この演習で実践したこと：

### テーブル操作

| 操作 | SQL |
|------|-----|
| テーブル作成 | `CREATE TABLE テーブル名 (...)` |
| テーブル削除 | `DROP TABLE テーブル名` |

### データ取得

| 操作 | SQL |
|------|-----|
| 全件取得 | `SELECT * FROM テーブル名` |
| 列の選択 | `SELECT 列1, 列2 FROM テーブル名` |
| 列名の変更 | `SELECT 列 AS '別名'` |
| 重複排除 | `SELECT DISTINCT 列 FROM テーブル名` |

### 条件検索

| 操作 | SQL |
|------|-----|
| 完全一致 | `WHERE 列 = '値'` |
| 範囲指定 | `WHERE 列 BETWEEN A AND B` |
| 複数値 | `WHERE 列 IN ('値1', '値2')` |
| 部分一致 | `WHERE 列 LIKE '%パターン%'` |

### データ操作

| 操作 | SQL |
|------|-----|
| データ追加 | `INSERT INTO テーブル名 VALUES (...)` |
| データ更新 | `UPDATE テーブル名 SET 列 = 値 WHERE 条件` |
| データ削除 | `DELETE FROM テーブル名 WHERE 条件` |

### 並び替え・集計

| 操作 | SQL |
|------|-----|
| 昇順 | `ORDER BY 列 ASC` |
| 降順 | `ORDER BY 列 DESC` |
| 件数制限 | `LIMIT 数` |
| グループ集計 | `GROUP BY 列` |
| 集計関数 | `COUNT`, `AVG`, `MAX`, `MIN` |

---

## 次のステップへ

総合演習お疲れさまでした！

次のセクションでは、SQL基礎の卒業クイズに挑戦します。
ここまで学んだ知識を確認して、SQL基礎をマスターしましょう！

---

*推定所要時間: 90分*
