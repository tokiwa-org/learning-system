# 演習：認証システムを実装しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 4
subStep: 5
title: "演習：認証システムを実装しよう"
itemType: EXERCISE
estimatedMinutes: 120
noiseLevel: MINIMAL
roadmap:
  skill: "認証・認可"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「理論は十分だ。実際に認証システムを実装してもらおう」
>
> 高橋さんがホワイトボードにフロー図を描きながら言う。
>
> 「ユーザー登録、ログイン、トークンの発行と検証、保護されたルートへのアクセス、
> トークンのリフレッシュ。この一連の流れを実装してくれ」
>
> 「本格的な認証システムですね」
>
> 「これが実務で最もよく使われるパターンだ。完成させれば大きな自信になるぞ」

---

## 演習の概要

JWTベースの認証フローを持つAPIサーバーを設計・実装してください。

| パート | テーマ | 難易度 |
|--------|--------|--------|
| Part 1 | ユーザー登録 | 初級 |
| Part 2 | ログインとトークン発行 | 中級 |
| Part 3 | 認証ミドルウェア | 中級 |
| Part 4 | トークンリフレッシュ | 中級 |
| Part 5 | ロールベースアクセス制御 | 上級 |

---

## Part 1: ユーザー登録（20分）

以下の要件を満たすユーザー登録エンドポイントを実装してください。

### 要件

- `POST /api/auth/register` エンドポイント
- 入力: `name`, `email`, `password`
- Zodでバリデーション（メール形式、パスワード8文字以上、大文字小文字数字必須）
- bcryptでパスワードをハッシュ化
- メールアドレスの重複チェック
- 成功時: 201 + ユーザーID
- エラー時: 適切なステータスコードとメッセージ

<details>
<summary>解答</summary>

```typescript
// routes/auth.ts
import express from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { pool } from '../db';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, '大文字を含めてください')
    .regex(/[a-z]/, '小文字を含めてください')
    .regex(/[0-9]/, '数字を含めてください'),
});

router.post('/api/auth/register', async (req, res) => {
  // バリデーション
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message
      }))
    });
  }

  const { name, email, password } = validation.data;

  try {
    // メールアドレスの重複チェック
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Registration failed' });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // ユーザーの作成
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, hashedPassword, 'user']
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

</details>

---

## Part 2: ログインとトークン発行（25分）

以下の要件を満たすログインエンドポイントを実装してください。

### 要件

- `POST /api/auth/login` エンドポイント
- 入力: `email`, `password`
- bcryptでパスワードを検証
- 成功時: アクセストークン（15分）とリフレッシュトークン（7日）を発行
- リフレッシュトークンをDBに保存
- 失敗時: 401（ユーザー列挙を防ぐ汎用メッセージ）
- セキュリティログの記録

<details>
<summary>解答</summary>

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/api/auth/login', async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const { email, password } = validation.data;

  try {
    // ユーザーの検索
    const result = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log(`[SECURITY] Login failed: unknown email from ${req.ip}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // パスワードの検証
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      console.log(`[SECURITY] Login failed: wrong password for ${email} from ${req.ip}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // アクセストークンの生成
    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // リフレッシュトークンの生成
    const refreshToken = jwt.sign(
      { sub: user.id, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // リフレッシュトークンをDBに保存
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    console.log(`[SECURITY] Login success: ${email} from ${req.ip}`);

    res.json({
      accessToken,
      refreshToken,
      expiresIn: 900 // 15分（秒）
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

</details>

---

## Part 3: 認証ミドルウェア（20分）

以下の要件を満たす認証ミドルウェアを実装してください。

### 要件

- Authorizationヘッダーからトークンを抽出
- JWTの検証（署名、有効期限）
- `req.user` にユーザー情報を設定
- 保護されたルートの作成

<details>
<summary>解答</summary>

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Express の Request 型を拡張
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    }) as jwt.JwtPayload;

    req.user = {
      id: payload.sub as string,
      role: payload.role as string
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// 保護されたルートの例
// routes/profile.ts
router.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

</details>

---

## Part 4: トークンリフレッシュ（25分）

以下の要件を満たすトークンリフレッシュエンドポイントを実装してください。

### 要件

- `POST /api/auth/refresh` エンドポイント
- リフレッシュトークンの検証
- DBでトークンの有効性を確認
- 新しいアクセストークンを発行
- ログアウトエンドポイント（リフレッシュトークンの無効化）

<details>
<summary>解答</summary>

```typescript
// トークンリフレッシュ
router.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    // JWTの検証
    const payload = jwt.verify(refreshToken, JWT_SECRET, {
      algorithms: ['HS256']
    }) as jwt.JwtPayload;

    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // DBでトークンの有効性を確認
    const tokenRecord = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
      [refreshToken, payload.sub]
    );

    if (tokenRecord.rows.length === 0) {
      return res.status(401).json({ error: 'Token revoked or expired' });
    }

    // ユーザー情報を取得
    const userResult = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [payload.sub]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // 新しいアクセストークンを発行
    const newAccessToken = jwt.sign(
      { sub: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    res.json({
      accessToken: newAccessToken,
      expiresIn: 900
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // 期限切れのリフレッシュトークンをDBから削除
      await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// ログアウト
router.post('/api/auth/logout', authMiddleware, async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // リフレッシュトークンをDBから削除
    await pool.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1 AND token = $2',
      [req.user!.id, refreshToken]
    );

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 全デバイスからログアウト
router.post('/api/auth/logout-all', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1',
      [req.user!.id]
    );

    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    console.error('Logout-all error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

</details>

---

## Part 5: ロールベースアクセス制御（30分）

以下の要件を満たすRBACを実装してください。

### 要件

- `requireRole` ミドルウェアの実装
- 管理者のみがアクセスできるエンドポイント
- リソースオーナーチェック（自分のリソースのみ操作可能）
- 管理者はリソースオーナーチェックをバイパス可能

<details>
<summary>解答</summary>

```typescript
// middleware/authorization.ts
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log(`[SECURITY] Forbidden: user ${req.user.id} (${req.user.role}) tried to access ${req.path}`);
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

// リソースオーナーチェック
export function requireOwnerOrAdmin(paramName: string = 'id') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const resourceOwnerId = req.params[paramName];

    // 管理者はバイパス可能
    if (req.user.role === 'admin') {
      return next();
    }

    // リソースオーナーかどうかチェック
    if (req.user.id !== resourceOwnerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

// ルート定義
// 全ユーザーがアクセスできる
router.get('/api/posts', authMiddleware, getAllPosts);

// 自分のプロフィールのみ編集可能（管理者は誰でも編集可能）
router.put('/api/users/:id', authMiddleware, requireOwnerOrAdmin('id'), updateUser);

// 管理者のみ
router.get('/api/admin/users', authMiddleware, requireRole('admin'), listAllUsers);
router.delete('/api/admin/users/:id', authMiddleware, requireRole('admin'), deleteUser);

// 編集者以上
router.post('/api/posts', authMiddleware, requireRole('editor', 'admin'), createPost);
router.put('/api/posts/:id', authMiddleware, requireRole('editor', 'admin'), updatePost);
```

</details>

---

## 達成度チェック

| パート | テーマ | 完了 |
|--------|--------|------|
| Part 1 | ユーザー登録 | [ ] |
| Part 2 | ログインとトークン発行 | [ ] |
| Part 3 | 認証ミドルウェア | [ ] |
| Part 4 | トークンリフレッシュ | [ ] |
| Part 5 | ロールベースアクセス制御 | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 登録 | バリデーション + bcrypt + 重複チェック |
| ログイン | パスワード検証 + JWT発行 + セキュリティログ |
| 認証ミドルウェア | トークン検証 + req.userへの設定 |
| リフレッシュ | DB検証 + 新トークン発行 + ログアウト |
| RBAC | ロール検証 + オーナーチェック |

### チェックリスト

- [ ] 安全なユーザー登録を実装できた
- [ ] JWTの発行と検証を実装できた
- [ ] リフレッシュトークンの仕組みを実装できた
- [ ] ロールベースのアクセス制御を実装できた

---

## 次のステップへ

認証システムの実装演習を完了しました。
次のセクションでは、Step 4のチェックポイントクイズに挑戦しましょう。

---

*推定所要時間: 120分*
