# チェックポイント：WHERE句で絞り込もう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 3
subStep: 6
title: "チェックポイント：WHERE句で絞り込もう"
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

Step 3で学んだ内容を確認します。

- 全8問
- 合格ライン：6問以上正解（75%）

---

## 問題

### Q1: WHERE句の役割は何ですか？

A) テーブルを作成する
B) データを並び替える
C) 条件を指定してデータを絞り込む
D) カラム名を変更する

<details>
<summary>答えを見る</summary>

**正解: C) 条件を指定してデータを絞り込む**

WHERE句はSELECT文に条件を追加し、条件に合うデータだけを取り出します。

```sql
SELECT * FROM employees WHERE department = '開発部';
```

</details>

---

### Q2: 「等しくない」を表す演算子はどれですか？

A) `==`
B) `!=` または `<>`
C) `!==`
D) `=/=`

<details>
<summary>答えを見る</summary>

**正解: B) `!=` または `<>`**

SQLでは「等しくない」を `!=` または `<>` で表します。どちらも同じ意味です。

```sql
SELECT * FROM employees WHERE department != '人事部';
SELECT * FROM employees WHERE department <> '人事部';
```

</details>

---

### Q3: ANDとORの優先順位について正しいのはどれですか？

A) ORがANDより優先される
B) ANDがORより優先される
C) ANDとORは同じ優先順位
D) 書いた順番で評価される

<details>
<summary>答えを見る</summary>

**正解: B) ANDがORより優先される**

ANDはORより優先的に評価されます。意図しない結果を防ぐために、括弧 `()` を使って明示的にグループ化することが推奨されます。

```sql
-- 括弧がないと意図しない結果になることがある
WHERE A OR B AND C  →  A OR (B AND C) と解釈される

-- 括弧で意図を明確にする
WHERE (A OR B) AND C
```

</details>

---

### Q4: `WHERE name LIKE '%田%'` はどのようなデータを検索しますか？

A) nameが「田」と完全一致するデータ
B) nameが「田」で始まるデータ
C) nameに「田」を含むデータ
D) nameが「田」で終わるデータ

<details>
<summary>答えを見る</summary>

**正解: C) nameに「田」を含むデータ**

`%` は0文字以上の任意の文字列を表すワイルドカードです。`'%田%'` は前後に何があっても「田」を含むものすべてにマッチします。

| パターン | 意味 |
|----------|------|
| `'%田%'` | 「田」を含む |
| `'田%'` | 「田」で始まる |
| `'%田'` | 「田」で終わる |

</details>

---

### Q5: `WHERE price BETWEEN 10 AND 20` はどの範囲のデータを取得しますか？

A) 10より大きく20より小さい（10 < price < 20）
B) 10以上20以下（10 <= price <= 20）
C) 10より大きく20以下（10 < price <= 20）
D) 10以上20より小さい（10 <= price < 20）

<details>
<summary>答えを見る</summary>

**正解: B) 10以上20以下（10 <= price <= 20）**

`BETWEEN` は **両端を含みます**。つまり、10も20も検索結果に含まれます。

```sql
-- BETWEENは以下と同じ意味
WHERE price >= 10 AND price <= 20
```

</details>

---

### Q6: IN演算子の正しい使い方はどれですか？

A) `WHERE department IN '開発部', '営業部'`
B) `WHERE department IN ('開発部', '営業部')`
C) `WHERE department IN ['開発部', '営業部']`
D) `WHERE department IN {'開発部', '営業部'}`

<details>
<summary>答えを見る</summary>

**正解: B) `WHERE department IN ('開発部', '営業部')`**

IN演算子は丸括弧 `()` の中にカンマ区切りで値を列挙します。複数のORを簡潔に書ける便利な演算子です。

```sql
-- INを使う場合
WHERE department IN ('開発部', '営業部');

-- 同じ意味のOR
WHERE department = '開発部' OR department = '営業部';
```

</details>

---

### Q7: NULLの値を検索するとき、正しい書き方はどれですか？

A) `WHERE column = NULL`
B) `WHERE column == NULL`
C) `WHERE column IS NULL`
D) `WHERE column EQUALS NULL`

<details>
<summary>答えを見る</summary>

**正解: C) `WHERE column IS NULL`**

NULLは「値がない」という特別な状態です。通常の `=` 演算子では比較できません。NULLの検索には必ず `IS NULL` または `IS NOT NULL` を使います。

```sql
-- 正しい
SELECT * FROM employees WHERE department IS NULL;

-- 正しくない（結果が返らない）
SELECT * FROM employees WHERE department = NULL;
```

</details>

---

### Q8: 以下のSQLの実行結果として正しいのはどれですか？

```sql
SELECT * FROM employees WHERE NOT department = '開発部';
```

A) 開発部の社員だけが表示される
B) 開発部以外の社員が表示される
C) 全社員が表示される
D) エラーになる

<details>
<summary>答えを見る</summary>

**正解: B) 開発部以外の社員が表示される**

`NOT` は条件を反転させます。`NOT department = '開発部'` は「departmentが開発部ではない」という意味です。

```sql
-- 以下はすべて同じ結果
SELECT * FROM employees WHERE NOT department = '開発部';
SELECT * FROM employees WHERE department != '開発部';
SELECT * FROM employees WHERE department <> '開発部';
```

</details>

---

## 採点

### 選択問題（8問）

| 正解数 | 判定 |
|--------|------|
| 8問 | 完璧！WHERE句マスター！ |
| 6-7問 | 合格 |
| 4-5問 | もう少し。苦手な部分を復習しよう |
| 3問以下 | Step 3の各レッスンを復習しよう |

---

## 復習ポイント

間違えた問題があれば、以下のセクションを復習してください。

| 問題 | 復習セクション |
|------|---------------|
| Q1 | Step 3-1: WHERE句の基本 |
| Q2 | Step 3-2: 比較演算子を使おう |
| Q3 | Step 3-3: ANDとORで条件を組み合わせよう |
| Q4 | Step 3-4: LIKEとBETWEENで柔軟に検索しよう |
| Q5 | Step 3-4: LIKEとBETWEENで柔軟に検索しよう |
| Q6 | Step 3-3: ANDとORで条件を組み合わせよう |
| Q7 | Step 3-2: 比較演算子を使おう |
| Q8 | Step 3-3: ANDとORで条件を組み合わせよう |

---

## Step 3 完了！

おめでとうございます！
WHERE句によるデータの絞り込みスキルを習得しました。

### 習得したスキル

- [x] WHERE句で条件を指定してデータを絞り込む
- [x] 比較演算子（=, !=, <, >, <=, >=）を使う
- [x] AND / OR / NOT で条件を組み合わせる
- [x] IN 演算子で複数の値を指定する
- [x] LIKE でパターン検索する
- [x] BETWEEN で範囲指定する
- [x] IS NULL / IS NOT NULL でNULLを扱う

---

## 次のステップへ

Step 4では、データの追加・更新・削除を学びます。

- `INSERT` でデータを追加
- `UPDATE` でデータを更新
- `DELETE` でデータを削除
- `CREATE TABLE` でテーブルを作成

SELECTでデータを読む力に加えて、データを書き込む力を身につけましょう！

---

*推定所要時間: 30分*
