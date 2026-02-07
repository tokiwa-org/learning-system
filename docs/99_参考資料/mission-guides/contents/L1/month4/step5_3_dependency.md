# 依存パッケージの脆弱性管理

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 5
subStep: 3
title: "依存パッケージの脆弱性管理"
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

> 「自分が書いたコードだけが脆弱性の源じゃない」
>
> 高橋さんが `package.json` を画面に映す。
>
> 「見てくれ。このプロジェクトには200以上の依存パッケージがある。
> その中の1つにでも脆弱性があれば、それは自分たちのアプリの脆弱性になる」
>
> 「200以上......全部チェックするのは無理では？」
>
> 「手動では無理だ。だから**SCA（Software Composition Analysis）**ツールを使う。
> 依存パッケージの脆弱性を自動的に検出して、通知してくれるツールだ」

---

## なぜ依存パッケージの管理が重要なのか

### 現実のデータ

```
一般的なNode.jsプロジェクトの依存関係:
  直接の依存: 20-50 パッケージ
  間接の依存: 200-1000+ パッケージ
  → 自分が書いたコードより、依存パッケージのコードの方が圧倒的に多い
```

### 有名な事例

| 事例 | 概要 | 影響 |
|------|------|------|
| Log4Shell (2021) | Java の Log4j ライブラリの脆弱性 | 世界中のシステムに影響。リモートコード実行 |
| event-stream (2018) | npm パッケージにマルウェアが混入 | 仮想通貨ウォレットの秘密鍵が窃取された |
| ua-parser-js (2021) | npm パッケージがハイジャックされ、マルウェア入りバージョンが配布 | 暗号通貨マイナーが埋め込まれた |

---

## CVE（Common Vulnerabilities and Exposures）

CVEは、セキュリティ脆弱性に付与される一意の識別番号です。

```
CVE番号の例:
  CVE-2021-44228 (Log4Shell)
  CVE-2023-44487 (HTTP/2 Rapid Reset)

形式: CVE-[年]-[連番]
```

### CVSSスコア

脆弱性の深刻度を0.0〜10.0のスコアで表します。

| スコア | 深刻度 | 対応の緊急度 |
|--------|--------|------------|
| 9.0-10.0 | Critical | 即座に対応 |
| 7.0-8.9 | High | 早急に対応 |
| 4.0-6.9 | Medium | 計画的に対応 |
| 0.1-3.9 | Low | 次回メンテナンス時に対応 |

---

## npm audit

Node.jsプロジェクトの標準ツールです。

### 基本的な使い方

```bash
# 脆弱性のチェック
npm audit

# 出力例
┌───────────────┬──────────────────────────────────────┐
│ High          │ Prototype Pollution in lodash         │
├───────────────┼──────────────────────────────────────┤
│ Package       │ lodash                                │
│ Dependency of │ express                               │
│ Path          │ express > lodash                      │
│ More info     │ https://github.com/advisories/GHSA-xx │
└───────────────┘

found 3 vulnerabilities (1 low, 1 moderate, 1 high)

# 自動修正
npm audit fix

# 破壊的変更を含む修正
npm audit fix --force  # 注意: テストが必要

# 本番依存のみチェック
npm audit --omit=dev

# JSON形式で出力
npm audit --json > audit-report.json
```

---

## Dependabot

GitHubの依存パッケージ自動更新サービスです。

### 設定ファイル

```yaml
# .github/dependabot.yml
version: 2
updates:
  # npm パッケージ
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    reviewers:
      - "security-team"
    labels:
      - "dependencies"
      - "security"
    open-pull-requests-limit: 10

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Dependabotの動作

```
1. 毎週、依存パッケージの新バージョンを確認
2. 脆弱性修正を含むアップデートがあればPRを自動作成
3. PRにはバージョン差分、変更内容、互換性情報が含まれる
4. CIテストが通ればマージ
```

---

## Snyk

依存パッケージの脆弱性チェックに加え、コード解析も行えるツールです。

### CLIでの使用

```bash
# インストール
npm install -g snyk

# 認証
snyk auth

# 依存パッケージのテスト
snyk test

# 出力例
Testing /path/to/project...

✗ High severity vulnerability found in express
  Description: Open Redirect in express
  Info: https://snyk.io/vuln/SNYK-JS-EXPRESS-6474509
  Introduced through: express@4.17.1
  From: express@4.17.1
  Fix: Upgrade to express@4.19.2

✗ Medium severity vulnerability found in jsonwebtoken
  Description: Insecure Default
  Introduced through: jsonwebtoken@8.5.1
  Fix: Upgrade to jsonwebtoken@9.0.0

Tested 247 dependencies for known vulnerabilities
found 2 vulnerabilities (1 high, 1 medium)

# 継続的な監視を設定
snyk monitor
```

### Snyk の GitHub 連携

```
Snyk が PR に自動でコメント:

┌─────────────────────────────────────────┐
│ Snyk Security Check                      │
│                                          │
│ ✗ 1 new vulnerability introduced         │
│                                          │
│ HIGH: SQL Injection in mysql2 < 3.6.3    │
│ Fix: Upgrade mysql2 to >= 3.6.3          │
│                                          │
│ [View Details] [Fix This]                │
└─────────────────────────────────────────┘
```

---

## ロックファイルの重要性

### なぜロックファイルが重要か

```
package.json:
  "express": "^4.17.0"  ← 4.17.0以上4.x系の最新版をインストール
                           → バージョンが変わる可能性がある

package-lock.json:
  "express": "4.19.2"   ← 正確なバージョンを固定
                           → 全環境で同じバージョンが使われる
```

### セキュリティ上の意味

```
ロックファイルがないリスク:
1. 開発環境: express@4.17.1 をインストール
2. 本番環境: express@4.18.0 をインストール（依存が異なる）
3. 4.18.0 に脆弱性が見つかっても、開発環境では再現しない
4. テストが通っていても本番で問題が発生する

ロックファイルがあると:
1. 開発環境: express@4.19.2 をインストール
2. 本番環境: express@4.19.2 をインストール（同じバージョン）
3. 全環境で同じ依存関係 → テスト結果が信頼できる
```

**必ずロックファイルをコミットしてください。**

---

## まとめ

| ポイント | 内容 |
|----------|------|
| SCA | 依存パッケージの既知の脆弱性をチェック |
| npm audit | Node.js標準の脆弱性チェックツール |
| Dependabot | GitHubの自動依存パッケージ更新 |
| Snyk | 包括的な脆弱性チェック + コード解析 |
| ロックファイル | 必ずコミットして全環境で同じ依存関係を保証 |

### チェックリスト

- [ ] CVE/CVSSの意味を理解した
- [ ] npm audit の使い方を理解した
- [ ] Dependabotの設定方法を把握した
- [ ] ロックファイルの重要性を理解した

---

## 次のステップへ

依存パッケージの脆弱性管理を学びました。
次のセクションでは、これらのツールを**CI/CDパイプライン**に組み込む方法を学びます。

---

*推定読了時間: 25分*
