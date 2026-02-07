# チェックポイント：サブクエリの謎を解き明かそう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 3
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 3で学んだサブクエリとウィンドウ関数の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. サブクエリの実行順序として正しいものはどれですか？

- A) メインクエリ → サブクエリの順で実行される
- B) サブクエリ → メインクエリの順で実行される
- C) 両方同時に実行される
- D) 実行順序はDBMSによって異なり、決まっていない

<details>
<summary>答えを見る</summary>

**正解: B**

サブクエリ（内側のクエリ）が先に実行され、その結果を使ってメインクエリ（外側のクエリ）が実行されます。ただし相関サブクエリの場合は、メインクエリの各行に対してサブクエリが繰り返し実行されます。

</details>

---

### Q2. スカラーサブクエリの説明として正しいものはどれですか？

- A) 複数行・複数列を返すサブクエリ
- B) 1つの値（単一行・単一列）を返すサブクエリ
- C) テーブル全体を返すサブクエリ
- D) NULLを返すサブクエリ

<details>
<summary>答えを見る</summary>

**正解: B**

スカラーサブクエリは1つの値を返します。SELECT句やWHERE句の比較演算子（=, >, <）と組み合わせて使えます。複数の値を返す場合はエラーになるため、IN や EXISTS を使います。

</details>

---

### Q3. 以下のSQLで FROM句のサブクエリに必要なものは？

```sql
SELECT * FROM (SELECT department_id, AVG(salary) FROM employees GROUP BY department_id) ???;
```

- A) WHERE句
- B) HAVING句
- C) エイリアス（AS 名前）
- D) ORDER BY句

<details>
<summary>答えを見る</summary>

**正解: C**

FROM句のサブクエリ（派生テーブル）には必ずエイリアスが必要です。例: `AS dept_stats`。エイリアスがないとSQL構文エラーになります。

</details>

---

### Q4. IN と EXISTS の違いとして正しいものはどれですか？

- A) IN は1つの値、EXISTS は複数の値を比較する
- B) IN はサブクエリを全件実行、EXISTS は1行見つかった時点で終了する
- C) IN は数値、EXISTS は文字列に使う
- D) IN と EXISTS は完全に同じ動作をする

<details>
<summary>答えを見る</summary>

**正解: B**

INはサブクエリの結果リストを全件取得してから比較します。EXISTSは条件に一致する行が1行見つかった時点で評価を終了するため、大量データでは効率的です。また NOT EXISTS は NULL に対して安全に動作します。

</details>

---

### Q5. 相関サブクエリの特徴として正しいものはどれですか？

- A) サブクエリが外側のクエリの値を参照する
- B) サブクエリが必ずNULLを返す
- C) FROM句でのみ使用できる
- D) 1回だけ実行される

<details>
<summary>答えを見る</summary>

**正解: A**

相関サブクエリは、外側のクエリの値（例: `e.department_id`）を内側のサブクエリが参照します。外側のクエリの各行に対してサブクエリが再実行されるため、行ごとに異なる結果が得られます。

</details>

---

### Q6. ウィンドウ関数とGROUP BYの最大の違いは？

- A) ウィンドウ関数のほうが速い
- B) GROUP BYは行をまとめるが、ウィンドウ関数は行を保持する
- C) GROUP BYは数値、ウィンドウ関数は文字列に使う
- D) ウィンドウ関数はSQLite では使えない

<details>
<summary>答えを見る</summary>

**正解: B**

GROUP BYは行をグループ化して結果の行数が減りますが、ウィンドウ関数は元の行をすべて保持したまま、各行に集計結果を付与します。

</details>

---

### Q7. 以下のSQLの `PARTITION BY` の役割は？

```sql
RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)
```

- A) 結果を department_id で分割してフィルタリングする
- B) department_id ごとにウィンドウ（グループ）を定義し、グループ内でランキングする
- C) department_id で並び替える
- D) department_id が NULL の行を除外する

<details>
<summary>答えを見る</summary>

**正解: B**

PARTITION BY は ウィンドウ（グループ）を定義します。この例では department_id ごとにグループを作り、各グループ内で salary DESC の順にランキングが計算されます。GROUP BY とは異なり、行はまとめられません。

</details>

---

### Q8. ROW_NUMBER(), RANK(), DENSE_RANK() の違いとして正しいものはどれですか？

同じ値が2つあった場合の挙動について。

- A) 3つとも同じ動作をする
- B) ROW_NUMBER は異なる番号、RANK は同順位で次が飛び番、DENSE_RANK は同順位で次が連番
- C) ROW_NUMBER は文字列、RANK は数値、DENSE_RANK は日付用
- D) ROW_NUMBER は同順位、RANK と DENSE_RANK は異なる番号

<details>
<summary>答えを見る</summary>

**正解: B**

例えば値が [100, 90, 90, 80] の場合:
- ROW_NUMBER: 1, 2, 3, 4（常に異なる番号）
- RANK: 1, 2, 2, 4（同値は同順位、次は飛び番）
- DENSE_RANK: 1, 2, 2, 3（同値は同順位、次は連番）

</details>

---

## 結果

### 7問以上正解の場合

**合格です！**

Step 3「サブクエリの謎を解き明かそう」を完了しました。
次はStep 4「TCP/IPの旅に出よう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう**

| 問題 | 復習セクション |
|------|---------------|
| Q1-Q2 | step3_1 サブクエリの基本 |
| Q3 | step3_3 FROM句とEXISTS |
| Q4-Q5 | step3_2 / step3_3 WHERE句サブクエリ / EXISTS |
| Q6-Q8 | step3_4 ウィンドウ関数入門 |

---

## Step 3 完了！

### 学んだこと

- サブクエリの基本（スカラー、テーブル）
- WHERE句でのサブクエリ（IN, ANY, ALL, 比較演算子）
- FROM句でのサブクエリ（派生テーブル）
- EXISTS / NOT EXISTS
- 相関サブクエリ
- ウィンドウ関数（ROW_NUMBER, RANK, DENSE_RANK, 集計+OVER）

### 次のステップ

**Step 4: TCP/IPの旅に出よう（2時間）**

データベースからネットワークへ。TCP/IPをより深く理解し、ポートやファイアウォールの知識を身につけます。

---

*推定所要時間: 30分*
