# 関数とアロー関数

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 1
subStep: 4
title: "関数とアロー関数"
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

> 「プログラミングの基本単位は"関数"だ」田中先輩はホワイトボードに図を描いた。
>
> ```
> 入力 → [処理] → 出力
> ```
>
> 「関数は、入力を受け取り、処理をして、結果を返す。
> この単純な構造の繰り返しで、どんな複雑なソフトウェアも作られている」
>
> 「料理のレシピみたいなものですか？」
>
> 「その通り。材料（引数）を受け取り、手順（処理）に従い、料理（戻り値）を完成させる。
> レシピに名前をつけておけば、何度でも呼び出せるだろう？」

---

## 関数宣言（Function Declaration）

```typescript
// 基本的な関数宣言
function add(a: number, b: number): number {
  return a + b;
}

const result = add(3, 5); // 8

// void: 値を返さない関数
function logMessage(message: string): void {
  console.log(`[LOG] ${message}`);
}
```

### 関数の構造

```typescript
function 関数名(引数名: 引数の型): 戻り値の型 {
  // 処理
  return 戻り値;
}
```

| 要素 | 説明 |
|------|------|
| 関数名 | 動詞で始める（`calculate`, `fetch`, `validate`） |
| 引数の型 | 必ず型注釈をつける |
| 戻り値の型 | 推奨：明示的に書く |
| return | 関数の結果を呼び出し元に返す |

---

## アロー関数（Arrow Function）

ES6で導入された、関数を短く書く構文です。

```typescript
// 通常の関数宣言
function multiply(a: number, b: number): number {
  return a * b;
}

// アロー関数（同じ処理）
const multiply = (a: number, b: number): number => {
  return a * b;
};

// 1行で済む場合は {} と return を省略可能
const multiply = (a: number, b: number): number => a * b;

// 引数が1つの場合は () も省略可能（ただしTypeScriptでは型注釈があるため残す）
const double = (n: number): number => n * 2;
```

### 関数宣言とアロー関数の使い分け

| 場面 | 推奨 | 理由 |
|------|------|------|
| トップレベルの関数 | function宣言 | 巻き上げ（hoisting）される |
| コールバック | アロー関数 | 短く書ける |
| メソッド | function宣言 | this の扱いが明確 |
| 配列操作 | アロー関数 | map/filter で簡潔 |

```typescript
// トップレベルはfunction宣言
function processOrder(orderId: string): void {
  // ...
}

// コールバックはアロー関数
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
const evens = numbers.filter((n) => n % 2 === 0);
```

---

## オプショナル引数とデフォルト値

### オプショナル引数（?）

```typescript
// lastName はオプショナル（省略可能）
function greet(firstName: string, lastName?: string): string {
  if (lastName) {
    return `こんにちは、${lastName} ${firstName}さん`;
  }
  return `こんにちは、${firstName}さん`;
}

greet("太郎");           // "こんにちは、太郎さん"
greet("太郎", "田中");    // "こんにちは、田中 太郎さん"
```

> **注意**: オプショナル引数は必ず末尾に置く。

### デフォルト値

```typescript
// デフォルト値を設定
function createUser(name: string, role: string = "viewer"): void {
  console.log(`${name} (${role})`);
}

createUser("田中");           // "田中 (viewer)"
createUser("佐藤", "admin");  // "佐藤 (admin)"
```

---

## レスト引数（Rest Parameters）

任意の数の引数を配列として受け取ります。

```typescript
// 任意の数の数値を受け取って合計を返す
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3);          // 6
sum(10, 20, 30, 40);   // 100

// 通常の引数と組み合わせる（レスト引数は最後に）
function log(level: string, ...messages: string[]): void {
  console.log(`[${level}]`, ...messages);
}

log("INFO", "サーバー起動", "ポート3000");
```

---

## 関数の型定義

関数自体の型を定義する方法です。

```typescript
// 関数型の定義
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
const multiply: MathOperation = (a, b) => a * b;

// コールバック関数の型
type Callback = (result: string) => void;

function fetchData(url: string, onComplete: Callback): void {
  // データ取得をシミュレーション
  const data = `Data from ${url}`;
  onComplete(data);
}

fetchData("https://api.example.com/users", (result) => {
  console.log(result);
});
```

---

## ジェネリクス（Generics）入門

型をパラメータ化する仕組みです。今は「こういうものがある」程度で大丈夫です。

```typescript
// T は型パラメータ（呼び出し時に決まる）
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = getFirst([1, 2, 3]);          // number | undefined
const firstString = getFirst(["a", "b", "c"]);    // string | undefined

// 複数の型パラメータ
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const p = pair("hello", 42); // [string, number]
```

> **今の段階では**: ジェネリクスを自分で書けなくても大丈夫です。ライブラリのAPIで `Array<T>` や `Promise<T>` のような表記を見たときに「型パラメータだな」と理解できれば十分です。

---

## 実践：関数を組み合わせる

```typescript
// ユーザーデータの型
interface User {
  id: number;
  name: string;
  age: number;
  department: string;
}

// サンプルデータ
const users: User[] = [
  { id: 1, name: "田中", age: 28, department: "開発" },
  { id: 2, name: "佐藤", age: 35, department: "営業" },
  { id: 3, name: "鈴木", age: 22, department: "開発" },
  { id: 4, name: "高橋", age: 41, department: "人事" },
];

// 部署でフィルタリング
function getUsersByDepartment(users: User[], dept: string): User[] {
  return users.filter((user) => user.department === dept);
}

// 平均年齢を計算
function getAverageAge(users: User[]): number {
  if (users.length === 0) return 0;
  const total = users.reduce((sum, user) => sum + user.age, 0);
  return total / users.length;
}

// 名前の一覧を取得
const getNames = (users: User[]): string[] =>
  users.map((user) => user.name);

// 組み合わせて使う
const devTeam = getUsersByDepartment(users, "開発");
console.log(getNames(devTeam));       // ["田中", "鈴木"]
console.log(getAverageAge(devTeam));  // 25
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 関数宣言 | `function name(arg: type): returnType {}` |
| アロー関数 | `const fn = (arg: type): returnType => expression` |
| オプショナル引数 | `arg?: type`（末尾に配置） |
| デフォルト値 | `arg: type = defaultValue` |
| レスト引数 | `...args: type[]`（末尾に配置） |
| 関数型 | `type Fn = (a: number) => string` |

### チェックリスト

- [ ] 関数宣言とアロー関数を書ける
- [ ] 引数と戻り値に型注釈をつけられる
- [ ] オプショナル引数とデフォルト値を使える
- [ ] コールバック関数を渡せる
- [ ] 関数を組み合わせてデータを処理できる

---

## 次のステップへ

関数の書き方をマスターしました。

次のセクションでは、**オブジェクトと配列**を深掘りします。
分割代入やスプレッド構文など、モダンなJavaScript/TypeScriptの書き方を学びましょう。

---

*推定読了時間: 25分*
