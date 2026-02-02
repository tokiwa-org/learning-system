# 卒業クイズ：ターミナルマスター認定試験

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 6
subStep: 2
title: "卒業クイズ：ターミナルマスター認定試験"
itemType: QUIZ
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「いよいよ最後のクイズだね」
>
> 「ここまで来れて嬉しいです！」
>
> 「このクイズに合格すれば、ターミナルマスター認定だ。これまで学んだことを思い出して頑張ろう！」

---

## 試験概要

- **問題数**: 20問
- **合格ライン**: 16問以上正解（80%）
- **制限時間**: 60分（目安）

---

## Part 1: 基本コマンド (5問)

### Q1: 現在のディレクトリを表示するコマンドは？

A) `pwd`
B) `cd`
C) `ls`
D) `dir`

<details>
<summary>答えを見る</summary>

**正解: A) `pwd`**

`pwd` は Print Working Directory の略です。

</details>

---

### Q2: ホームディレクトリに移動するコマンドは？

A) `cd home`
B) `cd ~`
C) `cd /`
D) `cd ..`

<details>
<summary>答えを見る</summary>

**正解: B) `cd ~`**

`~` はホームディレクトリを表します。`cd` だけでもホームに移動できます。

</details>

---

### Q3: 「project」という名前のディレクトリを作成するコマンドは？

A) `create project`
B) `new project`
C) `mkdir project`
D) `make project`

<details>
<summary>答えを見る</summary>

**正解: C) `mkdir project`**

`mkdir` は Make Directory の略です。

</details>

---

### Q4: 空のファイル「memo.txt」を作成するコマンドは？

A) `create memo.txt`
B) `touch memo.txt`
C) `new memo.txt`
D) `make memo.txt`

<details>
<summary>答えを見る</summary>

**正解: B) `touch memo.txt`**

`touch` コマンドは空のファイルを作成します。

</details>

---

### Q5: ファイル「old.txt」を「new.txt」にリネームするコマンドは？

A) `rename old.txt new.txt`
B) `mv old.txt new.txt`
C) `cp old.txt new.txt`
D) `rn old.txt new.txt`

<details>
<summary>答えを見る</summary>

**正解: B) `mv old.txt new.txt`**

`mv` は移動だけでなく、リネームにも使用します。

</details>

---

## Part 2: ファイル表示 (5問)

### Q6: ファイルの内容を全て表示するコマンドは？

A) `show`
B) `print`
C) `cat`
D) `display`

<details>
<summary>答えを見る</summary>

**正解: C) `cat`**

`cat` は concatenate（連結）の略で、ファイル内容を表示します。

</details>

---

### Q7: ファイルの先頭10行を表示するコマンドは？

A) `top file.txt`
B) `first file.txt`
C) `head file.txt`
D) `start file.txt`

<details>
<summary>答えを見る</summary>

**正解: C) `head file.txt`**

`head` はデフォルトで先頭10行を表示します。

</details>

---

### Q8: ファイルの末尾をリアルタイムで監視するコマンドは？

A) `watch file.txt`
B) `tail -f file.txt`
C) `monitor file.txt`
D) `live file.txt`

<details>
<summary>答えを見る</summary>

**正解: B) `tail -f file.txt`**

`-f` は follow の略で、ファイルの更新をリアルタイムで表示します。

</details>

---

### Q9: `less` コマンドを終了するキーは？

A) `x`
B) `q`
C) `e`
D) `Ctrl+C`

<details>
<summary>答えを見る</summary>

**正解: B) `q`**

`q` で less を終了します（quit）。

</details>

---

### Q10: ファイルの行数を数えるコマンドは？

A) `count file.txt`
B) `lines file.txt`
C) `wc -l file.txt`
D) `num file.txt`

<details>
<summary>答えを見る</summary>

**正解: C) `wc -l file.txt`**

`wc` は word count、`-l` は lines の略です。

</details>

---

## Part 3: 検索コマンド (5問)

### Q11: カレントディレクトリ以下の「.py」ファイルを探すコマンドは？

A) `search . -name "*.py"`
B) `find . -name "*.py"`
C) `locate "*.py"`
D) `grep "*.py"`

<details>
<summary>答えを見る</summary>

**正解: B) `find . -name "*.py"`**

`find` でファイル名を検索します。

</details>

---

### Q12: ファイル内の「error」という文字列を検索するコマンドは？

A) `find "error" file.txt`
B) `search "error" file.txt`
C) `grep "error" file.txt`
D) `look "error" file.txt`

<details>
<summary>答えを見る</summary>

**正解: C) `grep "error" file.txt`**

`grep` はファイルの中身から文字列を検索します。

</details>

---

### Q13: grepで大文字小文字を区別せずに検索するオプションは？

A) `-c`
B) `-i`
C) `-n`
D) `-v`

<details>
<summary>答えを見る</summary>

**正解: B) `-i`**

`-i` は case-insensitive の略です。

</details>

---

### Q14: grepでマッチした行の前後2行も表示するオプションは？

A) `-A 2`
B) `-B 2`
C) `-C 2`
D) `-n 2`

<details>
<summary>答えを見る</summary>

**正解: C) `-C 2`**

`-C` は Context の略で前後の行を表示します。

</details>

---

### Q15: ディレクトリを再帰的にgrepで検索するオプションは？

A) `-a`
B) `-d`
C) `-r`
D) `-s`

<details>
<summary>答えを見る</summary>

**正解: C) `-r`**

`-r` は recursive（再帰的）の略です。

</details>

---

## Part 4: 権限 (5問)

### Q16: 権限表記「rwx」の「x」は何を意味する？

A) 拡張
B) 排他
C) 実行
D) 例外

<details>
<summary>答えを見る</summary>

**正解: C) 実行**

`x` は execute（実行）の略です。

</details>

---

### Q17: 権限「755」を記号で表すと？

A) `rw-r--r--`
B) `rwxr-xr-x`
C) `rwx------`
D) `rw-rw-rw-`

<details>
<summary>答えを見る</summary>

**正解: B) `rwxr-xr-x`**

7=rwx, 5=r-x, 5=r-x です。

</details>

---

### Q18: ファイルに実行権限を追加するコマンドは？

A) `chmod +r file`
B) `chmod +w file`
C) `chmod +x file`
D) `chmod 644 file`

<details>
<summary>答えを見る</summary>

**正解: C) `chmod +x file`**

`+x` で実行権限を追加します。

</details>

---

### Q19: SSH秘密鍵に推奨される権限は？

A) 777
B) 755
C) 644
D) 600

<details>
<summary>答えを見る</summary>

**正解: D) 600**

SSH秘密鍵は所有者のみが読み書きできる `600` に設定すべきです。

</details>

---

### Q20: 権限の数字で「4」が表すものは？

A) 実行
B) 書き込み
C) 読み取り
D) すべて

<details>
<summary>答えを見る</summary>

**正解: C) 読み取り**

r=4, w=2, x=1 です。

</details>

---

## 採点

### 点数を計算

| 正解数 | 判定 |
|--------|------|
| 20問 | 完璧！ターミナルマスター！ |
| 18-19問 | 優秀！ |
| 16-17問 | 合格！ |
| 14-15問 | もう少し！ |
| 13問以下 | 復習が必要 |

---

## 合格おめでとうございます！

16問以上正解できたあなたは、**ターミナルマスター** です！

### 習得したスキル

- [x] ターミナルの起動と基本操作
- [x] ディレクトリ構造の理解
- [x] ファイルとディレクトリの作成・削除・移動
- [x] ファイル内容の表示（cat, head, tail, less）
- [x] ファイルの検索（find, grep）
- [x] ファイル権限の理解と変更（chmod）

### 認定証

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║             Terminal Master Certificate                  ║
║                                                          ║
║   This certifies that the holder has successfully        ║
║   completed the Terminal Basics Training Program         ║
║   and demonstrated proficiency in:                       ║
║                                                          ║
║   - Command Line Navigation                              ║
║   - File and Directory Management                        ║
║   - Text File Operations                                 ║
║   - File Search (find & grep)                           ║
║   - File Permissions (chmod)                            ║
║                                                          ║
║   Date: _____________                                    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## Month 1 完了！

おめでとうございます！
「初めてのターミナルを起動しよう」ミッションをクリアしました！

### 次のステップ

Month 2では、さらに実践的なスキルを学びます：

- **Git** - バージョン管理の基本
- **SSH** - リモートサーバーへの接続
- **パイプとリダイレクト** - コマンドの組み合わせ
- **シェルスクリプト入門** - 自動化の第一歩

ターミナルの世界はまだまだ広がっています。
引き続き学習を続けていきましょう！

---

## フィードバック

このコースについてのフィードバックがあれば、ぜひ教えてください。

- 難しかった部分
- もっと詳しく知りたい部分
- 分かりにくかった説明

皆さんのフィードバックがコースの改善につながります！

---

*推定所要時間: 60分*

---

**お疲れさまでした！**
