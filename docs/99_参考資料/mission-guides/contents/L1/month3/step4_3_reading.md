# 他人のコードを読む技術

## メタ情報

```yaml
mission: "コードで世界を動かそう"
step: 4
subStep: 3
title: "他人のコードを読む技術"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "メイン開発言語"
  category: "プログラミング"
  target_level: "L1"
```

---

## ストーリー

> 「新機能を追加する前に、まず既存のコードを理解する必要がある」
>
> 田中先輩はリポジトリを開いた。
>
> 「1万行以上のコードがある。全部読む必要はないが、
> **必要な部分を素早く見つけて理解する技術**は絶対に必要だ」
>
> 「どこから読めばいいんですか？」
>
> 「いい質問だ。コードを読むにはコツがある」

---

## コードリーディングのアプローチ

### トップダウンアプローチ

全体像から詳細へ、段階的に理解を深めます。

```
1. プロジェクト構造を把握
   └── ディレクトリ構成、README、package.json を確認

2. エントリーポイントを見つける
   └── index.ts、main.py、App.tsx など

3. 主要なデータの流れを追う
   └── ユーザー入力 → 処理 → 出力

4. 詳細な実装を読む
   └── 必要な関数・クラスのみ深掘り
```

---

## Step 1: プロジェクト構造を把握する

```bash
# ディレクトリ構造を確認
tree -L 2 src/

# package.json で依存関係を確認
cat package.json

# README を読む
cat README.md
```

### 確認すべきファイル

| ファイル | 確認する内容 |
|---------|-------------|
| README.md | プロジェクトの目的、セットアップ手順 |
| package.json | 使用ライブラリ、スクリプト |
| tsconfig.json | TypeScript設定、パス設定 |
| .env.example | 環境変数の一覧 |
| docker-compose.yml | インフラ構成 |

---

## Step 2: エントリーポイントを見つける

```typescript
// package.json の "main" や "scripts" を確認
{
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",  // ← これがエントリーポイント
    "dev": "ts-node src/index.ts"
  }
}
```

```typescript
// src/index.ts（エントリーポイントの例）
import { createApp } from "./app";
import { config } from "./config";

const app = createApp();
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
```

> ここから `createApp` の定義 → ルーティング → ハンドラー → サービス層と辿っていきます。

---

## Step 3: データの流れを追う

### import を辿る

```typescript
// controller.ts
import { UserService } from "../services/UserService";  // ← 次に読む

export class UserController {
  constructor(private userService: UserService) {}

  async getUser(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findById(req.params.id);  // ← この処理を追う
    res.json(user);
  }
}
```

### 図にして整理する

```
Request
  ↓
[Router] → routes/user.ts
  ↓
[Controller] → controllers/UserController.ts
  ↓
[Service] → services/UserService.ts
  ↓
[Repository] → repositories/UserRepository.ts
  ↓
Database
```

---

## Step 4: 効率的にコードを検索する

### IDE/エディタの機能を活用

| 機能 | ショートカット（VS Code） | 用途 |
|------|------------------------|------|
| 定義へ移動 | `F12` | 関数・変数の定義を見る |
| 参照を検索 | `Shift+F12` | どこで使われているか |
| ファイル検索 | `Ctrl+P` | ファイル名で検索 |
| 全文検索 | `Ctrl+Shift+F` | プロジェクト全体を文字列検索 |
| シンボル検索 | `Ctrl+T` | 関数名・クラス名で検索 |

### grep / ripgrep でコマンドラインから検索

```bash
# 関数の使用箇所を検索
grep -rn "findById" src/

# 特定のパターンを検索
grep -rn "TODO\|FIXME\|HACK" src/

# ripgrep（高速）
rg "findById" src/
```

---

## Pythonコードの読み方

### TypeScriptとの違いに注意

```python
# 1. インデントがブロックを表す
def process_data(items):
    for item in items:          # for のブロック
        if item.is_valid():     # if のブロック
            result = transform(item)
            save(result)
    return True                 # for の外

# 2. デコレータ（@ 記号）
@app.route("/users")            # ルーティングの定義
def get_users():
    return jsonify(users)

# 3. with文（リソース管理）
with open("data.csv", "r") as f:  # ファイルを自動的に閉じる
    content = f.read()

# 4. __init__.py（パッケージの初期化ファイル）
# ディレクトリをモジュールとして認識させる

# 5. self（インスタンスの参照）
class UserService:
    def __init__(self, db):        # TypeScript の constructor に相当
        self.db = db               # TypeScript の this.db に相当

    def find_by_id(self, user_id):
        return self.db.find(user_id)
```

---

## コード理解のチェックリスト

新しいコードを読むときに確認すべき項目です。

```
[ ] プロジェクトの目的は何か？
[ ] どの言語・フレームワークを使っているか？
[ ] エントリーポイントはどこか？
[ ] データの入力と出力は何か？
[ ] 主要なモジュール/クラスは何か？
[ ] 外部依存（API、DB）は何か？
[ ] テストはどこにあるか？
[ ] エラー処理はどうなっているか？
```

---

## 読みやすくするメモの取り方

```markdown
## プロジェクト: user-management-api

### 構造
- Express + TypeScript
- PostgreSQL（Prisma ORM）
- JWT認証

### 主要ファイル
- src/index.ts → サーバー起動
- src/routes/ → ルーティング定義
- src/services/ → ビジネスロジック
- src/repositories/ → DB操作

### データフロー
Request → Router → Controller → Service → Repository → DB

### 気になる点
- TODO: エラーハンドリングが不足（service層）
- FIXME: ページネーション未実装
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| トップダウン | 全体構造 → エントリーポイント → データの流れ → 詳細 |
| 確認ファイル | README, package.json, エントリーポイント |
| 検索ツール | F12（定義へ移動）, grep, 全文検索 |
| import追跡 | import文を辿って依存関係を理解する |
| メモ | 読んで理解したことを記録する |

### チェックリスト

- [ ] プロジェクト構造から全体像を把握できる
- [ ] エントリーポイントを見つけられる
- [ ] import文を辿ってデータの流れを追える
- [ ] IDE の検索機能を使ってコードを探せる
- [ ] Pythonコードの基本的な構造を読み取れる

---

## 次のステップへ

コードを読む技術を学びました。

次のセクションでは、**デバッグの技法**を学びます。
コードの動作がおかしいとき、どうやって原因を特定するのか。
プロのデバッグ手法を身につけましょう。

---

*推定読了時間: 30分*
