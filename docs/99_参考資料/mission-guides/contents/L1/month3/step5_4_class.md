# クラスとオブジェクト指向の基本

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 5
subStep: 4
title: "クラスとオブジェクト指向の基本"
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

> 「関数だけでプログラムを書くこともできるが、
> ある程度の規模になるとクラスで整理した方が管理しやすい」
>
> 田中先輩はAPIクライアントのコードを指差した。
>
> 「例えばこのAPIクライアント。設定やエラー処理をクラスにまとめると、
> 使いやすく、テストしやすくなる。オブジェクト指向の基本を押さえよう」

---

## クラスの基本

```typescript
class User {
  // プロパティ
  id: number;
  name: string;
  email: string;

  // コンストラクタ（インスタンス生成時に呼ばれる）
  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  // メソッド
  greet(): string {
    return `こんにちは、${this.name}です`;
  }

  // メソッド
  getDisplayName(): string {
    return `${this.name} <${this.email}>`;
  }
}

// インスタンスの作成
const user = new User(1, "田中太郎", "tanaka@example.com");
console.log(user.greet());          // "こんにちは、田中太郎です"
console.log(user.getDisplayName()); // "田中太郎 <tanaka@example.com>"
```

### コンストラクタの省略形

```typescript
// TypeScript の省略構文
class User {
  constructor(
    public id: number,
    public name: string,
    public email: string
  ) {}

  greet(): string {
    return `こんにちは、${this.name}です`;
  }
}
// public をつけると自動的にプロパティが定義・初期化される
```

---

## アクセス修飾子

| 修飾子 | アクセス範囲 |
|--------|------------|
| `public` | どこからでもアクセス可能（デフォルト） |
| `private` | クラス内部からのみアクセス可能 |
| `protected` | クラス内部と子クラスからアクセス可能 |
| `readonly` | 読み取り専用（変更不可） |

```typescript
class BankAccount {
  public readonly accountNumber: string;
  private balance: number;

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
  }

  // public: 外部から呼び出せる
  public deposit(amount: number): void {
    this.validateAmount(amount);
    this.balance += amount;
  }

  public withdraw(amount: number): void {
    this.validateAmount(amount);
    if (amount > this.balance) {
      throw new Error("残高不足です");
    }
    this.balance -= amount;
  }

  public getBalance(): number {
    return this.balance;
  }

  // private: クラス内部でのみ使用
  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error("金額は正の数でなければなりません");
    }
  }
}

const account = new BankAccount("1234-5678", 10000);
account.deposit(5000);
console.log(account.getBalance()); // 15000
// account.balance = 999999;       // エラー！ private はアクセス不可
// account.accountNumber = "xxx";   // エラー！ readonly は変更不可
```

---

## 継承（Inheritance）

```typescript
// 基底クラス（親クラス）
class Shape {
  constructor(
    public color: string
  ) {}

  describe(): string {
    return `${this.color}の図形`;
  }
}

// 派生クラス（子クラス）
class Circle extends Shape {
  constructor(
    color: string,
    public radius: number
  ) {
    super(color); // 親のコンストラクタを呼び出す
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  // メソッドのオーバーライド
  describe(): string {
    return `${this.color}の円（半径: ${this.radius}）`;
  }
}

class Rectangle extends Shape {
  constructor(
    color: string,
    public width: number,
    public height: number
  ) {
    super(color);
  }

  area(): number {
    return this.width * this.height;
  }

  describe(): string {
    return `${this.color}の四角形（${this.width}x${this.height}）`;
  }
}

const circle = new Circle("赤", 5);
console.log(circle.describe()); // "赤の円（半径: 5）"
console.log(circle.area());     // 78.54...

const rect = new Rectangle("青", 3, 4);
console.log(rect.describe()); // "青の四角形（3x4）"
console.log(rect.area());     // 12
```

---

## インターフェースの実装

```typescript
// インターフェース（契約）
interface Serializable {
  toJSON(): string;
}

interface Validatable {
  validate(): string[];
}

// 複数のインターフェースを実装
class Product implements Serializable, Validatable {
  constructor(
    public id: number,
    public name: string,
    public price: number
  ) {}

  toJSON(): string {
    return JSON.stringify({ id: this.id, name: this.name, price: this.price });
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this.name) errors.push("名前は必須です");
    if (this.price < 0) errors.push("価格は0以上にしてください");
    return errors;
  }
}
```

---

## 実践: APIクライアントをクラスで作る

```typescript
class TaskApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, authToken?: string) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      this.headers["Authorization"] = `Bearer ${authToken}`;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { ...this.headers, ...options.headers as Record<string, string> },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // CRUD メソッド
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>("/tasks");
  }

  async getTask(id: number): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.request<void>(`/tasks/${id}`, {
      method: "DELETE",
    });
  }
}

// 使用例
const client = new TaskApiClient("https://api.example.com", "my-auth-token");
const tasks = await client.getTasks();
const newTask = await client.createTask({ title: "勉強する" });
```

### クラスにする利点

| 利点 | 説明 |
|------|------|
| 設定の共有 | baseUrl, headers を1箇所で管理 |
| 認証の集約 | トークンをコンストラクタで設定するだけ |
| private | 内部実装（request メソッド）を隠蔽 |
| テスト | インスタンスを差し替えてモックできる |

---

## クラス vs 関数 の使い分け

| 場面 | 推奨 | 理由 |
|------|------|------|
| ユーティリティ関数 | 関数 | 状態を持たない |
| 設定を共有する処理群 | クラス | コンストラクタで初期化 |
| データ変換 | 関数 | 入力→出力の単純な変換 |
| APIクライアント | クラス | 認証情報や設定を保持 |
| ビジネスロジック | 関数またはクラス | 複雑さによる |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| クラス | プロパティ + メソッド + コンストラクタ |
| アクセス修飾子 | public, private, protected, readonly |
| 継承 | extends で親クラスの機能を引き継ぐ |
| implements | インターフェースの契約を守る |
| 使い分け | 状態管理が必要ならクラス、不要なら関数 |

### チェックリスト

- [ ] クラスを定義してインスタンスを作成できる
- [ ] アクセス修飾子（public, private）を使い分けられる
- [ ] extends で継承を使える
- [ ] implements でインターフェースを実装できる
- [ ] クラスと関数の適切な使い分けを判断できる

---

## 次のステップへ

クラスとオブジェクト指向の基本を学びました。

次はいよいよ**総合演習**です。
ここまで学んだ全てのスキルを使って、既存プロジェクトに機能を追加しましょう。

---

*推定読了時間: 30分*
