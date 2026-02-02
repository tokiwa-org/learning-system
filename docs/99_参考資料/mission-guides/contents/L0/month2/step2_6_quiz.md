# チェックポイント：初めてのコミット

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 2
subStep: 6
title: "チェックポイント：初めてのコミット"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## このチェックポイントについて

Step 2で学んだ内容を確認します。

- 全10問
- 合格ライン：8問以上正解

---

## 問題

### Q1: フォルダをGitリポジトリに変換するコマンドは？

A) `git start`
B) `git init`
C) `git create`
D) `git new`

<details>
<summary>答えを見る</summary>

**正解: B) `git init`**

`git init` は「initialize（初期化）」の略で、現在のフォルダをGitリポジトリとして初期化します。

</details>

---

### Q2: `git init` を実行すると何が作成される？

A) `.git` フォルダ
B) `git.txt` ファイル
C) `repository` フォルダ
D) `config.git` ファイル

<details>
<summary>答えを見る</summary>

**正解: A) `.git` フォルダ**

`.git` フォルダにはGitの管理情報（履歴、設定など）がすべて保存されます。

</details>

---

### Q3: ファイルをステージングするコマンドは？

A) `git stage`
B) `git add`
C) `git put`
D) `git ready`

<details>
<summary>答えを見る</summary>

**正解: B) `git add`**

`git add ファイル名` でファイルをステージングエリアに追加します。

</details>

---

### Q4: すべての変更をステージングするコマンドは？

A) `git add all`
B) `git add *`
C) `git add .`
D) `git add --all-files`

<details>
<summary>答えを見る</summary>

**正解: C) `git add .`**

`.` は「現在のディレクトリのすべて」を意味します。`git add -A` も同様の動作をします。

</details>

---

### Q5: コミットメッセージ付きでコミットするコマンドは？

A) `git commit "メッセージ"`
B) `git commit -m "メッセージ"`
C) `git commit --message "メッセージ"`
D) `git save -m "メッセージ"`

<details>
<summary>答えを見る</summary>

**正解: B) `git commit -m "メッセージ"`**

`-m` オプションでコミットメッセージを指定します。C) も正しく動作しますが、一般的には `-m` を使います。

</details>

---

### Q6: 以下の `git status` 出力で、ステージング済みのファイルはどれ？

```
Changes to be committed:
        new file:   index.html

Changes not staged for commit:
        modified:   style.css

Untracked files:
        README.md
```

A) `index.html`
B) `style.css`
C) `README.md`
D) すべてのファイル

<details>
<summary>答えを見る</summary>

**正解: A) `index.html`**

- `Changes to be committed` → ステージング済み（`index.html`）
- `Changes not staged for commit` → 変更されたが未ステージング（`style.css`）
- `Untracked files` → 追跡されていない（`README.md`）

</details>

---

### Q7: コミット履歴を1行で表示するコマンドは？

A) `git log --short`
B) `git log --oneline`
C) `git log -1`
D) `git history`

<details>
<summary>答えを見る</summary>

**正解: B) `git log --oneline`**

`--oneline` オプションで各コミットを1行で表示します。

</details>

---

### Q8: 良いコミットメッセージはどれ？

A) `修正`
B) `ログイン機能を追加`
C) `asdf`
D) `1`

<details>
<summary>答えを見る</summary>

**正解: B) `ログイン機能を追加`**

良いコミットメッセージは「何をしたか」が明確に伝わるものです。

- A) 何を修正したかわからない
- C), D) 意味がわからない

</details>

---

### Q9: ステージングを取り消すコマンドは？

A) `git remove ファイル名`
B) `git rm --cached ファイル名`
C) `git delete ファイル名`
D) `git unstage ファイル名`

<details>
<summary>答えを見る</summary>

**正解: B) `git rm --cached ファイル名`**

`git rm --cached` はファイルをステージングエリアから削除します（ファイル自体は削除されません）。
新しいバージョンのGitでは `git restore --staged ファイル名` も使えます。

</details>

---

### Q10: Gitの基本的な作業フローの正しい順番は？

A) commit → add → 変更
B) 変更 → commit → add
C) 変更 → add → commit
D) add → 変更 → commit

<details>
<summary>答えを見る</summary>

**正解: C) 変更 → add → commit**

1. ファイルを変更する
2. `git add` でステージング
3. `git commit` でコミット

この順番が基本のワークフローです。

</details>

---

## 実技問題

以下のタスクを実際に実行してください。

### 実技1: 新しいリポジトリを作成

```bash
# ホームディレクトリに移動
cd ~

# quiz-testフォルダを作成
mkdir quiz-test

# フォルダに移動
cd quiz-test

# リポジトリを初期化
git init
```

**確認**: `ls -la` で `.git` フォルダが表示されるか？

### 実技2: ファイルを作成してコミット

```bash
# ファイルを作成
echo "テストファイル" > test.txt

# ステージング
git add test.txt

# コミット
git commit -m "テストファイルを追加"
```

**確認**: `git log --oneline` でコミットが表示されるか？

### 実技3: ファイルを変更してコミット

```bash
# ファイルを変更
echo "追加の行" >> test.txt

# ステージング → コミット
git add test.txt
git commit -m "test.txtを更新"
```

**確認**: `git log --oneline` で2つのコミットが表示されるか？

---

## 採点

### 選択問題（10問）

| 正解数 | 判定 |
|--------|------|
| 10問 | 完璧！ |
| 8-9問 | 合格 |
| 6-7問 | もう少し |
| 5問以下 | 復習が必要 |

### 実技問題（3問）

| 完了数 | 判定 |
|--------|------|
| 3問 | 完璧！ |
| 2問 | 合格 |
| 1問以下 | 復習が必要 |

---

## 復習ポイント

間違えた問題があれば、以下のセクションを復習してください。

| 問題 | 復習セクション |
|------|---------------|
| Q1-Q2 | Step 2-2: git initでリポジトリを作ろう |
| Q3-Q4, Q6, Q9 | Step 2-3: git addでステージングしよう |
| Q5, Q7, Q8, Q10 | Step 2-4: git commitで変更を記録しよう |

---

## Step 2 完了！

おめでとうございます！
「初めてのコミット」を成功させることができました。

### 習得したスキル

- [x] `git init` でリポジトリを作成
- [x] `git add` でファイルをステージング
- [x] `git commit` で変更を記録
- [x] `git status` で状態を確認
- [x] `git log` で履歴を確認

---

## 次のステップへ

Step 3では、リモートリポジトリとの連携を学びます。

- GitHubにリポジトリを作成
- `git push` で変更をアップロード
- `git pull` で変更をダウンロード

ローカルだけでなく、クラウドにもコードを保存できるようになります！

---

*推定所要時間: 30分*
