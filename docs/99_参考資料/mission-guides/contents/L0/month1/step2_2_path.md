# パスの読み方・書き方

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 2
subStep: 2
title: "パスの読み方・書き方"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「ディレクトリ構造はわかった。でも『このファイルはここにあるよ』ってどう伝えればいいんですか？」
>
> 「住所みたいなものだね。それを**パス**って呼ぶんだ」
>
> 「パス...道って意味ですか？」
>
> 「その通り！ファイルまでの道順を示すんだよ」

---

## パスとは

**パス（Path）** = ファイルやディレクトリの場所を示す文字列

```
/Users/taro/Documents/report.txt
```

これは「ルートの中のUsersの中のtaroの中のDocumentsの中のreport.txt」を意味します。

---

## 2種類のパス

### 絶対パス

**ルートから**の完全な道順。

```
/Users/taro/Documents/report.txt
```

- 必ず `/`（ルート）から始まる
- どこからでも同じファイルを指す
- 長いけど確実

### 相対パス

**現在地から**の道順。

```
Documents/report.txt
```

- 現在のディレクトリからの相対的な位置
- `/` で始まらない
- 短くて便利だけど、現在地によって意味が変わる

---

## 例で理解しよう

### 現在地が `/Users/taro` の場合

```
/Users/taro/
├── Documents/
│   └── report.txt
└── Desktop/
    └── memo.txt
```

| ファイル | 絶対パス | 相対パス |
|---------|---------|---------|
| report.txt | `/Users/taro/Documents/report.txt` | `Documents/report.txt` |
| memo.txt | `/Users/taro/Desktop/memo.txt` | `Desktop/memo.txt` |

### 現在地が `/Users/taro/Documents` の場合

| ファイル | 絶対パス | 相対パス |
|---------|---------|---------|
| report.txt | `/Users/taro/Documents/report.txt` | `report.txt` または `./report.txt` |
| memo.txt | `/Users/taro/Desktop/memo.txt` | `../Desktop/memo.txt` |

---

## 特殊な記号

| 記号 | 意味 | 例 |
|------|------|-----|
| `/` | ルートディレクトリ | `/Users/taro` |
| `~` | ホームディレクトリ | `~/Documents` |
| `.` | 現在のディレクトリ | `./file.txt` |
| `..` | 親ディレクトリ | `../other/file.txt` |

---

## パスの組み立て方

### 下の階層に行く

```bash
# 現在地: /Users/taro

# Documentsに移動
cd Documents
# 結果: /Users/taro/Documents

# さらにprojectsに移動
cd projects
# 結果: /Users/taro/Documents/projects
```

または一気に：

```bash
cd Documents/projects
```

### 上の階層に行く

```bash
# 現在地: /Users/taro/Documents/projects

# 1つ上に移動
cd ..
# 結果: /Users/taro/Documents

# 2つ上に移動
cd ../..
# 結果: /Users/taro
```

### 横に移動する

```bash
# 現在地: /Users/taro/Documents

# Desktopに移動（一度上がって横へ）
cd ../Desktop
# 結果: /Users/taro/Desktop
```

---

## 絶対パスと相対パスの使い分け

| 状況 | おすすめ |
|------|---------|
| スクリプトや設定ファイル | 絶対パス |
| 普段の作業 | 相対パス |
| 深い階層への移動 | 絶対パス |
| 近くのファイルへのアクセス | 相対パス |

---

## パスの確認方法

### 現在地の絶対パス

```bash
pwd
```

### ファイルの絶対パス

```bash
# Mac/Linux
realpath ファイル名

# または
readlink -f ファイル名
```

### タブ補完を活用

パスを入力途中で `Tab` キーを押すと、自動補完されます。

```bash
cd Docu[Tab]
# → cd Documents/ に補完される
```

---

## よくある間違い

### 間違い1: スペースの扱い

```bash
# NG: スペースがあるとエラー
cd My Documents

# OK: 引用符で囲む
cd "My Documents"

# OK: エスケープする
cd My\ Documents
```

### 間違い2: 大文字小文字

```bash
# Mac/Windows: 大文字小文字を区別しないことが多い
cd documents  # Documents でも OK

# Linux: 大文字小文字を区別する
cd documents  # Documents とは別物！
```

### 間違い3: パスの始まり

```bash
# 絶対パス（/で始まる）
cd /Users/taro

# 相対パス（/で始まらない）
cd Users/taro  # 現在地からの相対位置
```

---

## 実践例

### シナリオ: プロジェクトフォルダを作る

```bash
# ホームに移動
cd ~

# projectsフォルダに移動（なければ後で作る）
cd projects

# 新しいプロジェクトフォルダを作る（次のセクションで学習）
# mkdir my-app

# そのフォルダに移動
cd my-app

# 現在地を確認
pwd
# /Users/taro/projects/my-app
```

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. ホームに移動
cd ~

# 2. 絶対パスを確認
pwd

# 3. Documentsに相対パスで移動
cd Documents

# 4. 確認
pwd

# 5. ホームに相対パスで戻る
cd ..

# 6. 今度は絶対パスでDocumentsに移動
cd ~/Documents

# 7. 確認
pwd

# 8. ルートからの絶対パスで移動
cd /tmp

# 9. ホームに戻る
cd ~
```

---

## まとめ

| 概念 | 説明 |
|------|------|
| パス | ファイルの場所を示す文字列 |
| 絶対パス | ルートからの完全な道順（`/`で始まる） |
| 相対パス | 現在地からの道順 |
| `~` | ホームディレクトリへのショートカット |
| `..` | 親ディレクトリ |
| `.` | 現在のディレクトリ |

### チェックリスト

- [ ] 絶対パスと相対パスの違いがわかった
- [ ] `..` を使って親ディレクトリに移動できた
- [ ] `~` を使ってホームに移動できた
- [ ] Tabキーで補完できた

---

## 次のステップへ

パスの読み方・書き方はマスターできましたか？

次のセクションでは、実際に**フォルダを作ったり消したり**する方法を学びます。
いよいよファイル操作の実践です！

---

*推定読了時間: 30分*
