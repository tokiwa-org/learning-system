# チェックポイント：SELECTでデータを取り出そう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 2
subStep: 6
title: "チェックポイント：SELECTでデータを取り出そう"
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

Step 2で学んだ内容を確認します。

- 全8問
- 合格ライン：6問以上正解（75%）

---

## 問題

### Q1: `SELECT *` の `*` は何を意味する？

A) 最初の1行だけ取り出す
B) テーブルのすべてのカラムを取り出す
C) テーブルを削除する
D) テーブルを作成する

<details>
<summary>答えを見る</summary>

**正解: B) テーブルのすべてのカラムを取り出す**

`*`（アスタリスク）は「すべてのカラム」を意味するワイルドカードです。
`SELECT * FROM employees;` は「employeesテーブルのすべてのカラムを取り出す」という意味になります。

</details>

---

### Q2: employeesテーブルから名前と給料だけを取り出すSQL文は？

A) `SELECT name AND salary FROM employees;`
B) `SELECT name, salary FROM employees;`
C) `SELECT (name, salary) FROM employees;`
D) `SELECT name salary FROM employees;`

<details>
<summary>答えを見る</summary>

**正解: B) `SELECT name, salary FROM employees;`**

複数のカラムを指定するときは、カンマ `,` で区切ります。

- A) `AND` はWHERE句で使う論理演算子であり、カラム区切りには使いません
- C) 括弧で囲む必要はありません
- D) カンマがないと正しく解釈されません

</details>

---

### Q3: AS句は何のために使う？

A) テーブルを作成するため
B) データを削除するため
C) カラムの表示名を一時的に変えるため
D) データを並び替えるため

<details>
<summary>答えを見る</summary>

**正解: C) カラムの表示名を一時的に変えるため**

AS句（エイリアス）は、出力結果のカラム名を一時的に別名に変えます。テーブルの実際のカラム名は変わりません。

例: `SELECT name AS 氏名 FROM employees;`

</details>

---

### Q4: DISTINCTの役割は？

A) データを昇順に並び替える
B) 結果から重複する行を除外する
C) NULLの行を除外する
D) 最初の1行だけ取り出す

<details>
<summary>答えを見る</summary>

**正解: B) 結果から重複する行を除外する**

`SELECT DISTINCT department FROM employees;` のように使うと、重複する値を除いた一覧が得られます。

例えば、「開発部」が2行あっても、DISTINCTを使えば1行だけ表示されます。

</details>

---

### Q5: SQL文の末尾に必要なものは？

A) ピリオド `.`
B) コロン `:`
C) セミコロン `;`
D) カンマ `,`

<details>
<summary>答えを見る</summary>

**正解: C) セミコロン `;`**

SQL文の終わりにはセミコロン `;` が必要です。これがないと、SQLiteは「まだ続きがある」と判断して入力待ちの状態になります。

</details>

---

### Q6: `SELECT department, name FROM employees;` の出力で左側に来るカラムはどちら？

A) name（テーブル定義で先にあるカラム）
B) department（SELECT文で先に書いたカラム）
C) どちらが左に来るかは毎回ランダム
D) id（主キーが必ず最初に来る）

<details>
<summary>答えを見る</summary>

**正解: B) department（SELECT文で先に書いたカラム）**

出力のカラム順は、SELECT文で指定した順番どおりになります。テーブル定義の順番は関係ありません。

`SELECT department, name` と書けば、`department` が左、`name` が右に表示されます。

</details>

---

### Q7: `SELECT COUNT(DISTINCT department) FROM employees;` は何を返す？

A) employeesテーブルの全行数
B) departmentカラムがNULLでない行の数
C) 重複を除いた部署の種類数
D) 部署名の文字数の合計

<details>
<summary>答えを見る</summary>

**正解: C) 重複を除いた部署の種類数**

`COUNT(DISTINCT department)` は、重複を除外した `department` の値の数を返します。

employeesテーブルには「開発部」「営業部」「人事部」の3種類の部署があるので、結果は `3` になります。

</details>

---

### Q8: エイリアスにスペースを含めるにはどうする？

A) シングルクォーテーションで囲む: `AS '社員 名前'`
B) ダブルクォーテーションで囲む: `AS "社員 名前"`
C) バッククォートで囲む: `` AS `社員 名前` ``
D) スペースを含むエイリアスは作れない

<details>
<summary>答えを見る</summary>

**正解: B) ダブルクォーテーションで囲む: `AS "社員 名前"`**

スペースや括弧などの記号を含むエイリアスは、ダブルクォーテーション `"` で囲みます。

例: `SELECT name AS "社員 名前", salary AS "月給(円)" FROM employees;`

> SQLiteではシングルクォーテーションやバッククォートでも動作する場合がありますが、SQL標準ではダブルクォーテーションが正式な方法です。

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

## 復習ポイント

間違えた問題があれば、以下のセクションを復習してください。

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q5 | Step 2-1: SELECT文の基本 |
| Q2, Q6 | Step 2-2: カラムを指定して取り出そう |
| Q3, Q8 | Step 2-3: AS句でカラム名を変えよう |
| Q4, Q7 | Step 2-4: DISTINCTで重複を除こう |

---

## Step 2 完了！

おめでとうございます！
「SELECTでデータを取り出す」基本をマスターしました。

### 習得したスキル

- [x] `SELECT *` で全データを取り出す
- [x] 特定のカラムを指定して取り出す
- [x] `AS` 句でカラムに別名を付ける
- [x] `DISTINCT` で重複を除外する
- [x] `COUNT(DISTINCT ...)` で種類数を数える

---

## 次のステップへ

Step 3では、`WHERE` 句を使った条件指定を学びます。

- `WHERE` で特定の条件に合うデータだけ取り出す
- 比較演算子（`=`, `>`, `<` など）で絞り込む
- `AND` と `OR` で複数の条件を組み合わせる
- `LIKE` と `BETWEEN` で柔軟に検索する

「開発部の社員だけ表示したい」「給料が30万以上の人は？」
そんなリクエストに応えられるようになりますよ！

---

*推定所要時間: 30分*
