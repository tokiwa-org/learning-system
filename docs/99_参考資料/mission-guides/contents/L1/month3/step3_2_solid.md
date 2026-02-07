# SOLID原則の基本

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 3
subStep: 2
title: "SOLID原則の基本"
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

> 「コードが動くだけでは不十分だ。変更しやすいコードを書く必要がある」
>
> 田中先輩はホワイトボードに5つの文字を書いた。
>
> ```
> S - O - L - I - D
> ```
>
> 「これはオブジェクト指向設計の5つの原則だ。全部を深く理解するのは上級者の仕事だが、
> 最初の"S"と、関連するDRY、KISS、YAGNIだけは今すぐ使いこなしてほしい」

---

## 単一責任の原則（Single Responsibility Principle）

**1つのモジュール（関数・クラス）は、1つのことだけを担当する。**

### 悪い例: 1つの関数が複数の責任を持つ

```typescript
// 悪い例: ユーザー作成 + バリデーション + メール送信 + ログ
function createUser(name: string, email: string): void {
  // バリデーション
  if (!name || name.length < 2) {
    throw new Error("名前が短すぎます");
  }
  if (!email.includes("@")) {
    throw new Error("メールアドレスが不正です");
  }

  // DB保存（シミュレーション）
  const user = { id: Date.now(), name, email };
  console.log("DBに保存:", user);

  // メール送信
  console.log(`${email}に確認メールを送信`);

  // ログ記録
  console.log(`[${new Date().toISOString()}] ユーザー作成: ${name}`);
}
```

### 良い例: 責任を分離する

```typescript
// バリデーション
function validateUser(name: string, email: string): void {
  if (!name || name.length < 2) {
    throw new Error("名前が短すぎます");
  }
  if (!email.includes("@")) {
    throw new Error("メールアドレスが不正です");
  }
}

// DB保存
function saveUser(name: string, email: string): { id: number; name: string; email: string } {
  return { id: Date.now(), name, email };
}

// メール送信
function sendWelcomeEmail(email: string): void {
  console.log(`${email}に確認メールを送信`);
}

// ログ記録
function logAction(action: string): void {
  console.log(`[${new Date().toISOString()}] ${action}`);
}

// 組み合わせ
function createUser(name: string, email: string): void {
  validateUser(name, email);
  const user = saveUser(name, email);
  sendWelcomeEmail(user.email);
  logAction(`ユーザー作成: ${user.name}`);
}
```

> **メリット**: 各関数が小さく、テストしやすく、再利用しやすい。

---

## オープン・クローズドの原則（Open/Closed Principle）

**拡張に対してオープン、修正に対してクローズド。**

既存のコードを変更せずに、新しい機能を追加できる設計を目指します。

```typescript
// 悪い例: 新しい割引タイプを追加するたびに関数を修正する必要がある
function calculateDiscount(type: string, price: number): number {
  if (type === "student") {
    return price * 0.1;
  } else if (type === "senior") {
    return price * 0.15;
  } else if (type === "member") {
    return price * 0.05;
  }
  return 0;
}

// 良い例: 新しい割引タイプを追加しても既存コードを変更しない
interface DiscountStrategy {
  calculate(price: number): number;
}

const discounts: Record<string, DiscountStrategy> = {
  student: { calculate: (price) => price * 0.1 },
  senior: { calculate: (price) => price * 0.15 },
  member: { calculate: (price) => price * 0.05 },
};

function calculateDiscount(type: string, price: number): number {
  return discounts[type]?.calculate(price) ?? 0;
}

// 新しい割引を追加（既存コードの変更不要）
discounts.employee = { calculate: (price) => price * 0.2 };
```

---

## DRY（Don't Repeat Yourself）

**同じコードを2回以上書かない。**

```typescript
// 悪い例: 同じロジックが重複
function formatUserName(firstName: string, lastName: string): string {
  return `${lastName} ${firstName}`;
}

function formatUserGreeting(firstName: string, lastName: string): string {
  return `こんにちは、${lastName} ${firstName}さん`;
}

function formatUserEmail(firstName: string, lastName: string, domain: string): string {
  return `${lastName} ${firstName} <${firstName.toLowerCase()}@${domain}>`;
}

// 良い例: 共通部分を抽出
function getFullName(firstName: string, lastName: string): string {
  return `${lastName} ${firstName}`;
}

function formatUserGreeting(firstName: string, lastName: string): string {
  return `こんにちは、${getFullName(firstName, lastName)}さん`;
}

function formatUserEmail(firstName: string, lastName: string, domain: string): string {
  return `${getFullName(firstName, lastName)} <${firstName.toLowerCase()}@${domain}>`;
}
```

---

## KISS（Keep It Simple, Stupid）

**シンプルに保つ。複雑にしない。**

```typescript
// 悪い例: 不必要に複雑
function isEven(n: number): boolean {
  return n % 2 === 0 ? true : false;
}

// 良い例: シンプル
function isEven(n: number): boolean {
  return n % 2 === 0;
}

// 悪い例: 過度な抽象化
class StringValidator {
  private validators: ((s: string) => boolean)[] = [];
  addValidator(fn: (s: string) => boolean): this {
    this.validators.push(fn);
    return this;
  }
  validate(s: string): boolean {
    return this.validators.every((fn) => fn(s));
  }
}

// 良い例: 必要十分なシンプルさ
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## YAGNI（You Aren't Gonna Need It）

**今必要ないものは作らない。**

```typescript
// 悪い例: 将来使うかもしれない機能を先に実装
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;          // 今は使わない
  address?: string;        // 今は使わない
  preferences?: {          // 今は使わない
    theme: string;
    language: string;
    notifications: boolean;
  };
  socialLinks?: {          // 今は使わない
    twitter?: string;
    github?: string;
  };
}

// 良い例: 今必要なものだけ
interface User {
  id: number;
  name: string;
  email: string;
}
// 必要になったときに拡張する
```

> **「将来必要になるかも」は、ほとんどの場合「必要にならない」。** 必要になった時点で追加すれば十分です。

---

## 原則のまとめ

| 原則 | 意味 | 覚え方 |
|------|------|--------|
| SRP | 1つのことだけ担当する | 「この関数は何をする？」が1文で説明できるか |
| OCP | 拡張しやすく、変更不要にする | if文の追加が必要なら設計を見直す |
| DRY | 同じコードを繰り返さない | コピペしたくなったら関数に抽出 |
| KISS | シンプルに保つ | 「もっと簡単に書けないか？」と自問する |
| YAGNI | 今必要ないものは作らない | 「今これが必要か？」と自問する |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 単一責任 | 1関数 = 1責任 |
| DRY | コピペ禁止、共通化する |
| KISS | シンプルが最強 |
| YAGNI | 必要な時に作る |
| OCP | 拡張しやすい構造にする |

### チェックリスト

- [ ] 単一責任の原則を適用して関数を分割できる
- [ ] DRY原則に従って重複コードを共通化できる
- [ ] KISSに従ってシンプルなコードを書ける
- [ ] YAGNIに従って不要な機能を作らない判断ができる

---

## 次のステップへ

設計原則の基本を学びました。

次のセクションでは、**リファクタリングの技法**を学びます。
既存のコードをより良くする具体的なテクニックを身につけましょう。

---

*推定読了時間: 25分*
