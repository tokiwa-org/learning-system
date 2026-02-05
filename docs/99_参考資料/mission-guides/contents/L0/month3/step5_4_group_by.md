# GROUP BYでグループ化しよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 5
subStep: 4
title: "GROUP BYでグループ化しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「先輩、部署ごとの平均給料が知りたいんですけど...」
>
> 「GROUP BYでグループ化できるよ」
>
> 「グループ化？」
>
> 「データを "部署ごと" とか "カテゴリごと" にまとめて、それぞれの集計ができるんだ」

---

## GROUP BY句とは

`GROUP BY` = **指定したカラムの値でデータをグループ化する**ための句です。

### 例え話

GROUP BYは「仕分け箱」のようなもの。

- 社員データを「部署」の箱に仕分ける → 部署ごとの集計ができる
- 商品データを「カテゴリ」の箱に仕分ける → カテゴリごとの集計ができる

```
全社員（8人）
    ┃ GROUP BY department
    ┣━ 開発部の箱 → 田中、鈴木、山田（3人）
    ┣━ 営業部の箱 → 佐藤、伊藤、中村（3人）
    ┗━ 人事部の箱 → 高橋、小林（2人）
```

---

## 基本構文

```sql
SELECT カラム名, 集計関数 FROM テーブル名 GROUP BY カラム名;
```

---

## 部署ごとの社員数

```sql
SELECT department, COUNT(*) FROM employees GROUP BY department;
```

実行結果：

```
department  COUNT(*)
----------  --------
開発部      3
営業部      3
人事部      2
```

各部署に何人いるかが一目でわかります。

### エイリアスをつけて見やすく

```sql
SELECT department AS 部署, COUNT(*) AS 社員数 FROM employees GROUP BY department;
```

実行結果：

```
部署    社員数
------  ------
開発部  3
営業部  3
人事部  2
```

---

## 部署ごとの平均給料

```sql
SELECT department AS 部署, AVG(salary) AS 平均給料 FROM employees GROUP BY department;
```

実行結果：

```
部署    平均給料
------  ----------------
開発部  346666.666666667
営業部  303333.333333333
人事部  315000.0
```

---

## カテゴリごとの商品統計

```sql
SELECT
    category AS カテゴリ,
    COUNT(*) AS 商品数,
    AVG(price) AS 平均価格
FROM products
GROUP BY category;
```

実行結果：

```
カテゴリ  商品数  平均価格
--------  ------  --------
電子機器  6       24750.0
家具      4       26250.0
```

---

## GROUP BY + 複数の集計関数

1つのGROUP BYで複数の集計関数を同時に使えます。

```sql
SELECT
    department AS 部署,
    COUNT(*) AS 社員数,
    AVG(salary) AS 平均給料,
    MAX(salary) AS 最高給料,
    MIN(salary) AS 最低給料
FROM employees
GROUP BY department;
```

実行結果：

```
部署    社員数  平均給料          最高給料  最低給料
------  ------  ----------------  --------  --------
開発部  3       346666.666666667  400000    290000
営業部  3       303333.333333333  320000    280000
人事部  2       315000.0          330000    300000
```

---

## HAVING - グループ化後のフィルタ

`HAVING` = **GROUP BYの結果に対して条件を指定する**句です。

### 平均給料が31万円以上の部署

```sql
SELECT
    department AS 部署,
    AVG(salary) AS 平均給料
FROM employees
GROUP BY department
HAVING AVG(salary) >= 310000;
```

実行結果：

```
部署    平均給料
------  ----------------
開発部  346666.666666667
人事部  315000.0
```

> 営業部（平均303,333円）は条件を満たさないので表示されません。

### 商品数が4つ以上のカテゴリ

```sql
SELECT
    category AS カテゴリ,
    COUNT(*) AS 商品数
FROM products
GROUP BY category
HAVING COUNT(*) >= 4;
```

実行結果：

```
カテゴリ  商品数
--------  ------
電子機器  6
家具      4
```

---

## WHERE vs HAVING

| | WHERE | HAVING |
|--|-------|--------|
| フィルタのタイミング | グループ化 **前** | グループ化 **後** |
| 対象 | 個々の行 | グループの集計結果 |
| 集計関数の使用 | 使えない | 使える |

### 例で比較

```sql
-- WHERE: グループ化する前に「開発部以外」を除外
SELECT department, AVG(salary)
FROM employees
WHERE department != '人事部'
GROUP BY department;

-- HAVING: グループ化した後に「平均給料31万円未満」を除外
SELECT department, AVG(salary)
FROM employees
GROUP BY department
HAVING AVG(salary) >= 310000;
```

### WHEREとHAVINGを同時に使う

```sql
SELECT
    department AS 部署,
    AVG(salary) AS 平均給料
FROM employees
WHERE salary >= 290000
GROUP BY department
HAVING AVG(salary) >= 310000;
```

1. まず `WHERE salary >= 290000` で給料29万円以上の社員だけに絞る
2. その結果を `GROUP BY department` で部署ごとにグループ化
3. `HAVING AVG(salary) >= 310000` で平均給料31万円以上の部署だけ表示

---

## SQL文の実行順序

SQL文は書いた順番とは異なる順番で処理されます。

```
書く順番:  SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT
実行順序:  FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

| 実行順 | 句 | 役割 |
|--------|------|------|
| 1 | FROM | テーブルを指定 |
| 2 | WHERE | 行をフィルタ |
| 3 | GROUP BY | グループ化 |
| 4 | HAVING | グループをフィルタ |
| 5 | SELECT | カラムを選択・集計 |
| 6 | ORDER BY | 並び替え |
| 7 | LIMIT | 件数制限 |

> この順番を知っておくと、「WHEREで集計関数が使えない」「HAVINGはGROUP BYの後」という理由が理解できます。

---

## すべてを組み合わせた例

```sql
SELECT
    department AS 部署,
    COUNT(*) AS 社員数,
    AVG(salary) AS 平均給料
FROM employees
WHERE salary >= 290000
GROUP BY department
HAVING COUNT(*) >= 2
ORDER BY 平均給料 DESC
LIMIT 2;
```

処理の流れ：
1. **FROM**: employees テーブルから
2. **WHERE**: 給料29万円以上の社員を絞り込み
3. **GROUP BY**: 部署ごとにグループ化
4. **HAVING**: 社員数2人以上のグループだけ残す
5. **SELECT**: 部署、社員数、平均給料を取得
6. **ORDER BY**: 平均給料の高い順に並べる
7. **LIMIT**: 上位2件だけ表示

---

## ハンズオン

SQLiteを起動して、以下のSQLを実行してみましょう。

```sql
-- 1. 表示設定（まだの場合）
.mode column
.headers on

-- 2. 部署ごとの社員数を表示
SELECT department AS 部署, COUNT(*) AS 社員数 FROM employees GROUP BY department;

-- 3. 部署ごとの平均給料を表示
SELECT department AS 部署, AVG(salary) AS 平均給料 FROM employees GROUP BY department;

-- 4. カテゴリごとの商品数と平均価格を表示
SELECT category AS カテゴリ, COUNT(*) AS 商品数, AVG(price) AS 平均価格
FROM products GROUP BY category;

-- 5. 平均給料が31万円以上の部署を表示（HAVING）
SELECT department AS 部署, AVG(salary) AS 平均給料
FROM employees GROUP BY department HAVING AVG(salary) >= 310000;

-- 6. 部署ごとの統計をフル表示
SELECT
    department AS 部署,
    COUNT(*) AS 社員数,
    AVG(salary) AS 平均給料,
    MAX(salary) AS 最高給料,
    MIN(salary) AS 最低給料
FROM employees
GROUP BY department
ORDER BY 平均給料 DESC;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| GROUP BY | 指定カラムの値でデータをグループ化 |
| 集計関数との併用 | COUNT、AVG、SUM、MAX、MINと組み合わせて使う |
| HAVING | グループ化後のフィルタ条件を指定 |
| WHERE vs HAVING | WHERE=グループ化前、HAVING=グループ化後 |
| SQL実行順序 | FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT |

### チェックリスト

- [ ] GROUP BYでグループ化して集計できた
- [ ] エイリアス（AS）を使って結果を見やすくできた
- [ ] HAVINGでグループの絞り込みができた
- [ ] WHEREとHAVINGの違いを理解できた
- [ ] SQL文の実行順序を理解できた

---

## 次のステップへ

GROUP BYでグループ化と集計ができるようになりましたね。

次のセクションでは、ここまで学んだORDER BY、LIMIT、集計関数、GROUP BYを組み合わせた演習に挑戦します。
実践的なデータ分析をやってみましょう！

---

*推定読了時間: 30分*
