# パイプとリダイレクトをマスターしよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 1
subStep: 3
title: "パイプとリダイレクトをマスターしよう"
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

> 佐藤先輩がホワイトボードに図を描き始める。
>
> 「Unixの哲学を知ってるか？」
>
> 「一つのことをうまくやるプログラムを作る... でしたっけ」
>
> 「そうだ。そしてそれらを**繋げる**仕組みがパイプだ。
> 小さなコマンドをパイプで繋げれば、どんな複雑な処理でも実現できる」
>
> 「レゴブロックみたいなものですか？」
>
> 「いい例えだ。今日はそのブロックの繋げ方を徹底的に学ぼう」

---

## パイプ（|）の基本

パイプ `|` は、あるコマンドの**標準出力**を次のコマンドの**標準入力**に接続します。

### 基本形

```bash
コマンド1 | コマンド2 | コマンド3
```

前のコマンドの出力が、次のコマンドの入力になります。

### 基本的な例

```bash
# ファイル一覧を行数カウント
ls | wc -l

# ログからエラーを抽出して行数をカウント
cat app.log | grep "ERROR" | wc -l

# プロセス一覧から特定のプロセスを検索
ps aux | grep "node"

# ファイル一覧をソートして表示
ls -la | sort -k5 -rn | head -10
```

### パイプチェーンの実践例

```bash
# アクセスログの解析：IPアドレス別のアクセス数 Top 10
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 処理の流れ:
# 1. cat access.log      → ログ全体を出力
# 2. awk '{print $1}'    → 1列目（IPアドレス）を抽出
# 3. sort                → アルファベット順にソート
# 4. uniq -c             → 連続する重複をカウント
# 5. sort -rn            → カウント数で降順ソート
# 6. head -10            → 上位10件を表示
```

---

## リダイレクト -- 入出力の制御

### 標準入力・標準出力・標準エラー出力

プログラムには3つの入出力チャネルがあります：

| チャネル | 番号 | デフォルト先 | 記号 |
|---------|------|-------------|------|
| 標準入力（stdin） | 0 | キーボード | `<` |
| 標準出力（stdout） | 1 | 画面 | `>`, `>>` |
| 標準エラー出力（stderr） | 2 | 画面 | `2>`, `2>>` |

### 出力リダイレクト

```bash
# 標準出力をファイルに書き込み（上書き）
ls -la > file_list.txt

# 標準出力をファイルに追記
echo "new entry" >> log.txt

# 標準エラー出力をファイルに書き込み
find / -name "*.conf" 2> errors.txt

# 標準出力と標準エラー出力を別々のファイルに
command > output.txt 2> errors.txt

# 標準出力と標準エラー出力を同じファイルに
command > all.txt 2>&1
# または（bash 4+）
command &> all.txt
```

### 入力リダイレクト

```bash
# ファイルを標準入力として渡す
sort < names.txt

# ヒアドキュメント（複数行をコマンドに渡す）
cat << 'EOF'
1行目
2行目
3行目
EOF

# ヒアストリング（1行をコマンドに渡す）
grep "pattern" <<< "search in this string"
```

---

## /dev/null -- 出力の破棄

`/dev/null` は「ブラックホール」のような特殊ファイルで、書き込まれたデータを全て捨てます。

```bash
# エラー出力を捨てる（正常出力だけ見たい）
find / -name "*.log" 2>/dev/null

# すべての出力を捨てる（実行だけしたい）
command > /dev/null 2>&1

# コマンドの成否だけ確認
if grep -q "pattern" file.txt 2>/dev/null; then
    echo "found"
fi
```

---

## コマンドの連結（&&, ||, ;）

### `&&`（AND）-- 成功したら次を実行

```bash
# コンパイル成功したらテスト実行
make && make test

# ディレクトリ作成してから移動
mkdir -p project && cd project

# 複数の前提条件
npm install && npm run build && npm run deploy
```

### `||`（OR）-- 失敗したら次を実行

```bash
# ディレクトリがなければ作成
cd project || mkdir project

# コマンドが失敗した場合のフォールバック
which python3 || which python

# エラーメッセージを表示
rm important_file || echo "削除に失敗しました"
```

### `;`（セミコロン）-- 成否に関わらず順番に実行

```bash
# 順番に実行（前のコマンドの結果に関係なく）
echo "start"; sleep 2; echo "done"

# クリーンアップ処理
cd /tmp; rm -f *.tmp; echo "cleaned"
```

### 組み合わせパターン

```bash
# プロジェクトのセットアップ
mkdir -p my-project && cd my-project && git init || echo "セットアップに失敗"

# ビルドパイプライン
npm run lint && npm run test && npm run build || echo "ビルド失敗"
```

---

## 実践的なパイプライン

### 例1: サーバーログの解析

```bash
# 今日のエラーログをステータスコード別に集計
grep "$(date +%Y-%m-%d)" access.log \
  | awk '{print $9}' \
  | sort \
  | uniq -c \
  | sort -rn
```

### 例2: ディスク使用量の調査

```bash
# 1GB以上のファイルを検出
find / -type f -size +1G 2>/dev/null \
  | xargs -I {} du -sh {} \
  | sort -rh
```

### 例3: コードの統計

```bash
# プロジェクト内のJavaScriptファイルの行数Top 10
find src/ -name "*.js" \
  | xargs wc -l \
  | sort -rn \
  | head -10
```

### 例4: Git の変更統計

```bash
# 各著者のコミット数を集計
git log --format='%an' \
  | sort \
  | uniq -c \
  | sort -rn
```

---

## パイプラインのデバッグ

パイプラインが期待通りに動かないとき、途中経過を確認する方法があります。

### tee で途中経過を保存

```bash
# 途中結果を step1.txt, step2.txt に保存しつつ最終結果も得る
cat data.txt \
  | sort | tee step1_sorted.txt \
  | uniq -c | tee step2_counted.txt \
  | sort -rn | head -5
```

### 段階的に構築

```bash
# まず1段階目を確認
cat data.txt | awk '{print $1}'

# OKなら次を追加
cat data.txt | awk '{print $1}' | sort

# さらに追加
cat data.txt | awk '{print $1}' | sort | uniq -c

# 完成
cat data.txt | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| パイプ `\|` | コマンドの出力を次のコマンドの入力に接続 |
| `>` / `>>` | 出力をファイルに書き込み / 追記 |
| `2>` / `2>&1` | エラー出力のリダイレクト |
| `/dev/null` | 出力を破棄する特殊ファイル |
| `&&` | 前のコマンドが成功したら次を実行 |
| `\|\|` | 前のコマンドが失敗したら次を実行 |
| `;` | 成否に関係なく順番に実行 |

### チェックリスト

- [ ] パイプで3つ以上のコマンドを連結できる
- [ ] 標準出力と標準エラー出力を別々にリダイレクトできる
- [ ] /dev/null を使ってエラーメッセージを抑制できる
- [ ] &&, ||, ; の違いを説明できる
- [ ] 実践的なワンライナーを書ける

---

## 次のステップへ

パイプとリダイレクトをマスターしましたね。これであなたのコマンドは「点」から「線」に進化しました。

次のセクションでは、ターミナルで動いているプログラム（プロセス）の管理方法を学びます。
開発サーバーの起動、バックグラウンド実行、プロセスの停止 -- 開発業務の日常に欠かせない知識です。

---

*推定読了時間: 25分*
