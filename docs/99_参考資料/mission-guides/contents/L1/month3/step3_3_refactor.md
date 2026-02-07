# リファクタリングの技法

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 3
subStep: 3
title: "リファクタリングの技法"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「リファクタリングって聞いたことあるか？」
>
> 「コードを書き直すことですか？」
>
> 田中先輩は首を振った。
>
> 「**外部の動作を変えずに、内部の構造を改善する**ことだ。
> 機能を追加するわけでもなく、バグを修正するわけでもない。
> でもコードが読みやすく、変更しやすくなる。地味だが最も重要な作業の1つだ」

---

## 関数の抽出（Extract Function）

長い関数から一部を別の関数に切り出します。

### Before

```typescript
function processOrder(order: Order): void {
  // バリデーション
  if (!order.items || order.items.length === 0) {
    throw new Error("注文アイテムがありません");
  }
  if (!order.customerId) {
    throw new Error("顧客IDがありません");
  }

  // 合計計算
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
  }
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;

  // 出力
  console.log(`注文ID: ${order.id}`);
  console.log(`小計: ${subtotal}円`);
  console.log(`税: ${tax}円`);
  console.log(`合計: ${total}円`);
}
```

### After

```typescript
function validateOrder(order: Order): void {
  if (!order.items || order.items.length === 0) {
    throw new Error("注文アイテムがありません");
  }
  if (!order.customerId) {
    throw new Error("顧客IDがありません");
  }
}

function calculateOrderTotal(items: OrderItem[]): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.floor(subtotal * 0.1);
  return { subtotal, tax, total: subtotal + tax };
}

function printOrderSummary(orderId: string, totals: { subtotal: number; tax: number; total: number }): void {
  console.log(`注文ID: ${orderId}`);
  console.log(`小計: ${totals.subtotal}円`);
  console.log(`税: ${totals.tax}円`);
  console.log(`合計: ${totals.total}円`);
}

function processOrder(order: Order): void {
  validateOrder(order);
  const totals = calculateOrderTotal(order.items);
  printOrderSummary(order.id, totals);
}
```

> **判断基準**: 「この部分は何をしている？」とコメントを書きたくなったら、関数に抽出するサインです。

---

## ガード句（Guard Clauses）

条件分岐のネストを減らすテクニックです。

### Before: ネストが深い

```typescript
function getDiscount(user: User): number {
  if (user) {
    if (user.isActive) {
      if (user.membershipLevel === "gold") {
        return 0.2;
      } else if (user.membershipLevel === "silver") {
        return 0.1;
      } else {
        return 0.05;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}
```

### After: ガード句で早期リターン

```typescript
function getDiscount(user: User | null): number {
  if (!user) return 0;
  if (!user.isActive) return 0;

  switch (user.membershipLevel) {
    case "gold":   return 0.2;
    case "silver": return 0.1;
    default:       return 0.05;
  }
}
```

> **ルール**: 異常系を先に処理して早期リターンし、正常系をフラットに書く。

---

## 条件式の簡素化

### 複雑な条件を関数に抽出

```typescript
// Before: 条件が読みにくい
if (user.age >= 18 && user.age <= 65 && user.isActive && !user.isBanned && user.emailVerified) {
  grantAccess(user);
}

// After: 条件を関数にまとめる
function isEligibleForAccess(user: User): boolean {
  const isAdult = user.age >= 18 && user.age <= 65;
  const isActiveAccount = user.isActive && !user.isBanned;
  const isVerified = user.emailVerified;

  return isAdult && isActiveAccount && isVerified;
}

if (isEligibleForAccess(user)) {
  grantAccess(user);
}
```

### 否定形を避ける

```typescript
// Before: 二重否定で混乱しやすい
if (!isNotActive) {
  // ...
}

// After: 肯定形で分かりやすく
if (isActive) {
  // ...
}
```

---

## マジックナンバーの排除

```typescript
// Before: 数値の意味が不明
if (password.length < 8) {
  throw new Error("パスワードが短すぎます");
}
if (retryCount > 3) {
  throw new Error("リトライ上限を超えました");
}
const tax = price * 0.1;

// After: 定数に名前をつける
const MIN_PASSWORD_LENGTH = 8;
const MAX_RETRY_COUNT = 3;
const TAX_RATE = 0.1;

if (password.length < MIN_PASSWORD_LENGTH) {
  throw new Error(`パスワードは${MIN_PASSWORD_LENGTH}文字以上必要です`);
}
if (retryCount > MAX_RETRY_COUNT) {
  throw new Error(`リトライは最大${MAX_RETRY_COUNT}回です`);
}
const tax = price * TAX_RATE;
```

---

## 重複の除去

```typescript
// Before: 似たようなコードが繰り返されている
function formatUserForDisplay(user: User): string {
  const name = `${user.lastName} ${user.firstName}`;
  const age = `${user.age}歳`;
  return `${name} (${age})`;
}

function formatUserForEmail(user: User): string {
  const name = `${user.lastName} ${user.firstName}`;
  return `${name} 様`;
}

function formatUserForLog(user: User): string {
  const name = `${user.lastName} ${user.firstName}`;
  return `[User] ${name} (ID: ${user.id})`;
}

// After: 共通部分を抽出
function getFullName(user: User): string {
  return `${user.lastName} ${user.firstName}`;
}

function formatUserForDisplay(user: User): string {
  return `${getFullName(user)} (${user.age}歳)`;
}

function formatUserForEmail(user: User): string {
  return `${getFullName(user)} 様`;
}

function formatUserForLog(user: User): string {
  return `[User] ${getFullName(user)} (ID: ${user.id})`;
}
```

---

## リファクタリングの安全な進め方

1. **テストを先に書く**（または確認する）
2. **小さな変更を1つずつ行う**
3. **変更のたびにテストを実行**
4. **動作が変わっていないことを確認**
5. **コミットする**

```
テスト確認 → 小さな変更 → テスト実行 → コミット → 繰り返し
```

> **最重要ルール**: リファクタリングと機能追加を同時にやらない。

---

## まとめ

| テクニック | 内容 |
|-----------|------|
| 関数の抽出 | 長い関数から意味のある塊を切り出す |
| ガード句 | 異常系を先に処理して早期リターン |
| 条件の簡素化 | 複雑な条件を関数や変数にまとめる |
| マジックナンバー排除 | 数値に意味のある名前をつける |
| 重複の除去 | 共通部分を関数に抽出 |

### チェックリスト

- [ ] 長い関数から小さな関数を抽出できる
- [ ] ガード句でネストを減らせる
- [ ] マジックナンバーを定数に置き換えられる
- [ ] 重複コードを見つけて共通化できる
- [ ] リファクタリングの安全な手順を理解した

---

## 次のステップへ

リファクタリングの技法を学びました。

次のセクションでは、**エラーハンドリング**のベストプラクティスを学びます。
エラーを適切に処理することは、堅牢なソフトウェアの基本です。

---

*推定読了時間: 25分*
