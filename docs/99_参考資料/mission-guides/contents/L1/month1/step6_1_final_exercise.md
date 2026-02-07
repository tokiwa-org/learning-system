# 総合演習：開発環境フルセットアップ

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 6
subStep: 1
title: "総合演習：開発環境フルセットアップ"
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

> 佐藤先輩が最後の課題を出した。
>
> 「ここまでの全てを使って、開発環境をゼロから構築してもらう。
> ターミナルのカスタマイズ、シェルスクリプト、Gitリポジトリ、Webサイト。
> 全てを自分の手で組み上げるんだ」
>
> 「一人で全部やるんですか？」
>
> 「そうだ。これができたら、君は"開発環境の支配者"だ」

---

## 総合演習の概要

5つのパートで、L1 Month 1の全スキルを実践します。

| パート | テーマ | 時間 | 使うスキル |
|--------|--------|------|-----------|
| Part 1 | ターミナルカスタマイズ | 15分 | 環境変数、alias、PATH |
| Part 2 | プロジェクトセットアップスクリプト | 20分 | シェルスクリプト全般 |
| Part 3 | Gitリポジトリ構築 | 15分 | ブランチ戦略、.gitignore、PR template |
| Part 4 | モダンWebサイト | 25分 | CSS Grid、アニメーション、Sass |
| Part 5 | デプロイスクリプト | 15分 | スクリプト、Git連携 |

---

## Part 1: ターミナルカスタマイズ（15分）

### 要件

自分だけの `.bashrc`（または `.zshrc`）カスタマイズファイルを作成してください。

1. 開発用エイリアスを5つ以上定義
2. PATH に `~/bin` を追加
3. 便利な関数を2つ以上定義
4. プロンプトのカスタマイズ（任意）

<details>
<summary>解答</summary>

```bash
# ~/.bashrc_custom（専用ファイルとして作成し、.bashrc から source する）

# === 環境変数 ===
export EDITOR="vim"
export PATH="$HOME/bin:$PATH"
export LANG="ja_JP.UTF-8"

# === エイリアス ===
# 基本操作
alias ll='ls -la --color=auto'
alias la='ls -A --color=auto'
alias ..='cd ..'
alias ...='cd ../..'
alias cls='clear'

# Git
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph --all --decorate'
alias gd='git diff'
alias gco='git checkout'
alias gb='git branch'

# 開発
alias serve='python3 -m http.server 8080'
alias ports='lsof -i -P -n | grep LISTEN'

# 安全
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# === 関数 ===
# ディレクトリ作成して移動
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# 指定ポートを使用しているプロセスを停止
killport() {
    if [ -z "$1" ]; then
        echo "使い方: killport <port>" >&2
        return 1
    fi
    local pid
    pid=$(lsof -ti :"$1")
    if [ -n "$pid" ]; then
        kill -9 "$pid"
        echo "ポート $1 のプロセス (PID: $pid) を停止しました"
    else
        echo "ポート $1 を使用しているプロセスはありません"
    fi
}

# Git のブランチ作成と切り替え
gcb() {
    git checkout -b "$1"
    echo "ブランチ '$1' を作成して切り替えました"
}

# プロジェクト内のTODOコメントを検索
todos() {
    grep -rn "TODO\|FIXME\|HACK\|XXX" "${1:-.}" --include="*.js" --include="*.ts" --include="*.py" --include="*.sh"
}

echo "カスタム設定を読み込みました"
```

</details>

---

## Part 2: プロジェクトセットアップスクリプト（20分）

### 要件

新規Webプロジェクトの環境を自動構築するスクリプト `setup.sh` を作成してください。

1. 引数でプロジェクト名を受け取る
2. ディレクトリ構造を自動生成（src, public, docs, tests, scss）
3. テンプレートファイル（HTML, SCSS, .gitignore, README.md）を自動生成
4. Git リポジトリを初期化
5. エラーハンドリング（引数チェック、ディレクトリ存在チェック）
6. ログ出力
7. `set -euo pipefail` を使用

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
#
# setup.sh - Webプロジェクトセットアップスクリプト
# 使い方: ./setup.sh <project-name>
#
set -euo pipefail

# === 定数 ===
readonly TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# === 関数 ===
usage() {
    echo "使い方: $0 <project-name>"
    echo ""
    echo "新規Webプロジェクトの環境を自動構築します。"
    exit 1
}

log() {
    echo "[$(date '+%H:%M:%S')] $*"
}

error() {
    echo "[ERROR] $*" >&2
    exit 1
}

create_directories() {
    local project="$1"
    log "ディレクトリ構造を作成中..."

    mkdir -p "$project"/{src/{js,images},public,docs,tests,scss/{abstracts,components,layout},css}
}

create_html() {
    local project="$1"
    log "index.html を作成中..."

    cat > "$project/public/index.html" << EOF
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project}</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header class="header">
        <h1>${project}</h1>
    </header>
    <main class="main">
        <p>Welcome to ${project}</p>
    </main>
    <footer class="footer">
        <p>Created on ${TIMESTAMP}</p>
    </footer>
    <script src="../src/js/main.js"></script>
</body>
</html>
EOF
}

create_scss() {
    local project="$1"
    log "SCSS ファイルを作成中..."

    cat > "$project/scss/abstracts/_variables.scss" << 'EOF'
$primary-color: #3498db;
$dark-color: #1e293b;
$light-color: #f8fafc;
$text-color: #334155;
$font-family: 'Segoe UI', sans-serif;
$max-width: 1200px;
$spacing: 16px;
$border-radius: 8px;
EOF

    cat > "$project/scss/main.scss" << 'EOF'
@use 'abstracts/variables' as *;

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: $font-family;
    color: $text-color;
    line-height: 1.6;
}

.header {
    background: $dark-color;
    color: $light-color;
    padding: $spacing * 2;
    text-align: center;
}

.main {
    max-width: $max-width;
    margin: 0 auto;
    padding: $spacing * 3;
}

.footer {
    background: $light-color;
    padding: $spacing;
    text-align: center;
}
EOF
}

create_gitignore() {
    local project="$1"
    log ".gitignore を作成中..."

    cat > "$project/.gitignore" << 'EOF'
node_modules/
dist/
build/
.env
.env.local
.DS_Store
Thumbs.db
*.log
.vscode/settings.json
.idea/
css/style.css.map
EOF
}

create_readme() {
    local project="$1"
    log "README.md を作成中..."

    cat > "$project/README.md" << EOF
# ${project}

## 概要

プロジェクトの説明をここに記述。

## セットアップ

\`\`\`bash
cd ${project}
npm install        # 依存関係のインストール
sass --watch scss/main.scss:css/style.css  # SCSS の監視
\`\`\`

## ディレクトリ構造

\`\`\`
${project}/
├── public/          # 公開ファイル
├── src/             # ソースコード
│   ├── js/
│   └── images/
├── scss/            # SCSSファイル
│   ├── abstracts/
│   ├── components/
│   └── layout/
├── css/             # コンパイル済みCSS
├── docs/            # ドキュメント
└── tests/           # テスト
\`\`\`

## 技術スタック

- HTML5
- Sass/SCSS
- CSS Grid
- JavaScript

---

Created: ${TIMESTAMP}
EOF
}

create_js() {
    local project="$1"
    log "main.js を作成中..."

    cat > "$project/src/js/main.js" << 'EOF'
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
});
EOF
}

init_git() {
    local project="$1"
    log "Gitリポジトリを初期化中..."

    cd "$project"
    git init --quiet
    git add .
    git commit --quiet -m "chore: initial project setup"
    cd ..
}

# === 引数チェック ===
if [ $# -lt 1 ]; then
    usage
fi

PROJECT_NAME="$1"

if [ -d "$PROJECT_NAME" ]; then
    error "ディレクトリ '$PROJECT_NAME' は既に存在します"
fi

# === メイン処理 ===
log "=== プロジェクト '$PROJECT_NAME' のセットアップ開始 ==="

create_directories "$PROJECT_NAME"
create_html "$PROJECT_NAME"
create_scss "$PROJECT_NAME"
create_js "$PROJECT_NAME"
create_gitignore "$PROJECT_NAME"
create_readme "$PROJECT_NAME"
init_git "$PROJECT_NAME"

log "=== セットアップ完了 ==="
log ""
log "次のステップ:"
log "  cd $PROJECT_NAME"
log "  sass --watch scss/main.scss:css/style.css"
log ""
```

</details>

---

## Part 3: Gitリポジトリ構築（15分）

### 要件

Part 2 で作成したプロジェクトに、チーム開発の仕組みを追加してください。

1. `.github/pull_request_template.md` を作成
2. `.github/CODEOWNERS` を作成
3. `develop` ブランチを作成
4. `feature/initial-content` ブランチでコンテンツを追加してコミット
5. `develop` にマージ

<details>
<summary>解答</summary>

```bash
cd my-project  # Part 2 で作成したプロジェクト

# PR テンプレート
mkdir -p .github
cat > .github/pull_request_template.md << 'EOF'
## 概要
<!-- 変更の概要を1-2文で -->

## 変更内容
-

## 関連Issue
<!-- Closes #N -->

## テスト方法
1.

## チェックリスト
- [ ] セルフレビュー完了
- [ ] テスト追加/更新
- [ ] ドキュメント更新（該当する場合）
EOF

# CODEOWNERS
cat > .github/CODEOWNERS << 'EOF'
* @team-lead
/scss/ @frontend-team
/src/js/ @frontend-team
/docs/ @tech-writer
EOF

git add .github/
git commit -m "chore: PR template と CODEOWNERS を追加"

# develop ブランチ作成
git checkout -b develop

# feature ブランチで開発
git checkout -b feature/initial-content

# コンテンツ追加
echo "<section class='about'><h2>About</h2><p>About content here</p></section>" >> public/index.html
git add public/index.html
git commit -m "feat: About セクションを追加"

# develop にマージ
git checkout develop
git merge feature/initial-content

# feature ブランチ削除
git branch -d feature/initial-content

echo "完了: develop ブランチにマージしました"
```

</details>

---

## Part 4: モダンWebサイト（25分）

### 要件

プロジェクトのWebサイトを以下の仕様で拡張してください。

1. CSS Grid で3列のカードレイアウト（auto-fit + minmax でレスポンシブ）
2. ホバーエフェクト（transform + transition）
3. ページ読み込み時のフェードインアニメーション（@keyframes）
4. Sass の変数とミックスインを活用

<details>
<summary>解答</summary>

`scss/components/_cards.scss` を作成:

```scss
@use '../abstracts/variables' as *;

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing * 2;
    padding: $spacing * 2;
    max-width: $max-width;
    margin: 0 auto;
}

.card {
    background: white;
    border-radius: $border-radius;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;

    @for $i from 1 through 6 {
        &:nth-child(#{$i}) {
            animation-delay: #{$i * 0.1}s;
        }
    }

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }

    &__image {
        height: 180px;
        background: $primary-color;
    }

    &__body {
        padding: $spacing;
    }

    &__title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: $spacing / 2;
        color: $dark-color;
    }

    &__text {
        color: $text-color;
        font-size: 14px;
        line-height: 1.5;
    }
}
```

`scss/main.scss` に追加:

```scss
@use 'components/cards';
```

`public/index.html` にカードセクションを追加:

```html
<section class="card-grid">
    <div class="card">
        <div class="card__image" style="background:#3b82f6"></div>
        <div class="card__body">
            <h3 class="card__title">Project 1</h3>
            <p class="card__text">Webアプリケーション開発</p>
        </div>
    </div>
    <div class="card">
        <div class="card__image" style="background:#10b981"></div>
        <div class="card__body">
            <h3 class="card__title">Project 2</h3>
            <p class="card__text">モバイルアプリUI</p>
        </div>
    </div>
    <div class="card">
        <div class="card__image" style="background:#f59e0b"></div>
        <div class="card__body">
            <h3 class="card__title">Project 3</h3>
            <p class="card__text">ダッシュボード設計</p>
        </div>
    </div>
</section>
```

コンパイル:
```bash
sass scss/main.scss css/style.css
```

</details>

---

## Part 5: デプロイスクリプト（15分）

### 要件

プロジェクトのビルドとデプロイを自動化する `deploy.sh` を作成してください。

1. 引数で環境（production/staging/development）を受け取る
2. SCSS をコンパイル
3. Gitの状態を確認（未コミットの変更がないか）
4. ビルド成果物を dist/ ディレクトリに作成
5. ログを出力
6. エラー処理（set -euo pipefail, trap）

<details>
<summary>解答</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

# === 設定 ===
ENVIRONMENT="${1:-development}"
LOG_FILE="deploy_$(date +%Y%m%d_%H%M%S).log"
DIST_DIR="./dist"

# === 関数 ===
usage() {
    echo "使い方: $0 [production|staging|development]"
    exit 1
}

log() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $*"
    echo "$msg" | tee -a "$LOG_FILE"
}

cleanup() {
    if [ $? -ne 0 ]; then
        log "ERROR: デプロイに失敗しました"
        rm -rf "$DIST_DIR"
    fi
}
trap cleanup EXIT

check_git_status() {
    log "Gitの状態を確認中..."
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        log "WARNING: 未コミットの変更があります"
        git status --short
        if [ "$ENVIRONMENT" = "production" ]; then
            log "ERROR: 本番デプロイには全ての変更をコミットしてください"
            exit 1
        fi
    else
        log "OK: ワーキングディレクトリはクリーンです"
    fi
}

build_scss() {
    log "SCSS をコンパイル中..."
    if command -v sass &>/dev/null; then
        sass scss/main.scss css/style.css --style=compressed --no-source-map
        log "OK: SCSS コンパイル完了"
    else
        log "WARNING: sass がインストールされていません（スキップ）"
    fi
}

build_dist() {
    log "ビルド成果物を作成中..."
    rm -rf "$DIST_DIR"
    mkdir -p "$DIST_DIR"

    # 必要なファイルをコピー
    cp -r public/* "$DIST_DIR/" 2>/dev/null || true
    cp -r css/ "$DIST_DIR/css/" 2>/dev/null || true
    cp -r src/js/ "$DIST_DIR/js/" 2>/dev/null || true
    cp -r src/images/ "$DIST_DIR/images/" 2>/dev/null || true

    local size
    size=$(du -sh "$DIST_DIR" | cut -f1)
    log "OK: ビルド完了 ($size)"
}

deploy() {
    local env="$1"
    case "$env" in
        production)
            log "本番環境にデプロイ中..."
            log "  デプロイ先: prod-server.example.com"
            ;;
        staging)
            log "ステージング環境にデプロイ中..."
            log "  デプロイ先: stg-server.example.com"
            ;;
        development)
            log "開発環境にデプロイ中..."
            log "  デプロイ先: localhost:8080"
            ;;
    esac
    sleep 1
    log "OK: デプロイ完了"
}

# === 引数チェック ===
case "$ENVIRONMENT" in
    production|staging|development) ;;
    *) usage ;;
esac

# === メイン処理 ===
log "===== デプロイ開始: $ENVIRONMENT ====="

check_git_status
build_scss
build_dist
deploy "$ENVIRONMENT"

log "===== 全工程完了 ====="
log "ログファイル: $LOG_FILE"
```

</details>

---

## 達成度チェック

| パート | テーマ | 完了 |
|--------|--------|------|
| Part 1 | ターミナルカスタマイズ | [ ] |
| Part 2 | セットアップスクリプト | [ ] |
| Part 3 | Gitリポジトリ構築 | [ ] |
| Part 4 | モダンWebサイト | [ ] |
| Part 5 | デプロイスクリプト | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ターミナル | alias、関数、PATHで自分だけの環境を構築 |
| スクリプト | 引数解析、エラー処理、ログ付きの実用スクリプト |
| Git | ブランチ戦略、PR template、CODEOWNERS |
| CSS | Grid + アニメーション + Sass のフルスタック |
| デプロイ | ビルドからデプロイまでの自動化 |

### チェックリスト

- [ ] ターミナルを自分好みにカスタマイズできた
- [ ] プロジェクトをゼロからセットアップするスクリプトを書けた
- [ ] チーム開発に必要なGitの仕組みを構築できた
- [ ] Grid + Sass でモダンなWebサイトを作れた
- [ ] デプロイスクリプトで一連のビルド作業を自動化できた

---

## 次のステップへ

お疲れさまでした。開発環境をゼロから構築する力が身につきました。

最後に、卒業クイズに挑戦しましょう。

---

*推定所要時間: 90分*
