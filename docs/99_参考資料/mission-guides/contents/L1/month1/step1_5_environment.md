# 環境変数とPATHを設定しよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 1
subStep: 5
title: "環境変数とPATHを設定しよう"
itemType: LESSON
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "OS"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 佐藤先輩のターミナルを覗くと、見慣れないコマンドが沢山ある。
>
> 「先輩、`ll` ってコマンドは何ですか？ `gst` とか `gp` とかも...」
>
> 「ああ、全部エイリアスだよ。`ll` は `ls -la` のショートカット。
> `gst` は `git status`、`gp` は `git push`」
>
> 「自分でコマンドを作れるんですか？」
>
> 「`.bashrc` を設定すれば、自分だけの環境を作れる。
> 毎日使うツールだからこそ、手に馴染む道具にカスタマイズするんだ」

---

## 環境変数の基本

環境変数とは、OSやシェルの動作を制御する「設定値」です。

### 環境変数の確認

```bash
# 全ての環境変数を表示
env

# 特定の環境変数を表示
echo $HOME
echo $USER
echo $SHELL
echo $PATH

# printenv でも確認可能
printenv HOME
```

### よく使う環境変数

| 変数 | 意味 | 例 |
|------|------|-----|
| `HOME` | ホームディレクトリ | `/home/tanaka` |
| `USER` | ユーザー名 | `tanaka` |
| `SHELL` | 使用中のシェル | `/bin/bash` |
| `PATH` | コマンド検索パス | `/usr/local/bin:/usr/bin` |
| `LANG` | 言語設定 | `ja_JP.UTF-8` |
| `EDITOR` | デフォルトエディタ | `vim` |
| `TERM` | ターミナルの種類 | `xterm-256color` |

### 環境変数の設定

```bash
# 現在のシェルだけに設定（一時的）
MY_VAR="hello"
echo $MY_VAR

# 子プロセスにも引き継ぐ（export）
export MY_VAR="hello"

# 変数の削除
unset MY_VAR
```

---

## PATH -- コマンドの検索パス

`PATH` はシェルがコマンドを探す場所のリストです。`:`（コロン）で区切られています。

```bash
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# コマンドの場所を確認
which node
# /usr/local/bin/node

which python3
# /usr/bin/python3

# 全ての候補を表示
type -a python
```

### PATH の追加

```bash
# 末尾に追加（優先度低）
export PATH="$PATH:/new/path"

# 先頭に追加（優先度高）
export PATH="/new/path:$PATH"

# 実例: 自作スクリプトのディレクトリを追加
export PATH="$HOME/bin:$PATH"
```

---

## .bashrc / .zshrc -- シェルの設定ファイル

ターミナルを開くたびに自動で読み込まれる設定ファイルです。

| ファイル | 対象シェル | 読み込みタイミング |
|---------|-----------|------------------|
| `~/.bashrc` | bash | 新しいターミナルを開くたび |
| `~/.bash_profile` | bash | ログイン時 |
| `~/.zshrc` | zsh | 新しいターミナルを開くたび |
| `~/.profile` | 共通 | ログイン時 |

### 設定ファイルの編集

```bash
# bash の場合
vim ~/.bashrc

# zsh の場合
vim ~/.zshrc

# 編集後、設定を反映
source ~/.bashrc
# または
source ~/.zshrc
```

### 実用的な設定例

```bash
# === 環境変数 ===
export EDITOR="vim"
export LANG="ja_JP.UTF-8"
export PATH="$HOME/bin:$PATH"

# === エイリアス ===
# 基本コマンドの改善
alias ll='ls -la'
alias la='ls -A'
alias ..='cd ..'
alias ...='cd ../..'

# Git ショートカット
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph'
alias gd='git diff'

# 安全なファイル操作
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# よく使うディレクトリ
alias proj='cd ~/projects'
alias docs='cd ~/Documents'

# === 関数 ===
# ディレクトリ作成して移動
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# ポートを使っているプロセスを停止
killport() {
    lsof -ti :$1 | xargs kill -9
}
```

---

## which / type -- コマンドの所在を調べる

```bash
# コマンドの場所を表示
which node
# /usr/local/bin/node

# エイリアスも含めて表示
type ll
# ll is aliased to `ls -la'

type cd
# cd is a shell builtin

# 全ての候補を表示
type -a python
# python is /usr/bin/python
# python is /usr/local/bin/python
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 環境変数 | OS・シェルの設定値。`export` で設定 |
| PATH | コマンドの検索場所リスト |
| .bashrc / .zshrc | シェル起動時に自動読み込みされる設定ファイル |
| alias | コマンドのショートカット定義 |
| which / type | コマンドの所在確認 |

### チェックリスト

- [ ] 環境変数の確認と設定ができる
- [ ] PATHの仕組みを理解し、パスを追加できる
- [ ] .bashrc / .zshrc にエイリアスを設定できる
- [ ] which / type でコマンドの所在を調べられる

---

## 次のステップへ

環境変数とシェルのカスタマイズを学びました。

次はStep 1の理解度チェックです。
ここまで学んだ上級コマンド、パイプ、プロセス管理、環境変数の知識を確認しましょう。

---

*推定読了時間: 15分*
