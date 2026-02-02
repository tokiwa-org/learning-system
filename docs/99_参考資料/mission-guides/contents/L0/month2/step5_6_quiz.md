# チェックポイント：間違いを取り消す

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 5
subStep: 6
title: "チェックポイント：間違いを取り消す"
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

Step 5で学んだ内容を確認します。

- 全10問
- 合格ライン：8問以上正解

---

## 問題

### Q1: まだ add していないファイルの変更を取り消すコマンドは？

A) `git reset hello.txt`
B) `git restore hello.txt`
C) `git revert hello.txt`
D) `git undo hello.txt`

<details>
<summary>答えを見る</summary>

**正解: B) `git restore hello.txt`**

`git restore` は未ステージングの変更を取り消します。
従来は `git checkout -- hello.txt` を使っていました。

</details>

---

### Q2: ステージング済みの変更を取り消す（add を取り消す）コマンドは？

A) `git restore hello.txt`
B) `git restore --staged hello.txt`
C) `git reset --hard hello.txt`
D) `git revert --staged hello.txt`

<details>
<summary>答えを見る</summary>

**正解: B) `git restore --staged hello.txt`**

`--staged` オプションでステージングエリアの変更を取り消します。
従来は `git reset HEAD hello.txt` を使っていました。

</details>

---

### Q3: `git reset --soft HEAD~1` を実行するとどうなる？

A) コミットが取り消され、変更も消える
B) コミットが取り消されるが、ステージング済みの状態で残る
C) コミットが取り消されるが、未ステージングの状態で残る
D) 何も起きない

<details>
<summary>答えを見る</summary>

**正解: B) コミットが取り消されるが、ステージング済みの状態で残る**

`--soft` はコミットだけを取り消し、変更はステージングエリアに残ります。

</details>

---

### Q4: `git reset --hard HEAD~1` の危険性は？

A) リモートリポジトリが消える
B) 変更が完全に失われる
C) ブランチが削除される
D) 設定がリセットされる

<details>
<summary>答えを見る</summary>

**正解: B) 変更が完全に失われる**

`--hard` はコミット、ステージング、ファイルの変更すべてを取り消します。
復元は困難なので、慎重に使用してください。

</details>

---

### Q5: push済みのコミットを安全に取り消すコマンドは？

A) `git reset --hard HEAD~1`
B) `git checkout HEAD~1`
C) `git revert HEAD`
D) `git undo HEAD`

<details>
<summary>答えを見る</summary>

**正解: C) `git revert HEAD`**

`git revert` は打ち消しコミットを作成するため、履歴を書き換えずに安全に取り消せます。
push済みのコミットには必ず revert を使いましょう。

</details>

---

### Q6: `git revert` と `git reset` の違いは？

A) revert は履歴を残す、reset は履歴を消す
B) revert はファイルを削除、reset は復元
C) revert はブランチ用、reset はファイル用
D) 違いはない

<details>
<summary>答えを見る</summary>

**正解: A) revert は履歴を残す、reset は履歴を消す**

- `git revert`: 打ち消しコミットを新規作成（履歴は残る）
- `git reset`: コミットを削除（履歴が消える）

</details>

---

### Q7: すべてのステージングを一度に取り消すコマンドは？

A) `git restore --staged`
B) `git restore --staged .`
C) `git reset --all`
D) `git unstage`

<details>
<summary>答えを見る</summary>

**正解: B) `git restore --staged .`**

`.` で現在ディレクトリのすべてのファイルを対象にします。
`git reset`（引数なし）でも同様の効果があります。

</details>

---

### Q8: 以下のうち、最も危険度が高いコマンドは？

A) `git restore --staged file.txt`
B) `git reset --soft HEAD~1`
C) `git reset --hard HEAD~1`
D) `git revert HEAD`

<details>
<summary>答えを見る</summary>

**正解: C) `git reset --hard HEAD~1`**

`--hard` は変更を完全に削除するため、復元できません。
他のオプションは変更を保持するか、履歴を残します。

</details>

---

### Q9: `git restore --source=HEAD~2 hello.txt` は何をする？

A) 2つ前のコミット時点の hello.txt の内容に戻す
B) hello.txt を削除する
C) 2つ前までのコミットを取り消す
D) hello.txt を2回コピーする

<details>
<summary>答えを見る</summary>

**正解: A) 2つ前のコミット時点の hello.txt の内容に戻す**

`--source` オプションで、特定のコミット時点のファイル内容を復元できます。

</details>

---

### Q10: チーム開発で、push済みコミットに対して `git reset --hard` + `git push --force` を使うとどうなる？

A) 安全に取り消される
B) チームメンバーの作業が壊れる可能性がある
C) 自動的にマージされる
D) エラーになって実行できない

<details>
<summary>答えを見る</summary>

**正解: B) チームメンバーの作業が壊れる可能性がある**

履歴の書き換えは他のメンバーのローカルリポジトリと矛盾を起こします。
push済みのコミットは必ず `git revert` で取り消しましょう。

</details>

---

## 実技問題

### 実技1: 変更の取り消し

```bash
cd ~/undo-practice

# ファイルを変更
echo "test" >> document.txt

# 変更を取り消す
git restore document.txt

# 確認
git status  # clean になるはず
```

### 実技2: ステージングの取り消し

```bash
# 変更を作成して add
echo "test" >> config.txt
git add config.txt

# ステージング取り消し
git restore --staged config.txt

# 確認
git status  # Changes not staged になるはず

# 変更も取り消し
git restore config.txt
```

### 実技3: コミットの取り消し

```bash
# コミットを作成
echo "test" >> document.txt
git add document.txt
git commit -m "テストコミット"

# コミットを取り消し（ソフト）
git reset --soft HEAD~1

# 確認
git status  # Changes to be committed になるはず

# ステージングも取り消し
git restore --staged document.txt
git restore document.txt
```

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

| 問題 | 復習セクション |
|------|---------------|
| Q1-Q2 | Step 5-2: git checkoutで変更を元に戻そう |
| Q3-Q4, Q7 | Step 5-3: git resetでステージングを取り消そう |
| Q5-Q6, Q10 | Step 5-4: git revertでコミットを打ち消そう |

---

## Step 5 完了！

おめでとうございます！
「間違いを取り消す」スキルを習得しました。

### 習得したスキル

- [x] `git restore` で変更を取り消す
- [x] `git restore --staged` でステージングを取り消す
- [x] `git reset` のオプション（--soft, --mixed, --hard）
- [x] `git revert` で安全にコミットを打ち消す
- [x] 状況に応じた取り消しコマンドの選択

---

## 次のステップへ

Step 6では、Git基礎の総まとめとして卒業試験に挑戦します。

- チーム開発シミュレーション
- 総合クイズ

ここまで学んだすべてを活かして、合格を目指しましょう！

---

*推定所要時間: 30分*
