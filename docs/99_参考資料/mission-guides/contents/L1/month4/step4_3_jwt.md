# JWTの仕組みを理解しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 4
subStep: 3
title: "JWTの仕組みを理解しよう"
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

> 「セッションベースの認証は分かった。でも今のアプリケーションでは、
> **JWT**がよく使われる」高橋さんが言う。
>
> 「JWTってなんですか？」
>
> 「JSON Web Token。トークンそのものにユーザー情報を含めて、
> サーバーにセッション情報を保持しなくてもユーザーを識別できる仕組みだ。
> マイクロサービスやSPAとの相性が良いんだ」

---

## JWTとは

JWT（JSON Web Token、「ジョット」と読む）は、JSON形式の情報を安全にやり取りするためのトークン規格です。

### JWTの構造

JWTは3つのパートをドット（`.`）で連結した文字列です。

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IueUsOS4rSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE2NDAwMDM2MDB9.SIGNATURE

│          Header          │            Payload              │  Signature │
```

### 1. Header（ヘッダー）

アルゴリズムとトークンの種類を指定します。

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Base64Urlでエンコード → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

### 2. Payload（ペイロード）

トークンに含める情報（クレーム）を格納します。

```json
{
  "sub": "1234567890",
  "name": "田中",
  "role": "user",
  "iat": 1640000000,
  "exp": 1640003600
}
```

| クレーム | 名前 | 説明 |
|---------|------|------|
| sub | Subject | ユーザーID |
| iat | Issued At | トークン発行時刻 |
| exp | Expiration | トークンの有効期限 |
| iss | Issuer | トークンの発行者 |
| aud | Audience | トークンの対象者 |

**重要**: ペイロードは暗号化されていません。Base64Urlエンコードされているだけなので、誰でもデコードして中身を読めます。**機密情報（パスワード等）をペイロードに含めてはいけません。**

### 3. Signature（署名）

ヘッダーとペイロードが改ざんされていないことを検証するための署名です。

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

署名の検証:
- サーバーだけが知っている秘密鍵で署名を生成
- トークンを受け取ったとき、同じ秘密鍵で署名を再計算
- 一致すればトークンは改ざんされていない

---

## JWTの実装

### トークンの生成と検証

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!; // 環境変数から取得
const ACCESS_TOKEN_EXPIRY = '15m';          // アクセストークン: 15分
const REFRESH_TOKEN_EXPIRY = '7d';          // リフレッシュトークン: 7日

// アクセストークンの生成
function generateAccessToken(user: { id: string; role: string }): string {
  return jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

// リフレッシュトークンの生成
function generateRefreshToken(user: { id: string }): string {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

// トークンの検証
function verifyToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
}
```

### 認証ミドルウェア

```typescript
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub!, role: payload.role };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## アクセストークンとリフレッシュトークン

### なぜ2種類必要なのか

```
アクセストークンだけの場合:
  有効期限が短い(15分) → ユーザーが頻繁にログインし直す必要がある
  有効期限が長い(7日)  → 盗まれた場合のリスクが大きい

2種類のトークンを使う場合:
  アクセストークン: 短い有効期限（15分）→ APIアクセスに使用
  リフレッシュトークン: 長い有効期限（7日）→ 新しいアクセストークンの取得に使用
```

### リフレッシュフロー

```
クライアント                         サーバー
    │                                 │
    │── POST /login ───────────────→  │
    │←── {accessToken, refreshToken} ─│
    │                                 │
    │── GET /api/data ─────────────→  │ ← アクセストークンで認証
    │   Authorization: Bearer {AT}    │
    │←── {data: ...} ────────────────│
    │                                 │
    │  （15分後、アクセストークン期限切れ）│
    │                                 │
    │── GET /api/data ─────────────→  │
    │←── 401 Token expired ──────────│
    │                                 │
    │── POST /auth/refresh ────────→  │ ← リフレッシュトークンで更新
    │   {refreshToken}                │
    │←── {accessToken (new)} ────────│
    │                                 │
    │── GET /api/data ─────────────→  │ ← 新しいアクセストークンで認証
    │   Authorization: Bearer {newAT} │
    │←── {data: ...} ────────────────│
```

### リフレッシュエンドポイントの実装

```typescript
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const payload = verifyToken(refreshToken);

    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // リフレッシュトークンがDBで無効化されていないか確認
    const isRevoked = await db.isTokenRevoked(refreshToken);
    if (isRevoked) {
      return res.status(401).json({ error: 'Token revoked' });
    }

    // 新しいアクセストークンを発行
    const user = await db.findUserById(payload.sub);
    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

---

## JWTのセキュリティ上の注意点

### 1. 秘密鍵の管理

```typescript
// 危険: ハードコード
const JWT_SECRET = 'my-secret-key';

// 安全: 環境変数 + 十分な長さ
const JWT_SECRET = process.env.JWT_SECRET; // 最低256ビット（32文字以上）
```

### 2. アルゴリズムの指定

```typescript
// 危険: アルゴリズム未指定
jwt.verify(token, secret);

// 安全: アルゴリズムを明示的に指定
jwt.verify(token, secret, { algorithms: ['HS256'] });
// 'none' アルゴリズム攻撃を防ぐ
```

### 3. ペイロードに機密情報を含めない

```typescript
// 危険: パスワードや個人情報を含める
jwt.sign({ sub: user.id, password: user.password, creditCard: '...' }, secret);

// 安全: 最小限の情報のみ
jwt.sign({ sub: user.id, role: user.role }, secret);
```

### 4. トークンの保存場所

```
ブラウザでの保存場所:
├── localStorage       → XSSで盗まれる可能性（簡単だが要注意）
├── sessionStorage     → タブを閉じると消える
├── HttpOnly Cookie    → XSSでは盗めない（CSRFに注意）
└── メモリ（変数）      → リロードで消える（最も安全だが不便）

推奨:
  アクセストークン → メモリまたは短命のCookie
  リフレッシュトークン → HttpOnly, Secure, SameSite Cookie
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| JWT構造 | Header.Payload.Signature の3パート |
| ペイロード | 暗号化されていない（機密情報を含めない） |
| 署名 | トークンの改ざんを検出 |
| リフレッシュ | 短命のアクセストークン + 長命のリフレッシュトークン |
| 保存場所 | HttpOnly Cookieが推奨 |

### チェックリスト

- [ ] JWTの3つのパート（Header, Payload, Signature）を説明できる
- [ ] ペイロードが暗号化されていないことを理解した
- [ ] アクセストークンとリフレッシュトークンの役割を理解した
- [ ] JWTのセキュリティ上の注意点を把握した

---

## 次のステップへ

JWTの仕組みを理解しました。
次のセクションでは、外部サービスを利用した認証の標準規格である**OAuth 2.0**を学びます。

---

*推定読了時間: 30分*
