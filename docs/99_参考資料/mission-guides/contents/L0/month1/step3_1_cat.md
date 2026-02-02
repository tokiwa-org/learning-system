# catでファイル全体を表示する

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 3
subStep: 1
title: "catでファイル全体を表示する"
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

> 「ファイルを作れるようになったね。中身を見るにはどうするの？」
>
> 「一番シンプルなのは `cat` コマンドだよ。ファイルの内容を画面に出力してくれる」
>
> 「catって猫ですか？」
>
> 「concatenate（連結）の略なんだ。でも猫って覚えてもいいかも」

---

## catとは

`cat` = **concatenate**（連結）の略

ファイルの内容を標準出力（画面）に表示するコマンドです。

---

## 基本的な使い方

### ファイルを表示

```bash
cat ファイル名
```

### 例

```bash
cat hello.txt
```

出力：
```
Hello World
This is a test file.
```

---

## 準備: サンプルファイルを作る

```bash
cd ~
mkdir cat-practice
cd cat-practice

cat > sample.txt << 'EOF'
1行目: これはサンプルファイルです。
2行目: catコマンドで表示してみましょう。
3行目: 複数行のテキストが入っています。
4行目: ファイルの最後の行です。
EOF
```

---

## 実際にやってみよう

### ファイルを表示

```bash
cat sample.txt
```

出力：
```
1行目: これはサンプルファイルです。
2行目: catコマンドで表示してみましょう。
3行目: 複数行のテキストが入っています。
4行目: ファイルの最後の行です。
```

---

## 便利なオプション

### -n: 行番号を表示

```bash
cat -n sample.txt
```

出力：
```
     1	1行目: これはサンプルファイルです。
     2	2行目: catコマンドで表示してみましょう。
     3	3行目: 複数行のテキストが入っています。
     4	4行目: ファイルの最後の行です。
```

### -b: 空行以外に行番号

```bash
cat -b sample.txt
```

空行はカウントされません。

### -s: 連続する空行を1つに

```bash
cat -s sample.txt
```

連続する空行が1行にまとめられます。

---

## 複数ファイルを連結

### 2つのファイルを続けて表示

```bash
# もう1つファイルを作成
echo "これは別のファイルです。" > other.txt

# 連結して表示
cat sample.txt other.txt
```

出力：
```
1行目: これはサンプルファイルです。
2行目: catコマンドで表示してみましょう。
3行目: 複数行のテキストが入っています。
4行目: ファイルの最後の行です。
これは別のファイルです。
```

### 連結して新しいファイルに保存

```bash
cat sample.txt other.txt > combined.txt
```

---

## catの注意点

### 大きなファイルには不向き

```bash
cat huge-log-file.log  # 何万行もスクロールして流れていく...
```

→ 大きなファイルには `less` や `head`/`tail` を使いましょう。

### バイナリファイルは表示できない

```bash
cat image.png  # 文字化けして大変なことに...
```

→ バイナリファイルは `file` コマンドで種類を確認。

---

## catの便利な使い方

### クリップボードにコピー（Mac）

```bash
cat sample.txt | pbcopy
```

### 新しいファイルを作成

```bash
cat > newfile.txt
# ここから入力
Hello World
# Ctrl+D で終了
```

### ファイルの先頭に追記

```bash
# 元のファイルを一時退避
cat sample.txt > temp.txt

# 新しい内容 + 元の内容
echo "最初に追加する行" > sample.txt
cat temp.txt >> sample.txt

# 一時ファイルを削除
rm temp.txt
```

---

## ハンズオン

```bash
# 1. 練習用フォルダに移動
cd ~/cat-practice

# 2. ファイルを表示
cat sample.txt

# 3. 行番号付きで表示
cat -n sample.txt

# 4. 複数ファイルを連結
cat sample.txt other.txt

# 5. 連結して保存
cat sample.txt other.txt > merged.txt

# 6. 確認
cat merged.txt
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `cat ファイル` | ファイル内容を表示 |
| `cat -n ファイル` | 行番号付きで表示 |
| `cat file1 file2` | 複数ファイルを連結表示 |
| `cat file1 file2 > new` | 連結して保存 |

### catが適している場面

- 短いファイルを素早く確認
- 複数ファイルの連結
- パイプラインの最初の入力

### catが適さない場面

- 大きなファイル → `less` を使う
- 先頭/末尾だけ見たい → `head`/`tail` を使う

### チェックリスト

- [ ] `cat` でファイルを表示できた
- [ ] `-n` で行番号を付けられた
- [ ] 複数ファイルを連結できた

---

## 次のステップへ

catコマンドはマスターできましたか？

次のセクションでは、ファイルの先頭や末尾だけを表示する
`head` と `tail` コマンドを学びます。

大きなログファイルを扱うときに重宝しますよ！

---

*推定読了時間: 30分*
