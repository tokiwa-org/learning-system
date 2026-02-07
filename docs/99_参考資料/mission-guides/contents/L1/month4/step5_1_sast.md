# SAST（静的解析）ツールを使おう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 5
subStep: 1
title: "SAST（静的解析）ツールを使おう"
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

> 「ここまでの知識を活かして、次はセキュリティチェックを**自動化**する」
>
> 高橋さんが言う。
>
> 「人間のレビューには限界がある。全てのPRを細かくセキュリティレビューする時間はない。
> だからツールに任せられる部分は自動化し、人間はツールが苦手な部分に集中する」
>
> 「DevSecOpsの考え方ですね」
>
> 「その通りだ。開発プロセスの中にセキュリティを組み込む。
> まずは最も手軽に始められるSAST（静的解析）ツールから見ていこう」

---

## SASTとは

SAST（Static Application Security Testing）は、ソースコードを実行せずに静的に解析して、セキュリティ上の問題を検出する手法です。

```
SAST の位置づけ:
コーディング → [SAST] → コードレビュー → テスト → デプロイ
               ↑
          ここで問題を早期発見
```

### メリットとデメリット

| メリット | デメリット |
|---------|-----------|
| コードを実行せずに分析できる | 偽陽性（誤検出）が多い場合がある |
| 開発初期段階で問題を発見できる | 実行時の文脈（設定、環境）を把握できない |
| 問題のある具体的なコード行を特定できる | 認証フローなどのロジックの問題は検出しにくい |
| CI/CDに組み込みやすい | ツールごとに対応言語が異なる |

---

## ESLint セキュリティプラグイン

Node.js/TypeScriptプロジェクトで最も手軽に始められるSASTツールです。

### セットアップ

```bash
# プラグインのインストール
npm install --save-dev eslint-plugin-security eslint-plugin-no-unsanitized
```

### 設定ファイル

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['security', 'no-unsanitized'],
  extends: [
    'plugin:security/recommended',
    'plugin:no-unsanitized/DOM'
  ],
  rules: {
    // eval() の使用を禁止
    'security/detect-eval-with-expression': 'error',

    // 非リテラルの require() を警告
    'security/detect-non-literal-require': 'warn',

    // 非リテラルの fs メソッドを警告（パストラバーサル対策）
    'security/detect-non-literal-fs-filename': 'warn',

    // child_process の使用を警告
    'security/detect-child-process': 'warn',

    // innerHTML の使用を禁止
    'no-unsanitized/property': 'error',

    // document.write の使用を禁止
    'no-unsanitized/method': 'error',
  }
};
```

### 検出例

```typescript
// ESLint が検出する問題

// security/detect-eval-with-expression
eval(userInput);  // error: eval() の使用が検出されました

// security/detect-non-literal-fs-filename
fs.readFile(userInput, callback);  // warn: 非リテラルのファイル名

// no-unsanitized/property
element.innerHTML = userInput;  // error: innerHTML に未サニタイズの値
```

---

## SonarQube / SonarCloud

より包括的なコード品質・セキュリティ分析プラットフォームです。

### SonarQube のセキュリティルール例

```
重要度: CRITICAL
├── sql-injection           SQL インジェクション
├── command-injection       コマンドインジェクション
├── path-traversal          パストラバーサル
└── weak-cryptography       弱い暗号化アルゴリズム

重要度: HIGH
├── xss                     クロスサイトスクリプティング
├── hardcoded-credentials   ハードコードされた認証情報
├── insecure-cookie         セキュアでないCookie設定
└── open-redirect           オープンリダイレクト

重要度: MEDIUM
├── weak-password           弱いパスワードポリシー
├── information-exposure    情報漏洩
└── insufficient-logging    不十分なログ記録
```

### SonarCloud の導入（GitHub連携）

```yaml
# sonar-project.properties
sonar.projectKey=your-project-key
sonar.organization=your-org
sonar.sources=src
sonar.tests=tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

---

## CodeQL

GitHubが提供する無料のセマンティックコード分析ツールです。

### 特徴

```
CodeQL の強み:
├── データフロー分析      入力から出力までの値の流れを追跡
├── コントロールフロー分析  条件分岐を考慮した分析
├── 言語サポート          JavaScript, TypeScript, Python, Java, Go, etc.
└── GitHub統合           PRに自動的にコメントを追加
```

### GitHub Actions での設定

```yaml
# .github/workflows/codeql.yml
name: CodeQL Analysis

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write

    steps:
      - uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
```

### CodeQLが検出する問題の例

```
Query: js/sql-injection
Description: ユーザー入力がSQLクエリに直接埋め込まれています

Source: req.query.name (line 5)
  → Flow: req.query.name → variable 'name' → template literal → db.query()
Sink: db.query(query) (line 8)

Recommendation: パラメータ化クエリを使用してください
```

---

## ツールの比較

| ツール | 費用 | 導入の容易さ | 検出精度 | CI/CD統合 |
|--------|------|------------|---------|----------|
| ESLint plugins | 無料 | とても簡単 | 基本的 | 簡単 |
| SonarQube CE | 無料 | 中程度 | 高い | 中程度 |
| SonarCloud | 無料（OSS） | 簡単 | 高い | 簡単 |
| CodeQL | 無料 | 簡単 | 非常に高い | GitHub統合 |

### 推奨する導入順序

```
Step 1: ESLint security plugins（すぐ始められる）
Step 2: CodeQL（GitHubリポジトリなら無料で簡単）
Step 3: SonarCloud/SonarQube（より包括的な分析が必要な場合）
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| SAST | ソースコードを静的に分析して脆弱性を検出 |
| ESLint | 最も手軽。security/no-unsanitizedプラグイン |
| SonarQube | 包括的なコード品質・セキュリティ分析 |
| CodeQL | GitHubの無料ツール。データフロー分析が強力 |

### チェックリスト

- [ ] SASTの仕組みとメリット・デメリットを理解した
- [ ] ESLintセキュリティプラグインの設定方法を理解した
- [ ] SonarQubeとCodeQLの概要を把握した
- [ ] ツールの使い分けイメージを持てた

---

## 次のステップへ

SASTツールを学びました。
次のセクションでは、実行中のアプリケーションをテストする**DAST（動的解析）**を学びます。

---

*推定読了時間: 25分*
