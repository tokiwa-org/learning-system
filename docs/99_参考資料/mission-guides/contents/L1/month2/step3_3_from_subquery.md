# FROM句とEXISTSを活用しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 3
subStep: 3
title: "FROM句とEXISTSを活用しよう"
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

> 「サブクエリはWHERE句だけじゃない。FROM句にも使えるんだ」
>
> 「FROM句に？テーブルの代わりにサブクエリを書くってことですか？」
>
> 「その通り。サブクエリの結果を一時的なテーブルとして扱える。あと、EXISTSっていう強力な武器もある」
>
> 「EXISTS...なんだか強そうですね」
>
> 「実務では IN より EXISTS のほうが効率的なケースも多い。両方覚えておこう」

---

## FROM句でのサブクエリ（派生テーブル）

FROM句にサブクエリを書くと、その結果を**一時的なテーブル（派生テーブル）**として使えます。

### 基本構文

```sql
SELECT カラム名
FROM (
    SELECT ... FROM ... WHERE ...
) AS 派生テーブル名;
```

> **注意:** FROM句のサブクエリには必ずエイリアス（AS 名前）をつける必要があります。

---

### 例1: 部署ごとの集計結果に対して条件を適用

```sql
-- 平均給与が40万以上の部署だけを取得
SELECT *
FROM (
    SELECT
        d.name AS 部署名,
        COUNT(e.id) AS 社員数,
        ROUND(AVG(e.salary)) AS 平均給与
    FROM departments d
    INNER JOIN employees e ON d.id = e.department_id
    GROUP BY d.name
) AS dept_stats
WHERE 平均給与 >= 400000;
```

> HAVINGでも同じことができますが、集計結果に対してさらに複雑な処理（JOIN等）を行いたい場合は派生テーブルが便利です。

### 例2: 部署の集計結果と部署テーブルをJOIN

```sql
SELECT
    d.name AS 部署名,
    d.budget AS 年間予算,
    stats.社員数,
    stats.平均給与,
    d.budget / stats.社員数 AS 一人あたり予算
FROM departments d
INNER JOIN (
    SELECT
        department_id,
        COUNT(*) AS 社員数,
        ROUND(AVG(salary)) AS 平均給与
    FROM employees
    GROUP BY department_id
) AS stats ON d.id = stats.department_id;
```

**結果:**

| 部署名 | 年間予算 | 社員数 | 平均給与 | 一人あたり予算 |
|--------|---------|--------|---------|--------------|
| 開発部 | 5000000 | 3 | 443333 | 1666666 |
| 営業部 | 3000000 | 3 | 386667 | 1000000 |
| 人事部 | 2000000 | 2 | 400000 | 1000000 |
| マーケティング部 | 4000000 | 2 | 415000 | 2000000 |

---

## EXISTS / NOT EXISTS

EXISTSは、サブクエリが**1行以上の結果を返すかどうか**を判定します。

### 基本構文

```sql
SELECT カラム名
FROM テーブルA
WHERE EXISTS (
    SELECT 1 FROM テーブルB WHERE テーブルB.カラム = テーブルA.カラム
);
```

> `SELECT 1` は慣例的な書き方です。EXISTSは「結果が存在するか」だけを判定するため、SELECTで何を返すかは関係ありません。

---

### 例3: プロジェクトに参加している社員（EXISTS版）

```sql
-- IN版
SELECT name FROM employees
WHERE id IN (SELECT employee_id FROM project_members);

-- EXISTS版（同じ結果）
SELECT e.name
FROM employees e
WHERE EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.employee_id = e.id
);
```

### 例4: プロジェクトに参加していない社員（NOT EXISTS版）

```sql
SELECT e.name, e.position
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.employee_id = e.id
);
```

**結果:**

| name | position |
|------|----------|
| 山田花子 | マネージャー |
| 中村大輔 | 人事担当 |

---

## IN vs EXISTS の違い

### 動作の違い

| 特徴 | IN | EXISTS |
|------|-------|--------|
| 動作 | サブクエリを全件実行 → リストと比較 | 1行見つかった時点で終了 |
| NULLの扱い | NOT IN はNULLで問題あり | NOT EXISTSはNULL安全 |
| 相関 | 非相関サブクエリ向き | 相関サブクエリ向き |

### 使い分けの目安

```
サブクエリの結果が少量 → IN でOK
サブクエリの結果が大量 → EXISTS のほうが効率的
NULLの可能性がある   → EXISTS（NOT EXISTS）が安全
```

---

## 相関サブクエリ（Correlated Subquery）

相関サブクエリは、**外側のクエリの値を内側のサブクエリが参照する**パターンです。

### 例5: 各部署で最高給与の社員を探す

```sql
SELECT e.name, e.salary, d.name AS 部署名
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary = (
    SELECT MAX(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e.department_id  -- 外側の e を参照
);
```

**結果:**

| name | salary | 部署名 |
|------|--------|--------|
| 田中太郎 | 500000 | 開発部 |
| 高橋美咲 | 480000 | 営業部 |
| 山田花子 | 460000 | 人事部 |
| 小林さくら | 470000 | マーケティング部 |

> サブクエリ内の `e2.department_id = e.department_id` が、外側の行ごとに異なる値で評価されます。そのため、各部署での最高給与と比較されます。

### 例6: 平均給与以上の社員が2人以上いる部署

```sql
SELECT d.name AS 部署名
FROM departments d
WHERE (
    SELECT COUNT(*)
    FROM employees e
    WHERE e.department_id = d.id
      AND e.salary >= (SELECT AVG(salary) FROM employees)
) >= 2;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| FROM句サブクエリ | サブクエリの結果を一時テーブルとして使用（エイリアス必須） |
| EXISTS | サブクエリが結果を返すか判定（1行見つかれば終了） |
| NOT EXISTS | サブクエリが結果を返さないか判定（NULL安全） |
| 相関サブクエリ | 外側のクエリの値を内側で参照する |
| IN vs EXISTS | 少量データはIN、大量データやNULLありはEXISTS |

### チェックリスト
- [ ] FROM句で派生テーブルを作れる
- [ ] EXISTS / NOT EXISTS の構文を書ける
- [ ] IN と EXISTS の違いを説明できる
- [ ] 相関サブクエリの動作を理解した

---

## 次のステップへ

サブクエリの主要パターンを学びました。
次のセクションでは、行ごとに集計ができる「ウィンドウ関数」を学びます。
GROUP BYとは異なる、より柔軟な集計手法です。

---

*推定読了時間: 30分*
