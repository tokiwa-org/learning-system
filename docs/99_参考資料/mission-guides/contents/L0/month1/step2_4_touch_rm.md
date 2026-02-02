# ファイルを作る・消す

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 2
subStep: 4
title: "ファイルを作る・消す"
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

> 「フォルダは作れるようになりました。ファイルはどうやって作るんですか？」
>
> 「`touch` コマンドで空のファイルを作れるよ。削除は `rm` だね」
>
> 「touchって『触る』ですよね？ファイルに触る？」
>
> 「そう！本来は更新日時を変えるコマンドなんだけど、ファイルがなければ新規作成されるんだ」

---

## touch - ファイルを作る

### 基本構文

```bash
touch ファイル名
```

### 例

```bash
touch hello.txt
```

`hello.txt` という空のファイルが作成されます。

### 確認

```bash
ls -l
```

出力：
```
-rw-r--r--  1 taro  staff  0 Jan 27 10:00 hello.txt
```

サイズが `0` = 空のファイルです。

---

## 複数のファイルを作る

```bash
touch file1.txt file2.txt file3.txt
```

3つのファイルが同時に作成されます。

### 連番のファイル

```bash
touch file{1..5}.txt
```

`file1.txt` から `file5.txt` まで作成されます。

---

## ファイルに内容を書き込む

### echo コマンド

```bash
echo "Hello World" > hello.txt
```

- `>` はリダイレクト（出力先を変更）
- ファイルがなければ作成される
- ファイルがあれば上書きされる

### 追記する

```bash
echo "追加の行" >> hello.txt
```

- `>>` は追記（末尾に追加）
- 既存の内容は消えない

### 確認

```bash
cat hello.txt
```

出力：
```
Hello World
追加の行
```

---

## rm - ファイルを消す

### 基本構文

```bash
rm ファイル名
```

### 例

```bash
rm hello.txt
```

**⚠️ 警告**: 確認なしで即削除されます。取り消しできません。

### 確認付きで削除

```bash
rm -i hello.txt
```

出力：
```
remove hello.txt? y
```

`y` で削除、`n` でキャンセル。

---

## 複数のファイルを削除

### 個別に指定

```bash
rm file1.txt file2.txt file3.txt
```

### ワイルドカード

```bash
rm file*.txt
```

`file` で始まる `.txt` ファイルをすべて削除。

**⚠️ 危険**: ワイルドカードは慎重に！

```bash
# 事前に確認
ls file*.txt

# 問題なければ削除
rm file*.txt
```

---

## cp - ファイルをコピー

### 基本構文

```bash
cp コピー元 コピー先
```

### 例

```bash
cp hello.txt hello_backup.txt
```

`hello.txt` を `hello_backup.txt` としてコピー。

### 別フォルダにコピー

```bash
cp hello.txt ~/Documents/
```

### フォルダごとコピー

```bash
cp -r folder1 folder2
```

`-r` オプションでフォルダを再帰的にコピー。

---

## mv - ファイルを移動・リネーム

### 移動

```bash
mv hello.txt ~/Documents/
```

`hello.txt` を Documents に移動。

### リネーム

```bash
mv hello.txt greeting.txt
```

`hello.txt` を `greeting.txt` に名前変更。

### 移動 + リネーム

```bash
mv hello.txt ~/Documents/greeting.txt
```

---

## ファイル名のルール

### 推奨

| 良い例 | 理由 |
|--------|------|
| `report.txt` | シンプル |
| `report-2024.txt` | ハイフン区切り |
| `report_final.txt` | アンダースコア区切り |

### 避けるべき

| 悪い例 | 理由 |
|--------|------|
| `my report.txt` | スペースが入っている |
| `レポート.txt` | 日本語は問題が起きやすい |
| `.hidden` | ドット始まりは隠しファイル |

---

## 拡張子について

| 拡張子 | 用途 |
|--------|------|
| `.txt` | テキストファイル |
| `.md` | Markdownファイル |
| `.html` | HTMLファイル |
| `.css` | CSSファイル |
| `.js` | JavaScriptファイル |
| `.py` | Pythonファイル |
| `.json` | JSONデータ |

> 拡張子は慣習であり、中身を変えるわけではありません。

---

## ハンズオン

以下のコマンドを順番に実行してください。

```bash
# 1. 練習用フォルダを作成
mkdir ~/file-practice
cd ~/file-practice

# 2. 空のファイルを作成
touch test.txt

# 3. 確認
ls -l

# 4. 内容を書き込む
echo "Hello World" > test.txt

# 5. 確認
cat test.txt

# 6. 追記
echo "Second line" >> test.txt

# 7. 確認
cat test.txt

# 8. コピーを作成
cp test.txt backup.txt

# 9. 確認
ls

# 10. リネーム
mv backup.txt archive.txt

# 11. 確認
ls

# 12. ファイルを削除
rm test.txt archive.txt

# 13. 確認
ls

# 14. クリーンアップ
cd ~
rm -r file-practice
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `touch ファイル名` | 空のファイルを作成 |
| `echo "内容" > ファイル` | 内容を書き込む（上書き） |
| `echo "内容" >> ファイル` | 内容を追記 |
| `rm ファイル名` | ファイルを削除 |
| `rm -i ファイル名` | 確認して削除 |
| `cp 元 先` | コピー |
| `mv 元 先` | 移動またはリネーム |

### 注意点

- `rm` は取り消しできない
- ワイルドカード（`*`）は事前に `ls` で確認
- `-i` オプションで安全に削除

### チェックリスト

- [ ] `touch` でファイルを作成できた
- [ ] `echo` と `>` で内容を書き込めた
- [ ] `rm` でファイルを削除できた
- [ ] `cp` と `mv` を使えた

---

## 次のステップへ

ファイルの作成・削除はマスターできましたか？

次のセクションでは、実践的な演習に挑戦します。
ここまで学んだことを使って、プロジェクト構造を作ってみましょう！

---

*推定読了時間: 30分*
