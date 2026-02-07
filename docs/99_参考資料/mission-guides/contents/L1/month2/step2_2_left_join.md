# LEFT JOINで全データを保持しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 2
subStep: 2
title: "LEFT JOINで全データを保持しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「INNER JOINだと、一致しないデータが結果に出てこない」
>
> 「それってまずいんですか？」
>
> 「場合による。例えば『どのプロジェクトにも参加していない社員は誰か？』という質問に答えるとき、INNER JOINだと対象者が結果から消えてしまう」
>
> 「なるほど、消えたデータこそ見たいケースもあるんですね」
>
> 「そう。そんなときは LEFT JOIN を使う」

---

## JOINの種類

| 種類 | 動作 |
|------|------|
| INNER JOIN | 両方のテーブルに一致するデータのみ返す |
| LEFT JOIN | 左テーブルの全データ + 右テーブルの一致データ |
| RIGHT JOIN | 右テーブルの全データ + 左テーブルの一致データ |
| FULL OUTER JOIN | 両方のテーブルの全データ |

> **LEFT JOIN** が実務で最もよく使われます。まずはこれを完璧にしましょう。

---

## LEFT JOINの構文

```sql
SELECT カラム名
FROM テーブルA          -- 左テーブル（全データを保持）
LEFT JOIN テーブルB     -- 右テーブル（一致するものだけ結合）
ON テーブルA.カラム = テーブルB.カラム;
```

### INNER JOINとの違い

```
INNER JOIN: 一致するデータだけ
LEFT JOIN:  左テーブルは全部残る（一致しない場合は右側がNULL）
```

---

## 視覚的な理解

### INNER JOINの場合

```
左テーブル    右テーブル     結果
+---+        +---+         +---+---+
| A |--------| A |   →     | A | A |
| B |        | C |         +---+---+
| C |--------+---+         | C | C |
+---+                      +---+---+
  ※ B は一致しないので消える
```

### LEFT JOINの場合

```
左テーブル    右テーブル     結果
+---+        +---+         +---+------+
| A |--------| A |   →     | A | A    |
| B |        | C |         | B | NULL |  ← 一致しなくても残る
| C |--------+---+         | C | C    |
+---+                      +---+------+
```

---

## 実践例

### 例1: 全社員と所属部署（部署未所属の社員も含む）

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
```

> この例では全員が部署に所属しているので結果はINNER JOINと同じですが、department_id が NULL の社員がいた場合でも結果に含まれます。

### 例2: 全部署とプロジェクト数

```sql
SELECT
    d.name AS 部署名,
    COUNT(p.id) AS プロジェクト数
FROM departments d
LEFT JOIN projects p ON d.id = p.department_id
GROUP BY d.name;
```

**結果:**

| 部署名 | プロジェクト数 |
|--------|--------------|
| 開発部 | 2 |
| 営業部 | 1 |
| 人事部 | 0 |
| マーケティング部 | 1 |

> **人事部**はプロジェクトがないので「0」と表示されます。INNER JOINだと人事部の行そのものが消えてしまいます。

### 例3: プロジェクトに参加していない社員を探す

```sql
SELECT e.name AS 社員名, e.position AS 役職
FROM employees e
LEFT JOIN project_members pm ON e.id = pm.employee_id
WHERE pm.project_id IS NULL;
```

**結果:**

| 社員名 | 役職 |
|--------|------|
| 山田花子 | マネージャー |
| 中村大輔 | 人事担当 |

> LEFT JOINした後、右テーブルのカラムが `NULL` の行をWHEREで抽出しています。「一致しないデータを見つける」ための定番テクニックです。

---

## RIGHT JOINとFULL OUTER JOIN

### RIGHT JOIN

LEFT JOINの逆で、**右テーブルの全データ**を保持します。

```sql
-- LEFT JOINで書いた場合
SELECT e.name, d.name FROM employees e LEFT JOIN departments d ON e.department_id = d.id;

-- RIGHT JOINで同じ結果を得る場合（テーブルの順序が逆）
SELECT e.name, d.name FROM departments d RIGHT JOIN employees e ON d.id = e.department_id;
```

> 実務では RIGHT JOIN はあまり使いません。テーブルの順序を入れ替えて LEFT JOIN で書くのが一般的です。

### FULL OUTER JOIN

両方のテーブルの全データを保持します。

```sql
SELECT e.name, d.name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.id;
```

> **注意**: SQLiteは FULL OUTER JOIN をサポートしていません。必要な場合は LEFT JOIN と UNION で代替できます。

---

## NULLの取り扱い

LEFT JOINの結果には NULL が含まれます。NULLの扱いに注意しましょう。

### COALESCE で NULL を別の値に置換

```sql
SELECT
    e.name AS 社員名,
    COALESCE(d.name, '未所属') AS 部署名
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
```

### COUNT での注意

```sql
-- COUNT(*) は NULL行もカウントする
-- COUNT(カラム名) は NULL をカウントしない

SELECT
    d.name,
    COUNT(*) AS 全行数,           -- NULLの行もカウント
    COUNT(p.id) AS プロジェクト数  -- NULLはカウントしない
FROM departments d
LEFT JOIN projects p ON d.id = p.department_id
GROUP BY d.name;
```

---

## よく使うパターン

### パターン1: 存在しないデータを探す

```sql
-- プロジェクトがない部署
SELECT d.name
FROM departments d
LEFT JOIN projects p ON d.id = p.department_id
WHERE p.id IS NULL;
```

### パターン2: 全件表示 + 関連データの付与

```sql
-- 全社員 + アサインされているプロジェクト数
SELECT
    e.name AS 社員名,
    COUNT(pm.project_id) AS 担当プロジェクト数
FROM employees e
LEFT JOIN project_members pm ON e.id = pm.employee_id
GROUP BY e.name
ORDER BY 担当プロジェクト数 DESC;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| LEFT JOIN | 左テーブルの全データを保持して結合 |
| NULLの扱い | 一致しない右テーブルのカラムはNULLになる |
| IS NULL | LEFT JOIN + WHERE ... IS NULL で「存在しないデータ」を検索 |
| RIGHT JOIN | LEFT JOINの逆（実務ではあまり使わない） |
| COALESCE | NULLを別の値に置換する関数 |

### チェックリスト
- [ ] LEFT JOINの構文を書ける
- [ ] INNER JOINとLEFT JOINの違いを説明できる
- [ ] LEFT JOIN + IS NULL で不在データを検索できる
- [ ] NULLの取り扱い（COALESCE, COUNT）を理解した

---

## 次のステップへ

LEFT JOINをマスターしました。
次のセクションでは、3つ以上のテーブルを結合する方法を学びます。
実務ではテーブルを何段階も結合するのが当たり前です。

---

*推定読了時間: 30分*
