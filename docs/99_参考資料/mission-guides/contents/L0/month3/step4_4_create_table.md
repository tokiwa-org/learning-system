# CREATE TABLEでテーブルを作ろう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 4
subStep: 4
title: "CREATE TABLEでテーブルを作ろう"
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

> 「新しいプロジェクトで、注文管理の機能を作ることになったんだ」
>
> 「注文データを保存するテーブルが必要ですね」
>
> 「そう。今までは既にあるテーブルを使っていたけど、今回は自分でテーブルを作ってみよう」
>
> 「テーブルを自分で作れるんですか？」
>
> 「CREATE TABLE を使えばできるよ。テーブルの設計は開発の基本だからね」

---

## CREATE TABLE文とは

**CREATE TABLE文**は、新しいテーブルを作成するためのSQL文です。

今までは用意されたテーブル（employees, products）を使っていましたが、
自分でテーブルの構造を定義して作ることができます。

---

## 基本構文

```sql
CREATE TABLE テーブル名 (
    カラム名1 データ型 制約,
    カラム名2 データ型 制約,
    カラム名3 データ型 制約
);
```

| 要素 | 意味 |
|------|------|
| `CREATE TABLE` | 「テーブルを作成する」という命令 |
| `テーブル名` | 作成するテーブルの名前 |
| `カラム名` | 各列の名前 |
| `データ型` | その列に入るデータの種類 |
| `制約` | データに対するルール |

---

## データ型

SQLiteで使える主なデータ型です。

| データ型 | 説明 | 例 |
|----------|------|-----|
| `INTEGER` | 整数 | 1, 42, -10, 300000 |
| `TEXT` | 文字列 | '田中太郎', '開発部', '2026-01-15' |
| `REAL` | 小数（浮動小数点数） | 3.14, 99.9, 0.5 |
| `BLOB` | バイナリデータ | 画像、ファイルなど |

> **ポイント**: 迷ったら `INTEGER`（数値）か `TEXT`（文字列）で大丈夫です。

---

## 制約（Constraints）

テーブルの各カラムには、データに対するルール（制約）を設定できます。

| 制約 | 意味 | 例 |
|------|------|-----|
| `PRIMARY KEY` | 主キー。行を一意に識別する。重複不可 | `id INTEGER PRIMARY KEY` |
| `NOT NULL` | NULLを許可しない。必ず値が必要 | `name TEXT NOT NULL` |
| `DEFAULT 値` | 値が指定されなかったときのデフォルト値 | `quantity INTEGER DEFAULT 1` |
| `UNIQUE` | 重複する値を許可しない | `email TEXT UNIQUE` |

---

## 注文テーブルを作ってみよう

注文管理のためのテーブルを作成します。

### テーブル設計

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | INTEGER | PRIMARY KEY | 注文ID |
| product_name | TEXT | NOT NULL | 商品名 |
| quantity | INTEGER | DEFAULT 1 | 数量（省略時は1） |
| customer_name | TEXT | NOT NULL | 顧客名 |
| order_date | TEXT | NOT NULL | 注文日 |

### SQLiteを起動

```bash
sqlite3 practice.db
```

### 表示設定

```sql
.mode column
.headers on
```

### CREATE TABLEを実行

```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    customer_name TEXT NOT NULL,
    order_date TEXT NOT NULL
);
```

### テーブルが作られたか確認

```sql
.tables
```

出力：
```
employees  orders     products
```

`orders` テーブルが追加されました！

### テーブルの構造を確認

```sql
.schema orders
```

出力：
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    customer_name TEXT NOT NULL,
    order_date TEXT NOT NULL
);
```

---

## サンプルデータを追加しよう

作成したテーブルにデータを入れてみましょう。

```sql
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (1, 'ノートPC', 2, '山本商事', '2026-01-10');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (2, 'マウス', 10, '田中工業', '2026-01-12');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (3, 'モニター', 3, '山本商事', '2026-01-15');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (4, 'キーボード', 5, '佐々木電機', '2026-01-18');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (5, 'デスク', 1, '田中工業', '2026-01-20');
```

確認してみましょう。

```sql
SELECT * FROM orders;
```

出力：
```
id  product_name  quantity  customer_name  order_date
--  ------------  --------  -------------  ----------
1   ノートPC      2         山本商事       2026-01-10
2   マウス        10        田中工業       2026-01-12
3   モニター      3         山本商事       2026-01-15
4   キーボード    5         佐々木電機     2026-01-18
5   デスク        1         田中工業       2026-01-20
```

5件の注文データが追加されました！

---

## DEFAULTの動作を確認

`quantity` カラムには `DEFAULT 1` を設定しました。
値を指定しなかった場合、自動的に1が入ります。

```sql
INSERT INTO orders (id, product_name, customer_name, order_date) VALUES (6, 'チェア', '鈴木建設', '2026-01-22');
```

> `quantity` を指定していないことに注目してください。

```sql
SELECT * FROM orders WHERE id = 6;
```

出力：
```
id  product_name  quantity  customer_name  order_date
--  ------------  --------  -------------  ----------
6   チェア        1         鈴木建設       2026-01-22
```

`quantity` が自動的に `1` になりました！

---

## NOT NULLの動作を確認

`product_name` には `NOT NULL` 制約を設定しました。
NULLを入れようとするとエラーになります。

```sql
INSERT INTO orders (id, product_name, customer_name, order_date) VALUES (7, NULL, 'テスト会社', '2026-01-25');
```

エラー：
```
Error: NOT NULL constraint failed: orders.product_name
```

必須項目にNULLを入れることはできません。これがデータの品質を守る仕組みです。

---

## 同名テーブルの作成エラー

既に存在するテーブル名で `CREATE TABLE` を実行するとエラーになります。

```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    name TEXT
);
```

エラー：
```
Error: table orders already exists
```

### 対策: IF NOT EXISTS

テーブルが存在しない場合のみ作成するには、`IF NOT EXISTS` を使います。

```sql
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    name TEXT
);
```

テーブルが既に存在する場合はエラーにならず、何も起きません。

---

## DROP TABLE（テーブルの削除）

テーブルそのものを削除するには `DROP TABLE` を使います。

```sql
DROP TABLE テーブル名;
```

> **DROP TABLEはテーブルの構造ごとすべてのデータを完全に削除します。**
> DELETEはデータだけ削除しますが、DROPはテーブル自体がなくなります。

| コマンド | 効果 |
|----------|------|
| `DELETE FROM orders;` | ordersのデータを全削除。テーブルは残る |
| `DROP TABLE orders;` | ordersテーブルを完全に削除 |

> **注意**: DROP TABLE は学習目的で知っておくだけでOKです。本番環境で安易に使わないでください。

---

## ALTER TABLE（テーブルの変更）

既存のテーブルにカラムを追加するには `ALTER TABLE` を使います。

```sql
ALTER TABLE テーブル名 ADD COLUMN カラム名 データ型;
```

例：ordersテーブルに「備考」カラムを追加

```sql
ALTER TABLE orders ADD COLUMN notes TEXT;
```

確認：

```sql
.schema orders
```

出力（一部）：
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    customer_name TEXT NOT NULL,
    order_date TEXT NOT NULL
, notes TEXT);
```

`notes` カラムが追加されました。既存のデータの `notes` にはNULLが入ります。

> **注意**: SQLiteでは、カラムの削除やデータ型の変更はサポートされていません。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```sql
-- 1. SQLiteを起動（まだの場合）
-- sqlite3 practice.db

-- 2. 表示設定
.mode column
.headers on

-- 3. ordersテーブルを作成
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    customer_name TEXT NOT NULL,
    order_date TEXT NOT NULL
);

-- 4. テーブル一覧を確認
.tables

-- 5. テーブル構造を確認
.schema orders

-- 6. サンプルデータを追加
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (1, 'ノートPC', 2, '山本商事', '2026-01-10');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (2, 'マウス', 10, '田中工業', '2026-01-12');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (3, 'モニター', 3, '山本商事', '2026-01-15');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (4, 'キーボード', 5, '佐々木電機', '2026-01-18');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (5, 'デスク', 1, '田中工業', '2026-01-20');

-- 7. データを確認
SELECT * FROM orders;

-- 8. DEFAULTの動作を確認（quantityを省略）
INSERT INTO orders (id, product_name, customer_name, order_date) VALUES (6, 'チェア', '鈴木建設', '2026-01-22');
SELECT * FROM orders WHERE id = 6;

-- 9. NOT NULLの動作を確認（エラーになる）
INSERT INTO orders (id, product_name, customer_name, order_date) VALUES (7, NULL, 'テスト会社', '2026-01-25');

-- 10. ALTER TABLEでカラムを追加
ALTER TABLE orders ADD COLUMN notes TEXT;
.schema orders
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| CREATE TABLE | 新しいテーブルを作成するSQL文 |
| データ型 | INTEGER（整数）、TEXT（文字列）、REAL（小数）、BLOB（バイナリ） |
| PRIMARY KEY | 行を一意に識別する制約。重複不可 |
| NOT NULL | NULLを許可しない制約 |
| DEFAULT | 値が指定されなかったときのデフォルト値 |
| DROP TABLE | テーブルを構造ごと完全に削除 |
| ALTER TABLE | テーブルにカラムを追加 |

### チェックリスト

- [ ] CREATE TABLEでordersテーブルを作成できた
- [ ] .schemaでテーブル構造を確認できた
- [ ] サンプルデータを追加して確認できた
- [ ] DEFAULTとNOT NULLの動作を体験した

---

## 次のステップへ

CREATE TABLEで自分だけのテーブルを作れるようになりましたね。

次のセクションでは、これまで学んだINSERT、UPDATE、DELETE、CREATE TABLEを
総合的に使う演習に挑戦します。データ操作マスターを目指しましょう！

---

*推定読了時間: 30分*
