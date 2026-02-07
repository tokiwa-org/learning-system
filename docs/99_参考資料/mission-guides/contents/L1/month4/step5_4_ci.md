# CI/CDにセキュリティチェックを組み込もう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 5
subStep: 4
title: "CI/CDにセキュリティチェックを組み込もう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "DevSecOps"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「ツールの使い方は分かった。次は自動化だ」
>
> 高橋さんがGitHub Actionsのワークフロー画面を開いた。
>
> 「セキュリティチェックは手動でやると忘れる。だからCI/CDに組み込んで、
> PRが作られるたびに自動的に実行されるようにする」
>
> 「PRをマージする前に問題が見つかる、ということですね」
>
> 「そうだ。これが**シフトレフト**の考え方だ。
> 問題を本番に行く前に、できるだけ早い段階で見つける」

---

## シフトレフトとは

```
従来のセキュリティチェック（シフトライト）:
  開発 → テスト → ステージング → [セキュリティチェック] → 本番
                                  ↑
                            ここで発見（遅い、修正コストが高い）

シフトレフト:
  開発 → [セキュリティチェック] → テスト → ステージング → 本番
          ↑
    ここで発見（早い、修正コストが低い）
```

問題を早期に発見するほど、修正のコストは低くなります。

---

## GitHub Actions でのセキュリティワークフロー

### 総合的なセキュリティチェック

```yaml
# .github/workflows/security.yml
name: Security Check

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # 1. 依存パッケージの脆弱性チェック
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --omit=dev --audit-level=high
        # high以上の脆弱性があればCIを失敗させる

  # 2. ESLint セキュリティチェック
  lint-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint security rules
        run: npx eslint src/ --config .eslintrc.security.js

  # 3. シークレットスキャン
  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # 全履歴を取得

      - name: Detect secrets
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified
```

---

## Pre-commit フック

コミット前にローカルでセキュリティチェックを実行します。

### Husky + lint-staged の設定

```bash
# Husky のインストール
npm install --save-dev husky lint-staged
npx husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --config .eslintrc.security.js"
    ]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
npm audit --omit=dev --audit-level=critical
```

### .env ファイルのコミット防止

```bash
# .husky/pre-commit に追加
# .env ファイルのコミットを防止
if git diff --cached --name-only | grep -qE '\.env'; then
  echo "ERROR: .env ファイルをコミットしようとしています！"
  echo "git reset HEAD .env でステージングから除外してください"
  exit 1
fi
```

---

## シークレットスキャン

ソースコードにハードコードされたシークレットを検出します。

### GitHub Secret Scanning

GitHubが自動的にリポジトリ内のシークレットを検出します。

```
検出されるシークレットの例:
├── AWS アクセスキー         AKIA...
├── GitHub トークン          ghp_...
├── Stripe API キー         sk_live_...
├── Google API キー          AIza...
├── JWT シークレット          長い文字列
└── データベースの接続文字列   postgresql://user:pass@...
```

### TruffleHog

Git履歴を含めてシークレットを検出するツールです。

```bash
# Docker で実行
docker run -it -v "$PWD:/pwd" trufflesecurity/trufflehog:latest \
  git file:///pwd --only-verified

# 出力例
Found verified result
Detector Type: AWS
Raw: AKIAIOSFODNN7EXAMPLE
File: src/config.ts
Line: 15
Commit: a1b2c3d4
```

---

## ワークフローの全体像

```yaml
# 推奨するCI/CDセキュリティパイプライン

開発時（ローカル）:
  └── Pre-commit hook
      ├── ESLint security rules
      ├── .env コミット防止
      └── npm audit (critical)

PR作成時（CI）:
  ├── npm audit (high+)
  ├── ESLint security check
  ├── CodeQL analysis
  ├── Secret scanning
  └── Dependency review

マージ後（CD）:
  ├── DAST (ZAP baseline)
  └── Container scan (Docker image)

定期実行（Schedule）:
  ├── npm audit (weekly)
  ├── DAST full scan (weekly)
  └── Dependency update (Dependabot)
```

### GitHub Actions のスケジュール実行

```yaml
# 毎週月曜日にフルセキュリティスキャンを実行
on:
  schedule:
    - cron: '0 9 * * 1'  # 毎週月曜 9:00 UTC

jobs:
  full-security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm audit
      - name: OWASP ZAP Full Scan
        uses: zaproxy/action-full-scan@v0.10.0
        with:
          target: 'https://staging.example.com'
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| シフトレフト | セキュリティチェックを開発の早い段階で実行 |
| Pre-commit | コミット前にローカルでチェック |
| CI/CD | PRごとに自動的にセキュリティチェック |
| シークレットスキャン | ハードコードされたシークレットを検出 |
| 定期実行 | 週次でフルスキャンを実行 |

### チェックリスト

- [ ] シフトレフトの概念を理解した
- [ ] GitHub Actionsでのセキュリティワークフローの設定を理解した
- [ ] Pre-commitフックの設定方法を理解した
- [ ] シークレットスキャンの重要性を理解した

---

## 次のステップへ

CI/CDへのセキュリティチェック組み込みを学びました。
次のセクションでは、実際にセキュリティパイプラインを構築する演習に取り組みます。

---

*推定読了時間: 25分*
