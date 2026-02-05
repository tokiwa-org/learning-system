# 演習：データ操作マスター

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 4
subStep: 5
title: "演習：データ操作マスター"
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

> 「INSERT、UPDATE、DELETE、CREATE TABLEを一通り学んだね」
>
> 「はい！でもまだ自信がなくて...」
>
> 「大丈夫、実際に手を動かして練習すれば身につくよ。今日はミッション形式で一通りやってみよう」
>
> 「ミッション形式ですか？やってみます！」

---

## 準備

### SQLiteを起動

```bash
sqlite3 practice.db
```

### 表示設定

```sql
.mode column
.headers on
```

### 現在のデータを確認

```sql
SELECT * FROM employees;
SELECT * FROM products;
SELECT * FROM orders;
```

> **注意**: これまでのステップでデータを変更している場合、表示が異なることがあります。
> その場合でも、各ミッションの指示に従って進めてください。

---

## Mission 1: 新しい社員を追加（INSERT）

**依頼**: 新しい社員「松本さくら」さんが経理部に入社しました。給料は280000円です。

idは既存データと重複しない番号を使ってください。

<details>
<summary>ヒント</summary>

```sql
-- まず現在の最大idを確認
SELECT MAX(id) FROM employees;

-- そのidより大きい番号を使う
INSERT INTO employees (id, name, department, salary) VALUES (?, '松本さくら', '経理部', 280000);
```

</details>

<details>
<summary>解答</summary>

```sql
-- 現在のデータを確認
SELECT * FROM employees;

-- 最大idを確認
SELECT MAX(id) FROM employees;

-- 新しい社員を追加（idは状況に応じて変更してください）
INSERT INTO employees (id, name, department, salary) VALUES (9, '松本さくら', '経理部', 280000);

-- 結果を確認
SELECT * FROM employees;
```

</details>

---

## Mission 2: 商品の価格を更新（UPDATE）

**依頼**: ノートPC（id=1）の価格が値上がりしました。89000円から95000円に更新してください。

<details>
<summary>ヒント</summary>

```sql
-- まずSELECTで確認してからUPDATE
SELECT * FROM products WHERE id = 1;
UPDATE products SET price = ? WHERE id = 1;
```

</details>

<details>
<summary>解答</summary>

```sql
-- 更新前を確認
SELECT * FROM products WHERE id = 1;

-- 価格を更新
UPDATE products SET price = 95000 WHERE id = 1;

-- 更新後を確認
SELECT * FROM products WHERE id = 1;
```

出力（更新後）：
```
id  name      category  price  stock
--  --------  --------  -----  -----
1   ノートPC  電子機器  95000  15
```

</details>

---

## Mission 3: 特定の社員の部署を変更（UPDATE）

**依頼**: 高橋美咲さん（id=4）が人事部から営業部に異動しました。部署を更新してください。

<details>
<summary>ヒント</summary>

UPDATEでdepartmentカラムを変更します。WHERE句を忘れずに！

</details>

<details>
<summary>解答</summary>

```sql
-- 更新前を確認
SELECT * FROM employees WHERE id = 4;

-- 部署を変更
UPDATE employees SET department = '営業部' WHERE id = 4;

-- 更新後を確認
SELECT * FROM employees WHERE id = 4;
```

出力（更新後）：
```
id  name      department  salary
--  --------  ----------  ------
4   高橋美咲  営業部      300000
```

</details>

---

## Mission 4: 在庫が0の商品を削除（DELETE）

**依頼**: 在庫が0の商品があれば削除してください。まず在庫0の商品を1つ作ってから削除します。

<details>
<summary>ヒント</summary>

```sql
-- まず在庫0の商品を追加
INSERT INTO products (id, name, category, price, stock) VALUES (?, '廃盤マウスパッド', '電子機器', 500, 0);

-- SELECTで確認してからDELETE
SELECT * FROM products WHERE stock = 0;
DELETE FROM products WHERE stock = 0;
```

</details>

<details>
<summary>解答</summary>

```sql
-- 在庫0の商品を追加（練習用）
INSERT INTO products (id, name, category, price, stock) VALUES (11, '廃盤マウスパッド', '電子機器', 500, 0);

-- 在庫0の商品を確認
SELECT * FROM products WHERE stock = 0;

-- 削除
DELETE FROM products WHERE stock = 0;

-- 削除されたか確認
SELECT * FROM products WHERE stock = 0;

-- 全商品を確認
SELECT * FROM products;
```

</details>

---

## Mission 5: ordersテーブルに3件の注文を追加（INSERT）

**依頼**: 以下の3件の注文を追加してください。

| id | product_name | quantity | customer_name | order_date |
|----|-------------|----------|---------------|------------|
| 7 | ウェブカメラ | 4 | 山本商事 | 2026-02-01 |
| 8 | ヘッドセット | 6 | 佐々木電機 | 2026-02-03 |
| 9 | デスクライト | 2 | 田中工業 | 2026-02-05 |

<details>
<summary>ヒント</summary>

3つのINSERT文を実行します。カラム名を指定する書き方を使いましょう。

</details>

<details>
<summary>解答</summary>

```sql
-- 3件の注文を追加
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (7, 'ウェブカメラ', 4, '山本商事', '2026-02-01');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (8, 'ヘッドセット', 6, '佐々木電機', '2026-02-03');
INSERT INTO orders (id, product_name, quantity, customer_name, order_date) VALUES (9, 'デスクライト', 2, '田中工業', '2026-02-05');

-- 結果を確認
SELECT * FROM orders;
```

</details>

---

## Mission 6: 注文の数量を更新（UPDATE）

**依頼**: 山本商事から連絡があり、注文id=1のノートPCの数量を2台から5台に変更したいとのことです。

<details>
<summary>ヒント</summary>

```sql
SELECT * FROM orders WHERE id = 1;
UPDATE orders SET quantity = ? WHERE id = 1;
```

</details>

<details>
<summary>解答</summary>

```sql
-- 更新前を確認
SELECT * FROM orders WHERE id = 1;

-- 数量を更新
UPDATE orders SET quantity = 5 WHERE id = 1;

-- 更新後を確認
SELECT * FROM orders WHERE id = 1;
```

出力（更新後）：
```
id  product_name  quantity  customer_name  order_date
--  ------------  --------  -------------  ----------
1   ノートPC      5         山本商事       2026-01-10
```

</details>

---

## Mission 7: 全社員の給料を10%アップ（Challenge）

**依頼**: 会社の業績が好調で、全社員の給料を10%アップすることになりました。

> **チャレンジ問題です。** WHERE句なしのUPDATEを「意図的に」使うケースです。

<details>
<summary>ヒント</summary>

全員を対象にする場合はWHERE句を使いません。
計算式 `salary * 1.1` を使います。

</details>

<details>
<summary>解答</summary>

```sql
-- 更新前を確認
SELECT name, salary FROM employees;

-- 全社員の給料を10%アップ
UPDATE employees SET salary = salary * 1.1;

-- 更新後を確認
SELECT name, salary FROM employees;
```

> **ポイント**: 今回は全員を対象にしたいので、意図的にWHERE句を省略しています。
> 「WHERE句なし = 全行が対象」を理解した上で使っているのがポイントです。

</details>

---

## Mission 8: テーブルの作成（Challenge）

**依頼**: 学生管理のための `students` テーブルを作成し、データを追加してください。

テーブル設計：

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | INTEGER | PRIMARY KEY | 学生ID |
| name | TEXT | NOT NULL | 名前 |
| grade | INTEGER | NOT NULL | 学年（1-4） |
| major | TEXT | NOT NULL | 専攻 |

追加するデータ：

| id | name | grade | major |
|----|------|-------|-------|
| 1 | 渡辺翔太 | 1 | 情報工学 |
| 2 | 木村あかり | 2 | 経営学 |
| 3 | 斎藤涼介 | 3 | 情報工学 |

<details>
<summary>ヒント</summary>

```sql
CREATE TABLE students (
    ...
);

INSERT INTO students (id, name, grade, major) VALUES (...);
```

</details>

<details>
<summary>解答</summary>

```sql
-- studentsテーブルを作成
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    grade INTEGER NOT NULL,
    major TEXT NOT NULL
);

-- テーブル構造を確認
.schema students

-- データを追加
INSERT INTO students (id, name, grade, major) VALUES (1, '渡辺翔太', 1, '情報工学');
INSERT INTO students (id, name, grade, major) VALUES (2, '木村あかり', 2, '経営学');
INSERT INTO students (id, name, grade, major) VALUES (3, '斎藤涼介', 3, '情報工学');

-- 結果を確認
SELECT * FROM students;
```

出力：
```
id  name        grade  major
--  ----------  -----  --------
1   渡辺翔太    1      情報工学
2   木村あかり  2      経営学
3   斎藤涼介    3      情報工学
```

</details>

---

## 達成度チェック

| Mission | 内容 | 完了 |
|---------|------|------|
| 1 | 新しい社員を追加（INSERT） | [ ] |
| 2 | 商品の価格を更新（UPDATE） | [ ] |
| 3 | 社員の部署を変更（UPDATE） | [ ] |
| 4 | 在庫0の商品を削除（DELETE） | [ ] |
| 5 | ordersに3件の注文を追加（INSERT） | [ ] |
| 6 | 注文の数量を更新（UPDATE） | [ ] |
| 7 | (Challenge) 全社員の給料を10%アップ | [ ] |
| 8 | (Challenge) studentsテーブルを作成 | [ ] |

**6個以上クリア** → 合格！

---

## まとめ

この演習で使ったSQL文：

| SQL文 | 用途 |
|-------|------|
| `INSERT INTO ... VALUES` | データの追加 |
| `UPDATE ... SET ... WHERE` | データの更新 |
| `DELETE FROM ... WHERE` | データの削除 |
| `CREATE TABLE` | テーブルの作成 |
| `SELECT * FROM` | データの確認 |

### チェックリスト

- [ ] INSERT文で社員・商品・注文を追加できた
- [ ] UPDATE文で価格・部署・数量を更新できた
- [ ] DELETE文で条件に合うデータを削除できた
- [ ] CREATE TABLEで新しいテーブルを作成できた
- [ ] 各操作の前後にSELECTで確認する習慣が身についた

---

## 次のステップへ

データ操作の演習お疲れさまでした！

次のセクションでは、Step 4の理解度チェックです。
クイズに挑戦して、学んだことを振り返りましょう！

---

*推定所要時間: 90分*
