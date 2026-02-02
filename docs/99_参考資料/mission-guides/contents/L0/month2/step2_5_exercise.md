# 演習：3つのファイルをコミットしよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 2
subStep: 5
title: "演習：3つのファイルをコミットしよう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「基本は覚えたね。じゃあ、実際のプロジェクトっぽい作業をしてみよう」
>
> 「どんなことをするんですか？」
>
> 「簡単なWebサイトを作るイメージで、3つのファイルを作ってコミットしてみて」
>
> 「やってみます！」

---

## ミッション概要

新しいプロジェクトを作成し、以下の3つのファイルをコミットしてください。

| ファイル | 内容 | コミットメッセージ |
|----------|------|-------------------|
| `index.html` | HTMLの雛形 | 自分で考える |
| `style.css` | CSSファイル | 自分で考える |
| `README.md` | プロジェクト説明 | 自分で考える |

### 達成条件

- [ ] 新しいリポジトリを作成できた
- [ ] 3つのファイルを作成できた
- [ ] 3つの意味のあるコミットを作成できた
- [ ] `git log` で3つのコミットが表示される

---

## Part 1: 新しいプロジェクトを準備しよう

### タスク 1-1: プロジェクトフォルダを作成

```bash
cd ~
mkdir my-website
cd my-website
```

### タスク 1-2: Gitリポジトリを初期化

```bash
git init
```

### タスク 1-3: 確認

```bash
pwd
git status
```

<details>
<summary>💡 ヒント（クリックで表示）</summary>

出力は以下のようになるはずです：

```
/Users/yourname/my-website

On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

</details>

---

## Part 2: ファイルを作成しよう

### タスク 2-1: index.htmlを作成

以下の内容で `index.html` を作成してください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>私のWebサイト</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>ようこそ！</h1>
    <p>これは私の最初のWebサイトです。</p>
</body>
</html>
```

#### 作成方法（選択肢）

**方法A: echoコマンドを使う**

```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>私のWebサイト</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>ようこそ！</h1>
    <p>これは私の最初のWebサイトです。</p>
</body>
</html>
EOF
```

**方法B: エディタを使う**

VSCodeなど好きなエディタで `index.html` を作成してください。

### タスク 2-2: 作成を確認

```bash
ls
cat index.html
```

---

### タスク 2-3: style.cssを作成

以下の内容で `style.css` を作成してください。

```css
body {
    font-family: sans-serif;
    margin: 40px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
}

p {
    color: #666;
}
```

#### 作成方法

```bash
cat > style.css << 'EOF'
body {
    font-family: sans-serif;
    margin: 40px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
}

p {
    color: #666;
}
EOF
```

---

### タスク 2-4: README.mdを作成

以下の内容で `README.md` を作成してください。

```markdown
# My Website

私の初めてのWebサイトプロジェクトです。

## ファイル構成

- index.html - メインページ
- style.css - スタイルシート

## 作成者

あなたの名前
```

#### 作成方法

```bash
cat > README.md << 'EOF'
# My Website

私の初めてのWebサイトプロジェクトです。

## ファイル構成

- index.html - メインページ
- style.css - スタイルシート

## 作成者

あなたの名前
EOF
```

---

### タスク 2-5: すべてのファイルを確認

```bash
ls -la
```

期待される出力：
```
.git/
index.html
style.css
README.md
```

---

## Part 3: コミットしよう

ここからが本番です！
**1ファイルずつ**、**意味のあるコミットメッセージ**で記録していきましょう。

### タスク 3-1: index.htmlをコミット

```bash
# ステージング
git add index.html

# 状態確認
git status

# コミット（メッセージは自分で考えよう！）
git commit -m "ここにメッセージを書く"
```

<details>
<summary>💡 コミットメッセージのヒント</summary>

良い例：
- `HTMLの雛形を作成`
- `メインページを追加`
- `index.htmlを新規作成`

避けたい例：
- `ファイル追加`（何のファイル？）
- `1つ目`（意味がわからない）

</details>

---

### タスク 3-2: style.cssをコミット

```bash
git add style.css
git commit -m "ここにメッセージを書く"
```

<details>
<summary>💡 コミットメッセージのヒント</summary>

良い例：
- `基本スタイルを追加`
- `CSSファイルを作成`
- `ページのデザインを設定`

</details>

---

### タスク 3-3: README.mdをコミット

```bash
git add README.md
git commit -m "ここにメッセージを書く"
```

<details>
<summary>💡 コミットメッセージのヒント</summary>

良い例：
- `READMEを追加`
- `プロジェクト説明を作成`
- `ドキュメントを追加`

</details>

---

## Part 4: 結果を確認しよう

### タスク 4-1: コミット履歴を確認

```bash
git log --oneline
```

期待される出力（例）：
```
def5678 READMEを追加
bcd4567 基本スタイルを追加
abc1234 HTMLの雛形を作成
```

3つのコミットが表示されていれば成功です！

### タスク 4-2: 詳細な履歴を確認

```bash
git log
```

各コミットの詳細情報が表示されます。

### タスク 4-3: 状態を確認

```bash
git status
```

期待される出力：
```
On branch main
nothing to commit, working tree clean
```

---

## チャレンジ課題（任意）

時間に余裕があれば、以下にも挑戦してみてください。

### チャレンジ 1: ファイルを変更してコミット

`index.html` に新しい段落を追加して、4つ目のコミットを作成してください。

```bash
# ファイルを編集（例：bodyに<p>追加の文章</p>を追加）

git add index.html
git commit -m "index.htmlにコンテンツを追加"
```

### チャレンジ 2: 一度にまとめてコミット

新しいファイル `about.html` と `contact.html` を作成し、
1つのコミットにまとめてみてください。

```bash
# 2つのファイルを作成
echo "<h1>About</h1>" > about.html
echo "<h1>Contact</h1>" > contact.html

# 両方をステージング
git add about.html contact.html

# 1つのコミットにまとめる
git commit -m "About と Contact ページを追加"
```

---

## 達成度チェック

以下のコマンドを実行して、結果を確認してください。

```bash
# コミット数を確認
git log --oneline | wc -l
```

- 3以上 → 基本課題クリア！
- 5以上 → チャレンジ課題もクリア！

---

## よくあるトラブル

### 「まだ何もコミットしていない」と言われる

```bash
git status
```

→ ファイルがステージングされていない可能性があります。`git add` を確認してください。

### コミットメッセージを間違えた

直前のコミットメッセージは以下で修正できます：

```bash
git commit --amend -m "正しいメッセージ"
```

> ただし、これは「直前のコミット」のみ修正可能です。

### ファイルを作り忘れた

ファイルを作成して、新しいコミットを追加してください。

---

## まとめ

この演習で実践したこと：

| 操作 | コマンド |
|------|----------|
| リポジトリ作成 | `git init` |
| ファイル作成 | `cat > ファイル名` または エディタ |
| ステージング | `git add ファイル名` |
| コミット | `git commit -m "メッセージ"` |
| 履歴確認 | `git log --oneline` |

### 重要なポイント

1. **1つの変更 = 1つのコミット** が基本
2. **コミットメッセージ**は「何をしたか」が伝わるように
3. **git status** でこまめに状態を確認

---

## 次のステップへ

おめでとうございます！実践的なGit操作ができるようになりました。

次のセクションでは、ここまでの理解度を確認するチェックポイントです。
クイズに挑戦して、学んだことを振り返りましょう。

---

*推定所要時間: 90分*
