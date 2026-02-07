# SQL基本の復習

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 1
subStep: 2
title: "SQL基本の復習"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「JOINを学ぶ前に、まず基本を確認しておこう」
>
> 先輩がホワイトボードにSQLの基本構文を書き始めた。
>
> 「SELECT, WHERE, GROUP BY...この辺りはもう大丈夫だよね？」
>
> 「はい、L0で学びました。でも少し不安なところもあって...」
>
> 「じゃあサクッと復習して、万全の状態でJOINに臨もう」

---

## SELECT文の基本構文

```sql
SELECT カラム名
FROM テーブル名
WHERE 条件
GROUP BY グループ化するカラム
HAVING グループに対する条件
ORDER BY 並び替えるカラム
LIMIT 取得件数;
```

### 実行順序（重要）

SQLは書いた順番ではなく、以下の順番で実行されます。

```
1. FROM    → テーブルを選ぶ
2. WHERE   → 行をフィルタリング
3. GROUP BY → グループ化
4. HAVING  → グループをフィルタリング
5. SELECT  → カラムを選ぶ
6. ORDER BY → 並び替え
7. LIMIT   → 件数制限
```

> この実行順序は、JOINやサブクエリを書くときに特に重要になります。

---

## WHERE句の復習

### 基本的な比較

```sql
-- 等価
SELECT * FROM employees WHERE position = 'エンジニア';

-- 範囲
SELECT * FROM employees WHERE salary >= 400000;

-- 複数条件（AND / OR）
SELECT * FROM employees
WHERE position = 'エンジニア' AND salary >= 400000;

-- NULL判定
SELECT * FROM employees WHERE manager_id IS NULL;

-- パターンマッチ
SELECT * FROM employees WHERE name LIKE '%田%';

-- リスト照合
SELECT * FROM employees WHERE position IN ('マネージャー', 'エンジニア');
```

---

## GROUP BY と集計関数の復習

### 主な集計関数

| 関数 | 説明 | 例 |
|------|------|-----|
| COUNT() | 行数 | COUNT(*), COUNT(column) |
| SUM() | 合計 | SUM(salary) |
| AVG() | 平均 | AVG(salary) |
| MAX() | 最大値 | MAX(salary) |
| MIN() | 最小値 | MIN(salary) |

### GROUP BY の使い方

```sql
-- 部署ごとの社員数
SELECT department_id, COUNT(*) AS 社員数
FROM employees
GROUP BY department_id;

-- 部署ごとの平均給与
SELECT department_id, AVG(salary) AS 平均給与
FROM employees
GROUP BY department_id;
```

### HAVING でグループをフィルタリング

```sql
-- 平均給与が40万以上の部署だけを取得
SELECT department_id, AVG(salary) AS 平均給与
FROM employees
GROUP BY department_id
HAVING AVG(salary) >= 400000;
```

> **WHERE と HAVING の違い**: WHERE は個々の行をフィルタリング、HAVING はグループ化した後の結果をフィルタリングします。

---

## ORDER BY の復習

```sql
-- 給与の高い順
SELECT name, salary FROM employees ORDER BY salary DESC;

-- 部署順 → 給与の高い順（複数カラム）
SELECT name, department_id, salary
FROM employees
ORDER BY department_id ASC, salary DESC;
```

---

## ここまでの限界

L0の知識だけでは、こんな質問に答えられません。

```
Q: 「各社員の名前と、所属する部署名を一覧で見たい」

× SELECT name, department_id FROM employees;
  → department_id が 1, 2, 3... と数字で表示されてしまう
  → 部署「名」が欲しいのに！

○ 解決策: employees テーブルと departments テーブルを JOIN する
  → これが Step 2 で学ぶ内容です
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| SELECT文の実行順序 | FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT |
| WHERE | 行のフィルタリング（=, >, <, IN, LIKE, IS NULL） |
| GROUP BY + 集計関数 | COUNT, SUM, AVG, MAX, MIN でグループ集計 |
| HAVING | グループ化後のフィルタリング |
| 次の課題 | 複数テーブルの結合（JOIN）が必要 |

### チェックリスト
- [ ] SELECT文の実行順序を理解している
- [ ] WHERE句の各種条件を書ける
- [ ] GROUP BY + 集計関数を使える
- [ ] WHERE と HAVING の違いを説明できる

---

## 次のステップへ

基本の確認はOKですか？
次のセクションでは、このミッションで使う複雑なデータベースを構築します。
4つのテーブルが連携する、実務に近い環境を作りましょう。

---

*推定読了時間: 25分*
