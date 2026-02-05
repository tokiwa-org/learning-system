# ORDER BYで並び替えよう

## メタ情報

```yaml
mission: "データベースの扉を開こう"
step: 5
subStep: 1
title: "ORDER BYで並び替えよう"
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

> 「先輩、給料が高い順に社員を表示したいんですけど...」
>
> 「ORDER BYを使えば並び替えられるよ」
>
> 「オーダーバイ？注文？」
>
> 「"順序を指定する"って意味だね。昇順・降順、自由自在に並べ替えられるんだ」

---

## ORDER BY句とは

`ORDER BY` = **取り出したデータを指定した順序で並び替える**ための句です。

### 例え話

ORDER BYは「並び替えルール」のようなもの。

- 名簿を「名前のあいうえお順」にする
- 商品を「価格の安い順」にする
- 成績を「点数の高い順」にする

これらはすべてORDER BYで実現できます。

---

## 基本構文

```sql
SELECT カラム名 FROM テーブル名 ORDER BY カラム名;
```

| 要素 | 意味 |
|------|------|
| `ORDER BY` | 「〜の順に並べる」という指定 |
| `カラム名` | 並び替えの基準にするカラム |

---

## 昇順（ASC）で並べる

**ASC** = Ascending（アセンディング）= **昇順**（小さい順）

```sql
SELECT * FROM employees ORDER BY salary ASC;
```

実行結果：

```
id  name      department  salary
--  --------  ----------  ------
5   伊藤健太  営業部      280000
6   山田次郎  開発部      290000
4   高橋美咲  人事部      300000
7   中村美月  営業部      310000
2   佐藤花子  営業部      320000
8   小林大輔  人事部      330000
1   田中太郎  開発部      350000
3   鈴木一郎  開発部      400000
```

給料が **少ない順** に並びました。

### ポイント

ASCは**デフォルト**（初期値）なので、省略できます。

```sql
-- この2つは同じ結果になる
SELECT * FROM employees ORDER BY salary ASC;
SELECT * FROM employees ORDER BY salary;
```

---

## 降順（DESC）で並べる

**DESC** = Descending（ディセンディング）= **降順**（大きい順）

```sql
SELECT * FROM employees ORDER BY salary DESC;
```

実行結果：

```
id  name      department  salary
--  --------  ----------  ------
3   鈴木一郎  開発部      400000
1   田中太郎  開発部      350000
8   小林大輔  人事部      330000
2   佐藤花子  営業部      320000
7   中村美月  営業部      310000
4   高橋美咲  人事部      300000
6   山田次郎  開発部      290000
5   伊藤健太  営業部      280000
```

給料が **多い順** に並びました。

> 覚え方: **DESC = でかい順**（Descending のDで「でかい」）

---

## 複数カラムで並び替え

複数のカラムを指定すると、1番目のカラムが同じ値の場合に2番目のカラムで並べ替えます。

```sql
SELECT * FROM employees ORDER BY department, salary DESC;
```

実行結果：

```
id  name      department  salary
--  --------  ----------  ------
3   鈴木一郎  開発部      400000
1   田中太郎  開発部      350000
6   山田次郎  開発部      290000
2   佐藤花子  営業部      320000
7   中村美月  営業部      310000
5   伊藤健太  営業部      280000
8   小林大輔  人事部      330000
4   高橋美咲  人事部      300000
```

1. まず `department` で昇順に並べる（デフォルトASC）
2. 同じ部署内では `salary` で降順（DESC）に並べる

---

## ORDER BY + WHERE

WHEREで絞り込んだ結果を、ORDER BYで並び替えることもできます。

```sql
SELECT * FROM employees WHERE department = '開発部' ORDER BY salary DESC;
```

実行結果：

```
id  name      department  salary
--  --------  ----------  ------
3   鈴木一郎  開発部      400000
1   田中太郎  開発部      350000
6   山田次郎  開発部      290000
```

> **構文の順番**: `SELECT → FROM → WHERE → ORDER BY` の順で書きます。

---

## カラム番号での指定（参考）

SELECT句で指定したカラムの番号でも並び替えられます。

```sql
SELECT name, salary FROM employees ORDER BY 2 DESC;
```

`2` は SELECT句の2番目のカラム（salary）を意味します。

> ただし、この書き方は**非推奨**です。カラムの順番が変わると意味が変わってしまうため、
> **カラム名を直接指定する方が安全**で読みやすいです。

---

## ハンズオン

SQLiteを起動して、以下のSQLを実行してみましょう。

```sql
-- 1. 表示設定（まだの場合）
.mode column
.headers on

-- 2. 社員を給料の安い順に並べる
SELECT * FROM employees ORDER BY salary;

-- 3. 社員を給料の高い順に並べる
SELECT * FROM employees ORDER BY salary DESC;

-- 4. 商品を価格の安い順に並べる
SELECT * FROM products ORDER BY price;

-- 5. 商品を価格の高い順に並べる
SELECT * FROM products ORDER BY price DESC;

-- 6. 商品をカテゴリ順、その中で価格の高い順に並べる
SELECT * FROM products ORDER BY category, price DESC;

-- 7. 営業部の社員を給料の高い順に並べる
SELECT * FROM employees WHERE department = '営業部' ORDER BY salary DESC;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ORDER BY | データを並び替える句 |
| ASC（昇順） | 小さい順。デフォルトなので省略可能 |
| DESC（降順） | 大きい順。明示的に指定が必要 |
| 複数カラム指定 | `ORDER BY カラム1, カラム2 DESC` のように書く |
| WHEREとの併用 | `WHERE → ORDER BY` の順番で書く |

### チェックリスト

- [ ] ORDER BY句の役割を理解できた
- [ ] ASC（昇順）とDESC（降順）の違いを理解できた
- [ ] 複数カラムでの並び替えができた
- [ ] WHEREとORDER BYを組み合わせて使えた

---

## 次のステップへ

ORDER BYで並び替えができるようになりましたね。

次のセクションでは、LIMITを使って「上位3件だけ」のように件数を制限する方法を学びます。
ORDER BYと組み合わせると「トップ3」が簡単に出せますよ！

---

*推定読了時間: 30分*
