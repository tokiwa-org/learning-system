# 変数と制御構文

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 2
subStep: 2
title: "変数と制御構文"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "OS"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「スクリプトの基本は覚えたな。でもまだ"順番に実行するだけ"の状態だ」
>
> 佐藤先輩がホワイトボードにフローチャートを描き始めた。
>
> 「実務では"条件によって処理を変える""繰り返す"ことが必須になる。
> 例えば、テスト環境と本番環境で違うコマンドを実行するとか、
> 複数のサーバーに順番にデプロイするとか」
>
> 「if文やfor文ですね」
>
> 「その通り。プログラミングの基本だが、シェルスクリプトでは書き方に癖がある。しっかり覚えよう」

---

## 変数

### 変数の定義と参照

```bash
#!/usr/bin/env bash

# 変数の定義（= の前後にスペースを入れない！）
name="Tanaka"
age=25
project_dir="/home/tanaka/project"

# 変数の参照
echo "名前: $name"
echo "年齢: ${age}歳"       # {} で変数名を明確にする
echo "パス: ${project_dir}"
```

> **注意**: `name = "Tanaka"` のように `=` の前後にスペースを入れるとエラーになります。
> これはシェルスクリプトの特有の仕様です。

### クォートの違い

```bash
name="World"

# ダブルクォート: 変数が展開される
echo "Hello, $name"     # Hello, World

# シングルクォート: 変数が展開されない（文字列そのまま）
echo 'Hello, $name'     # Hello, $name

# バッククォート / $(): コマンドの実行結果を代入
today=$(date +%Y-%m-%d)
echo "今日: $today"

files=$(ls | wc -l)
echo "ファイル数: $files"
```

### 特殊変数

| 変数 | 意味 | 例 |
|------|------|-----|
| `$0` | スクリプト名 | `./deploy.sh` |
| `$1`, `$2`... | 引数（1番目、2番目...） | |
| `$#` | 引数の数 | `3` |
| `$@` | 全ての引数（個別） | |
| `$*` | 全ての引数（まとめて） | |
| `$?` | 直前のコマンドの終了コード | `0` |
| `$$` | 現在のプロセスID | `12345` |
| `$!` | 直前のバックグラウンドプロセスのPID | |

### コマンドライン引数

```bash
#!/usr/bin/env bash
# greet.sh - 挨拶スクリプト
# 使い方: ./greet.sh <名前> <メッセージ>

echo "スクリプト名: $0"
echo "引数の数: $#"
echo "第1引数: $1"
echo "第2引数: $2"
echo "全引数: $@"

# 使用例: ./greet.sh Tanaka "おはようございます"
# 出力:
# スクリプト名: ./greet.sh
# 引数の数: 2
# 第1引数: Tanaka
# 第2引数: おはようございます
# 全引数: Tanaka おはようございます
```

---

## 条件分岐（if文）

### 基本構文

```bash
if [ 条件 ]; then
    # 条件がtrueの場合の処理
elif [ 別の条件 ]; then
    # 別の条件がtrueの場合の処理
else
    # どの条件もfalseの場合の処理
fi
```

### 文字列の比較

```bash
#!/usr/bin/env bash

env="production"

if [ "$env" = "production" ]; then
    echo "本番環境です。慎重に操作してください。"
elif [ "$env" = "staging" ]; then
    echo "ステージング環境です。"
else
    echo "開発環境です。"
fi
```

| 演算子 | 意味 | 例 |
|--------|------|-----|
| `=` | 等しい | `[ "$a" = "$b" ]` |
| `!=` | 等しくない | `[ "$a" != "$b" ]` |
| `-z` | 空文字列 | `[ -z "$a" ]` |
| `-n` | 空でない | `[ -n "$a" ]` |

### 数値の比較

```bash
count=5

if [ "$count" -gt 10 ]; then
    echo "10より大きい"
elif [ "$count" -ge 5 ]; then
    echo "5以上"
else
    echo "5未満"
fi
```

| 演算子 | 意味 | 英語由来 |
|--------|------|---------|
| `-eq` | 等しい | equal |
| `-ne` | 等しくない | not equal |
| `-gt` | より大きい | greater than |
| `-ge` | 以上 | greater or equal |
| `-lt` | より小さい | less than |
| `-le` | 以下 | less or equal |

### ファイルの検査

```bash
#!/usr/bin/env bash

config_file="config.json"

if [ -f "$config_file" ]; then
    echo "設定ファイルが存在します"
elif [ -d "$config_file" ]; then
    echo "同名のディレクトリがあります"
else
    echo "設定ファイルが見つかりません"
    exit 1
fi
```

| 演算子 | 意味 |
|--------|------|
| `-f` | 通常ファイルが存在する |
| `-d` | ディレクトリが存在する |
| `-e` | ファイルが存在する（種類問わず） |
| `-r` | 読み取り可能 |
| `-w` | 書き込み可能 |
| `-x` | 実行可能 |
| `-s` | ファイルサイズが0でない |

### [[ ]] -- 拡張条件式

bash では `[[ ]]` が使えます。`[ ]` より安全で高機能です。

```bash
# パターンマッチ
if [[ "$filename" == *.txt ]]; then
    echo "テキストファイルです"
fi

# 正規表現マッチ
if [[ "$email" =~ ^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$ ]]; then
    echo "有効なメールアドレスです"
fi

# AND / OR
if [[ -f "package.json" && -d "node_modules" ]]; then
    echo "Node.jsプロジェクトです"
fi
```

---

## ループ（for文）

### 基本的な for 文

```bash
#!/usr/bin/env bash

# リストのループ
for fruit in apple banana cherry; do
    echo "果物: $fruit"
done

# 数値の範囲
for i in {1..5}; do
    echo "番号: $i"
done

# seq コマンドで範囲指定
for i in $(seq 1 2 10); do  # 1から10まで2刻み
    echo "番号: $i"
done
```

### ファイルに対するループ

```bash
# カレントディレクトリのファイルを処理
for file in *.txt; do
    echo "処理中: $file"
    wc -l "$file"
done

# find と組み合わせ
for file in $(find . -name "*.log" -mtime +30); do
    echo "古いログ: $file"
done
```

### C言語スタイルの for 文

```bash
for ((i=0; i<10; i++)); do
    echo "カウンタ: $i"
done
```

---

## ループ（while文）

### 基本的な while 文

```bash
#!/usr/bin/env bash

count=1
while [ "$count" -le 5 ]; do
    echo "カウント: $count"
    count=$((count + 1))
done
```

### ファイルを1行ずつ読む

```bash
#!/usr/bin/env bash

# ファイルを1行ずつ処理
while IFS= read -r line; do
    echo "行: $line"
done < input.txt

# パイプからの入力
cat servers.txt | while IFS= read -r server; do
    echo "サーバーに接続: $server"
done
```

### 無限ループ

```bash
#!/usr/bin/env bash

# サーバーの死活監視
while true; do
    if curl -s http://localhost:3000 > /dev/null; then
        echo "$(date): サーバーは正常です"
    else
        echo "$(date): サーバーが応答しません！"
    fi
    sleep 60  # 60秒待機
done
```

---

## case 文

```bash
#!/usr/bin/env bash
# deploy.sh - デプロイスクリプト

environment="${1:-development}"

case "$environment" in
    production|prod)
        echo "本番環境にデプロイします"
        server="prod-server.example.com"
        ;;
    staging|stg)
        echo "ステージング環境にデプロイします"
        server="stg-server.example.com"
        ;;
    development|dev)
        echo "開発環境にデプロイします"
        server="localhost"
        ;;
    *)
        echo "エラー: 不明な環境: $environment" >&2
        echo "使い方: $0 [production|staging|development]" >&2
        exit 1
        ;;
esac

echo "対象サーバー: $server"
```

---

## 算術演算

```bash
#!/usr/bin/env bash

a=10
b=3

# $(( )) で算術演算
echo "加算: $((a + b))"     # 13
echo "減算: $((a - b))"     # 7
echo "乗算: $((a * b))"     # 30
echo "除算: $((a / b))"     # 3 （整数除算）
echo "剰余: $((a % b))"     # 1

# インクリメント
count=0
((count++))
echo "count: $count"  # 1
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 変数 | `=` の前後にスペースなし。`$VAR` または `${VAR}` で参照 |
| 引数 | `$1`, `$2`... で取得。`$#` は引数の数 |
| if文 | `[ ]` または `[[ ]]` で条件を記述 |
| for文 | リスト、数値範囲、ファイルに対してループ |
| while文 | 条件が真の間ループ。ファイル読み込みに最適 |
| case文 | 複数の条件分岐をスッキリ記述 |

### チェックリスト

- [ ] 変数の定義と参照ができる
- [ ] コマンドライン引数を使える
- [ ] if文で条件分岐を書ける
- [ ] for/while でループを書ける
- [ ] case文で複数条件の分岐を書ける

---

## 次のステップへ

変数と制御構文を学びました。スクリプトに「頭脳」が備わりましたね。

次のセクションでは、関数とエラー処理を学びます。
コードを再利用可能にし、エラーに強いスクリプトを書く技術です。

---

*推定読了時間: 30分*
