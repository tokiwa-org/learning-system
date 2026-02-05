# SQLの基本用語を覚えよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 1
subStep: 5
title: "SQLの基本用語を覚えよう"
itemType: LESSON
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「SQL用語をまとめておくね。すぐに全部覚えなくても大丈夫」
>
> 「SELECT、INSERT、UPDATE、DELETE...たくさんありますね」
>
> 「この4つがCRUDと呼ばれる基本操作だよ。これだけで日常業務の大半はカバーできる」

---

## このセクションで学ぶこと

SQLの基本用語と、CRUD操作の全体像を整理します。
ここではSQLの「地図」を頭に入れることが目標です。

---

## SQL（Structured Query Language）とは

### 一言で言うと

**リレーショナルデータベースを操作するための言語**

### 特徴

| 特徴 | 説明 |
|------|------|
| **標準化** | ISO/ANSIで標準化されている |
| **共通** | MySQL、PostgreSQL、SQLiteでほぼ同じ構文 |
| **宣言型** | 「何がほしいか」を書く（「どうやって取るか」は書かない） |
| **歴史** | 1970年代にIBMで開発。50年以上の歴史がある |

### 例

```sql
-- 「開発部の社員を給料順に並べて」
SELECT name, salary FROM employees WHERE department = '開発部' ORDER BY salary DESC;
```

> 英語の文章のように読めるのがSQLの特徴です。

---

## CRUD操作

データベース操作の基本は4つ。頭文字を取って**CRUD（クラッド）**と呼びます。

### 4つの操作

| 操作 | 英語 | SQLキーワード | 説明 |
|------|------|-------------|------|
| **C** | Create | `INSERT` | データを追加する |
| **R** | Read | `SELECT` | データを取得する |
| **U** | Update | `UPDATE` | データを更新する |
| **D** | Delete | `DELETE` | データを削除する |

### 具体例

```sql
-- Create: データを追加
INSERT INTO employees (id, name, department, salary)
VALUES (6, '山田次郎', '開発部', 330000);

-- Read: データを取得
SELECT * FROM employees;

-- Update: データを更新
UPDATE employees SET salary = 360000 WHERE id = 1;

-- Delete: データを削除
DELETE FROM employees WHERE id = 6;
```

> **最も使う頻度が高いのは SELECT（Read）です。**
> 実務では「データを見る」ことが圧倒的に多いです。

---

## DDLとDML

SQLの命令は大きく2つに分類できます。

### DDL（Data Definition Language）: テーブルの構造を操作

| コマンド | 説明 | 例 |
|----------|------|-----|
| `CREATE TABLE` | テーブルを作成 | `CREATE TABLE users (...)` |
| `DROP TABLE` | テーブルを削除 | `DROP TABLE users` |
| `ALTER TABLE` | テーブルを変更 | `ALTER TABLE users ADD COLUMN age INTEGER` |

> DDL = テーブルの「箱」そのものを作ったり壊したりする

### DML（Data Manipulation Language）: データを操作

| コマンド | 説明 | 例 |
|----------|------|-----|
| `SELECT` | データを取得 | `SELECT * FROM users` |
| `INSERT` | データを追加 | `INSERT INTO users VALUES (...)` |
| `UPDATE` | データを更新 | `UPDATE users SET name = '...' WHERE id = 1` |
| `DELETE` | データを削除 | `DELETE FROM users WHERE id = 1` |

> DML = テーブルの中の「データ」を出し入れする

### 簡単に覚えるなら

```
DDL → テーブルの操作（箱を作る・壊す）
DML → データの操作（中身を出し入れする）
```

> 初学者が主に使うのはDMLです。DDLはテーブル作成時だけ。

---

## SQLのキーワード一覧

### 最初に覚えるべきキーワード

| キーワード | 分類 | 説明 | 使用例 |
|-----------|------|------|--------|
| `SELECT` | DML | データを取得 | `SELECT name FROM users` |
| `FROM` | 句 | 対象テーブルを指定 | `SELECT * FROM users` |
| `WHERE` | 句 | 条件を指定 | `WHERE age > 20` |
| `INSERT INTO` | DML | データを追加 | `INSERT INTO users VALUES (...)` |
| `UPDATE` | DML | データを更新 | `UPDATE users SET name = '...'` |
| `SET` | 句 | 更新する値を指定 | `SET salary = 400000` |
| `DELETE FROM` | DML | データを削除 | `DELETE FROM users WHERE id = 1` |
| `CREATE TABLE` | DDL | テーブルを作成 | `CREATE TABLE users (...)` |
| `ORDER BY` | 句 | 並び順を指定 | `ORDER BY salary DESC` |
| `GROUP BY` | 句 | グループ化 | `GROUP BY department` |

### 覚え方のコツ

```
SELECT ... FROM ... WHERE ... ORDER BY ...

「何を」「どこから」「どんな条件で」「どんな順番で」
```

> 英語の語順に近いので、意味を考えながら書くと覚えやすいです。

---

## SQLの書き方ルール

### ルール1: 大文字と小文字は区別しない

```sql
SELECT * FROM employees;
select * from employees;
Select * From Employees;
```

> 3つとも同じ結果になります。
> ただし、慣習として**キーワードは大文字**で書くことが多いです。

### ルール2: 文の終わりはセミコロン（;）

```sql
SELECT * FROM employees;
                       ^
                       これが必要！
```

> セミコロンを忘れると、SQLiteは「まだ文が続く」と判断し、次の入力を待ちます。

### ルール3: 文字列はシングルクォートで囲む

```sql
WHERE name = '田中太郎'    -- 正しい
WHERE name = "田中太郎"    -- SQLiteでは動くが非推奨
```

### ルール4: コメントは -- で書く

```sql
-- これはコメントです（実行されない）
SELECT * FROM employees;  -- この行のここから先もコメント
```

---

## SQL文の全体像

```
┌─────────────────────────────────────────────────────┐
│  SQL                                                │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  DDL（テーブル操作）                            │  │
│  │  CREATE TABLE / DROP TABLE / ALTER TABLE       │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  DML（データ操作）= CRUD                       │  │
│  │                                               │  │
│  │  SELECT   → データを取得（Read）               │  │
│  │  INSERT   → データを追加（Create）             │  │
│  │  UPDATE   → データを更新（Update）             │  │
│  │  DELETE   → データを削除（Delete）             │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## まとめ

| 用語 | 意味 |
|------|------|
| **SQL** | データベースを操作する言語 |
| **CRUD** | Create, Read, Update, Deleteの4操作 |
| **DDL** | テーブルの構造を操作（CREATE TABLE等） |
| **DML** | テーブルのデータを操作（SELECT, INSERT等） |

### 今日覚えるべきこと

1. **CRUD** = データベース操作の基本4つ（INSERT, SELECT, UPDATE, DELETE）
2. **SELECT** が最も使用頻度が高い
3. **セミコロン** を文の最後につける
4. **大文字/小文字** は区別しない（キーワードは大文字が慣習）

### チェックリスト

- [ ] SQLとは何か説明できる
- [ ] CRUDの4つの操作を言える
- [ ] DDLとDMLの違いが分かる
- [ ] SQLの基本的な書き方ルールが分かる

---

## 次のステップへ

SQLの基本用語は理解できましたか？

次のセクションでは、理解度チェックのクイズに挑戦します。
Step 1で学んだ内容を振り返りましょう。

---

*推定読了時間: 15分*
