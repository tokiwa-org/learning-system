# wcで統計、diffで比較

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 3
subStep: 4
title: "wcで統計、diffで比較"
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

> 「ファイルの中身を見るコマンドは覚えたね」
>
> 「はい。cat, head, tail, less が使えるようになりました」
>
> 「じゃあ次は、ファイルの行数を数えたり、2つのファイルを比較するコマンドを覚えよう」

---

## wc - 行数・単語数・バイト数を数える

### 基本構文

```bash
wc ファイル名
```

`wc` = **word count**（単語カウント）

### 例

```bash
wc numbers.txt
```

出力：
```
  20   100   600 numbers.txt
```

| 数値 | 意味 |
|------|------|
| 20 | 行数 |
| 100 | 単語数 |
| 600 | バイト数 |

---

## wcのオプション

### -l: 行数だけ

```bash
wc -l numbers.txt
```

出力：
```
20 numbers.txt
```

### -w: 単語数だけ

```bash
wc -w numbers.txt
```

### -c: バイト数だけ

```bash
wc -c numbers.txt
```

### -m: 文字数

```bash
wc -m numbers.txt
```

---

## wcの実践的な使い方

### パイプと組み合わせ

```bash
# ディレクトリ内のファイル数を数える
ls | wc -l

# 特定の文字列を含む行数を数える
grep "error" log.txt | wc -l

# プロセス数を数える
ps aux | wc -l
```

---

## diff - ファイルの差分を表示

### 基本構文

```bash
diff ファイル1 ファイル2
```

2つのファイルの違いを表示します。

---

## diffの準備

```bash
cd ~/cat-practice

# 元のファイル
cat > original.txt << 'EOF'
line 1
line 2
line 3
line 4
EOF

# 変更したファイル
cat > modified.txt << 'EOF'
line 1
line 2 modified
line 3
new line
line 4
EOF
```

---

## diffを実行

```bash
diff original.txt modified.txt
```

出力：
```
2c2
< line 2
---
> line 2 modified
3a4
> new line
```

### 出力の読み方

| 記号 | 意味 |
|------|------|
| `<` | 1つ目のファイルにある行 |
| `>` | 2つ目のファイルにある行 |
| `2c2` | 2行目が変更（change） |
| `3a4` | 3行目の後に追加（add） |
| `d` | 削除（delete） |

---

## diffのオプション

### -u: 統一形式（Unified format）

```bash
diff -u original.txt modified.txt
```

出力：
```
--- original.txt
+++ modified.txt
@@ -1,4 +1,5 @@
 line 1
-line 2
+line 2 modified
 line 3
+new line
 line 4
```

Gitでおなじみの形式です。

### -y: 横並び表示

```bash
diff -y original.txt modified.txt
```

出力：
```
line 1                                line 1
line 2                              | line 2 modified
line 3                                line 3
                                    > new line
line 4                                line 4
```

### --color: 色付き

```bash
diff --color original.txt modified.txt
```

---

## 差分がない場合

```bash
diff original.txt original.txt
```

→ 何も出力されない（差分なし）

### 確認方法

```bash
diff original.txt original.txt
echo $?
```

- `0` → 差分なし
- `1` → 差分あり

---

## sort - ファイルをソート

### 基本

```bash
sort ファイル名
```

行をアルファベット順にソート。

### 数値でソート

```bash
sort -n numbers.txt
```

### 逆順

```bash
sort -r ファイル名
```

### 重複を除去

```bash
sort -u ファイル名
```

---

## uniq - 重複行を処理

### 連続する重複を除去

```bash
sort ファイル | uniq
```

> `uniq` は連続する重複しか除去しないので、先に `sort` が必要。

### 重複カウント

```bash
sort ファイル | uniq -c
```

---

## ハンズオン

```bash
cd ~/cat-practice

# 1. 行数を数える
wc -l long.txt

# 2. ファイル数を数える
ls | wc -l

# 3. 差分を表示
diff original.txt modified.txt

# 4. 統一形式で表示
diff -u original.txt modified.txt

# 5. ソートの例
echo -e "banana\napple\ncherry" > fruits.txt
sort fruits.txt

# 6. 重複除去の例
echo -e "a\nb\na\nb\nc" > dup.txt
sort dup.txt | uniq
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `wc ファイル` | 行数・単語数・バイト数 |
| `wc -l ファイル` | 行数のみ |
| `diff file1 file2` | 差分を表示 |
| `diff -u file1 file2` | 統一形式で差分 |
| `sort ファイル` | ソート |
| `uniq` | 重複除去 |

### よく使うパターン

| 目的 | コマンド |
|------|----------|
| ファイルの行数 | `wc -l file` |
| ディレクトリ内のファイル数 | `ls \| wc -l` |
| 2ファイルの差分確認 | `diff -u old new` |
| 重複行を数える | `sort file \| uniq -c` |

### チェックリスト

- [ ] `wc` で行数を数えられた
- [ ] `diff` で差分を確認できた
- [ ] 出力の意味がわかった

---

## 次のステップへ

wc と diff はマスターできましたか？

次のセクションでは、実践的な演習に挑戦します。
ログファイルを分析してみましょう！

---

*推定読了時間: 30分*
