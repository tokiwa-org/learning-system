# head/tailで先頭・末尾を表示する

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 3
subStep: 2
title: "head/tailで先頭・末尾を表示する"
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

> 「catで全部表示すると、ログファイルとか大変なことになりますよね...」
>
> 「そう！だから先頭だけ見る `head`、末尾だけ見る `tail` があるんだ」
>
> 「ログファイルって末尾が最新ですもんね」
>
> 「その通り。`tail` は本当によく使うコマンドだよ」

---

## head - ファイルの先頭を表示

### 基本構文

```bash
head ファイル名
```

デフォルトで**先頭10行**を表示します。

### 例

```bash
head sample.txt
```

---

## tail - ファイルの末尾を表示

### 基本構文

```bash
tail ファイル名
```

デフォルトで**末尾10行**を表示します。

### 例

```bash
tail sample.txt
```

---

## 準備: サンプルファイルを作る

```bash
cd ~/cat-practice

# 20行のファイルを作成
for i in {1..20}; do echo "Line $i: This is line number $i"; done > numbers.txt

# 確認
cat -n numbers.txt
```

---

## 行数を指定する

### head: 先頭N行を表示

```bash
head -n 5 numbers.txt
```

または

```bash
head -5 numbers.txt
```

出力：
```
Line 1: This is line number 1
Line 2: This is line number 2
Line 3: This is line number 3
Line 4: This is line number 4
Line 5: This is line number 5
```

### tail: 末尾N行を表示

```bash
tail -n 5 numbers.txt
```

または

```bash
tail -5 numbers.txt
```

出力：
```
Line 16: This is line number 16
Line 17: This is line number 17
Line 18: This is line number 18
Line 19: This is line number 19
Line 20: This is line number 20
```

---

## headの応用

### 末尾以外を表示

```bash
head -n -3 numbers.txt
```

「末尾3行以外」= 先頭17行を表示。

### バイト数で指定

```bash
head -c 50 numbers.txt
```

先頭50バイトを表示。

---

## tailの応用

### 先頭以外を表示

```bash
tail -n +5 numbers.txt
```

「5行目以降」を表示（先頭4行をスキップ）。

### リアルタイム監視（-f）

```bash
tail -f ログファイル
```

ファイルの更新をリアルタイムで監視します。

```bash
# 別のターミナルでファイルを更新
echo "New log entry" >> numbers.txt

# tail -f しているターミナルに表示される
```

`Ctrl+C` で終了。

---

## 実践: ログファイルの監視

開発現場でよく使うパターン：

```bash
# アプリケーションログを監視
tail -f /var/log/app.log

# 最新100行を表示してから監視
tail -n 100 -f /var/log/app.log
```

---

## 組み合わせ: 中間部分を表示

### 6行目から10行目を表示

```bash
head -n 10 numbers.txt | tail -n 5
```

1. `head -n 10` → 先頭10行を取得
2. パイプ `|` → 次のコマンドに渡す
3. `tail -n 5` → その末尾5行を表示

結果：6〜10行目が表示される。

### または

```bash
tail -n +6 numbers.txt | head -n 5
```

1. `tail -n +6` → 6行目以降を取得
2. `head -n 5` → その先頭5行を表示

---

## パイプ（|）について

### パイプとは

コマンドの出力を、次のコマンドの入力に渡す仕組み。

```
command1 | command2 | command3
```

### 例

```bash
cat numbers.txt | head -n 5 | tail -n 2
```

1. `cat` でファイル内容を出力
2. `head` で先頭5行に絞る
3. `tail` でその末尾2行を表示

結果：4〜5行目が表示される。

---

## ハンズオン

```bash
cd ~/cat-practice

# 1. 先頭5行を表示
head -n 5 numbers.txt

# 2. 末尾5行を表示
tail -n 5 numbers.txt

# 3. 10行目だけ表示
head -n 10 numbers.txt | tail -n 1

# 4. 5〜10行目を表示
head -n 10 numbers.txt | tail -n 6

# 5. リアルタイム監視（Ctrl+Cで終了）
# 別のターミナルでファイルを更新してみてください
tail -f numbers.txt
```

---

## まとめ

| コマンド | 説明 |
|----------|------|
| `head ファイル` | 先頭10行を表示 |
| `head -n N ファイル` | 先頭N行を表示 |
| `tail ファイル` | 末尾10行を表示 |
| `tail -n N ファイル` | 末尾N行を表示 |
| `tail -f ファイル` | リアルタイム監視 |
| `tail -n +N ファイル` | N行目以降を表示 |

### よく使うパターン

| パターン | コマンド |
|----------|----------|
| ログの最新20行 | `tail -n 20 log.txt` |
| ログをリアルタイム監視 | `tail -f log.txt` |
| ファイルの1行目 | `head -n 1 file.txt` |
| ファイルの最後の1行 | `tail -n 1 file.txt` |

### チェックリスト

- [ ] `head` で先頭を表示できた
- [ ] `tail` で末尾を表示できた
- [ ] `-n` で行数を指定できた
- [ ] パイプで組み合わせできた

---

## 次のステップへ

head/tailはマスターできましたか？

次のセクションでは、大きなファイルをページ単位で閲覧できる
`less` コマンドを学びます。

長いファイルも快適に読めるようになりますよ！

---

*推定読了時間: 30分*
