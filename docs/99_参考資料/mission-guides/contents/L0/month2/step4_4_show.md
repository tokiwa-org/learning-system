# git showでコミット詳細を見よう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 4
subStep: 4
title: "git showでコミット詳細を見よう"
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

> 「特定のコミットの中身を詳しく見たいんですけど...」
>
> 「`git log` だとメッセージしか見えないもんね。`git show` を使えば、1つのコミットの全情報が見れるよ」
>
> 「diffも一緒に？」
>
> 「そう！コミット情報 + 変更内容がセットで表示される」

---

## git showとは

`git show` は、特定のコミットの詳細情報と変更内容を表示するコマンドです。

`git log` + `git diff` を1つにしたようなものです。

---

## 基本的な使い方

### 最新のコミットを表示

```bash
git show
```

引数なしで実行すると、HEADのコミット（最新）を表示します。

### 出力例

```
commit def5678901234567890abcdef1234567890abcdef (HEAD -> main)
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 27 15:00:00 2026 +0900

    hello.txtを更新

diff --git a/hello.txt b/hello.txt
index abc1234..def5678 100644
--- a/hello.txt
+++ b/hello.txt
@@ -1,2 +1,3 @@
 Hello Git!
 追加の行です
+新しく追加した行
```

---

## 特定のコミットを表示

### コミットハッシュを指定

```bash
git show abc1234
```

7文字の短縮ハッシュでOKです。

### コミットの探し方

```bash
# まず履歴を確認
git log --oneline

# 見たいコミットのハッシュをコピー
# そのハッシュでshow
git show abc1234
```

---

## 相対的な指定

### N個前のコミット

```bash
git show HEAD~1    # 1つ前
git show HEAD~2    # 2つ前
git show HEAD~3    # 3つ前
```

### 親コミット

```bash
git show HEAD^     # 1つ前（HEAD~1と同じ）
git show HEAD^^    # 2つ前（HEAD~2と同じ）
```

---

## 出力を絞り込む

### 統計情報だけ

```bash
git show --stat
```

出力：
```
commit def5678...
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 27 15:00:00 2026 +0900

    hello.txtを更新

 hello.txt | 1 +
 1 file changed, 1 insertion(+)
```

diffの詳細は表示されず、ファイルごとの変更量だけ表示されます。

### ファイル名だけ

```bash
git show --name-only
```

出力：
```
commit def5678...
...
    hello.txtを更新

hello.txt
```

### ファイル名とステータス

```bash
git show --name-status
```

出力：
```
commit def5678...
...
    hello.txtを更新

M       hello.txt
```

ステータスの意味：
| ステータス | 意味 |
|-----------|------|
| A | Added（追加） |
| M | Modified（変更） |
| D | Deleted（削除） |
| R | Renamed（リネーム） |

---

## 特定ファイルの変更だけ表示

### 1つのファイル

```bash
git show コミット -- ファイル名
```

例：
```bash
git show HEAD -- hello.txt
```

### 複数のファイル

```bash
git show HEAD -- file1.txt file2.txt
```

---

## フォーマットのカスタマイズ

### シンプルな形式

```bash
git show --pretty=short
```

### 1行形式

```bash
git show --oneline
```

### 変更内容だけ

```bash
git show --pretty="" --name-only
```

コミット情報なしで、変更されたファイル名だけ表示。

---

## ブランチやタグを指定

### ブランチの先頭

```bash
git show main
git show origin/main
```

### タグ

```bash
git show v1.0.0
```

タグがある場合、そのタグが指すコミットを表示します。

---

## オブジェクトの表示

### ツリー（ディレクトリ構造）

```bash
git show HEAD:
```

出力：
```
tree HEAD:

hello.txt
file2.txt
file3.txt
```

### 特定ファイルの内容

```bash
git show HEAD:hello.txt
```

コミット時点でのファイルの内容を表示します。

### 過去のファイル内容

```bash
git show HEAD~3:hello.txt
```

3つ前のコミット時点での `hello.txt` の内容を表示。

---

## 実践：バグ調査

### シナリオ

「2日前まで動いていたのに...」

```bash
# 1. 最近のコミットを確認
git log --oneline -10

# 2. 怪しいコミットを特定
# → abc1234 が怪しい

# 3. そのコミットの詳細を確認
git show abc1234

# 4. 変更されたファイルを確認
git show --name-only abc1234

# 5. 特定ファイルの変更を確認
git show abc1234 -- config.js
```

---

## git log -p との違い

### git log -p

```bash
git log -p
```

すべてのコミットの変更を順番に表示。

### git show

```bash
git show abc1234
```

1つのコミットだけを詳しく表示。

| コマンド | 用途 |
|----------|------|
| `git log -p` | 履歴を順番に見たい |
| `git show` | 特定のコミットを詳しく見たい |

---

## ハンズオン

以下のコマンドを試してください。

```bash
# 1. 最新コミットの詳細
git show

# 2. 1つ前のコミット
git show HEAD~1

# 3. 統計情報だけ
git show --stat

# 4. ファイル名だけ
git show --name-only

# 5. 過去のファイル内容
git show HEAD~1:hello.txt

# 6. 履歴から特定コミットを選んで表示
git log --oneline -5
git show [選んだハッシュ]
```

---

## まとめ

| コマンド | 表示内容 |
|----------|----------|
| `git show` | 最新コミットの詳細 |
| `git show ハッシュ` | 指定コミットの詳細 |
| `git show HEAD~N` | N個前のコミット |
| `git show --stat` | 統計情報のみ |
| `git show --name-only` | ファイル名のみ |
| `git show HEAD:ファイル` | 特定時点のファイル内容 |

### git log, git diff, git show の使い分け

| コマンド | 用途 |
|----------|------|
| `git log` | 履歴の一覧を見る |
| `git diff` | 変更の差分を見る |
| `git show` | 特定コミットの詳細を見る |

### チェックリスト

- [ ] `git show` で最新コミットを表示できた
- [ ] 特定のコミットを指定して表示できた
- [ ] 過去のファイル内容を表示できた

---

## 次のステップへ

コミット詳細の確認方法をマスターしましたね！

次のセクションでは、ここまで学んだ内容を使って
実践的な演習に挑戦します。

履歴調査のスキルを試してみましょう！

---

*推定読了時間: 30分*
