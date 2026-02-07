# エラーハンドリングのベストプラクティス

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 3
subStep: 4
title: "エラーハンドリングのベストプラクティス"
itemType: LESSON
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「本番環境で一番怖いのは何だと思う？」
>
> 「バグですか？」
>
> 「バグは直せる。一番怖いのは**エラーを握りつぶすこと**だ。
> エラーが起きたのに何も表示されず、何も記録されず、
> 気づいた時にはデータが壊れている... そんな事故は後を絶たない」

---

## エラーの基本: try/catch/finally

```typescript
try {
  // エラーが起きるかもしれない処理
  const data = JSON.parse(jsonString);
  processData(data);
} catch (error) {
  // エラーが起きた時の処理
  if (error instanceof SyntaxError) {
    console.error("JSONの形式が不正です:", error.message);
  } else if (error instanceof Error) {
    console.error("予期しないエラー:", error.message);
  }
} finally {
  // 必ず実行される（成功・失敗に関係なく）
  cleanup();
}
```

---

## カスタムエラークラス

```typescript
// 独自のエラークラスを定義
class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(
    public readonly resource: string,
    public readonly id: string | number
  ) {
    super(`${resource} (ID: ${id}) が見つかりません`);
    this.name = "NotFoundError";
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 使用例
function findUser(id: number): User {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new NotFoundError("User", id);
  }
  return user;
}

// エラーの種類に応じた処理
try {
  const user = findUser(999);
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log(`${error.resource}が見つかりません`);
  } else if (error instanceof ValidationError) {
    console.log(`入力エラー: ${error.field} - ${error.message}`);
  } else {
    throw error; // 未知のエラーは再スロー
  }
}
```

---

## エラーハンドリングのルール

### 1. エラーを握りつぶさない

```typescript
// 絶対にやってはいけない
try {
  riskyOperation();
} catch (error) {
  // 何もしない ← 最悪のパターン
}

// 最低限ログは残す
try {
  riskyOperation();
} catch (error) {
  console.error("操作に失敗しました:", error);
  // 必要に応じてエラーを再スロー
  throw error;
}
```

### 2. catch (error) の型チェック

```typescript
// TypeScript では catch の error は unknown 型
try {
  someOperation();
} catch (error) {
  // 良い例: 型チェックしてからアクセス
  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error("不明なエラー:", error);
  }
}
```

### 3. エラーは適切なレベルで処理する

```typescript
// 低レベル: エラーをスローするだけ
function parseConfig(json: string): Config {
  try {
    return JSON.parse(json);
  } catch {
    throw new ValidationError("設定ファイルのJSON形式が不正です", "config");
  }
}

// 高レベル: エラーをキャッチしてユーザーに通知
async function loadApp(): Promise<void> {
  try {
    const config = parseConfig(rawConfig);
    await startServer(config);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`設定エラー: ${error.message}`);
      console.error("設定ファイルを確認してください");
      process.exit(1);
    }
    throw error;
  }
}
```

### 4. 非同期処理のエラーハンドリング

```typescript
// async/await では try/catch を使う
async function fetchUser(id: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new ApiError(`ユーザー取得失敗`, response.status);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("ネットワークエラー", 0);
  }
}
```

---

## エラーハンドリングパターン

### Result型パターン（例外を使わない方法）

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { ok: false, error: new Error("0で割ることはできません") };
  }
  return { ok: true, value: a / b };
}

const result = divide(10, 0);
if (result.ok) {
  console.log(`結果: ${result.value}`);
} else {
  console.error(`エラー: ${result.error.message}`);
}
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| try/catch | エラーをキャッチして適切に処理する |
| カスタムエラー | Error を継承して独自エラーを定義 |
| 握りつぶし禁止 | catch で何もしないのは絶対NG |
| 型チェック | `instanceof` でエラーの種類を判定 |
| 適切なレベル | 低レベルはスロー、高レベルでキャッチ |

### チェックリスト

- [ ] try/catch/finally を適切に使える
- [ ] カスタムエラークラスを作れる
- [ ] エラーを握りつぶしてはいけない理由を理解した
- [ ] instanceof でエラーの種類を判定できる

---

## 次のステップへ

エラーハンドリングの基本を学びました。

次のセクションでは、**ESLint/Prettier**を使ってコード品質を自動的に守る方法を学びます。

---

*推定読了時間: 15分*
