# Pythonのデータ構造

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 4
subStep: 2
title: "Pythonのデータ構造"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "サブ開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「Pythonが強いのはデータ処理だ」田中先輩が言った。
>
> 「list、dict、set... これらのデータ構造と、
> リスト内包表記という書き方を覚えれば、
> TypeScriptの配列操作より短いコードでデータ処理ができる」

---

## list（リスト）

TypeScriptの配列 `Array` に相当します。

```python
# リストの作成
fruits: list[str] = ["apple", "banana", "cherry"]
numbers: list[int] = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]  # 異なる型も入る（推奨しない）

# 基本操作
fruits.append("date")          # 末尾に追加
fruits.insert(0, "avocado")   # 先頭に追加
removed = fruits.pop()         # 末尾から取り出し
fruits.remove("banana")        # 値を指定して削除

# アクセス
print(fruits[0])    # 先頭
print(fruits[-1])   # 末尾
print(fruits[1:3])  # スライス（インデックス1〜2）

# 検索
print("apple" in fruits)      # True
print(fruits.index("cherry"))  # インデックスを取得
print(len(fruits))             # 要素数

# ソート
numbers.sort()                 # 昇順（元のリストを変更）
numbers.sort(reverse=True)     # 降順
sorted_nums = sorted(numbers)  # 新しいリストを返す（元は変更しない）
```

---

## dict（辞書）

TypeScriptのオブジェクト / `Record<K, V>` に相当します。

```python
# 辞書の作成
user: dict[str, str | int] = {
    "name": "田中太郎",
    "age": 28,
    "department": "開発部",
}

# アクセス
print(user["name"])           # "田中太郎"
print(user.get("role", "なし"))  # キーがなければデフォルト値を返す

# 追加・更新
user["email"] = "tanaka@example.com"  # 追加
user["age"] = 29                       # 更新

# 削除
del user["department"]
age = user.pop("age")  # 取り出して削除

# 繰り返し
for key in user:
    print(f"{key}: {user[key]}")

for key, value in user.items():
    print(f"{key}: {value}")

# キーの存在チェック
if "name" in user:
    print(user["name"])

# キーと値の一覧
print(user.keys())    # dict_keys([...])
print(user.values())  # dict_values([...])
```

---

## tuple（タプル）

変更不可（イミュータブル）なリストです。TypeScriptのタプル型に相当します。

```python
# タプルの作成
point: tuple[int, int] = (10, 20)
rgb: tuple[int, int, int] = (255, 128, 0)

# アクセス
print(point[0])  # 10
print(point[1])  # 20

# アンパック（分割代入）
x, y = point
r, g, b = rgb

# 関数から複数の値を返す
def divide(a: int, b: int) -> tuple[int, int]:
    return a // b, a % b  # 商と余り

quotient, remainder = divide(10, 3)
print(f"商: {quotient}, 余り: {remainder}")  # "商: 3, 余り: 1"

# タプルは変更不可
# point[0] = 30  # エラー！
```

---

## set（集合）

重複のない要素の集まりです。

```python
# セットの作成
colors: set[str] = {"red", "green", "blue"}
numbers: set[int] = {1, 2, 3, 4, 5}

# 追加・削除
colors.add("yellow")
colors.discard("red")  # 存在しなくてもエラーにならない

# 集合演算
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

print(a & b)   # 積集合: {4, 5}
print(a | b)   # 和集合: {1, 2, 3, 4, 5, 6, 7, 8}
print(a - b)   # 差集合: {1, 2, 3}

# 重複除去に便利
names = ["田中", "佐藤", "田中", "鈴木", "佐藤"]
unique_names = list(set(names))  # ["田中", "佐藤", "鈴木"]
```

---

## リスト内包表記（List Comprehension）

TypeScriptの `map`/`filter` をPythonらしく書く方法です。

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map: 各要素を変換
doubled = [n * 2 for n in numbers]
# [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

# filter: 条件で絞り込み
evens = [n for n in numbers if n % 2 == 0]
# [2, 4, 6, 8, 10]

# map + filter: 変換と絞り込みを同時に
even_doubled = [n * 2 for n in numbers if n % 2 == 0]
# [4, 8, 12, 16, 20]
```

### TypeScriptとの比較

```typescript
// TypeScript
const doubled = numbers.map((n) => n * 2);
const evens = numbers.filter((n) => n % 2 === 0);
const evenDoubled = numbers.filter((n) => n % 2 === 0).map((n) => n * 2);
```

```python
# Python
doubled = [n * 2 for n in numbers]
evens = [n for n in numbers if n % 2 == 0]
even_doubled = [n * 2 for n in numbers if n % 2 == 0]
```

### 辞書内包表記

```python
# 辞書内包表記
users = [
    {"name": "田中", "age": 28},
    {"name": "佐藤", "age": 35},
    {"name": "鈴木", "age": 22},
]

# 名前をキー、年齢を値とする辞書
name_age = {u["name"]: u["age"] for u in users}
# {"田中": 28, "佐藤": 35, "鈴木": 22}
```

---

## ジェネレータ式

大量データを扱う時に、メモリを節約できる仕組みです。

```python
# リスト内包表記: 全てメモリに格納
squares_list = [n ** 2 for n in range(1000000)]  # メモリをたくさん使う

# ジェネレータ式: 必要な時に1つずつ生成
squares_gen = (n ** 2 for n in range(1000000))  # メモリを節約

# ジェネレータは for ループで使える
for square in squares_gen:
    if square > 100:
        break
    print(square)

# sum, max, min と組み合わせる
total = sum(n ** 2 for n in range(100))
```

---

## 実践: データ処理

```python
# 売上データの分析
sales = [
    {"product": "Widget A", "quantity": 10, "price": 1500, "region": "東京"},
    {"product": "Widget B", "quantity": 5, "price": 2000, "region": "大阪"},
    {"product": "Widget A", "quantity": 8, "price": 1500, "region": "東京"},
    {"product": "Widget C", "quantity": 3, "price": 3000, "region": "名古屋"},
]

# 合計売上
total = sum(s["quantity"] * s["price"] for s in sales)
print(f"合計: {total:,}円")

# 東京の売上だけ
tokyo_sales = [s for s in sales if s["region"] == "東京"]

# 商品別集計
from collections import Counter
products = Counter(s["product"] for s in sales)
print(products)  # Counter({"Widget A": 2, "Widget B": 1, "Widget C": 1})

# 地域別合計
region_totals: dict[str, int] = {}
for s in sales:
    region = s["region"]
    revenue = s["quantity"] * s["price"]
    region_totals[region] = region_totals.get(region, 0) + revenue
print(region_totals)
```

---

## まとめ

| データ構造 | TypeScript相当 | 特徴 |
|-----------|---------------|------|
| list | Array | 順序あり、変更可能 |
| dict | Object/Record | キーと値のペア |
| tuple | Tuple型 | 変更不可、固定長 |
| set | Set | 重複なし |
| 内包表記 | map/filter | Pythonらしい簡潔な書き方 |

### チェックリスト

- [ ] list の基本操作（append, pop, slice）を使える
- [ ] dict でキーと値を操作できる
- [ ] tuple で複数の値を返す関数を書ける
- [ ] リスト内包表記で map/filter 相当の処理を書ける
- [ ] TypeScriptのデータ構造との対応を理解した

---

## 次のステップへ

Pythonのデータ構造を学びました。

次のセクションでは、**他人のコードを読む技術**を学びます。
TypeScriptとPythonの両方で、既存のコードベースを効率的に理解する方法を身につけましょう。

---

*推定読了時間: 30分*
