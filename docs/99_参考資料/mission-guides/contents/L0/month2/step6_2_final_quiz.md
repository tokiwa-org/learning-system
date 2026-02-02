# Git基礎 卒業クイズ

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 6
subStep: 2
title: "Git基礎 卒業クイズ"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## このクイズについて

Git基礎の総まとめクイズです。
Step 1〜5で学んだすべての内容から出題されます。

- 全15問
- 合格ライン：12問以上正解（80%）

---

## セクション1: 基本概念（5問）

### Q1: Gitとは何か、最も適切な説明は？

A) プログラミング言語
B) 分散型バージョン管理システム
C) クラウドストレージサービス
D) コードエディタ

<details>
<summary>答えを見る</summary>

**正解: B) 分散型バージョン管理システム**

Gitはファイルの変更履歴を記録・管理するためのシステムです。

</details>

---

### Q2: GitとGitHubの関係は？

A) 同じもの
B) GitはソフトウェアでGitHubはWebサービス
C) GitHubはGitの有料版
D) GitはGitHubの略称

<details>
<summary>答えを見る</summary>

**正解: B) GitはソフトウェアでGitHubはWebサービス**

- Git: ローカルで動作するバージョン管理ソフトウェア
- GitHub: Gitリポジトリをホスティングするサービス

</details>

---

### Q3: リポジトリ（repository）とは？

A) ファイルを保存するフォルダ
B) コミット履歴を含むプロジェクトの保管場所
C) GitHubのアカウント
D) ブランチの別名

<details>
<summary>答えを見る</summary>

**正解: B) コミット履歴を含むプロジェクトの保管場所**

リポジトリにはファイルだけでなく、変更履歴（コミット）も保存されます。

</details>

---

### Q4: ローカルリポジトリとリモートリポジトリの違いは？

A) ローカルはPCにあり、リモートはサーバーにある
B) ローカルは無料、リモートは有料
C) ローカルは読み取り専用
D) 違いはない

<details>
<summary>答えを見る</summary>

**正解: A) ローカルはPCにあり、リモートはサーバーにある**

ローカルで作業し、リモートで共有・バックアップするのが基本的な使い方です。

</details>

---

### Q5: コミット（commit）とは？

A) ファイルをコピーすること
B) 変更を記録してスナップショットを作成すること
C) ファイルを削除すること
D) ブランチを作成すること

<details>
<summary>答えを見る</summary>

**正解: B) 変更を記録してスナップショットを作成すること**

コミットは「誰が」「いつ」「何を」変更したかを記録します。

</details>

---

## セクション2: 基本コマンド（5問）

### Q6: 新しいリポジトリを作成するコマンドは？

A) `git new`
B) `git create`
C) `git init`
D) `git start`

<details>
<summary>答えを見る</summary>

**正解: C) `git init`**

`git init` で現在のディレクトリをGitリポジトリとして初期化します。

</details>

---

### Q7: ファイルをステージングエリアに追加するコマンドは？

A) `git stage file.txt`
B) `git add file.txt`
C) `git put file.txt`
D) `git save file.txt`

<details>
<summary>答えを見る</summary>

**正解: B) `git add file.txt`**

`git add` でファイルをステージングエリアに追加します。

</details>

---

### Q8: 変更をコミットするコマンドは？

A) `git save -m "message"`
B) `git commit -m "message"`
C) `git push -m "message"`
D) `git record -m "message"`

<details>
<summary>答えを見る</summary>

**正解: B) `git commit -m "message"`**

`-m` オプションでコミットメッセージを指定します。

</details>

---

### Q9: ローカルの変更をリモートにアップロードするコマンドは？

A) `git upload`
B) `git send`
C) `git push`
D) `git sync`

<details>
<summary>答えを見る</summary>

**正解: C) `git push`**

`git push` でローカルのコミットをリモートに送信します。

</details>

---

### Q10: リモートの変更をローカルに取得するコマンドは？

A) `git download`
B) `git get`
C) `git pull`
D) `git fetch`

<details>
<summary>答えを見る</summary>

**正解: C) `git pull`**

`git pull` でリモートの変更を取得してマージします。
※ `git fetch` も正解に近いですが、マージまで行うのは `pull` です。

</details>

---

## セクション3: 履歴と差分（3問）

### Q11: コミット履歴を表示するコマンドは？

A) `git history`
B) `git log`
C) `git commits`
D) `git show-all`

<details>
<summary>答えを見る</summary>

**正解: B) `git log`**

`git log` でコミット履歴を表示します。
`--oneline` オプションで簡潔に表示できます。

</details>

---

### Q12: ステージングしていない変更を確認するコマンドは？

A) `git diff`
B) `git status`
C) `git check`
D) `git changes`

<details>
<summary>答えを見る</summary>

**正解: A) `git diff`**

`git diff` で未ステージングの変更内容を表示します。
※ `git status` はファイル単位の状態を表示します。

</details>

---

### Q13: 特定のコミットの詳細を表示するコマンドは？

A) `git detail abc1234`
B) `git view abc1234`
C) `git show abc1234`
D) `git info abc1234`

<details>
<summary>答えを見る</summary>

**正解: C) `git show abc1234`**

`git show` でコミットの詳細情報と変更内容を表示できます。

</details>

---

## セクション4: 取り消し操作（2問）

### Q14: まだaddしていないファイルの変更を取り消すコマンドは？

A) `git undo file.txt`
B) `git restore file.txt`
C) `git reset file.txt`
D) `git revert file.txt`

<details>
<summary>答えを見る</summary>

**正解: B) `git restore file.txt`**

`git restore` で未ステージングの変更を取り消します。
従来は `git checkout -- file.txt` を使っていました。

</details>

---

### Q15: push済みのコミットを安全に取り消す方法は？

A) `git reset --hard HEAD~1` してから `git push --force`
B) `git revert HEAD` してから `git push`
C) `git undo HEAD`
D) GitHubでファイルを直接編集

<details>
<summary>答えを見る</summary>

**正解: B) `git revert HEAD` してから `git push`**

`git revert` は履歴を書き換えずに、打ち消しコミットを作成します。
push済みのコミットには必ずrevertを使いましょう。

</details>

---

## 採点

### 正解数を数えてください

| 正解数 | 判定 |
|--------|------|
| 15問 | 🎉 完璧！Git マスター！ |
| 12-14問 | ✅ 合格！Git 基礎修了 |
| 9-11問 | 📚 もう少し復習を |
| 8問以下 | 🔄 Step 1-5 を復習しましょう |

---

## 復習ガイド

間違えた問題の分野を確認：

| 問題 | 分野 | 復習セクション |
|------|------|---------------|
| Q1-Q5 | 基本概念 | Step 1 |
| Q6-Q8 | ローカル操作 | Step 2 |
| Q9-Q10 | リモート操作 | Step 3 |
| Q11-Q13 | 履歴・差分 | Step 4 |
| Q14-Q15 | 取り消し | Step 5 |

---

## 🎓 Git基礎 修了おめでとうございます！

### 習得したスキル

Step 1〜6を通じて、以下のスキルを習得しました：

#### 基本概念
- [x] Git、GitHub、バージョン管理の理解
- [x] リポジトリ、コミット、ブランチの概念

#### ローカル操作
- [x] `git init` でリポジトリ作成
- [x] `git add` でステージング
- [x] `git commit` で変更を記録

#### リモート操作
- [x] `git remote` でリモート登録
- [x] `git push` で変更をアップロード
- [x] `git pull` で変更をダウンロード

#### 履歴操作
- [x] `git log` で履歴確認
- [x] `git diff` で差分確認
- [x] `git show` でコミット詳細

#### 取り消し操作
- [x] `git restore` で変更取り消し
- [x] `git reset` でステージング/コミット取り消し
- [x] `git revert` で安全にコミット打ち消し

---

## 次のステップ

Git基礎を修了した今、次に学ぶべきことは：

### 月3以降のカリキュラム
- データベース（SQL）の基礎
- ネットワークの仕組み
- Webページ作成

### Gitの発展
- ブランチ操作（branch, merge, rebase）
- プルリクエスト（Pull Request）
- チーム開発フロー（Git Flow）

---

## 修了証

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🎓 Git基礎 修了証明書 🎓                      ║
║                                                            ║
║     修了者: ＿＿＿＿＿＿＿＿＿＿＿＿                          ║
║                                                            ║
║     修了日: ＿＿＿＿年＿＿月＿＿日                           ║
║                                                            ║
║     本証明書は、L0レベルのGit基礎カリキュラムを             ║
║     修了したことを証明します。                              ║
║                                                            ║
║     習得スキル:                                             ║
║     ・Git基本操作（init, add, commit）                      ║
║     ・リモート連携（push, pull）                            ║
║     ・履歴確認（log, diff, show）                           ║
║     ・取り消し操作（restore, reset, revert）                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

*Git基礎カリキュラム 全20時間 完了*

**お疲れさまでした！🎉**
