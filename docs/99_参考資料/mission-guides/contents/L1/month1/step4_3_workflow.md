# チーム開発ワークフロー

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 4
subStep: 3
title: "チーム開発ワークフロー"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Git/バージョン管理"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> チームミーティングで、リーダーが言った。
>
> 「来週からブランチ保護ルールを導入する。mainへの直接プッシュは禁止だ」
>
> 「ブランチ保護... ですか？」
>
> 佐藤先輩が補足する。
>
> 「チームが大きくなると、ルールで品質を守る仕組みが必要になる。
> ブランチ保護、CODEOWNERS、CI -- これがチーム開発の三種の神器だ」

---

## ブランチ保護ルール

GitHub のブランチ保護（Branch Protection Rules）は、main ブランチへの意図しない変更を防ぎます。

### 主な保護ルール

| ルール | 効果 |
|--------|------|
| Require pull request reviews | PR のレビュー承認が必須 |
| Required number of approvals | 承認者数の指定（例: 2人以上） |
| Dismiss stale reviews | 新しいコミット後に既存の承認を取り消し |
| Require status checks | CIテストの合格が必須 |
| Require branches to be up to date | マージ前に最新の main を取り込み済みであること |
| Restrict who can push | プッシュできるユーザーを制限 |

### 設定方法（GitHub）

```
Settings → Branches → Add rule
  Branch name pattern: main
  [x] Require a pull request before merging
  [x] Require approvals: 1
  [x] Require status checks to pass before merging
  [x] Require branches to be up to date before merging
```

---

## CODEOWNERS

CODEOWNERS は、ファイルやディレクトリの「責任者」を定義するファイルです。
該当ファイルが変更されたPRに、自動的にレビュアーが割り当てられます。

### 設定ファイル

```bash
# .github/CODEOWNERS

# デフォルトのオーナー（全ファイル）
* @team-lead

# フロントエンド
/src/components/ @frontend-team
/src/styles/     @frontend-team

# バックエンド
/src/api/     @backend-team
/src/models/  @backend-team

# インフラ
/terraform/   @infra-team
/docker/      @infra-team

# ドキュメント
/docs/        @tech-writer

# 設定ファイルはリーダー承認
/package.json  @team-lead
/.github/      @team-lead
```

### CODEOWNERS の効果

- 該当ファイルが変更されたPRに自動でレビュアーが追加される
- 「誰に聞けばいいか」が明確になる
- コードの責任範囲が可視化される

---

## CI/CD の連携

### CI（Continuous Integration）とは

コードがプッシュされるたびに、自動でテスト・ビルドを実行する仕組みです。

### GitHub Actions の基本

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run lint
      - run: npm test

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
```

### CIチェックの流れ

```
1. feature ブランチにプッシュ
   ↓
2. GitHub Actions が自動実行
   ↓
3. lint → test → build
   ↓
4. 結果がPRに表示
   ├── 全てパス → マージ可能
   └── 失敗 → マージブロック
```

---

## Issue とPR の連携

### Issue の活用

```bash
# Issue の作成
gh issue create --title "ユーザープロフィールページが必要" \
  --body "## 概要
ユーザーが自分のプロフィールを閲覧・編集できるページが必要。

## 要件
- プロフィール情報の表示
- プロフィール画像のアップロード
- レスポンシブ対応"

# Issue の一覧
gh issue list

# Issue に担当者を割り当て
gh issue edit 123 --add-assignee @tanaka
```

### PR と Issue の紐付け

PRの説明文にキーワードを入れると、マージ時にIssueが自動的にクローズされます。

```markdown
## 関連Issue
Closes #123
Fixes #456
Resolves #789
```

---

## チーム開発の一日の流れ

```bash
# 朝: main の最新を取得
git checkout main
git pull

# Issue を確認し、作業するタスクを選ぶ
gh issue list --assignee @me

# feature ブランチを作成
git checkout -b feature/PROJ-123-user-profile

# 開発作業
# ... コーディング ...
# ... テスト実行 ...

# コミット
git add .
git commit -m "feat: ユーザープロフィールページを追加

Closes #123"

# プッシュ
git push -u origin feature/PROJ-123-user-profile

# PR作成
gh pr create --title "feat: ユーザープロフィールページを追加" \
  --body "Closes #123"

# 他の人のPRをレビュー
gh pr list --search "review-requested:@me"
gh pr review 42 --approve --body "LGTM!"

# 自分のPRが承認されたらマージ
gh pr merge 45 --squash --delete-branch
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ブランチ保護 | main への直接プッシュを禁止、レビュー必須化 |
| CODEOWNERS | ファイルの責任者を定義、自動レビュー割り当て |
| CI/CD | テスト・ビルドの自動実行 |
| Issue連携 | Closes #N でマージ時にIssue自動クローズ |

### チェックリスト

- [ ] ブランチ保護ルールの主な設定を理解した
- [ ] CODEOWNERS ファイルの書き方を知った
- [ ] GitHub Actions の基本構造を理解した
- [ ] Issue と PR の連携方法を知った
- [ ] チーム開発の一日の流れを把握した

---

## 次のステップへ

チーム開発のワークフローを学びました。

次のセクションでは、トラブルシューティングに役立つ高度な Git 操作を学びます。
git bisect, git reflog, git blame -- 問題を追跡する強力なツール群です。

---

*推定読了時間: 30分*
