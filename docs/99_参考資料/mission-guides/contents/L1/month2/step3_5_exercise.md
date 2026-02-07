# 演習：複雑なクエリに挑戦

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 3
subStep: 5
title: "演習：複雑なクエリに挑戦"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「サブクエリとウィンドウ関数、基本は覚えたな」
>
> 先輩が8つの調査依頼を出してきた。
>
> 「これは実際のデータ分析でよくある依頼だ。JOIN、サブクエリ、ウィンドウ関数を駆使して解いてくれ」
>
> 「全部の技術を組み合わせるんですね...やってみます！」

---

## ミッション概要

これまでに学んだ全てのSQL技術を使って、8つの分析ミッションに挑戦してください。

### 達成条件

- [ ] 全8ミッションのSQLを正しく書ける
- [ ] サブクエリとウィンドウ関数を適切に使い分けている

---

## Mission 1: 全社平均より給与が高い社員一覧

**依頼:** 全社員の平均給与より高い給与の社員を、給与の降順で表示してください。部署名も含めること。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    e.salary AS 月給
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary > (SELECT AVG(salary) FROM employees)
ORDER BY e.salary DESC;
```

**解説:** スカラーサブクエリで全社平均を取得し、WHERE句で比較しています。

</details>

---

## Mission 2: 各部署の最高給与社員

**依頼:** 各部署で最も給与が高い社員の名前、部署名、給与を表示してください。

<details>
<summary>解答</summary>

```sql
SELECT e.name AS 社員名, d.name AS 部署名, e.salary AS 月給
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary = (
    SELECT MAX(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e.department_id
);
```

**解説:** 相関サブクエリで各部署の最高給与を取得し、それに一致する社員を抽出しています。

**別解（ウィンドウ関数版）:**

```sql
SELECT 社員名, 部署名, 月給
FROM (
    SELECT
        e.name AS 社員名,
        d.name AS 部署名,
        e.salary AS 月給,
        RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS rnk
    FROM employees e
    INNER JOIN departments d ON e.department_id = d.id
) ranked
WHERE rnk = 1;
```

</details>

---

## Mission 3: 部署内給与ランキング

**依頼:** 全社員について、部署内での給与ランキングを表示してください。部署名、社員名、給与、部署内順位を含めること。

<details>
<summary>解答</summary>

```sql
SELECT
    d.name AS 部署名,
    e.name AS 社員名,
    e.salary AS 月給,
    RANK() OVER (
        PARTITION BY e.department_id
        ORDER BY e.salary DESC
    ) AS 部署内順位
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY d.name, 部署内順位;
```

**解説:** RANK() ウィンドウ関数を使い、PARTITION BY で部署ごとにランキングしています。

</details>

---

## Mission 4: 2つ以上のプロジェクトに参加し、かつ平均給与以上の社員

**依頼:** 2つ以上のプロジェクトに参加していて、なおかつ全社平均給与以上の社員を表示してください。

<details>
<summary>解答</summary>

```sql
SELECT e.name AS 社員名, e.salary AS 月給, COUNT(pm.project_id) AS 参加PJ数
FROM employees e
INNER JOIN project_members pm ON e.id = pm.employee_id
WHERE e.salary >= (SELECT AVG(salary) FROM employees)
GROUP BY e.name, e.salary
HAVING COUNT(pm.project_id) >= 2;
```

**解説:** WHERE句のサブクエリで平均給与以上を条件にし、HAVING句で参加プロジェクト数2以上をフィルタリングしています。

</details>

---

## Mission 5: 各プロジェクトの予算と人件費の比較

**依頼:** 各プロジェクトについて、プロジェクト予算、メンバーの月給合計、予算に対する月給合計の割合を表示してください。

<details>
<summary>解答</summary>

```sql
SELECT
    p.name AS プロジェクト名,
    p.budget AS 予算,
    SUM(e.salary) AS メンバー月給合計,
    ROUND(CAST(SUM(e.salary) AS FLOAT) / p.budget * 100, 1) AS 月給割合
FROM projects p
INNER JOIN project_members pm ON p.id = pm.project_id
INNER JOIN employees e ON pm.employee_id = e.id
GROUP BY p.name, p.budget
ORDER BY 月給割合 DESC;
```

**解説:** 3テーブルのJOINとGROUP BY集計を組み合わせ、プロジェクトごとのメンバー人件費を算出しています。

</details>

---

## Mission 6: 部署平均との差を表示

**依頼:** 各社員について、自分の給与と所属部署の平均給与の差を表示してください。ウィンドウ関数を使用すること。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    e.salary AS 月給,
    ROUND(AVG(e.salary) OVER (PARTITION BY e.department_id)) AS 部署平均,
    e.salary - ROUND(AVG(e.salary) OVER (PARTITION BY e.department_id)) AS 平均との差
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY d.name, 平均との差 DESC;
```

**解説:** AVG() OVER (PARTITION BY ...) で部署ごとの平均を各行に付与し、差を計算しています。

</details>

---

## Mission 7: 入社順の給与累計

**依頼:** 社員を入社日順に並べ、給与の累計を表示してください。社員名、入社日、月給、給与累計を含めること。

<details>
<summary>解答</summary>

```sql
SELECT
    name AS 社員名,
    hire_date AS 入社日,
    salary AS 月給,
    SUM(salary) OVER (ORDER BY hire_date, id) AS 給与累計
FROM employees
ORDER BY hire_date;
```

**解説:** SUM() OVER (ORDER BY hire_date) で入社順の累積合計を計算しています。同じ入社日の場合に順序を確定させるため、idも ORDER BY に追加しています。

</details>

---

## Mission 8: プロジェクト未参加で部署予算が最大の社員

**依頼:** どのプロジェクトにも参加しておらず、かつ所属部署の予算が全部署の平均予算より大きい社員を表示してください。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    d.budget AS 部署予算
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE NOT EXISTS (
    SELECT 1 FROM project_members pm WHERE pm.employee_id = e.id
)
AND d.budget > (SELECT AVG(budget) FROM departments);
```

**解説:** NOT EXISTS でプロジェクト未参加を条件にし、サブクエリで平均予算との比較も行っています。2つの条件を AND で組み合わせています。

</details>

---

## 達成度チェック

| ミッション | テーマ | 完了 |
|-----------|--------|------|
| Mission 1 | スカラーサブクエリ | [ ] |
| Mission 2 | 相関サブクエリ / RANK | [ ] |
| Mission 3 | ウィンドウ関数 RANK | [ ] |
| Mission 4 | サブクエリ + HAVING | [ ] |
| Mission 5 | 3テーブルJOIN + 集計 | [ ] |
| Mission 6 | ウィンドウ関数 AVG | [ ] |
| Mission 7 | 累計（Running Total） | [ ] |
| Mission 8 | NOT EXISTS + サブクエリ | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| サブクエリ | WHERE句やFROM句で別のクエリを埋め込む |
| 相関サブクエリ | 外側のクエリの値を内側で参照する |
| ウィンドウ関数 | 行を保持したまま集計・ランキング |
| 組み合わせ | JOIN + サブクエリ + ウィンドウ関数を状況に応じて使い分ける |

### チェックリスト
- [ ] 8つのミッションをすべてクリアした
- [ ] サブクエリとウィンドウ関数の使い分けができる
- [ ] 相関サブクエリを書ける
- [ ] 累計計算ができる

---

## 次のステップへ

おめでとうございます。複雑なクエリの演習をクリアしました。
次のセクションで理解度チェックを行い、Step 3 の仕上げをしましょう。

---

*推定所要時間: 90分*
