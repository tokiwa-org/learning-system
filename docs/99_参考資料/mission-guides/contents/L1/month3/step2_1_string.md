# 文字列操作をマスターしよう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 2
subStep: 1
title: "文字列操作をマスターしよう"
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

> 「最初の実務タスクだ」田中先輩がチケットを見せた。
>
> 「ユーザーから送られてくるデータを検証・整形する機能を作ってくれ。
> メールアドレスの検証、名前の正規化、検索キーワードの分割... 全部文字列操作だ」
>
> 「文字列操作って、地味に大変そうですね」
>
> 「地味だが超重要だ。業務コードの3割は文字列操作だと言っても過言じゃない。
> ここをマスターすれば、一気に戦力になれるぞ」

---

## テンプレートリテラル

バッククォート（`` ` ``）で囲む文字列です。変数の埋め込みや改行が自在にできます。

```typescript
const name = "田中";
const age = 28;

// テンプレートリテラル（推奨）
const message = `こんにちは、${name}さん。${age}歳ですね。`;

// 従来の文字列結合（非推奨）
const oldMessage = "こんにちは、" + name + "さん。" + age + "歳ですね。";

// 複数行
const html = `
<div class="card">
  <h2>${name}</h2>
  <p>年齢: ${age}</p>
</div>
`;

// 式の埋め込み
const priceWithTax = `税込: ${Math.floor(1980 * 1.1)}円`;
// "税込: 2178円"
```

---

## 基本的な文字列メソッド

### 長さと検索

```typescript
const text = "Hello, TypeScript World!";

// 長さ
console.log(text.length); // 23

// 検索
console.log(text.includes("TypeScript")); // true
console.log(text.startsWith("Hello"));    // true
console.log(text.endsWith("!"));          // true

// 位置を取得
console.log(text.indexOf("TypeScript"));  // 7
console.log(text.indexOf("Java"));        // -1（見つからない）
```

### 変換

```typescript
const input = "  Hello World  ";

// 大文字・小文字変換
console.log(input.toUpperCase()); // "  HELLO WORLD  "
console.log(input.toLowerCase()); // "  hello world  "

// 空白除去
console.log(input.trim());       // "Hello World"
console.log(input.trimStart());  // "Hello World  "
console.log(input.trimEnd());    // "  Hello World"
```

### 切り出し

```typescript
const str = "TypeScript";

// slice(開始, 終了) - 終了は含まない
console.log(str.slice(0, 4));   // "Type"
console.log(str.slice(4));      // "Script"
console.log(str.slice(-6));     // "Script"（末尾から6文字）

// substring(開始, 終了)
console.log(str.substring(0, 4)); // "Type"
```

---

## split と join

文字列を分割したり結合したりする、最も頻繁に使うメソッドです。

```typescript
// split: 文字列 → 配列
const csv = "田中,佐藤,鈴木,高橋";
const names = csv.split(",");
console.log(names); // ["田中", "佐藤", "鈴木", "高橋"]

// join: 配列 → 文字列
const joined = names.join(" / ");
console.log(joined); // "田中 / 佐藤 / 鈴木 / 高橋"

// 実用例: パスの操作
const path = "/users/tanaka/documents/report.pdf";
const parts = path.split("/");
const filename = parts[parts.length - 1]; // "report.pdf"

// 実用例: クエリパラメータの解析
const query = "name=tanaka&age=28&dept=dev";
const params = query.split("&").map((pair) => {
  const [key, value] = pair.split("=");
  return { key, value };
});
// [{ key: "name", value: "tanaka" }, { key: "age", value: "28" }, ...]
```

---

## replace と replaceAll

```typescript
// replace: 最初の一致だけ置換
const text = "apple banana apple cherry";
console.log(text.replace("apple", "orange"));
// "orange banana apple cherry"

// replaceAll: 全ての一致を置換
console.log(text.replaceAll("apple", "orange"));
// "orange banana orange cherry"

// 正規表現を使った置換
const phone = "090-1234-5678";
const cleaned = phone.replace(/-/g, ""); // g フラグで全置換
console.log(cleaned); // "09012345678"

// 実用例: テンプレート処理
function fillTemplate(template: string, data: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

const email = fillTemplate(
  "{{name}}様、ご注文番号{{orderId}}を承りました。",
  { name: "田中太郎", orderId: "ORD-2025-001" }
);
// "田中太郎様、ご注文番号ORD-2025-001を承りました。"
```

---

## 正規表現の基本

正規表現（RegExp）はパターンマッチングの強力なツールです。

```typescript
// 基本的な正規表現
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// test: パターンにマッチするか判定
console.log(emailPattern.test("user@example.com"));  // true
console.log(emailPattern.test("invalid-email"));      // false

// match: マッチした部分を取得
const text = "電話番号は 090-1234-5678 です";
const phoneMatch = text.match(/\d{3}-\d{4}-\d{4}/);
console.log(phoneMatch?.[0]); // "090-1234-5678"

// よく使うパターン
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\d{2,4}-\d{2,4}-\d{4}$/,
  postalCode: /^\d{3}-\d{4}$/,
  url: /^https?:\/\/.+/,
};

// バリデーション関数
function validateEmail(email: string): boolean {
  return patterns.email.test(email);
}
```

---

## padStart と padEnd

文字列を指定の長さまで埋める関数です。

```typescript
// padStart: 先頭を埋める
const num = "42";
console.log(num.padStart(5, "0")); // "00042"

// padEnd: 末尾を埋める
const name = "田中";
console.log(name.padEnd(10, ".")); // "田中........"

// 実用例: 日付のフォーマット
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

console.log(formatDate(new Date(2025, 0, 5))); // "2025-01-05"

// 実用例: テーブル表示
function printRow(name: string, score: number): void {
  console.log(`${name.padEnd(15)} ${String(score).padStart(5)}`);
}

printRow("田中太郎", 85);    // "田中太郎            85"
printRow("佐藤花子", 92);    // "佐藤花子            92"
```

---

## 実践：文字列操作の組み合わせ

```typescript
// ユーザー入力の正規化
function normalizeInput(input: string): string {
  return input
    .trim()                          // 前後の空白を除去
    .replace(/\s+/g, " ")           // 連続する空白を1つに
    .toLowerCase();                   // 小文字に統一
}

console.log(normalizeInput("  Hello   World  ")); // "hello world"

// スラッグ生成（URL用の文字列）
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")    // 英数字・空白・ハイフン以外を除去
    .replace(/\s+/g, "-")        // 空白をハイフンに
    .replace(/-+/g, "-");        // 連続ハイフンを1つに
}

console.log(createSlug("Hello World! This is a Test")); // "hello-world-this-is-a-test"

// CSV行のパース
function parseCsvLine(line: string): string[] {
  return line.split(",").map((field) => field.trim());
}

console.log(parseCsvLine(" name , age , department "));
// ["name", "age", "department"]
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| テンプレートリテラル | `` `${変数}` `` で文字列埋め込み |
| 検索 | includes, startsWith, endsWith, indexOf |
| 変換 | toUpperCase, toLowerCase, trim |
| 分割・結合 | split, join |
| 置換 | replace, replaceAll |
| 正規表現 | test, match でパターンマッチング |
| 埋め込み | padStart, padEnd |

### チェックリスト

- [ ] テンプレートリテラルで変数を埋め込める
- [ ] split/join で文字列と配列を変換できる
- [ ] replace/replaceAll で文字列を置換できる
- [ ] 正規表現でバリデーションできる
- [ ] padStart/padEnd で文字列を整形できる

---

## 次のステップへ

文字列操作をマスターしました。

次のセクションでは、**配列メソッド**を学びます。
map, filter, reduce を使いこなせれば、データ処理が一気に効率化します。

---

*推定読了時間: 30分*
