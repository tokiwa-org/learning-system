# ANDとORで条件を組み合わせよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 3
subStep: 3
title: "ANDとORで条件を組み合わせよう"
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

> 「開発部で、かつ給料が35万以上の社員ってどうやって調べるんですか？」
>
> 「いい質問だね。条件を組み合わせるには AND と OR を使うよ」
>
> 「ANDは"かつ"、ORは"または"ですか？」
>
> 「そのとおり！さらに IN を使うと、複数の値をスッキリ書けるんだ」

---

## AND（かつ）

**両方の条件を満たす**データだけを取り出します。

### 構文

```sql
SELECT * FROM テーブル WHERE 条件1 AND 条件2;
```

### 開発部で、かつ給料が35万以上の社員

```sql
SELECT * FROM employees WHERE department = '開発部' AND salary >= 350000;
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
3  | 鈴木一郎 | 開発部     | 400000
```

> 開発部だけど給料35万未満の人は除外されます。両方の条件を満たす行だけが返ります。

### ANDのイメージ

```
全社員（5人）
  ┃
  ┃  条件1: department = '開発部'  → 田中、鈴木
  ┃  条件2: salary >= 350000      → 田中、佐藤、鈴木
  ┃
  ┃  AND = 両方を満たす
  ▼
結果（2人）→ 田中、鈴木
```

---

## OR（または）

**どちらかの条件を満たす**データを取り出します。

### 構文

```sql
SELECT * FROM テーブル WHERE 条件1 OR 条件2;
```

### 開発部または営業部の社員

```sql
SELECT * FROM employees WHERE department = '開発部' OR department = '営業部';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
2  | 佐藤花子 | 営業部     | 320000
3  | 鈴木一郎 | 開発部     | 400000
5  | 伊藤健太 | 営業部     | 280000
```

### ORのイメージ

```
全社員（5人）
  ┃
  ┃  条件1: department = '開発部'  → 田中、鈴木
  ┃  条件2: department = '営業部'  → 佐藤、伊藤
  ┃
  ┃  OR = どちらかを満たす
  ▼
結果（4人）→ 田中、佐藤、鈴木、伊藤
```

---

## NOT（否定）

条件を **反転** させます。

### 構文

```sql
SELECT * FROM テーブル WHERE NOT 条件;
```

### 人事部以外の社員

```sql
SELECT * FROM employees WHERE NOT department = '人事部';
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
2  | 佐藤花子 | 営業部     | 320000
3  | 鈴木一郎 | 開発部     | 400000
5  | 伊藤健太 | 営業部     | 280000
```

> `NOT department = '人事部'` は `department != '人事部'` と同じ結果です。

---

## ANDとORの組み合わせ（括弧の重要性）

### 注意: ANDはORより優先される

```sql
-- 意図しない結果になるかも！
SELECT * FROM employees
WHERE department = '開発部' OR department = '営業部' AND salary >= 350000;
```

この場合、SQLは以下のように解釈します：

```
department = '開発部'
  OR
(department = '営業部' AND salary >= 350000)
```

つまり「開発部の全員」または「営業部で35万以上の人」という意味になります。

### 括弧で意図を明確にする

```sql
-- 「開発部または営業部」で、かつ「給料35万以上」
SELECT * FROM employees
WHERE (department = '開発部' OR department = '営業部') AND salary >= 350000;
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
3  | 鈴木一郎 | 開発部     | 400000
```

### 優先順位のまとめ

| 優先度 | 演算子 | 意味 |
|--------|--------|------|
| 高い | NOT | 否定 |
| 中 | AND | かつ |
| 低い | OR | または |

> 迷ったら **括弧 `()` を使う** のが安全です。可読性も上がります。

---

## IN演算子（ORの省略形）

複数の値と一致するかを調べるとき、`OR` を何度も書く代わりに `IN` が使えます。

### 構文

```sql
SELECT * FROM テーブル WHERE カラム IN (値1, 値2, 値3);
```

### ORで書いた場合

```sql
SELECT * FROM employees
WHERE department = '開発部' OR department = '営業部';
```

### INで書いた場合（同じ結果）

```sql
SELECT * FROM employees
WHERE department IN ('開発部', '営業部');
```

実行結果（どちらも同じ）：

```
id | name     | department | salary
---+----------+------------+-------
1  | 田中太郎 | 開発部     | 350000
2  | 佐藤花子 | 営業部     | 320000
3  | 鈴木一郎 | 開発部     | 400000
5  | 伊藤健太 | 営業部     | 280000
```

### INのメリット

- コードが短く読みやすい
- 値が増えても `IN (値1, 値2, 値3, 値4)` と追加するだけ
- `NOT IN` で「含まれない」も表現可能

### NOT IN

```sql
-- 開発部と営業部以外の社員
SELECT * FROM employees
WHERE department NOT IN ('開発部', '営業部');
```

実行結果：

```
id | name     | department | salary
---+----------+------------+-------
4  | 高橋美咲 | 人事部     | 300000
```

---

## ハンズオン

### 練習1: AND を使う

```sql
-- 電子機器カテゴリで価格が1万円以上の商品
SELECT * FROM products WHERE category = '電子機器' AND price >= 10000;
```

### 練習2: OR を使う

```sql
-- 価格が5万円以上、または在庫が50以上の商品
SELECT * FROM products WHERE price >= 50000 OR stock >= 50;
```

### 練習3: IN を使う

```sql
-- 開発部・営業部の社員の名前と部署を表示
SELECT name, department FROM employees
WHERE department IN ('開発部', '営業部');
```

### 練習4: 括弧を使う

```sql
-- 電子機器または家具で、かつ価格が3万円以上の商品
SELECT * FROM products
WHERE (category = '電子機器' OR category = '家具') AND price >= 30000;
```

<details>
<summary>練習4の期待される結果</summary>

```
id | name     | category | price | stock
---+----------+----------+-------+------
1  | ノートPC | 電子機器 | 89000 | 15
3  | デスク   | 家具     | 35000 | 8
4  | チェア   | 家具     | 45000 | 12
5  | モニター | 電子機器 | 32000 | 20
```

</details>

### 練習5: NOT IN を使う

```sql
-- 電子機器以外の商品
SELECT name, category, price FROM products
WHERE category NOT IN ('電子機器');
```

---

## まとめ

| 演算子 | 意味 | 使用例 |
|--------|------|--------|
| `AND` | かつ（両方満たす） | `WHERE dept = '開発部' AND salary >= 350000` |
| `OR` | または（どちらか） | `WHERE dept = '開発部' OR dept = '営業部'` |
| `NOT` | 否定（条件を反転） | `WHERE NOT dept = '人事部'` |
| `IN` | いずれかに一致 | `WHERE dept IN ('開発部', '営業部')` |
| `NOT IN` | いずれにも一致しない | `WHERE dept NOT IN ('人事部')` |
| `()` | 優先順位を明示 | `WHERE (A OR B) AND C` |

### チェックリスト

- [ ] ANDで複数条件を組み合わせられた
- [ ] ORでどちらかの条件を指定できた
- [ ] ANDがORより優先されることを理解した
- [ ] 括弧で優先順位を制御できた
- [ ] IN演算子で複数の値を簡潔に書けた

---

## 次のステップへ

ANDとORの組み合わせはマスターできましたか？

次のセクションでは、`LIKE` でパターン検索、`BETWEEN` で範囲指定を学びます。
「名前に"藤"がつく社員」や「価格が1万円から5万円の商品」を検索できるようになりますよ！

---

*推定読了時間: 30分*
