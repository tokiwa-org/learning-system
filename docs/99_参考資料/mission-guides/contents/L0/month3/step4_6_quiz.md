# チェックポイント：データ操作をマスターしよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 4
subStep: 6
title: "チェックポイント：データ操作をマスターしよう"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L0"
```

---

## このチェックポイントについて

Step 4で学んだ内容を確認します。

- 全8問
- 合格ライン：6問以上正解（75%）

---

## 問題

### Q1: テーブルにデータを追加するSQL文の正しい構文は？

A) `ADD INTO employees VALUES (1, '田中太郎', '開発部', 350000);`
B) `INSERT INTO employees VALUES (1, '田中太郎', '開発部', 350000);`
C) `INSERT employees VALUES (1, '田中太郎', '開発部', 350000);`
D) `CREATE INTO employees VALUES (1, '田中太郎', '開発部', 350000);`

<details>
<summary>答えを見る</summary>

**正解: B) `INSERT INTO employees VALUES (1, '田中太郎', '開発部', 350000);`**

INSERT文は `INSERT INTO テーブル名 VALUES (値1, 値2, ...)` の構文で記述します。
`INTO` を忘れないようにしましょう。

</details>

---

### Q2: UPDATE文でWHERE句を省略するとどうなるか？

A) エラーが発生する
B) 最初の1行だけが更新される
C) テーブルの全行が更新される
D) 何も起こらない

<details>
<summary>答えを見る</summary>

**正解: C) テーブルの全行が更新される**

WHERE句を省略すると、テーブルのすべての行が対象になります。
例えば `UPDATE employees SET salary = 300000;` と書くと、全社員の給料が300000に変わってしまいます。
UPDATE文では必ずWHERE句を確認してから実行しましょう。

</details>

---

### Q3: テーブルからデータを削除するSQL文の正しい構文は？

A) `REMOVE FROM employees WHERE id = 1;`
B) `DROP FROM employees WHERE id = 1;`
C) `DELETE employees WHERE id = 1;`
D) `DELETE FROM employees WHERE id = 1;`

<details>
<summary>答えを見る</summary>

**正解: D) `DELETE FROM employees WHERE id = 1;`**

DELETE文は `DELETE FROM テーブル名 WHERE 条件` の構文で記述します。
`FROM` を忘れないようにしましょう。また、`DROP` はテーブル自体を削除するコマンドで、行の削除には使いません。

</details>

---

### Q4: PRIMARY KEY制約の説明として正しいものは？

A) NULLを許可しないという意味
B) デフォルト値を設定するという意味
C) 行を一意に識別するための制約で、重複する値は許可されない
D) 文字列の最大長を制限するという意味

<details>
<summary>答えを見る</summary>

**正解: C) 行を一意に識別するための制約で、重複する値は許可されない**

PRIMARY KEY（主キー）は、テーブル内の各行を一意に識別するための制約です。
同じ値を持つ行を追加しようとすると `UNIQUE constraint failed` エラーが発生します。

</details>

---

### Q5: NOT NULL制約の意味として正しいものは？

A) 値が0であってはならない
B) 値が空文字であってはならない
C) 値がNULL（空）であってはならない。必ず値を指定する必要がある
D) 値が負の数であってはならない

<details>
<summary>答えを見る</summary>

**正解: C) 値がNULL（空）であってはならない。必ず値を指定する必要がある**

NOT NULL制約は、そのカラムにNULL（値なし）を入れることを禁止します。
INSERT時にそのカラムの値を省略したり、明示的にNULLを指定するとエラーになります。
なお、空文字（`''`）はNULLとは異なり、NOT NULL制約には違反しません。

</details>

---

### Q6: 新しいテーブルを作成するSQL文の正しい構文は？

A) `NEW TABLE students (id INTEGER, name TEXT);`
B) `MAKE TABLE students (id INTEGER, name TEXT);`
C) `CREATE TABLE students (id INTEGER, name TEXT);`
D) `ADD TABLE students (id INTEGER, name TEXT);`

<details>
<summary>答えを見る</summary>

**正解: C) `CREATE TABLE students (id INTEGER, name TEXT);`**

CREATE TABLE文は `CREATE TABLE テーブル名 (カラム定義)` の構文で記述します。
カッコ内にカラム名、データ型、制約を定義します。

</details>

---

### Q7: DEFAULTキーワードの役割は？

A) カラムの値を変更できなくする
B) INSERT時に値が指定されなかった場合に自動で設定される値を定義する
C) カラムの値を暗号化する
D) カラムに一意制約を設定する

<details>
<summary>答えを見る</summary>

**正解: B) INSERT時に値が指定されなかった場合に自動で設定される値を定義する**

`DEFAULT` を使うと、INSERT時にそのカラムの値を省略した場合のデフォルト値を設定できます。
例えば `quantity INTEGER DEFAULT 1` と定義すると、quantityを指定せずにINSERTした場合、自動的に1が入ります。

</details>

---

### Q8: データ型INTEGERとTEXTの違いとして正しいものは？

A) INTEGERは整数を格納し、TEXTは文字列を格納する
B) INTEGERは小数を格納し、TEXTは整数を格納する
C) INTEGERは英字を格納し、TEXTは日本語を格納する
D) INTEGERとTEXTは同じもので違いはない

<details>
<summary>答えを見る</summary>

**正解: A) INTEGERは整数を格納し、TEXTは文字列を格納する**

INTEGERは整数（1, 42, -10, 300000 など）を格納するデータ型です。
TEXTは文字列（'田中太郎', '開発部', '2026-01-15' など）を格納するデータ型です。
数値計算にはINTEGER、名前や日付などの文字データにはTEXTを使います。

</details>

---

## 採点

### 選択問題（8問）

| 正解数 | 判定 |
|--------|------|
| 8問 | 完璧！ |
| 6-7問 | 合格 |
| 4-5問 | もう少し |
| 3問以下 | 復習が必要 |

---

## Step 4 完了！

おめでとうございます！
データの追加・更新・削除のスキルを習得しました。

### 習得したスキル

- [x] INSERT文でデータを追加できる
- [x] UPDATE文でデータを更新できる（WHERE句の重要性を理解）
- [x] DELETE文でデータを削除できる（安全手順を理解）
- [x] CREATE TABLEで新しいテーブルを作成できる
- [x] データ型と制約（PRIMARY KEY, NOT NULL, DEFAULT）を理解している
- [x] CRUD操作の基本を習得した

---

## 次のステップへ

Step 5では、SQLの便利な機能をさらに学びます。

- 集計関数（COUNT, SUM, AVG）
- GROUP BY でデータをグループ化
- JOINで複数テーブルを結合

データベースの真価を発揮する応用テクニックに進みましょう！

---

*推定所要時間: 30分*
