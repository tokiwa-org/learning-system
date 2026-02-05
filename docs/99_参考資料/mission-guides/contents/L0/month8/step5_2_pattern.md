# よくある指摘パターン

## メタ情報

```yaml
mission: "品質を意識した作業を覚えよう"
step: 5
subStep: 2
title: "よくある指摘パターン"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "品質管理"
  category: "ヒューマンスキル"
  target_level: "L0"
```

---

## ストーリー

> 「新人が受けやすい指摘には、実はパターンがあるんだ」
>
> 「パターン？」
>
> 「そう。事前に知っておけば、レビューを出す前に自分で気づける」
>
> 「それは助かります！」
>
> 「よくある指摘を10個紹介するから、覚えておいて」

---

## 新人がよく受ける指摘パターン10選

### パターン1: デバッグコードの消し忘れ

**指摘例:**
> 「console.logが残っています」

**問題のコード:**
```javascript
function calculateTotal(items) {
  console.log("items:", items); // デバッグ用
  const total = items.reduce((sum, item) => sum + item.price, 0);
  console.log("total:", total); // デバッグ用
  return total;
}
```

**対策:**
- コミット前に `git diff | grep console.log` で確認
- ESLintで `no-console` ルールを設定

---

### パターン2: 命名が不適切

**指摘例:**
> 「この変数名 `d` では何を表しているかわかりません」

**問題のコード:**
```javascript
function f(d) {
  const x = d.name;
  const y = d.email;
  // ...
}
```

**修正後:**
```javascript
function registerUser(userData) {
  const userName = userData.name;
  const userEmail = userData.email;
  // ...
}
```

**対策:**
- 変数名は「何が入っているか」がわかる名前に
- 関数名は「何をするか」がわかる動詞で始める

---

### パターン3: コーディング規約違反

**指摘例:**
> 「チームの規約では `var` ではなく `const` / `let` を使います」

**問題のコード:**
```javascript
var result = [];
var i = 0;
```

**修正後:**
```javascript
const result = [];
let i = 0;
```

**対策:**
- 入社時にコーディング規約を確認
- ESLintを設定して自動チェック

---

### パターン4: エラーハンドリングの欠如

**指摘例:**
> 「API呼び出しでエラーが発生した場合の処理がありません」

**問題のコード:**
```javascript
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data;
}
```

**修正後:**
```javascript
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
```

**対策:**
- 外部API呼び出し、ファイル操作、DB操作には必ずtry-catch
- 「失敗したらどうなる？」を常に考える

---

### パターン5: マジックナンバー

**指摘例:**
> 「この `86400` は何を表していますか？定数にしましょう」

**問題のコード:**
```javascript
const expirationTime = Date.now() + 86400 * 1000;
```

**修正後:**
```javascript
const SECONDS_PER_DAY = 86400;
const MILLISECONDS_PER_SECOND = 1000;
const expirationTime = Date.now() + SECONDS_PER_DAY * MILLISECONDS_PER_SECOND;
```

**対策:**
- 意味のある数字は定数として名前をつける
- コードを読む人が「なぜその値？」と思う数字は定数化

---

### パターン6: 不要なコメント

**指摘例:**
> 「このコメントはコードを読めばわかるので不要です」

**問題のコード:**
```javascript
// ユーザー名を取得する
const userName = user.name;

// 配列をループする
for (const item of items) {
  // ...
}
```

**修正後:**
```javascript
const userName = user.name;

for (const item of items) {
  // ...
}
```

**対策:**
- 「What（何をしているか）」ではなく「Why（なぜそうしているか）」をコメントする
- コードで表現できることはコードで表現する

---

### パターン7: 巨大な関数

**指摘例:**
> 「この関数は200行あります。役割ごとに分割できませんか？」

**問題の構造:**
```javascript
function processOrder(order) {
  // 入力チェック（50行）
  // 在庫確認（30行）
  // 価格計算（40行）
  // 決済処理（50行）
  // 通知送信（30行）
}
```

**修正後の構造:**
```javascript
function processOrder(order) {
  validateOrder(order);
  checkInventory(order.items);
  const total = calculateTotal(order);
  processPayment(order, total);
  sendNotification(order);
}
```

**対策:**
- 1つの関数は1つの責務（Single Responsibility）
- 目安: 50行を超えたら分割を検討

---

### パターン8: 重複コード

**指摘例:**
> 「この処理は別の場所にも同じコードがあります。共通化できませんか？」

**問題のコード:**
```javascript
// ファイルA
const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

// ファイルB（同じコード）
const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
```

**修正後:**
```javascript
// utils/date.js
function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

// 使用箇所
const formattedDate = formatDate(date);
```

**対策:**
- DRY原則（Don't Repeat Yourself）を意識
- 2回以上使う処理は関数化を検討

---

### パターン9: 不要なファイルのコミット

**指摘例:**
> 「.env ファイルがコミットされています。削除してください」

**問題:**
```
+ .env
+ node_modules/（大量のファイル）
+ .DS_Store
```

**対策:**
- `.gitignore` を適切に設定
- コミット前に `git status` で確認
- 機密情報（APIキー、パスワード）は絶対にコミットしない

---

### パターン10: テストの欠如

**指摘例:**
> 「新しく追加した関数のテストがありません」

**問題:**
```
新機能を追加したが、テストコードがない
→ 将来の変更で壊れても気づけない
```

**対策:**
- 新しい関数を書いたら、テストも書く
- 最低限、正常系のテストは用意する
- TDD（テスト駆動開発）を学ぶ

---

## 指摘パターン早見表

| # | パターン | 確認方法 |
|---|---------|---------|
| 1 | デバッグコードの消し忘れ | `git diff \| grep console.log` |
| 2 | 命名が不適切 | 変数名だけで意味がわかるか？ |
| 3 | コーディング規約違反 | ESLint実行 |
| 4 | エラーハンドリングの欠如 | try-catchがあるか確認 |
| 5 | マジックナンバー | 謎の数字がないか確認 |
| 6 | 不要なコメント | 「Why」を説明しているか？ |
| 7 | 巨大な関数 | 50行以下か確認 |
| 8 | 重複コード | 同じコードが2箇所以上ないか |
| 9 | 不要なファイル | `git status` で確認 |
| 10 | テストの欠如 | 新機能にテストがあるか |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 事前対策 | パターンを知っておけば、レビュー前に自分で気づける |
| チェックリスト | 10個のパターンをセルフレビュー時に確認する |
| 自動化 | ESLintなどのツールで自動チェックできるものは自動化 |

### チェックリスト

- [ ] よくある10個の指摘パターンを理解した
- [ ] 各パターンの対策方法を理解した
- [ ] セルフレビュー時に確認すべきことがわかった

---

## 次のステップへ

よくある指摘パターンを学びました。

次のセクションでは、実際にレビュー指摘に対応するシミュレーション演習を行います。
学んだパターンを実践で活かしましょう。

---

*推定読了時間: 30分*
