# TypeScriptを選ぶ理由

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 1
subStep: 2
title: "TypeScriptを選ぶ理由"
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

> 「TypeScript？JavaScriptじゃなくて？」
>
> 田中先輩は頷いた。
>
> 「JavaScriptでも動くものは作れる。でも TypeScript を使うと、
> **コンパイル時にバグを見つけられる**。実行してからエラーに気づくのと、
> 書いている最中に気づけるのとでは、生産性が天と地ほど違う」
>
> 「百聞は一見に如かずだ。まずは環境を作って、最初のプログラムを書いてみよう」

---

## TypeScriptとは

### JavaScriptとの関係

```
TypeScript = JavaScript + 型システム
```

TypeScriptはJavaScriptの**スーパーセット**です。全てのJavaScriptコードは有効なTypeScriptコードですが、TypeScriptには型注釈（type annotation）が追加されています。

```typescript
// JavaScript
function add(a, b) {
  return a + b;
}
add("hello", 42); // "hello42" -- 意図しない動作でもエラーにならない

// TypeScript
function add(a: number, b: number): number {
  return a + b;
}
add("hello", 42); // コンパイルエラー！ 型が合わないと教えてくれる
```

### TypeScriptの利点

| 利点 | 説明 |
|------|------|
| 型安全性 | コンパイル時にバグを検出 |
| エディタ補完 | 型情報があるため補完が強力 |
| リファクタリング | 変数名変更時に関連箇所を自動検出 |
| ドキュメント | 型定義がそのままドキュメントになる |
| 段階的導入 | JavaScriptプロジェクトに段階的に導入可能 |

---

## 環境構築

### Node.js のインストール確認

TypeScriptはNode.js上で動きます。まずはインストールを確認しましょう。

```bash
# Node.js のバージョン確認
node --version
# v20.x.x 以上を推奨

# npm のバージョン確認
npm --version
```

### TypeScript プロジェクトの初期化

```bash
# プロジェクトディレクトリを作成
mkdir my-first-ts && cd my-first-ts

# package.json を初期化
npm init -y

# TypeScript をインストール
npm install -D typescript

# ts-node をインストール（TypeScriptを直接実行）
npm install -D ts-node @types/node

# tsconfig.json を生成
npx tsc --init
```

### tsconfig.json の基本設定

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

重要な設定項目：

| 設定 | 意味 |
|------|------|
| `strict: true` | 厳格な型チェックを有効にする（必ず true に） |
| `target` | コンパイル先のJavaScriptバージョン |
| `outDir` | コンパイル後のJSファイル出力先 |
| `rootDir` | TypeScriptソースの場所 |

---

## 最初のプログラム

### Hello, TypeScript!

`src/index.ts` を作成します：

```typescript
// src/index.ts
const message: string = "Hello, TypeScript!";
console.log(message);

// 型注釈付きの関数
function greet(name: string): string {
  return `こんにちは、${name}さん！`;
}

console.log(greet("田中"));
// console.log(greet(42)); // エラー！ number は string に代入できない
```

### 実行方法

```bash
# ts-node で直接実行（開発時に便利）
npx ts-node src/index.ts

# コンパイルしてから実行（本番向け）
npx tsc
node dist/index.js
```

### package.json にスクリプトを追加

```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

```bash
# 開発時
npm run dev

# ビルド & 実行
npm run build && npm start
```

---

## 変数宣言

### let, const, var の違い

```typescript
// const: 再代入不可（基本的にこれを使う）
const PI = 3.14159;
// PI = 3.14; // エラー！ const は再代入できない

// let: 再代入可能（ループカウンタなど）
let count = 0;
count = 1; // OK

// var: 使わない（スコープの問題があるため非推奨）
// var oldStyle = "avoid this";
```

### 基本的な使い分け

```typescript
// 原則: const を使う
const userName = "田中";
const maxRetries = 3;
const isActive = true;

// 値が変わる場合のみ let
let currentPage = 1;
currentPage = 2; // ページ遷移で更新

// for ループ
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

> **ルール**: まず `const` で宣言し、再代入が必要な場合だけ `let` に変える。`var` は使わない。

---

## TypeScriptの型推論

TypeScriptは多くの場合、型を自動的に推論してくれます。

```typescript
// 型推論: TypeScript が型を自動判定
const name = "太郎";        // string と推論される
const age = 25;             // number と推論される
const isStudent = false;    // boolean と推論される

// 明示的な型注釈（複雑な場合や関数の引数で使う）
const score: number = 100;
const greeting: string = `Hello, ${name}`;
```

### いつ型注釈を書くか

| 場面 | 型注釈 | 理由 |
|------|--------|------|
| 関数の引数 | 必須 | 推論できないため |
| 関数の戻り値 | 推奨 | ドキュメントとして有用 |
| 変数の初期化 | 不要（推論で十分） | 冗長になるため |
| 複雑なオブジェクト | 推奨 | 構造を明示するため |

```typescript
// 良い例
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// 変数は型推論に任せる
const total = calculateTotal(1500, 3); // number と推論される
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| TypeScript | JavaScript + 型システム |
| 利点 | 型安全性、強力な補完、コンパイル時エラー検出 |
| 環境 | Node.js + npm + typescript + ts-node |
| 変数宣言 | `const` を基本に、必要な時だけ `let` |
| 型推論 | 基本は推論に任せ、関数の引数・戻り値は明示 |

### チェックリスト

- [ ] TypeScriptとJavaScriptの違いを説明できる
- [ ] TypeScriptの開発環境をセットアップできる
- [ ] ts-node でTypeScriptファイルを実行できる
- [ ] const と let の使い分けを理解した
- [ ] 型推論と型注釈の使い分けを理解した

---

## 次のステップへ

TypeScriptの環境が整いました。

次のセクションでは、TypeScriptの最大の武器である**型システム**を本格的に学びます。
string, number, boolean から始まり、union型やinterface まで、型の世界を探検しましょう。

---

*推定読了時間: 25分*
