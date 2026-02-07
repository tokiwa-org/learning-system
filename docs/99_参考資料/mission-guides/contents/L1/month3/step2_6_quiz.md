# チェックポイント：標準ライブラリをマスターしよう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 2
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 2で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. テンプレートリテラルの出力として正しいものはどれですか？

```typescript
const name = "田中";
const age = 28;
const message = `${name}さんは${age + 2}歳になります`;
```

- A) `${name}さんは${age + 2}歳になります`
- B) `田中さんは28歳になります`
- C) `田中さんは30歳になります`
- D) エラーになる

<details>
<summary>答えを見る</summary>

**正解: C**

テンプレートリテラル内の `${}` には式を書けます。`age + 2` は `28 + 2 = 30` と計算され、結果の `30` が埋め込まれます。

</details>

---

### Q2. 以下のコードの出力として正しいものはどれですか？

```typescript
const numbers = [1, 2, 3, 4, 5];
const result = numbers.filter((n) => n % 2 === 0).map((n) => n * 10);
```

- A) `[10, 20, 30, 40, 50]`
- B) `[20, 40]`
- C) `[2, 4]`
- D) `[10, 30, 50]`

<details>
<summary>答えを見る</summary>

**正解: B**

1. `filter((n) => n % 2 === 0)` で偶数だけ抽出 → `[2, 4]`
2. `map((n) => n * 10)` で各要素を10倍 → `[20, 40]`

メソッドチェーンでは左から順に処理されます。

</details>

---

### Q3. reduce の結果として正しいものはどれですか？

```typescript
const words = ["Hello", "World", "TypeScript"];
const result = words.reduce((acc, word) => acc + word.length, 0);
```

- A) `"HelloWorldTypeScript"`
- B) `3`
- C) `20`
- D) `[5, 5, 10]`

<details>
<summary>答えを見る</summary>

**正解: C**

`reduce` は初期値 `0` から始めて、各単語の文字数を加算していきます。
- `0 + 5 ("Hello")` = 5
- `5 + 5 ("World")` = 10
- `10 + 10 ("TypeScript")` = 20

結果は `20` です。

</details>

---

### Q4. async/await について正しい説明はどれですか？

- A) await は通常の関数内でも使用できる
- B) async 関数は常に Promise を返す
- C) await は Promise の結果を同期的にブロックする
- D) async/await を使うと try/catch は不要になる

<details>
<summary>答えを見る</summary>

**正解: B**

- A は誤り: `await` は `async` 関数内でのみ使用可能（トップレベル await を除く）
- B は正解: `async` 関数は常に `Promise` を返します
- C は誤り: ブロックするのではなく、Promise が解決するまで処理を一時停止し、他のコードの実行を妨げません
- D は誤り: エラーハンドリングには `try/catch` が必要です

</details>

---

### Q5. fetch API の使い方として正しいものはどれですか？

```typescript
async function getData() {
  const response = await fetch("https://api.example.com/data");
  // ここに入るコードは？
}
```

- A) `return response;`
- B) `return response.data;`
- C) `return await response.json();`
- D) `return JSON.parse(response);`

<details>
<summary>答えを見る</summary>

**正解: C**

`fetch` の戻り値は `Response` オブジェクトです。JSONデータを取得するには `response.json()` を呼び出す必要があります。`response.json()` は Promise を返すため、`await` が必要です。

- A: Response オブジェクトそのものを返してしまう
- B: `response.data` は axios の書き方（fetch にはない）
- D: Response オブジェクトを直接 JSON.parse に渡せない

</details>

---

### Q6. npm コマンドの説明として正しいものはどれですか？

- A) `npm install -D jest` は本番環境用にjestをインストールする
- B) `npm install -D jest` は開発時のみ必要なパッケージとしてjestをインストールする
- C) `npm install -D jest` はjestをグローバルにインストールする
- D) `npm install -D jest` はjestをアンインストールする

<details>
<summary>答えを見る</summary>

**正解: B**

`-D` フラグ（`--save-dev` の省略形）は、`devDependencies` にパッケージを追加します。テストツールやビルドツールなど、開発時にのみ必要なパッケージに使います。

本番環境用は `npm install jest`（フラグなし）、グローバルは `npm install -g jest` です。

</details>

---

### Q7. 以下のコードで `split` と `join` の結果として正しいものはどれですか？

```typescript
const path = "/users/tanaka/documents";
const result = path.split("/").filter((p) => p !== "").join(" > ");
```

- A) `"/users/tanaka/documents"`
- B) `"users > tanaka > documents"`
- C) `" > users > tanaka > documents"`
- D) `["users", "tanaka", "documents"]`

<details>
<summary>答えを見る</summary>

**正解: B**

1. `split("/")` → `["", "users", "tanaka", "documents"]`（先頭の "/" の前に空文字列が入る）
2. `filter((p) => p !== "")` → `["users", "tanaka", "documents"]`（空文字列を除去）
3. `join(" > ")` → `"users > tanaka > documents"`

</details>

---

### Q8. Promise.all の動作として正しいものはどれですか？

```typescript
const results = await Promise.all([
  fetch("/api/users"),
  fetch("/api/posts"),
  fetch("/api/comments"),
]);
```

- A) 3つのリクエストを順番に実行する
- B) 3つのリクエストを同時に実行し、全て完了したら結果を返す
- C) 最初に完了したリクエストの結果だけを返す
- D) 1つでも失敗したら残りのリクエストをキャンセルする

<details>
<summary>答えを見る</summary>

**正解: B**

`Promise.all` は渡された全ての Promise を並行して実行し、全てが成功（fulfilled）したら結果の配列を返します。1つでも失敗するとエラーになります（全結果が必要な場合は `Promise.allSettled` を使用）。

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 2「標準ライブラリをマスターしよう」を完了しました。
次は Step 3「クリーンなコードを書こう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step2_1 文字列操作（テンプレートリテラル） |
| Q2, Q3 | step2_2 配列メソッド（filter, map, reduce） |
| Q4, Q5 | step2_3 非同期処理（async/await, fetch） |
| Q6, Q7 | step2_4 モジュールとパッケージ管理 |
| Q8 | step2_3 非同期処理（Promise.all） |

---

## Step 2 完了

お疲れさまでした。

### 学んだこと

- 文字列操作: テンプレートリテラル、split/join、replace、正規表現
- 配列メソッド: map, filter, reduce, find, some, every, sort
- 非同期処理: Promise, async/await, fetch, try/catch
- モジュール: import/export, npm, package.json

### 次のステップ

**Step 3: クリーンなコードを書こう（2時間）**

動くコードを書けるようになった今、次は「読みやすく、保守しやすい」コードの書き方を学びます。

---

*推定所要時間: 30分*
