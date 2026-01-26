# 最初の3コマンド

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 1
subStep: 5
title: "最初の3コマンド"
itemType: LESSON
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "OS"
  category: "IT基本"
  target_level: "L0"
```

---

## このセクションで学ぶこと

ターミナル操作の基本中の基本、**3つのコマンド**を覚えましょう。

この3つさえ覚えれば、ターミナルの中を自由に移動できます。

---

## 最初の3コマンド

| コマンド | 意味 | 覚え方 |
|---------|------|--------|
| `pwd` | 今いる場所を表示 | **P**rint **W**orking **D**irectory |
| `ls` | フォルダの中身を一覧表示 | **L**i**s**t |
| `cd` | 場所を移動する | **C**hange **D**irectory |

```
「今どこ？」 → pwd
「何がある？」 → ls
「移動したい」 → cd
```

---

## pwd：今いる場所を確認

### 使い方

```bash
pwd
```

### 実行例

```bash
tanaka@MacBook ~ % pwd
/Users/tanaka
```

### いつ使う？

- 「あれ、今どこにいるんだっけ？」と迷ったとき
- 作業を始める前に現在地を確認したいとき

---

## ls：中身を一覧表示

### 使い方

```bash
ls
```

### 実行例

```bash
tanaka@MacBook ~ % ls
Desktop    Documents  Downloads  Movies
Music      Pictures   Public
```

### よく使うオプション

| コマンド | 結果 |
|---------|------|
| `ls` | ファイル名だけ表示 |
| `ls -l` | 詳細情報も表示（サイズ、日付など） |
| `ls -a` | 隠しファイルも表示 |
| `ls -la` | 詳細 + 隠しファイル（よく使う！） |

### 実行例：ls -la

```bash
tanaka@MacBook ~ % ls -la
total 0
drwxr-xr-x   15 tanaka  staff   480  1 27 09:00 .
drwxr-xr-x    5 root    admin   160  1  1 00:00 ..
-rw-------    1 tanaka  staff    12  1 27 09:00 .bash_history
drwx------    3 tanaka  staff    96  1  1 00:00 Desktop
drwx------    4 tanaka  staff   128  1  1 00:00 Documents
drwx------    3 tanaka  staff    96  1  1 00:00 Downloads
```

**ポイント:** `.` で始まるファイル/フォルダは「隠しファイル」

---

## cd：場所を移動

### 使い方

```bash
cd [移動先]
```

### 実行例

```bash
tanaka@MacBook ~ % cd Desktop
tanaka@MacBook Desktop % pwd
/Users/tanaka/Desktop
```

### よく使う移動先

| コマンド | 移動先 |
|---------|--------|
| `cd Desktop` | Desktopフォルダに移動 |
| `cd ~` | ホームディレクトリに戻る |
| `cd ..` | 1つ上のフォルダに戻る |
| `cd ../..` | 2つ上のフォルダに戻る |
| `cd -` | 直前にいた場所に戻る |

### 実行例：上に戻る

```bash
tanaka@MacBook Desktop % cd ..
tanaka@MacBook ~ % pwd
/Users/tanaka
```

### 実行例：一気に深いフォルダへ

```bash
tanaka@MacBook ~ % cd Documents/Projects
tanaka@MacBook Projects % pwd
/Users/tanaka/Documents/Projects
```

---

## 3つのコマンドを組み合わせる

### 基本の流れ

```bash
# 1. 今どこにいる？
pwd

# 2. 何がある？
ls

# 3. Documentsに移動したい
cd Documents

# 4. 移動できたか確認
pwd

# 5. 中身を確認
ls
```

### 実践例：探検してみよう

```bash
tanaka@MacBook ~ % pwd
/Users/tanaka

tanaka@MacBook ~ % ls
Desktop  Documents  Downloads

tanaka@MacBook ~ % cd Documents
tanaka@MacBook Documents % ls
Projects  Reports  Notes

tanaka@MacBook Documents % cd Projects
tanaka@MacBook Projects % ls
project1  project2

tanaka@MacBook Projects % cd ~
tanaka@MacBook ~ % pwd
/Users/tanaka
```

---

## 入力のコツ

### Tab補完を活用しよう

フォルダ名を途中まで入力して `Tab` キーを押すと、自動で補完されます。

```bash
tanaka@MacBook ~ % cd Doc[Tab]
tanaka@MacBook ~ % cd Documents/
                      ↑
               自動で補完された！
```

**これを使えば:**
- タイプミスが減る
- 入力が速くなる
- フォルダ名を覚えていなくてもOK

### ↑キーで履歴を呼び出し

`↑` キーを押すと、前に実行したコマンドが表示されます。

```bash
tanaka@MacBook ~ % ls     # 実行
tanaka@MacBook ~ % pwd    # 実行
tanaka@MacBook ~ % [↑]    # ← 「pwd」が表示される
tanaka@MacBook ~ % [↑]    # ← 「ls」が表示される
```

---

## まとめ

| コマンド | 機能 | 例 |
|---------|------|-----|
| `pwd` | 現在地を表示 | `pwd` → /Users/tanaka |
| `ls` | 一覧表示 | `ls -la` で詳細表示 |
| `cd` | 移動 | `cd ..` で上へ、`cd ~` でホームへ |

### 覚えておくこと

1. **pwd** - 迷ったら現在地確認
2. **ls** - 中身を見てから移動
3. **cd** - フォルダ間を自由に移動
4. **Tab補完** - 入力を楽にするテクニック

---

## 次のステップへ

3つの基本コマンドは理解できましたか？

次は理解度チェックのクイズです。ここまでの内容を振り返りましょう！

---

*推定読了時間: 15分*
