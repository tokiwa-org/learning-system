# git resetでステージングを取り消そう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 5
subStep: 3
title: "git resetでステージングを取り消そう"
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

> 「git add しちゃったけど、やっぱりこのファイルはコミットしたくない...」
>
> 「それなら git reset でステージングを取り消せるよ」
>
> 「ファイルの内容は消えないんですか？」
>
> 「消えないよ。ステージングエリアから外れるだけ」

---

## 状況の確認

この操作は「`git add` したけど、まだコミットしていない変更」を取り消すときに使います。

```
現在の状態:
- ファイルを編集した
- git add した ← ここ
- まだ git commit していない
→ ステージングを取り消したい！
```

---

## git restore --staged（新しい方法）

Git 2.23以降で使える新しいコマンドです。

### 構文

```bash
git restore --staged ファイル名
```

### 例

```bash
git restore --staged hello.txt
```

---

## git reset（従来の方法）

### 構文

```bash
git reset HEAD ファイル名
```

または単に：

```bash
git reset ファイル名
```

### 例

```bash
git reset HEAD hello.txt
```

---

## 実際にやってみよう

### Step 1: 変更を作成してステージング

```bash
cd ~/my-first-git

# 変更を追加
echo "ステージングテスト" >> hello.txt

# ステージング
git add hello.txt
```

### Step 2: 状態を確認

```bash
git status
```

出力：
```
Changes to be committed:
        modified:   hello.txt
```

緑色で表示されます（ステージング済み）。

### Step 3: ステージングを取り消す

```bash
# 新しい方法
git restore --staged hello.txt

# または従来の方法
# git reset HEAD hello.txt
```

### Step 4: 確認

```bash
git status
```

出力：
```
Changes not staged for commit:
        modified:   hello.txt
```

赤色に変わりました（未ステージング）。
ファイルの内容は変わっていません！

```bash
cat hello.txt
```

変更はそのまま残っています。

---

## 図で理解しよう

### ステージング状態

```
ワーキング          ステージング           リポジトリ
[hello.txt(変更)]   [hello.txt(変更)]     [hello.txt(元)]
```

### restore --staged 後

```
ワーキング          ステージング           リポジトリ
[hello.txt(変更)]   [hello.txt(元)]       [hello.txt(元)]
```

ステージングエリアだけが元に戻り、ワーキングディレクトリの変更は残ります。

---

## 複数ファイルのステージングを取り消す

### 特定のファイル

```bash
git restore --staged file1.txt file2.txt
```

### すべてのファイル

```bash
git restore --staged .
```

または

```bash
git reset
```

---

## git reset のオプション

`git reset` にはいくつかのモードがあります。

### --soft: コミットだけ取り消す

```bash
git reset --soft HEAD~1
```

- コミットを取り消す
- ステージングは維持
- ファイルの変更も維持

### --mixed（デフォルト）: コミット + ステージング取り消す

```bash
git reset HEAD~1
git reset --mixed HEAD~1  # 同じ
```

- コミットを取り消す
- ステージングを取り消す
- ファイルの変更は維持

### --hard: すべて取り消す

```bash
git reset --hard HEAD~1
```

- コミットを取り消す
- ステージングを取り消す
- **ファイルの変更も取り消す**

> ⚠️ `--hard` は危険！変更が完全に失われます。

---

## イメージで比較

```
                  コミット  ステージング  ファイル変更
--soft              取消      維持         維持
--mixed（デフォルト） 取消      取消         維持
--hard              取消      取消         取消
```

---

## 使い分け

| 状況 | コマンド |
|------|----------|
| ステージングだけ取り消したい | `git restore --staged file` |
| コミットを取り消して再編集したい | `git reset --soft HEAD~1` |
| コミットを取り消して最初からやり直し | `git reset HEAD~1` |
| すべてなかったことにしたい | `git reset --hard HEAD~1` |

---

## よくある間違い

### 間違い1: reset と restore を混同

```bash
git reset hello.txt        # ステージング取り消し
git restore hello.txt      # ファイル変更取り消し（別物！）
```

### 間違い2: いきなり --hard を使う

```bash
git reset --hard HEAD~1  # 変更が消える！
```

まずは `--soft` で試しましょう。

### 間違い3: HEAD~1 の数を間違える

```bash
git reset --soft HEAD~3  # 3つ前まで戻る！
```

`git log --oneline` で確認してから実行。

---

## ステージングの部分取り消し

### git restore --staged（ファイル単位）

```bash
git restore --staged file1.txt  # file1.txt だけ取り消し
```

### git reset -p（対話的）

```bash
git reset -p
```

変更の一部だけ選んでステージングを取り消せます。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. リポジトリに移動
cd ~/my-first-git

# 2. 変更を作成
echo "reset テスト" >> hello.txt

# 3. ステージング
git add hello.txt

# 4. 状態確認（緑色）
git status

# 5. ステージング取り消し
git restore --staged hello.txt

# 6. 状態確認（赤色に変わる）
git status

# 7. ファイルは変更されたまま
cat hello.txt

# 8. ファイルの変更も取り消す（任意）
git restore hello.txt
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `git restore --staged ファイル` | ステージング取り消し（推奨） |
| `git restore --staged .` | 全ステージング取り消し |
| `git reset ファイル` | ステージング取り消し（従来） |
| `git reset --soft HEAD~1` | コミット取り消し（変更維持） |
| `git reset --hard HEAD~1` | 完全取り消し（⚠️危険） |

### resetのモード

| モード | コミット | ステージング | ファイル |
|--------|---------|-------------|---------|
| --soft | 取消 | 維持 | 維持 |
| --mixed | 取消 | 取消 | 維持 |
| --hard | 取消 | 取消 | 取消 |

### チェックリスト

- [ ] `git restore --staged` でステージングを取り消せた
- [ ] ファイルの内容が残ることを確認できた
- [ ] resetのオプションの違いを理解した

---

## 次のステップへ

ステージングの取り消し方法をマスターしましたね！

次のセクションでは、`git revert` を使って
**push済みのコミット**を安全に取り消す方法を学びます。

チーム開発では特に重要なテクニックです！

---

*推定読了時間: 30分*
