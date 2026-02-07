# CSRFとその他の攻撃手法

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 1
subStep: 5
title: "CSRFとその他の攻撃手法"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "セキュアコーディング"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「攻撃のパターンはまだある」高橋さんが続ける。
>
> 「SQLインジェクション、XSS以外にも、Webアプリケーションを脅かす攻撃手法は複数ある。
> 全部を深掘りする時間はないが、CSRF、クリックジャッキング、SSRFの概要は押さえておこう」
>
> 「敵の手口をできるだけ多く知っておく、ということですね」
>
> 「そうだ。知らない攻撃には対処できない。まず知ること。それが防御の第一歩だ」

---

## CSRF（クロスサイトリクエストフォージェリ）

### CSRFとは

CSRF（Cross-Site Request Forgery）は、ユーザーが意図しないリクエストを、ログイン済みのWebアプリケーションに対して送信させる攻撃です。

### 攻撃の流れ

```
1. ユーザーが銀行サイトにログイン中（セッション有効）
2. 攻撃者が罠サイトのリンクをメールで送信
3. ユーザーが罠サイトにアクセス
4. 罠サイトの裏で銀行サイトへの送金リクエストが自動送信される
5. ブラウザがCookieを自動付与するため、銀行サイトは正規のリクエストと判断
6. 送金が実行される
```

```
ユーザーのブラウザ
┌──────────────────────────────────────┐
│                                      │
│  タブ1: 銀行サイト（ログイン済み）       │
│  Cookie: session=abc123              │
│                                      │
│  タブ2: 罠サイト                      │
│  <img src="https://bank.com/         │
│    transfer?to=attacker&amount=100000">│
│  ↑ 画像読み込みに見せかけて送金リクエスト │
│  ↑ Cookie が自動的に付与される          │
│                                      │
└──────────────────────────────────────┘
```

### CSRFの具体例

```html
<!-- 攻撃者が作成した罠ページ -->
<html>
<body>
  <h1>おめでとうございます！プレゼントが当たりました！</h1>

  <!-- 隠しフォームで自動送信 -->
  <form id="csrf-form" action="https://bank.example.com/transfer" method="POST" style="display:none">
    <input name="to_account" value="attacker-account-123">
    <input name="amount" value="1000000">
  </form>

  <script>
    document.getElementById('csrf-form').submit();
  </script>
</body>
</html>
```

### CSRFへの対策

| 対策 | 説明 |
|------|------|
| CSRFトークン | フォームに推測不可能なトークンを埋め込み、サーバーで検証 |
| SameSite Cookie | `SameSite=Strict` または `Lax` でクロスサイトでのCookie送信を制限 |
| Refererチェック | リクエスト元のURLを検証 |
| 重要操作の再認証 | 送金など重要な操作時にパスワードの再入力を求める |

```typescript
// CSRFトークンの実装例
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.get('/transfer', csrfProtection, (req, res) => {
  res.render('transfer', { csrfToken: req.csrfToken() });
});

app.post('/transfer', csrfProtection, (req, res) => {
  // csrfProtection ミドルウェアが自動でトークンを検証
  // トークンが一致しなければ 403 エラー
  processTransfer(req.body);
});
```

---

## クリックジャッキング

### クリックジャッキングとは

透明なiframeを重ねて、ユーザーが意図しないボタンをクリックさせる攻撃です。

```
ユーザーに見えている画面:
┌────────────────────────────┐
│  無料プレゼント応募フォーム    │
│                            │
│  [応募する] ← ユーザーが    │
│              クリック       │
└────────────────────────────┘

実際の画面（透明なiframeが上に重なっている）:
┌────────────────────────────┐
│  アカウント設定              │
│                            │
│  [アカウント削除] ← 実際に  │
│                   押される  │
└────────────────────────────┘
```

```html
<!-- 攻撃者の罠ページ -->
<style>
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;        /* 透明にする */
    z-index: 10;       /* 最前面に配置 */
  }
</style>

<h1>無料プレゼント応募！</h1>
<button>応募する</button>

<!-- 透明なiframeでターゲットサイトを重ねる -->
<iframe src="https://target.com/settings/delete-account"></iframe>
```

### 対策

```typescript
// X-Frame-Options ヘッダーで iframe への埋め込みを禁止
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// CSP の frame-ancestors で制御（より現代的）
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  next();
});
```

---

## SSRF（サーバーサイドリクエストフォージェリ）

### SSRFとは

サーバーに内部ネットワークへのリクエストを実行させる攻撃です。

```
通常のリクエスト:
ユーザー → サーバー → 外部API（https://api.example.com）

SSRF攻撃:
攻撃者 → サーバー → 内部サービス（http://192.168.1.100/admin）
                  → メタデータ（http://169.254.169.254/）
                  → ローカル（http://localhost:3000/internal）
```

### 攻撃例

```typescript
// 脆弱なURL取得機能
app.get('/api/fetch-url', async (req, res) => {
  const url = req.query.url;
  const response = await fetch(url);  // ユーザー入力のURLにそのままリクエスト
  res.json(await response.json());
});

// 攻撃者のリクエスト:
// GET /api/fetch-url?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
// → AWS のIAMロールの認証情報が返される
```

### 対策

```typescript
// URLのバリデーション
import { URL } from 'url';

function isAllowedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // プライベートIPの禁止
    const hostname = url.hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.') ||
      hostname === '169.254.169.254'
    ) {
      return false;
    }

    // 許可するプロトコルの制限
    if (!['https:', 'http:'].includes(url.protocol)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
```

---

## その他の注意すべき攻撃手法

### ディレクトリトラバーサル

ファイルパスを操作して、本来アクセスできないファイルを読み取る攻撃です。

```typescript
// 脆弱なファイル提供
app.get('/download', (req, res) => {
  const filename = req.query.file;
  res.sendFile(`/uploads/${filename}`);
  // filename が "../../etc/passwd" だと、システムファイルが読まれる
});
```

### オープンリダイレクト

正規サイトのリダイレクト機能を悪用して、フィッシングサイトに誘導する攻撃です。

```
正規URL: https://example.com/login?redirect=/dashboard
攻撃URL: https://example.com/login?redirect=https://evil.com/fake-login
```

### HTTPヘッダーインジェクション

HTTPヘッダーに改行コードを挿入して、レスポンスを操作する攻撃です。

```
入力: "value\r\nSet-Cookie: admin=true"
→ 不正なCookieが設定される
```

---

## 攻撃手法の比較

| 攻撃 | ターゲット | 攻撃者の目的 | 主な対策 |
|------|-----------|-------------|---------|
| SQLi | データベース | データ窃取・改ざん | パラメータ化クエリ |
| XSS | ブラウザ | セッション乗っ取り | 出力エスケープ |
| CSRF | ユーザーの操作 | 不正な操作の実行 | CSRFトークン |
| クリックジャッキング | ユーザーのクリック | 意図しないクリック | X-Frame-Options |
| SSRF | サーバー | 内部ネットワークへのアクセス | URLバリデーション |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| CSRF | ログイン済みユーザーに不正なリクエストを送信させる |
| クリックジャッキング | 透明なiframeで意図しないクリックを誘導する |
| SSRF | サーバーを踏み台にして内部リソースにアクセスする |
| 共通の教訓 | ユーザー入力を信頼しない、適切な検証と制限を実装する |

### チェックリスト

- [ ] CSRFの仕組みとCSRFトークンによる対策を理解した
- [ ] クリックジャッキングの原理を理解した
- [ ] SSRFの危険性を理解した
- [ ] 各攻撃手法の違いと対策の概要を把握した

---

## 次のステップへ

Step 1で学んだ攻撃手法の知識を確認する理解度チェックに進みましょう。

ここまでの内容をしっかり復習してから挑戦してください。

---

*推定読了時間: 25分*
