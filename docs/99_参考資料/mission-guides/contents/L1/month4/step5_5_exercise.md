# 演習：セキュリティパイプラインを構築しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 5
subStep: 5
title: "演習：セキュリティパイプラインを構築しよう"
itemType: EXERCISE
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "DevSecOps"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「最後に、実際にセキュリティパイプラインを構築してみよう」
>
> 高橋さんが新しいリポジトリを画面に映す。
>
> 「このプロジェクトにGitHub Actionsのセキュリティワークフローを追加してくれ。
> PRが作られたら自動的にチェックが走り、問題があればマージをブロックする仕組みだ」

---

## 演習の概要

GitHub Actionsのセキュリティワークフローを作成してください。

| ミッション | 内容 | 難易度 |
|-----------|------|--------|
| Mission 1 | 基本的なセキュリティワークフロー | 初級 |
| Mission 2 | Dependabotの設定 | 初級 |
| Mission 3 | 総合ワークフロー | 中級 |

---

## Mission 1: 基本的なセキュリティワークフロー（10分）

以下の要件を満たすGitHub Actionsワークフローを作成してください。

### 要件

- PR作成時とmainブランチへのpush時に実行
- Node.js 20を使用
- `npm audit` でhigh以上の脆弱性があれば失敗
- ESLintのセキュリティチェックを実行

<details>
<summary>解答</summary>

```yaml
# .github/workflows/security.yml
name: Security Check

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  security-audit:
    name: Dependency Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --omit=dev --audit-level=high

  lint-security:
    name: ESLint Security
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npx eslint src/ --ext .ts,.js
```

</details>

---

## Mission 2: Dependabotの設定（5分）

以下の要件を満たすDependabot設定ファイルを作成してください。

### 要件

- npmパッケージを毎週チェック
- GitHub Actionsも毎週チェック
- セキュリティラベルを付与
- PRの上限を5つ

<details>
<summary>解答</summary>

```yaml
# .github/dependabot.yml
version: 2
updates:
  # npm パッケージの更新
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Tokyo"
    labels:
      - "dependencies"
      - "security"
    open-pull-requests-limit: 5
    # セキュリティアップデートのみを優先
    groups:
      security-updates:
        patterns:
          - "*"
        update-types:
          - "patch"

  # GitHub Actions の更新
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "ci"
      - "dependencies"
    open-pull-requests-limit: 5
```

</details>

---

## Mission 3: 総合ワークフロー（15分）

以下の要件を満たす総合的なセキュリティワークフローを作成してください。

### 要件

- 依存パッケージの脆弱性チェック
- CodeQL分析
- シークレットスキャン
- PRへの結果コメント

<details>
<summary>解答</summary>

```yaml
# .github/workflows/security-full.yml
name: Full Security Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'  # 毎週月曜 00:00 UTC

permissions:
  contents: read
  security-events: write
  pull-requests: write

jobs:
  # Job 1: 依存パッケージの脆弱性チェック
  dependency-audit:
    name: Dependency Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --omit=dev --audit-level=high

      - name: Run Snyk test
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  # Job 2: CodeQL 分析
  codeql-analysis:
    name: CodeQL Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript
          queries: security-extended

      - name: Autobuild
        uses: github/codeql-action/autobuild@v3

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3

  # Job 3: シークレットスキャン
  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified

  # Job 4: ESLint セキュリティルール
  eslint-security:
    name: ESLint Security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: ESLint Security Check
        run: npx eslint src/ --ext .ts,.js --format json --output-file eslint-results.json
        continue-on-error: true

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            try {
              const results = JSON.parse(fs.readFileSync('eslint-results.json', 'utf8'));
              const errors = results.reduce((sum, r) => sum + r.errorCount, 0);
              const warnings = results.reduce((sum, r) => sum + r.warningCount, 0);

              if (errors > 0 || warnings > 0) {
                await github.rest.issues.createComment({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  issue_number: context.issue.number,
                  body: `## Security Lint Results\n\n- Errors: ${errors}\n- Warnings: ${warnings}\n\nPlease review the security findings.`
                });
              }
            } catch (e) {
              console.log('No ESLint results to report');
            }
```

</details>

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ワークフロー | PR/pushごとに自動でセキュリティチェック |
| Dependabot | 依存パッケージの自動更新PRを作成 |
| 総合パイプライン | audit + CodeQL + シークレットスキャン + ESLint |
| 定期実行 | scheduleで週次フルスキャン |

### チェックリスト

- [ ] GitHub Actionsのセキュリティワークフローを作成できた
- [ ] Dependabotの設定ファイルを作成できた
- [ ] 総合的なセキュリティパイプラインの構成を理解した

---

## 次のステップへ

セキュリティパイプラインの構築演習を完了しました。
次のセクションでは、Step 5のチェックポイントクイズに挑戦しましょう。

---

*推定所要時間: 30分*
