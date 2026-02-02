# チェックポイント：変更履歴を読み解こう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 4
subStep: 6
title: "チェックポイント：変更履歴を読み解こう"
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

Step 4で学んだ内容を確認します。

- 全10問
- 合格ライン：8問以上正解

---

## 問題

### Q1: コミット履歴を表示するコマンドは？

A) `git history`
B) `git log`
C) `git commits`
D) `git list`

<details>
<summary>答えを見る</summary>

**正解: B) `git log`**

`git log` はコミット履歴を表示するコマンドです。

</details>

---

### Q2: 履歴を1行ずつ表示するオプションは？

A) `git log --short`
B) `git log --oneline`
C) `git log --one`
D) `git log -1`

<details>
<summary>答えを見る</summary>

**正解: B) `git log --oneline`**

`--oneline` で各コミットを1行で表示します。
`-1` は最新1件だけを表示するオプションです。

</details>

---

### Q3: git logのページャを終了するキーは？

A) `x`
B) `q`
C) `Esc`
D) `Ctrl+C`

<details>
<summary>答えを見る</summary>

**正解: B) `q`**

`q` キーでlessページャを終了します。

</details>

---

### Q4: まだステージングしていない変更を表示するコマンドは？

A) `git diff`
B) `git diff --staged`
C) `git diff HEAD`
D) `git status`

<details>
<summary>答えを見る</summary>

**正解: A) `git diff`**

- `git diff` = 未ステージングの変更
- `git diff --staged` = ステージング済みの変更
- `git diff HEAD` = HEADからの全変更

</details>

---

### Q5: git diffの出力で、追加された行の先頭に表示される記号は？

A) `>`
B) `*`
C) `+`
D) `!`

<details>
<summary>答えを見る</summary>

**正解: C) `+`**

- `+` = 追加された行（通常緑色）
- `-` = 削除された行（通常赤色）
- ` ` (スペース) = 変更なし

</details>

---

### Q6: ステージング済みの変更を確認するコマンドは？

A) `git diff`
B) `git diff --staged`
C) `git diff --added`
D) `git diff --commit`

<details>
<summary>答えを見る</summary>

**正解: B) `git diff --staged`**

`--staged`（または `--cached`）でステージング済みの変更を表示します。

</details>

---

### Q7: 特定のコミットの詳細を表示するコマンドは？

A) `git view abc1234`
B) `git show abc1234`
C) `git log abc1234`
D) `git detail abc1234`

<details>
<summary>答えを見る</summary>

**正解: B) `git show abc1234`**

`git show` でコミットの詳細情報と変更内容を表示できます。

</details>

---

### Q8: 1つ前のコミットを指す表記は？

A) `HEAD-1`
B) `HEAD~1`
C) `HEAD+1`
D) `HEAD@1`

<details>
<summary>答えを見る</summary>

**正解: B) `HEAD~1`**

- `HEAD~1` または `HEAD^` = 1つ前のコミット
- `HEAD~2` または `HEAD^^` = 2つ前のコミット

</details>

---

### Q9: 特定ファイルの履歴だけを表示するには？

A) `git log -f hello.txt`
B) `git log --file hello.txt`
C) `git log hello.txt`
D) `git log --only hello.txt`

<details>
<summary>答えを見る</summary>

**正解: C) `git log hello.txt`**

ファイル名を直接指定することで、そのファイルに関連するコミットだけが表示されます。

</details>

---

### Q10: "TODO" という文字列が追加または削除されたコミットを探すには？

A) `git log --grep="TODO"`
B) `git log -S "TODO"`
C) `git log --search="TODO"`
D) `git log --find="TODO"`

<details>
<summary>答えを見る</summary>

**正解: B) `git log -S "TODO"`**

- `-S` = 変更内容に文字列が含まれるコミットを検索
- `--grep` = コミットメッセージを検索

</details>

---

## 実技問題

以下のタスクを実際に実行してください。

### 実技1: 履歴の確認

```bash
cd ~/my-first-git

# 最新5件の履歴を1行で表示
git log --oneline -5
```

**確認**: コミットが表示されましたか？

### 実技2: 差分の確認

```bash
# ファイルを変更
echo "テスト行" >> hello.txt

# 差分を確認
git diff

# 変更を取り消し（次のステップで学びます）
git checkout -- hello.txt
```

**確認**: `+テスト行` と表示されましたか？

### 実技3: コミット詳細の確認

```bash
# 最新コミットの詳細を確認
git show

# 1つ前のコミットを確認
git show HEAD~1
```

**確認**: コミット情報と変更内容が表示されましたか？

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
| Q1-Q3 | Step 4-1: git logの基本を覚えよう |
| Q4-Q6 | Step 4-3: git diffで変更内容を確認しよう |
| Q7-Q10 | Step 4-2, 4-4: オプションとgit show |

---

## Step 4 完了！

おめでとうございます！
変更履歴を読み解くスキルを習得しました。

### 習得したスキル

- [x] `git log` で履歴を確認
- [x] `--oneline` などのオプションを活用
- [x] `git diff` で変更内容を確認
- [x] `git show` でコミット詳細を確認
- [x] 過去のファイル内容を表示

---

## 次のステップへ

Step 5では、間違いを取り消す方法を学びます。

- `git checkout` で変更を元に戻す
- `git reset` でステージングを取り消す
- `git revert` でコミットを打ち消す

「やり直し」の力を手に入れましょう！

---

*推定所要時間: 30分*
