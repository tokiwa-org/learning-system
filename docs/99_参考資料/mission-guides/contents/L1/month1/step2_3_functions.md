# 関数とエラー処理

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 2
subStep: 3
title: "関数とエラー処理"
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

> あなたのスクリプトが100行を超え始めた。
>
> 「同じ処理を何箇所かで書いてるな...」佐藤先輩が画面を覗く。
>
> 「関数にまとめた方がいいですよね」
>
> 「そうだ。あと、エラーが起きた時の処理も考えないといけない。
> ビルドが途中で失敗したのに、デプロイが実行されたら惨事になる」
>
> 「エラー処理... 確かに今のスクリプトでは何も考えていません」
>
> 「本番で使うスクリプトは、"何がうまくいかないか"を常に想定して書くんだ」

---

## 関数の基本

### 関数の定義と呼び出し

```bash
#!/usr/bin/env bash

# 関数の定義（方法1）
greet() {
    echo "こんにちは、$1さん！"
}

# 関数の定義（方法2）
function farewell {
    echo "さようなら、$1さん！"
}

# 関数の呼び出し
greet "田中"       # こんにちは、田中さん！
farewell "佐藤"    # さようなら、佐藤さん！
```

### 関数の引数

関数の引数はスクリプト本体と同じく `$1`, `$2`, ... で受け取ります。

```bash
#!/usr/bin/env bash

create_user() {
    local username="$1"
    local email="$2"
    local role="${3:-member}"  # デフォルト値

    echo "ユーザー作成: $username ($email) - ロール: $role"
}

create_user "tanaka" "tanaka@example.com" "admin"
create_user "suzuki" "suzuki@example.com"  # roleはデフォルトの "member"
```

### 戻り値

シェルスクリプトの関数は、文字列を `echo` で返すか、終了コードを `return` で返します。

```bash
#!/usr/bin/env bash

# 文字列を返す（echo）
get_timestamp() {
    echo "$(date +%Y%m%d_%H%M%S)"
}

# 終了コードを返す（return）
is_valid_email() {
    local email="$1"
    if [[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 0  # 成功（有効）
    else
        return 1  # 失敗（無効）
    fi
}

# 使い方
timestamp=$(get_timestamp)
echo "タイムスタンプ: $timestamp"

if is_valid_email "user@example.com"; then
    echo "有効なメールアドレスです"
else
    echo "無効なメールアドレスです"
fi
```

---

## local 変数

`local` をつけると、変数のスコープが関数内に限定されます。

```bash
#!/usr/bin/env bash

message="グローバル"

change_message() {
    local message="ローカル"
    echo "関数内: $message"   # ローカル
}

change_message
echo "関数外: $message"       # グローバル（影響を受けない）
```

> **推奨**: 関数内の変数には必ず `local` をつけましょう。
> 意図しないグローバル変数の上書きを防げます。

---

## エラー処理

### set -e -- エラー時に即座に停止

```bash
#!/usr/bin/env bash
set -e

echo "Step 1: ビルド"
npm run build         # ここでエラーが発生すると...

echo "Step 2: デプロイ"
npm run deploy        # ← set -e があるので、ここには到達しない
```

### set -u -- 未定義変数でエラー

```bash
#!/usr/bin/env bash
set -u

echo "ユーザー: $USER"         # OK: USERは定義されている
echo "未定義: $UNDEFINED_VAR"  # エラーで停止！
```

### set -o pipefail -- パイプのエラーを検出

```bash
#!/usr/bin/env bash
set -o pipefail

# pipefail がないと、最後のコマンドの終了コードだけで判定
# pipefail があると、パイプライン中のどこかでエラーが出れば検出
cat nonexistent_file.txt | sort | head -5
echo "この行には到達しない"
```

---

## trap -- シグナルのハンドリング

`trap` は、スクリプトが終了する時やシグナルを受け取った時に実行する処理を登録します。

### クリーンアップ処理

```bash
#!/usr/bin/env bash
set -euo pipefail

# 一時ファイル
TEMP_DIR=$(mktemp -d)
TEMP_FILE=$(mktemp)

# スクリプト終了時にクリーンアップ
cleanup() {
    echo "クリーンアップ中..."
    rm -rf "$TEMP_DIR"
    rm -f "$TEMP_FILE"
    echo "完了"
}
trap cleanup EXIT  # EXIT シグナルで cleanup を実行

# メイン処理
echo "一時ディレクトリ: $TEMP_DIR"
echo "データ" > "$TEMP_FILE"

# ここでエラーが起きても、cleanup が自動で実行される
cp "$TEMP_FILE" "$TEMP_DIR/data.txt"
# ... 処理 ...

# スクリプト終了時に自動的に cleanup が呼ばれる
```

### よく使う trap のパターン

```bash
# エラー時にメッセージを表示
trap 'echo "エラーが発生しました（行 $LINENO）" >&2' ERR

# Ctrl+C で中断された時の処理
trap 'echo "中断されました"; exit 1' INT

# 一時ファイルのクリーンアップ
trap 'rm -f /tmp/my_script_$$_*' EXIT
```

| シグナル | タイミング |
|---------|-----------|
| `EXIT` | スクリプト終了時（正常・異常問わず） |
| `ERR` | コマンドがエラーを返した時 |
| `INT` | Ctrl+C が押された時 |
| `TERM` | kill コマンドで終了要求された時 |

---

## 実践的なエラー処理パターン

### パターン1: ログ付きエラーハンドリング

```bash
#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="/tmp/deploy_$(date +%Y%m%d).log"

log() {
    local level="$1"
    shift
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$LOG_FILE"
}

log "INFO" "デプロイを開始します"

if ! npm run build 2>&1 | tee -a "$LOG_FILE"; then
    log "ERROR" "ビルドに失敗しました"
    exit 1
fi

log "INFO" "デプロイが完了しました"
```

### パターン2: リトライ機能

```bash
#!/usr/bin/env bash

retry() {
    local max_attempts="$1"
    local delay="$2"
    shift 2
    local cmd=("$@")

    local attempt=1
    while [ "$attempt" -le "$max_attempts" ]; do
        echo "試行 $attempt/$max_attempts: ${cmd[*]}"
        if "${cmd[@]}"; then
            return 0
        fi
        echo "失敗。${delay}秒後にリトライします..."
        sleep "$delay"
        ((attempt++))
    done

    echo "エラー: ${max_attempts}回の試行がすべて失敗しました" >&2
    return 1
}

# 最大3回、5秒間隔でリトライ
retry 3 5 curl -s http://api.example.com/health
```

### パターン3: 引数の検証

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() {
    echo "使い方: $0 <environment> <version>"
    echo ""
    echo "  environment: production, staging, development"
    echo "  version:     デプロイするバージョン（例: v1.2.3）"
    exit 1
}

# 引数チェック
if [ $# -lt 2 ]; then
    echo "エラー: 引数が不足しています" >&2
    usage
fi

environment="$1"
version="$2"

# 値の検証
case "$environment" in
    production|staging|development) ;;
    *)
        echo "エラー: 無効な環境: $environment" >&2
        usage
        ;;
esac

if [[ ! "$version" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "エラー: 無効なバージョン形式: $version" >&2
    usage
fi

echo "デプロイ: $environment / $version"
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 関数 | `func_name() { ... }` で定義。引数は `$1`, `$2`... |
| local | 関数内変数のスコープを限定。必ず使うこと |
| 戻り値 | `echo` で文字列を返す、`return` で終了コードを返す |
| set -euo pipefail | エラー検出の三種の神器 |
| trap | スクリプト終了時やエラー時のクリーンアップ |

### チェックリスト

- [ ] 関数を定義し、引数を受け取れる
- [ ] local を使ってスコープを限定できる
- [ ] set -euo pipefail の役割を説明できる
- [ ] trap でクリーンアップ処理を書ける
- [ ] 引数の検証とusage関数を実装できる

---

## 次のステップへ

関数とエラー処理を学びました。スクリプトに「安全装置」が付きましたね。

次のセクションでは、実務で即使える実践的なスクリプト例を学びます。
ログ解析、バックアップ、デプロイ -- 現場で本当に使われるスクリプトのパターンです。

---

*推定読了時間: 30分*
