# git checkoutで変更を元に戻そう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 5
subStep: 2
title: "git checkoutで変更を元に戻そう"
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

> 「ファイルを編集したけど、やっぱり元に戻したい...」
>
> 「まだ add してないなら、checkout で戻せるよ」
>
> 「え、でも checkout ってブランチ切り替えじゃないんですか？」
>
> 「実は2つの機能があるんだ。今は新しい restore コマンドを使うのがおすすめだけど、両方覚えておこう」

---

## 状況の確認

この操作は「まだ `git add` していない変更」を取り消すときに使います。

```
現在の状態:
- ファイルを編集した
- まだ git add していない
→ この変更を元に戻したい！
```

---

## git restore（新しい方法）

Git 2.23以降で使える新しいコマンドです。

### 構文

```bash
git restore ファイル名
```

### 例

```bash
git restore hello.txt
```

ファイルが最後のコミット時点の状態に戻ります。

---

## git checkout（従来の方法）

昔からあるコマンドです。今でも使えます。

### 構文

```bash
git checkout -- ファイル名
```

> `--` はオプションとファイル名を区別するための記号です。

### 例

```bash
git checkout -- hello.txt
```

---

## 実際にやってみよう

### Step 1: 変更を作成

```bash
cd ~/my-first-git

# ファイルの内容を確認
cat hello.txt

# 変更を追加
echo "この行は間違いです" >> hello.txt

# 変更を確認
cat hello.txt
```

### Step 2: 状態を確認

```bash
git status
```

出力：
```
Changes not staged for commit:
        modified:   hello.txt
```

### Step 3: 変更を取り消す

```bash
# 新しい方法
git restore hello.txt

# または従来の方法
# git checkout -- hello.txt
```

### Step 4: 確認

```bash
cat hello.txt
```

変更が消えて、元の状態に戻りました！

```bash
git status
```

出力：
```
nothing to commit, working tree clean
```

---

## 複数ファイルを同時に戻す

### 特定の複数ファイル

```bash
git restore file1.txt file2.txt file3.txt
```

### すべてのファイル

```bash
git restore .
```

または

```bash
git checkout -- .
```

> ⚠️ すべての変更が失われます！慎重に。

---

## 特定のコミット時点に戻す

### 特定コミットの状態に戻す

```bash
git restore --source=HEAD~1 hello.txt
```

1つ前のコミット時点の `hello.txt` に戻します。

### コミットハッシュを指定

```bash
git restore --source=abc1234 hello.txt
```

---

## 新規ファイルの場合

新しく作成したファイル（Untracked）は `git restore` では削除できません。

```bash
# 新規ファイルを作成
echo "test" > newfile.txt

git status
# Untracked files: newfile.txt

git restore newfile.txt
# エラー: pathspec 'newfile.txt' did not match any file(s)
```

### 新規ファイルを削除するには

```bash
rm newfile.txt
```

または

```bash
git clean -f newfile.txt
```

---

## restore と checkout の比較

| 操作 | restore（推奨） | checkout |
|------|----------------|----------|
| 変更を戻す | `git restore file` | `git checkout -- file` |
| 全変更を戻す | `git restore .` | `git checkout -- .` |
| 特定コミットから | `git restore --source=xxx file` | `git checkout xxx -- file` |

`git restore` の方が：
- 意図が明確
- ブランチ操作と混同しない
- オプションがわかりやすい

---

## 注意：変更は完全に失われる

`git restore` で取り消した変更は**完全に消えます**。

```
変更 → git restore → 変更が消える
                        ↓
            取り戻す方法はない！
```

### 取り消す前に

- 本当に不要な変更か確認
- 必要な部分があれば先にコピー
- 迷ったら `git stash` で一時保存（後で学習）

---

## よくある間違い

### 間違い1: -- を忘れる

```bash
git checkout hello.txt  # ブランチ名と勘違いされる可能性
git checkout -- hello.txt  # 正しい
```

### 間違い2: add済みのファイルに使う

```bash
git add hello.txt
git restore hello.txt  # ステージングは取り消されない！
```

add済みの場合は `git restore --staged` が必要です。

### 間違い3: 間違って全ファイル戻す

```bash
git restore .  # 全変更が消える！
```

必要な変更も消えてしまうので、ファイル名を指定しましょう。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. リポジトリに移動
cd ~/my-first-git

# 2. 現在の内容を確認
cat hello.txt

# 3. 変更を追加
echo "テスト行" >> hello.txt

# 4. 変更を確認
cat hello.txt

# 5. 状態を確認
git status

# 6. 変更を取り消す
git restore hello.txt

# 7. 元に戻ったことを確認
cat hello.txt

# 8. 状態を確認
git status
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `git restore ファイル` | 変更を取り消す（推奨） |
| `git restore .` | すべての変更を取り消す |
| `git checkout -- ファイル` | 変更を取り消す（従来） |
| `git restore --source=xxx ファイル` | 特定コミットの状態に戻す |

### 使用条件

- まだ `git add` していない変更に対して使用
- add済みの場合は `--staged` オプションが必要

### 注意点

- 取り消した変更は復元できない
- 新規ファイルは対象外

### チェックリスト

- [ ] `git restore` で変更を取り消せた
- [ ] 取り消しが不可逆であることを理解した
- [ ] restore と checkout の違いを理解した

---

## 次のステップへ

ファイルの変更を取り消す方法をマスターしましたね！

次のセクションでは、`git reset` を使って
ステージングを取り消す方法を学びます。

`git add` した後でも、まだやり直せます！

---

*推定読了時間: 30分*
