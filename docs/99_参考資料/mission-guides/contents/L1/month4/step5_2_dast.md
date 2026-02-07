# DAST（動的解析）の基本

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 5
subStep: 2
title: "DAST（動的解析）の基本"
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

> 「SASTはコードを見て問題を見つける。でも、実際に動かしてみないと分からない問題もある」
>
> 高橋さんが説明する。
>
> 「設定ミス、ヘッダーの漏れ、実行時に現れる脆弱性。
> これらは**DAST**で見つける。実際にリクエストを送って、レスポンスを分析するんだ」
>
> 「侵入テストのようなものですか？」
>
> 「基本的な考え方は同じだ。ただし自動化されたツールが、攻撃者と同じような
> リクエストを体系的に送信してくれる」

---

## DASTとは

DAST（Dynamic Application Security Testing）は、実行中のアプリケーションに対して外部からテストを行い、脆弱性を検出する手法です。

```
SAST と DAST の違い:

SAST（静的解析）:
  対象: ソースコード
  タイミング: 開発中（コードを書いたとき）
  視点: 内部から（コードを読む）
  得意: インジェクション、ハードコードシークレット

DAST（動的解析）:
  対象: 実行中のアプリケーション
  タイミング: テスト環境でのデプロイ後
  視点: 外部から（攻撃者の目線）
  得意: 設定ミス、ヘッダー漏れ、認証の問題
```

---

## OWASP ZAP

OWASP ZAP（Zed Attack Proxy）は、最も広く使われている無料のDASTツールです。

### 主な機能

```
OWASP ZAP の機能:
├── パッシブスキャン    リクエスト/レスポンスを傍受して分析
├── アクティブスキャン   脆弱性テスト用のリクエストを自動送信
├── スパイダー         Webサイトを自動巡回してURLを発見
├── ファジング         パラメータに様々な値を入力してテスト
├── プロキシ           リクエストの傍受・改変が可能
└── レポート生成       HTML/JSON形式で結果をレポート
```

### Docker での実行

```bash
# 基本スキャン（ベースラインスキャン）
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t https://your-app.example.com \
  -r report.html

# フルスキャン（より詳細だが時間がかかる）
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py \
  -t https://your-app.example.com \
  -r full-report.html

# API スキャン（REST API向け）
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py \
  -t https://your-app.example.com/openapi.json \
  -f openapi \
  -r api-report.html
```

### ZAPの検出結果例

```
WARN-NEW: X-Frame-Options Header Not Set [10020]
  Risk: Medium
  URL: https://your-app.example.com/
  Solution: X-Frame-Options ヘッダーを DENY または SAMEORIGIN に設定

WARN-NEW: Cookie Without SameSite Attribute [10054]
  Risk: Low
  URL: https://your-app.example.com/login
  Cookie: session_id
  Solution: SameSite=Strict または Lax を設定

FAIL-NEW: SQL Injection [40018]
  Risk: High
  URL: https://your-app.example.com/api/search?q=test
  Parameter: q
  Attack: ' OR '1'='1' --
  Solution: パラメータ化クエリを使用
```

---

## Burp Suite（概要）

PortSwigger社の有料のWebセキュリティテストツールです。Community Edition（無料版）もあります。

### 主な機能

| 機能 | 説明 | 無料版 |
|------|------|--------|
| Proxy | HTTP/HTTPSトラフィックの傍受 | あり |
| Scanner | 自動脆弱性スキャン | なし（有料のみ） |
| Intruder | パラメータの自動テスト | 制限あり |
| Repeater | リクエストの手動改変と再送 | あり |
| Decoder | エンコード/デコード | あり |

---

## ペネトレーションテストの概念

### ペネトレーションテストとは

実際の攻撃者と同じ手法でシステムに侵入を試み、脆弱性を発見するテストです。

```
ペネトレーションテストの流れ:

1. 偵察（Reconnaissance）
   → ターゲットの情報収集（公開情報、ネットワーク構成）

2. スキャン（Scanning）
   → ポートスキャン、脆弱性スキャン

3. 侵入（Exploitation）
   → 発見した脆弱性を利用して侵入を試行

4. 権限昇格（Privilege Escalation）
   → より高い権限を取得

5. 報告（Reporting）
   → 発見事項の報告と対策の提案
```

### ペネトレーションテストの種類

| 種類 | 説明 |
|------|------|
| ブラックボックス | 内部情報なし。攻撃者と同じ条件 |
| ホワイトボックス | ソースコード、アーキテクチャ情報あり |
| グレーボックス | 限定的な内部情報あり |

**注意**: ペネトレーションテストは必ず許可を得てから実施してください。無許可のテストは不正アクセスとして法的に処罰される可能性があります。

---

## SAST と DAST の組み合わせ

| 観点 | SAST | DAST |
|------|------|------|
| 検出タイミング | 早い（開発中） | 遅い（デプロイ後） |
| 偽陽性 | 多い | 少ない |
| コード特定 | 可能（行番号レベル） | 困難 |
| 設定ミスの検出 | 困難 | 得意 |
| 網羅性 | コードの全行を分析 | テスト可能なURLのみ |
| 実行コスト | 低い | 中〜高い |

```
推奨する使い分け:

開発中     → SAST（ESLint, CodeQL）
PR作成時   → SAST + SCA
テスト環境  → DAST（ZAP baseline scan）
リリース前  → DAST（ZAP full scan）+ ペネトレーションテスト
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| DAST | 実行中のアプリに外部からテストを実行 |
| OWASP ZAP | 無料のDASTツール。Docker で簡単に実行可能 |
| Burp Suite | 有料のプロフェッショナル向けツール |
| ペネトレーションテスト | 攻撃者と同じ手法でセキュリティを検証 |
| 組み合わせ | SASTとDASTを組み合わせてカバレッジを最大化 |

### チェックリスト

- [ ] DASTの仕組みを理解した
- [ ] OWASP ZAPの基本的な使い方を把握した
- [ ] ペネトレーションテストの概念を理解した
- [ ] SASTとDASTの使い分けを理解した

---

## 次のステップへ

DASTの基本を学びました。
次のセクションでは、**依存パッケージの脆弱性管理**について学びます。

---

*推定読了時間: 25分*
