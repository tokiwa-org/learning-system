# テーブルの仕組みを理解しよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 1
subStep: 4
title: "テーブルの仕組みを理解しよう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「データベースの中はExcelの表みたいになってるんだよ」
>
> 「表...ですか？」
>
> 「そう。列（カラム）にデータの種類を決めて、行（ロウ）に1件ずつデータを入れていくんだ。実際にテーブルを作ってみよう」

---

## このセクションで学ぶこと

テーブルの構造、データ型、PRIMARY KEY、NULLなどの概念を学び、実際にテーブルを作成してデータを投入します。

---

## テーブルの構造

テーブルは「カラム（列）」と「ロウ（行）」で構成されます。

```
テーブル名: employees
┌────────────────┬──────────────┬──────────────┬──────────────┐
│ id (INTEGER)   │ name (TEXT)  │ department   │ salary       │
│                │              │ (TEXT)       │ (INTEGER)    │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ 1              │ 田中太郎     │ 開発部       │ 350000       │ ← ロウ（1件目）
│ 2              │ 佐藤花子     │ 営業部       │ 320000       │ ← ロウ（2件目）
│ 3              │ 鈴木一郎     │ 開発部       │ 400000       │ ← ロウ（3件目）
└────────────────┴──────────────┴──────────────┴──────────────┘
  ↑ カラム1        ↑ カラム2      ↑ カラム3      ↑ カラム4
```

### ポイント

- **カラム（列）**: データの「種類」を定義する（名前、部署、給料など）
- **ロウ（行）**: 1件分の「データ」（田中太郎の情報、佐藤花子の情報など）
- テーブルを作るとき、最初にカラムを定義する
- データを追加するとき、ロウが1行ずつ増えていく

---

## データ型

カラムには「どんな種類のデータを入れるか」を指定します。
これを**データ型**と呼びます。

### SQLiteの主なデータ型

| データ型 | 説明 | 例 |
|----------|------|-----|
| **INTEGER** | 整数 | 1, 42, -100, 350000 |
| **TEXT** | 文字列 | '田中太郎', '開発部', 'hello' |
| **REAL** | 小数（浮動小数点） | 3.14, 98.5, 0.01 |
| **BLOB** | バイナリデータ | 画像、ファイルなど |
| **NULL** | 値がないことを表す | NULL |

### よく使うのはこの3つ

```
INTEGER  → 数値（年齢、金額、個数など）
TEXT     → 文字列（名前、メール、住所など）
REAL     → 小数（割合、評価点など）
```

> 最初はINTEGER、TEXT、REALの3つだけ覚えれば十分です。

### 文字列の書き方

SQLでは文字列をシングルクォートで囲みます。

```sql
'田中太郎'     -- 正しい
'開発部'       -- 正しい
"田中太郎"     -- SQLiteでは動くが、標準SQLではカラム名と混同する
```

> 文字列は必ずシングルクォート `'` で囲む、と覚えましょう。

---

## PRIMARY KEY（主キー）

### 一言で言うと

**テーブル内の各ロウを一意に識別するためのカラム**

### なぜ必要？

「田中太郎」が2人いたら、どちらのデータか分からなくなります。
PRIMARY KEYがあれば、IDで確実に区別できます。

```
┌────┬──────────┐
│ id │ name     │
├────┼──────────┤
│  1 │ 田中太郎 │ ← id=1の田中太郎
│  5 │ 田中太郎 │ ← id=5の田中太郎（別人）
└────┴──────────┘
```

### PRIMARY KEYのルール

| ルール | 説明 |
|--------|------|
| **一意** | 同じ値が2つ以上存在できない |
| **NOT NULL** | 空（NULL）にできない |
| **1テーブルに1つ** | PRIMARY KEYは1つだけ設定する |

### よくあるパターン

```sql
id INTEGER PRIMARY KEY
```

- `id` というカラム名が最もよく使われる
- `INTEGER PRIMARY KEY` にすると、自動で連番が振られる（SQLite）

---

## NULL（ヌル）

### 一言で言うと

**「値がない」「未入力」を表す特別な値**

### NULLの例

```
┌────┬──────────┬────────┐
│ id │ name     │ phone  │
├────┼──────────┼────────┤
│  1 │ 田中太郎 │ 090... │ ← 電話番号あり
│  2 │ 佐藤花子 │ NULL   │ ← 電話番号が未登録
└────┴──────────┴────────┘
```

### NULLの注意点

- NULLは「0」や「空文字」とは違う
- NULLは「値が存在しない」という意味
- 必須項目には `NOT NULL` を指定して、NULLを禁止できる

```sql
name TEXT NOT NULL    -- nameは必ず値が必要
phone TEXT            -- phoneはNULLでもOK
```

---

## NOT NULL制約

### 一言で言うと

**「このカラムは必ず値を入れてね」というルール**

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,       -- 名前は必須
    email TEXT NOT NULL,      -- メールも必須
    phone TEXT                -- 電話番号は任意（NULLでもOK）
);
```

> 「必須項目」には `NOT NULL` をつける、と覚えましょう。

---

## ハンズオン: テーブルを作成しよう

実際にテーブルを作成してデータを入れてみましょう。

### 1. SQLiteを起動

```bash
cd ~/db-practice
sqlite3 practice.db
```

### 2. 表示設定

```
sqlite> .headers on
sqlite> .mode column
```

### 3. テーブルを作成

```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT,
    salary INTEGER
);
```

> 何もエラーが表示されなければ成功です。

### 4. テーブルができたか確認

```
sqlite> .tables
```

出力：
```
employees
```

### 5. テーブルの構造を確認

```
sqlite> .schema employees
```

出力：
```
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT,
    salary INTEGER
);
```

---

## ハンズオン: データを追加しよう

### INSERT文でデータを追加

```sql
INSERT INTO employees VALUES (1, '田中太郎', '開発部', 350000);
INSERT INTO employees VALUES (2, '佐藤花子', '営業部', 320000);
INSERT INTO employees VALUES (3, '鈴木一郎', '開発部', 400000);
INSERT INTO employees VALUES (4, '高橋美咲', '人事部', 300000);
INSERT INTO employees VALUES (5, '伊藤健太', '営業部', 280000);
```

> 各行の最後にセミコロン `;` を忘れずに。

### データが入ったか確認

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

> 5件のデータが表示されれば成功です！

---

## INSERT文の書き方

### 基本構文

```sql
INSERT INTO テーブル名 VALUES (値1, 値2, 値3, ...);
```

### カラムを指定する書き方（推奨）

```sql
INSERT INTO テーブル名 (カラム1, カラム2) VALUES (値1, 値2);
```

例：
```sql
INSERT INTO employees (id, name, department, salary) VALUES (6, '山田次郎', '開発部', 330000);
```

> カラムを指定する書き方のほうが安全で分かりやすいです。

### NULLを入れる場合

```sql
INSERT INTO employees (id, name, department, salary) VALUES (7, '中村三郎', NULL, 310000);
```

> departmentがNULLになります（部署未定の社員）。

---

## CREATE TABLE文の書き方

### 基本構文

```sql
CREATE TABLE テーブル名 (
    カラム名1 データ型 制約,
    カラム名2 データ型 制約,
    ...
);
```

### 構文の解説

```sql
CREATE TABLE employees (        -- 「employees」テーブルを作成
    id INTEGER PRIMARY KEY,     -- id: 整数、主キー
    name TEXT NOT NULL,          -- name: 文字列、必須
    department TEXT,             -- department: 文字列、任意
    salary INTEGER               -- salary: 整数、任意
);
```

---

## よくあるトラブル

### 「table employees already exists」と表示される

同じ名前のテーブルが既に存在しています。削除してから再作成しましょう：

```sql
DROP TABLE employees;
```

その後、CREATE TABLE文をもう一度実行してください。

### セミコロンを忘れた

```
sqlite> SELECT * FROM employees
   ...>
```

`...>` と表示された場合、セミコロンを忘れています。`;` を入力してEnterを押しましょう：

```
   ...> ;
```

### 文字化けする

SQLiteのターミナルがUTF-8に対応しているか確認してください。
多くの場合、ターミナルの文字コード設定をUTF-8にすると解決します。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| テーブル構造 | カラム（列）とロウ（行）で構成 |
| データ型 | INTEGER、TEXT、REAL が基本の3つ |
| PRIMARY KEY | ロウを一意に識別するカラム |
| NULL | 「値がない」を表す特別な値 |
| NOT NULL | 必須項目に指定する制約 |

### チェックリスト

- [ ] テーブルの構造（カラムとロウ）が説明できる
- [ ] データ型（INTEGER、TEXT、REAL）の違いが分かる
- [ ] PRIMARY KEYの役割が分かる
- [ ] CREATE TABLEでテーブルを作成できる
- [ ] INSERT INTOでデータを追加できる

---

## 次のステップへ

テーブルの作成とデータの追加はできましたか？

次のセクションでは、SQLの基本用語をまとめて学びます。
SELECT、INSERT、UPDATE、DELETEの全体像を整理しましょう。

---

*推定読了時間: 25分*
