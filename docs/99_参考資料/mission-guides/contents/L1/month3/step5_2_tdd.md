# テスト駆動開発の基本

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 5
subStep: 2
title: "テスト駆動開発の基本"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「コードを書く前に、テストを先に書く」
>
> 田中先輩の言葉に驚いた。
>
> 「実装がないのにテストを書くんですか？」
>
> 「そうだ。**TDD（テスト駆動開発）**というやり方だ。
> 先にテストを書くことで、"何を作るべきか"が明確になる。
> テストがあれば、リファクタリングも安心してできる。
> 最初は違和感があるだろうが、慣れると手放せなくなるよ」

---

## TDD のサイクル: Red → Green → Refactor

```
1. Red:     失敗するテストを書く（まだ実装がない）
2. Green:   テストを通す最小限のコードを書く
3. Refactor: コードを綺麗にする（テストが通ることを確認）
4. 繰り返し
```

```
  ┌─────────┐
  │  Red    │ ← テストを書く（失敗する）
  └────┬────┘
       ↓
  ┌─────────┐
  │  Green  │ ← 最小限のコードでテストを通す
  └────┬────┘
       ↓
  ┌──────────┐
  │ Refactor │ ← コードを改善（テストで安全確認）
  └────┬─────┘
       ↓
    最初に戻る
```

---

## Jest の基本

TypeScriptのテストフレームワークとして最も広く使われています。

### セットアップ

```bash
# Jest + TypeScript対応をインストール
npm install -D jest ts-jest @types/jest

# jest.config.js を作成
npx ts-jest config:init
```

### jest.config.js

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
};
```

### package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## テストの書き方

### 基本構造: describe / it / expect

```typescript
// src/utils/math.test.ts
import { add, multiply } from "./math";

describe("add", () => {
  it("2つの正の数を足せる", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("負の数を足せる", () => {
    expect(add(-1, 1)).toBe(0);
  });

  it("0を足しても変わらない", () => {
    expect(add(5, 0)).toBe(5);
  });
});

describe("multiply", () => {
  it("2つの数を掛けられる", () => {
    expect(multiply(3, 4)).toBe(12);
  });

  it("0を掛けると0になる", () => {
    expect(multiply(5, 0)).toBe(0);
  });
});
```

### よく使うマッチャー

| マッチャー | 用途 | 例 |
|-----------|------|-----|
| `toBe` | 厳密等価 | `expect(1 + 1).toBe(2)` |
| `toEqual` | 深い比較（オブジェクト） | `expect(obj).toEqual({a: 1})` |
| `toBeTruthy` | truthy な値 | `expect("hello").toBeTruthy()` |
| `toBeFalsy` | falsy な値 | `expect("").toBeFalsy()` |
| `toContain` | 配列・文字列に含む | `expect([1,2,3]).toContain(2)` |
| `toThrow` | 例外を投げる | `expect(() => fn()).toThrow()` |
| `toHaveLength` | 配列の長さ | `expect([1,2]).toHaveLength(2)` |
| `toBeGreaterThan` | 数値の大小 | `expect(10).toBeGreaterThan(5)` |

---

## TDD 実践: バリデーション関数

### Step 1: Red - テストを先に書く

```typescript
// src/validation.test.ts
import { validateEmail } from "./validation";

describe("validateEmail", () => {
  it("正しいメールアドレスを受け付ける", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  it("@がないメールを拒否する", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });

  it("空文字列を拒否する", () => {
    expect(validateEmail("")).toBe(false);
  });

  it("ドメインがないメールを拒否する", () => {
    expect(validateEmail("user@")).toBe(false);
  });

  it("ユーザー名がないメールを拒否する", () => {
    expect(validateEmail("@example.com")).toBe(false);
  });
});
```

```bash
npm test
# FAIL: validateEmail is not defined
# → Red: テストが失敗（まだ実装がない）
```

### Step 2: Green - 最小限の実装

```typescript
// src/validation.ts
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  if (parts[0].length === 0) return false;
  if (parts[1].length === 0) return false;
  return true;
}
```

```bash
npm test
# PASS: All tests passed
# → Green: テストが通った
```

### Step 3: Refactor - コードを改善

```typescript
// src/validation.ts（リファクタリング後）
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
```

```bash
npm test
# PASS: All tests still pass
# → Refactor: テストが通ることを確認してリファクタリング完了
```

---

## テストを書くコツ

### Arrange-Act-Assert パターン

```typescript
it("タスクを完了にできる", () => {
  // Arrange: 準備
  const task: Task = { id: 1, title: "テスト", completed: false, tags: [] };

  // Act: 実行
  const result = completeTask(task);

  // Assert: 検証
  expect(result.completed).toBe(true);
});
```

### テスト名は「日本語で具体的に」

```typescript
// 悪い例
it("works", () => { ... });
it("test1", () => { ... });

// 良い例
it("空のタスクリストで検索すると空配列を返す", () => { ... });
it("存在しないIDで検索するとundefinedを返す", () => { ... });
it("タグが10個の時に追加するとエラーになる", () => { ... });
```

---

## 実行方法

```bash
# 全テスト実行
npm test

# 特定のファイルだけ
npx jest validation.test.ts

# ウォッチモード（ファイル変更時に自動実行）
npm run test:watch

# カバレッジレポート
npx jest --coverage
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| TDDサイクル | Red → Green → Refactor |
| Jest | describe / it / expect |
| マッチャー | toBe, toEqual, toThrow, toContain |
| AAA | Arrange（準備）→ Act（実行）→ Assert（検証） |
| テスト名 | 日本語で具体的に書く |

### チェックリスト

- [ ] TDDの3ステップ（Red-Green-Refactor）を説明できる
- [ ] Jest でテストファイルを作成して実行できる
- [ ] describe/it/expect の構造でテストを書ける
- [ ] よく使うマッチャーを使い分けられる
- [ ] テストを先に書いてから実装する流れを実践できる

---

## 次のステップへ

TDDの基本を学びました。

次のセクションでは、**REST APIクライアント**の作り方を学びます。
実際のAPIとやり取りするコードをTDDで作ってみましょう。

---

*推定読了時間: 30分*
