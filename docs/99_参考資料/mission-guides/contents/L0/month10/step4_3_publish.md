# GitHubにプッシュしよう

## メタ情報

```yaml
mission: "新人エンジニアの初仕事を完遂しよう"
step: 4
subStep: 3
title: "GitHubにプッシュしよう"
itemType: EXERCISE
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "総合"
  category: "総合演習"
  target_level: "L0"
```

---

## ストーリー

> Webページが完成した。でも、まだローカルの自分のPCにしかない。
>
> 「GitHubにプッシュして公開しないと、先輩も確認できないな」
>
> 月2で学んだリモートリポジトリの操作を思い出す。
>
> でもその前に、月8で学んだコミット前チェックをやっておこう。

---

## ミッション概要

コミット前チェックを行った後、GitHubにリポジトリをプッシュしてください。

### 達成条件

- [ ] コミット前チェックリストを確認した
- [ ] GitHubにリポジトリを作成した
- [ ] リモートリポジトリを設定した
- [ ] プッシュが成功した

---

## Part 1: プッシュ前チェック（月8の復習）

### タスク 1-1: 現在の状態を確認

```bash
cd ~/projects/internal-tools-page

# 状態確認
git status

# コミット履歴確認
git log --oneline
```

### タスク 1-2: コミット前チェックリスト

プッシュする前に、以下の項目を確認してください。

| # | チェック項目 | 確認方法 | OK? |
|---|-------------|---------|-----|
| 1 | 未コミットの変更がないか | `git status` → "working tree clean" | [ ] |
| 2 | .gitignoreが正しく設定されているか | `cat .gitignore` | [ ] |
| 3 | 秘密情報が含まれていないか | パスワード、APIキーがないか確認 | [ ] |
| 4 | データベースファイルが除外されているか | `git ls-files` に .db がないこと | [ ] |
| 5 | HTMLがブラウザで正しく表示されるか | ブラウザで確認 | [ ] |
| 6 | コミットメッセージが適切か | `git log --oneline` | [ ] |

### タスク 1-3: 追跡ファイルの確認

```bash
# Gitが追跡しているファイル一覧
git ls-files
```

期待される出力（dbファイルが含まれていないこと）：
```
.gitignore
data/.gitkeep
data/create_tables.sql
data/insert_data.sql
data/queries.sql
docs/analysis.md
docs/daily/day1.md
docs/daily/day2.md
docs/daily/.gitkeep
docs/report/.gitkeep
docs/tool_list.txt
docs/url_check.md
index.html
style.css
```

<details>
<summary>ヒント: もし .db ファイルが追跡されている場合</summary>

```bash
# 追跡から外す（ファイル自体は削除しない）
git rm --cached data/tools.db
git commit -m ".gitignoreに従いDBファイルを追跡から除外"
```

</details>

---

## Part 2: GitHubリポジトリの作成

### タスク 2-1: GitHubでリポジトリを作成

**方法A: GitHubのWebサイトで作成**

1. https://github.com にアクセスしてログイン
2. 右上の「+」→「New repository」をクリック
3. 以下を設定：
   - Repository name: `internal-tools-page`
   - Description: `社内ツール紹介ページ`
   - Public / Private: どちらでもOK
   - Initialize with README: **チェックしない**（ローカルに既にある）
4. 「Create repository」をクリック

**方法B: gh コマンドで作成**

```bash
# GitHub CLIがインストールされている場合
gh repo create internal-tools-page --public --description "社内ツール紹介ページ" --source=. --remote=origin
```

<details>
<summary>ヒント: gh コマンドがない場合</summary>

方法Aの WebサイトでリポジトリをGitHub上に作成してください。
その後、方法Aの手順に従ってリモートリポジトリを設定します。

</details>

---

## Part 3: リモートリポジトリの設定とプッシュ

### タスク 3-1: リモートリポジトリを設定

```bash
# リモートリポジトリを追加（URLは自分のものに置き換え）
git remote add origin https://github.com/あなたのユーザー名/internal-tools-page.git

# リモート設定の確認
git remote -v
```

期待される出力：
```
origin  https://github.com/あなたのユーザー名/internal-tools-page.git (fetch)
origin  https://github.com/あなたのユーザー名/internal-tools-page.git (push)
```

<details>
<summary>ヒント: SSHで接続する場合</summary>

```bash
git remote add origin git@github.com:あなたのユーザー名/internal-tools-page.git
```

SSH接続の場合は、事前にSSH鍵の設定が必要です。

</details>

### タスク 3-2: プッシュ

```bash
# メインブランチをプッシュ
git push -u origin main
```

<details>
<summary>ヒント: ブランチ名が master の場合</summary>

```bash
# ブランチ名を確認
git branch

# masterの場合はmainに変更
git branch -M main
git push -u origin main
```

</details>

<details>
<summary>ヒント: 認証を求められた場合</summary>

**HTTPS接続の場合:**

GitHubのユーザー名とパスワード（またはPersonal Access Token）を入力します。

2021年以降、パスワード認証は使えません。Personal Access Tokenが必要です。

1. GitHub → Settings → Developer settings → Personal access tokens
2. 「Generate new token」でトークンを作成
3. パスワードの代わりにトークンを入力

**SSH接続の場合:**

SSH鍵のパスフレーズを入力します。

</details>

### タスク 3-3: プッシュの確認

```bash
# プッシュ後の状態確認
git status
```

期待される出力：
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

---

## Part 4: GitHubで確認

### タスク 4-1: ブラウザで確認

GitHubのリポジトリページを開いて、以下を確認してください。

```
https://github.com/あなたのユーザー名/internal-tools-page
```

### 確認チェックリスト

| # | チェック項目 | OK? |
|---|-------------|-----|
| 1 | リポジトリが表示される | [ ] |
| 2 | ファイル一覧が正しい | [ ] |
| 3 | .db ファイルが含まれていない | [ ] |
| 4 | コミット履歴が表示される | [ ] |
| 5 | index.html の中身が表示できる | [ ] |

---

## プッシュのフローまとめ

```
ローカル                          GitHub
┌──────────────────┐              ┌──────────────────┐
│ internal-tools-  │   git push   │ internal-tools-  │
│ page/            │ ──────────→  │ page             │
│                  │              │                  │
│ .gitignore       │              │ .gitignore       │
│ index.html       │              │ index.html       │
│ style.css        │              │ style.css        │
│ data/            │              │ data/            │
│   create_*.sql   │              │   create_*.sql   │
│   insert_*.sql   │              │   insert_*.sql   │
│   tools.db ←(除外)              │                  │
│ docs/            │              │ docs/            │
└──────────────────┘              └──────────────────┘
```

---

## まとめ

| 操作 | コマンド |
|------|----------|
| リモート追加 | `git remote add origin URL` |
| リモート確認 | `git remote -v` |
| プッシュ | `git push -u origin main` |
| 状態確認 | `git status` |

- [ ] プッシュ前チェックを完了した
- [ ] GitHubにリポジトリを作成した
- [ ] リモートリポジトリを設定した
- [ ] プッシュが成功した
- [ ] GitHubでファイルを確認した

---

## 次のステップへ

GitHubへの公開が完了しました。先輩も見られる状態になりました。

次のセクションでは、Day 3の日報を書きます。
今日の大きな成果を報告しましょう。

---

*推定所要時間: 60分*
