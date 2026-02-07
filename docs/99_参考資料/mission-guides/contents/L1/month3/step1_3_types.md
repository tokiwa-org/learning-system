# 型システムを理解しよう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 1
subStep: 3
title: "型システムを理解しよう"
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

> 「型ってそんなに大事なんですか？」
>
> 田中先輩はホワイトボードにこう書いた。
>
> ```
> バグの50%は型の不整合が原因
> ```
>
> 「例えばユーザーIDを数値で受け取るはずの関数に文字列を渡したり、
> nullかもしれない値をチェックせずに使ったり。
> 型システムはそういうミスを**コードを実行する前に**防いでくれるんだ」

---

## プリミティブ型

TypeScriptの基本的な型を見ていきましょう。

### string（文字列）

```typescript
const name: string = "田中太郎";
const greeting: string = `こんにちは、${name}さん`;
const empty: string = "";
```

### number（数値）

```typescript
const age: number = 25;
const price: number = 1980.5;
const hex: number = 0xff;         // 16進数
const infinity: number = Infinity;
```

> TypeScriptでは整数と小数の区別がありません。全て `number` 型です。

### boolean（真偽値）

```typescript
const isActive: boolean = true;
const hasPermission: boolean = false;
```

### null と undefined

```typescript
const empty: null = null;           // 値が「空」
const notDefined: undefined = undefined; // 値が「未定義」
```

> `null` は「意図的に空」、`undefined` は「まだ値が設定されていない」という意味です。

---

## 配列型

```typescript
// 配列の型宣言（2つの書き方）
const numbers: number[] = [1, 2, 3, 4, 5];
const names: Array<string> = ["田中", "佐藤", "鈴木"];

// 推奨: number[] の書き方が一般的
const scores: number[] = [85, 92, 78, 95];

// 空の配列は型注釈が必要
const items: string[] = [];
items.push("Apple");
items.push("Banana");
// items.push(42); // エラー！ number は string[] に追加できない
```

---

## ユニオン型（Union Types）

「この変数はAかBのどちらかの型」を表現します。

```typescript
// string または number
let id: string | number;
id = "user_001";  // OK
id = 42;           // OK
// id = true;      // エラー！ boolean は許可されていない

// よくあるパターン: string | null
let userName: string | null = null;
userName = "田中";

// 使用時は型の絞り込み（Type Narrowing）が必要
function printId(id: string | number): void {
  if (typeof id === "string") {
    // この中では id は string 型
    console.log(id.toUpperCase());
  } else {
    // この中では id は number 型
    console.log(id.toFixed(2));
  }
}
```

### typeof による型の絞り込み

```typescript
function processValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return `文字列: ${value}`;
  } else if (typeof value === "number") {
    return `数値: ${value}`;
  } else {
    return `真偽値: ${value}`;
  }
}
```

---

## リテラル型

特定の値だけを許可する型です。

```typescript
// 文字列リテラル型
type Direction = "north" | "south" | "east" | "west";
let dir: Direction = "north";  // OK
// dir = "up";                 // エラー！ "up" は Direction ではない

// 数値リテラル型
type DiceResult = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceResult = 3;  // OK
// roll = 7;                // エラー！

// ステータス管理でよく使う
type Status = "pending" | "active" | "archived";
```

---

## 型エイリアス（Type Aliases）

`type` キーワードで独自の型に名前をつけます。

```typescript
// 基本的な型エイリアス
type UserId = string;
type Age = number;
type IsActive = boolean;

// ユニオン型に名前をつける
type Result = "success" | "error" | "pending";

// オブジェクトの型を定義
type User = {
  id: UserId;
  name: string;
  age: Age;
  email: string;
  isActive: IsActive;
};

// 使用例
const user: User = {
  id: "user_001",
  name: "田中太郎",
  age: 25,
  email: "tanaka@example.com",
  isActive: true,
};
```

---

## インターフェース（Interface）

オブジェクトの構造を定義する、もう1つの方法です。

```typescript
// interface でオブジェクトの形を定義
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;  // ? はオプショナル（省略可能）
}

const product: Product = {
  id: 1,
  name: "TypeScript入門書",
  price: 2980,
  // description は省略可能
};

// オプショナルプロパティの使用
const productWithDesc: Product = {
  id: 2,
  name: "JavaScript完全ガイド",
  price: 3980,
  description: "JS/TSの全てを網羅",
};
```

### type と interface の使い分け

| 特徴 | type | interface |
|------|------|-----------|
| オブジェクト定義 | 可能 | 可能 |
| ユニオン型 | 可能 | 不可 |
| 拡張（extends） | & で交差 | extends で拡張 |
| 宣言マージ | 不可 | 可能 |
| 推奨場面 | ユニオン型、プリミティブの別名 | オブジェクトの構造定義 |

```typescript
// interface の拡張
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
}

const myDog: Dog = {
  name: "ポチ",
  age: 3,
  breed: "柴犬",
};

// type の交差型（Intersection）
type HasId = { id: number };
type HasName = { name: string };
type Entity = HasId & HasName;

const entity: Entity = { id: 1, name: "テスト" };
```

---

## readonly と任意プロパティ

```typescript
interface Config {
  readonly apiUrl: string;    // 読み取り専用
  readonly version: number;   // 読み取り専用
  debug?: boolean;            // オプショナル
}

const config: Config = {
  apiUrl: "https://api.example.com",
  version: 1,
};

// config.apiUrl = "https://other.com"; // エラー！ readonly は変更不可
console.log(config.debug); // undefined（省略されたため）
```

---

## 列挙型（Enum）

関連する定数をグループ化します。

```typescript
// 数値Enum
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  InternalServerError = 500,
}

function handleResponse(status: HttpStatus): void {
  switch (status) {
    case HttpStatus.OK:
      console.log("成功");
      break;
    case HttpStatus.NotFound:
      console.log("見つかりません");
      break;
    case HttpStatus.InternalServerError:
      console.log("サーバーエラー");
      break;
  }
}

// 文字列Enum（推奨）
enum Role {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

const userRole: Role = Role.Admin;
```

> **実務のヒント**: 最近は Enum よりもユニオン型（`type Role = "admin" | "editor" | "viewer"`）を使うプロジェクトも多いです。プロジェクトのルールに従いましょう。

---

## any と unknown

```typescript
// any: 型チェックを無効にする（使用禁止！）
let dangerous: any = "hello";
dangerous = 42;
dangerous = true;
dangerous.nonExistentMethod(); // 実行時エラーだが、コンパイル時にはスルー

// unknown: 型安全な any（使う前に型チェックが必要）
let safe: unknown = "hello";
// safe.toUpperCase(); // エラー！ unknown は直接操作できない

if (typeof safe === "string") {
  console.log(safe.toUpperCase()); // OK: 型チェック後は使える
}
```

> **ルール**: `any` は絶対に使わない。外部からの不明なデータには `unknown` を使い、型チェック後に処理する。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| プリミティブ型 | string, number, boolean, null, undefined |
| 配列型 | `number[]` または `Array<number>` |
| ユニオン型 | `string \| number` で複数型を許可 |
| リテラル型 | `"north" \| "south"` で特定の値のみ許可 |
| type | 型エイリアス（ユニオン型やプリミティブに名前をつける） |
| interface | オブジェクトの構造を定義 |
| readonly | 変更不可のプロパティ |
| any | 使用禁止。unknown を使う |

### チェックリスト

- [ ] string, number, boolean の型注釈を書ける
- [ ] 配列の型を宣言できる
- [ ] ユニオン型と型の絞り込みを理解した
- [ ] type と interface の違いを説明できる
- [ ] オプショナルプロパティを使える
- [ ] any を使わない理由を理解した

---

## 次のステップへ

型システムの基本を理解しました。

次のセクションでは、**関数**の書き方を学びます。
TypeScriptの関数宣言、アロー関数、パラメータの型定義など、
コードを構造化する力を身につけましょう。

---

*推定読了時間: 30分*
