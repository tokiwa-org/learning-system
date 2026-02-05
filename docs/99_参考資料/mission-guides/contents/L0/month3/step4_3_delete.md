# DELETEでデータを削除しよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 4
subStep: 3
title: "DELETEでデータを削除しよう"
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

> 「伊藤さんが退職したので、データを削除する必要があるんだ」
>
> 「削除ですか...ちょっと怖いですね」
>
> 「その感覚は正しいよ。DELETE は慎重に使うべきコマンドだ。でもルールを守れば大丈夫」
>
> 「INSERTで追加、UPDATEで更新、次はDELETEで削除ですね」
>
> 「そう。これでCRUD操作の基本が揃うんだ」

---

## DELETE文とは

**DELETE文**は、テーブルからデータを削除するためのSQL文です。

| 操作 | SQL文 |
|------|-------|
| 追加（Create） | INSERT |
| 読み取り（Read） | SELECT |
| 更新（Update） | UPDATE |
| 削除（Delete） | DELETE |

この4つを合わせて **CRUD（クラッド）** と呼びます。データ操作の基本です。

---

## 基本構文

```sql
DELETE FROM テーブル名 WHERE 条件;
```

| 要素 | 意味 |
|------|------|
| `DELETE FROM` | 「〜から削除する」という命令 |
| `テーブル名` | データを削除するテーブル |
| `WHERE 条件` | どの行を削除するかの条件 |

---

## WHERE句を忘れると全データが削除される！

> **DELETE文で最も重要な注意点です。UPDATE以上に危険です。**

```sql
-- 正しい（伊藤健太だけ削除）
DELETE FROM employees WHERE id = 5;

-- 全社員のデータが消える！！！
DELETE FROM employees;
```

WHERE句がないと、テーブルの**すべてのデータ**が削除されます。
テーブルの構造は残りますが、データは完全に失われます。

> **SQLにはUNDO（元に戻す）がありません。**
> 一度削除したデータは、バックアップがない限り元に戻せません。

---

## 安全な削除手順

DELETE を実行する前に、必ず以下の手順を踏みましょう。

### Step 1: SELECTで対象を確認する

```sql
SELECT * FROM employees WHERE id = 5;
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
5   伊藤健太  営業部      285000
```

削除対象が伊藤健太さんであることを確認。

### Step 2: 件数を確認する

```sql
SELECT COUNT(*) FROM employees WHERE id = 5;
```

出力：
```
COUNT(*)
--------
1
```

1件だけが対象であることを確認。

### Step 3: DELETEを実行する

```sql
DELETE FROM employees WHERE id = 5;
```

### Step 4: 結果を確認する

```sql
SELECT * FROM employees WHERE id = 5;
```

出力：
```
（何も表示されない = 削除成功）
```

```sql
SELECT * FROM employees;
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
1   田中太郎  開発部      350000
2   佐藤花子  営業部      325000
3   鈴木一郎  開発部      420000
4   高橋美咲  人事部      300000
6   山田次郎  開発部      290000
7   中村美月  開発部      340000
8   小林大輔  人事部      330000
```

伊藤健太さん（id=5）が削除され、7人になりました。

---

## 条件付きDELETE

WHERE句にはさまざまな条件を指定できます。

### 特定の条件に一致する行を削除

在庫が0の商品を削除するケースを試してみましょう。

まず、在庫0の商品を1つ作ります（練習用）。

```sql
-- 在庫0の商品を追加（練習用）
INSERT INTO products (id, name, category, price, stock) VALUES (11, 'テスト商品', '電子機器', 1000, 0);

-- 確認
SELECT * FROM products WHERE stock = 0;
```

出力：
```
id  name        category  price  stock
--  ----------  --------  -----  -----
11  テスト商品  電子機器  1000   0
```

在庫0の商品を削除します。

```sql
-- SELECTで確認
SELECT * FROM products WHERE stock = 0;

-- DELETEを実行
DELETE FROM products WHERE stock = 0;

-- 結果確認
SELECT * FROM products WHERE stock = 0;
```

出力：
```
（何も表示されない = 削除成功）
```

---

## 削除と注意事項

### SQLにはUNDOがない

| 操作 | 元に戻せるか |
|------|-------------|
| Excelで削除 | Ctrl+Zで元に戻せる |
| ファイルを削除 | ゴミ箱から復元できる |
| SQLでDELETE | **元に戻せない** |

だからこそ、以下が重要です：

- **バックアップを定期的に取る**
- **DELETE前に必ずSELECTで確認する**
- **本番環境では特に慎重に**

### バックアップの取り方（SQLiteの場合）

```bash
# データベースファイルをコピーするだけ
cp practice.db practice_backup.db
```

---

## DELETE vs DROP

混同しやすい2つのコマンドを整理します。

| コマンド | 効果 |
|----------|------|
| `DELETE FROM employees;` | テーブルの**データだけ**を全削除。テーブル構造は残る |
| `DROP TABLE employees;` | テーブルの**構造ごと**完全に削除。テーブル自体がなくなる |

```sql
-- DELETEの場合：テーブルは残る
DELETE FROM employees;
.tables  -- employees は表示される

-- DROPの場合：テーブルごと消える
DROP TABLE employees;
.tables  -- employees は表示されない
```

> 今はDELETEだけ覚えればOKです。DROPは次のセクションで学びます。

---

## よくある間違い

### 1. WHERE句を忘れる（最も危険）

```sql
-- 全データ消える！
DELETE FROM employees;
```

### 2. 条件を間違える

```sql
-- idを間違えて別の人を削除してしまう
DELETE FROM employees WHERE id = 3;  -- 鈴木一郎が消える！
```

> 必ずSELECTで確認してからDELETEしましょう。

### 3. FROM を忘れる

```sql
-- 正しい
DELETE FROM employees WHERE id = 5;

-- 間違い（構文エラー）
DELETE employees WHERE id = 5;
```

`DELETE` の後に `FROM` を忘れないようにしましょう。

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

-- 4. 安全な削除手順を実践
-- Step A: SELECTで対象を確認
SELECT * FROM employees WHERE id = 5;
-- Step B: 件数を確認
SELECT COUNT(*) FROM employees WHERE id = 5;
-- Step C: DELETEを実行
DELETE FROM employees WHERE id = 5;
-- Step D: 結果を確認
SELECT * FROM employees;

-- 5. 在庫0の商品を作って削除する
INSERT INTO products (id, name, category, price, stock) VALUES (11, 'テスト商品', '電子機器', 1000, 0);
SELECT * FROM products WHERE stock = 0;
DELETE FROM products WHERE stock = 0;
SELECT * FROM products WHERE stock = 0;

-- 6. 最終確認
SELECT * FROM employees;
SELECT * FROM products;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| DELETE文 | テーブルからデータを削除するSQL文 |
| 基本構文 | `DELETE FROM テーブル WHERE 条件` |
| WHERE句必須 | 忘れると**全データが削除される** |
| UNDOなし | 削除したデータは元に戻せない |
| 安全手順 | SELECT で確認 → DELETE で削除 → SELECT で結果確認 |
| CRUD | INSERT, SELECT, UPDATE, DELETE の4つでデータ操作の基本 |

### チェックリスト

- [ ] DELETE文で特定の行を削除できた
- [ ] SELECTで削除前の確認ができた
- [ ] 削除後にデータが消えていることを確認できた
- [ ] WHERE句の重要性を理解した
- [ ] CRUD操作の4つを言える

---

## 次のステップへ

DELETE文でデータを削除できるようになりましたね。
これでCRUD操作（INSERT, SELECT, UPDATE, DELETE）の基本が揃いました！

次のセクションでは、CREATE TABLEで自分だけのテーブルを作る方法を学びます。
今まではあらかじめ用意されたテーブルを使っていましたが、自分でテーブルを設計してみましょう。

---

*推定読了時間: 30分*
