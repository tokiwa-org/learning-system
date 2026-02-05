# チェックポイント：ORDER BYとLIMITを使いこなそう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 5
subStep: 6
title: "チェックポイント：ORDER BYとLIMITを使いこなそう"
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

Step 5で学んだ内容を確認します。

- 全8問
- 合格ライン：6問以上正解（75%）

---

## 問題

### Q1: ORDER BY のデフォルトの並び順は？

A) 降順（大きい順）
B) 昇順（小さい順）
C) ランダム
D) データの登録順

<details>
<summary>答えを見る</summary>

**正解: B) 昇順（小さい順）**

ORDER BY のデフォルトは ASC（Ascending = 昇順）です。
`ORDER BY salary` と `ORDER BY salary ASC` は同じ意味になります。

</details>

---

### Q2: DESC の意味は？

A) 説明（Description）
B) 削除（Destroy）
C) 降順（Descending）
D) 減算（Decrease）

<details>
<summary>答えを見る</summary>

**正解: C) 降順（Descending）**

DESC は Descending の略で、大きい値から小さい値への並び順（降順）を指定します。
覚え方：「DESC = でかい順」

</details>

---

### Q3: `SELECT * FROM products LIMIT 5;` の意味は？

A) 5行目だけを表示する
B) 最初の5行を表示する
C) 最後の5行を表示する
D) 5行目以降をすべて表示する

<details>
<summary>答えを見る</summary>

**正解: B) 最初の5行を表示する**

LIMIT は取得する行数の上限を指定します。
`LIMIT 5` は「最大5行まで取得する」という意味です。

</details>

---

### Q4: `COUNT(*)` と `COUNT(column)` の違いは？

A) 違いはない（同じ結果になる）
B) `COUNT(*)` はNULLを含めて数え、`COUNT(column)` はNULLを除いて数える
C) `COUNT(*)` は列数を数え、`COUNT(column)` は行数を数える
D) `COUNT(*)` は遅く、`COUNT(column)` は速い

<details>
<summary>答えを見る</summary>

**正解: B) `COUNT(*)` はNULLを含めて数え、`COUNT(column)` はNULLを除いて数える**

- `COUNT(*)` はテーブルの全行数を数えます（NULLがあっても数える）
- `COUNT(column)` は指定カラムがNULLでない行だけを数えます

</details>

---

### Q5: AVG関数の役割は？

A) 合計値を求める
B) 最大値を求める
C) 平均値を求める
D) 中央値を求める

<details>
<summary>答えを見る</summary>

**正解: C) 平均値を求める**

AVG は Average（平均）の略です。
`AVG(salary)` は給料の平均値を計算します。
なお、合計は SUM、最大値は MAX を使います。

</details>

---

### Q6: GROUP BY の用途は？

A) データを並び替える
B) データの件数を制限する
C) 指定カラムの値でデータをグループ化して集計する
D) テーブルを結合する

<details>
<summary>答えを見る</summary>

**正解: C) 指定カラムの値でデータをグループ化して集計する**

GROUP BY は指定したカラムの値が同じ行をグループにまとめます。
例えば `GROUP BY department` で部署ごとにグループ化し、各部署の集計ができます。

</details>

---

### Q7: HAVING と WHERE の違いは？

A) 違いはない（同じ機能）
B) WHERE はグループ化前、HAVING はグループ化後のフィルタ
C) WHERE は数値のみ、HAVING は文字列のみフィルタできる
D) WHERE はSELECTの前、HAVING はSELECTの後に書く

<details>
<summary>答えを見る</summary>

**正解: B) WHERE はグループ化前、HAVING はグループ化後のフィルタ**

- WHERE: GROUP BY の **前** に実行される。個々の行をフィルタする
- HAVING: GROUP BY の **後** に実行される。グループの集計結果をフィルタする

そのため、HAVING では `AVG(salary) >= 300000` のように集計関数を条件に使えますが、WHERE では集計関数を使えません。

</details>

---

### Q8: SQL文の実行順序として正しいものは？

A) SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT
B) FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
C) FROM → SELECT → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT
D) SELECT → FROM → GROUP BY → WHERE → HAVING → ORDER BY → LIMIT

<details>
<summary>答えを見る</summary>

**正解: B) FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT**

SQL文は **書く順番** と **実行順序** が異なります。

| 実行順 | 句 | 役割 |
|--------|------|------|
| 1 | FROM | テーブルを指定 |
| 2 | WHERE | 行をフィルタ（グループ化前） |
| 3 | GROUP BY | グループ化 |
| 4 | HAVING | グループをフィルタ（グループ化後） |
| 5 | SELECT | カラムを選択・集計 |
| 6 | ORDER BY | 並び替え |
| 7 | LIMIT | 件数制限 |

A) は「書く順番」であり、実行順序ではありません。

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

| 問題 | 復習セクション |
|------|---------------|
| Q1-Q2 | Step 5-1: ORDER BYで並び替えよう |
| Q3 | Step 5-2: LIMITで件数を制限しよう |
| Q4-Q5 | Step 5-3: COUNT, SUM, AVGで集計しよう |
| Q6-Q7 | Step 5-4: GROUP BYでグループ化しよう |
| Q8 | Step 5-4: SQL文の実行順序 |

---

## Step 5 完了！

おめでとうございます！
ORDER BY、LIMIT、集計関数、GROUP BYをマスターしました。

### 習得したスキル

- [x] ORDER BY（ASC/DESC）でデータの並び替え
- [x] LIMITで件数制限、OFFSETでページネーション
- [x] COUNT、SUM、AVG、MAX、MINで集計
- [x] GROUP BYでグループ化して集計
- [x] HAVINGでグループの絞り込み
- [x] SQL文の実行順序の理解

---

## 次のステップへ

Step 6では、ここまで学んだすべてのSQL知識を使った総合演習に挑戦します。

SELECT、WHERE、ORDER BY、LIMIT、集計関数、GROUP BYを組み合わせて、
実践的なデータ分析ができるようになりましょう！

---

*推定所要時間: 30分*
