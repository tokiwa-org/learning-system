# 演習：機能追加プロジェクト

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 5
subStep: 5
title: "演習：機能追加プロジェクト"
itemType: EXERCISE
estimatedMinutes: 120
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「いよいよ本番だ」田中先輩が言った。
>
> 「タスク管理アプリに"タグ機能"と"統計機能"を追加してくれ。
> 既存のコードベースを理解して、TDDで実装して、APIと連携する。
> これまで学んだ全てのスキルを使う総合演習だ」
>
> 「2時間で全部できますか？」
>
> 「5つのパートに分かれている。順番にやれば必ずできる。頑張れ」

---

## 既存のコードベース

### 既存の型定義

```typescript
// types.ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface TaskStore {
  tasks: Task[];
  nextId: number;
}
```

### 既存のTaskManager

```typescript
// taskManager.ts
class TaskManager {
  private store: TaskStore = { tasks: [], nextId: 1 };

  addTask(title: string): Task {
    const task: Task = {
      id: this.store.nextId++,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.store.tasks.push(task);
    return task;
  }

  getAll(): Task[] {
    return [...this.store.tasks];
  }

  getById(id: number): Task | undefined {
    return this.store.tasks.find((t) => t.id === id);
  }

  complete(id: number): Task | undefined {
    const task = this.store.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = true;
    }
    return task;
  }

  delete(id: number): boolean {
    const index = this.store.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.store.tasks.splice(index, 1);
    return true;
  }
}
```

---

## Part 1: タグ機能の型定義とテスト（20分）

### 要件

- Task interface に `tags: string[]` を追加
- タグのバリデーション: 1〜20文字、空白のみ不可、最大10個
- 重複タグは追加しない

### Mission: テストを先に書く

```typescript
// tagManager.test.ts に以下のテストケースを実装してください
describe("TagManager", () => {
  describe("addTag", () => {
    it("タスクにタグを追加できる");
    it("同じタグは重複して追加されない");
    it("空文字列のタグはエラーになる");
    it("21文字以上のタグはエラーになる");
    it("11個目のタグはエラーになる");
  });

  describe("removeTag", () => {
    it("タスクからタグを削除できる");
    it("存在しないタグの削除は何も起きない");
  });

  describe("filterByTag", () => {
    it("指定したタグを持つタスクだけを返す");
    it("存在しないタグで検索すると空配列を返す");
  });
});
```

<details>
<summary>解答</summary>

```typescript
// types.ts（更新）
interface Task {
  id: number;
  title: string;
  completed: boolean;
  tags: string[];
  createdAt: string;
}

// tagManager.test.ts
import { TagManager } from "./tagManager";

describe("TagManager", () => {
  let manager: TagManager;

  beforeEach(() => {
    manager = new TagManager();
    manager.addTask("タスク1");
    manager.addTask("タスク2");
  });

  describe("addTag", () => {
    it("タスクにタグを追加できる", () => {
      const result = manager.addTag(1, "重要");
      expect(result?.tags).toContain("重要");
    });

    it("同じタグは重複して追加されない", () => {
      manager.addTag(1, "重要");
      manager.addTag(1, "重要");
      const task = manager.getById(1);
      expect(task?.tags.filter((t) => t === "重要")).toHaveLength(1);
    });

    it("空文字列のタグはエラーになる", () => {
      expect(() => manager.addTag(1, "")).toThrow();
    });

    it("21文字以上のタグはエラーになる", () => {
      const longTag = "a".repeat(21);
      expect(() => manager.addTag(1, longTag)).toThrow();
    });

    it("11個目のタグはエラーになる", () => {
      for (let i = 0; i < 10; i++) {
        manager.addTag(1, `tag${i}`);
      }
      expect(() => manager.addTag(1, "tag10")).toThrow();
    });
  });

  describe("removeTag", () => {
    it("タスクからタグを削除できる", () => {
      manager.addTag(1, "重要");
      manager.removeTag(1, "重要");
      expect(manager.getById(1)?.tags).not.toContain("重要");
    });

    it("存在しないタグの削除は何も起きない", () => {
      expect(() => manager.removeTag(1, "存在しない")).not.toThrow();
    });
  });

  describe("filterByTag", () => {
    it("指定したタグを持つタスクだけを返す", () => {
      manager.addTag(1, "重要");
      manager.addTag(2, "普通");
      const result = manager.filterByTag("重要");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("存在しないタグで検索すると空配列を返す", () => {
      expect(manager.filterByTag("存在しない")).toHaveLength(0);
    });
  });
});
```

</details>

---

## Part 2: タグ機能の実装（25分）

### Mission: テストが通る実装を書く

<details>
<summary>解答</summary>

```typescript
// tagManager.ts
const MAX_TAG_LENGTH = 20;
const MAX_TAGS_PER_TASK = 10;

class TagManager {
  private tasks: Task[] = [];
  private nextId = 1;

  addTask(title: string): Task {
    const task: Task = {
      id: this.nextId++,
      title,
      completed: false,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(task);
    return task;
  }

  getById(id: number): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  getAll(): Task[] {
    return [...this.tasks];
  }

  addTag(taskId: number, tag: string): Task | undefined {
    const trimmed = tag.trim();

    if (trimmed.length === 0) {
      throw new Error("タグは空にできません");
    }
    if (trimmed.length > MAX_TAG_LENGTH) {
      throw new Error(`タグは${MAX_TAG_LENGTH}文字以内にしてください`);
    }

    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return undefined;

    if (task.tags.includes(trimmed)) {
      return task;
    }

    if (task.tags.length >= MAX_TAGS_PER_TASK) {
      throw new Error(`タグは最大${MAX_TAGS_PER_TASK}個までです`);
    }

    task.tags.push(trimmed);
    return task;
  }

  removeTag(taskId: number, tag: string): Task | undefined {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return undefined;

    task.tags = task.tags.filter((t) => t !== tag);
    return task;
  }

  filterByTag(tag: string): Task[] {
    return this.tasks.filter((t) => t.tags.includes(tag));
  }
}

export { TagManager };
```

</details>

---

## Part 3: 統計機能の追加（25分）

### 要件

- 全タスクの完了率を計算
- タグ別のタスク数を集計
- 日別のタスク作成数を集計

### Mission: テストを書いてから実装

<details>
<summary>解答</summary>

```typescript
// stats.test.ts
import { TaskStats } from "./stats";

describe("TaskStats", () => {
  const tasks: Task[] = [
    { id: 1, title: "A", completed: true, tags: ["重要", "開発"], createdAt: "2025-01-15T10:00:00Z" },
    { id: 2, title: "B", completed: false, tags: ["重要"], createdAt: "2025-01-15T14:00:00Z" },
    { id: 3, title: "C", completed: true, tags: ["開発"], createdAt: "2025-01-16T09:00:00Z" },
    { id: 4, title: "D", completed: false, tags: [], createdAt: "2025-01-16T11:00:00Z" },
  ];

  it("完了率を計算できる", () => {
    const rate = TaskStats.completionRate(tasks);
    expect(rate).toBe(50);
  });

  it("空の配列の完了率は0", () => {
    expect(TaskStats.completionRate([])).toBe(0);
  });

  it("タグ別のタスク数を集計できる", () => {
    const result = TaskStats.countByTag(tasks);
    expect(result).toEqual({ "重要": 2, "開発": 2 });
  });

  it("日別のタスク作成数を集計できる", () => {
    const result = TaskStats.countByDate(tasks);
    expect(result).toEqual({ "2025-01-15": 2, "2025-01-16": 2 });
  });
});

// stats.ts
class TaskStats {
  static completionRate(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }

  static countByTag(tasks: Task[]): Record<string, number> {
    return tasks.reduce<Record<string, number>>((acc, task) => {
      task.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});
  }

  static countByDate(tasks: Task[]): Record<string, number> {
    return tasks.reduce<Record<string, number>>((acc, task) => {
      const date = task.createdAt.split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  }
}

export { TaskStats };
```

</details>

---

## Part 4: APIクライアントの実装（25分）

### Mission: TaskApiClient クラスを作成し、タグ操作のAPIメソッドを追加

<details>
<summary>解答</summary>

```typescript
// taskApiClient.ts
class TaskApiClient {
  constructor(
    private baseUrl: string,
    private authToken?: string
  ) {}

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers as Record<string, string> },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) return undefined as T;
    return response.json();
  }

  // タスクCRUD
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>("/tasks");
  }

  async createTask(title: string, tags: string[] = []): Promise<Task> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title, tags }),
    });
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.request<void>(`/tasks/${id}`, { method: "DELETE" });
  }

  // タグ操作
  async addTag(taskId: number, tag: string): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}/tags`, {
      method: "POST",
      body: JSON.stringify({ tag }),
    });
  }

  async removeTag(taskId: number, tag: string): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}/tags/${encodeURIComponent(tag)}`, {
      method: "DELETE",
    });
  }

  async getTasksByTag(tag: string): Promise<Task[]> {
    return this.request<Task[]>(`/tasks?tag=${encodeURIComponent(tag)}`);
  }

  // 統計
  async getStats(): Promise<{ completionRate: number; tagCounts: Record<string, number> }> {
    return this.request(`/tasks/stats`);
  }
}

export { TaskApiClient };
```

</details>

---

## Part 5: リファクタリング（25分）

### Mission: 以下の観点でコードを改善

1. マジックナンバーを定数に
2. エラーメッセージを統一
3. バリデーションロジックを共通化
4. JSDocコメントを追加

<details>
<summary>解答</summary>

```typescript
// constants.ts
export const MAX_TAG_LENGTH = 20;
export const MAX_TAGS_PER_TASK = 10;
export const MIN_TAG_LENGTH = 1;

// errors.ts
export const ERROR_MESSAGES = {
  TAG_EMPTY: "タグは空にできません",
  TAG_TOO_LONG: `タグは${MAX_TAG_LENGTH}文字以内にしてください`,
  TAG_LIMIT_EXCEEDED: `タグは最大${MAX_TAGS_PER_TASK}個までです`,
  TASK_NOT_FOUND: "タスクが見つかりません",
  TITLE_EMPTY: "タイトルは必須です",
} as const;

// validation.ts
/**
 * タグのバリデーションを行う
 * @param tag - 検証するタグ文字列
 * @returns エラーメッセージ（正常の場合はnull）
 */
export function validateTag(tag: string): string | null {
  const trimmed = tag.trim();
  if (trimmed.length < MIN_TAG_LENGTH) {
    return ERROR_MESSAGES.TAG_EMPTY;
  }
  if (trimmed.length > MAX_TAG_LENGTH) {
    return ERROR_MESSAGES.TAG_TOO_LONG;
  }
  return null;
}

/**
 * タイトルのバリデーションを行う
 * @param title - 検証するタイトル文字列
 * @returns エラーメッセージ（正常の場合はnull）
 */
export function validateTitle(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return ERROR_MESSAGES.TITLE_EMPTY;
  }
  return null;
}
```

</details>

---

## 達成度チェック

| パート | テーマ | 完了 |
|--------|--------|------|
| Part 1 | タグ機能のテスト作成 | [ ] |
| Part 2 | タグ機能の実装 | [ ] |
| Part 3 | 統計機能の追加 | [ ] |
| Part 4 | APIクライアント | [ ] |
| Part 5 | リファクタリング | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| TDD | テストを先に書き、実装で通す |
| 型定義 | interface を先に定義してから実装 |
| クラス設計 | APIクライアントを構造化 |
| リファクタリング | 定数化、共通化、ドキュメント |

### チェックリスト

- [ ] 既存のコードベースに機能を追加できた
- [ ] TDDサイクルで実装を進められた
- [ ] APIクライアントをクラスとして実装できた
- [ ] リファクタリングで品質を改善できた

---

## 次のステップへ

お疲れさまでした。全てのスキルを組み合わせた総合演習でした。

次のセクションでは、Step 5の理解度チェックです。

---

*推定所要時間: 120分*
