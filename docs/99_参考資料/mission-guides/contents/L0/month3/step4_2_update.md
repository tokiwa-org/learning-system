# UPDATEでデータを更新しよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 4
subStep: 2
title: "UPDATEでデータを更新しよう"
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

> 「鈴木さんが昇給したから、給料のデータを更新しないと」
>
> 「データを変更するんですね。SELECTで確認して、INSERTで追加はできましたけど...」
>
> 「既にあるデータを変更するには UPDATE 文を使うんだ」
>
> 「UPDATE...更新ですね。でも、間違えたら怖くないですか？」
>
> 「いい質問だね。UPDATE には絶対に守るべきルールがあるんだ。それも一緒に覚えよう」

---

## UPDATE文とは

**UPDATE文**は、テーブルの既存データを更新（変更）するためのSQL文です。

- INSERT = データを**追加**
- UPDATE = データを**変更**

---

## 基本構文

```sql
UPDATE テーブル名 SET カラム名 = 新しい値 WHERE 条件;
```

| 要素 | 意味 |
|------|------|
| `UPDATE` | 「更新する」という命令 |
| `テーブル名` | 更新するテーブル |
| `SET` | 変更内容を指定 |
| `カラム名 = 新しい値` | どのカラムをどの値に変更するか |
| `WHERE 条件` | どの行を更新するかの条件 |

---

## WHERE句を忘れると全行が更新される！

> **UPDATE文で最も重要な注意点です。必ず覚えてください。**

```sql
-- 正しい（鈴木一郎だけ更新）
UPDATE employees SET salary = 420000 WHERE id = 3;

-- 危険！（全員の給料が420000になる！）
UPDATE employees SET salary = 420000;
```

WHERE句がないと、テーブルの**すべての行**が更新されます。

### 安全な手順

1. **まずSELECTで確認する**（WHERE条件で対象行を確認）
2. **SELECTと同じWHEREでUPDATEする**

```sql
-- Step 1: 対象を確認
SELECT * FROM employees WHERE id = 3;

-- Step 2: 確認できたらUPDATE
UPDATE employees SET salary = 420000 WHERE id = 3;
```

> **鉄則**: UPDATE を実行する前に、必ず同じ WHERE 条件で SELECT を実行して対象行を確認する。

---

## 実際にやってみよう

### SQLiteを起動

```bash
sqlite3 practice.db
```

### 表示設定

```sql
.mode column
.headers on
```

### 1つのカラムを更新する

鈴木一郎さん（id=3）の給料を400000から420000に更新します。

**まずSELECTで確認：**

```sql
SELECT * FROM employees WHERE id = 3;
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
3   鈴木一郎  開発部      400000
```

対象が鈴木一郎さんであることを確認できました。

**UPDATEを実行：**

```sql
UPDATE employees SET salary = 420000 WHERE id = 3;
```

**結果を確認：**

```sql
SELECT * FROM employees WHERE id = 3;
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
3   鈴木一郎  開発部      420000
```

給料が420000に更新されました！

---

## 複数のカラムを同時に更新する

中村美月さん（id=7）の部署と給料を同時に変更します。

**まずSELECTで確認：**

```sql
SELECT * FROM employees WHERE id = 7;
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
7   中村美月  営業部      310000
```

**UPDATEを実行：**

```sql
UPDATE employees SET department = '開発部', salary = 340000 WHERE id = 7;
```

複数のカラムを更新するときは、`SET` の後にカンマ（`,`）で区切って指定します。

**結果を確認：**

```sql
SELECT * FROM employees WHERE id = 7;
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
7   中村美月  開発部      340000
```

部署が「営業部」から「開発部」に、給料が310000から340000に変更されました。

---

## WHERE条件で複数行を更新する

条件に一致する複数の行を一度に更新することもできます。

**例：営業部の全員の給料を5000円アップ**

**まずSELECTで確認：**

```sql
SELECT * FROM employees WHERE department = '営業部';
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
2   佐藤花子  営業部      320000
5   伊藤健太  営業部      280000
```

2人が対象であることを確認。

**UPDATEを実行：**

```sql
UPDATE employees SET salary = salary + 5000 WHERE department = '営業部';
```

> `salary = salary + 5000` のように、現在の値を使った計算もできます。

**結果を確認：**

```sql
SELECT * FROM employees WHERE department = '営業部';
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
2   佐藤花子  営業部      325000
5   伊藤健太  営業部      285000
```

2人の給料がそれぞれ5000円アップしました。

---

## 商品データも更新してみよう

マウスの価格と在庫を更新します。

```sql
-- 確認
SELECT * FROM products WHERE id = 2;

-- 更新
UPDATE products SET price = 3000, stock = 80 WHERE id = 2;

-- 結果確認
SELECT * FROM products WHERE id = 2;
```

出力：
```
id  name    category  price  stock
--  ------  --------  -----  -----
2   マウス  電子機器  3000   80
```

---

## よくある間違い

### 1. WHERE句を忘れる

```sql
-- 全社員の部署が「人事部」になってしまう！
UPDATE employees SET department = '人事部';
```

### 2. WHERE条件の間違い

```sql
-- nameで検索したが同姓同名がいる可能性
UPDATE employees SET salary = 500000 WHERE name = '田中太郎';

-- idで検索するほうが安全
UPDATE employees SET salary = 500000 WHERE id = 1;
```

> **PRIMARY KEY（id）を使ったWHERE条件が最も安全**です。

### 3. SETとWHEREの混同

```sql
-- 正しい
UPDATE employees SET salary = 400000 WHERE id = 1;

-- 間違い（構文エラー）
UPDATE employees WHERE id = 1 SET salary = 400000;
```

`SET` は必ず `WHERE` の前に書きます。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```sql
-- 1. SQLiteを起動（まだの場合）
-- sqlite3 practice.db

-- 2. 表示設定
.mode column
.headers on

-- 3. 現在のデータを確認
SELECT * FROM employees;

-- 4. 鈴木一郎の給料を更新（安全手順）
SELECT * FROM employees WHERE id = 3;
UPDATE employees SET salary = 420000 WHERE id = 3;
SELECT * FROM employees WHERE id = 3;

-- 5. 中村美月の部署と給料を同時に更新
SELECT * FROM employees WHERE id = 7;
UPDATE employees SET department = '開発部', salary = 340000 WHERE id = 7;
SELECT * FROM employees WHERE id = 7;

-- 6. 商品の価格を更新
SELECT * FROM products WHERE id = 2;
UPDATE products SET price = 3000, stock = 80 WHERE id = 2;
SELECT * FROM products WHERE id = 2;

-- 7. 全データを確認
SELECT * FROM employees;
SELECT * FROM products;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| UPDATE文 | 既存データを更新（変更）するSQL文 |
| 基本構文 | `UPDATE テーブル SET カラム = 値 WHERE 条件` |
| 複数カラム | `SET カラム1 = 値1, カラム2 = 値2` |
| 計算式 | `SET salary = salary + 5000` のように計算も可能 |
| WHERE句 | 忘れると**全行が更新される**ので必須 |
| 安全手順 | まずSELECTで確認してからUPDATE |

### チェックリスト

- [ ] UPDATE文で1つのカラムを更新できた
- [ ] UPDATE文で複数のカラムを同時に更新できた
- [ ] SELECTで更新前後を確認する習慣が身についた
- [ ] WHERE句の重要性を理解した

---

## 次のステップへ

UPDATE文でデータを更新できるようになりましたね。

次のセクションでは、DELETE文を使ってデータを削除する方法を学びます。
UPDATE以上に慎重さが求められる操作です。心の準備はいいですか？

---

*推定読了時間: 30分*
