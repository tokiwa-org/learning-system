# SQL基礎 卒業クイズ

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 6
subStep: 2
title: "SQL基礎 卒業クイズ"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L0"
```

---

## このクイズについて

SQL基礎の総まとめクイズです。
Step 1〜5で学んだすべての内容から出題されます。

- 全15問
- 合格ライン：12問以上正解（80%）

---

## セクション1: 基本概念（3問）

### Q1: データベースとは何か、最も適切な説明は？

A) プログラミング言語の一種
B) データを整理して保存・検索できる仕組み
C) Webサイトを作るためのツール
D) ファイルを圧縮するソフトウェア

<details>
<summary>答えを見る</summary>

**正解: B) データを整理して保存・検索できる仕組み**

データベースは大量のデータを効率的に保存・管理し、必要なときにすばやく検索・取得するための仕組みです。

</details>

---

### Q2: リレーショナルデータベースの構成要素として正しい組み合わせは？

A) ファイル、フォルダ、パス
B) テーブル、行（レコード）、列（カラム）
C) ページ、セクション、パラグラフ
D) ノード、エッジ、プロパティ

<details>
<summary>答えを見る</summary>

**正解: B) テーブル、行（レコード）、列（カラム）**

リレーショナルデータベースでは、データをテーブル（表）として管理します。
- テーブル: データのまとまり（例: 顧客テーブル）
- 行（レコード）: 1件分のデータ（例: 1人の顧客情報）
- 列（カラム）: データの項目（例: 名前、年齢）

</details>

---

### Q3: SQLとは何の略か？

A) System Query Language
B) Structured Query Language
C) Simple Question Language
D) Standard Query Logic

<details>
<summary>答えを見る</summary>

**正解: B) Structured Query Language**

SQL（Structured Query Language）は、データベースを操作するための問い合わせ言語です。データの検索、追加、更新、削除などを行うことができます。

</details>

---

## セクション2: SELECT文（4問）

### Q4: `SELECT * FROM customers;` の `*` はどういう意味か？

A) 重要なデータだけ取得する
B) すべての列を取得する
C) 最初の1件だけ取得する
D) データを削除する

<details>
<summary>答えを見る</summary>

**正解: B) すべての列を取得する**

`*`（アスタリスク）は「すべての列」を意味します。`SELECT * FROM customers` は、customersテーブルのすべての列を取得します。

</details>

---

### Q5: 商品テーブルから商品名と価格だけを取得するSQLとして正しいものは？

A) `SELECT items FROM name, price;`
B) `SELECT name, price FROM items;`
C) `GET name, price FROM items;`
D) `SELECT name AND price FROM items;`

<details>
<summary>答えを見る</summary>

**正解: B) `SELECT name, price FROM items;`**

特定の列だけ取得するには、`SELECT` の後に列名をカンマ区切りで指定します。`FROM` の後にテーブル名を書きます。

</details>

---

### Q6: `SELECT DISTINCT city FROM customers;` のDISTINCTの役割は？

A) データを昇順に並べる
B) 重複する値を除去して表示する
C) NULLの行を除外する
D) 最初の1件だけ表示する

<details>
<summary>答えを見る</summary>

**正解: B) 重複する値を除去して表示する**

`DISTINCT` を使うと、同じ値が複数あっても1つだけ表示されます。例えば、東京に住む顧客が3人いても「東京」は1回だけ表示されます。

</details>

---

### Q7: `SELECT name AS '商品名' FROM items;` のAS句の用途は？

A) データをフィルタリングする
B) 列に別名（エイリアス）をつけて表示する
C) テーブルの名前を変更する
D) データを並び替える

<details>
<summary>答えを見る</summary>

**正解: B) 列に別名（エイリアス）をつけて表示する**

`AS` 句を使うと、結果表示時の列名を変更できます。元のテーブルのデータは変わりません。見やすい表示名をつけるのに便利です。

</details>

---

## セクション3: WHERE句（3問）

### Q8: 30歳以上の顧客を検索するSQLとして正しいものは？

A) `SELECT * FROM customers IF age >= 30;`
B) `SELECT * FROM customers WHERE age >= 30;`
C) `SELECT * WHERE age >= 30 FROM customers;`
D) `SELECT * FROM customers WHEN age >= 30;`

<details>
<summary>答えを見る</summary>

**正解: B) `SELECT * FROM customers WHERE age >= 30;`**

条件を指定するには `WHERE` 句を使い、`FROM` の後に配置します。`IF` や `WHEN` はSQLの `SELECT` 文では使いません。

</details>

---

### Q9: `SELECT * FROM customers WHERE name LIKE '%山%';` はどのような検索をするか？

A) 名前が「山」で始まる顧客を検索する
B) 名前が「山」で終わる顧客を検索する
C) 名前に「山」を含む顧客を検索する
D) 名前が「山」と完全一致する顧客を検索する

<details>
<summary>答えを見る</summary>

**正解: C) 名前に「山」を含む顧客を検索する**

`%` は「0文字以上の任意の文字列」を表すワイルドカードです。
- `'%山%'`: 「山」を含む（前後に何があってもOK）
- `'山%'`: 「山」で始まる
- `'%山'`: 「山」で終わる

</details>

---

### Q10: `WHERE price BETWEEN 1000 AND 5000` が検索する範囲は？

A) 1000より大きく5000より小さい（1000と5000を含まない）
B) 1000以上5000以下（1000と5000を含む）
C) 1000以上5000未満（1000を含み5000を含まない）
D) 1001以上4999以下

<details>
<summary>答えを見る</summary>

**正解: B) 1000以上5000以下（1000と5000を含む）**

`BETWEEN A AND B` は A 以上 B 以下の範囲を指定します。境界値（AとB自体）も含まれます。`WHERE price >= 1000 AND price <= 5000` と同じ意味です。

</details>

---

## セクション4: データ操作（3問）

### Q11: 新しい顧客を追加するSQLとして正しいものは？

A) `ADD INTO customers VALUES (1, '山田太郎');`
B) `INSERT INTO customers (id, name) VALUES (1, '山田太郎');`
C) `CREATE customers SET id = 1, name = '山田太郎';`
D) `PUT INTO customers (id, name) VALUES (1, '山田太郎');`

<details>
<summary>答えを見る</summary>

**正解: B) `INSERT INTO customers (id, name) VALUES (1, '山田太郎');`**

データを追加するには `INSERT INTO テーブル名 (列名...) VALUES (値...)` を使います。列名と値の数・順番は一致させる必要があります。

</details>

---

### Q12: UPDATE文でWHERE句を省略するとどうなるか？

A) エラーが発生する
B) テーブルのすべての行が更新される
C) 最初の1行だけ更新される
D) 何も起きない

<details>
<summary>答えを見る</summary>

**正解: B) テーブルのすべての行が更新される**

`WHERE` 句を省略すると、テーブル内のすべてのレコードが対象になります。これは非常に危険です。`UPDATE` や `DELETE` を実行するときは、**必ず `WHERE` 句で対象を限定する**習慣をつけましょう。

</details>

---

### Q13: DELETEとDROP TABLEの違いとして正しいものは？

A) 違いはない、同じ動作をする
B) DELETEは行を削除し、DROP TABLEはテーブルごと削除する
C) DELETEはテーブルを削除し、DROP TABLEは行を削除する
D) DELETEは一時的な削除で、DROP TABLEは永久的な削除

<details>
<summary>答えを見る</summary>

**正解: B) DELETEは行を削除し、DROP TABLEはテーブルごと削除する**

- `DELETE FROM テーブル名 WHERE 条件`: テーブル内の特定の行を削除（テーブル自体は残る）
- `DROP TABLE テーブル名`: テーブルそのものを削除（構造もデータもすべて消える）

</details>

---

## セクション5: 並び替え・集計（2問）

### Q14: `SELECT * FROM employees ORDER BY salary DESC;` の結果は？

A) 給与の低い順に表示される
B) 給与の高い順に表示される
C) 社員名のアルファベット順に表示される
D) エラーになる

<details>
<summary>答えを見る</summary>

**正解: B) 給与の高い順に表示される**

`ORDER BY 列名 DESC` は降順（大きい値から小さい値）に並び替えます。
- `ASC`（昇順）: 小さい → 大きい（デフォルト）
- `DESC`（降順）: 大きい → 小さい

</details>

---

### Q15: GROUP BYとHAVINGの関係として正しいものは？

A) HAVINGはGROUP BYなしでも使える
B) HAVINGはGROUP BYで集計した結果に条件をつける
C) GROUP BYとHAVINGは同じ意味である
D) HAVINGはWHEREの別名である

<details>
<summary>答えを見る</summary>

**正解: B) HAVINGはGROUP BYで集計した結果に条件をつける**

- `WHERE`: グループ化する**前**の行に対して条件を指定
- `HAVING`: グループ化した**後**の集計結果に対して条件を指定

例: `SELECT category, COUNT(*) FROM items GROUP BY category HAVING COUNT(*) >= 3`
→ 商品数が3個以上のカテゴリだけ表示

</details>

---

## 採点

### 正解数を数えてください

| 正解数 | 判定 |
|--------|------|
| 15問 | 完璧！SQL マスター！ |
| 12-14問 | 合格！SQL 基礎修了 |
| 9-11問 | もう少し復習を |
| 8問以下 | Step 1-5 を復習しましょう |

---

## 復習ガイド

間違えた問題の分野を確認：

| 問題 | 分野 | 復習セクション |
|------|------|---------------|
| Q1-Q3 | 基本概念 | Step 1 |
| Q4-Q7 | SELECT文 | Step 2 |
| Q8-Q10 | WHERE句 | Step 3 |
| Q11-Q13 | データ操作 | Step 4 |
| Q14-Q15 | 並び替え・集計 | Step 5 |

---

## SQL基礎 修了おめでとうございます！

### 習得したスキル

Step 1〜6を通じて、以下のスキルを習得しました：

#### 基本概念
- [x] データベース、テーブル、SQLの理解
- [x] リレーショナルデータベースの構造（テーブル、行、列）

#### SELECT文
- [x] `SELECT *` で全データ取得
- [x] `SELECT 列名` で列の選択
- [x] `DISTINCT` で重複排除
- [x] `AS` で列名の別名設定

#### WHERE句
- [x] `WHERE` で条件指定
- [x] `BETWEEN` で範囲検索
- [x] `IN` で複数値検索
- [x] `LIKE` で部分一致検索

#### データ操作
- [x] `INSERT INTO` でデータ追加
- [x] `UPDATE` でデータ更新
- [x] `DELETE` でデータ削除

#### 並び替え・集計
- [x] `ORDER BY` で並び替え（ASC / DESC）
- [x] `LIMIT` で件数制限
- [x] `GROUP BY` でグループ集計
- [x] 集計関数（`COUNT`, `AVG`, `MAX`, `MIN`）

---

## 次のステップ

SQL基礎を修了した今、次に学ぶべきことは：

### 月4以降のカリキュラム
- ネットワークの仕組み
- HTML/CSSの基礎

### SQLの発展
- JOIN（テーブルの結合）
- サブクエリ（入れ子のSQL）
- INDEX（検索の高速化）
- トランザクション（データの整合性）

---

## 修了証

```
+============================================================+
|                                                            |
|            SQL基礎 修了証明書                              |
|                                                            |
|     修了者: ＿＿＿＿＿＿＿＿＿＿＿＿                          |
|                                                            |
|     修了日: ＿＿＿＿年＿＿月＿＿日                           |
|                                                            |
|     本証明書は、L0レベルのSQL基礎カリキュラムを             |
|     修了したことを証明します。                              |
|                                                            |
|     習得スキル:                                             |
|     ・SELECT/WHERE（データ検索・条件指定）                  |
|     ・INSERT/UPDATE/DELETE（データ操作）                    |
|     ・ORDER BY/LIMIT/GROUP BY（並替・集計）                 |
|     ・集計関数（COUNT, AVG, MAX, MIN）                      |
|                                                            |
+============================================================+
```

---

*SQL基礎カリキュラム 全20時間 完了*

**お疲れさまでした！**
