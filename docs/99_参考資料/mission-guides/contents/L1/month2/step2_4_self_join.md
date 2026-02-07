# 自己結合を理解しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 2
subStep: 4
title: "自己結合を理解しよう"
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

> 「組織図を作りたいから、各社員の上司の名前を一覧で出してくれない？」
>
> 「上司の名前...employees テーブルには manager_id しかないです。departments テーブルとJOINしても上司の名前は取れないですよね？」
>
> 「そう。manager_id は employees テーブル自身の id を参照している。だから...」
>
> 「え、同じテーブル同士をJOINするんですか？」
>
> 「それを自己結合（Self JOIN）と呼ぶ。ちょっと頭がこんがらがるけど、エイリアスを使えば大丈夫だ」

---

## 自己結合（Self JOIN）とは

自己結合は、**同じテーブルを異なるエイリアスで2回参照して結合する**テクニックです。

### なぜ必要？

`employees` テーブルには以下のデータがあります。

| id | name | manager_id |
|----|------|-----------|
| 1 | 田中太郎 | NULL |
| 2 | 佐藤花子 | 1 |
| 3 | 鈴木一郎 | 1 |

佐藤花子の `manager_id = 1` は、田中太郎の `id = 1` を指しています。
しかし、1つのSELECT文では「佐藤花子」と「田中太郎」を同時に参照できません。

**自己結合を使えば、同じテーブルを「社員テーブル」と「上司テーブル」の2つとして扱えます。**

---

## 自己結合の構文

```sql
SELECT
    e.name AS 社員名,
    m.name AS 上司名
FROM employees e              -- 「社員」としての employees
LEFT JOIN employees m          -- 「上司」としての employees
ON e.manager_id = m.id;
```

**ポイント:**
- `employees e` は「社員」を表す
- `employees m` は「上司（Manager）」を表す
- 同じテーブルだが、エイリアスが違うので別のテーブルとして扱える

---

## 実践例

### 例1: 社員と上司の一覧

```sql
SELECT
    e.name AS 社員名,
    e.position AS 役職,
    COALESCE(m.name, 'なし（トップ）') AS 上司名
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

**結果:**

| 社員名 | 役職 | 上司名 |
|--------|------|--------|
| 田中太郎 | マネージャー | なし（トップ） |
| 佐藤花子 | シニアエンジニア | 田中太郎 |
| 鈴木一郎 | エンジニア | 田中太郎 |
| 高橋美咲 | マネージャー | なし（トップ） |
| 伊藤健太 | 営業担当 | 高橋美咲 |
| 渡辺直美 | 営業担当 | 高橋美咲 |
| 山田花子 | マネージャー | なし（トップ） |
| 中村大輔 | 人事担当 | 山田花子 |
| 小林さくら | マネージャー | なし（トップ） |
| 加藤翔太 | マーケター | 小林さくら |

> `manager_id` が NULL のマネージャーは、LEFT JOIN により上司がNULL → COALESCE で「なし（トップ）」と表示されます。

### 例2: 各マネージャーの部下数

```sql
SELECT
    m.name AS マネージャー名,
    COUNT(e.id) AS 部下数
FROM employees e
INNER JOIN employees m ON e.manager_id = m.id
GROUP BY m.name;
```

**結果:**

| マネージャー名 | 部下数 |
|---------------|--------|
| 田中太郎 | 2 |
| 高橋美咲 | 2 |
| 山田花子 | 1 |
| 小林さくら | 1 |

### 例3: 上司より給与が高い社員を探す

```sql
SELECT
    e.name AS 社員名,
    e.salary AS 社員の給与,
    m.name AS 上司名,
    m.salary AS 上司の給与
FROM employees e
INNER JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

> 通常は上司のほうが給与が高いですが、もしそうでない場合を検出できます。この例では該当者はいませんが、データの異常検知に使えるパターンです。

---

## 自己結合 + 他テーブルの結合

自己結合と通常のJOINを組み合わせることもできます。

```sql
-- 社員名、上司名、部署名を一度に取得
SELECT
    e.name AS 社員名,
    COALESCE(m.name, '-') AS 上司名,
    d.name AS 部署名
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
INNER JOIN departments d ON e.department_id = d.id
ORDER BY d.name, e.name;
```

**結果:**

| 社員名 | 上司名 | 部署名 |
|--------|--------|--------|
| 佐藤花子 | 田中太郎 | 開発部 |
| 鈴木一郎 | 田中太郎 | 開発部 |
| 田中太郎 | - | 開発部 |
| 伊藤健太 | 高橋美咲 | 営業部 |
| 高橋美咲 | - | 営業部 |
| 渡辺直美 | 高橋美咲 | 営業部 |
| 中村大輔 | 山田花子 | 人事部 |
| 山田花子 | - | 人事部 |
| 加藤翔太 | 小林さくら | マーケティング部 |
| 小林さくら | - | マーケティング部 |

---

## 自己結合の考え方のコツ

自己結合は最初混乱しやすいですが、以下のように考えると理解しやすくなります。

### 1. テーブルのコピーをイメージする

```
employees テーブル（社員として）  employees テーブル（上司として）
+----+----------+------------+    +----+----------+
| id | name     | manager_id |    | id | name     |
+----+----------+------------+    +----+----------+
| 1  | 田中太郎 | NULL       |    | 1  | 田中太郎 |
| 2  | 佐藤花子 | 1          |--->| 1  | 田中太郎 |
| 3  | 鈴木一郎 | 1          |--->| 1  | 田中太郎 |
+----+----------+------------+    +----+----------+
```

### 2. エイリアスの名前を意味のあるものにする

```sql
-- 悪い例（何の役割かわからない）
FROM employees a JOIN employees b

-- 良い例（役割が明確）
FROM employees e JOIN employees m  -- e=employee, m=manager
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 自己結合 | 同じテーブルを異なるエイリアスで2回参照して結合 |
| 用途 | 階層構造（上司-部下）や同一テーブル内の比較 |
| エイリアス | 役割がわかる名前をつける（e=社員, m=マネージャー） |
| LEFT JOIN | 上司がいない社員（manager_id = NULL）も含める場合 |
| 組み合わせ | 自己結合と他テーブルのJOINは同時に使える |

### チェックリスト
- [ ] 自己結合の構文を書ける
- [ ] なぜ自己結合が必要かを説明できる
- [ ] エイリアスを使って読みやすいクエリを書ける
- [ ] 自己結合と他のJOINを組み合わせられる

---

## 次のステップへ

自己結合まで学び、JOINの主要なパターンを網羅しました。
次のセクションでは、学んだJOINを総動員する実践演習に挑戦します。

---

*推定読了時間: 30分*
