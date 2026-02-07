# 卒業クイズ：コードで世界を動かそう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 6
subStep: 2
title: "卒業クイズ"
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

L1月3全体の理解度をチェックする卒業クイズです。

- 全15問
- 合格ライン: 80%（12問正解）
- 合格するとプログラミング基礎修了証明書を獲得

---

## 問題

### Q1. TypeScriptの型システムの説明として正しいものはどれですか？

- A) TypeScriptは実行時に型チェックを行う
- B) TypeScriptはコンパイル時に型チェックを行い、実行時にはJavaScriptになる
- C) TypeScriptはJavaScriptより実行速度が速い
- D) TypeScriptはブラウザで直接実行できる

<details>
<summary>答えを見る</summary>

**正解: B**

TypeScriptはコンパイル時に型チェックを行い、その後JavaScriptに変換されます。実行時には通常のJavaScriptと同じです。型情報はコンパイル後のJavaScriptには残りません。

</details>

---

### Q2. 以下のコードの出力として正しいものはどれですか？

```typescript
const nums = [1, 2, 3, 4, 5];
const result = nums.filter(n => n > 2).reduce((sum, n) => sum + n, 0);
console.log(result);
```

- A) 6
- B) 9
- C) 12
- D) 15

<details>
<summary>答えを見る</summary>

**正解: C**

1. `filter(n => n > 2)` で `[3, 4, 5]` を取得
2. `reduce((sum, n) => sum + n, 0)` で合計を計算: 3 + 4 + 5 = 12

</details>

---

### Q3. async/await のルールとして正しいものはどれですか？

- A) await はどこでも使用できる
- B) async 関数は必ず Promise を返す
- C) await を使えば try/catch は不要になる
- D) async 関数内で return すると自動的に await される

<details>
<summary>答えを見る</summary>

**正解: B**

async 関数は常に Promise を返します。return した値は自動的に `Promise.resolve()` でラップされます。await は async 関数内（またはトップレベル）でのみ使用可能で、エラーハンドリングには try/catch が必要です。

</details>

---

### Q4. 以下の分割代入の結果で `rest` の値はどれですか？

```typescript
const [first, ...rest] = [10, 20, 30, 40];
```

- A) `20`
- B) `[20, 30, 40]`
- C) `[30, 40]`
- D) `40`

<details>
<summary>答えを見る</summary>

**正解: B**

配列の分割代入で `...rest` は「残りの全要素」を新しい配列として受け取ります。`first` に `10` が入り、残りの `[20, 30, 40]` が `rest` に入ります。

</details>

---

### Q5. SOLID原則の「S（Single Responsibility Principle）」の意味はどれですか？

- A) シングルトンパターンを使うべき
- B) 1つのモジュールは1つの責任だけを持つべき
- C) 1つのファイルに1つの関数だけ書くべき
- D) 1つのプロジェクトは1つの言語で書くべき

<details>
<summary>答えを見る</summary>

**正解: B**

単一責任の原則は「1つのモジュール（関数・クラス）は、変更される理由が1つだけであるべき」という意味です。バリデーション、DB保存、メール送信などを1つの関数にまとめるのではなく、それぞれ別の関数に分離します。

</details>

---

### Q6. ガード句の主な目的はどれですか？

- A) パフォーマンスの向上
- B) 条件分岐のネストを減らし可読性を高める
- C) メモリ使用量の削減
- D) セキュリティの向上

<details>
<summary>答えを見る</summary>

**正解: B**

ガード句は異常系を早期にreturnすることで、正常系のコードのネストを浅く保ち、可読性を向上させるテクニックです。

```typescript
// ガード句を使用
function process(user: User | null): void {
  if (!user) return;          // 異常系を先に処理
  if (!user.isActive) return; // 異常系を先に処理
  // 正常系はネストなし
  doSomething(user);
}
```

</details>

---

### Q7. Pythonのリスト内包表記として、TypeScriptの `numbers.filter(n => n % 2 === 0)` に相当するものはどれですか？

- A) `[n for n in numbers]`
- B) `[n for n in numbers if n % 2 == 0]`
- C) `[n % 2 for n in numbers]`
- D) `filter(lambda n: n % 2 == 0, numbers)`

<details>
<summary>答えを見る</summary>

**正解: B**

Pythonのリスト内包表記 `[n for n in numbers if n % 2 == 0]` はTypeScriptの `numbers.filter(n => n % 2 === 0)` と同じ結果を返します。`if` 条件が filter に相当します。D の `filter()` 関数も動作しますが、Pythonic な書き方はリスト内包表記です。

</details>

---

### Q8. Pythonの `dict.get("key", "default")` の動作として正しいものはどれですか？

- A) キーが存在すれば値を返し、存在しなければ "default" を返す
- B) キーが存在すれば "default" を返す
- C) 常に "default" を返す
- D) キーが存在しなければエラーになる

<details>
<summary>答えを見る</summary>

**正解: A**

`dict.get(key, default)` はキーが存在すればその値を、存在しなければデフォルト値を返します。`dict["key"]` はキーが存在しないと `KeyError` になりますが、`get` は安全にアクセスできます。

</details>

---

### Q9. TDD の Red フェーズで行うことはどれですか？

- A) テストを通す実装を書く
- B) コードをリファクタリングする
- C) 失敗するテストを書く
- D) テストを削除する

<details>
<summary>答えを見る</summary>

**正解: C**

TDDの3ステップ:
1. **Red**: まだ実装がない状態でテストを書く（失敗する）
2. **Green**: テストを通す最小限の実装を書く
3. **Refactor**: コードを綺麗にする（テストが通ることを確認）

</details>

---

### Q10. Jest の `expect(() => fn()).toThrow("エラー")` の説明として正しいものはどれですか？

- A) fn() がエラーを投げないことを確認する
- B) fn() が "エラー" という文字列を返すことを確認する
- C) fn() を実行した結果 "エラー" というメッセージの例外が投げられることを確認する
- D) fn がコンパイルエラーになることを確認する

<details>
<summary>答えを見る</summary>

**正解: C**

`expect(() => fn()).toThrow("エラー")` は、アロー関数内で `fn()` を実行し、「"エラー" という文字列を含むメッセージの例外が投げられること」を検証します。関数を直接呼ぶのではなく、アロー関数でラップする必要があります。

</details>

---

### Q11. REST API で既存リソースの部分更新に使うHTTPメソッドはどれですか？

- A) POST
- B) PUT
- C) PATCH
- D) GET

<details>
<summary>答えを見る</summary>

**正解: C**

- POST: 新規作成
- PUT: 全体更新（リソース全体を送る）
- **PATCH: 部分更新**（変更したいフィールドだけ送る）
- GET: 取得

例: タスクのタイトルだけ変更する場合は `PATCH /api/tasks/1` に `{ "title": "新タイトル" }` を送ります。

</details>

---

### Q12. TypeScriptのクラスで `private` メソッドの用途として正しいものはどれですか？

- A) テストから直接呼び出すため
- B) クラス内部でのみ使用する実装の詳細を隠蔽するため
- C) 他のクラスから継承させるため
- D) グローバルからアクセスするため

<details>
<summary>答えを見る</summary>

**正解: B**

`private` メソッドはクラスの内部実装を隠蔽（カプセル化）するために使います。外部からは `public` メソッドだけが見え、内部の実装詳細は隠されます。テストは `public` メソッド経由で間接的にテストします。

</details>

---

### Q13. エラーハンドリングで最も避けるべきパターンはどれですか？

- A) カスタムエラークラスを作成する
- B) `catch (error) {}` で何もせずエラーを握りつぶす
- C) エラーを再スロー（re-throw）する
- D) `instanceof` でエラーの種類を判定する

<details>
<summary>答えを見る</summary>

**正解: B**

エラーを握りつぶす（catch で何もしない）のは最悪のパターンです。エラーが起きたことが誰にも伝わらず、問題の発見が遅れ、データ損失などの重大な事故につながります。最低限ログを出力し、必要に応じて再スローすべきです。

</details>

---

### Q14. ESLint と Prettier の役割分担として正しいものはどれですか？

- A) ESLintはバグ検出とコード品質チェック、Prettierはコードフォーマット
- B) ESLintはテスト実行、Prettierはビルド
- C) ESLintはTypeScript用、PrettierはJavaScript用
- D) 両方同じ機能の代替ツール

<details>
<summary>答えを見る</summary>

**正解: A**

- **ESLint**: コードの品質チェック（未使用変数、any の検出、console.log の警告など）
- **Prettier**: コードのフォーマット統一（インデント、セミコロン、引用符の統一など）

両方を組み合わせて使うのがベストプラクティスです。

</details>

---

### Q15. スタックトレースの読み方として正しいものはどれですか？

```
TypeError: Cannot read properties of undefined (reading 'name')
    at getUserName (/src/user.ts:15:24)
    at processOrder (/src/order.ts:42:18)
    at main (/src/index.ts:10:3)
```

- A) エラーは main 関数で発生した
- B) エラーは getUserName 関数の user.ts 15行目で発生した
- C) processOrder 関数にバグがある
- D) 3つの関数全てにバグがある

<details>
<summary>答えを見る</summary>

**正解: B**

TypeScriptのスタックトレースは上が最新（エラー発生場所）です。
- **1行目**: エラーの種類（`undefined` の `name` にアクセスしようとした）
- **2行目**: エラーが発生した場所（`getUserName` 関数、`user.ts` の15行目24文字目）
- **3行目以降**: その関数を呼び出した場所（コールスタック）

`getUserName` 内で使っている変数が `undefined` になっている原因を調べるのが最初のステップです。

</details>

---

## 結果

### 12問以上正解の場合

**合格です。おめでとうございます。**

---

## 修了証明書

```
╔══════════════════════════════════════════════╗
║                                              ║
║          プログラミング基礎 修了証明書        ║
║                                              ║
║  L1 月3「コードで世界を動かそう」            ║
║                                              ║
║  習得スキル:                                 ║
║   - TypeScript（メイン開発言語）             ║
║   - Python基礎（サブ開発言語）               ║
║   - テスト駆動開発（TDD）                    ║
║   - クリーンコード＆リファクタリング         ║
║   - REST APIクライアント実装                 ║
║   - コードレビュー対応                       ║
║                                              ║
║  認定レベル:                                 ║
║   「業務でコードを書き、                     ║
║    レビューを受けて修正できる」              ║
║                                              ║
╚══════════════════════════════════════════════╝
```

---

### 11問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q4 | Step 1: TypeScript基礎 |
| Q2, Q3 | Step 2: 標準ライブラリ |
| Q5, Q6, Q13, Q14 | Step 3: クリーンコード |
| Q7, Q8 | Step 4: Python & コード読解 |
| Q9, Q10, Q11, Q12 | Step 5: 機能追加 |
| Q15 | Step 4: デバッグ |

---

## L1月3 完了

お疲れさまでした。

### この月で身につけたスキル

| カテゴリ | スキル |
|---------|--------|
| TypeScript | 型システム、関数、オブジェクト、配列メソッド、非同期処理、モジュール、クラス |
| Python | 基本構文、データ構造、リスト内包表記、f-string |
| 設計 | SOLID原則、DRY/KISS/YAGNI、命名規則 |
| 品質 | TDD、ESLint、Prettier、エラーハンドリング |
| 実践 | 要件分析、REST API、リファクタリング、コードレビュー |

### 次のステップ

**L1 月4** では、さらに実践的なスキルを身につけていきます。
ここで学んだTypeScriptとPythonの力を土台に、
より大きなプロジェクトに挑戦しましょう。

**コードで世界を動かす力を手に入れた。次のステージへ進もう。**

---

*推定所要時間: 30分*
