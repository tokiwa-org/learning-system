# git remoteでリモートを登録しよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 3
subStep: 4
title: "git remoteでリモートを登録しよう"
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

> 「ローカルとリモート、両方のリポジトリができたね」
>
> 「でも、まだ別々のままですよね？」
>
> 「そう！これを繋げる必要がある。`git remote` コマンドを使うんだ」

---

## 現在の状態

```
┌─────────────────┐              ┌─────────────────┐
│   ローカル       │              │    GitHub       │
│   my-first-git  │      ？      │  my-first-repo  │
│   (コミットあり)  │   ←─────→   │    (空)         │
└─────────────────┘              └─────────────────┘

まだ繋がっていない！
```

---

## git remoteとは

`git remote` は、ローカルリポジトリにリモートリポジトリの情報を登録するコマンドです。

「このリポジトリはGitHubのこのURLと連携するよ」と教えてあげるイメージです。

---

## リモートを登録する

### コマンドの形式

```bash
git remote add <名前> <URL>
```

- `<名前>`: リモートの名前（通常は `origin`）
- `<URL>`: GitHubのリポジトリURL

### 実際のコマンド

```bash
git remote add origin https://github.com/username/my-first-repo.git
```

> `username` の部分はあなたのGitHubユーザー名に置き換えてください。

---

## 実際にやってみよう

### Step 1: ローカルリポジトリに移動

```bash
cd ~/my-first-git
```

> Step 2で作成したフォルダです。

### Step 2: 現在のリモート設定を確認

```bash
git remote -v
```

出力：
```
（何も表示されない = リモートが設定されていない）
```

### Step 3: リモートを追加

```bash
git remote add origin https://github.com/username/my-first-repo.git
```

> URLはGitHubで作成したリポジトリのものに置き換えてください。

### Step 4: 設定を確認

```bash
git remote -v
```

出力：
```
origin  https://github.com/username/my-first-repo.git (fetch)
origin  https://github.com/username/my-first-repo.git (push)
```

`origin` という名前でリモートが登録されました！

---

## 出力の意味

```
origin  https://github.com/... (fetch)   ← 取得用
origin  https://github.com/... (push)    ← 送信用
```

- `fetch`: `git pull` などで使用されるURL
- `push`: `git push` で使用されるURL

通常は同じURLが設定されます。

---

## originとは何か

`origin` は**リモートリポジトリの名前**です。

```bash
git remote add origin https://...
              ^^^^^^
              この部分が名前
```

### なぜoriginなのか

- 「起源」「元」という意味
- Gitの慣習的なデフォルト名
- 最初に登録するリモートにはこの名前を使う

### 別の名前も使える

```bash
git remote add upstream https://...
git remote add backup https://...
```

> 今は `origin` だけ覚えておけばOKです。

---

## リモート情報を詳しく確認

### リモートの詳細を表示

```bash
git remote show origin
```

出力例：
```
* remote origin
  Fetch URL: https://github.com/username/my-first-repo.git
  Push  URL: https://github.com/username/my-first-repo.git
  HEAD branch: (unknown)
  ...
```

### リモートの一覧を表示

```bash
git remote
```

出力：
```
origin
```

---

## リモートの設定を変更する

### URLを変更

```bash
git remote set-url origin <新しいURL>
```

例：
```bash
git remote set-url origin https://github.com/username/new-repo.git
```

### リモートを削除

```bash
git remote remove origin
```

> 削除後は `git push` ができなくなります。

### リモートの名前を変更

```bash
git remote rename origin new-name
```

---

## HTTPS認証の準備

GitHub に push するには認証が必要です。

### 個人アクセストークン（PAT）

2021年8月以降、GitHubはパスワード認証を廃止しました。
代わりに**個人アクセストークン**を使います。

#### トークンの作成手順

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Note: 「Git CLI」など分かりやすい名前
5. Expiration: 有効期限を選択
6. Scopes: `repo` にチェック
7. Generate token
8. **トークンをコピーして安全な場所に保存！**

> トークンは一度しか表示されません。必ずコピーしてください。

#### トークンの使い方

`git push` 時にパスワードを求められたら、
パスワードの代わりにトークンを入力します。

---

## 認証情報をキャッシュする

毎回トークンを入力するのは面倒なので、キャッシュしましょう。

### Mac

```bash
git config --global credential.helper osxkeychain
```

### Windows

```bash
git config --global credential.helper wincred
```

### Linux

```bash
git config --global credential.helper store
```

> これで一度入力すれば、次回以降は自動で認証されます。

---

## よくあるエラー

### 「remote origin already exists」

```bash
git remote add origin https://...
```

エラー：
```
error: remote origin already exists.
```

→ すでに `origin` が登録されています。URLを変更する場合：

```bash
git remote set-url origin <新しいURL>
```

### 「repository not found」

```bash
git push
```

エラー：
```
remote: Repository not found.
fatal: repository 'https://...' not found
```

→ URLが間違っているか、アクセス権限がありません。

```bash
git remote -v  # URLを確認
```

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. ローカルリポジトリに移動
cd ~/my-first-git

# 2. 現在のリモート設定を確認（空のはず）
git remote -v

# 3. リモートを追加（URLは自分のものに置き換え）
git remote add origin https://github.com/YOUR_USERNAME/my-first-repo.git

# 4. 設定を確認
git remote -v

# 5. 詳細を確認
git remote show origin
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `git remote -v` | 登録されているリモートを表示 |
| `git remote add origin URL` | リモートを追加 |
| `git remote set-url origin URL` | URLを変更 |
| `git remote remove origin` | リモートを削除 |

### 接続後の状態

```
┌─────────────────┐              ┌─────────────────┐
│   ローカル       │              │    GitHub       │
│   my-first-git  │    origin    │  my-first-repo  │
│   (コミットあり)  │   ←─────→   │    (空)         │
└─────────────────┘              └─────────────────┘

繋がった！（でもまだ同期していない）
```

### チェックリスト

- [ ] `git remote add origin` でリモートを登録できた
- [ ] `git remote -v` で設定を確認できた
- [ ] 個人アクセストークンを作成できた（または方法を理解した）

---

## 次のステップへ

ローカルとリモートが接続されました！

次のセクションでは、`git push` を使って、
ローカルの変更をGitHubにアップロードします。

あなたのコードがついにクラウドに保存されます！

---

*推定読了時間: 30分*
