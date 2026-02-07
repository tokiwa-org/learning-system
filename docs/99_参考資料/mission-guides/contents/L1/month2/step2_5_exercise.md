# 演習：JOINマスターへの挑戦

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 2
subStep: 5
title: "演習：JOINマスターへの挑戦"
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

> 「JOINの基本は覚えたな。じゃあ実際にデータを探し出すミッションに挑戦してもらう」
>
> 先輩が8つの調査依頼を渡してきた。
>
> 「これが全部解ければ、JOINマスターだ」
>
> 「やってみます！」

---

## ミッション概要

Step 1 で構築した社員管理データベースを使って、以下の8つのミッションをクリアしてください。

### 達成条件

- [ ] 全8ミッションのSQLを正しく書ける
- [ ] 各クエリの結果を確認できる
- [ ] INNER JOIN と LEFT JOIN を適切に使い分けている

---

## Mission 1: 社員と部署の完全一覧

**依頼:** 全社員の名前、役職、部署名、月給を一覧で表示してください。月給の高い順に並べること。

**期待される結果:**

| 社員名 | 役職 | 部署名 | 月給 |
|--------|------|--------|------|
| 田中太郎 | マネージャー | 開発部 | 500000 |
| 高橋美咲 | マネージャー | 営業部 | 480000 |
| ... | ... | ... | ... |

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    e.position AS 役職,
    d.name AS 部署名,
    e.salary AS 月給
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY e.salary DESC;
```

**解説:** employees と departments を department_id で INNER JOIN し、salary の降順で並べます。

</details>

---

## Mission 2: 部署別の給与統計

**依頼:** 各部署の社員数、平均給与、最高給与、最低給与を表示してください。

**期待される結果:**

| 部署名 | 社員数 | 平均給与 | 最高給与 | 最低給与 |
|--------|--------|---------|---------|---------|
| 開発部 | 3 | 443333 | 500000 | 380000 |
| ... | ... | ... | ... | ... |

<details>
<summary>解答</summary>

```sql
SELECT
    d.name AS 部署名,
    COUNT(e.id) AS 社員数,
    ROUND(AVG(e.salary)) AS 平均給与,
    MAX(e.salary) AS 最高給与,
    MIN(e.salary) AS 最低給与
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
GROUP BY d.name
ORDER BY 平均給与 DESC;
```

**解説:** departments を起点に employees をJOINし、GROUP BY で部署ごとに集計しています。ROUND() で平均を整数に丸めています。

</details>

---

## Mission 3: プロジェクトメンバー一覧

**依頼:** 各プロジェクトのメンバー一覧を、プロジェクト名、社員名、プロジェクト内の役割、社員の所属部署名付きで表示してください。

<details>
<summary>解答</summary>

```sql
SELECT
    p.name AS プロジェクト名,
    e.name AS 社員名,
    pm.role AS プロジェクト役割,
    d.name AS 所属部署
FROM project_members pm
INNER JOIN projects p ON pm.project_id = p.id
INNER JOIN employees e ON pm.employee_id = e.id
INNER JOIN departments d ON e.department_id = d.id
ORDER BY p.name, pm.role;
```

**解説:** project_members を起点に、projects, employees, departments の3テーブルをJOINしています。4テーブルの結合です。

</details>

---

## Mission 4: プロジェクト未参加者を探せ

**依頼:** どのプロジェクトにも参加していない社員の名前、役職、部署名を表示してください。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    e.position AS 役職,
    d.name AS 部署名
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
LEFT JOIN project_members pm ON e.id = pm.employee_id
WHERE pm.project_id IS NULL;
```

**解説:** LEFT JOIN で全社員を保持しつつ project_members と結合し、project_id が NULL（=プロジェクトに参加していない）の社員を抽出します。

</details>

---

## Mission 5: 上司と部下の関係一覧

**依頼:** 全社員の名前、上司の名前、所属部署名を一覧で表示してください。上司がいない社員は「トップ」と表示すること。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    COALESCE(m.name, 'トップ') AS 上司名,
    d.name AS 部署名
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
INNER JOIN departments d ON e.department_id = d.id
ORDER BY d.name, e.name;
```

**解説:** 自己結合（LEFT JOIN employees m）で上司情報を取得し、さらに departments をJOINして部署名を取得しています。COALESCE で NULL を「トップ」に変換しています。

</details>

---

## Mission 6: 複数プロジェクトに参加している社員

**依頼:** 2つ以上のプロジェクトに参加している社員の名前と、参加プロジェクト数を表示してください。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    COUNT(pm.project_id) AS 参加プロジェクト数
FROM employees e
INNER JOIN project_members pm ON e.id = pm.employee_id
GROUP BY e.name
HAVING COUNT(pm.project_id) >= 2;
```

**解説:** employees と project_members をJOINし、GROUP BY + HAVING で参加プロジェクト数が2以上の社員を抽出しています。

</details>

---

## Mission 7: プロジェクトなし部署のリスト

**依頼:** プロジェクトが1つも割り当てられていない部署の名前と予算を表示してください。

<details>
<summary>解答</summary>

```sql
SELECT
    d.name AS 部署名,
    d.budget AS 年間予算
FROM departments d
LEFT JOIN projects p ON d.id = p.department_id
WHERE p.id IS NULL;
```

**解説:** departments を起点に projects を LEFT JOIN し、p.id が NULL の部署（=プロジェクトがない部署）を抽出します。人事部が該当します。

</details>

---

## Mission 8: 部署長とプロジェクト一覧

**依頼:** 各部署の部署長（manager_id で指定された社員）の名前と、その部署が担当するプロジェクト一覧を表示してください。

<details>
<summary>解答</summary>

```sql
SELECT
    d.name AS 部署名,
    m.name AS 部署長名,
    COALESCE(p.name, 'なし') AS プロジェクト名,
    COALESCE(p.status, '-') AS 状態
FROM departments d
INNER JOIN employees m ON d.manager_id = m.id
LEFT JOIN projects p ON d.id = p.department_id
ORDER BY d.name;
```

**解説:** departments の manager_id を使って employees（部署長）をJOINし、さらに projects を LEFT JOIN しています。departments.manager_id は employees.id を参照しているため、通常のJOINで部署長の名前を取得できます。

</details>

---

## チャレンジ（上級）

時間に余裕があれば挑戦してみてください。

### チャレンジ: 全情報を結合した一覧

全社員について、以下の情報を1つのクエリで取得してください。
- 社員名、役職、月給
- 所属部署名
- 上司名（いなければ「なし」）
- 参加プロジェクト名（参加していなければ「未参加」）
- プロジェクト内の役割

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    e.position AS 役職,
    e.salary AS 月給,
    d.name AS 部署名,
    COALESCE(m.name, 'なし') AS 上司名,
    COALESCE(p.name, '未参加') AS プロジェクト名,
    COALESCE(pm.role, '-') AS プロジェクト役割
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
LEFT JOIN employees m ON e.manager_id = m.id
LEFT JOIN project_members pm ON e.id = pm.employee_id
LEFT JOIN projects p ON pm.project_id = p.id
ORDER BY e.id;
```

**解説:** 5つのテーブル参照（employees を2回 + departments + project_members + projects）を組み合わせた大規模なJOINです。

</details>

---

## 達成度チェック

| ミッション | テーマ | 完了 |
|-----------|--------|------|
| Mission 1 | INNER JOIN 基本 | [ ] |
| Mission 2 | JOIN + GROUP BY | [ ] |
| Mission 3 | 4テーブルJOIN | [ ] |
| Mission 4 | LEFT JOIN + IS NULL | [ ] |
| Mission 5 | 自己結合 | [ ] |
| Mission 6 | JOIN + HAVING | [ ] |
| Mission 7 | LEFT JOIN + IS NULL | [ ] |
| Mission 8 | 複合JOIN | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| INNER JOIN | 一致するデータのみ結合 |
| LEFT JOIN | 左テーブルを全件保持 |
| 自己結合 | 同じテーブルを異なるエイリアスで結合 |
| IS NULL | 一致しないデータの検出に活用 |
| GROUP BY + HAVING | JOINの結果をグループ集計 |

### チェックリスト
- [ ] 8つのミッションをすべてクリアした
- [ ] INNER JOINとLEFT JOINを使い分けられる
- [ ] 3テーブル以上のJOINを書ける
- [ ] 自己結合を使える

---

## 次のステップへ

おめでとうございます。JOINの主要パターンを実践できました。
次のセクションで理解度チェックを行い、Step 2 の仕上げをしましょう。

---

*推定所要時間: 90分*
