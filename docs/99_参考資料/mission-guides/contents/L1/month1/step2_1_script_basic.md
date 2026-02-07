# シェルスクリプトの基本

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 2
subStep: 1
title: "シェルスクリプトの基本"
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

> 毎朝、あなたは同じ手順を繰り返していた。
>
> 1. `git pull` で最新コードを取得
> 2. `npm install` で依存関係を更新
> 3. `npm run build` でビルド
> 4. `npm run dev` で開発サーバーを起動
>
> 佐藤先輩がそれを見て言った。
>
> 「同じことを3回以上やったら、スクリプトにしろ。それがエンジニアの鉄則だ」
>
> 「スクリプト... ですか？」
>
> 「ああ。コマンドをファイルに書いておけば、1コマンドで全部実行できる。
> シェルスクリプトは、自動化の第一歩だ」

---

## シェルスクリプトとは

シェルスクリプトは、ターミナルに打ち込むコマンドをファイルにまとめたものです。

### 最初のスクリプト

```bash
#!/bin/bash
# hello.sh - 最初のシェルスクリプト

echo "Hello, World!"
echo "現在の時刻: $(date)"
echo "ユーザー: $USER"
echo "ディレクトリ: $PWD"
```

### Shebang（シバン）

スクリプトの1行目 `#!/bin/bash` は **Shebang** と呼ばれ、このスクリプトをどのプログラムで実行するかを指定します。

| Shebang | 実行プログラム |
|---------|---------------|
| `#!/bin/bash` | bash で実行 |
| `#!/bin/sh` | POSIX互換シェルで実行 |
| `#!/usr/bin/env bash` | 環境に応じたbashで実行（推奨） |
| `#!/usr/bin/env python3` | Python3 で実行 |

> **推奨**: `#!/usr/bin/env bash` を使うと、bash のパスが環境によって異なる場合でも動作します。

---

## スクリプトの作成と実行

### Step 1: ファイルを作成

```bash
# エディタで作成
vim hello.sh

# または echo/cat で作成
cat > hello.sh << 'EOF'
#!/usr/bin/env bash
echo "Hello, World!"
EOF
```

### Step 2: 実行権限を付与

```bash
# 実行権限を確認
ls -l hello.sh
# -rw-r--r--  → 実行権限がない

# 実行権限を付与
chmod +x hello.sh

# 確認
ls -l hello.sh
# -rwxr-xr-x  → 実行権限がついた
```

### Step 3: 実行

```bash
# 方法1: パスを指定して実行
./hello.sh

# 方法2: bash で明示的に実行（実行権限不要）
bash hello.sh

# 方法3: source で実行（現在のシェルで実行）
source hello.sh
```

### `./` と `source` の違い

| 実行方法 | 動作 | 変数の影響 |
|---------|------|-----------|
| `./script.sh` | 新しいシェルプロセスで実行 | 変数はスクリプト内で完結 |
| `bash script.sh` | 新しいシェルプロセスで実行 | 変数はスクリプト内で完結 |
| `source script.sh` | 現在のシェルで実行 | 変数が現在のシェルに影響する |

---

## コメント

```bash
#!/usr/bin/env bash

# これは1行コメント
echo "hello"  # 行末コメント

# 複数行のコメントは各行に # をつける
# このスクリプトは
# サーバーの状態を確認します

: '
これはヒアドキュメントを利用した
複数行コメントの書き方です。
あまり一般的ではありませんが使えます。
'
```

---

## スクリプトの構造（テンプレート）

実務で使うスクリプトの基本構造を示します。

```bash
#!/usr/bin/env bash
#
# スクリプト名: setup.sh
# 説明: プロジェクトの初期セットアップを行う
# 使い方: ./setup.sh [project-name]
# 作成日: 2025-01-01
#

# === 設定 ===
set -euo pipefail  # エラー時に停止、未定義変数でエラー

# === 定数 ===
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly LOG_FILE="/tmp/setup_$(date +%Y%m%d_%H%M%S).log"

# === メイン処理 ===
echo "セットアップを開始します..."
echo "スクリプトの場所: $SCRIPT_DIR"
echo "ログファイル: $LOG_FILE"

# 処理内容
echo "$(date): セットアップ完了" | tee -a "$LOG_FILE"
```

### set -euo pipefail の意味

| オプション | 効果 |
|-----------|------|
| `set -e` | コマンドがエラーを返したらスクリプトを即座に終了 |
| `set -u` | 未定義の変数を使用した場合にエラー |
| `set -o pipefail` | パイプラインの途中でエラーが発生した場合に検出 |

> **推奨**: 本番用のスクリプトには必ず `set -euo pipefail` を入れましょう。
> 意図しないエラーの見逃しを防げます。

---

## 実行結果の確認（exit code）

すべてのコマンドは終了時に「終了コード」を返します。

```bash
# 直前のコマンドの終了コードを確認
ls /tmp
echo $?    # 0 = 成功

ls /nonexistent
echo $?    # 2 = エラー（ファイルが存在しない）
```

| 終了コード | 意味 |
|-----------|------|
| 0 | 成功 |
| 1 | 一般的なエラー |
| 2 | コマンドの誤用 |
| 126 | 実行権限がない |
| 127 | コマンドが見つからない |
| 128+N | シグナルNで終了 |

### スクリプトで終了コードを返す

```bash
#!/usr/bin/env bash

if [ -f "config.json" ]; then
    echo "設定ファイルが見つかりました"
    exit 0  # 成功
else
    echo "エラー: 設定ファイルが見つかりません" >&2
    exit 1  # 失敗
fi
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Shebang | `#!/usr/bin/env bash` でスクリプトの実行プログラムを指定 |
| 実行権限 | `chmod +x` で実行可能にする |
| 実行方法 | `./script.sh` または `bash script.sh` |
| set -euo pipefail | 安全なスクリプトのための設定 |
| exit code | `$?` で確認、0が成功、それ以外がエラー |

### チェックリスト

- [ ] Shebangの役割を説明できる
- [ ] スクリプトファイルを作成し、実行権限を付与して実行できる
- [ ] `./` と `source` の違いを説明できる
- [ ] `set -euo pipefail` の意味を理解している
- [ ] 終了コードの確認方法を知っている

---

## 次のステップへ

シェルスクリプトの基本がわかりましたね。

次のセクションでは、変数、条件分岐、ループといった制御構文を学びます。
これらを使うことで、スクリプトに「判断力」と「繰り返しの力」を持たせることができます。

---

*推定読了時間: 30分*
