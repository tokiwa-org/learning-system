# 脆弱性スキャンツール

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 2
subStep: 3
title: "脆弱性スキャンツール"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "DevSecOps"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「コードレビューは重要だが、人間の目だけでは限界がある」
>
> 高橋さんが言う。
>
> 「特に大規模なコードベースでは、全行をセキュリティ視点でレビューするのは現実的じゃない。
> だからツールの力を借りる。自動スキャンで広範囲をカバーし、人間のレビューは
> ツールが苦手な文脈やロジックの判断に集中する」
>
> 「ツールと人間の分業ですね」
>
> 「そういうことだ。代表的なツールを紹介しよう」

---

## ツールの種類

セキュリティツールは大きく3つのカテゴリに分類されます。

```
┌────────────────────────────────────────┐
│          セキュリティツール              │
├──────────┬──────────┬──────────────────┤
│   SAST   │   DAST   │   SCA            │
│ 静的解析  │ 動的解析  │ 依存関係チェック   │
│          │          │                  │
│ コードを  │ 動作中の  │ 使用ライブラリの   │
│ 読んで    │ アプリを  │ 既知の脆弱性を     │
│ 分析する  │ テストする │ チェックする      │
└──────────┴──────────┴──────────────────┘
```

| 種類 | 正式名称 | 対象 | タイミング |
|------|---------|------|-----------|
| SAST | Static Application Security Testing | ソースコード | 開発中・PR作成時 |
| DAST | Dynamic Application Security Testing | 実行中のアプリ | テスト環境 |
| SCA | Software Composition Analysis | 依存パッケージ | 開発中・CI/CD |

---

## npm audit

Node.jsプロジェクトで最も手軽に使える脆弱性チェックツールです。

### 基本的な使い方

```bash
# 脆弱性をチェック
npm audit

# 出力例
┌───────────────┬──────────────────────────────────────┐
│ High          │ Prototype Pollution                   │
├───────────────┼──────────────────────────────────────┤
│ Package       │ lodash                                │
│ Patched in    │ >=4.17.21                             │
│ Dependency of │ express                               │
│ Path          │ express > lodash                      │
│ More info     │ https://github.com/advisories/GHSA-xx │
└───────────────┴──────────────────────────────────────┘

found 3 vulnerabilities (1 low, 1 moderate, 1 high)

# 自動修正を試みる
npm audit fix

# 破壊的変更を含む修正も適用する（注意して使用）
npm audit fix --force

# JSON形式で出力（CI/CDでの解析用）
npm audit --json
```

### 重要度レベル

| レベル | 説明 |
|--------|------|
| critical | 即座に対応が必要 |
| high | 早急に対応すべき |
| moderate | 計画的に対応 |
| low | 把握しておく |

---

## Snyk

依存関係の脆弱性だけでなく、コードの脆弱性もチェックできるツールです。

### セットアップ

```bash
# Snyk CLI のインストール
npm install -g snyk

# 認証
snyk auth

# 依存関係の脆弱性チェック
snyk test

# コードの脆弱性チェック
snyk code test

# 継続的な監視を設定
snyk monitor
```

### 出力例

```
Testing /path/to/project...

✗ High severity vulnerability found in express
  Description: Open Redirect
  Info: https://snyk.io/vuln/SNYK-JS-EXPRESS-123456
  Introduced through: express@4.17.1
  From: express@4.17.1
  Fix: Upgrade to express@4.18.2

✗ Medium severity vulnerability found in jsonwebtoken
  Description: Insecure Default Configuration
  Info: https://snyk.io/vuln/SNYK-JS-JSONWEBTOKEN-789012
  Introduced through: jsonwebtoken@8.5.1

Organization: your-org
Package manager: npm
Target file: package.json
Project name: your-project
Tested 247 dependencies for known vulnerabilities, found 2 vulnerabilities
```

---

## SonarQube

コード品質とセキュリティを包括的に分析するプラットフォームです。

### 検出できる問題

```
セキュリティ:
├── SQLインジェクション
├── XSS
├── CSRF
├── ハードコードされた認証情報
├── 暗号化の不備
└── 入力バリデーションの欠如

コード品質:
├── バグの可能性
├── コードスメル
├── 重複コード
└── テストカバレッジ
```

### ルール例

```typescript
// SonarQube が検出する問題の例

// ルール: sql-injection
// 重要度: CRITICAL
const query = "SELECT * FROM users WHERE id = " + userId;
//            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ユーザー入力が直接SQLに埋め込まれています

// ルール: hardcoded-credentials
// 重要度: HIGH
const password = "admin123";
//               ^^^^^^^^^^
// パスワードがハードコードされています

// ルール: weak-cryptography
// 重要度: HIGH
const hash = crypto.createHash('md5').update(data).digest('hex');
//                              ^^^
// MD5は安全ではありません。SHA-256以上を使用してください
```

---

## OWASP ZAP（概要）

Webアプリケーションの動的解析（DAST）ツールです。

### 特徴

```
OWASP ZAP の主な機能:
├── 自動スキャン    → URLを指定するだけで自動的に脆弱性を検出
├── 手動テスト      → プロキシとして動作し、リクエストの改変が可能
├── スパイダー      → Webサイトを自動巡回してページを発見
├── ファジング      → パラメータに様々な値を入力してテスト
└── レポート生成    → 発見した脆弱性のレポートを出力
```

### 使い方の概要

```bash
# Docker で OWASP ZAP を起動
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t https://your-app.example.com

# 出力例
WARN-NEW: X-Frame-Options Header Not Set [10020]
WARN-NEW: Missing Anti-clickjacking Header [10020]
WARN-NEW: Cookie Without SameSite Attribute [10054]
WARN-NEW: CSP: Wildcard Directive [10055]
FAIL-NEW: SQL Injection [40018]
```

---

## ツールの比較と使い分け

| ツール | 種類 | 費用 | 導入の容易さ | 検出範囲 |
|--------|------|------|------------|---------|
| npm audit | SCA | 無料 | とても簡単 | 依存パッケージのみ |
| Snyk | SCA + SAST | 無料枠あり | 簡単 | 依存パッケージ + コード |
| SonarQube | SAST | Community無料 | 中程度 | コード品質 + セキュリティ |
| OWASP ZAP | DAST | 無料 | 中程度 | 実行中のアプリ全体 |

### 推奨する組み合わせ

```
開発フェーズ    → npm audit + ESLint security plugins（SAST）
PRレビュー     → Snyk / SonarQube（SAST + SCA）
テスト環境     → OWASP ZAP（DAST）
本番前チェック  → 全ツールの組み合わせ
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| SAST | ソースコードを静的に分析して脆弱性を発見 |
| DAST | 実行中のアプリケーションをテストして脆弱性を発見 |
| SCA | 依存パッケージの既知の脆弱性をチェック |
| 使い分け | 複数のツールを組み合わせてカバレッジを最大化 |

### チェックリスト

- [ ] SAST、DAST、SCAの違いを理解した
- [ ] npm audit の使い方を理解した
- [ ] Snyk、SonarQube、OWASP ZAP の概要を把握した
- [ ] ツールの使い分けのイメージを持てた

---

## 次のステップへ

脆弱性スキャンツールの全体像を把握しました。
次のセクションでは、**ログ分析**による攻撃検知の方法を学びます。

ツールだけでなく、ログから不審な動きを読み取る力も重要です。

---

*推定読了時間: 30分*
