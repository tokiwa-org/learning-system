# 総合演習：新機能実装＆レビュー対応

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 6
subStep: 1
title: "総合演習：新機能実装＆レビュー対応"
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

> 「最終試験だ」田中先輩が腕を組んだ。
>
> 「タスク管理アプリに"期限管理機能"を追加してくれ。
> 要件分析から始めて、テストを書き、TypeScriptで実装し、
> Pythonでデータ処理スクリプトを作り、最後にセルフレビューで品質を上げる」
>
> 「5つのパートに分かれている。全部やりきったら、
> **プログラミング基礎の修了証明書**を出す。頑張れ！」

---

## Part 1: 要件分析（15分）

### 機能要件

タスクに「期限（due date）」を設定でき、期限切れタスクを管理できるようにする。

### Mission: ユーザーストーリーと受け入れ条件を作成してください

以下の要件をユーザーストーリーと受け入れ条件に変換してください。

- タスクに期限を設定できる
- 期限切れのタスクを一覧表示できる
- 期限が近いタスクを警告表示できる（3日以内）
- 期限でソートできる

<details>
<summary>解答</summary>

```markdown
## ユーザーストーリー 1: タスクに期限を設定する
ユーザーとして、タスクに期限を設定したい。
理由: タスクの優先順位を時間で管理するため。

### 受け入れ条件
- [ ] タスク作成時に期限（日付）を任意で設定できる
- [ ] 既存タスクの期限を追加・変更できる
- [ ] 期限は YYYY-MM-DD 形式で入力する
- [ ] 過去の日付も設定できる（完了済みタスクの記録用）
- [ ] 期限を削除（未設定に戻す）できる

## ユーザーストーリー 2: 期限切れタスクを表示する
ユーザーとして、期限切れのタスクを確認したい。
理由: 対応漏れを防ぐため。

### 受け入れ条件
- [ ] 現在日時より前の期限を持つ未完了タスクを抽出できる
- [ ] 完了済みタスクは期限切れに含まない
- [ ] 期限未設定のタスクは期限切れに含まない

## ユーザーストーリー 3: 期限が近いタスクを警告する
ユーザーとして、期限が近いタスクを事前に知りたい。
理由: 直前になって慌てないため。

### 受け入れ条件
- [ ] 期限が3日以内の未完了タスクを「警告」として表示
- [ ] 警告の日数は設定可能（デフォルト3日）
```

</details>

---

## Part 2: テスト作成 - TDD（20分）

### Mission: 以下のテストケースを Jest で実装してください

```typescript
describe("DueDateManager", () => {
  describe("setDueDate", () => {
    it("タスクに期限を設定できる");
    it("期限を更新できる");
    it("期限を削除できる（undefinedを設定）");
    it("存在しないタスクIDはundefinedを返す");
  });

  describe("getOverdueTasks", () => {
    it("期限切れの未完了タスクを返す");
    it("完了済みタスクは含まない");
    it("期限未設定のタスクは含まない");
  });

  describe("getUpcomingTasks", () => {
    it("期限が近い（3日以内）未完了タスクを返す");
    it("カスタム日数を指定できる");
  });

  describe("sortByDueDate", () => {
    it("期限の早い順にソートできる");
    it("期限未設定のタスクは末尾に配置される");
  });
});
```

<details>
<summary>解答</summary>

```typescript
// dueDateManager.test.ts
import { DueDateManager } from "./dueDateManager";

describe("DueDateManager", () => {
  let manager: DueDateManager;

  beforeEach(() => {
    manager = new DueDateManager();
    manager.addTask("レポート作成");
    manager.addTask("コードレビュー");
    manager.addTask("会議準備");
  });

  describe("setDueDate", () => {
    it("タスクに期限を設定できる", () => {
      const result = manager.setDueDate(1, "2025-02-01");
      expect(result?.dueDate).toBe("2025-02-01");
    });

    it("期限を更新できる", () => {
      manager.setDueDate(1, "2025-02-01");
      const result = manager.setDueDate(1, "2025-03-01");
      expect(result?.dueDate).toBe("2025-03-01");
    });

    it("期限を削除できる", () => {
      manager.setDueDate(1, "2025-02-01");
      const result = manager.setDueDate(1, undefined);
      expect(result?.dueDate).toBeUndefined();
    });

    it("存在しないタスクIDはundefinedを返す", () => {
      expect(manager.setDueDate(999, "2025-02-01")).toBeUndefined();
    });
  });

  describe("getOverdueTasks", () => {
    it("期限切れの未完了タスクを返す", () => {
      manager.setDueDate(1, "2020-01-01"); // 過去の日付
      manager.setDueDate(2, "2030-12-31"); // 未来の日付
      const overdue = manager.getOverdueTasks();
      expect(overdue).toHaveLength(1);
      expect(overdue[0].id).toBe(1);
    });

    it("完了済みタスクは含まない", () => {
      manager.setDueDate(1, "2020-01-01");
      manager.complete(1);
      expect(manager.getOverdueTasks()).toHaveLength(0);
    });

    it("期限未設定のタスクは含まない", () => {
      expect(manager.getOverdueTasks()).toHaveLength(0);
    });
  });

  describe("getUpcomingTasks", () => {
    it("期限が近い未完了タスクを返す", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split("T")[0];
      manager.setDueDate(1, dateStr);

      const upcoming = manager.getUpcomingTasks();
      expect(upcoming).toHaveLength(1);
    });

    it("カスタム日数を指定できる", () => {
      const inFiveDays = new Date();
      inFiveDays.setDate(inFiveDays.getDate() + 5);
      const dateStr = inFiveDays.toISOString().split("T")[0];
      manager.setDueDate(1, dateStr);

      expect(manager.getUpcomingTasks(3)).toHaveLength(0);
      expect(manager.getUpcomingTasks(7)).toHaveLength(1);
    });
  });

  describe("sortByDueDate", () => {
    it("期限の早い順にソートできる", () => {
      manager.setDueDate(1, "2025-03-01");
      manager.setDueDate(2, "2025-01-01");
      manager.setDueDate(3, "2025-02-01");

      const sorted = manager.sortByDueDate();
      expect(sorted[0].id).toBe(2); // 1月
      expect(sorted[1].id).toBe(3); // 2月
      expect(sorted[2].id).toBe(1); // 3月
    });

    it("期限未設定のタスクは末尾に配置される", () => {
      manager.setDueDate(1, "2025-01-01");
      // 2, 3 は期限未設定

      const sorted = manager.sortByDueDate();
      expect(sorted[0].id).toBe(1);
    });
  });
});
```

</details>

---

## Part 3: TypeScript実装（20分）

### Mission: テストが通る DueDateManager を実装してください

<details>
<summary>解答</summary>

```typescript
// dueDateManager.ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
  tags: string[];
  dueDate?: string; // YYYY-MM-DD format
  createdAt: string;
}

class DueDateManager {
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

  complete(id: number): Task | undefined {
    const task = this.tasks.find((t) => t.id === id);
    if (task) task.completed = true;
    return task;
  }

  setDueDate(taskId: number, dueDate: string | undefined): Task | undefined {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return undefined;
    task.dueDate = dueDate;
    return task;
  }

  getOverdueTasks(): Task[] {
    const today = new Date().toISOString().split("T")[0];
    return this.tasks.filter(
      (t) => !t.completed && t.dueDate !== undefined && t.dueDate < today
    );
  }

  getUpcomingTasks(withinDays: number = 3): Task[] {
    const today = new Date();
    const deadline = new Date();
    deadline.setDate(today.getDate() + withinDays);

    const todayStr = today.toISOString().split("T")[0];
    const deadlineStr = deadline.toISOString().split("T")[0];

    return this.tasks.filter(
      (t) =>
        !t.completed &&
        t.dueDate !== undefined &&
        t.dueDate >= todayStr &&
        t.dueDate <= deadlineStr
    );
  }

  sortByDueDate(): Task[] {
    return [...this.tasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }
}

export { DueDateManager };
export type { Task };
```

</details>

---

## Part 4: Pythonデータ処理スクリプト（20分）

### Mission: タスクデータのJSON を受け取り、レポートを生成するPythonスクリプトを作成

要件:
- JSON ファイルからタスクデータを読み込む
- 完了率を計算
- 期限切れタスクの一覧を表示
- タグ別の統計を表示

<details>
<summary>解答</summary>

```python
#!/usr/bin/env python3
"""タスクデータ分析レポート生成スクリプト"""

import json
import sys
from datetime import datetime
from collections import Counter
from typing import TypedDict


class Task(TypedDict):
    id: int
    title: str
    completed: bool
    tags: list[str]
    dueDate: str | None
    createdAt: str


def load_tasks(filepath: str) -> list[Task]:
    """JSONファイルからタスクデータを読み込む"""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def calc_completion_rate(tasks: list[Task]) -> float:
    """完了率を計算する"""
    if not tasks:
        return 0.0
    completed = sum(1 for t in tasks if t["completed"])
    return round(completed / len(tasks) * 100, 1)


def get_overdue_tasks(tasks: list[Task]) -> list[Task]:
    """期限切れの未完了タスクを取得する"""
    today = datetime.now().strftime("%Y-%m-%d")
    return [
        t for t in tasks
        if not t["completed"]
        and t.get("dueDate") is not None
        and t["dueDate"] < today
    ]


def count_by_tag(tasks: list[Task]) -> dict[str, int]:
    """タグ別のタスク数を集計する"""
    tags = [tag for t in tasks for tag in t.get("tags", [])]
    return dict(Counter(tags).most_common())


def generate_report(tasks: list[Task]) -> None:
    """レポートを生成して表示する"""
    print("=" * 50)
    print(" タスク分析レポート")
    print(f" 生成日時: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 50)

    # 概要
    print(f"\n--- 概要 ---")
    print(f"  総タスク数: {len(tasks)}")
    print(f"  完了率:     {calc_completion_rate(tasks)}%")

    # 期限切れタスク
    overdue = get_overdue_tasks(tasks)
    print(f"\n--- 期限切れタスク ({len(overdue)}件) ---")
    if overdue:
        for t in overdue:
            print(f"  [{t['id']}] {t['title']} (期限: {t['dueDate']})")
    else:
        print("  なし")

    # タグ別統計
    tag_counts = count_by_tag(tasks)
    print(f"\n--- タグ別統計 ---")
    if tag_counts:
        for tag, count in tag_counts.items():
            print(f"  {tag:15s} {count}件")
    else:
        print("  タグなし")

    print("\n" + "=" * 50)


if __name__ == "__main__":
    filepath = sys.argv[1] if len(sys.argv) > 1 else "tasks.json"
    try:
        tasks = load_tasks(filepath)
        generate_report(tasks)
    except FileNotFoundError:
        print(f"エラー: ファイルが見つかりません: {filepath}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"エラー: JSONの形式が不正です: {filepath}", file=sys.stderr)
        sys.exit(1)
```

</details>

---

## Part 5: セルフレビュー＆リファクタリング（15分）

### Mission: 以下のレビュー観点で自分のコードをチェックし、改善してください

| チェック項目 | 確認 |
|-------------|------|
| マジックナンバーはないか | [ ] |
| 命名規則は統一されているか | [ ] |
| エラーハンドリングは適切か | [ ] |
| 型定義は正確か | [ ] |
| 重複コードはないか | [ ] |
| テストは十分か（正常系・異常系・境界値） | [ ] |
| any 型を使っていないか | [ ] |
| console.log が残っていないか | [ ] |

### レビュー指摘の例と修正

```typescript
// 指摘1: マジックナンバー
// Before
if (daysUntilDue <= 3) { ... }
// After
const WARNING_THRESHOLD_DAYS = 3;
if (daysUntilDue <= WARNING_THRESHOLD_DAYS) { ... }

// 指摘2: エラーメッセージの改善
// Before
throw new Error("エラー");
// After
throw new Error(`タスクID ${taskId} が見つかりません`);

// 指摘3: 型の厳密化
// Before
dueDate: string | undefined;
// After
type DateString = `${number}-${number}-${number}`;
dueDate?: DateString;
```

---

## 達成度チェック

| パート | テーマ | 完了 |
|--------|--------|------|
| Part 1 | 要件分析 | [ ] |
| Part 2 | テスト作成（TDD） | [ ] |
| Part 3 | TypeScript実装 | [ ] |
| Part 4 | Pythonスクリプト | [ ] |
| Part 5 | セルフレビュー | [ ] |

---

## まとめ

この総合演習では、以下のスキルを全て組み合わせました：

| スキル | パート |
|--------|--------|
| 要件分析（ユーザーストーリー、受け入れ条件） | Part 1 |
| TDD（Red-Green-Refactor） | Part 2 |
| TypeScript（型定義、クラス、メソッド） | Part 3 |
| Python（データ処理、レポート生成） | Part 4 |
| コードレビュー（セルフレビュー） | Part 5 |

### チェックリスト

- [ ] 曖昧な要件からユーザーストーリーを作成できた
- [ ] テストを先に書いてから実装できた
- [ ] TypeScriptで型安全なクラスを実装できた
- [ ] Pythonでデータ処理スクリプトを作成できた
- [ ] セルフレビューでコード品質を改善できた

---

## 次のステップへ

お疲れさまでした。全てのスキルを結集した最終演習を完了しました。

最後に**卒業クイズ**です。80%以上で合格し、修了証明書を獲得しましょう。

---

*推定所要時間: 90分*
