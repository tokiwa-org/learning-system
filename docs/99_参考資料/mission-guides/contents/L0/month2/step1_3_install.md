# Gitをインストールしよう

## メタ情報

```yaml
mission: "Gitの世界への第一歩を踏み出そう"
step: 1
subStep: 3
title: "Gitをインストールしよう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L0"
```

---

## このセクションで学ぶこと

Gitを使うには、まずPCにインストールする必要があります。
OS別のインストール方法を学びましょう。

---

## まずはGitが入っているか確認

ターミナルを開いて、以下のコマンドを実行してみましょう。

```bash
git --version
```

### 出力例（インストール済みの場合）

```
git version 2.43.0
```

→ バージョンが表示されれば、すでにGitはインストールされています！
　次のセクションに進みましょう。

### 出力例（未インストールの場合）

```
git: command not found
```

または

```
'git' は、内部コマンドまたは外部コマンド、
操作可能なプログラムまたはバッチ ファイルとして認識されていません。
```

→ Gitがインストールされていません。以下の手順でインストールしましょう。

---

## Macの場合

### 方法1: Xcode Command Line Toolsを使う（推奨）

ターミナルで以下を実行：

```bash
xcode-select --install
```

ポップアップが表示されたら「インストール」をクリック。

### 方法2: Homebrewを使う

Homebrewがインストールされている場合：

```bash
brew install git
```

### インストール確認

```bash
git --version
```

---

## Windowsの場合

### 方法1: Git for Windowsをダウンロード（推奨）

1. 公式サイトにアクセス: https://git-scm.com/download/win
2. ダウンロードが自動的に始まる
3. ダウンロードしたインストーラーを実行
4. 基本的に「Next」を押して進む（デフォルト設定でOK）

### インストール時の注意点

| 画面 | 推奨設定 |
|------|----------|
| Adjusting your PATH | 「Git from the command line...」を選択 |
| Choosing the default editor | 好みのエディタを選択（VSCodeなど） |
| 改行コード | 「Checkout Windows-style...」を選択 |

### インストール確認

コマンドプロンプトまたはGit Bashで：

```bash
git --version
```

---

## Linuxの場合

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install git
```

### Fedora

```bash
sudo dnf install git
```

### CentOS / RHEL

```bash
sudo yum install git
```

### インストール確認

```bash
git --version
```

---

## 初期設定をしよう

Gitをインストールしたら、最初に自分の名前とメールアドレスを設定します。
これは「誰がこの変更をしたか」を記録するために必要です。

### ユーザー名の設定

```bash
git config --global user.name "あなたの名前"
```

例：
```bash
git config --global user.name "Taro Yamada"
```

### メールアドレスの設定

```bash
git config --global user.email "あなたのメールアドレス"
```

例：
```bash
git config --global user.email "taro@example.com"
```

### 設定の確認

```bash
git config --global --list
```

出力例：
```
user.name=Taro Yamada
user.email=taro@example.com
```

---

## なぜ名前とメールが必要？

Gitはすべての変更を「誰が行ったか」記録します。

```
commit abc1234
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 27 10:00:00 2026 +0900

    ログイン機能を追加
```

チームで開発するとき、「この変更は誰がした？」がすぐ分かるようになります。

---

## エディタの設定（任意）

コミットメッセージを書くときに使うエディタを設定できます。

### Visual Studio Codeを使う場合

```bash
git config --global core.editor "code --wait"
```

### Vimを使う場合（デフォルト）

```bash
git config --global core.editor "vim"
```

### nanoを使う場合

```bash
git config --global core.editor "nano"
```

> 最初はデフォルト（Vimまたはnano）のままでも大丈夫です。

---

## よくあるトラブル

### 「git: command not found」が消えない（Mac）

パスが通っていない可能性があります。ターミナルを再起動してみてください。

### 「git: command not found」が消えない（Windows）

1. Git Bashを使ってみる（スタートメニューから「Git Bash」を検索）
2. または、PCを再起動する

### 名前やメールを間違えて設定した

もう一度同じコマンドを実行すれば上書きされます：

```bash
git config --global user.name "正しい名前"
git config --global user.email "正しいメール"
```

---

## ハンズオン

以下を順番に実行して、Gitが正しく設定されているか確認しましょう。

### 1. バージョン確認

```bash
git --version
```

→ バージョン番号が表示されればOK

### 2. 設定確認

```bash
git config --global --list
```

→ user.name と user.email が表示されればOK

### 3. ヘルプの表示

```bash
git help
```

→ Gitのコマンド一覧が表示されればOK

---

## まとめ

| ポイント | 内容 |
|----------|------|
| インストール確認 | `git --version` |
| 名前の設定 | `git config --global user.name "名前"` |
| メールの設定 | `git config --global user.email "メール"` |
| 設定の確認 | `git config --global --list` |

### チェックリスト

- [ ] `git --version` でバージョンが表示される
- [ ] `git config --global --list` で名前とメールが表示される

---

## 次のステップへ

Gitのインストールと初期設定は完了しましたか？

次のセクションでは、「リポジトリ」という概念を学びます。
Gitでファイルを管理する「箱」のようなものです。

---

*推定読了時間: 25分*
