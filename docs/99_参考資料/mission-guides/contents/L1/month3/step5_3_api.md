# REST APIクライアントを作ろう

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 5
subStep: 3
title: "REST APIクライアントを作ろう"
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

> 「タスク管理アプリのデータはAPIサーバーに保存されている」
>
> 田中先輩がAPIドキュメントを見せた。
>
> 「フロントエンドからAPIを呼び出して、データのCRUDを行う。
> APIクライアントを型安全に作れるかが、TypeScriptエンジニアの腕の見せ所だ」

---

## REST API の復習

| HTTPメソッド | 用途 | 例 |
|-------------|------|-----|
| GET | データ取得 | `GET /api/tasks` |
| POST | データ作成 | `POST /api/tasks` |
| PUT | データ全更新 | `PUT /api/tasks/1` |
| PATCH | データ部分更新 | `PATCH /api/tasks/1` |
| DELETE | データ削除 | `DELETE /api/tasks/1` |

### レスポンスのステータスコード

| コード | 意味 |
|--------|------|
| 200 | OK（成功） |
| 201 | Created（作成成功） |
| 204 | No Content（削除成功） |
| 400 | Bad Request（リクエスト不正） |
| 401 | Unauthorized（認証エラー） |
| 404 | Not Found（見つからない） |
| 500 | Internal Server Error |

---

## 型定義から始める

```typescript
// types.ts

// タスクの型
interface Task {
  id: number;
  title: string;
  completed: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// タスク作成時の入力型（idやタイムスタンプはサーバーが生成）
interface CreateTaskInput {
  title: string;
  tags?: string[];
}

// タスク更新時の入力型（部分更新のため全てオプショナル）
interface UpdateTaskInput {
  title?: string;
  completed?: boolean;
  tags?: string[];
}

// APIレスポンスの共通型
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// エラーレスポンスの型
interface ApiError {
  message: string;
  statusCode: number;
  details?: string[];
}
```

---

## APIクライアントの実装

```typescript
// apiClient.ts

const BASE_URL = "https://api.example.com";

class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: string[]
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        message: `HTTP Error: ${response.status}`,
        statusCode: response.status,
      };
    }
    throw new ApiClientError(
      errorData.message,
      errorData.statusCode,
      errorData.details
    );
  }

  // 204 No Content の場合はボディなし
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
```

---

## CRUD 関数の実装

```typescript
// taskApi.ts

// 一覧取得
async function getTasks(): Promise<Task[]> {
  const response = await request<ApiResponse<Task[]>>("/api/tasks");
  return response.data;
}

// 1件取得
async function getTask(id: number): Promise<Task> {
  const response = await request<ApiResponse<Task>>(`/api/tasks/${id}`);
  return response.data;
}

// 作成
async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await request<ApiResponse<Task>>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

// 更新
async function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  const response = await request<ApiResponse<Task>>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return response.data;
}

// 削除
async function deleteTask(id: number): Promise<void> {
  await request<void>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}
```

---

## エラーハンドリング

```typescript
async function main(): Promise<void> {
  try {
    // タスク一覧を取得
    const tasks = await getTasks();
    console.log(`タスク数: ${tasks.length}`);

    // 新しいタスクを作成
    const newTask = await createTask({
      title: "TypeScriptの勉強",
      tags: ["学習", "プログラミング"],
    });
    console.log(`作成: ${newTask.title} (ID: ${newTask.id})`);

    // タスクを完了にする
    const updated = await updateTask(newTask.id, { completed: true });
    console.log(`完了: ${updated.title}`);

  } catch (error) {
    if (error instanceof ApiClientError) {
      switch (error.statusCode) {
        case 401:
          console.error("認証が必要です。ログインしてください。");
          break;
        case 404:
          console.error("リソースが見つかりません。");
          break;
        case 400:
          console.error("入力内容に問題があります:", error.details);
          break;
        default:
          console.error(`APIエラー (${error.statusCode}): ${error.message}`);
      }
    } else {
      console.error("ネットワークエラーが発生しました");
    }
  }
}
```

---

## クエリパラメータの処理

```typescript
// 検索・フィルタリング用のパラメータ
interface TaskSearchParams {
  completed?: boolean;
  tag?: string;
  page?: number;
  limit?: number;
}

function buildQueryString(params: TaskSearchParams): string {
  const searchParams = new URLSearchParams();

  if (params.completed !== undefined) {
    searchParams.set("completed", String(params.completed));
  }
  if (params.tag) {
    searchParams.set("tag", params.tag);
  }
  if (params.page) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// フィルタ付きでタスクを取得
async function searchTasks(params: TaskSearchParams): Promise<Task[]> {
  const query = buildQueryString(params);
  const response = await request<ApiResponse<Task[]>>(`/api/tasks${query}`);
  return response.data;
}

// 使用例
const incompleteTasks = await searchTasks({ completed: false, limit: 10 });
const learningTasks = await searchTasks({ tag: "学習" });
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| REST API | GET/POST/PUT/PATCH/DELETE の使い分け |
| 型定義 | レスポンス・リクエストの型を先に定義 |
| APIクライアント | 共通のrequest関数を作り、各CRUD関数で利用 |
| エラーハンドリング | ステータスコードに応じた処理 |
| クエリパラメータ | URLSearchParams で安全に構築 |

### チェックリスト

- [ ] REST APIのHTTPメソッドを使い分けられる
- [ ] APIレスポンスの型を定義できる
- [ ] fetch を使ってGET/POST/PATCH/DELETEリクエストを送れる
- [ ] APIエラーを適切にハンドリングできる
- [ ] クエリパラメータを動的に構築できる

---

## 次のステップへ

REST APIクライアントの作り方を学びました。

次のセクションでは、**クラスとオブジェクト指向**の基本を学びます。
APIクライアントをクラスとして整理し、より構造化されたコードを書きましょう。

---

*推定読了時間: 30分*
