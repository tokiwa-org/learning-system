# 演習：フォルダ構造を作ろう

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 2
subStep: 5
title: "演習：フォルダ構造を作ろう"
itemType: EXERCISE
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「フォルダとファイルの操作は覚えたね。じゃあ実践だ！」
>
> 「何を作るんですか？」
>
> 「実際の開発プロジェクトっぽい構造を作ってみよう。
> 現場でも同じようなことをするからね」

---

## ミッション概要

以下のプロジェクト構造をターミナルだけで作成してください。

```
my-portfolio/
├── index.html
├── about.html
├── contact.html
├── css/
│   ├── style.css
│   └── reset.css
├── js/
│   └── main.js
├── images/
│   └── (空のディレクトリ)
└── README.md
```

---

## Part 1: 基本構造を作る（15分）

### タスク 1-1: プロジェクトフォルダを作成

```bash
# ホームに移動
cd ~

# プロジェクトフォルダを作成
mkdir my-portfolio

# 移動
cd my-portfolio
```

### タスク 1-2: サブフォルダを作成

`css`、`js`、`images` の3つのフォルダを作成してください。

<details>
<summary>💡 ヒント</summary>

```bash
mkdir css js images
```

または

```bash
mkdir css
mkdir js
mkdir images
```

</details>

### タスク 1-3: 確認

```bash
ls
```

期待される出力：
```
css  images  js
```

---

## Part 2: HTMLファイルを作る（15分）

### タスク 2-1: index.html を作成

以下の内容で `index.html` を作成してください。

```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h1>Welcome to My Portfolio</h1>
</body>
</html>
EOF
```

### タスク 2-2: about.html を作成

同様に `about.html` を作成してください。

<details>
<summary>💡 ヒント</summary>

```bash
cat > about.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>About - My Portfolio</title>
</head>
<body>
    <h1>About Me</h1>
</body>
</html>
EOF
```

</details>

### タスク 2-3: contact.html を作成

同様に `contact.html` を作成してください。

<details>
<summary>📝 解答</summary>

```bash
cat > contact.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Contact - My Portfolio</title>
</head>
<body>
    <h1>Contact</h1>
</body>
</html>
EOF
```

</details>

### タスク 2-4: 確認

```bash
ls *.html
```

期待される出力：
```
about.html  contact.html  index.html
```

---

## Part 3: CSS/JSファイルを作る（15分）

### タスク 3-1: style.css を作成

```bash
cat > css/style.css << 'EOF'
body {
    font-family: sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}
EOF
```

### タスク 3-2: reset.css を作成

```bash
cat > css/reset.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
EOF
```

### タスク 3-3: main.js を作成

```bash
cat > js/main.js << 'EOF'
console.log('Portfolio loaded!');
EOF
```

### タスク 3-4: 確認

```bash
ls css/
ls js/
```

---

## Part 4: README.md を作る（10分）

### タスク 4-1: README.md を作成

```bash
cat > README.md << 'EOF'
# My Portfolio

個人ポートフォリオサイトです。

## 構成

- index.html - トップページ
- about.html - 自己紹介
- contact.html - お問い合わせ

## 技術

- HTML5
- CSS3
- JavaScript
EOF
```

### タスク 4-2: 内容を確認

```bash
cat README.md
```

---

## Part 5: 最終確認（5分）

### タスク 5-1: 構造を確認

```bash
# すべてのファイルを再帰的に表示
ls -R
```

期待される出力：
```
.:
README.md  about.html  contact.html  css  images  index.html  js

./css:
reset.css  style.css

./images:

./js:
main.js
```

### タスク 5-2: ファイル数を確認

```bash
find . -type f | wc -l
```

期待される出力：
```
7
```

（7つのファイル: 3 HTML + 2 CSS + 1 JS + 1 README）

---

## チャレンジ課題

### Challenge 1: ファイルをコピー

`index.html` を `backup/index.html.bak` としてバックアップしてください。

<details>
<summary>📝 解答</summary>

```bash
mkdir backup
cp index.html backup/index.html.bak
```

</details>

### Challenge 2: ファイルをリネーム

`js/main.js` を `js/app.js` にリネームしてください。

<details>
<summary>📝 解答</summary>

```bash
mv js/main.js js/app.js
```

</details>

### Challenge 3: 構造を複製

`my-portfolio` 全体を `my-portfolio-backup` としてコピーしてください。

<details>
<summary>📝 解答</summary>

```bash
cd ~
cp -r my-portfolio my-portfolio-backup
```

</details>

---

## 達成度チェック

| タスク | 完了 |
|--------|------|
| プロジェクトフォルダ作成 | □ |
| サブフォルダ3つ作成 | □ |
| HTMLファイル3つ作成 | □ |
| CSSファイル2つ作成 | □ |
| JSファイル1つ作成 | □ |
| README.md作成 | □ |
| 構造の確認 | □ |

**すべてクリア** → Part 5クリア！

---

## クリーンアップ

演習が終わったら、練習用フォルダを削除できます。

```bash
cd ~
rm -r my-portfolio
rm -r my-portfolio-backup  # 作成した場合
```

---

## まとめ

この演習で使ったコマンド：

| コマンド | 用途 |
|----------|------|
| `mkdir` | フォルダ作成 |
| `cd` | ディレクトリ移動 |
| `touch` / `cat >` | ファイル作成 |
| `ls` / `ls -R` | 内容確認 |
| `cp` | コピー |
| `mv` | 移動・リネーム |
| `rm -r` | 削除 |

---

## 次のステップへ

プロジェクト構造を作れましたか？

次のセクションでは、Step 2の理解度チェックです。
クイズに挑戦して、ファイル・フォルダ操作をマスターしましょう！

---

*推定所要時間: 60分*
