# INSERTでデータを追加しよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 4
subStep: 1
title: "INSERTでデータを追加しよう"
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

> 「新入社員が3人入ったんだけど、データベースに追加してもらえる？」
>
> 「追加ですか？SELECTでデータを取り出すのは分かりましたけど...」
>
> 「データを追加するには INSERT 文を使うんだ。やってみよう」
>
> 「INSERT...挿入するってことですね！」

---

## INSERT文とは

**INSERT文**は、テーブルにデータを追加するためのSQL文です。

SELECTがデータを「取り出す」操作なら、INSERTはデータを「入れる」操作です。

---

## 基本構文

### すべてのカラムに値を指定する場合

```sql
INSERT INTO テーブル名 VALUES (値1, 値2, 値3, ...);
```

| 要素 | 意味 |
|------|------|
| `INSERT INTO` | 「〜に追加する」という命令 |
| `テーブル名` | データを追加するテーブル |
| `VALUES` | 追加する値のリスト |
| `(値1, 値2, ...)` | カラムの順番に合わせた値 |

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

### 現在のデータを確認

まず、今のデータを見ておきましょう。

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

5人の社員がいますね。ここに新しい社員を追加します。

---

## VALUES形式で追加する

```sql
INSERT INTO employees VALUES (6, '山田次郎', '開発部', 290000);
```

確認してみましょう。

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
6   山田次郎  開発部      290000
```

山田次郎さんが追加されました！

---

## カラム名を指定して追加する（推奨）

カラム名を明示的に指定する書き方もあります。こちらのほうが**安全で読みやすい**です。

```sql
INSERT INTO employees (id, name, department, salary) VALUES (7, '中村美月', '営業部', 310000);
```

| メリット | 説明 |
|----------|------|
| 読みやすい | どのカラムに何を入れるか一目瞭然 |
| 安全 | カラムの順番を間違えにくい |
| 柔軟 | 一部のカラムだけ指定することもできる |

> **ベストプラクティス**: カラム名を指定する書き方を使いましょう。
> VALUES だけの書き方は、カラムの順番を覚えておく必要があり、間違いの原因になります。

---

## 複数行を一度に追加する

1行ずつ INSERT しなくても、複数行をまとめて追加できます。

```sql
INSERT INTO employees (id, name, department, salary) VALUES
    (8, '小林大輔', '人事部', 330000);
```

> SQLiteでは複数のVALUESを1つのINSERT文で記述できます。
> ```sql
> INSERT INTO テーブル名 (カラム1, カラム2) VALUES
>     (値1a, 値2a),
>     (値1b, 値2b),
>     (値1c, 値2c);
> ```

---

## PRIMARY KEYの重複エラー

employeesテーブルでは `id` が PRIMARY KEY です。
同じ `id` を持つデータを追加しようとするとエラーになります。

```sql
INSERT INTO employees (id, name, department, salary) VALUES (1, 'テスト太郎', '開発部', 250000);
```

エラー：
```
Error: UNIQUE constraint failed: employees.id
```

PRIMARY KEY は**テーブル内で一意（ユニーク）**でなければなりません。
既に `id = 1` の田中太郎さんが存在するため、同じ `id` では追加できません。

### 対処法

- 既存のデータと重複しない `id` を使う
- または、`id` が自動で割り振られる設計にする（AUTOINCREMENT）

---

## productsテーブルにも追加しよう

商品データにも新しい商品を追加してみましょう。

```sql
INSERT INTO products (id, name, category, price, stock) VALUES (9, 'ウェブカメラ', '電子機器', 5000, 25);
INSERT INTO products (id, name, category, price, stock) VALUES (10, 'デスクライト', '家具', 7000, 40);
```

確認：

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
9   ウェブカメラ    電子機器  5000   25
10  デスクライト    家具      7000   40
```

10件に増えました！

---

## INSERT文のルール

| ルール | 説明 |
|--------|------|
| 値の順番 | カラムの順番と一致させる |
| 文字列 | シングルクォート（`'`）で囲む |
| 数値 | そのまま書く（クォート不要） |
| PRIMARY KEY | 重複するとエラー |
| NOT NULL | NULL（空）を入れるとエラー |

---

## ハンズオン

以下のコマンドを順番に実行してください。

```sql
-- 1. SQLiteを起動（まだの場合）
-- sqlite3 practice.db

-- 2. 表示設定
.mode column
.headers on

-- 3. 現在の社員データを確認
SELECT * FROM employees;

-- 4. 新しい社員を3人追加
INSERT INTO employees (id, name, department, salary) VALUES (6, '山田次郎', '開発部', 290000);
INSERT INTO employees (id, name, department, salary) VALUES (7, '中村美月', '営業部', 310000);
INSERT INTO employees (id, name, department, salary) VALUES (8, '小林大輔', '人事部', 330000);

-- 5. 追加されたか確認
SELECT * FROM employees;

-- 6. 新しい商品を2つ追加
INSERT INTO products (id, name, category, price, stock) VALUES (9, 'ウェブカメラ', '電子機器', 5000, 25);
INSERT INTO products (id, name, category, price, stock) VALUES (10, 'デスクライト', '家具', 7000, 40);

-- 7. 追加されたか確認
SELECT * FROM products;

-- 8. PRIMARY KEY重複エラーを体験
INSERT INTO employees (id, name, department, salary) VALUES (1, 'テスト太郎', '開発部', 250000);
-- → エラーが出ることを確認
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| INSERT文 | テーブルにデータを追加するSQL文 |
| VALUES形式 | `INSERT INTO テーブル VALUES (値1, 値2, ...)` |
| カラム指定形式（推奨） | `INSERT INTO テーブル (カラム1, カラム2) VALUES (値1, 値2)` |
| PRIMARY KEY | 重複するとエラーになる |
| 文字列の囲み方 | シングルクォート（`'`）で囲む |

### チェックリスト

- [ ] INSERT文で社員を3人追加できた
- [ ] INSERT文で商品を2つ追加できた
- [ ] SELECTで追加結果を確認できた
- [ ] PRIMARY KEY重複エラーを体験した

---

## 次のステップへ

INSERT文でデータを追加できるようになりましたね。

次のセクションでは、UPDATE文を使ってデータを更新する方法を学びます。
「鈴木さんが昇給した」「中村さんの部署が変わった」そんなときに使いますよ！

---

*推定読了時間: 30分*
