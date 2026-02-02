# git addでステージングしよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 2
subStep: 3
title: "git addでステージングしよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「リポジトリはできたけど、まだファイルが『追跡されていない』状態だよね」
>
> 「Untracked って表示されてました」
>
> 「次は `git add` でファイルをステージングしよう。ステージングって何かわかる？」
>
> 「全然わからないです...」
>
> 「じゃあ、写真撮影に例えて説明するね」

---

## ステージングとは

**ステージング**とは、「コミット（記録）したいファイルを選ぶ」ことです。

### 写真撮影の例え

```
変更したファイル（人々）
    ↓
ステージング（ステージに上がる）  ← git add
    ↓
コミット（写真を撮る）           ← git commit
    ↓
履歴として保存（アルバムに保存）
```

全員を一度に撮影することもできますし、特定の人だけを選んで撮影することもできます。

---

## なぜステージングが必要なのか

### 理由1: 変更を選別できる

10個のファイルを変更しても、「今回は3個だけコミットしたい」ということができます。

### 理由2: 意味のあるコミットを作れる

関連する変更だけをまとめてコミットできます。

```
良い例：
  コミット1: 「ログイン機能を追加」
  コミット2: 「デザインを調整」

悪い例：
  コミット1: 「ログイン機能追加とデザイン調整とバグ修正」
```

### 理由3: ミスを防げる

コミット前に「本当にこれで良いか」確認する時間ができます。

---

## git addの基本

### 特定のファイルをステージング

```bash
git add ファイル名
```

例：
```bash
git add hello.txt
```

### 複数ファイルをステージング

```bash
git add file1.txt file2.txt file3.txt
```

### すべての変更をステージング

```bash
git add .
```

> `.` は「現在のディレクトリのすべて」を意味します。

---

## 実際にやってみよう

### Step 1: 現在の状態を確認

```bash
git status
```

出力：
```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        hello.txt

nothing added to commit but untracked files present (use "git add" to track)
```

`hello.txt` が赤字（Untracked）で表示されます。

### Step 2: ファイルをステージング

```bash
git add hello.txt
```

> 何も出力されなければ成功です！

### Step 3: 状態を再確認

```bash
git status
```

出力：
```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   hello.txt
```

`hello.txt` が緑色に変わり、`Changes to be committed`（コミット予定）に移動しました！

---

## 状態の変化を理解しよう

### ステージング前

```
作業ディレクトリ          ステージングエリア        リポジトリ
[hello.txt]                   [ ]                    [ ]
   (赤)                      (空)                  (空)
```

### ステージング後

```
作業ディレクトリ          ステージングエリア        リポジトリ
[hello.txt]              [hello.txt]               [ ]
   (緑)                     (緑)                  (空)
```

ファイルがステージングエリアにコピーされました。
次の `git commit` で、ステージングエリアの内容がリポジトリに記録されます。

---

## ステージングを取り消す方法

間違えてステージングしてしまったら、取り消すことができます。

```bash
git rm --cached ファイル名
```

例：
```bash
git rm --cached hello.txt
```

> これはファイルを削除するのではなく、**ステージングを取り消す**だけです。

または、Gitの新しいバージョンでは：

```bash
git restore --staged ファイル名
```

---

## 複数ファイルで練習しよう

### 追加のファイルを作成

```bash
echo "This is file 2" > file2.txt
echo "This is file 3" > file3.txt
```

### 状態を確認

```bash
git status
```

出力：
```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   hello.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        file2.txt
        file3.txt
```

- `hello.txt` → ステージング済み（緑）
- `file2.txt`, `file3.txt` → 未追跡（赤）

### 1つだけステージング

```bash
git add file2.txt
git status
```

出力：
```
Changes to be committed:
        new file:   hello.txt
        new file:   file2.txt

Untracked files:
        file3.txt
```

### 残りもすべてステージング

```bash
git add .
git status
```

出力：
```
Changes to be committed:
        new file:   file2.txt
        new file:   file3.txt
        new file:   hello.txt
```

すべてのファイルがステージングされました！

---

## よくある間違い

### 間違い1: ファイル名のタイプミス

```bash
git add helo.txt  # hello.txt のつもりが...
```

エラー：
```
fatal: pathspec 'helo.txt' did not match any files
```

→ ファイル名を確認して再実行しましょう。

### 間違い2: 空のフォルダをaddしようとする

Gitは空のフォルダを追跡できません。

→ フォルダの中にファイルを作成してからaddしましょう。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. 状態を確認（ステージング前）
git status

# 2. hello.txtをステージング
git add hello.txt

# 3. 状態を確認（ステージング後）
git status

# 4. 追加ファイルを作成
echo "This is file 2" > file2.txt

# 5. すべてをステージング
git add .

# 6. 最終確認
git status
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ステージング | コミットしたいファイルを選ぶ作業 |
| `git add ファイル名` | 特定のファイルをステージング |
| `git add .` | すべての変更をステージング |
| ステージング取り消し | `git rm --cached` または `git restore --staged` |

### ステータスの見方

| 状態 | 表示色 | 意味 |
|------|--------|------|
| Untracked | 赤 | まだ追跡されていない |
| Changes to be committed | 緑 | ステージング済み、コミット待ち |

### チェックリスト

- [ ] `git add` でファイルをステージングできた
- [ ] `git status` でステージング状態を確認できた
- [ ] 複数ファイルをステージングできた

---

## 次のステップへ

ファイルのステージングができましたね。

次のセクションでは、いよいよ `git commit` コマンドを使って、
変更をリポジトリに記録します。

これが「バージョン」を作る瞬間です！

---

*推定読了時間: 30分*
