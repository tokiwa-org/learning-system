# モジュールとパッケージ管理

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 2
subStep: 4
title: "モジュールとパッケージ管理"
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

> 「コードが増えてきたら、1つのファイルに全部書くわけにはいかないだろう？」
>
> 田中先輩はプロジェクトのディレクトリ構造を見せた。
>
> ```
> src/
> ├── index.ts        # エントリーポイント
> ├── utils/           # ユーティリティ
> ├── services/        # ビジネスロジック
> └── types/           # 型定義
> ```
>
> 「モジュールシステムを使えば、コードを機能ごとに分割できる。
> そしてnpmを使えば、世界中のエンジニアが作ったライブラリを活用できる」

---

## import / export の基本

### 名前付きエクスポート（Named Export）

```typescript
// src/utils/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export const PI = 3.14159;
```

```typescript
// src/index.ts
import { add, multiply, PI } from "./utils/math";

console.log(add(3, 5));       // 8
console.log(multiply(4, 6));   // 24
console.log(PI);               // 3.14159
```

### デフォルトエクスポート（Default Export）

```typescript
// src/services/UserService.ts
export default class UserService {
  getUser(id: number): string {
    return `User #${id}`;
  }
}
```

```typescript
// src/index.ts
import UserService from "./services/UserService";

const service = new UserService();
console.log(service.getUser(1)); // "User #1"
```

### 使い分け

| 種類 | 構文 | 用途 |
|------|------|------|
| 名前付きエクスポート | `export function ...` | 複数の機能を公開する場合 |
| デフォルトエクスポート | `export default ...` | 1ファイル1機能の場合 |
| 全てインポート | `import * as utils from ...` | 名前空間として使う場合 |

```typescript
// 全てをまとめてインポート
import * as math from "./utils/math";
console.log(math.add(1, 2));
console.log(math.PI);

// 名前を変えてインポート
import { add as addNumbers } from "./utils/math";
```

---

## 型のエクスポート

```typescript
// src/types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserRole = "admin" | "editor" | "viewer";

// 型だけをエクスポート（明示的）
export type { User, UserRole };
```

```typescript
// src/services/user.ts
import type { User, UserRole } from "../types/user";

function createUser(name: string, role: UserRole): User {
  return { id: Date.now(), name, email: `${name}@example.com` };
}
```

> **`import type`**: 型だけをインポートする場合は `import type` を使います。コンパイル後のJavaScriptに不要なインポートが残りません。

---

## npm: パッケージ管理

### package.json の理解

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My first TypeScript project",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0",
    "@types/node": "^20.0.0"
  }
}
```

| セクション | 説明 |
|-----------|------|
| `dependencies` | 本番環境で必要なパッケージ |
| `devDependencies` | 開発時のみ必要なパッケージ |
| `scripts` | `npm run xxx` で実行するコマンド |

### 基本的なnpmコマンド

```bash
# パッケージのインストール
npm install axios                # dependencies に追加
npm install -D jest @types/jest  # devDependencies に追加

# 全パッケージをインストール（package.json から）
npm install

# パッケージの削除
npm uninstall axios

# パッケージの更新
npm update

# 脆弱性のチェック
npm audit
```

### node_modules ディレクトリ

```
my-project/
├── node_modules/      # インストールされたパッケージ（gitに含めない）
├── package.json       # パッケージの一覧
├── package-lock.json  # 正確なバージョンの記録（gitに含める）
└── src/
```

> **重要**: `node_modules/` は `.gitignore` に追加します。`package-lock.json` はGitに含めます（チーム全員が同じバージョンを使うため）。

---

## よく使うパッケージ

### 実務でよく使われるパッケージ

| パッケージ | 用途 | インストール |
|-----------|------|------------|
| axios | HTTPクライアント | `npm install axios` |
| dotenv | 環境変数管理 | `npm install dotenv` |
| zod | バリデーション | `npm install zod` |
| date-fns | 日付操作 | `npm install date-fns` |
| uuid | UUID生成 | `npm install uuid` |
| jest | テスト | `npm install -D jest` |

### axios の使い方

```typescript
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

// GET リクエスト
async function getUsers(): Promise<User[]> {
  const response = await axios.get<User[]>("https://api.example.com/users");
  return response.data; // axios は自動的にJSONをパースする
}

// POST リクエスト
async function createUser(name: string, email: string): Promise<User> {
  const response = await axios.post<User>("https://api.example.com/users", {
    name,
    email,
  });
  return response.data;
}
```

### dotenv の使い方

```typescript
// .env ファイル
// API_KEY=your-secret-key
// API_URL=https://api.example.com

import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.API_KEY;
const apiUrl = process.env.API_URL;

if (!apiKey || !apiUrl) {
  throw new Error("環境変数が設定されていません");
}
```

---

## プロジェクト構成のベストプラクティス

```
src/
├── index.ts           # エントリーポイント
├── types/
│   └── index.ts       # 型定義をまとめてエクスポート
├── utils/
│   ├── string.ts      # 文字列ユーティリティ
│   └── date.ts        # 日付ユーティリティ
├── services/
│   ├── UserService.ts # ユーザー関連のビジネスロジック
│   └── ApiClient.ts   # API通信
└── config/
    └── index.ts       # 設定値
```

### インデックスファイルによる再エクスポート

```typescript
// src/utils/index.ts
export { add, multiply } from "./math";
export { formatDate } from "./date";
export { capitalize } from "./string";
```

```typescript
// src/index.ts
// ディレクトリ名だけでインポートできる
import { add, formatDate, capitalize } from "./utils";
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Named Export | `export function ...` で複数の機能を公開 |
| Default Export | `export default ...` で1つの機能を公開 |
| import type | 型だけをインポート |
| npm install | パッケージのインストール |
| dependencies | 本番で必要なパッケージ |
| devDependencies | 開発時のみ必要なパッケージ |
| node_modules | .gitignore に追加 |

### チェックリスト

- [ ] import/export でモジュールを分割できる
- [ ] npm install でパッケージをインストールできる
- [ ] package.json の dependencies と devDependencies の違いを理解した
- [ ] 型のインポートに import type を使える
- [ ] プロジェクトのディレクトリ構成を設計できる

---

## 次のステップへ

モジュールとパッケージ管理を理解しました。

次はいよいよ**演習**です。
ここまで学んだ文字列操作、配列メソッド、非同期処理、モジュールを全て組み合わせて、
実用的なCLIツールを作りましょう。

---

*推定読了時間: 30分*
