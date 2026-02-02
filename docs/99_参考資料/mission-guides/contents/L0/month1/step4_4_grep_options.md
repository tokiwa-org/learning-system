# grepのオプション

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 4
subStep: 4
title: "grepのオプション"
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

> 「grepでエラーを見つけても、前後の文脈が分からないことがあるんです」
>
> 「そんな時は前後の行も一緒に表示できるオプションがあるよ」
>
> 「そういうのが欲しかったです！」
>
> 「あと、正規表現を使うともっと柔軟に検索できるんだ」

---

## 前後の行を表示

### 前の行も表示（-B: Before）

```bash
grep -B 2 "ERROR" project/app.log
```

- `-B 2` = マッチした行の**前** 2行も表示

### 後の行も表示（-A: After）

```bash
grep -A 2 "ERROR" project/app.log
```

- `-A 2` = マッチした行の**後** 2行も表示

### 前後両方を表示（-C: Context）

```bash
grep -C 2 "ERROR" project/app.log
```

- `-C 2` = マッチした行の**前後** 2行ずつ表示

---

## 実際にやってみよう

```bash
cd ~/find-practice

# 前後2行を表示
grep -C 2 "ERROR" project/app.log
```

出力：
```
2026-01-27 09:01:02 WARN  Slow response: 2.5s
2026-01-27 09:01:30 ERROR Database connection failed
2026-01-27 09:02:00 INFO  Retry connection
2026-01-27 09:02:05 INFO  Connection restored
--
2026-01-27 09:02:05 INFO  Connection restored
2026-01-27 09:03:00 ERROR File not found: /data/config.yml
2026-01-27 09:04:00 WARN  High memory usage: 85%
```

`--` は複数のマッチの区切りを示します。

---

## 単語単位でマッチ（-w）

```bash
# "in"という単語だけにマッチ（login の in にはマッチしない）
grep -w "in" project/app.log
```

### 違いを確認

```bash
# -wなし: loginのinにもマッチ
grep "in" project/app.log

# -wあり: 単語のinだけ
grep -w "in" project/app.log
```

---

## 行全体がマッチ（-x）

```bash
echo -e "hello\nhello world\nworld" > test.txt
grep -x "hello" test.txt
```

出力：
```
hello
```

「hello world」にはマッチしません。

---

## 色付きで表示（--color）

```bash
grep --color=auto "ERROR" project/app.log
```

マッチした部分が色付きで表示されます。
多くの環境ではデフォルトで有効です。

---

## 正規表現を使う

### 基本的な正規表現

| パターン | 意味 | 例 |
|----------|------|-----|
| `.` | 任意の1文字 | `a.c` → abc, adc, a1c |
| `*` | 直前の文字の0回以上の繰り返し | `ab*c` → ac, abc, abbc |
| `^` | 行頭 | `^ERROR` → 行頭のERROR |
| `$` | 行末 | `error$` → 行末のerror |
| `[abc]` | a, b, c のいずれか | `[Ee]rror` → Error, error |
| `[0-9]` | 数字のいずれか | `log[0-9]` → log1, log2 |

### 例：行頭がINFOで始まる行

```bash
grep "^2026-01-27 09:0[0-2]" project/app.log
```

### 例：数字を含む行

```bash
grep "[0-9]s" project/app.log
```

---

## 拡張正規表現（-E）

### より高度なパターン

| パターン | 意味 | 例 |
|----------|------|-----|
| `+` | 直前の文字の1回以上の繰り返し | `ab+c` → abc, abbc（acはNG） |
| `?` | 直前の文字の0回または1回 | `colou?r` → color, colour |
| `\|` | または | `ERROR\|WARN` |
| `()` | グループ化 | `(ab)+` → ab, abab |

### 例：ERRORまたはWARNを検索

```bash
grep -E "ERROR|WARN" project/app.log
```

出力：
```
2026-01-27 09:01:02 WARN  Slow response: 2.5s
2026-01-27 09:01:30 ERROR Database connection failed
2026-01-27 09:03:00 ERROR File not found: /data/config.yml
2026-01-27 09:04:00 WARN  High memory usage: 85%
```

---

## 複数パターンを検索（-e）

```bash
grep -e "ERROR" -e "WARN" project/app.log
```

`-E` を使った `ERROR|WARN` と同じ結果になります。

---

## ファイルからパターンを読み込む（-f）

```bash
# パターンファイルを作成
echo -e "ERROR\nWARN" > patterns.txt

# パターンファイルを使って検索
grep -f patterns.txt project/app.log

# クリーンアップ
rm patterns.txt
```

---

## 静かに終了コードだけを確認（-q）

```bash
# マッチがあれば終了コード0、なければ1
grep -q "ERROR" project/app.log
echo $?  # 0 が表示される

grep -q "CRITICAL" project/app.log
echo $?  # 1 が表示される
```

スクリプトで条件分岐するときに便利です。

---

## ハンズオン

```bash
# 1. 前後2行を表示
grep -C 2 "ERROR" project/app.log

# 2. ERRORまたはWARNを検索
grep -E "ERROR|WARN" project/app.log

# 3. 行頭がINFOで始まる行
grep "^2026" project/app.log

# 4. 単語単位でマッチ
grep -w "login" project/app.log

# 5. 数字を含む行を検索
grep "[0-9]%" project/app.log

# 6. 複数条件
grep -E "09:0[0-2].*INFO" project/app.log
```

---

## 実践的な使用例

### エラーログの前後を確認

```bash
grep -C 5 "Exception" application.log
```

### IPアドレスを検索

```bash
grep -E "[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+" access.log
```

### メールアドレスを検索

```bash
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" contacts.txt
```

### 特定の時間帯のログ

```bash
grep -E "^2026-01-27 09:(0[0-5])" project/app.log
```

---

## grepオプション早見表

| オプション | 説明 |
|------------|------|
| `-i` | 大文字小文字を区別しない |
| `-v` | マッチしない行を表示 |
| `-n` | 行番号を表示 |
| `-c` | マッチ数をカウント |
| `-l` | ファイル名のみ表示 |
| `-r` | 再帰的に検索 |
| `-w` | 単語単位でマッチ |
| `-x` | 行全体でマッチ |
| `-B N` | 前N行も表示 |
| `-A N` | 後N行も表示 |
| `-C N` | 前後N行も表示 |
| `-E` | 拡張正規表現を使用 |
| `-e` | 複数パターンを指定 |
| `-f` | パターンをファイルから読み込む |
| `-q` | 出力なし（終了コードのみ） |
| `--color` | マッチ部分を色付け |

---

## まとめ

| 使いたい場面 | コマンド例 |
|--------------|------------|
| 前後の文脈を見る | `grep -C 3 "ERROR" log.txt` |
| 複数パターンで検索 | `grep -E "ERROR\|WARN" log.txt` |
| 行頭・行末で検索 | `grep "^START" file.txt` |
| 単語だけを検索 | `grep -w "error" file.txt` |

### チェックリスト

- [ ] `-C` で前後の行を表示できた
- [ ] `-E` で複数パターンを検索できた
- [ ] 基本的な正規表現（`^`, `$`, `[0-9]`）を使えた

---

## 次のステップへ

grepのオプションをマスターしましたか？

次のセクションでは、findとgrepを組み合わせた
総合演習に挑戦します。実際のプロジェクトでの検索を体験しましょう！

---

*推定読了時間: 30分*
