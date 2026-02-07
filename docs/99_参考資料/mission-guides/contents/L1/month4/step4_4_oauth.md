# OAuth 2.0フローを理解しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 4
subStep: 4
title: "OAuth 2.0フローを理解しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "認証・認可"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「JWTは自前の認証システムだ。でも実際のサービスでは、
> GoogleやGitHubアカウントでログインする機能をよく見るだろう？」
>
> 高橋さんが問いかける。
>
> 「ソーシャルログインですね。あれはどういう仕組みなんですか？」
>
> 「あれが**OAuth 2.0**だ。ユーザーのパスワードを預からずに、
> 外部サービスの認証を利用できる仕組みだ。
> パスワードを管理するリスクを減らせるメリットがある」

---

## OAuth 2.0とは

OAuth 2.0は、サードパーティのアプリケーションがユーザーのリソースに安全にアクセスするための**認可フレームワーク**です。

### 従来のやり方の問題

```
パスワードを直接共有する方式（危険）:

ユーザー: 「サービスAにGoogleの連絡先を使わせたい」
サービスA: 「Googleのパスワードを教えてください」
ユーザー: 「パスワードは abc123 です」

問題:
- サービスAにGoogleの全権限を渡してしまう
- サービスAがパスワードを保存するリスク
- パスワード変更時に全サービスに再通知が必要
```

### OAuth 2.0の解決策

```
OAuth 2.0 方式（安全）:

ユーザー: 「サービスAにGoogleの連絡先を使わせたい」
サービスA: 「Googleにリダイレクトします」
Google: 「サービスAに連絡先へのアクセスを許可しますか？」
ユーザー: 「許可します」
Google: 「サービスA、これがアクセストークンです（連絡先のみ）」

メリット:
- パスワードを共有しない
- 必要な権限のみを許可
- いつでも権限を取り消せる
```

---

## OAuth 2.0の登場人物

| 役割 | 説明 | 例 |
|------|------|-----|
| Resource Owner | リソースの所有者 | ユーザー |
| Client | リソースへのアクセスを求めるアプリ | あなたのWebアプリ |
| Authorization Server | 認可を管理するサーバー | Google、GitHub |
| Resource Server | リソースを提供するサーバー | Google API、GitHub API |

---

## 認可コードフロー（Authorization Code Flow）

最も安全で推奨されるフローです。

```
ユーザー        クライアント（あなたのアプリ）     認可サーバー（Google）
  │                    │                           │
  │  1. ログインボタンクリック                        │
  │──────────────→     │                           │
  │                    │  2. 認可リクエスト           │
  │                    │─────────────────────────→  │
  │                    │                           │
  │  3. ログイン画面を表示                           │
  │←─────────────────────────────────────────────  │
  │                    │                           │
  │  4. ログイン + 権限の許可                        │
  │──────────────────────────────────────────────→ │
  │                    │                           │
  │                    │  5. 認可コードを返す         │
  │  （リダイレクト）    │←─────────────────────────  │
  │←──────────────     │                           │
  │                    │                           │
  │                    │  6. 認可コード → トークン交換 │
  │                    │─────────────────────────→  │
  │                    │                           │
  │                    │  7. アクセストークン発行      │
  │                    │←─────────────────────────  │
  │                    │                           │
  │  8. ログイン完了    │                           │
  │←──────────────     │                           │
```

### 各ステップの詳細

#### Step 2: 認可リクエスト

```
GET https://accounts.google.com/o/oauth2/v2/auth?
  response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https://your-app.com/callback
  &scope=openid email profile
  &state=random_csrf_token
```

| パラメータ | 説明 |
|-----------|------|
| response_type | `code` を指定（認可コードフロー） |
| client_id | アプリのID（事前登録で取得） |
| redirect_uri | 認可後のリダイレクト先 |
| scope | 要求する権限 |
| state | CSRF対策のランダム値 |

#### Step 5: 認可コードの受け取り

```
GET https://your-app.com/callback?
  code=AUTHORIZATION_CODE
  &state=random_csrf_token
```

#### Step 6: トークン交換

```typescript
// サーバーサイドで認可コードをトークンに交換
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    code: authorizationCode,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!, // サーバーサイドのみ
    redirect_uri: 'https://your-app.com/callback',
    grant_type: 'authorization_code'
  })
});

const { access_token, refresh_token, id_token } = await tokenResponse.json();
```

---

## OpenID Connect（OIDC）

OAuth 2.0は「認可」のための仕組みですが、OpenID Connectは OAuth 2.0の上に「認証」のレイヤーを追加した規格です。

```
OAuth 2.0:
  「サービスAにGoogleの連絡先へのアクセスを許可する」（認可）

OpenID Connect:
  「このユーザーは Google アカウント tanaka@gmail.com である」（認証）
  + OAuth 2.0 の認可機能
```

### ID Token

OpenID Connect では、アクセストークンに加えて**IDトークン**（JWT形式）が発行されます。

```json
{
  "iss": "https://accounts.google.com",
  "sub": "1234567890",
  "email": "tanaka@gmail.com",
  "name": "田中太郎",
  "picture": "https://...",
  "iat": 1640000000,
  "exp": 1640003600
}
```

---

## ソーシャルログインの実装概要

### Express での実装例（Passport.js）

```typescript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    // ユーザーをDBで検索または新規作成
    let user = await db.findUserByGoogleId(profile.id);

    if (!user) {
      user = await db.createUser({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value
      });
    }

    done(null, user);
  }
));

// ログイン開始
app.get('/auth/google', passport.authenticate('google', {
  scope: ['openid', 'email', 'profile']
}));

// コールバック
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // ログイン成功 → JWTを発行
    const token = generateAccessToken(req.user);
    res.redirect(`/dashboard?token=${token}`);
  }
);
```

---

## OAuth 2.0のセキュリティ上の注意点

| 注意点 | 対策 |
|--------|------|
| CSRF攻撃 | stateパラメータでランダム値を検証 |
| 認可コードの横取り | PKCE（Proof Key for Code Exchange）を使用 |
| リダイレクトURIの改ざん | 事前登録したURIのみ許可 |
| client_secretの漏洩 | サーバーサイドでのみ使用、環境変数で管理 |
| トークンの過剰な権限 | 必要最小限のscopeのみ要求 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| OAuth 2.0 | パスワードを共有せずに権限を委譲する仕組み |
| 認可コードフロー | 最も安全な推奨フロー |
| OpenID Connect | OAuth 2.0 + 認証（IDトークン） |
| ソーシャルログイン | Google/GitHub等のアカウントでログイン |

### チェックリスト

- [ ] OAuth 2.0の4つの登場人物を説明できる
- [ ] 認可コードフローの流れを理解した
- [ ] OAuth 2.0とOpenID Connectの違いを理解した
- [ ] stateパラメータの目的を理解した

---

## 次のステップへ

OAuth 2.0の仕組みを理解しました。
次のセクションでは、これまでの知識を活用して**認証システムを実装する演習**に取り組みます。

---

*推定読了時間: 30分*
