# Git運用のベストプラクティス

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 3
subStep: 5
title: "Git運用のベストプラクティス"
itemType: LESSON
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> コードレビューで佐藤先輩がため息をついた。
>
> 「コミットメッセージ "fix" だけじゃ、何を修正したか分からないよ」
>
> 「すみません... どう書けばいいですか？」
>
> 「コミットメッセージには規約がある。.gitignore もちゃんと設定してるか？
> エイリアスは？ Git は道具だ。**手入れされた道具**で仕事した方がいいだろう」

---

## コミットメッセージ規約（Conventional Commits）

### 基本形式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### type の種類

| type | 用途 | 例 |
|------|------|-----|
| `feat` | 新機能 | `feat: ユーザー登録機能を追加` |
| `fix` | バグ修正 | `fix: ログイン時のバリデーションエラーを修正` |
| `docs` | ドキュメント | `docs: API仕様書を更新` |
| `style` | コードスタイル | `style: インデントを修正` |
| `refactor` | リファクタリング | `refactor: 認証ロジックを共通化` |
| `test` | テスト | `test: ユーザーサービスのテストを追加` |
| `chore` | 雑務 | `chore: 依存パッケージを更新` |

### 良い例と悪い例

```bash
# 悪い例
git commit -m "fix"
git commit -m "修正"
git commit -m "更新"
git commit -m "asdf"

# 良い例
git commit -m "feat: 商品検索にフィルター機能を追加"
git commit -m "fix: カート内の金額計算が小数点以下で誤差が出る問題を修正"
git commit -m "refactor: データベース接続処理を共通モジュールに抽出"
```

---

## .gitignore -- 追跡しないファイルの設定

### 基本的な .gitignore

```gitignore
# 依存関係
node_modules/
vendor/
__pycache__/

# ビルド成果物
dist/
build/
*.o
*.pyc

# 環境設定（秘密情報を含む）
.env
.env.local
.env.production

# IDE設定
.vscode/settings.json
.idea/
*.swp
*.swo

# OS生成ファイル
.DS_Store
Thumbs.db

# ログ
*.log
logs/

# テスト
coverage/
```

### パターンの書き方

| パターン | 意味 |
|---------|------|
| `*.log` | 全ての .log ファイル |
| `logs/` | logs ディレクトリ全体 |
| `!important.log` | important.log は除外しない（例外） |
| `doc/**/*.pdf` | doc 以下の全 PDF |
| `/config.json` | ルートの config.json のみ |

### グローバル .gitignore

全リポジトリ共通の設定は、グローバル設定に記述します。

```bash
# グローバル .gitignore を設定
git config --global core.excludesFile ~/.gitignore_global

# ~/.gitignore_global に OS やエディタ固有のファイルを記述
cat > ~/.gitignore_global << 'EOF'
.DS_Store
Thumbs.db
*.swp
.idea/
.vscode/
EOF
```

---

## Git エイリアス

よく使うコマンドを短縮形で登録できます。

### 設定方法

```bash
# コマンドで設定
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# 履歴表示のカスタム
git config --global alias.lg "log --oneline --graph --all --decorate"

# 直前のコミットの修正
git config --global alias.amend "commit --amend --no-edit"

# 変更の差分サマリ
git config --global alias.ds "diff --stat"
```

### 設定後の使い方

```bash
git st          # git status
git co main     # git checkout main
git br -a       # git branch -a
git lg          # 見やすい履歴グラフ
```

---

## Interactive Rebase（コミット整理）

PRを出す前に、コミット履歴をきれいに整理できます。

### 主な操作

```bash
# 直近3コミットを整理
git rebase -i HEAD~3
```

エディタが開き、以下のような表示になります：

```
pick abc1234 feat: ヘッダーコンポーネントを追加
pick def5678 fix: typo
pick ghi9012 feat: ヘッダーにナビゲーションを追加
```

| 操作 | 意味 |
|------|------|
| `pick` | コミットをそのまま使う |
| `reword` | コミットメッセージを変更 |
| `squash` | 前のコミットと統合（メッセージも統合） |
| `fixup` | 前のコミットと統合（メッセージは破棄） |
| `drop` | コミットを削除 |

### 例: typo修正コミットを統合

```
pick abc1234 feat: ヘッダーコンポーネントを追加
fixup def5678 fix: typo
pick ghi9012 feat: ヘッダーにナビゲーションを追加
```

結果：typo修正が最初のコミットに統合され、きれいな履歴になります。

---

## その他の便利な設定

```bash
# デフォルトブランチ名を main に
git config --global init.defaultBranch main

# プッシュ時に現在のブランチのみ
git config --global push.default current

# プル時にリベース
git config --global pull.rebase true

# 色付き出力
git config --global color.ui auto

# エディタ設定
git config --global core.editor "vim"
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| コミットメッセージ | Conventional Commits 形式（feat/fix/docs...） |
| .gitignore | 不要ファイルを追跡対象から除外 |
| エイリアス | よく使うコマンドのショートカット |
| Interactive Rebase | PR前のコミット履歴整理 |
| グローバル設定 | push.default, pull.rebase 等 |

### チェックリスト

- [ ] Conventional Commits のフォーマットでコミットできる
- [ ] プロジェクトに適した .gitignore を書ける
- [ ] Git エイリアスを設定できる
- [ ] Interactive Rebase の基本操作を理解した

---

## 次のステップへ

Git 運用のベストプラクティスを学びました。

次はStep 3の理解度チェックです。ブランチ戦略、マージ/リベース、コンフリクト解決の知識を確認しましょう。

---

*推定読了時間: 15分*
