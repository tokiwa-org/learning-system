# チェックポイント：JOINの迷宮を攻略しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 2
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

Step 2で学んだJOINの理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. INNER JOINの説明として正しいものはどれですか？

- A) 左テーブルの全データを保持して結合する
- B) 両方のテーブルに一致するデータのみを返す
- C) 右テーブルの全データを保持して結合する
- D) 両方のテーブルの全データを返す

<details>
<summary>答えを見る</summary>

**正解: B**

INNER JOINは両方のテーブルで結合条件に一致するデータのみを結果に含めます。一致しないデータは結果から除外されます。

</details>

---

### Q2. 以下のSQLの結果として正しいものはどれですか？

```sql
SELECT e.name, d.name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
```

- A) 部署に所属する社員のみ表示される
- B) 全社員が表示され、部署がない場合はNULLになる
- C) 全部署が表示され、社員がいない場合はNULLになる
- D) 構文エラーになる

<details>
<summary>答えを見る</summary>

**正解: B**

LEFT JOINは左テーブル（employees）の全データを保持します。department_id に対応する departments のデータがない場合、d.name は NULL になります。

</details>

---

### Q3. 「プロジェクトに参加していない社員を探す」ために適切なSQL構造は？

- A) INNER JOIN + WHERE
- B) LEFT JOIN + WHERE ... IS NULL
- C) RIGHT JOIN + GROUP BY
- D) INNER JOIN + HAVING

<details>
<summary>答えを見る</summary>

**正解: B**

LEFT JOINで全社員を保持しつつ project_members と結合し、WHERE で右テーブルのカラムが IS NULL の行を抽出します。「存在しないデータを探す」定番パターンです。

</details>

---

### Q4. テーブルエイリアスの使い方として正しいものはどれですか？

- A) `FROM employees AS e` と書くと、以降 `employees` でも `e` でも参照できる
- B) `FROM employees e` と書くと、以降 `e` でのみ参照できる
- C) エイリアスはSELECT句でのみ使用できる
- D) エイリアスは1つのクエリで1つしか使えない

<details>
<summary>答えを見る</summary>

**正解: B**

テーブルにエイリアスを設定すると、そのクエリ内ではエイリアスでのみ参照できます。元のテーブル名は使えなくなります。`AS` は省略可能で、`FROM employees e` と `FROM employees AS e` は同じ意味です。

</details>

---

### Q5. 3テーブルのJOINで正しい構文はどれですか？

- A) `FROM a JOIN b, c ON a.id = b.a_id AND b.id = c.b_id`
- B) `FROM a JOIN b ON a.id = b.a_id JOIN c ON b.id = c.b_id`
- C) `FROM a, b, c WHERE a.id = b.a_id AND b.id = c.b_id`
- D) B と C の両方が正しい

<details>
<summary>答えを見る</summary>

**正解: D**

Bは明示的なJOIN構文で、Cは暗黙的なJOIN（カンマ区切り + WHERE）です。どちらも動作しますが、Bの明示的JOIN構文のほうが読みやすく、推奨されています。

</details>

---

### Q6. 自己結合（Self JOIN）が必要になるケースはどれですか？

- A) 2つの異なるテーブルを結合するとき
- B) 同じテーブル内のデータ同士を比較・参照するとき
- C) テーブルを2回以上クエリするとき
- D) テーブルのデータを複製するとき

<details>
<summary>答えを見る</summary>

**正解: B**

自己結合は、同じテーブル内のデータ同士を比較・参照する場合に使います。典型的な例は、employees テーブルで manager_id から上司の名前を取得する場合です。

</details>

---

### Q7. 以下のSQLで、COALESCE(m.name, 'なし') は何をしていますか？

```sql
SELECT e.name, COALESCE(m.name, 'なし') AS 上司名
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

- A) m.name が NULL の場合に「なし」を返す
- B) m.name と「なし」を結合する
- C) m.name を「なし」に置換する
- D) m.name が「なし」の場合にNULLを返す

<details>
<summary>答えを見る</summary>

**正解: A**

COALESCE関数は、引数を左から順に評価し、最初にNULLでない値を返します。m.name が NULL（上司がいない社員）の場合、第2引数の「なし」が返されます。

</details>

---

### Q8. 多対多のリレーション（employees ↔ projects）をJOINするとき、正しいアプローチは？

- A) employees と projects を直接JOINする
- B) 中間テーブル（project_members）を経由して2段階でJOINする
- C) CROSS JOINを使用する
- D) サブクエリを使用する

<details>
<summary>答えを見る</summary>

**正解: B**

多対多のリレーションは中間テーブルを経由してJOINします。`employees → project_members → projects` の順で2つのJOINを書きます。employees と projects には直接結合できるカラムがないため、中間テーブルが必要です。

</details>

---

## 結果

### 7問以上正解の場合

**合格です！**

Step 2「JOINの迷宮を攻略しよう」を完了しました。
次はStep 3「サブクエリの謎を解き明かそう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう**

| 問題 | 復習セクション |
|------|---------------|
| Q1-Q2 | step2_1 INNER JOIN / step2_2 LEFT JOIN |
| Q3 | step2_2 LEFT JOIN（IS NULLパターン） |
| Q4-Q5 | step2_1 / step2_3 複数テーブルJOIN |
| Q6-Q7 | step2_4 自己結合 |
| Q8 | step2_3 中間テーブル経由のJOIN |

---

## Step 2 完了！

### 学んだこと

- INNER JOINの構文と動作
- LEFT JOIN / RIGHT JOIN / FULL OUTER JOINの違い
- 3テーブル以上のJOINの書き方
- 自己結合（Self JOIN）の使い方
- NULLの取り扱い（COALESCE, IS NULL）

### 次のステップ

**Step 3: サブクエリの謎を解き明かそう（4時間）**

クエリの中にクエリを書く「サブクエリ」と、行ごとに集計できる「ウィンドウ関数」を学びます。

---

*推定所要時間: 30分*
