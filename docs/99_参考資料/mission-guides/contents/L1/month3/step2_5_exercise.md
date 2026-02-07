# 演習：TypeScriptで実用ツールを作ろう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 2
subStep: 5
title: "演習：TypeScriptで実用ツールを作ろう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「よし、ここまでの知識を総動員して、実際のツールを作ってもらう」
>
> 田中先輩が5つのミッションを書いたリストを渡した。
>
> 「簡単なものから始めて、最後はAPIと連携するツールだ。
> 90分で全部やりきってみろ。分からなくなったらヒントを見てもいい」
>
> 「やってみます！」

---

## ミッション概要

| ミッション | テーマ | 難易度 | 時間 |
|-----------|--------|--------|------|
| Mission 1 | 文字列ユーティリティ | 初級 | 10分 |
| Mission 2 | 売上データ分析 | 初級 | 15分 |
| Mission 3 | タスク管理システム | 中級 | 20分 |
| Mission 4 | JSONデータ変換ツール | 中級 | 20分 |
| Mission 5 | APIデータ取得＆レポート生成 | 上級 | 25分 |

---

## Mission 1: 文字列ユーティリティ（10分）

文字列を操作するユーティリティ関数群を作成してください。

### 要件

- `capitalize(str)`: 最初の文字を大文字に変換
- `truncate(str, maxLength)`: 指定文字数で切り詰めて "..." を追加
- `countWords(str)`: 単語数をカウント
- `toCamelCase(str)`: kebab-case/snake_case を camelCase に変換

### 期待される動作

```typescript
capitalize("hello world");          // "Hello world"
truncate("Hello World", 8);         // "Hello..."
countWords("Hello World Test");     // 3
toCamelCase("background-color");    // "backgroundColor"
toCamelCase("user_name");           // "userName"
```

<details>
<summary>解答</summary>

```typescript
function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str[0].toUpperCase() + str.slice(1);
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

function toCamelCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : capitalize(word.toLowerCase())
    )
    .join("");
}

// テスト
console.log(capitalize("hello world"));       // "Hello world"
console.log(truncate("Hello World", 8));       // "Hello..."
console.log(countWords("Hello World Test"));   // 3
console.log(toCamelCase("background-color"));  // "backgroundColor"
console.log(toCamelCase("user_name"));         // "userName"
```

</details>

---

## Mission 2: 売上データ分析（15分）

売上データを配列メソッドで分析するプログラムを作成してください。

### サンプルデータ

```typescript
interface Sale {
  date: string;
  product: string;
  quantity: number;
  unitPrice: number;
  region: string;
}

const sales: Sale[] = [
  { date: "2025-01-01", product: "Widget A", quantity: 10, unitPrice: 1500, region: "東京" },
  { date: "2025-01-01", product: "Widget B", quantity: 5, unitPrice: 2000, region: "大阪" },
  { date: "2025-01-02", product: "Widget A", quantity: 8, unitPrice: 1500, region: "東京" },
  { date: "2025-01-02", product: "Widget C", quantity: 3, unitPrice: 3000, region: "名古屋" },
  { date: "2025-01-03", product: "Widget B", quantity: 12, unitPrice: 2000, region: "東京" },
  { date: "2025-01-03", product: "Widget A", quantity: 6, unitPrice: 1500, region: "大阪" },
  { date: "2025-01-04", product: "Widget C", quantity: 7, unitPrice: 3000, region: "東京" },
  { date: "2025-01-04", product: "Widget B", quantity: 4, unitPrice: 2000, region: "名古屋" },
];
```

### 要件

1. 全売上の合計金額を計算
2. 商品別の合計金額を計算
3. 地域別の売上件数と合計金額を計算
4. 売上金額が最も高い取引を見つける
5. 東京地域の売上だけを抽出し、金額の降順でソート

<details>
<summary>解答</summary>

```typescript
// 1. 全売上の合計金額
const totalRevenue = sales.reduce(
  (sum, sale) => sum + sale.quantity * sale.unitPrice, 0
);
console.log(`合計売上: ${totalRevenue.toLocaleString()}円`);

// 2. 商品別の合計金額
const byProduct = sales.reduce<Record<string, number>>((acc, sale) => {
  const revenue = sale.quantity * sale.unitPrice;
  acc[sale.product] = (acc[sale.product] || 0) + revenue;
  return acc;
}, {});
console.log("商品別売上:", byProduct);

// 3. 地域別の売上件数と合計金額
const byRegion = sales.reduce<Record<string, { count: number; total: number }>>(
  (acc, sale) => {
    if (!acc[sale.region]) {
      acc[sale.region] = { count: 0, total: 0 };
    }
    acc[sale.region].count += 1;
    acc[sale.region].total += sale.quantity * sale.unitPrice;
    return acc;
  }, {}
);
console.log("地域別:", byRegion);

// 4. 売上金額が最も高い取引
const topSale = sales.reduce((max, sale) => {
  const maxRevenue = max.quantity * max.unitPrice;
  const currentRevenue = sale.quantity * sale.unitPrice;
  return currentRevenue > maxRevenue ? sale : max;
});
console.log("最高売上:", topSale);

// 5. 東京地域の売上を金額降順
const tokyoSales = sales
  .filter((s) => s.region === "東京")
  .map((s) => ({ ...s, revenue: s.quantity * s.unitPrice }))
  .sort((a, b) => b.revenue - a.revenue);
console.log("東京売上（降順）:", tokyoSales);
```

</details>

---

## Mission 3: タスク管理システム（20分）

タスクのCRUD（作成・読取・更新・削除）を行うモジュールを作成してください。

### 要件

- タスクの追加（タイトル、優先度を指定）
- タスク一覧の表示（フィルタリング・ソート対応）
- タスクの完了マーク
- タスクの削除
- 統計情報の取得（完了率、優先度別カウント）

<details>
<summary>解答</summary>

```typescript
interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  createdAt: Date;
}

class TaskManager {
  private tasks: Task[] = [];
  private nextId: number = 1;

  add(title: string, priority: Task["priority"] = "medium"): Task {
    const task: Task = {
      id: this.nextId++,
      title,
      priority,
      completed: false,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  list(filter?: { priority?: Task["priority"]; completed?: boolean }): Task[] {
    let result = [...this.tasks];
    if (filter?.priority) {
      result = result.filter((t) => t.priority === filter.priority);
    }
    if (filter?.completed !== undefined) {
      result = result.filter((t) => t.completed === filter.completed);
    }
    return result;
  }

  complete(id: number): boolean {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return false;
    task.completed = true;
    return true;
  }

  remove(id: number): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  getStats(): { total: number; completed: number; rate: string; byPriority: Record<string, number> } {
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.completed).length;
    const rate = total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%";
    const byPriority = this.tasks.reduce<Record<string, number>>((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {});

    return { total, completed, rate, byPriority };
  }
}

// テスト
const manager = new TaskManager();
manager.add("TypeScriptの型を学ぶ", "high");
manager.add("配列メソッドの復習", "medium");
manager.add("ブログ記事を読む", "low");
manager.complete(1);

console.log("全タスク:", manager.list());
console.log("未完了:", manager.list({ completed: false }));
console.log("統計:", manager.getStats());
```

</details>

---

## Mission 4: JSONデータ変換ツール（20分）

CSVとJSONを相互変換するツールを作成してください。

### 要件

- CSV文字列をJSONオブジェクト配列に変換
- JSONオブジェクト配列をCSV文字列に変換
- ヘッダー行の自動検出
- 型変換（数値文字列を数値に変換）

<details>
<summary>解答</summary>

```typescript
// CSV → JSON
function csvToJson(csv: string): Record<string, string | number>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const obj: Record<string, string | number> = {};

    headers.forEach((header, index) => {
      const value = values[index] || "";
      // 数値に変換可能なら数値に
      const num = Number(value);
      obj[header] = !isNaN(num) && value !== "" ? num : value;
    });

    return obj;
  });
}

// JSON → CSV
function jsonToCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const headerLine = headers.join(",");
  const dataLines = data.map((row) =>
    headers.map((h) => String(row[h] ?? "")).join(",")
  );

  return [headerLine, ...dataLines].join("\n");
}

// テスト
const csvData = `name,age,department
田中太郎,28,開発
佐藤花子,32,営業
鈴木一郎,25,開発`;

const jsonData = csvToJson(csvData);
console.log("CSV → JSON:", JSON.stringify(jsonData, null, 2));

const backToCsv = jsonToCsv(jsonData);
console.log("JSON → CSV:");
console.log(backToCsv);
```

</details>

---

## Mission 5: APIデータ取得＆レポート生成（25分）

外部APIからデータを取得し、整形してレポートを生成するツールを作成してください。

### 要件

- JSONPlaceholder API（`https://jsonplaceholder.typicode.com`）を使用
- ユーザー一覧と投稿一覧を同時に取得
- ユーザーごとの投稿数を集計
- 結果をフォーマットして表示

<details>
<summary>解答</summary>

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface UserReport {
  name: string;
  email: string;
  company: string;
  postCount: number;
  avgTitleLength: number;
}

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function generateReport(): Promise<void> {
  console.log("データを取得中...\n");

  // 同時にリクエスト
  const [users, posts] = await Promise.all([
    fetchData<User[]>("https://jsonplaceholder.typicode.com/users"),
    fetchData<Post[]>("https://jsonplaceholder.typicode.com/posts"),
  ]);

  // ユーザーごとの投稿を集計
  const reports: UserReport[] = users.map((user) => {
    const userPosts = posts.filter((p) => p.userId === user.id);
    const avgTitleLength =
      userPosts.length > 0
        ? Math.round(
            userPosts.reduce((sum, p) => sum + p.title.length, 0) /
              userPosts.length
          )
        : 0;

    return {
      name: user.name,
      email: user.email,
      company: user.company.name,
      postCount: userPosts.length,
      avgTitleLength,
    };
  });

  // 投稿数の降順でソート
  reports.sort((a, b) => b.postCount - a.postCount);

  // レポート表示
  console.log("=== ユーザー投稿レポート ===\n");
  console.log(
    `${"名前".padEnd(25)} ${"会社".padEnd(25)} ${"投稿数".padStart(6)} ${"平均タイトル長".padStart(14)}`
  );
  console.log("-".repeat(75));

  reports.forEach((r) => {
    console.log(
      `${r.name.padEnd(25)} ${r.company.padEnd(25)} ${String(r.postCount).padStart(6)} ${String(r.avgTitleLength).padStart(14)}`
    );
  });

  console.log("-".repeat(75));
  const totalPosts = reports.reduce((sum, r) => sum + r.postCount, 0);
  console.log(`\n合計投稿数: ${totalPosts}`);
  console.log(`ユーザー数: ${reports.length}`);
  console.log(`平均投稿数: ${(totalPosts / reports.length).toFixed(1)}`);
}

// 実行
generateReport().catch(console.error);
```

</details>

---

## 達成度チェック

| ミッション | テーマ | 完了 |
|-----------|--------|------|
| Mission 1 | 文字列ユーティリティ | [ ] |
| Mission 2 | 売上データ分析 | [ ] |
| Mission 3 | タスク管理システム | [ ] |
| Mission 4 | JSONデータ変換ツール | [ ] |
| Mission 5 | APIデータ取得＆レポート | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 文字列操作 | split, replace, slice を組み合わせてデータ加工 |
| 配列メソッド | filter, map, reduce のチェーンでデータ分析 |
| 型定義 | interface で構造を明確にしてからコーディング |
| 非同期処理 | async/await + Promise.all で効率的なAPI通信 |
| モジュール | 機能ごとに関数を分割して再利用可能に |

### チェックリスト

- [ ] 文字列を操作するユーティリティ関数を作れる
- [ ] 配列メソッドでデータを集計・分析できる
- [ ] CRUD操作を持つモジュールを設計できる
- [ ] CSV/JSON変換のロジックを実装できる
- [ ] APIからデータを取得して加工できる

---

## 次のステップへ

お疲れさまでした。5つのミッションを通じて、TypeScriptの実践力が身についたはずです。

次のセクションでは、Step 2の理解度チェックです。
標準ライブラリの知識を確認しましょう。

---

*推定所要時間: 90分*
