# 実践的なスクリプト例

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 2
subStep: 4
title: "実践的なスクリプト例"
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

> 「そろそろ実践だ」佐藤先輩がキーボードを叩く。
>
> 「ここまで学んだ変数、制御構文、関数、エラー処理を組み合わせて、
> 現場で実際に使うスクリプトを見てみよう」
>
> 「どんなスクリプトを書くんですか？」
>
> 「3つだ。ログ解析、バックアップ、そしてプロジェクトのセットアップ。
> この3つが書ければ、チームの役に立てるスクリプトはいくらでも書ける」

---

## 実例1: ログ解析スクリプト

サーバーのアクセスログを解析し、レポートを生成するスクリプトです。

```bash
#!/usr/bin/env bash
#
# log_analyzer.sh - アクセスログ解析スクリプト
# 使い方: ./log_analyzer.sh <logfile> [--top N]
#
set -euo pipefail

# === デフォルト設定 ===
TOP_N=10
LOG_FILE=""

# === 関数 ===
usage() {
    echo "使い方: $0 <logfile> [--top N]"
    echo ""
    echo "オプション:"
    echo "  --top N    上位N件を表示 (デフォルト: 10)"
    exit 1
}

log_info() {
    echo "[INFO] $*"
}

log_error() {
    echo "[ERROR] $*" >&2
}

# === 引数解析 ===
while [ $# -gt 0 ]; do
    case "$1" in
        --top)
            TOP_N="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            LOG_FILE="$1"
            shift
            ;;
    esac
done

if [ -z "$LOG_FILE" ]; then
    log_error "ログファイルが指定されていません"
    usage
fi

if [ ! -f "$LOG_FILE" ]; then
    log_error "ファイルが見つかりません: $LOG_FILE"
    exit 1
fi

# === 解析処理 ===
log_info "ログファイル: $LOG_FILE"
log_info "解析を開始します..."

total_lines=$(wc -l < "$LOG_FILE")
log_info "総リクエスト数: $total_lines"

echo ""
echo "=== ステータスコード別集計 ==="
awk '{print $9}' "$LOG_FILE" | sort | uniq -c | sort -rn

echo ""
echo "=== アクセス元 IP Top $TOP_N ==="
awk '{print $1}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -"$TOP_N"

echo ""
echo "=== リクエスト先 URL Top $TOP_N ==="
awk '{print $7}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -"$TOP_N"

echo ""
echo "=== 時間帯別アクセス数 ==="
awk -F'[' '{print $2}' "$LOG_FILE" \
    | awk -F: '{print $2":00"}' \
    | sort | uniq -c | sort -k2

log_info "解析完了"
```

### 使い方

```bash
chmod +x log_analyzer.sh
./log_analyzer.sh access.log --top 5
```

---

## 実例2: バックアップスクリプト

指定されたディレクトリのバックアップを作成し、古いバックアップを自動削除するスクリプトです。

```bash
#!/usr/bin/env bash
#
# backup.sh - ディレクトリバックアップスクリプト
# 使い方: ./backup.sh <source_dir> <backup_dir> [--keep N]
#
set -euo pipefail

# === デフォルト設定 ===
KEEP_DAYS=7
SOURCE_DIR=""
BACKUP_DIR=""
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# === 関数 ===
usage() {
    echo "使い方: $0 <source_dir> <backup_dir> [--keep N]"
    echo ""
    echo "オプション:"
    echo "  --keep N   N日以上古いバックアップを削除 (デフォルト: 7)"
    exit 1
}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

cleanup_old_backups() {
    local backup_dir="$1"
    local keep_days="$2"

    log "古いバックアップを削除中 (${keep_days}日以上前)..."

    local count
    count=$(find "$backup_dir" -name "backup_*.tar.gz" -mtime +"$keep_days" | wc -l)

    if [ "$count" -gt 0 ]; then
        find "$backup_dir" -name "backup_*.tar.gz" -mtime +"$keep_days" -delete
        log "${count}件の古いバックアップを削除しました"
    else
        log "削除対象のバックアップはありません"
    fi
}

# === 引数解析 ===
while [ $# -gt 0 ]; do
    case "$1" in
        --keep)
            KEEP_DAYS="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            if [ -z "$SOURCE_DIR" ]; then
                SOURCE_DIR="$1"
            elif [ -z "$BACKUP_DIR" ]; then
                BACKUP_DIR="$1"
            fi
            shift
            ;;
    esac
done

# === 検証 ===
if [ -z "$SOURCE_DIR" ] || [ -z "$BACKUP_DIR" ]; then
    usage
fi

if [ ! -d "$SOURCE_DIR" ]; then
    log "エラー: ソースディレクトリが見つかりません: $SOURCE_DIR"
    exit 1
fi

# === メイン処理 ===
mkdir -p "$BACKUP_DIR"

BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz"

log "バックアップ開始"
log "  ソース: $SOURCE_DIR"
log "  出力先: $BACKUP_FILE"

# tarで圧縮バックアップ
tar -czf "$BACKUP_FILE" -C "$(dirname "$SOURCE_DIR")" "$(basename "$SOURCE_DIR")"

# バックアップサイズを確認
BACKUP_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
log "バックアップ完了: $BACKUP_SIZE"

# 古いバックアップの削除
cleanup_old_backups "$BACKUP_DIR" "$KEEP_DAYS"

log "全ての処理が完了しました"
```

### 使い方

```bash
chmod +x backup.sh
./backup.sh ~/projects/my-app ~/backups --keep 14
```

---

## 実例3: プロジェクトセットアップスクリプト

新しいWebプロジェクトの雛形を一発で作成するスクリプトです。

```bash
#!/usr/bin/env bash
#
# setup-project.sh - プロジェクトセットアップスクリプト
# 使い方: ./setup-project.sh <project-name> [--type react|vanilla]
#
set -euo pipefail

# === デフォルト設定 ===
PROJECT_NAME=""
PROJECT_TYPE="vanilla"

# === 関数 ===
usage() {
    echo "使い方: $0 <project-name> [--type react|vanilla]"
    exit 1
}

log() {
    echo "[SETUP] $*"
}

create_directory_structure() {
    local project="$1"

    log "ディレクトリ構造を作成中..."
    mkdir -p "$project"/{src/{css,js,images},public,docs,tests}

    log "  src/css/"
    log "  src/js/"
    log "  src/images/"
    log "  public/"
    log "  docs/"
    log "  tests/"
}

create_gitignore() {
    local project="$1"

    cat > "$project/.gitignore" << 'EOF'
# Dependencies
node_modules/
vendor/

# Build output
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/
EOF
    log ".gitignore を作成しました"
}

create_readme() {
    local project="$1"

    cat > "$project/README.md" << EOF
# ${project}

## 概要

プロジェクトの説明をここに記述。

## セットアップ

\`\`\`bash
git clone <repository-url>
cd ${project}
# 依存関係のインストール手順
\`\`\`

## 開発

\`\`\`bash
# 開発サーバーの起動手順
\`\`\`

## ディレクトリ構造

\`\`\`
${project}/
├── src/
│   ├── css/
│   ├── js/
│   └── images/
├── public/
├── docs/
└── tests/
\`\`\`
EOF
    log "README.md を作成しました"
}

init_git() {
    local project="$1"

    cd "$project"
    git init
    git add .
    git commit -m "Initial commit: project setup"
    cd ..

    log "Gitリポジトリを初期化しました"
}

# === 引数解析 ===
while [ $# -gt 0 ]; do
    case "$1" in
        --type)
            PROJECT_TYPE="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            PROJECT_NAME="$1"
            shift
            ;;
    esac
done

if [ -z "$PROJECT_NAME" ]; then
    usage
fi

if [ -d "$PROJECT_NAME" ]; then
    log "エラー: ディレクトリが既に存在します: $PROJECT_NAME"
    exit 1
fi

# === メイン処理 ===
log "プロジェクト「$PROJECT_NAME」を作成します（タイプ: $PROJECT_TYPE）"

create_directory_structure "$PROJECT_NAME"
create_gitignore "$PROJECT_NAME"
create_readme "$PROJECT_NAME"
init_git "$PROJECT_NAME"

log ""
log "セットアップ完了！"
log "次のステップ:"
log "  cd $PROJECT_NAME"
log "  # 開発を開始しましょう"
```

---

## スクリプトのテスト方法

### bash -x でデバッグ

```bash
# 実行されるコマンドを1行ずつ表示しながら実行
bash -x ./setup-project.sh my-app

# スクリプト内に部分的に設定することも可能
set -x   # デバッグ開始
# ... 処理 ...
set +x   # デバッグ終了
```

### ShellCheck -- 静的解析ツール

```bash
# インストール
sudo apt install shellcheck    # Ubuntu/Debian
brew install shellcheck        # macOS

# スクリプトをチェック
shellcheck backup.sh
```

ShellCheck はスクリプトの潜在的なバグや非推奨な書き方を検出してくれる優れたツールです。

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ログ解析 | awk + sort + uniq でログデータを集計 |
| バックアップ | tar + find で作成・世代管理 |
| セットアップ | mkdir + cat + git で環境を自動構築 |
| デバッグ | `bash -x` で実行トレース |
| 静的解析 | ShellCheck で品質向上 |

### チェックリスト

- [ ] 引数解析付きのスクリプトを理解できる
- [ ] ログ出力関数のパターンを把握した
- [ ] tar でバックアップを作成する方法を知った
- [ ] bash -x でデバッグする方法を知った
- [ ] ShellCheck の存在を認識した

---

## 次のステップへ

実践的なスクリプトの例を学びました。パターンを理解すれば、応用は無限大です。

次のセクションでは、いよいよ自分の手で自動化スクリプトを書く演習に挑戦します。
ここまでの全ての知識を総動員して、実用的なスクリプトを完成させましょう。

---

*推定読了時間: 30分*
