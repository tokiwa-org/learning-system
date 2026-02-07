# チェックポイント：機能追加を実装しよう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 5
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

Step 5で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. ユーザーストーリーの正しい形式はどれですか？

- A) 「タグ機能を実装する」
- B) 「ユーザーとして、タスクにタグを追加したい。理由は分類のため。」
- C) 「IF tag THEN add TO task」
- D) 「CREATE TABLE tags (id INT, name VARCHAR)」

<details>
<summary>答えを見る</summary>

**正解: B**

ユーザーストーリーは「ユーザーとして、[したいこと]。理由は[目的]。」の形式で書きます。技術的な詳細ではなく、ユーザー視点での要件を記述します。

</details>

---

### Q2. TDD の正しいサイクルはどれですか？

- A) Green → Red → Refactor
- B) Refactor → Red → Green
- C) Red → Green → Refactor
- D) Red → Refactor → Green

<details>
<summary>答えを見る</summary>

**正解: C**

TDDのサイクル:
1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限の実装を書く
3. **Refactor**: コードを綺麗にする（テストが通ることを確認）

</details>

---

### Q3. Jest のテストで「エラーが投げられること」を検証するマッチャーはどれですか？

```typescript
// validateTag("") がエラーを投げることを確認したい
```

- A) `expect(validateTag("")).toBe(Error)`
- B) `expect(validateTag("")).toThrow()`
- C) `expect(() => validateTag("")).toThrow()`
- D) `expect(validateTag).toThrow("")`

<details>
<summary>答えを見る</summary>

**正解: C**

`toThrow()` を使うには、関数をラップする必要があります。`expect(() => fn())` のようにアロー関数で囲みます。直接 `expect(fn())` と呼び出すと、toThrow が判定する前にエラーが投げられてしまいます。

</details>

---

### Q4. REST APIで新しいリソースを作成する時に使うHTTPメソッドはどれですか？

- A) GET
- B) POST
- C) PUT
- D) DELETE

<details>
<summary>答えを見る</summary>

**正解: B**

- GET: データ取得
- **POST: データ作成**
- PUT: データ全更新
- PATCH: データ部分更新
- DELETE: データ削除

新しいリソースの作成にはPOSTを使い、成功すると通常201(Created)が返されます。

</details>

---

### Q5. TypeScriptのクラスで `private` 修飾子の説明として正しいものはどれですか？

- A) 他のファイルからアクセスできない
- B) クラス内部からのみアクセスでき、外部やサブクラスからはアクセスできない
- C) サブクラスからはアクセスできるが、外部からはアクセスできない
- D) 読み取り専用で変更できない

<details>
<summary>答えを見る</summary>

**正解: B**

- `public`: どこからでもアクセス可能
- `private`: **クラス内部からのみ**アクセス可能
- `protected`: クラス内部 + サブクラスからアクセス可能
- `readonly`: 読み取り専用（修飾子とは別の概念）

</details>

---

### Q6. 受け入れ条件（Acceptance Criteria）の目的として正しいものはどれですか？

- A) コードのパフォーマンス基準を定義する
- B) ユーザーストーリーの「完了の定義」を明確にする
- C) 開発チームの作業時間を見積もる
- D) テストの実行順序を決める

<details>
<summary>答えを見る</summary>

**正解: B**

受け入れ条件は「この機能がどうなったら完了か」を具体的に定義するものです。例えば「タグは1〜20文字」「最大10個まで」「重複は追加されない」などの具体的な条件を列挙します。

</details>

---

### Q7. 以下のコードで `extends` と `super` の説明として正しいものはどれですか？

```typescript
class Animal {
  constructor(public name: string) {}
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);
  }
}
```

- A) extends は新しいクラスを作り、super はメソッドを呼び出す
- B) extends は親クラスを継承し、super は親クラスのコンストラクタを呼び出す
- C) extends はインターフェースを実装し、super はプロパティを参照する
- D) extends と super は同じ意味で互換的に使える

<details>
<summary>答えを見る</summary>

**正解: B**

- `extends` はクラスの継承を宣言します（Dog は Animal を継承）
- `super(name)` は親クラス（Animal）のコンストラクタを呼び出します
- 子クラスのコンストラクタでは、`this` を使う前に必ず `super()` を呼ぶ必要があります

</details>

---

### Q8. APIクライアントをクラスで作る最大の利点はどれですか？

- A) 実行速度が関数より速い
- B) ファイルサイズが小さくなる
- C) 設定（URL、認証情報）をインスタンスで共有でき、各メソッドで再設定が不要
- D) テストが不要になる

<details>
<summary>答えを見る</summary>

**正解: C**

クラスの利点は、コンストラクタで設定を一度だけ行えば、全メソッドでその設定を共有できることです。

```typescript
const client = new ApiClient("https://api.example.com", "token123");
// 以降、URL や認証情報を毎回指定する必要がない
await client.getTasks();
await client.createTask({ title: "新タスク" });
```

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 5「機能追加を実装しよう」を完了しました。
次は最終ステップ Step 6「コードレビューを乗り越えよう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q6 | step5_1 要件を実装に落とし込もう |
| Q2, Q3 | step5_2 テスト駆動開発の基本 |
| Q4 | step5_3 REST APIクライアント |
| Q5, Q7, Q8 | step5_4 クラスとオブジェクト指向 |

---

## Step 5 完了

お疲れさまでした。

### 学んだこと

- 要件分析: ユーザーストーリー、受け入れ条件、タスク分解
- TDD: Red-Green-Refactor、Jest
- REST API: fetch、型安全なAPIクライアント
- クラス: constructor、アクセス修飾子、継承

### 次のステップ

**Step 6: コードレビューを乗り越えよう（2時間）**

最終総合演習と卒業クイズです。全てのスキルを使って、レビューを通過できるコードを書きましょう。

---

*推定所要時間: 30分*
