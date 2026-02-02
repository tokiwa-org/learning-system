# リモートリポジトリを作成しよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 3
subStep: 3
title: "リモートリポジトリを作成しよう"
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

> 「アカウントができたね！次はGitHub上にリポジトリを作ってみよう」
>
> 「ローカルで作ったリポジトリとは別に、もう1つ作るってことですか？」
>
> 「そう！ローカルとリモート、両方にリポジトリがあって、それを同期させるんだ」

---

## リポジトリ作成手順

### Step 1: 新規リポジトリ画面を開く

GitHubにログインした状態で、以下のいずれかの方法で作成画面を開きます：

**方法A**: 右上の「+」→「New repository」をクリック

**方法B**: https://github.com/new にアクセス

### Step 2: リポジトリ名を入力

```
Repository name: my-first-repo
```

命名ルール：
- 半角英数字、ハイフン（-）、アンダースコア（_）が使用可能
- スペースは使えない
- 日本語は避ける

良い例：
- `my-first-repo`
- `hello-world`
- `portfolio-website`

### Step 3: 説明（任意）

```
Description: 私の最初のリポジトリです
```

> 空欄でもOKですが、書いておくと後で分かりやすいです。

### Step 4: 公開設定を選択

```
○ Public   - 誰でも見れる
● Private  - 自分だけ見れる
```

学習用なら **Private**（非公開）をお勧めします。
後から変更も可能です。

### Step 5: 初期化オプション

```
□ Add a README file
□ Add .gitignore
□ Choose a license
```

**重要**: 今回は**すべてチェックを外したまま**にしてください。

> なぜ？ローカルにすでにリポジトリがあるため、空のリモートリポジトリが必要だからです。

### Step 6: 作成

「Create repository」ボタンをクリック！

---

## 作成後の画面

リポジトリが作成されると、以下のような画面が表示されます：

```
┌─────────────────────────────────────────────────────────┐
│ Quick setup — if you've done this kind of thing before │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ HTTPS  SSH                                              │
│ https://github.com/username/my-first-repo.git           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ …or create a new repository on the command line        │
│                                                         │
│   echo "# my-first-repo" >> README.md                  │
│   git init                                             │
│   git add README.md                                    │
│   git commit -m "first commit"                         │
│   git branch -M main                                   │
│   git remote add origin https://github.com/...         │
│   git push -u origin main                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ …or push an existing repository from the command line  │
│                                                         │
│   git remote add origin https://github.com/...         │
│   git branch -M main                                   │
│   git push -u origin main                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

この画面に表示されているURLが重要です！次のセクションで使います。

---

## リポジトリURLを確認

作成したリポジトリのURLは2種類あります：

### HTTPS（推奨・初心者向け）

```
https://github.com/username/my-first-repo.git
```

### SSH（上級者向け）

```
git@github.com:username/my-first-repo.git
```

> 今回は**HTTPS**を使います。設定が簡単です。

---

## リポジトリ画面の見方

### 空のリポジトリの場合

```
┌─────────────────────────────────────────────────────┐
│ username / my-first-repo                    Private │
├─────────────────────────────────────────────────────┤
│                                                     │
│       This repository is empty.                     │
│       ここにセットアップ手順が表示される              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### ファイルがある場合（pushした後）

```
┌─────────────────────────────────────────────────────┐
│ username / my-first-repo                    Private │
├─────────────────────────────────────────────────────┤
│ Code  Issues  Pull requests  Actions  ...           │
├─────────────────────────────────────────────────────┤
│ 📁 .git                                             │
│ 📄 hello.txt                                        │
│ 📄 README.md                                        │
├─────────────────────────────────────────────────────┤
│ 1 commit                                            │
└─────────────────────────────────────────────────────┘
```

---

## よくあるオプション

### README.md

プロジェクトの説明を書くファイルです。
GitHub上で自動的に表示されます。

> 今回はローカルで作成するのでチェック不要

### .gitignore

Gitで管理しないファイルを指定する設定ファイルです。

例：
```
node_modules/
*.log
.env
```

> 後から追加できるのでチェック不要

### License

オープンソースの場合に選択します。

- MIT: 最も緩い、なんでもOK
- Apache 2.0: 特許関連の保護あり
- GPL: 派生物もオープンソースにする必要あり

> プライベートリポジトリなら不要

---

## 複数のリポジトリを管理

GitHubでは複数のリポジトリを作成できます。

```
あなたのアカウント
├── my-first-repo      （練習用）
├── portfolio          （ポートフォリオ）
├── study-notes        （学習メモ）
└── work-project       （仕事用・Private）
```

プロジェクトごとにリポジトリを分けて管理しましょう。

---

## リポジトリの設定変更

作成後も設定を変更できます。

### 設定画面を開く

1. リポジトリページに移動
2. 「Settings」タブをクリック

### 変更できる項目

| 項目 | 説明 |
|------|------|
| Repository name | リポジトリ名の変更 |
| Visibility | Public ↔ Private の切り替え |
| Default branch | デフォルトブランチ名 |
| Danger Zone | リポジトリの削除 |

---

## リポジトリを削除する方法

間違えて作成した場合は削除できます。

1. Settings → 最下部の「Danger Zone」
2. 「Delete this repository」をクリック
3. リポジトリ名を入力して確認
4. 「I understand...」をクリック

> 削除すると復元できません！慎重に。

---

## ハンズオン

以下の手順でリポジトリを作成してください：

```
1. GitHubにログイン
2. 右上の「+」→「New repository」
3. Repository name: my-first-repo
4. Description: 私の最初のリポジトリ
5. Private を選択
6. 初期化オプションは全てオフ
7. 「Create repository」をクリック
```

### 確認

- [ ] リポジトリが作成された
- [ ] URLが表示されている
- [ ] 「Quick setup」画面が表示されている

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 作成場所 | GitHub.com の「New repository」 |
| 公開設定 | Public（公開）または Private（非公開） |
| 初期化 | ローカルに既存のリポジトリがある場合はオフ |
| URL | HTTPS形式を使用（初心者向け） |

### チェックリスト

- [ ] GitHub上にリポジトリを作成できた
- [ ] リポジトリのURLを確認できた
- [ ] Private設定になっていることを確認できた

---

## 次のステップへ

GitHub上にリモートリポジトリを作成できましたね！

次のセクションでは、ローカルリポジトリとリモートリポジトリを
`git remote` コマンドで接続します。

いよいよローカルとリモートがつながります！

---

*推定読了時間: 30分*
