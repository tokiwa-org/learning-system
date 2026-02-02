# git pushで変更をアップロードしよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 3
subStep: 5
title: "git pushで変更をアップロードしよう"
itemType: LESSON
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「リモートと繋がったね。いよいよpushだ！」
>
> 「push... プッシュ... 押す？」
>
> 「そう！ローカルのコミットをリモートに『押し出す』イメージだね。
> これであなたのコードがGitHubに保存されるよ」

---

## git pushとは

`git push` は、ローカルのコミットをリモートリポジトリにアップロードするコマンドです。

```
ローカル                      リモート (GitHub)
┌─────────┐                   ┌─────────┐
│ commit3 │ ──git push──→    │ commit3 │
│ commit2 │                   │ commit2 │
│ commit1 │                   │ commit1 │
└─────────┘                   └─────────┘
```

---

## 初めてのpush

### 基本コマンド

```bash
git push -u origin main
```

- `-u`: アップストリーム（追跡ブランチ）を設定
- `origin`: リモートの名前
- `main`: ブランチ名

> 初回だけ `-u` オプションが必要です。

### 2回目以降

```bash
git push
```

一度 `-u` で設定すれば、以降は `git push` だけでOKです。

---

## 実際にやってみよう

### Step 1: 状態を確認

```bash
cd ~/my-first-git
git status
```

コミット済みであることを確認してください。

### Step 2: ブランチ名を確認

```bash
git branch
```

出力例：
```
* main
```

または
```
* master
```

> 古いGitでは `master` がデフォルトです。

### Step 3: pushを実行

```bash
git push -u origin main
```

### Step 4: 認証

初回は認証を求められます：

```
Username for 'https://github.com': あなたのユーザー名
Password for 'https://...': 個人アクセストークン（PAT）
```

> パスワード欄には**個人アクセストークン**を入力してください。

### Step 5: 成功を確認

出力：
```
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 226 bytes | 226.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/username/my-first-repo.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**おめでとうございます！初めてのpushが成功しました！**

---

## GitHubで確認しよう

### リポジトリページを開く

ブラウザで https://github.com/username/my-first-repo を開きます。

### 変化を確認

**Before（pushの前）**
```
This repository is empty.
```

**After（pushの後）**
```
📄 hello.txt
📄 file2.txt
📄 file3.txt

1 commit
```

ファイルが表示されるようになりました！

---

## pushの仕組み

### どこからどこへ？

```
ローカルのmainブランチ → リモート(origin)のmainブランチ

git push origin main
        ^^^^^^ ^^^^
        リモート名  ブランチ名
```

### -uオプションの意味

```bash
git push -u origin main
```

`-u` は「upstream（上流）を設定する」オプションです。

これを実行すると：
- ローカルの `main` とリモートの `origin/main` が紐づく
- 以降は `git push` だけで同じ場所にpushできる

---

## 新しい変更をpushする

ファイルを変更して、もう一度pushしてみましょう。

### Step 1: ファイルを変更

```bash
echo "新しい行を追加" >> hello.txt
```

### Step 2: ステージング → コミット

```bash
git add hello.txt
git commit -m "hello.txtを更新"
```

### Step 3: push

```bash
git push
```

> 2回目以降は `-u origin main` は不要です。

### Step 4: GitHubで確認

リポジトリページを更新すると、コミット数が増えています。

---

## pushできない場合

### 「rejected」エラー

```
! [rejected]        main -> main (fetch first)
error: failed to push some refs to '...'
hint: Updates were rejected because the remote contains work that you do not have locally.
```

これは**リモートに新しいコミットがある**ときに発生します。

**解決方法**：

```bash
git pull --rebase origin main
git push
```

> Step 6で詳しく説明します。

---

## pushの確認方法

### ローカルとリモートの差分を確認

```bash
git log origin/main..main
```

- 「ローカルにあってリモートにないコミット」が表示される
- 何も表示されなければ、pushする必要がない

### pushする前にドライラン

```bash
git push --dry-run
```

実際にはpushせず、何が起きるかだけ確認できます。

---

## 強制プッシュ（危険！）

```bash
git push --force
```

または

```bash
git push -f
```

> ⚠️ **これは非常に危険なコマンドです！**
> リモートの履歴を上書きしてしまいます。
> チーム開発では絶対に使わないでください。

---

## よくあるトラブル

### 「Authentication failed」

```
remote: Support for password authentication was removed on August 13, 2021.
fatal: Authentication failed for '...'
```

→ パスワードではなく、個人アクセストークン（PAT）を使用してください。

### 「Permission denied」

```
remote: Permission to username/repo.git denied to other-user.
fatal: unable to access '...'
```

→ 自分のリポジトリではない、またはアクセス権限がありません。

### 「repository not found」

```
remote: Repository not found.
```

→ URLが間違っているか、リポジトリが存在しません。

```bash
git remote -v  # URLを確認
```

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. リポジトリに移動
cd ~/my-first-git

# 2. 状態を確認
git status

# 3. 初めてのpush
git push -u origin main

# 4. 認証情報を入力（ユーザー名とPAT）

# 5. GitHubでリポジトリを確認
# （ブラウザで確認）

# 6. 新しい変更を作成
echo "2回目の変更" >> hello.txt
git add hello.txt
git commit -m "2回目の変更を追加"

# 7. 2回目のpush
git push

# 8. GitHubで確認
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `git push -u origin main` | 初回のpush（追跡設定あり） |
| `git push` | 2回目以降のpush |
| `git push --dry-run` | ドライラン（確認のみ） |

### pushの流れ

```
1. ファイルを変更
2. git add（ステージング）
3. git commit（コミット）
4. git push（アップロード）
```

### チェックリスト

- [ ] `git push -u origin main` でpushできた
- [ ] GitHubにファイルが表示された
- [ ] 2回目のpush（`git push`のみ）ができた

---

## 次のステップへ

初めてのpush、おめでとうございます！

あなたのコードがGitHubに保存されました。
これでPCが壊れても、コードは安全です。

次のセクションでは、`git pull` を使って、
リモートの変更をローカルに取得する方法を学びます。

チーム開発では特に重要な操作です！

---

*推定読了時間: 60分*
