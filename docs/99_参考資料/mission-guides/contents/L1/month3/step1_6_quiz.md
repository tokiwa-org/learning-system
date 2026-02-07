# 理解度チェック：言語の基礎を固めよう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 1
subStep: 6
title: "理解度チェック"
itemType: QUIZ
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 1で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. TypeScriptの説明として正しいものはどれですか？

- A) TypeScriptはJavaScriptとは全く別の言語である
- B) TypeScriptはJavaScriptに型システムを追加したスーパーセットである
- C) TypeScriptはブラウザで直接実行できる
- D) TypeScriptはJavaScriptより実行速度が速い

<details>
<summary>答えを見る</summary>

**正解: B**

TypeScriptはJavaScriptのスーパーセットです。全てのJavaScriptコードは有効なTypeScriptコードですが、TypeScriptには型注釈が追加されています。TypeScriptはコンパイルしてJavaScriptに変換してから実行します。

</details>

---

### Q2. 以下のコードでコンパイルエラーになるのはどれですか？

```typescript
const x: number = 42;
let y: string = "hello";
```

- A) `x = 100;`
- B) `y = "world";`
- C) `y = 123;`
- D) AとCの両方

<details>
<summary>答えを見る</summary>

**正解: D**

- `x = 100` は `const` で宣言されているため再代入できずエラー
- `y = "world"` は `let` で `string` 型なので OK
- `y = 123` は `string` 型の変数に `number` を代入しようとしているためエラー

</details>

---

### Q3. ユニオン型の説明として正しいものはどれですか？

```typescript
let value: string | number;
```

- A) value は string 型と number 型の両方のプロパティを持つ
- B) value は string 型または number 型のどちらかの値を保持できる
- C) value は必ず string 型で初期化する必要がある
- D) value は string と number を同時に保持できる

<details>
<summary>答えを見る</summary>

**正解: B**

ユニオン型（`|`）は「いずれかの型」を意味します。`string | number` は文字列か数値のどちらかの値を代入できます。使用する際は `typeof` などで型を絞り込む必要があります。

</details>

---

### Q4. 以下のアロー関数の書き換えとして正しいものはどれですか？

```typescript
function double(n: number): number {
  return n * 2;
}
```

- A) `const double = (n: number): number => { n * 2 };`
- B) `const double = (n: number): number => n * 2;`
- C) `const double = n: number => n * 2;`
- D) `const double => (n: number): number = n * 2;`

<details>
<summary>答えを見る</summary>

**正解: B**

アロー関数で1つの式を返す場合、`{}` と `return` を省略できます。

- A は `{}` があるのに `return` がないため、`undefined` を返してしまう
- C は引数の括弧が必要（TypeScriptでは型注釈があるため）
- D は構文が不正

</details>

---

### Q5. オプショナルプロパティ（?）の説明として正しいものはどれですか？

```typescript
interface User {
  name: string;
  age?: number;
}
```

- A) age は必ず number 型の値を持つ
- B) age は number 型または undefined のどちらかである
- C) age は null を代入できる
- D) age は any 型として扱われる

<details>
<summary>答えを見る</summary>

**正解: B**

`age?: number` は `age: number | undefined` と同じ意味です。プロパティ自体を省略でき、その場合は `undefined` になります。`null` は明示的に型に含めない限り代入できません。

</details>

---

### Q6. 分割代入の結果として正しいものはどれですか？

```typescript
const user = { name: "田中", age: 28, role: "developer" };
const { name, ...rest } = user;
```

- A) rest は `{ age: 28 }` になる
- B) rest は `{ age: 28, role: "developer" }` になる
- C) rest は `["age", "role"]` になる
- D) rest は undefined になる

<details>
<summary>答えを見る</summary>

**正解: B**

`...rest` は「残りの全てのプロパティ」を新しいオブジェクトとして受け取ります。`name` が取り出された後、残りの `age` と `role` が `rest` に入ります。

</details>

---

### Q7. スプレッド構文の結果として正しいものはどれですか？

```typescript
const original = { a: 1, b: 2, c: 3 };
const updated = { ...original, b: 20, d: 4 };
```

- A) `{ a: 1, b: 2, c: 3, d: 4 }`
- B) `{ a: 1, b: 20, c: 3, d: 4 }`
- C) `{ b: 20, d: 4 }`
- D) エラーになる

<details>
<summary>答えを見る</summary>

**正解: B**

スプレッド構文 `...original` で全プロパティをコピーし、その後 `b: 20` で上書き、`d: 4` を追加します。元の `original` は変更されません。

</details>

---

### Q8. `any` と `unknown` の違いとして正しいものはどれですか？

- A) any も unknown も同じで、どちらも型チェックをスキップする
- B) any は型チェックをスキップし、unknown は使用前に型チェックが必要
- C) unknown は型チェックをスキップし、any は使用前に型チェックが必要
- D) any も unknown もTypeScriptでは使用禁止の型である

<details>
<summary>答えを見る</summary>

**正解: B**

- `any` は型チェックを完全に無効にするため、実行時エラーのリスクがある（使用は避ける）
- `unknown` は型安全な代替で、使用前に `typeof` などで型を確認する必要がある

```typescript
let a: any = "hello";
a.foo(); // コンパイルエラーにならない（実行時エラー）

let b: unknown = "hello";
// b.foo(); // コンパイルエラー！
if (typeof b === "string") {
  b.toUpperCase(); // OK
}
```

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 1「言語の基礎を固めよう」を完了しました。
次は Step 2「標準ライブラリをマスターしよう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

間違えた問題の内容を、該当するセクションで復習してください：

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q2 | step1_2 TypeScriptを選ぶ理由 |
| Q3, Q8 | step1_3 型システムを理解しよう |
| Q4 | step1_4 関数とアロー関数 |
| Q5 | step1_3 型システム（オプショナル） |
| Q6, Q7 | step1_5 オブジェクトと配列 |

---

## Step 1 完了

お疲れさまでした。

### 学んだこと

- TypeScriptの特徴と環境構築
- プリミティブ型、配列型、ユニオン型
- type と interface によるオブジェクト型定義
- 関数宣言とアロー関数
- 分割代入とスプレッド構文

### 次のステップ

**Step 2: 標準ライブラリをマスターしよう（4時間）**

文字列操作、配列メソッド、非同期処理、モジュールシステムを学び、
実用的なツールを作れるようになりましょう。

---

*推定所要時間: 15分*
