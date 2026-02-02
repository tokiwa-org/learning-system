# git pullで変更をダウンロードしよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 3
subStep: 6
title: "git pullで変更をダウンロードしよう"
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

> 「pushはできたね。じゃあ逆に、リモートから変更を取得するにはどうする？」
>
> 「えーと... pull ですか？」
>
> 「正解！pushの逆がpullだ。チーム開発では毎日使うコマンドだよ」

---

## git pullとは

`git pull` は、リモートリポジトリの変更をローカルにダウンロードするコマンドです。

```
リモート (GitHub)                 ローカル
┌─────────┐                      ┌─────────┐
│ commit3 │ ──git pull──→       │ commit3 │
│ commit2 │                      │ commit2 │
│ commit1 │                      │ commit1 │
└─────────┘                      └─────────┘
```

---

## なぜpullが必要なのか

### シナリオ1: 別のPCで作業した

```
会社PC                 GitHub                  自宅PC
[commit1]  →push→    [commit1]    ←pull←    [commit1]
[commit2]            [commit2]               [commit2] (新しく取得)
```

### シナリオ2: チームメンバーが変更した

```
あなた                 GitHub                  田中さん
[commit1]            [commit1]    ←push←    [commit1]
                     [commit2] (田中さんの変更)
  pull→              [commit2]
[commit2] (取得)
```

---

## 基本的な使い方

### コマンド

```bash
git pull origin main
```

または（upstream設定済みの場合）

```bash
git pull
```

---

## 実際に試してみよう

### GitHub上で直接ファイルを編集

pull を体験するために、GitHub上でファイルを編集してみましょう。

#### Step 1: GitHubでリポジトリを開く

ブラウザで https://github.com/username/my-first-repo を開きます。

#### Step 2: hello.txtをクリック

ファイル一覧から `hello.txt` をクリックします。

#### Step 3: 編集ボタンをクリック

ファイル表示画面の右上にある鉛筆アイコン（Edit this file）をクリックします。

#### Step 4: 内容を編集

```
Hello Git!
追加の行です
GitHubから追加した行です  ← これを追加
```

#### Step 5: コミット

画面下部で：
- Commit message: 「GitHubから直接編集」
- 「Commit changes」をクリック

---

### ローカルでpullする

#### Step 1: ローカルの状態を確認

```bash
cd ~/my-first-git
cat hello.txt
```

出力：
```
Hello Git!
追加の行です
```

まだGitHubでの変更は反映されていません。

#### Step 2: pullを実行

```bash
git pull
```

出力：
```
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (3/3), done.
From https://github.com/username/my-first-repo
   abc1234..def5678  main       -> origin/main
Updating abc1234..def5678
Fast-forward
 hello.txt | 1 +
 1 file changed, 1 insertion(+)
```

#### Step 3: 変更を確認

```bash
cat hello.txt
```

出力：
```
Hello Git!
追加の行です
GitHubから追加した行です
```

GitHubでの変更がローカルに反映されました！

---

## pullの仕組み

`git pull` は、実際には2つの操作を同時に行っています：

```bash
git pull = git fetch + git merge
```

### git fetch

リモートの情報を取得する（ローカルは変更しない）

```bash
git fetch origin
```

### git merge

取得した情報をローカルにマージ（統合）する

```bash
git merge origin/main
```

---

## リモートの状態を確認する

### fetch して確認

```bash
git fetch origin
git log origin/main..main      # ローカルにだけあるコミット
git log main..origin/main      # リモートにだけあるコミット
```

### 差分を確認

```bash
git diff main origin/main
```

---

## コンフリクト（競合）

### コンフリクトとは

同じファイルの同じ部分を、ローカルとリモートで別々に編集した場合に発生します。

```
ローカル:        リモート:
Hello World!     Hello Git!
^^^^^^^^         ^^^^^^^
同じ行を別々に変更 → コンフリクト発生
```

### コンフリクトの表示

```bash
git pull
```

出力：
```
CONFLICT (content): Merge conflict in hello.txt
Automatic merge failed; fix conflicts and then commit the result.
```

### ファイルの中身

```
<<<<<<< HEAD
Hello World!
=======
Hello Git!
>>>>>>> origin/main
```

- `<<<<<<< HEAD`: ローカルの変更
- `=======`: 区切り線
- `>>>>>>> origin/main`: リモートの変更

### 解決方法

1. ファイルを開く
2. どちらを残すか決めて編集
3. `<<<`, `===`, `>>>` の行を削除
4. `git add` でステージング
5. `git commit` で確定

```bash
# ファイルを編集して解決後
git add hello.txt
git commit -m "コンフリクトを解決"
```

---

## pullのオプション

### rebaseオプション

```bash
git pull --rebase
```

通常のpull（merge）よりも履歴がきれいになります。

```
通常のpull:             rebaseでpull:
      *---* (merge)           *---* (main)
     /                       /
*---*                   *---*
```

> チームによってどちらを使うかルールがあります。

---

## よくあるトラブル

### 「Your local changes would be overwritten」

```
error: Your local changes to the following files would be overwritten by merge:
        hello.txt
Please commit your changes or stash them before you merge.
```

→ ローカルに未コミットの変更があります。

**解決方法1**: コミットする

```bash
git add .
git commit -m "作業中の変更を保存"
git pull
```

**解決方法2**: 一時退避（stash）

```bash
git stash        # 変更を一時保存
git pull
git stash pop    # 変更を復元
```

---

## 毎日のワークフロー

朝の作業開始時：

```bash
# 1. プロジェクトフォルダに移動
cd ~/my-project

# 2. 最新を取得
git pull

# 3. 作業開始！
```

夕方の作業終了時：

```bash
# 1. 変更をコミット
git add .
git commit -m "今日の作業"

# 2. pushして帰宅
git push
```

---

## ハンズオン

以下の手順で pull を体験してください。

```bash
# 1. GitHubでhello.txtを直接編集
#    （ブラウザで操作）

# 2. ローカルの状態を確認
cd ~/my-first-git
cat hello.txt

# 3. pullを実行
git pull

# 4. 変更が反映されたことを確認
cat hello.txt

# 5. 履歴を確認
git log --oneline
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `git pull` | リモートの変更を取得してマージ |
| `git fetch` | リモートの情報を取得（マージしない） |
| `git pull --rebase` | 取得してリベース |

### pushとpullの使い分け

| 状況 | コマンド |
|------|----------|
| 自分の変更をアップロードしたい | `git push` |
| 他人の変更をダウンロードしたい | `git pull` |
| 最新の状態から作業を始めたい | `git pull` |

### チェックリスト

- [ ] GitHub上でファイルを直接編集できた
- [ ] `git pull` でローカルに反映できた
- [ ] コンフリクトの概念を理解した

---

## Step 3 完了！

おめでとうございます！
リモートリポジトリとの同期ができるようになりました。

### 習得したスキル

- [x] リモートリポジトリの概念を理解
- [x] GitHubアカウントの作成
- [x] リモートリポジトリの作成
- [x] `git remote add` でリモートを登録
- [x] `git push` で変更をアップロード
- [x] `git pull` で変更をダウンロード

---

## 次のステップへ

Step 4では、変更履歴を詳しく確認する方法を学びます。

- `git log` の詳細なオプション
- `git diff` で変更内容を確認
- 過去のコミットを調べる

Gitの本当の力を体験しましょう！

---

*推定読了時間: 60分*
