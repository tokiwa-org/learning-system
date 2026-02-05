# 演習：SELECTでデータを取り出そう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 2
subStep: 5
title: "演習：SELECTでデータを取り出そう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「先輩からデータの取得を頼まれた」
>
> 「いくつかのデータを調べて欲しいんだけど、お願いできる？」
>
> 「やってみます！」
>
> 「いいね。まずは簡単なものから始めて、だんだん難しくしていくよ。SQLiteで `practice.db` を開いてね」

---

## ミッション概要

先輩から頼まれたデータ取得タスクを8つこなしてください。

### 準備

```bash
sqlite3 practice.db
```

```sql
.mode column
.headers on
```

### 達成条件

- [ ] 8つのミッションすべてをクリアした
- [ ] 各ミッションで正しい出力が得られた
- [ ] SQL文を自分で書けた

---

## Mission 1: employeesテーブルの全データを表示

**依頼内容**: 社員テーブルの全データを見せてほしい。

<details>
<summary>ヒント（クリックで表示）</summary>

すべてのカラムを取り出すには `*` を使います。

</details>

<details>
<summary>答え（クリックで表示）</summary>

```sql
SELECT * FROM employees;
```

出力：
```
id  name      department  salary
--  --------  ----------  ------
1   田中太郎  開発部      350000
2   佐藤花子  営業部      320000
3   鈴木一郎  開発部      400000
4   高橋美咲  人事部      300000
5   伊藤健太  営業部      280000
```

</details>

---

## Mission 2: 社員の名前と部署だけを表示

**依頼内容**: 社員の名前と所属部署の一覧を作ってほしい。IDや給料は要らない。

<details>
<summary>ヒント（クリックで表示）</summary>

必要なカラムだけをカンマ区切りで指定します。

</details>

<details>
<summary>答え（クリックで表示）</summary>

```sql
SELECT name, department FROM employees;
```

出力：
```
name      department
--------  ----------
田中太郎  開発部
佐藤花子  営業部
鈴木一郎  開発部
高橋美咲  人事部
伊藤健太  営業部
```

</details>

---

## Mission 3: productsテーブルの全データを表示

**依頼内容**: 商品テーブルの全データも確認したい。

<details>
<summary>ヒント（クリックで表示）</summary>

Mission 1と同じ考え方です。テーブル名を変えましょう。

</details>

<details>
<summary>答え（クリックで表示）</summary>

```sql
SELECT * FROM products;
```

出力：
```
id  name            category  price  stock
--  --------------  --------  -----  -----
1   ノートPC        電子機器  89000  15
2   マウス          電子機器  2500   100
3   デスク          家具      35000  8
4   チェア          家具      45000  12
5   モニター        電子機器  32000  20
6   キーボード      電子機器  8000   50
7   ヘッドセット    電子機器  12000  30
8   ブックシェルフ  家具      18000  5
```

</details>

---

## Mission 4: 商品名と価格を日本語カラム名で表示

**依頼内容**: 商品名と価格の一覧を作ってほしい。カラム名は「商品名」「価格(円)」にして。

<details>
<summary>ヒント（クリックで表示）</summary>

`AS` 句でカラムに別名を付けます。括弧を含む場合はダブルクォーテーションで囲みます。

</details>

<details>
<summary>答え（クリックで表示）</summary>

```sql
SELECT name AS 商品名, price AS "価格(円)" FROM products;
```

出力：
```
商品名          価格(円)
--------------  --------
ノートPC        89000
マウス          2500
デスク          35000
チェア          45000
モニター        32000
キーボード      8000
ヘッドセット    12000
ブックシェルフ  18000
```

</details>

---

## Mission 5: 社員がいる部署の一覧を重複なしで表示

**依頼内容**: うちの会社にはどんな部署があるか知りたい。重複なしの一覧をお願い。

<details>
<summary>ヒント（クリックで表示）</summary>

重複を除くには `DISTINCT` を使います。

</details>

<details>
<summary>答え（クリックで表示）</summary>

```sql
SELECT DISTINCT department FROM employees;
```

出力：
```
department
----------
開発部
営業部
人事部
```

</details>

---

## Mission 6: 商品カテゴリの一覧を重複なしで表示

**依頼内容**: 商品のカテゴリにはどんな種類があるか一覧にして。

<details>
<summary>ヒント（クリックで表示）</summary>

Mission 5と同じ考え方です。テーブルとカラムを変えましょう。

</details>

<details>
<summary>答え（クリックで表示）</summary>

```sql
SELECT DISTINCT category FROM products;
```

出力：
```
category
--------
電子機器
家具
```

</details>

---

## Mission 7: 商品カテゴリの数を数える

**依頼内容**: カテゴリが全部で何種類あるか数えてほしい。

<details>
<summary>ヒント（クリックで表示）</summary>

`COUNT` と `DISTINCT` を組み合わせます。`COUNT(DISTINCT カラム名)` です。

</details>

<details>
<summary>答え（クリックで表示）</summary>

```sql
SELECT COUNT(DISTINCT category) FROM products;
```

出力：
```
COUNT(DISTINCT category)
------------------------
2
```

</details>

---

## Mission 8 (Challenge): 社員テーブルを日本語カラム名で見やすく表示

**依頼内容**: 社員テーブルの全データを日本語のカラム名で表示してほしい。以下のカラム名にして。

| 元のカラム名 | 表示名 |
|-------------|--------|
| id | 社員番号 |
| name | 氏名 |
| department | 所属部署 |
| salary | 月給 |

<details>
<summary>ヒント（クリックで表示）</summary>

すべてのカラムに `AS` を使います。SQL文が長くなるので、改行して書くと見やすいです。

</details>

<details>
<summary>答え（クリックで表示）</summary>

```sql
SELECT
    id AS 社員番号,
    name AS 氏名,
    department AS 所属部署,
    salary AS 月給
FROM employees;
```

出力：
```
社員番号  氏名      所属部署  月給
--------  --------  --------  ------
1         田中太郎  開発部    350000
2         佐藤花子  営業部    320000
3         鈴木一郎  開発部    400000
4         高橋美咲  人事部    300000
5         伊藤健太  営業部    280000
```

</details>

---

## 達成度チェック

### クリア数で判定

| クリア数 | 判定 |
|----------|------|
| 8問（全問） | 完璧！SELECT文マスター |
| 6-7問 | 合格！基本はバッチリ |
| 4-5問 | もう少し！レッスンを復習しよう |
| 3問以下 | Step 2のレッスンを再確認しよう |

### スキルチェックリスト

- [ ] `SELECT *` で全データを取り出せた
- [ ] カラムを指定してデータを取り出せた
- [ ] `AS` 句でカラム名にエイリアスを付けられた
- [ ] スペースや記号を含むエイリアスを作れた
- [ ] `DISTINCT` で重複を除いた一覧を取得できた
- [ ] `COUNT(DISTINCT ...)` で種類の数を数えられた

---

## 復習ポイント

もし難しかった問題があれば、以下のレッスンを復習してください。

| ミッション | 復習セクション |
|-----------|---------------|
| Mission 1, 3 | Step 2-1: SELECT文の基本 |
| Mission 2 | Step 2-2: カラムを指定して取り出そう |
| Mission 4, 8 | Step 2-3: AS句でカラム名を変えよう |
| Mission 5, 6, 7 | Step 2-4: DISTINCTで重複を除こう |

---

## まとめ

この演習で実践したこと：

| 操作 | SQL文 |
|------|-------|
| 全データ取得 | `SELECT * FROM テーブル名;` |
| カラム指定 | `SELECT カラム1, カラム2 FROM テーブル名;` |
| エイリアス | `SELECT カラム名 AS 別名 FROM テーブル名;` |
| 重複除外 | `SELECT DISTINCT カラム名 FROM テーブル名;` |
| 種類数カウント | `SELECT COUNT(DISTINCT カラム名) FROM テーブル名;` |

### 重要なポイント

1. **SELECT文はSQLの基本中の基本**
2. **必要なカラムだけ取り出す**のが実務の基本
3. **AS句で見やすい名前を付ける**と相手に伝わりやすい
4. **DISTINCT**で重複なしの一覧を素早く作れる

---

## 次のステップへ

おめでとうございます！SELECT文の基本操作をマスターしました。

次のセクションでは、ここまでの理解度を確認するチェックポイントです。
クイズに挑戦して、学んだことを振り返りましょう。

---

*推定所要時間: 90分*
