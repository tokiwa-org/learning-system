# 外部キーとリレーションを理解しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 1
subStep: 4
title: "外部キーとリレーションを理解しよう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「テーブルを作ったけど、FOREIGN KEY って何のためにあるの？」
>
> 先輩がにっこり笑った。
>
> 「いい質問だ。外部キーがないと、存在しない部署IDを持つ社員データが入れられてしまう」
>
> 「それって、まずいですよね？」
>
> 「まずい。データの整合性が崩壊する。だから外部キーで『このカラムは、あのテーブルの値しか入れられない』というルールを作るんだ」

---

## 外部キー（FOREIGN KEY）とは

外部キーは、**あるテーブルのカラムが、別のテーブルの主キーを参照する**制約です。

### 具体例

```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department_id INTEGER,
    -- ↓ department_id は departments テーブルの id を参照する
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

この制約により：
- `department_id` には `departments` テーブルに存在する `id` の値しか入れられない
- 存在しない部署ID（例: 99）を入れようとするとエラーになる

---

## 参照整合性（Referential Integrity）

外部キーが保証する「データの一貫性」を**参照整合性**と呼びます。

### 外部キーがない場合の問題

```sql
-- 外部キーなしの場合、こんなデータが入ってしまう
INSERT INTO employees VALUES (11, '幽霊社員', 99, '不明', 0, '2024-01-01', NULL);
-- department_id = 99 だが、そんな部署は存在しない！
```

### 外部キーがある場合

```sql
-- SQLiteで外部キー制約を有効にする（デフォルトは無効）
PRAGMA foreign_keys = ON;

-- 存在しない部署IDを挿入しようとすると...
INSERT INTO employees VALUES (11, '幽霊社員', 99, '不明', 0, '2024-01-01', NULL);
-- Error: FOREIGN KEY constraint failed
```

> **SQLiteの注意点**: SQLiteでは外部キー制約がデフォルトで無効です。`PRAGMA foreign_keys = ON;` を実行して有効にする必要があります。

---

## リレーション（テーブル間の関係）

### 3つのリレーションタイプ

| タイプ | 説明 | 例 |
|--------|------|-----|
| 1対1（one-to-one） | 1つの行が相手テーブルの1つの行に対応 | 社員 ↔ 社員証 |
| 1対多（one-to-many） | 1つの行が相手テーブルの複数の行に対応 | 部署 → 社員（1つの部署に複数の社員） |
| 多対多（many-to-many） | 複数の行が相互に複数の行に対応 | 社員 ↔ プロジェクト |

### 今回のデータベースのリレーション

```
departments (1) ←→ (多) employees
  1つの部署に複数の社員が所属

departments (1) ←→ (多) projects
  1つの部署が複数のプロジェクトを担当

employees (多) ←→ (多) projects
  社員は複数のプロジェクトに参加でき、
  プロジェクトには複数の社員が参加する
  → project_members テーブルで中間テーブルとして実現
```

---

## 中間テーブル（Junction Table）

多対多のリレーションは、直接表現できません。
**中間テーブル**を使って、2つの1対多に分解します。

```
employees (1) ←→ (多) project_members (多) ←→ (1) projects
```

```sql
-- 中間テーブル
CREATE TABLE project_members (
    project_id INTEGER,    -- projects.id を参照
    employee_id INTEGER,   -- employees.id を参照
    role TEXT,
    PRIMARY KEY (project_id, employee_id)
);
```

これにより：
- 佐藤花子（id=2）は「ECサイトリニューアル」と「社内ツール開発」の2つに参加
- 「ECサイトリニューアル」には田中、佐藤、鈴木の3人が参加

---

## CASCADE（連鎖操作）

親テーブルのデータが削除・更新されたとき、子テーブルのデータをどうするかを指定できます。

### CASCADEの種類

| オプション | 動作 |
|-----------|------|
| CASCADE | 親の削除/更新に連動して子も削除/更新 |
| SET NULL | 親が削除されたら子の外部キーをNULLにする |
| SET DEFAULT | 親が削除されたら子の外部キーをデフォルト値にする |
| RESTRICT | 子が存在する場合、親の削除/更新を拒否 |
| NO ACTION | RESTRICTと同様（デフォルト） |

### 使用例

```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
```

この例では：
- 部署が削除されたら、その部署に所属していた社員の `department_id` が NULL になる
- 部署のIDが変更されたら、社員の `department_id` も自動的に更新される

---

## 実践：外部キーの動作を確認

```sql
-- 外部キー制約を有効化
PRAGMA foreign_keys = ON;

-- 存在する部署IDで社員を追加（成功する）
INSERT INTO employees VALUES (11, 'テスト太郎', 1, 'テスト', 300000, '2024-01-01', NULL);

-- 存在しない部署IDで社員を追加（失敗する）
INSERT INTO employees VALUES (12, 'テスト花子', 99, 'テスト', 300000, '2024-01-01', NULL);
-- Error: FOREIGN KEY constraint failed

-- テストデータを削除
DELETE FROM employees WHERE id = 11;
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 外部キー | 他のテーブルの主キーを参照する制約 |
| 参照整合性 | データの一貫性を保証する仕組み |
| リレーション | 1対1、1対多、多対多の3タイプ |
| 中間テーブル | 多対多を実現するための橋渡しテーブル |
| CASCADE | 親データの変更時の子データの挙動を制御 |

### チェックリスト
- [ ] 外部キーの役割を説明できる
- [ ] 参照整合性という概念を理解した
- [ ] 3つのリレーションタイプを区別できる
- [ ] 中間テーブルの必要性を理解した
- [ ] CASCADEオプションの違いを把握した

---

## 次のステップへ

外部キーとリレーションを理解できました。
次のセクションでは、これらの関係を視覚的に表現する「ER図」の読み方を学びます。

---

*推定読了時間: 25分*
