# 理解度チェック：クリーンなコードを書こう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 3
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

Step 3で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. TypeScript/JavaScriptの命名規則として正しい組み合わせはどれですか？

- A) 変数: PascalCase、関数: UPPER_SNAKE_CASE、定数: camelCase
- B) 変数: camelCase、関数: camelCase、定数: UPPER_SNAKE_CASE
- C) 変数: snake_case、関数: snake_case、定数: UPPER_SNAKE_CASE
- D) 変数: camelCase、関数: PascalCase、定数: camelCase

<details>
<summary>答えを見る</summary>

**正解: B**

TypeScript/JavaScriptの標準的な命名規則は以下の通りです：
- 変数・関数: camelCase（`userName`, `fetchData`）
- 定数: UPPER_SNAKE_CASE（`MAX_RETRIES`, `API_URL`）
- クラス・インターフェース: PascalCase（`UserService`, `Product`）

</details>

---

### Q2. 単一責任の原則（SRP）の説明として正しいものはどれですか？

- A) 1つのファイルには1つのクラスだけを書くべき
- B) 1つのモジュールは1つの理由でだけ変更されるべき
- C) 1つの関数は1行だけで書くべき
- D) 1つのプロジェクトには1つの言語だけを使うべき

<details>
<summary>答えを見る</summary>

**正解: B**

単一責任の原則（SRP）は「1つのモジュール（関数・クラス）は、変更される理由が1つだけであるべき」という原則です。例えば、バリデーション・DB保存・メール送信を1つの関数でやると、どれか1つの変更が他に影響します。責任を分離することで、変更の影響範囲を限定できます。

</details>

---

### Q3. DRY原則に違反しているコードはどれですか？

- A) 同じ計算ロジックを2つの関数にコピーして使っている
- B) 2つの異なる目的のために似たコードを書いている
- C) 変数名を短く省略している
- D) コメントを書いていない

<details>
<summary>答えを見る</summary>

**正解: A**

DRY（Don't Repeat Yourself）は「同じコードを繰り返し書かない」という原則です。同じ計算ロジックをコピーしている場合は、共通関数に抽出すべきです。なお、B のように目的が異なる場合は、たとえコードが似ていても別のものとして扱うことがあります。

</details>

---

### Q4. ガード句（Guard Clause）の目的として正しいものはどれですか？

- A) コードの実行速度を向上させる
- B) 条件分岐のネストを減らし、コードの可読性を高める
- C) メモリ使用量を削減する
- D) テストを書きやすくする

<details>
<summary>答えを見る</summary>

**正解: B**

ガード句は異常系の条件を関数の先頭で早期リターンすることで、正常系のロジックをネストなしでフラットに書けるようにするテクニックです。

```typescript
// ガード句あり
function process(user: User | null): void {
  if (!user) return;
  if (!user.isActive) return;
  // 正常系の処理（ネストなし）
}
```

</details>

---

### Q5. マジックナンバーの改善として正しいものはどれですか？

```typescript
// Before
if (password.length < 8) { throw new Error("短すぎます"); }
```

- A) `if (password.length < 8.0) { throw new Error("短すぎます"); }`
- B) `const MIN_PASSWORD_LENGTH = 8; if (password.length < MIN_PASSWORD_LENGTH) { ... }`
- C) `if (password.length < parseInt("8")) { throw new Error("短すぎます"); }`
- D) `// 8文字未満チェック\nif (password.length < 8) { ... }`

<details>
<summary>答えを見る</summary>

**正解: B**

マジックナンバー（意味のない生の数値）は、意味のある名前の定数（`UPPER_SNAKE_CASE`）に置き換えます。コメントで説明するより、定数名で意味を伝える方が確実です。

</details>

---

### Q6. エラーハンドリングで絶対にやってはいけないことはどれですか？

- A) カスタムエラークラスを作成する
- B) catch ブロックで何もしないでエラーを握りつぶす
- C) エラーを再スロー（re-throw）する
- D) try/catch/finally を使う

<details>
<summary>答えを見る</summary>

**正解: B**

`catch` ブロックで何もしない（エラーの握りつぶし）は最悪のパターンです。エラーが発生したことが誰にも伝わらず、デバッグが困難になります。最低限ログを出力し、必要に応じてエラーを再スローすべきです。

```typescript
// 絶対NG
try { riskyOp(); } catch (e) { }

// 最低限
try { riskyOp(); } catch (e) { console.error(e); throw e; }
```

</details>

---

### Q7. YAGNI原則に従ったコードはどれですか？

- A) 将来使うかもしれない全ての機能を先に実装する
- B) 今必要な機能だけを実装し、将来の拡張は必要になった時に行う
- C) 全てのコードに対してテストを書かない（時間の無駄だから）
- D) エラーハンドリングを省略する（今は問題ないから）

<details>
<summary>答えを見る</summary>

**正解: B**

YAGNI（You Aren't Gonna Need It）は「今必要ないものは作らない」という原則です。将来使うかもしれない機能を先に実装すると、コードが複雑になり、使われないコードの保守コストが発生します。テストやエラーハンドリングは「今必要な」品質保証なのでYAGNIの対象外です。

</details>

---

### Q8. ESLintとPrettierの役割分担として正しいものはどれですか？

- A) ESLintはコード整形、Prettierはバグ検出
- B) ESLintはバグ検出とコード品質チェック、Prettierはコード整形
- C) ESLintとPrettierは同じ機能を持つ代替ツール
- D) ESLintはTypeScript用、PrettierはJavaScript用

<details>
<summary>答えを見る</summary>

**正解: B**

- **ESLint**: コードの品質チェック（未使用変数、any の使用、console.log の検出など）
- **Prettier**: コードのフォーマット統一（インデント、セミコロン、引用符など）

両方を組み合わせることで、品質と見た目の両方を自動的に管理できます。

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 3「クリーンなコードを書こう」を完了しました。
次は Step 4「レガシーコードを解読しよう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step3_1 命名規則とコードスタイル |
| Q2, Q3, Q7 | step3_2 SOLID原則の基本 |
| Q4, Q5 | step3_3 リファクタリングの技法 |
| Q6 | step3_4 エラーハンドリング |
| Q8 | step3_5 ESLint/Prettier |

---

## Step 3 完了

お疲れさまでした。

### 学んだこと

- 命名規則: camelCase, PascalCase, UPPER_SNAKE_CASE
- 設計原則: SRP, OCP, DRY, KISS, YAGNI
- リファクタリング: 関数抽出, ガード句, マジックナンバー排除
- エラーハンドリング: try/catch, カスタムエラー
- コード品質: ESLint, Prettier, pre-commit hooks

### 次のステップ

**Step 4: レガシーコードを解読しよう（4時間）**

Pythonを学びながら、他人のコードを読む技術とデバッグの技法を身につけます。

---

*推定所要時間: 15分*
