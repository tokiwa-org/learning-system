# git initでリポジトリを作ろう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 2
subStep: 2
title: "git initでリポジトリを作ろう"
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

> 「フォルダの準備ができたね。次はこのフォルダをGitリポジトリにしよう」
>
> 「リポジトリって、前に聞いた『変更履歴を保存する場所』ですよね？」
>
> 「そう！`git init`っていうコマンドを使うと、普通のフォルダがリポジトリに変わるんだ」

---

## git initとは

`git init` は、現在のフォルダをGitリポジトリとして**初期化**するコマンドです。

```bash
git init
```

このコマンドを実行すると：
- `.git` という隠しフォルダが作成される
- Gitがこのフォルダを管理し始める
- 変更履歴を記録できるようになる

---

## 実際にやってみよう

### Step 1: 作業フォルダにいることを確認

```bash
pwd
```

出力例：
```
/Users/yourname/my-first-git
```

> 前のセクションで作った `my-first-git` フォルダにいることを確認してください。

### Step 2: git initを実行

```bash
git init
```

出力：
```
Initialized empty Git repository in /Users/yourname/my-first-git/.git/
```

**おめでとうございます！** これであなたのフォルダはGitリポジトリになりました。

---

## 何が起きたのか

### .gitフォルダが作成された

`git init` を実行すると、`.git` という隠しフォルダが作られます。

```bash
ls -la
```

出力：
```
total 8
drwxr-xr-x  4 user  staff  128  1月 27 10:00 .
drwxr-xr-x  5 user  staff  160  1月 27 09:55 ..
drwxr-xr-x  9 user  staff  288  1月 27 10:00 .git
-rw-r--r--  1 user  staff   11  1月 27 09:56 hello.txt
```

> `-la` オプションで隠しファイル（`.` で始まるファイル）も表示されます。

### .gitフォルダの中身

```bash
ls .git
```

出力：
```
HEAD  config  description  hooks  info  objects  refs
```

この中にGitのすべての情報が保存されます。

| ファイル/フォルダ | 役割 |
|------------------|------|
| `objects/` | コミットやファイルの実体を保存 |
| `refs/` | ブランチやタグの参照を保存 |
| `HEAD` | 現在のブランチを記録 |
| `config` | このリポジトリの設定 |

> 今はこれらの詳細を覚える必要はありません。「.gitフォルダが重要」ということだけ覚えておいてください。

---

## リポジトリの状態を確認しよう

Gitには、現在の状態を確認するコマンドがあります。

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

### 出力の意味

| 表示 | 意味 |
|------|------|
| `On branch main` | 「main」というブランチにいる |
| `No commits yet` | まだ何もコミット（記録）していない |
| `Untracked files` | 追跡されていないファイルがある |
| `hello.txt` | このファイルがまだ追跡されていない |

> **Untracked（追跡されていない）** = Gitがまだ管理していない

---

## イメージで理解しよう

### git init前

```
my-first-git/           ← ただのフォルダ
└── hello.txt
```

### git init後

```
my-first-git/           ← Gitリポジトリ！
├── .git/               ← Gitの管理情報
│   ├── objects/
│   ├── refs/
│   └── ...
└── hello.txt           ← まだ追跡されていない
```

---

## 注意：.gitフォルダを削除しないで！

`.git` フォルダを削除すると、すべての変更履歴が失われます。

```bash
# 絶対にやらないで！
rm -rf .git  # これをやるとすべてが消える
```

もし間違えて削除してしまったら、`git init` をもう一度実行すればリポジトリは作り直せます。
ただし、過去のコミット履歴はすべて失われます。

---

## よくある間違い

### 間違い1: 別のフォルダでgit initしてしまった

```bash
pwd  # 現在地を確認
```

意図しないフォルダでリポジトリを作ってしまった場合は、`.git` フォルダを削除してください。

```bash
rm -rf .git
```

### 間違い2: 二重にgit initしてしまった

```bash
git init
```

すでにリポジトリのフォルダで `git init` を実行しても、既存のリポジトリは上書きされません。
メッセージが `Reinitialized existing Git repository...` になるだけで、履歴は保持されます。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. 現在地を確認
pwd

# 2. リポジトリを初期化
git init

# 3. .gitフォルダを確認
ls -la

# 4. 状態を確認
git status
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| `git init` | フォルダをGitリポジトリに変換 |
| `.git` フォルダ | Gitの管理情報が保存される場所 |
| `git status` | リポジトリの現在の状態を確認 |
| Untracked | まだGitに追跡されていないファイル |

### チェックリスト

- [ ] `git init` を実行できた
- [ ] `.git` フォルダが作成されたことを確認できた
- [ ] `git status` でリポジトリの状態を確認できた

---

## 次のステップへ

リポジトリの作成ができましたね。

でも、`hello.txt` はまだ「Untracked（追跡されていない）」状態です。

次のセクションでは、`git add` コマンドを使って、
ファイルをGitの管理対象に追加する方法を学びます。

---

*推定読了時間: 30分*
