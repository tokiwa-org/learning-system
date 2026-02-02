# 総合演習：チーム開発シミュレーション

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 6
subStep: 1
title: "総合演習：チーム開発シミュレーション"
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

> 「いよいよ最終演習だね。ここまで学んだことをすべて使ってみよう」
>
> 「チーム開発のシミュレーションですか？」
>
> 「そう。実際の現場を想定して、一連の作業を体験してもらうよ」
>
> 「緊張しますね...」
>
> 「大丈夫。間違えても取り消せるのがGitだからね！」

---

## 演習概要

簡単なWebサイトプロジェクトを題材に、以下の作業を行います：

1. プロジェクトの作成
2. GitHubにリモートリポジトリを作成
3. 複数のコミットを作成
4. リモートにプッシュ
5. 履歴の確認
6. 間違いの修正

---

## Part 1: プロジェクトの作成（20分）

### タスク 1-1: リポジトリを初期化

```bash
cd ~
mkdir team-website
cd team-website
git init
```

### タスク 1-2: 初期ファイルを作成

`index.html`:
```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>チームウェブサイト</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>チームウェブサイト</h1>
        <nav>
            <a href="index.html">ホーム</a>
            <a href="about.html">概要</a>
        </nav>
    </header>
    <main>
        <p>ようこそ！</p>
    </main>
    <footer>
        <p>&copy; 2026 Our Team</p>
    </footer>
</body>
</html>
EOF
```

`style.css`:
```bash
cat > style.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
}

header {
    background: #333;
    color: white;
    padding: 1rem;
}

nav a {
    color: white;
    margin-right: 1rem;
}

main {
    padding: 2rem;
}

footer {
    background: #333;
    color: white;
    padding: 1rem;
    text-align: center;
}
EOF
```

### タスク 1-3: 初回コミット

```bash
git add .
git status  # 確認
git commit -m "Initial commit: basic website structure"
```

### チェックポイント

- [ ] リポジトリを初期化できた
- [ ] 2つのファイルを作成できた
- [ ] 初回コミットができた

---

## Part 2: GitHubリポジトリの作成（15分）

### タスク 2-1: GitHubでリポジトリを作成

1. https://github.com/new にアクセス
2. Repository name: `team-website`
3. Private を選択
4. 初期化オプションはすべてオフ
5. Create repository

### タスク 2-2: リモートを登録

```bash
git remote add origin https://github.com/YOUR_USERNAME/team-website.git
git remote -v  # 確認
```

### タスク 2-3: プッシュ

```bash
git push -u origin main
```

### チェックポイント

- [ ] GitHubにリポジトリを作成できた
- [ ] リモートを登録できた
- [ ] プッシュが成功した
- [ ] GitHubでファイルが確認できた

---

## Part 3: 機能追加（25分）

複数のコミットを意味のある単位で作成していきます。

### タスク 3-1: About ページを追加

```bash
cat > about.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>概要 - チームウェブサイト</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>概要</h1>
        <nav>
            <a href="index.html">ホーム</a>
            <a href="about.html">概要</a>
        </nav>
    </header>
    <main>
        <h2>私たちについて</h2>
        <p>チームの紹介文がここに入ります。</p>
    </main>
    <footer>
        <p>&copy; 2026 Our Team</p>
    </footer>
</body>
</html>
EOF

git add about.html
git commit -m "Add about page"
```

### タスク 3-2: スタイルを改善

```bash
cat >> style.css << 'EOF'

h2 {
    color: #333;
    margin-bottom: 1rem;
}

main p {
    color: #666;
    max-width: 800px;
}
EOF

git add style.css
git commit -m "Improve typography styles"
```

### タスク 3-3: READMEを追加

```bash
cat > README.md << 'EOF'
# Team Website

シンプルなチームウェブサイトです。

## ファイル構成

- `index.html` - トップページ
- `about.html` - 概要ページ
- `style.css` - スタイルシート

## 作成者

あなたの名前
EOF

git add README.md
git commit -m "Add README documentation"
```

### タスク 3-4: リモートにプッシュ

```bash
git push
```

### チェックポイント

- [ ] 3つの新しいコミットを作成できた
- [ ] 意味のあるコミットメッセージを書けた
- [ ] プッシュできた

---

## Part 4: 履歴の確認（15分）

### タスク 4-1: 履歴を確認

```bash
# 1行表示
git log --oneline

# 統計情報付き
git log --stat

# グラフ表示
git log --oneline --graph
```

### タスク 4-2: 差分を確認

```bash
# 初回コミットから最新までの差分
git diff $(git rev-list --max-parents=0 HEAD) HEAD --stat

# 特定ファイルの履歴
git log --oneline -- style.css
```

### タスク 4-3: 特定コミットの詳細

```bash
# 最新コミットの詳細
git show

# 2つ前のコミット
git show HEAD~2
```

### チェックポイント

- [ ] 履歴を確認できた
- [ ] 差分を確認できた
- [ ] 特定コミットの詳細を確認できた

---

## Part 5: 間違いの修正（15分）

### シナリオ: 間違った変更をコミットしてしまった

```bash
# 1. 間違った変更を作成
echo "<!-- DEBUG MODE -->" >> index.html
git add index.html
git commit -m "Add debug comment"

# 2. 履歴を確認
git log --oneline -3

# 3. この間違いを取り消す（まだpushしていない想定）
git reset --soft HEAD~1

# 4. 確認
git status  # ステージング済みの状態

# 5. ステージングも取り消し
git restore --staged index.html
git restore index.html

# 6. 確認
git status  # clean
cat index.html  # DEBUG がない
```

### チェックポイント

- [ ] 間違った変更を作成できた
- [ ] reset で取り消せた
- [ ] ファイルが元に戻った

---

## 最終確認

すべての作業が完了したら、以下を確認してください。

### ローカルの状態

```bash
git status
# nothing to commit, working tree clean

git log --oneline
# 4つ以上のコミットがある

ls
# index.html about.html style.css README.md
```

### GitHubの状態

1. https://github.com/YOUR_USERNAME/team-website にアクセス
2. ファイルが表示されている
3. コミット履歴が確認できる

---

## 達成度チェック

| Part | 課題 | 完了 |
|------|------|------|
| 1 | プロジェクト作成 | □ |
| 2 | GitHub連携 | □ |
| 3 | 機能追加（3コミット） | □ |
| 4 | 履歴確認 | □ |
| 5 | 間違い修正 | □ |

**すべてクリア** → 演習完了！

---

## まとめ

この演習で実践したこと：

### 基本操作

| 操作 | コマンド |
|------|----------|
| リポジトリ作成 | `git init` |
| ステージング | `git add` |
| コミット | `git commit -m "..."` |

### リモート操作

| 操作 | コマンド |
|------|----------|
| リモート登録 | `git remote add origin URL` |
| プッシュ | `git push -u origin main` |

### 履歴確認

| 操作 | コマンド |
|------|----------|
| 履歴表示 | `git log --oneline` |
| 差分確認 | `git diff` |
| 詳細表示 | `git show` |

### 取り消し

| 操作 | コマンド |
|------|----------|
| コミット取り消し | `git reset --soft HEAD~1` |
| ステージング取り消し | `git restore --staged` |
| 変更取り消し | `git restore` |

---

## 次のステップへ

総合演習お疲れさまでした！

次のセクションでは、Git基礎の卒業クイズに挑戦します。
ここまで学んだ知識を確認して、Git基礎をマスターしましょう！

---

*推定所要時間: 90分*
