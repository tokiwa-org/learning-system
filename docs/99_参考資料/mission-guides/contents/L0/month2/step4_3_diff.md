# git diffで変更内容を確認しよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 4
subStep: 3
title: "git diffで変更内容を確認しよう"
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

> 「git logでコミットの一覧は見れたけど、具体的に何が変わったか見たい」
>
> 「そういうときは `git diff` を使うよ。行単位で変更を確認できる」
>
> 「レビューのときとかに使うんですか？」
>
> 「そう！コードレビューでも、バグ調査でも、コミット前の確認でも使う重要なコマンドだ」

---

## git diffとは

`git diff` は、ファイルの変更内容を行単位で表示するコマンドです。

- どの行が追加されたか
- どの行が削除されたか
- どの行が変更されたか

が一目でわかります。

---

## 基本的な使い方

### まず変更を作成

```bash
cd ~/my-first-git
echo "追加した行です" >> hello.txt
```

### diffを確認

```bash
git diff
```

出力例：
```diff
diff --git a/hello.txt b/hello.txt
index abc1234..def5678 100644
--- a/hello.txt
+++ b/hello.txt
@@ -1,2 +1,3 @@
 Hello Git!
 追加の行です
+追加した行です
```

---

## 出力の読み方

### ヘッダー部分

```diff
diff --git a/hello.txt b/hello.txt
```
→ 比較対象のファイル

```diff
index abc1234..def5678 100644
```
→ 変更前と変更後のハッシュ

```diff
--- a/hello.txt
+++ b/hello.txt
```
→ `---` が変更前、`+++` が変更後

### 変更内容

```diff
@@ -1,2 +1,3 @@
```
→ 変更位置を示す（1行目から2行 → 1行目から3行に変化）

```diff
 Hello Git!
```
→ 変更なし（先頭にスペース）

```diff
+追加した行です
```
→ 追加された行（先頭に `+`）

---

## 行の意味

| 先頭文字 | 意味 | 色（通常） |
|---------|------|-----------|
| ` ` (スペース) | 変更なし | 白 |
| `+` | 追加 | 緑 |
| `-` | 削除 | 赤 |

### 変更の例

```diff
-古い行
+新しい行
```

「古い行」が削除され、「新しい行」が追加された = 行が変更された

---

## さまざまなdiff

### ワーキングディレクトリの変更

```bash
git diff
```

まだステージングしていない変更を表示。

### ステージング済みの変更

```bash
git diff --staged
```

または

```bash
git diff --cached
```

`git add` 済みで、まだコミットしていない変更を表示。

### 両方を確認

```bash
git diff HEAD
```

ワーキングディレクトリのすべての変更（ステージング前後を含む）を表示。

---

## イメージで理解

```
ワーキングディレクトリ    ステージング    リポジトリ(HEAD)
     [変更後]              [add済み]         [コミット済み]
         |                    |                   |
         |← git diff →|                   |
         |                    |← git diff --staged →|
         |←────────── git diff HEAD ──────────→|
```

---

## コミット間の差分

### 2つのコミットを比較

```bash
git diff コミットA コミットB
```

例：
```bash
git diff abc1234 def5678
```

### 1つ前のコミットとの差分

```bash
git diff HEAD~1
```

`HEAD~1` は「1つ前のコミット」を意味します。

### 2つ前との差分

```bash
git diff HEAD~2
```

---

## 特定ファイルの差分

### ワーキングディレクトリの特定ファイル

```bash
git diff hello.txt
```

### コミット間の特定ファイル

```bash
git diff abc1234 def5678 -- hello.txt
```

`--` の後にファイル名を指定します。

---

## 便利なオプション

### 統計だけ表示

```bash
git diff --stat
```

出力：
```
 hello.txt | 1 +
 1 file changed, 1 insertion(+)
```

### 単語単位で差分表示

```bash
git diff --word-diff
```

出力：
```
Hello Git!
追加の{+行です+}
```

追加された部分が `{+...+}` で囲まれます。

### 色を無効化

```bash
git diff --no-color
```

### 空白の変更を無視

```bash
git diff -w
```

または

```bash
git diff --ignore-all-space
```

---

## 実践シナリオ

### シナリオ1: コミット前の確認

```bash
# ファイルを変更
echo "テスト" >> hello.txt

# 変更を確認
git diff

# 問題なければステージング
git add hello.txt

# ステージング内容を確認
git diff --staged

# 問題なければコミット
git commit -m "メッセージ"
```

### シナリオ2: レビュー

```bash
# 最新コミットの変更を確認
git diff HEAD~1

# 特定のコミット範囲を確認
git diff main..feature-branch
```

---

## diffの終了方法

`git log` と同様に、`q` キーで終了します。

### 操作方法

| キー | 動作 |
|------|------|
| `j` / `↓` | 下にスクロール |
| `k` / `↑` | 上にスクロール |
| `/検索語` | 検索 |
| `n` | 次の検索結果 |
| `q` | 終了 |

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. ファイルを変更
echo "diffテスト" >> hello.txt

# 2. ワーキングディレクトリの差分
git diff

# 3. ステージング
git add hello.txt

# 4. ステージング済みの差分
git diff --staged

# 5. 統計を表示
git diff --stat HEAD

# 6. コミット
git commit -m "diffテスト"

# 7. 直前のコミットとの差分
git diff HEAD~1
```

---

## まとめ

| コマンド | 表示内容 |
|----------|----------|
| `git diff` | 未ステージングの変更 |
| `git diff --staged` | ステージング済みの変更 |
| `git diff HEAD` | 最後のコミットからの全変更 |
| `git diff コミットA コミットB` | コミット間の差分 |
| `git diff HEAD~1` | 1つ前のコミットとの差分 |

### 出力の見方

- `+` = 追加された行（緑）
- `-` = 削除された行（赤）
- スペース = 変更なし

### チェックリスト

- [ ] `git diff` で変更を確認できた
- [ ] `--staged` でステージング済みを確認できた
- [ ] 差分の出力を読めるようになった

---

## 次のステップへ

git diffの使い方はマスターしましたか？

次のセクションでは、`git show` を使って
特定のコミットの詳細を確認する方法を学びます！

---

*推定読了時間: 30分*
