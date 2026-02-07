# 命名規則とコードスタイル

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 3
subStep: 1
title: "命名規則とコードスタイル"
itemType: LESSON
estimatedMinutes: 20
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「コードは動けばいいってもんじゃない」
>
> 田中先輩は過去のプロジェクトのコードを見せた。
>
> ```typescript
> // 悪い例
> const d = new Date();
> const x = u.filter(i => i.a > 0);
> function proc(data: any) { /* ... */ }
> ```
>
> 「このコード、何をしているか分かるか？」
>
> 「...全然分かりません」
>
> 「だろう？これを書いた本人も3ヶ月後にはきっと分からない。
> **良い命名は最高のドキュメント**なんだ」

---

## 命名規則（Naming Conventions）

### TypeScript/JavaScript の標準

| 対象 | 規則 | 例 |
|------|------|-----|
| 変数 | camelCase | `userName`, `totalAmount` |
| 関数 | camelCase（動詞で始める） | `fetchData`, `validateInput` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_ENDPOINT` |
| クラス | PascalCase | `UserService`, `ApiClient` |
| インターフェース | PascalCase | `User`, `ProductResponse` |
| 型エイリアス | PascalCase | `UserId`, `HttpMethod` |
| ファイル名 | camelCase or kebab-case | `userService.ts`, `api-client.ts` |
| Enum | PascalCase（メンバーも） | `HttpStatus.NotFound` |

### 良い命名の原則

```typescript
// 1. 意味のある名前をつける
// 悪い例
const d = new Date();
const n = users.length;
const tmp = calculateTotal(items);

// 良い例
const currentDate = new Date();
const userCount = users.length;
const orderTotal = calculateTotal(items);

// 2. 動詞で始まる関数名
// 悪い例
function data() { /* ... */ }
function user(id: number) { /* ... */ }

// 良い例
function fetchData() { /* ... */ }
function findUserById(id: number) { /* ... */ }

// 3. 真偽値は is/has/can で始める
// 悪い例
const active = true;
const permission = user.role === "admin";

// 良い例
const isActive = true;
const hasPermission = user.role === "admin";
const canEdit = hasPermission && isActive;
```

---

## 避けるべき命名パターン

```typescript
// 1. 省略しすぎ
const usrNm = "田中";     // 悪い
const userName = "田中";    // 良い

// 2. 数字の接尾辞
const data1 = fetch("/api/users");
const data2 = fetch("/api/posts");
// ↓
const userData = fetch("/api/users");
const postData = fetch("/api/posts");

// 3. 型情報を名前に含めない
const userArray = [/* ... */];   // 悪い
const users = [/* ... */];        // 良い

const nameString = "田中";       // 悪い
const name = "田中";              // 良い

// 4. 否定形を避ける
const isNotActive = false;       // 悪い（二重否定になりやすい）
const isActive = true;            // 良い
```

---

## コードスタイル

### インデント

```typescript
// スペース2つが TypeScript/JavaScript の標準
function processOrder(order: Order): void {
  if (order.status === "pending") {
    const total = calculateTotal(order.items);
    sendConfirmation(order.email, total);
  }
}
```

### セミコロン

```typescript
// あり（推奨: 多くのプロジェクトで採用）
const name = "田中";
const age = 28;

// なし（一部のプロジェクトで採用）
const name = "田中"
const age = 28
```

> プロジェクトのルールに従いましょう。ESLint/Prettier で統一するのがベストです。

### 一貫性が最も重要

```typescript
// プロジェクト内で統一する
// 悪い例: スタイルが混在
const user_name = "田中";      // snake_case
const userAge = 28;              // camelCase
const UserEmail = "a@b.com";    // PascalCase

// 良い例: 全て camelCase で統一
const userName = "田中";
const userAge = 28;
const userEmail = "a@b.com";
```

---

## コメントの書き方

### 良いコメント

```typescript
// なぜこの処理が必要かを説明
// 税率は2024年10月時点の軽減税率（食品8%）を適用
const TAX_RATE = 0.08;

// TODO: パフォーマンス改善が必要（1000件超でタイムアウト）
function processLargeDataset(data: unknown[]): void {
  // ...
}

/**
 * ユーザーの年齢を検証する
 * @param age - 検証する年齢
 * @returns 有効な年齢なら true
 */
function isValidAge(age: number): boolean {
  return age >= 0 && age <= 150;
}
```

### 不要なコメント

```typescript
// 悪い例: コードを読めば分かることを書いている
const count = 0; // カウントを0に設定
users.push(newUser); // ユーザーを追加

// 良い例: コード自体が説明になっている（コメント不要）
const initialCount = 0;
users.push(newUser);
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 変数名 | camelCase、意味のある名前 |
| 関数名 | camelCase、動詞で始める |
| 定数 | UPPER_SNAKE_CASE |
| クラス/型 | PascalCase |
| 真偽値 | is/has/can で始める |
| コメント | 「なぜ」を書く、「何を」は書かない |

### チェックリスト

- [ ] 各種命名規則を正しく使い分けられる
- [ ] 意味のある変数名・関数名をつけられる
- [ ] 省略しすぎない名前をつけられる
- [ ] コメントは「なぜ」を説明するものだと理解した

---

## 次のステップへ

命名規則を学びました。

次のセクションでは、**SOLID原則**の基本を学びます。
良い設計の原則を知ることで、保守しやすいコードの構造が見えてきます。

---

*推定読了時間: 20分*
