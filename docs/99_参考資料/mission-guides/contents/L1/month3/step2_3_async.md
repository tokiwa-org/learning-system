# 非同期処理を理解しよう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 2
subStep: 3
title: "非同期処理を理解しよう"
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

> 「APIからデータを取得する処理を書いてみよう」
>
> 田中先輩がコードを指差した。
>
> 「でも注意がある。APIへのリクエストは**時間がかかる**。
> その間プログラムが止まってしまったら、ユーザーは何も操作できなくなる」
>
> 「じゃあ、どうすれば？」
>
> 「**非同期処理**だ。リクエストを送ったら結果を待たずに次の処理を進め、
> 結果が返ってきたら改めて処理する。これがJavaScript/TypeScriptの基本中の基本だ」

---

## 同期処理と非同期処理

### 同期処理（Synchronous）

```
処理A → 完了 → 処理B → 完了 → 処理C → 完了
```

各処理が終わるまで次に進めません。

### 非同期処理（Asynchronous）

```
処理A（開始） → 処理B（開始） → 処理C（開始）
                                   ↓
                         処理Aの結果が返ってきた → 後続処理
```

結果を待たずに次の処理を開始できます。

### なぜ非同期が必要なのか

| 操作 | 所要時間 | 同期だと... |
|------|---------|------------|
| API呼び出し | 100ms〜数秒 | その間画面がフリーズ |
| ファイル読み込み | 数ms〜数百ms | その間何もできない |
| DB問い合わせ | 数ms〜数秒 | 他のリクエストが処理できない |

---

## Promise

「将来、値が返ってくることを約束する」オブジェクトです。

### Promise の3つの状態

```
pending（保留中）→ fulfilled（成功）→ 値が取得できる
                → rejected（失敗）→ エラー情報が取得できる
```

### Promise の基本

```typescript
// Promise を作る
const promise = new Promise<string>((resolve, reject) => {
  // 非同期処理をシミュレーション
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("データを取得しました"); // 成功
    } else {
      reject(new Error("取得に失敗しました")); // 失敗
    }
  }, 1000);
});

// Promise の結果を使う
promise
  .then((result) => {
    console.log(result); // "データを取得しました"
  })
  .catch((error) => {
    console.error(error.message);
  });
```

---

## async/await

Promise をより読みやすく書くための構文です。

```typescript
// async 関数: Promise を返す関数
async function fetchUserData(userId: number): Promise<string> {
  // await: Promise の結果が返るまで待つ
  const response = await fetch(`https://api.example.com/users/${userId}`);
  const data = await response.json();
  return data.name;
}

// 呼び出し
async function main(): Promise<void> {
  const name = await fetchUserData(1);
  console.log(name);
}

main();
```

### then/catch と async/await の比較

```typescript
// then/catch 版
function getUserOld(id: number): Promise<string> {
  return fetch(`/api/users/${id}`)
    .then((response) => response.json())
    .then((data) => data.name)
    .catch((error) => {
      console.error(error);
      return "Unknown";
    });
}

// async/await 版（推奨: 読みやすい）
async function getUser(id: number): Promise<string> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error(error);
    return "Unknown";
  }
}
```

---

## エラーハンドリング: try/catch

```typescript
async function fetchData(url: string): Promise<unknown> {
  try {
    const response = await fetch(url);

    // HTTPステータスのチェック
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`データ取得に失敗: ${error.message}`);
    }
    throw error; // エラーを再スロー
  }
}

// 使用例
async function main(): Promise<void> {
  try {
    const data = await fetchData("https://api.example.com/users");
    console.log("取得成功:", data);
  } catch {
    console.log("取得失敗。リトライします...");
  }
}
```

### try/catch の構造

```typescript
try {
  // エラーが起きるかもしれない処理
} catch (error) {
  // エラーが起きたときの処理
} finally {
  // 成功・失敗に関わらず実行される処理（オプション）
}
```

---

## fetch API

Web標準のHTTPクライアントです。

```typescript
// GET リクエスト
async function getUsers(): Promise<void> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();
  console.log(users);
}

// POST リクエスト
async function createUser(name: string, email: string): Promise<void> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  const newUser = await response.json();
  console.log("作成完了:", newUser);
}

// レスポンスの型を定義して使う
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const users: User[] = await response.json();
  return users;
}
```

---

## 複数の非同期処理

### Promise.all: 全て完了を待つ

```typescript
async function fetchAllData(): Promise<void> {
  // 3つのAPIを同時にリクエスト
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users").then((r) => r.json()),
    fetch("/api/posts").then((r) => r.json()),
    fetch("/api/comments").then((r) => r.json()),
  ]);

  console.log("ユーザー数:", users.length);
  console.log("投稿数:", posts.length);
  console.log("コメント数:", comments.length);
}
// 3つ同時にリクエストするため、逐次実行より高速
```

### Promise.allSettled: 全ての結果を取得（失敗含む）

```typescript
async function fetchWithFallback(): Promise<void> {
  const results = await Promise.allSettled([
    fetch("/api/users"),
    fetch("/api/unreliable-service"), // 失敗するかも
    fetch("/api/posts"),
  ]);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`リクエスト${index}: 成功`);
    } else {
      console.log(`リクエスト${index}: 失敗 - ${result.reason}`);
    }
  });
}
```

---

## 実践パターン

### リトライ付きfetch

```typescript
async function fetchWithRetry(
  url: string,
  maxRetries: number = 3
): Promise<unknown> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log(`試行 ${attempt}/${maxRetries} 失敗`);
      if (attempt === maxRetries) {
        throw error;
      }
      // 次のリトライまで待機（exponential backoff）
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 非同期処理 | 結果を待たずに次の処理を進める仕組み |
| Promise | 将来の値を表すオブジェクト（pending/fulfilled/rejected） |
| async/await | Promise を同期的に読めるようにする構文 |
| try/catch | 非同期処理のエラーハンドリング |
| fetch | Web標準のHTTPクライアント |
| Promise.all | 複数の非同期処理を同時実行 |

### チェックリスト

- [ ] 同期処理と非同期処理の違いを説明できる
- [ ] async/await を使って非同期関数を書ける
- [ ] try/catch でエラーを適切に処理できる
- [ ] fetch API でGET/POSTリクエストを送れる
- [ ] Promise.all で複数リクエストを並列実行できる

---

## 次のステップへ

非同期処理を理解しました。

次のセクションでは、**モジュールとパッケージ管理**を学びます。
import/export やnpmの使い方を覚えて、コードを整理し、
外部ライブラリを活用できるようになりましょう。

---

*推定読了時間: 30分*
