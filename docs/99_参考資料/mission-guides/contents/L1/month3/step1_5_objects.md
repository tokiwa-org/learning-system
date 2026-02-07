# オブジェクトと配列

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 1
subStep: 5
title: "オブジェクトと配列"
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

> 「プログラミングでは、データをどう構造化するかがとても重要だ」
>
> 田中先輩はAPIから返ってきたJSONデータを見せた。
>
> ```json
> {
>   "users": [
>     { "id": 1, "name": "田中", "skills": ["TypeScript", "React"] },
>     { "id": 2, "name": "佐藤", "skills": ["Python", "Django"] }
>   ]
> }
> ```
>
> 「現実のデータは、オブジェクトと配列の組み合わせで表現される。
> この構造を自在に操れるようになると、プログラミングが一気に楽しくなるぞ」

---

## オブジェクトリテラル

### 基本的なオブジェクト

```typescript
// オブジェクトリテラル
const user = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@example.com",
  age: 28,
};

// プロパティへのアクセス
console.log(user.name);        // "田中太郎"
console.log(user["email"]);    // "tanaka@example.com"（動的アクセス）
```

### interface でオブジェクトの型を定義

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  bio?: string; // オプショナル
}

const user: User = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@example.com",
  age: 28,
};
```

### ネストしたオブジェクト

```typescript
interface Address {
  prefecture: string;
  city: string;
  zip: string;
}

interface Employee {
  name: string;
  department: string;
  address: Address;
}

const employee: Employee = {
  name: "田中太郎",
  department: "開発部",
  address: {
    prefecture: "東京都",
    city: "渋谷区",
    zip: "150-0001",
  },
};

console.log(employee.address.city); // "渋谷区"
```

---

## 分割代入（Destructuring）

オブジェクトや配列から値を取り出す便利な構文です。

### オブジェクトの分割代入

```typescript
const user = {
  name: "田中太郎",
  age: 28,
  department: "開発部",
};

// 従来の書き方
const name = user.name;
const age = user.age;

// 分割代入（同じことを1行で）
const { name, age, department } = user;
console.log(name);       // "田中太郎"
console.log(department); // "開発部"

// 変数名を変える
const { name: userName, age: userAge } = user;
console.log(userName);   // "田中太郎"

// デフォルト値
const { name, role = "member" } = user;
console.log(role);       // "member"（user に role がないためデフォルト値）
```

### 配列の分割代入

```typescript
const colors = ["red", "green", "blue"];

// インデックスで取り出す
const [first, second, third] = colors;
console.log(first);  // "red"
console.log(second); // "green"

// 不要な要素をスキップ
const [, , last] = colors;
console.log(last);   // "blue"

// レスト要素
const [head, ...rest] = colors;
console.log(head);   // "red"
console.log(rest);   // ["green", "blue"]
```

### 関数の引数で分割代入

```typescript
interface Config {
  host: string;
  port: number;
  debug?: boolean;
}

// 引数を分割代入で受け取る
function startServer({ host, port, debug = false }: Config): void {
  console.log(`Server starting at ${host}:${port}`);
  if (debug) {
    console.log("Debug mode enabled");
  }
}

startServer({ host: "localhost", port: 3000, debug: true });
```

---

## スプレッド構文（Spread Operator）

`...` を使ってオブジェクトや配列を展開します。

### オブジェクトのスプレッド

```typescript
const defaults = {
  theme: "light",
  language: "ja",
  fontSize: 14,
};

// デフォルト値を上書き
const userSettings = {
  ...defaults,
  theme: "dark",         // 上書き
  notifications: true,   // 追加
};

console.log(userSettings);
// { theme: "dark", language: "ja", fontSize: 14, notifications: true }
```

### 配列のスプレッド

```typescript
const frontend = ["HTML", "CSS", "JavaScript"];
const backend = ["Node.js", "Express", "PostgreSQL"];

// 配列を結合
const fullStack = [...frontend, ...backend];
console.log(fullStack);
// ["HTML", "CSS", "JavaScript", "Node.js", "Express", "PostgreSQL"]

// 配列のコピー（元の配列を変更しない）
const copy = [...frontend];
copy.push("TypeScript");
console.log(frontend);  // ["HTML", "CSS", "JavaScript"]（元は変わらない）
console.log(copy);      // ["HTML", "CSS", "JavaScript", "TypeScript"]
```

### オブジェクトの不変更新

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

const user: User = { id: 1, name: "田中", age: 28 };

// 元のオブジェクトを変更せずに新しいオブジェクトを作る
const updatedUser: User = { ...user, age: 29 };

console.log(user.age);        // 28（元のまま）
console.log(updatedUser.age); // 29（新しいオブジェクト）
```

> **イミュータブル（不変）なデータ操作**: オブジェクトを直接変更するのではなく、スプレッド構文で新しいオブジェクトを作る方法は、バグを防ぐ重要なテクニックです。

---

## 配列の基本操作

```typescript
const fruits: string[] = ["apple", "banana", "cherry"];

// 追加
fruits.push("date");             // 末尾に追加
fruits.unshift("avocado");       // 先頭に追加

// 削除
const last = fruits.pop();       // 末尾から削除して返す
const first = fruits.shift();    // 先頭から削除して返す

// 検索
const index = fruits.indexOf("banana"); // インデックスを返す（見つからない場合-1）
const hasCherry = fruits.includes("cherry"); // true/false

// 長さ
console.log(fruits.length); // 配列の要素数

// スライス（元の配列は変更しない）
const sliced = fruits.slice(1, 3); // インデックス1から3の手前まで
```

---

## タプル型

固定長で各要素の型が決まっている配列です。

```typescript
// タプル: [string, number] の順で2要素
type Point = [number, number];
const origin: Point = [0, 0];
const position: Point = [10, 20];

// 名前付きタプル（読みやすさ向上）
type UserTuple = [id: number, name: string, active: boolean];
const userTuple: UserTuple = [1, "田中", true];

// 関数から複数の値を返す
function divide(a: number, b: number): [number, number] {
  return [Math.floor(a / b), a % b]; // [商, 余り]
}

const [quotient, remainder] = divide(10, 3);
console.log(`商: ${quotient}, 余り: ${remainder}`); // "商: 3, 余り: 1"
```

---

## Record 型とインデックスシグネチャ

動的なキーを持つオブジェクトの型定義です。

```typescript
// Record<キーの型, 値の型>
type ScoreBoard = Record<string, number>;

const scores: ScoreBoard = {
  math: 85,
  english: 92,
  science: 78,
};

// インデックスシグネチャ（同じことを別の書き方で）
interface Dictionary {
  [key: string]: string;
}

const translations: Dictionary = {
  hello: "こんにちは",
  goodbye: "さようなら",
};
```

---

## 実践：データ構造を設計する

APIレスポンスを型定義してみましょう。

```typescript
// APIレスポンスの型
interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
  timestamp: string;
}

// ユーザー一覧のレスポンス
interface UserListItem {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
}

// 型を組み合わせる
type UserListResponse = ApiResponse<UserListItem[]>;

// 実際のデータ
const response: UserListResponse = {
  status: "success",
  data: [
    { id: 1, name: "田中", role: "admin" },
    { id: 2, name: "佐藤", role: "editor" },
  ],
  timestamp: "2025-01-15T10:30:00Z",
};

// 分割代入でデータを取り出す
const { data: users, status } = response;
const adminUsers = users.filter((u) => u.role === "admin");
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| オブジェクト | `{ key: value }` で構造化データを表現 |
| 分割代入 | `const { name, age } = user` で値を取り出す |
| スプレッド構文 | `{ ...obj, key: newValue }` で不変更新 |
| 配列操作 | push, pop, slice, includes など |
| タプル | `[number, string]` で固定長の型付き配列 |
| Record | `Record<string, number>` で動的キーの型 |

### チェックリスト

- [ ] interface でオブジェクトの型を定義できる
- [ ] 分割代入でオブジェクト・配列の値を取り出せる
- [ ] スプレッド構文でイミュータブルな更新ができる
- [ ] 配列の基本操作（push, pop, slice, includes）を使える
- [ ] タプル型を理解した

---

## 次のステップへ

オブジェクトと配列の操作をマスターしました。

次はStep 1の理解度チェックです。
ここまで学んだTypeScriptの基礎知識を確認しましょう。

---

*推定読了時間: 25分*
