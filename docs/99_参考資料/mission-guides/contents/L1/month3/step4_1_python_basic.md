# Pythonの基本を学ぼう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 4
subStep: 1
title: "Pythonの基本を学ぼう"
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

> 「今日はPythonを触ってもらう」
>
> 田中先輩はプロジェクトのリポジトリを開いた。
>
> 「えっ、TypeScriptを学んでいたのに、もう別の言語ですか？」
>
> 「実務ではね、1つの言語だけで完結することはほぼない。
> データ処理スクリプトはPython、WebアプリはTypeScript、インフラはShell...
> **複数言語を使い分けられるエンジニア**が求められるんだ」
>
> 「TypeScriptを知っていればPythonは簡単に理解できる。構文が違うだけで考え方は同じだ」

---

## TypeScriptとPythonの対照表

| 特徴 | TypeScript | Python |
|------|-----------|--------|
| 型 | 静的型付け | 動的型付け（型ヒントあり） |
| ブロック | `{ }` | インデント |
| セミコロン | あり | なし |
| 変数宣言 | `const` / `let` | 代入するだけ |
| 実行 | `ts-node file.ts` | `python file.py` |

---

## 変数と基本型

```python
# 変数宣言（型宣言なしで代入するだけ）
name = "田中太郎"
age = 28
is_active = True
price = 1980.5

# 型ヒント（推奨: TypeScriptの型注釈に相当）
name: str = "田中太郎"
age: int = 28
is_active: bool = True
price: float = 1980.5

# 定数（慣習的にUPPER_SNAKE_CASE、実際には変更可能）
MAX_RETRIES = 3
API_URL = "https://api.example.com"
```

### TypeScriptとの比較

```typescript
// TypeScript
const name: string = "田中太郎";
const age: number = 28;
const isActive: boolean = true;
```

```python
# Python
name: str = "田中太郎"
age: int = 28
is_active: bool = True  # True/False は大文字で始まる
```

---

## f-string（フォーマット文字列）

TypeScriptのテンプレートリテラルに相当します。

```python
name = "田中"
age = 28

# f-string（推奨）
message = f"こんにちは、{name}さん。{age}歳ですね。"
print(message)  # "こんにちは、田中さん。28歳ですね。"

# 式の埋め込み
price = 1980
print(f"税込: {int(price * 1.1)}円")  # "税込: 2178円"

# フォーマット指定
pi = 3.14159
print(f"円周率: {pi:.2f}")  # "円周率: 3.14"
print(f"金額: {price:,}円")  # "金額: 1,980円"
```

---

## 関数

```python
# 基本的な関数
def add(a: int, b: int) -> int:
    return a + b

result = add(3, 5)
print(result)  # 8

# 戻り値なしの関数
def greet(name: str) -> None:
    print(f"こんにちは、{name}さん")

# デフォルト引数
def create_user(name: str, role: str = "viewer") -> dict:
    return {"name": name, "role": role}

user1 = create_user("田中")            # {"name": "田中", "role": "viewer"}
user2 = create_user("佐藤", "admin")   # {"name": "佐藤", "role": "admin"}

# キーワード引数
user3 = create_user(name="鈴木", role="editor")
```

### TypeScriptとの比較

```typescript
// TypeScript
function add(a: number, b: number): number {
  return a + b;
}

function createUser(name: string, role: string = "viewer"): object {
  return { name, role };
}
```

```python
# Python
def add(a: int, b: int) -> int:
    return a + b

def create_user(name: str, role: str = "viewer") -> dict:
    return {"name": name, "role": role}
```

---

## 条件分岐

```python
age = 20

# if-elif-else（TypeScriptの if-else if-else に相当）
if age >= 20:
    print("成人です")
elif age >= 13:
    print("ティーンエイジャーです")
else:
    print("子供です")

# 三項演算子
status = "成人" if age >= 20 else "未成年"

# 真偽値の判定
name = ""
if not name:  # 空文字列は False
    print("名前が未入力です")
```

> **Pythonの Falsy な値**: `False`, `None`, `0`, `""`, `[]`, `{}`, `()`

---

## ループ

```python
# for ループ
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# インデックス付き
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# range
for i in range(5):      # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):   # 1, 2, 3, 4, 5
    print(i)

# while ループ
count = 0
while count < 5:
    print(count)
    count += 1
```

---

## 文字列操作

```python
text = "Hello, Python World!"

# 基本操作
print(len(text))               # 20
print(text.upper())            # "HELLO, PYTHON WORLD!"
print(text.lower())            # "hello, python world!"
print(text.strip())            # 空白除去
print(text.replace("Python", "TypeScript"))

# 検索
print("Python" in text)        # True
print(text.startswith("Hello"))  # True
print(text.find("Python"))     # 7（インデックス）

# 分割・結合
csv = "田中,佐藤,鈴木"
names = csv.split(",")         # ["田中", "佐藤", "鈴木"]
joined = " / ".join(names)     # "田中 / 佐藤 / 鈴木"

# スライス
print(text[0:5])    # "Hello"
print(text[-6:])    # "orld!"
```

---

## Pythonの慣用表現

```python
# 複数代入
x, y = 10, 20

# 値の交換
x, y = y, x

# None チェック
value = None
if value is None:
    print("値が未設定です")

# in 演算子
if "apple" in fruits:
    print("リンゴがあります")

# 三項演算子
result = "あり" if value else "なし"
```

---

## まとめ

| ポイント | TypeScript | Python |
|----------|-----------|--------|
| 変数 | `const name: string = "..."` | `name: str = "..."` |
| 関数 | `function fn(): type {}` | `def fn() -> type:` |
| 文字列埋め込み | `` `${var}` `` | `f"{var}"` |
| 条件分岐 | `if () {} else if {} else {}` | `if: elif: else:` |
| ブロック | `{ }` | インデント |
| 真偽値 | `true` / `false` | `True` / `False` |
| null | `null` / `undefined` | `None` |

### チェックリスト

- [ ] Python で変数を宣言して型ヒントを書ける
- [ ] f-string で文字列を組み立てられる
- [ ] 関数を定義して呼び出せる
- [ ] if-elif-else で条件分岐ができる
- [ ] for ループと range を使える

---

## 次のステップへ

Pythonの基本文法を学びました。

次のセクションでは、Pythonの**データ構造**（list, dict, tuple, set）を学びます。
TypeScriptの配列やオブジェクトに対応する、Pythonの強力なデータ型を使いこなしましょう。

---

*推定読了時間: 30分*
