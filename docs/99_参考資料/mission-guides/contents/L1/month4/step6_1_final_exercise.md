# 総合演習：セキュリティ監査レポート

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 6
subStep: 1
title: "総合演習：セキュリティ監査レポート"
itemType: EXERCISE
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "セキュアコーディング"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「最終ミッションだ」高橋さんが真剣な表情で言う。
>
> 「ここにサンプルアプリケーションのコードがある。
> これまで学んだ全ての知識を使って、**セキュリティ監査レポート**を作成してくれ」
>
> 「監査レポート......実際の業務と同じ形式ですか？」
>
> 「そうだ。脆弱性の特定、修正、認証フローの確認、ヘッダーの検証、
> そして報告書の作成。5つのパートに分けて進めよう」

---

## サンプルアプリケーション

以下のコードを対象にセキュリティ監査を行ってください。

```typescript
// app.ts
import express from 'express';
import cors from 'cors';
import { pool } from './db';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'my-app-secret-2025';

// ユーザー登録
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = crypto.createHash('md5').update(password).digest('hex');

  await pool.query(
    `INSERT INTO users (name, email, password_hash) VALUES ('${name}', '${email}', '${hash}')`
  );

  res.json({ success: true, message: `${name}さん、登録完了！` });
});

// ログイン
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const hash = crypto.createHash('md5').update(password).digest('hex');

  const result = await pool.query(
    `SELECT * FROM users WHERE email = '${email}' AND password_hash = '${hash}'`
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: `${email} のログインに失敗しました` });
  }

  const user = result.rows[0];
  const token = user.id + ':' + Date.now();

  res.json({ token, user });
});

// プロフィール取得
app.get('/api/profile/:id', async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = ${req.params.id}`
  );
  res.json(result.rows[0]);
});

// 商品検索
app.get('/api/products/search', async (req, res) => {
  const { q, sort } = req.query;
  let query = `SELECT * FROM products WHERE name LIKE '%${q}%'`;
  if (sort) {
    query += ` ORDER BY ${sort}`;
  }

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// コメント投稿
app.post('/api/comments', async (req, res) => {
  const { postId, body } = req.body;
  await pool.query(
    'INSERT INTO comments (post_id, body) VALUES ($1, $2)',
    [postId, body]
  );
  res.json({ success: true });
});

// コメント表示
app.get('/api/posts/:id/comments', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM comments WHERE post_id = $1',
    [req.params.id]
  );

  let html = '<div>';
  for (const c of result.rows) {
    html += `<p>${c.body}</p>`;
  }
  html += '</div>';
  res.send(html);
});

// 管理者API
app.delete('/api/admin/users/:id', async (req, res) => {
  await pool.query(`DELETE FROM users WHERE id = ${req.params.id}`);
  res.json({ deleted: true });
});

// エラーハンドラ
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });
});

app.listen(3000);
```

---

## Part 1: コード脆弱性の特定（10分）

上記のコードから全ての脆弱性を洗い出し、一覧にしてください。

### 報告テンプレート

```
| # | 脆弱性の種類 | 重要度 | 該当箇所 | 影響 |
```

<details>
<summary>解答</summary>

| # | 脆弱性の種類 | 重要度 | 該当箇所 | 影響 |
|---|-------------|--------|---------|------|
| 1 | ハードコードされたJWT秘密鍵 | CRITICAL | 11行目 | トークン偽造が可能 |
| 2 | 弱いハッシュアルゴリズム（MD5） | CRITICAL | 16行目、29行目 | パスワードの復元が容易 |
| 3 | SQLインジェクション（登録） | CRITICAL | 18-19行目 | データの窃取・改ざん |
| 4 | SQLインジェクション（ログイン） | CRITICAL | 31-32行目 | 認証バイパス |
| 5 | SQLインジェクション（プロフィール） | CRITICAL | 43行目 | データ漏洩 |
| 6 | SQLインジェクション（商品検索） | CRITICAL | 49行目 | データの窃取 |
| 7 | SQLインジェクション（管理者API） | CRITICAL | 76行目 | データの削除 |
| 8 | 予測可能なトークン | HIGH | 38行目 | セッションハイジャック |
| 9 | パスワードハッシュの漏洩 | HIGH | 40行目（user全体を返却） | オフラインクラック |
| 10 | 格納型XSS | HIGH | 69行目 | Cookie窃取、セッション乗っ取り |
| 11 | 認証なしの管理者API | CRITICAL | 75行目 | 誰でもユーザー削除可能 |
| 12 | 認証なしのプロフィールAPI | HIGH | 42行目 | 全ユーザー情報が閲覧可能 |
| 13 | CORS設定不備 | MEDIUM | 7行目 | 全オリジンからアクセス可能 |
| 14 | エラー情報漏洩 | MEDIUM | 54行目、82行目 | スタックトレースの露出 |
| 15 | セキュリティヘッダー未設定 | MEDIUM | 全体 | 各種ブラウザ攻撃に脆弱 |
| 16 | 入力バリデーション未実装 | MEDIUM | 全エンドポイント | 不正な入力の処理 |
| 17 | ユーザー列挙 | LOW | 36行目 | メール入りのエラーメッセージ |
| 18 | ORDER BYインジェクション | HIGH | 50-51行目 | データ漏洩 |

</details>

---

## Part 2: セキュアなコードへの修正（10分）

Part 1で特定した脆弱性のうち、以下の3つを修正したコードを書いてください。

1. ログインエンドポイントのSQLインジェクション + パスワードハッシュ
2. 商品検索のSQLインジェクション + ORDER BY
3. コメント表示のXSS

<details>
<summary>解答</summary>

```typescript
// 1. ログインエンドポイント（修正後）
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

app.post('/api/login', async (req, res) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const { email, password } = validation.data;

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      accessToken,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. 商品検索（修正後）
const ALLOWED_SORT = ['name', 'price', 'created_at'];

app.get('/api/products/search', async (req, res) => {
  const searchSchema = z.object({
    q: z.string().max(200).optional(),
    sort: z.string().optional(),
  });

  const validation = searchSchema.safeParse(req.query);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const { q, sort } = validation.data;

  try {
    let query = 'SELECT id, name, price, description FROM products';
    const params: string[] = [];

    if (q) {
      const safeQ = q.replace(/[%_\\]/g, '\\$&');
      query += " WHERE name LIKE $1 ESCAPE '\\'";
      params.push(`%${safeQ}%`);
    }

    const sortColumn = ALLOWED_SORT.includes(sort || '') ? sort : 'created_at';
    query += ` ORDER BY ${sortColumn} DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. コメント表示（修正後）
import escapeHtml from 'escape-html';

app.get('/api/posts/:id/comments', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const result = await pool.query(
      'SELECT id, body, created_at FROM comments WHERE post_id = $1 ORDER BY created_at ASC',
      [id]
    );

    let html = '<div>';
    for (const c of result.rows) {
      html += `<p>${escapeHtml(c.body)}</p>`;
    }
    html += '</div>';
    res.send(html);
  } catch (error) {
    console.error('Comments error:', error);
    res.status(500).send('<div>エラーが発生しました</div>');
  }
});
```

</details>

---

## Part 3: 認証フローの確認（3分）

以下の質問に答えてください。

1. このアプリケーションの認証の最大の問題点は何ですか？
2. 推奨される認証フローはどのようなものですか？

<details>
<summary>解答</summary>

**1. 最大の問題点:**
- トークンが `userId:timestamp` の単純な連結で予測可能
- JWT秘密鍵がハードコードされている
- リフレッシュトークンの仕組みがない
- 管理者APIに認証チェックがない
- プロフィールAPIに認証も認可もない

**2. 推奨される認証フロー:**
- bcryptでパスワードをハッシュ化
- JWT（HS256以上）でアクセストークン（15分）を発行
- リフレッシュトークン（7日）をHttpOnly Cookieで管理
- 全APIエンドポイントに認証ミドルウェアを適用
- 管理者APIにはrequireRole('admin')を適用
- プロフィールAPIにはリソースオーナーチェックを適用

</details>

---

## Part 4: セキュリティヘッダーの検証（3分）

このアプリケーションに必要なセキュリティヘッダーを列挙してください。

<details>
<summary>解答</summary>

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));

// CORS を特定のオリジンに制限
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));

// Cookieのセキュリティ設定
// HttpOnly, Secure, SameSite=Strict
```

必要なヘッダー:
- Content-Security-Policy
- Strict-Transport-Security
- X-Frame-Options (DENY)
- X-Content-Type-Options (nosniff)
- Referrer-Policy
- Permissions-Policy
- CORSの制限

</details>

---

## Part 5: 監査レポートの作成（4分）

以下の形式でサマリーレポートを作成してください。

<details>
<summary>解答</summary>

```
==================================
セキュリティ監査レポート
対象: サンプルアプリケーション
日付: 2025-XX-XX
監査者: [あなたの名前]
==================================

■ 総合評価: 不合格（Critical脆弱性が複数存在）

■ 発見された脆弱性:
  CRITICAL: 7件（SQLインジェクション x5、ハードコード秘密鍵、認証なし管理API）
  HIGH:     4件（弱いハッシュ、予測可能トークン、XSS、パスワードハッシュ漏洩）
  MEDIUM:   3件（CORS不備、エラー情報漏洩、セキュリティヘッダー未設定）
  LOW:      1件（ユーザー列挙）

■ 最優先で対応すべき項目:
  1. 全SQLクエリをパラメータ化クエリに変更
  2. MD5をbcryptに変更
  3. JWT秘密鍵を環境変数に移動
  4. 全エンドポイントに認証・認可を実装
  5. helmet.jsでセキュリティヘッダーを設定

■ 推奨事項:
  - 入力バリデーション（Zod）の導入
  - CI/CDにセキュリティチェックを組み込み
  - Dependabotの有効化
  - 定期的なセキュリティレビューの実施
```

</details>

---

## まとめ

| パート | 内容 |
|--------|------|
| Part 1 | コード脆弱性の特定（18件） |
| Part 2 | セキュアなコードへの修正 |
| Part 3 | 認証フローの確認と推奨 |
| Part 4 | セキュリティヘッダーの検証 |
| Part 5 | 監査レポートの作成 |

---

## 次のステップへ

総合演習を完了しました。
最後に、今月の全範囲をカバーする卒業クイズに挑戦しましょう。

---

*推定所要時間: 30分*
