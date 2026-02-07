# 上級コマンドを使いこなそう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 1
subStep: 2
title: "上級コマンドを使いこなそう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "OS"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 佐藤先輩がターミナルの前に座る。
>
> 「L0で覚えた grep や find は便利だろ？ でも現場では、もっと強力な武器がある」
>
> 画面に長大なログファイルが表示される。
>
> 「このログから特定のパターンを抽出して、集計して、レポートにする。
> それを1行のコマンドでやるのが、プロの仕事だ」
>
> 「1行で...ですか？」
>
> 「ああ。今日はそのための武器を渡す」

---

## sort -- データを並べ替える

`sort` はテキストデータを行単位で並べ替えるコマンドです。

### 基本的な使い方

```bash
# アルファベット順にソート
sort names.txt

# 数値としてソート（-n）
sort -n scores.txt

# 逆順ソート（-r）
sort -rn scores.txt

# 重複を除去してソート（-u）
sort -u names.txt
```

### 実践例：特定の列でソート

```bash
# CSVの3列目で数値ソート（-t でデリミタ指定、-k で列指定）
sort -t',' -k3 -n data.csv

# ディスク使用量を大きい順に表示
du -sh /var/log/* | sort -rh
```

| オプション | 意味 | 例 |
|-----------|------|-----|
| `-n` | 数値としてソート | `sort -n` |
| `-r` | 逆順 | `sort -rn` |
| `-k N` | N列目をキーにソート | `sort -k2` |
| `-t` | 区切り文字を指定 | `sort -t','` |
| `-u` | 重複除去 | `sort -u` |
| `-h` | 人が読める数値（1K, 2M） | `sort -h` |

---

## uniq -- 重複を処理する

`uniq` は連続する重複行を処理します。通常 `sort` と組み合わせて使います。

### 基本的な使い方

```bash
# 連続する重複行を除去
sort names.txt | uniq

# 重複回数をカウント（-c）
sort names.txt | uniq -c

# 重複している行だけ表示（-d）
sort names.txt | uniq -d

# 重複していない行だけ表示（-u）
sort names.txt | uniq -u
```

### 実践例：アクセスログの集計

```bash
# アクセス元IPの出現回数を集計し、多い順に表示
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10
```

---

## cut -- 列を切り出す

`cut` はテキストの特定の列やフィールドを切り出します。

### 基本的な使い方

```bash
# CSVの1列目を取得
cut -d',' -f1 data.csv

# 複数列を取得
cut -d',' -f1,3 data.csv

# 範囲指定
cut -d':' -f1-3 /etc/passwd

# 文字位置で切り出し
cut -c1-10 data.txt
```

| オプション | 意味 | 例 |
|-----------|------|-----|
| `-d` | 区切り文字 | `-d','` |
| `-f` | フィールド番号 | `-f1,3` |
| `-c` | 文字位置 | `-c1-10` |

---

## tr -- 文字を変換・削除する

`tr` は文字の変換や削除を行います。

### 基本的な使い方

```bash
# 小文字を大文字に変換
echo "hello world" | tr 'a-z' 'A-Z'
# 出力: HELLO WORLD

# 特定の文字を削除
echo "Hello, World!" | tr -d ','
# 出力: Hello World!

# 連続する文字を1つに圧縮
echo "hello    world" | tr -s ' '
# 出力: hello world

# 改行をスペースに変換
cat names.txt | tr '\n' ' '
```

---

## tee -- 出力を分岐する

`tee` は標準出力に出しつつ、ファイルにも書き込みます。

```bash
# 画面に表示しつつファイルにも保存
ls -la | tee file_list.txt

# 追記モード
echo "new entry" | tee -a log.txt

# パイプの途中で確認用に使う
cat data.txt | sort | tee sorted.txt | head -5
```

---

## sed -- ストリームエディタ

`sed` はテキストの検索・置換を行う強力なツールです。

### 基本的な使い方

```bash
# 文字列置換（最初の一致のみ）
sed 's/old/new/' file.txt

# 全ての一致を置換（g フラグ）
sed 's/old/new/g' file.txt

# ファイルを直接書き換え（-i）
sed -i 's/old/new/g' file.txt

# 特定の行だけ置換
sed '3s/old/new/' file.txt

# 行を削除
sed '5d' file.txt           # 5行目を削除
sed '/pattern/d' file.txt   # パターンに一致する行を削除

# 行を挿入
sed '3i\新しい行' file.txt   # 3行目の前に挿入
```

### 実践例

```bash
# HTMLタグを除去
sed 's/<[^>]*>//g' page.html

# 空行を削除
sed '/^$/d' file.txt

# 設定ファイルのコメント行を除去
sed '/^#/d' config.conf

# 複数の置換を連続実行
sed -e 's/foo/bar/g' -e 's/baz/qux/g' file.txt
```

---

## awk -- テキスト処理言語

`awk` はパターンマッチとテキスト処理のための言語です。`sed` より高機能です。

### 基本的な使い方

```bash
# 特定の列を表示（スペース区切り）
awk '{print $1}' file.txt       # 1列目
awk '{print $1, $3}' file.txt   # 1列目と3列目

# 区切り文字を指定（-F）
awk -F',' '{print $2}' data.csv

# 条件でフィルタ
awk '$3 > 100 {print $1, $3}' data.txt

# 行番号を表示
awk '{print NR, $0}' file.txt
```

### 実践例

```bash
# CSVの合計を計算
awk -F',' '{sum += $3} END {print "Total:", sum}' sales.csv

# 特定のパターンに一致する行の列を表示
awk '/ERROR/ {print $1, $2, $NF}' app.log

# 列の平均を計算
awk '{sum += $1; count++} END {print "Average:", sum/count}' scores.txt

# フィールド数が異なる行を検出
awk -F',' 'NF != 5 {print NR": "NF" fields - "$0}' data.csv
```

### awk の組み込み変数

| 変数 | 意味 |
|------|------|
| `$0` | 行全体 |
| `$1`, `$2`... | N番目のフィールド |
| `NR` | 現在の行番号 |
| `NF` | 現在の行のフィールド数 |
| `$NF` | 最後のフィールド |
| `FS` | フィールドセパレータ |

---

## xargs -- 引数を組み立てる

`xargs` は標準入力を受け取り、別のコマンドの引数として渡します。

### 基本的な使い方

```bash
# find の結果を rm に渡す
find . -name "*.tmp" | xargs rm

# 安全な実行（ファイル名にスペースがある場合）
find . -name "*.tmp" -print0 | xargs -0 rm

# 1つずつ処理（-I で置換文字列を指定）
find . -name "*.txt" | xargs -I {} cp {} {}.bak

# 並列実行（-P で並列数を指定）
find . -name "*.jpg" | xargs -P 4 -I {} convert {} -resize 50% resized_{}
```

### 実践例

```bash
# 特定のパターンを含むファイルを一括置換
grep -rl "old_api" src/ | xargs sed -i 's/old_api/new_api/g'

# Git で変更されたファイルだけ lint を実行
git diff --name-only | grep '\.js$' | xargs eslint

# ファイルリストからまとめて処理
cat urls.txt | xargs -I {} curl -s {} -o /dev/null -w "%{http_code} {}\n"
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| sort/uniq | データの並べ替えと重複処理 |
| cut/tr | 列の切り出しと文字変換 |
| tee | 出力の分岐（画面+ファイル） |
| sed | ストリームベースの検索・置換 |
| awk | 列指向のテキスト処理言語 |
| xargs | 標準入力を引数に変換 |

### チェックリスト

- [ ] sort と uniq を組み合わせてデータを集計できる
- [ ] cut で CSV から特定列を取り出せる
- [ ] sed で文字列の置換ができる
- [ ] awk で列を指定した処理ができる
- [ ] xargs で find の結果を別コマンドに渡せる

---

## 次のステップへ

上級コマンドの武器庫が揃いましたね。

次のセクションでは、これらのコマンドを「パイプ」で繋いで、複雑なデータ処理を一気に行う方法を学びます。
パイプこそが、Unixの真の力を引き出す鍵です。

---

*推定読了時間: 25分*
