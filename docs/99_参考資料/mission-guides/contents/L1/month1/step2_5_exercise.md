# 演習：自動化スクリプトを書こう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 2
subStep: 5
title: "演習：自動化スクリプトを書こう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "OS"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「さあ、ここからは実際に手を動かす時間だ」佐藤先輩がストップウォッチを取り出した。
>
> 「8つのミッションを用意した。簡単なものから始めて、最後は実務レベルのスクリプトだ」
>
> 「90分で全部できますか？」
>
> 「それは君次第だ。分からなくなったらヒントを見てもいい。
> でもまずは自分の頭で考えてみろ。それが力になる」

---

## ミッション概要

8つのミッションで段階的にスクリプト力を鍛えます。

| ミッション | テーマ | 難易度 |
|-----------|--------|--------|
| Mission 1 | 挨拶スクリプト | 初級 |
| Mission 2 | ファイルカウンター | 初級 |
| Mission 3 | FizzBuzz | 初級 |
| Mission 4 | ファイル整理スクリプト | 中級 |
| Mission 5 | システム情報レポート | 中級 |
| Mission 6 | CSVデータ処理 | 中級 |
| Mission 7 | ディレクトリ監視スクリプト | 上級 |
| Mission 8 | デプロイ自動化スクリプト | 上級 |

---

## Mission 1: 挨拶スクリプト（5分）

名前と時刻に応じて挨拶を変えるスクリプトを作成してください。

### 要件

- 引数で名前を受け取る
- 時刻によって挨拶を変える（5-11時: おはよう, 12-17時: こんにちは, 18-4時: こんばんは）
- 引数がない場合はエラーメッセージと使い方を表示

### 期待される動作

```bash
./greet.sh 田中
# こんにちは、田中さん！ (2025-01-15 14:30)
```

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
    echo "使い方: $0 <名前>" >&2
    exit 1
fi

name="$1"
hour=$(date +%H)

if [ "$hour" -ge 5 ] && [ "$hour" -le 11 ]; then
    greeting="おはようございます"
elif [ "$hour" -ge 12 ] && [ "$hour" -le 17 ]; then
    greeting="こんにちは"
else
    greeting="こんばんは"
fi

echo "${greeting}、${name}さん！ ($(date '+%Y-%m-%d %H:%M'))"
```

</details>

---

## Mission 2: ファイルカウンター（10分）

指定ディレクトリ内のファイルを種類別にカウントするスクリプトを作成してください。

### 要件

- 引数でディレクトリを受け取る（デフォルトはカレントディレクトリ）
- ファイル種類（拡張子）ごとのカウントを表示
- 合計ファイル数も表示

### 期待される出力

```
=== ファイル種類別カウント: ./src ===
  12 .js
   8 .css
   3 .html
   2 .json
----
合計: 25 ファイル
```

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

target_dir="${1:-.}"

if [ ! -d "$target_dir" ]; then
    echo "エラー: ディレクトリが見つかりません: $target_dir" >&2
    exit 1
fi

echo "=== ファイル種類別カウント: $target_dir ==="

find "$target_dir" -type f | sed 's/.*\./\./' | sort | uniq -c | sort -rn

total=$(find "$target_dir" -type f | wc -l)
echo "----"
echo "合計: $total ファイル"
```

</details>

---

## Mission 3: FizzBuzz（10分）

1からNまでの数値でFizzBuzzを実行するスクリプトを作成してください。

### 要件

- 引数で上限値Nを受け取る（デフォルト: 30）
- 3の倍数: "Fizz", 5の倍数: "Buzz", 15の倍数: "FizzBuzz", それ以外: 数値
- 関数として実装すること

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

fizzbuzz() {
    local n="$1"

    for ((i=1; i<=n; i++)); do
        if [ $((i % 15)) -eq 0 ]; then
            echo "FizzBuzz"
        elif [ $((i % 3)) -eq 0 ]; then
            echo "Fizz"
        elif [ $((i % 5)) -eq 0 ]; then
            echo "Buzz"
        else
            echo "$i"
        fi
    done
}

limit="${1:-30}"
fizzbuzz "$limit"
```

</details>

---

## Mission 4: ファイル整理スクリプト（15分）

散らかったダウンロードフォルダを拡張子別に整理するスクリプトを作成してください。

### 要件

- 引数で対象ディレクトリを受け取る
- 拡張子ごとにサブディレクトリを作成してファイルを移動
- 移動前に確認メッセージを表示（`--dry-run` オプションで実行せずに表示だけ）
- 移動結果のサマリーを表示

### 期待される動作

```bash
./organize.sh ~/Downloads --dry-run
# [DRY RUN] report.pdf → pdf/report.pdf
# [DRY RUN] photo.jpg → jpg/photo.jpg
# ...

./organize.sh ~/Downloads
# report.pdf → pdf/report.pdf
# photo.jpg → jpg/photo.jpg
# 整理完了: 15ファイルを移動しました
```

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=false
TARGET_DIR=""

usage() {
    echo "使い方: $0 <directory> [--dry-run]"
    exit 1
}

while [ $# -gt 0 ]; do
    case "$1" in
        --dry-run) DRY_RUN=true; shift ;;
        -h|--help) usage ;;
        *) TARGET_DIR="$1"; shift ;;
    esac
done

if [ -z "$TARGET_DIR" ] || [ ! -d "$TARGET_DIR" ]; then
    echo "エラー: 有効なディレクトリを指定してください" >&2
    usage
fi

count=0

for file in "$TARGET_DIR"/*; do
    [ -f "$file" ] || continue

    filename=$(basename "$file")
    extension="${filename##*.}"

    if [ "$filename" = "$extension" ]; then
        extension="no_extension"
    fi

    extension=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
    dest_dir="${TARGET_DIR}/${extension}"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] $filename → ${extension}/$filename"
    else
        mkdir -p "$dest_dir"
        mv "$file" "${dest_dir}/${filename}"
        echo "$filename → ${extension}/$filename"
    fi
    ((count++))
done

if [ "$DRY_RUN" = true ]; then
    echo "---"
    echo "[DRY RUN] ${count}ファイルが対象です"
else
    echo "---"
    echo "整理完了: ${count}ファイルを移動しました"
fi
```

</details>

---

## Mission 5: システム情報レポート（10分）

システムの状態をまとめたレポートを生成するスクリプトを作成してください。

### 要件

- ホスト名、OS、カーネルバージョン
- CPU・メモリの使用状況
- ディスク使用量
- ネットワーク情報
- レポートをファイルに保存するオプション（`-o filename`）

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

OUTPUT_FILE=""

while [ $# -gt 0 ]; do
    case "$1" in
        -o) OUTPUT_FILE="$2"; shift 2 ;;
        *) shift ;;
    esac
done

generate_report() {
    echo "================================="
    echo " システム情報レポート"
    echo " 生成日時: $(date)"
    echo "================================="

    echo ""
    echo "--- ホスト情報 ---"
    echo "ホスト名: $(hostname)"
    echo "OS: $(uname -s)"
    echo "カーネル: $(uname -r)"
    echo "アーキテクチャ: $(uname -m)"

    echo ""
    echo "--- CPU情報 ---"
    if [ -f /proc/cpuinfo ]; then
        grep "model name" /proc/cpuinfo | head -1 | cut -d: -f2 | xargs echo "CPU:"
        echo "コア数: $(nproc)"
    fi

    echo ""
    echo "--- メモリ情報 ---"
    free -h 2>/dev/null || vm_stat 2>/dev/null || echo "情報を取得できません"

    echo ""
    echo "--- ディスク使用量 ---"
    df -h | grep -E "^(/dev|Filesystem)"

    echo ""
    echo "--- ネットワーク ---"
    hostname -I 2>/dev/null || ifconfig | grep "inet " | grep -v "127.0.0.1" || echo "情報を取得できません"

    echo ""
    echo "================================="
    echo " レポート終了"
    echo "================================="
}

if [ -n "$OUTPUT_FILE" ]; then
    generate_report > "$OUTPUT_FILE"
    echo "レポートを保存しました: $OUTPUT_FILE"
else
    generate_report
fi
```

</details>

---

## Mission 6: CSVデータ処理（15分）

売上データCSVを読み込み、集計レポートを出力するスクリプトを作成してください。

### サンプルCSV（sales.csv）

```csv
date,product,quantity,price
2025-01-01,Widget A,10,1500
2025-01-01,Widget B,5,2000
2025-01-02,Widget A,8,1500
2025-01-02,Widget C,3,3000
2025-01-03,Widget B,12,2000
```

### 要件

- 商品別の合計売上額を計算
- 日別の売上合計を表示
- 全体の合計売上を表示

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

CSV_FILE="${1:-sales.csv}"

if [ ! -f "$CSV_FILE" ]; then
    echo "エラー: ファイルが見つかりません: $CSV_FILE" >&2
    exit 1
fi

echo "=== 売上データ分析: $CSV_FILE ==="

echo ""
echo "--- 商品別合計売上 ---"
tail -n +2 "$CSV_FILE" | awk -F',' '{
    total = $3 * $4
    products[$2] += total
}
END {
    for (p in products) {
        printf "  %-15s %10d 円\n", p, products[p]
    }
}'

echo ""
echo "--- 日別合計売上 ---"
tail -n +2 "$CSV_FILE" | awk -F',' '{
    total = $3 * $4
    dates[$1] += total
}
END {
    for (d in dates) {
        printf "  %s  %10d 円\n", d, dates[d]
    }
}' | sort

echo ""
echo "--- 全体合計 ---"
total=$(tail -n +2 "$CSV_FILE" | awk -F',' '{sum += $3 * $4} END {print sum}')
echo "  合計売上: ${total} 円"
```

</details>

---

## Mission 7: ディレクトリ監視スクリプト（10分）

ディレクトリ内のファイル変更を検出するスクリプトを作成してください。

### 要件

- 指定ディレクトリを定期的に監視（デフォルト5秒間隔）
- 新しいファイルの追加を検出してログに記録
- Ctrl+C で停止するまで動作を続ける
- クリーンアップ処理（trap）を実装

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

WATCH_DIR="${1:-.}"
INTERVAL="${2:-5}"
STATE_FILE=$(mktemp)

cleanup() {
    rm -f "$STATE_FILE"
    echo ""
    echo "監視を終了しました"
}
trap cleanup EXIT

echo "ディレクトリ監視: $WATCH_DIR (間隔: ${INTERVAL}秒)"
echo "停止するには Ctrl+C を押してください"
echo "---"

# 初期状態を記録
find "$WATCH_DIR" -maxdepth 1 -type f | sort > "$STATE_FILE"

while true; do
    sleep "$INTERVAL"

    CURRENT_STATE=$(mktemp)
    find "$WATCH_DIR" -maxdepth 1 -type f | sort > "$CURRENT_STATE"

    # 新規ファイル
    new_files=$(comm -13 "$STATE_FILE" "$CURRENT_STATE")
    if [ -n "$new_files" ]; then
        while IFS= read -r f; do
            echo "[$(date '+%H:%M:%S')] 新規: $f"
        done <<< "$new_files"
    fi

    # 削除されたファイル
    removed_files=$(comm -23 "$STATE_FILE" "$CURRENT_STATE")
    if [ -n "$removed_files" ]; then
        while IFS= read -r f; do
            echo "[$(date '+%H:%M:%S')] 削除: $f"
        done <<< "$removed_files"
    fi

    mv "$CURRENT_STATE" "$STATE_FILE"
done
```

</details>

---

## Mission 8: デプロイ自動化スクリプト（15分）

プロジェクトのビルドとデプロイを自動化するスクリプトを作成してください。

### 要件

- 環境（production/staging/development）を引数で指定
- ビルド前のテスト実行（テスト失敗でデプロイ中止）
- ビルド成果物の作成
- デプロイ先の表示（実際のデプロイはシミュレーション）
- 全工程のログ記録
- エラー時のロールバック処理

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

# === 設定 ===
ENVIRONMENT=""
LOG_FILE="/tmp/deploy_$(date +%Y%m%d_%H%M%S).log"
BUILD_DIR="./dist"

# === 関数 ===
usage() {
    echo "使い方: $0 <production|staging|development>"
    exit 1
}

log() {
    local level="$1"
    shift
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*"
    echo "$message" | tee -a "$LOG_FILE"
}

rollback() {
    log "WARN" "ロールバックを実行中..."
    rm -rf "$BUILD_DIR"
    log "WARN" "ロールバック完了"
}

run_tests() {
    log "INFO" "テストを実行中..."
    # テスト実行のシミュレーション
    sleep 1
    log "INFO" "テスト完了: 全テスト合格"
    return 0
}

build() {
    log "INFO" "ビルドを実行中..."
    mkdir -p "$BUILD_DIR"
    echo "<!DOCTYPE html><html><body>Built at $(date)</body></html>" > "$BUILD_DIR/index.html"
    sleep 1
    log "INFO" "ビルド完了: $BUILD_DIR"
}

deploy() {
    local env="$1"
    local server=""

    case "$env" in
        production) server="prod-server.example.com" ;;
        staging)    server="stg-server.example.com" ;;
        development) server="localhost:3000" ;;
    esac

    log "INFO" "デプロイ先: $server"
    log "INFO" "デプロイ中..."
    sleep 1
    log "INFO" "デプロイ完了"
}

# === 引数解析 ===
if [ $# -lt 1 ]; then
    usage
fi

ENVIRONMENT="$1"

case "$ENVIRONMENT" in
    production|staging|development) ;;
    *) log "ERROR" "無効な環境: $ENVIRONMENT"; usage ;;
esac

# === エラー時のロールバック ===
trap rollback ERR

# === メイン処理 ===
log "INFO" "===== デプロイ開始: $ENVIRONMENT ====="

if [ "$ENVIRONMENT" = "production" ]; then
    log "WARN" "本番環境へのデプロイです。続行しますか？ (y/N)"
    read -r confirm
    if [ "$confirm" != "y" ]; then
        log "INFO" "デプロイをキャンセルしました"
        exit 0
    fi
fi

run_tests
build
deploy "$ENVIRONMENT"

log "INFO" "===== デプロイ完了 ====="
log "INFO" "ログファイル: $LOG_FILE"
```

</details>

---

## 達成度チェック

| ミッション | テーマ | 完了 |
|-----------|--------|------|
| Mission 1 | 挨拶スクリプト | [ ] |
| Mission 2 | ファイルカウンター | [ ] |
| Mission 3 | FizzBuzz | [ ] |
| Mission 4 | ファイル整理 | [ ] |
| Mission 5 | システム情報レポート | [ ] |
| Mission 6 | CSVデータ処理 | [ ] |
| Mission 7 | ディレクトリ監視 | [ ] |
| Mission 8 | デプロイ自動化 | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| スクリプト設計 | 引数解析、検証、メイン処理の3段階構成 |
| エラー処理 | set -euo pipefail + trap で安全に |
| ログ | 日時付きログ関数で追跡可能に |
| テスト | bash -x と dry-run モードで安全確認 |

### チェックリスト

- [ ] 引数を受け取るスクリプトを書ける
- [ ] ファイル操作の自動化ができる
- [ ] awkを使ったデータ処理ができる
- [ ] trap でクリーンアップ処理を実装できる
- [ ] 実務レベルのデプロイスクリプトの構造を理解した

---

## 次のステップへ

お疲れさまでした。8つのミッションを通じて、実践的なスクリプトの書き方が身についたはずです。

次のセクションでは、Step 2の理解度チェックです。
シェルスクリプトの知識を確認しましょう。

---

*推定所要時間: 90分*
