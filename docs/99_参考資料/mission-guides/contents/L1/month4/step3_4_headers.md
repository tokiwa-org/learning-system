# セキュリティヘッダーを設定しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 3
subStep: 4
title: "セキュリティヘッダーを設定しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "セキュアコーディング"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「コードレベルの対策は整ってきた。最後にもう1つ重要な防御レイヤーがある」
>
> 高橋さんがブラウザの開発者ツールを開き、レスポンスヘッダーを表示した。
>
> 「HTTPレスポンスヘッダーだ。適切なセキュリティヘッダーを設定するだけで、
> ブラウザが自動的に多くの攻撃をブロックしてくれる」
>
> 「ヘッダーの設定だけで？」
>
> 「そうだ。コードを1行も変えずに、セキュリティを大幅に強化できる。
> 設定しない理由がない」

---

## 主要なセキュリティヘッダー

### 1. Content-Security-Policy (CSP)

前のセクションで学んだCSPは最も重要なセキュリティヘッダーです。

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

### 2. Strict-Transport-Security (HSTS)

ブラウザに対して、常にHTTPSで接続するよう指示します。

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

```
仕組み:
1. ユーザーが http://example.com にアクセス
2. ブラウザがHSTSヘッダーを記憶している場合
3. 自動的に https://example.com にリダイレクト
4. 中間者攻撃によるHTTPダウングレードを防止
```

| パラメータ | 説明 |
|-----------|------|
| max-age | HSTSを記憶する期間（秒）。31536000は1年 |
| includeSubDomains | サブドメインにも適用 |
| preload | ブラウザのプリロードリストに登録（初回アクセスから保護） |

### 3. X-Frame-Options

ページのiframeへの埋め込みを制御し、クリックジャッキングを防止します。

```
X-Frame-Options: DENY           → 全てのiframe埋め込みを禁止
X-Frame-Options: SAMEORIGIN     → 同一オリジンのみ許可
```

### 4. X-Content-Type-Options

ブラウザのMIMEタイプスニッフィングを無効化します。

```
X-Content-Type-Options: nosniff
```

```
攻撃シナリオ:
1. 攻撃者がJavaScriptを含む .jpg ファイルをアップロード
2. ブラウザが「これはJavaScriptだ」と判断してスクリプトを実行
3. nosniff ヘッダーがあれば、Content-Type に従い画像として処理
```

### 5. X-XSS-Protection

ブラウザの組み込みXSSフィルターを制御します。

```
X-XSS-Protection: 0
```

**注意**: 現代のブラウザではCSPが推奨されるため、このヘッダーは `0`（無効化）が推奨されます。古いXSSフィルターには逆にXSSを引き起こすバグがあるためです。

### 6. Referrer-Policy

リファラー情報の送信を制御します。

```
Referrer-Policy: strict-origin-when-cross-origin
```

| ポリシー | 説明 |
|---------|------|
| no-referrer | リファラーを一切送信しない |
| same-origin | 同一オリジンのみリファラーを送信 |
| strict-origin-when-cross-origin | クロスオリジンではオリジンのみ送信（推奨） |

### 7. Permissions-Policy

ブラウザの機能（カメラ、マイク、位置情報など）へのアクセスを制御します。

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

`()` は無効化を意味し、`(self)` は同一オリジンのみ許可です。

---

## CORS（Cross-Origin Resource Sharing）

異なるオリジン間のリソース共有を制御する仕組みです。

### 基本概念

```
オリジン = プロトコル + ドメイン + ポート

https://example.com:443  → 1つのオリジン
https://api.example.com  → 別のオリジン（サブドメインが異なる）
http://example.com       → 別のオリジン（プロトコルが異なる）
```

### 安全な設定

```typescript
import cors from 'cors';

// 危険: 全てのオリジンを許可
app.use(cors({ origin: '*' }));  // 本番では使わない

// 安全: 特定のオリジンのみ許可
app.use(cors({
  origin: ['https://www.example.com', 'https://admin.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Cookieの送信を許可
  maxAge: 86400       // プリフライトリクエストのキャッシュ期間（秒）
}));
```

---

## Cookie のセキュリティ属性

```typescript
// セキュアなCookie設定
res.cookie('session', sessionId, {
  httpOnly: true,     // JavaScriptからのアクセスを禁止（XSSでの窃取を防止）
  secure: true,       // HTTPS接続でのみ送信
  sameSite: 'strict', // クロスサイトリクエストではCookieを送信しない
  maxAge: 3600000,    // 有効期限（ミリ秒）
  path: '/',          // Cookieの有効パス
  domain: '.example.com' // Cookieの有効ドメイン
});
```

| 属性 | 目的 | 防ぐ攻撃 |
|------|------|---------|
| HttpOnly | JSからCookieにアクセスできない | XSS によるCookie窃取 |
| Secure | HTTPSでのみ送信 | 中間者攻撃での傍受 |
| SameSite=Strict | クロスサイトで送信しない | CSRF |
| SameSite=Lax | トップレベルナビゲーションのみ送信 | CSRF（ゆるい制限） |

---

## helmet.js で一括設定

helmet.js は、Express アプリケーションに推奨されるセキュリティヘッダーを一括で設定するミドルウェアです。

```typescript
import helmet from 'helmet';

// デフォルト設定（推奨ヘッダーが全て有効になる）
app.use(helmet());

// カスタム設定
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### helmet がデフォルトで設定するヘッダー

```
Content-Security-Policy:      default-src 'self'; ...
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy:   same-origin
Cross-Origin-Resource-Policy: same-origin
X-Content-Type-Options:       nosniff
X-DNS-Prefetch-Control:       off
X-Download-Options:           noopen
X-Frame-Options:              SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection:             0
Referrer-Policy:              no-referrer
Strict-Transport-Security:    max-age=15552000; includeSubDomains
```

---

## セキュリティヘッダーの確認方法

### ブラウザの開発者ツール

```
1. F12 で開発者ツールを開く
2. Network タブを選択
3. ページをリロード
4. リクエストを選択
5. Response Headers を確認
```

### コマンドラインで確認

```bash
curl -I https://example.com

# 出力例
HTTP/2 200
content-security-policy: default-src 'self'
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-frame-options: DENY
```

---

## まとめ

| ヘッダー | 防ぐ攻撃 |
|---------|---------|
| CSP | XSS、データインジェクション |
| HSTS | HTTPダウングレード、中間者攻撃 |
| X-Frame-Options | クリックジャッキング |
| X-Content-Type-Options | MIMEスニッフィング |
| Referrer-Policy | リファラー情報漏洩 |
| CORS | 不正なクロスオリジンリクエスト |
| Cookie属性 | XSS、CSRF、中間者攻撃 |

### チェックリスト

- [ ] 主要なセキュリティヘッダーの役割を理解した
- [ ] CORSの仕組みと安全な設定を理解した
- [ ] Cookieのセキュリティ属性を理解した
- [ ] helmet.js で一括設定できることを知った

---

## 次のステップへ

セキュリティヘッダーの設定方法を学びました。
次のセクションでは、Step 3の知識を活用して**脆弱なコードを修正する演習**に取り組みます。

---

*推定読了時間: 30分*
