# 演習：脆弱なコードを修正しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 3
subStep: 5
title: "演習：脆弱なコードを修正しよう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "セキュアコーディング"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「脆弱性を見つけるだけじゃない。**修正する力**が求められる」
>
> 高橋さんが5つのコードファイルを用意した。
>
> 「それぞれに脆弱性がある。今回は見つけるだけでなく、セキュアなコードに書き直してくれ。
> Step 3で学んだパラメータ化クエリ、入力バリデーション、出力エスケープ、
> セキュリティヘッダーの全てを使って修正しよう」
>
> 「はい、やってみます」
>
> 「各コードの修正が完了したら、なぜその修正が必要なのかも説明できるようにしておけ」

---

## 演習の概要

5つの脆弱なコードをセキュアなコードに修正してください。

| コード | テーマ | 使う技術 |
|--------|--------|---------|
| コード1 | 商品検索API | パラメータ化クエリ |
| コード2 | ユーザー登録 | 入力バリデーション |
| コード3 | プロフィール表示 | 出力エスケープ |
| コード4 | APIサーバー設定 | セキュリティヘッダー |
| コード5 | 総合問題 | 全技術の組み合わせ |

---

## コード1: 商品検索API

以下の脆弱なコードをセキュアに修正してください。

```typescript
// routes/products.ts - 脆弱なコード
import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/api/products', async (req, res) => {
  const { category, minPrice, maxPrice, sort } = req.query;

  let query = `SELECT * FROM products WHERE 1=1`;

  if (category) {
    query += ` AND category = '${category}'`;
  }
  if (minPrice) {
    query += ` AND price >= ${minPrice}`;
  }
  if (maxPrice) {
    query += ` AND price <= ${maxPrice}`;
  }
  if (sort) {
    query += ` ORDER BY ${sort}`;
  }

  const result = await pool.query(query);
  res.json(result.rows);
});

export default router;
```

<details>
<summary>解答</summary>

```typescript
// routes/products.ts - セキュアなコード
import express from 'express';
import { pool } from '../db';
import { z } from 'zod';

const router = express.Router();

const ALLOWED_SORT_COLUMNS = ['name', 'price', 'created_at'];
const ALLOWED_SORT_DIRECTIONS = ['ASC', 'DESC'];

const searchSchema = z.object({
  category: z.string().max(50).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
});

router.get('/api/products', async (req, res) => {
  const validation = searchSchema.safeParse(req.query);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const { category, minPrice, maxPrice, sort, order } = validation.data;

  let query = 'SELECT id, name, category, price, description FROM products WHERE 1=1';
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (category) {
    query += ` AND category = $${paramIndex++}`;
    params.push(category);
  }
  if (minPrice !== undefined) {
    query += ` AND price >= $${paramIndex++}`;
    params.push(minPrice);
  }
  if (maxPrice !== undefined) {
    query += ` AND price <= $${paramIndex++}`;
    params.push(maxPrice);
  }

  // ORDER BY はホワイトリストで検証
  const sortColumn = ALLOWED_SORT_COLUMNS.includes(sort || '') ? sort : 'created_at';
  const sortDir = ALLOWED_SORT_DIRECTIONS.includes(order?.toUpperCase() || '') ? order!.toUpperCase() : 'DESC';
  query += ` ORDER BY ${sortColumn} ${sortDir}`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

**修正ポイント:**
- 全ての動的値をパラメータ化クエリに変更
- Zodによる入力バリデーション追加
- ORDER BYはホワイトリストで検証
- SELECTに必要なカラムのみ指定
- エラーハンドリングで内部情報を隠蔽

</details>

---

## コード2: ユーザー登録

以下の脆弱なコードをセキュアに修正してください。

```typescript
// routes/register.ts - 脆弱なコード
import express from 'express';
import { pool } from '../db';
import crypto from 'crypto';

const router = express.Router();

router.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

  await pool.query(
    `INSERT INTO users (name, email, password_hash) VALUES ('${name}', '${email}', '${hashedPassword}')`
  );

  res.json({ success: true, message: `ユーザー ${name} を登録しました` });
});

export default router;
```

<details>
<summary>解答</summary>

```typescript
// routes/register.ts - セキュアなコード
import express from 'express';
import { pool } from '../db';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
  name: z.string()
    .min(1, '名前は必須です')
    .max(100, '名前は100文字以内です'),
  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .max(255),
  password: z.string()
    .min(8, 'パスワードは8文字以上です')
    .regex(/[A-Z]/, '大文字を含めてください')
    .regex(/[a-z]/, '小文字を含めてください')
    .regex(/[0-9]/, '数字を含めてください'),
});

router.post('/api/register', async (req, res) => {
  // 入力バリデーション
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      errors: validation.error.issues.map(i => ({
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
      return res.status(409).json({ error: '登録に失敗しました' });
      // ユーザー列挙を防ぐため、具体的なメッセージは避ける
    }

    // bcrypt でパスワードをハッシュ化（ソルト付き）
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // パラメータ化クエリでINSERT
    await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

**修正ポイント:**
- Zodによる入力バリデーション（パスワード強度チェック含む）
- SHA1からbcrypt（ソルト付き）に変更
- パラメータ化クエリに変更
- 重複チェックで具体的なメッセージを避ける（ユーザー列挙防止）
- エラーハンドリング追加
- レスポンスから不要な情報を除去

</details>

---

## コード3: プロフィール表示

以下の脆弱なコードをセキュアに修正してください。

```typescript
// routes/profile.ts - 脆弱なコード
import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/profile/:userId', async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = ${req.params.userId}`
  );

  if (result.rows.length === 0) {
    return res.status(404).send('<h1>ユーザーが見つかりません</h1>');
  }

  const user = result.rows[0];
  res.send(`
    <html>
    <body>
      <h1>${user.name}のプロフィール</h1>
      <p>メール: ${user.email}</p>
      <p>自己紹介: ${user.bio}</p>
      <p>ウェブサイト: <a href="${user.website}">${user.website}</a></p>
    </body>
    </html>
  `);
});

export default router;
```

<details>
<summary>解答</summary>

```typescript
// routes/profile.ts - セキュアなコード
import express from 'express';
import { pool } from '../db';
import escapeHtml from 'escape-html';

const router = express.Router();

router.get('/profile/:userId', async (req, res) => {
  // IDのバリデーション
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).send('<h1>無効なユーザーIDです</h1>');
  }

  try {
    // パラメータ化クエリ + 必要なカラムのみ取得
    const result = await pool.query(
      'SELECT id, name, email, bio, website FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('<h1>ユーザーが見つかりません</h1>');
    }

    const user = result.rows[0];

    // URLのバリデーション
    let safeWebsiteHref = '#';
    if (user.website) {
      try {
        const url = new URL(user.website);
        if (['http:', 'https:'].includes(url.protocol)) {
          safeWebsiteHref = escapeHtml(user.website);
        }
      } catch {
        // 無効なURLの場合はリンクなし
      }
    }

    // 全ての動的値をHTMLエスケープ
    res.send(`
      <html>
      <body>
        <h1>${escapeHtml(user.name)}のプロフィール</h1>
        <p>メール: ${escapeHtml(user.email)}</p>
        <p>自己紹介: ${escapeHtml(user.bio || '')}</p>
        <p>ウェブサイト: <a href="${safeWebsiteHref}">${escapeHtml(user.website || '')}</a></p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).send('<h1>エラーが発生しました</h1>');
  }
});

export default router;
```

**修正ポイント:**
- ユーザーIDのバリデーション
- パラメータ化クエリに変更
- SELECT * を必要なカラムのみに変更
- 全ての動的値をescapeHtmlでエスケープ
- URLのプロトコルをチェック（javascript: スキーム対策）
- エラーハンドリング追加

</details>

---

## コード4: APIサーバー設定

以下の脆弱な設定をセキュアに修正してください。

```typescript
// app.ts - 脆弱な設定
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack
  });
});

app.listen(3000, () => console.log('Server running'));
```

<details>
<summary>解答</summary>

```typescript
// app.ts - セキュアな設定
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// セキュリティヘッダーの設定
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    }
  }
}));

// CORS: 特定のオリジンのみ許可
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://www.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// レート制限
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' }
}));

// リクエストボディのサイズ制限
app.use(express.json({ limit: '10kb' }));

// エラーハンドラ: 内部情報を隠蔽
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**修正ポイント:**
- helmet.js でセキュリティヘッダーを一括設定
- CORSを特定のオリジンに制限
- レート制限を追加
- リクエストボディのサイズ制限
- エラーハンドラで内部情報を隠蔽
- ポート番号を環境変数で管理

</details>

---

## コード5: 総合問題（ブログ記事API）

以下の脆弱なコードに対して、学んだ全ての技術を適用して修正してください。

```typescript
// routes/posts.ts - 脆弱なコード
import express from 'express';
import { pool } from '../db';

const router = express.Router();
const ADMIN_TOKEN = 'blog-admin-2025';

router.get('/api/posts', async (req, res) => {
  const search = req.query.q;
  let query = 'SELECT * FROM posts';
  if (search) {
    query += ` WHERE title LIKE '%${search}%' OR body LIKE '%${search}%'`;
  }
  const result = await pool.query(query);
  res.json(result.rows);
});

router.post('/api/posts', async (req, res) => {
  const { title, body, authorId } = req.body;
  await pool.query(
    `INSERT INTO posts (title, body, author_id) VALUES ('${title}', '${body}', ${authorId})`
  );
  res.json({ success: true });
});

router.delete('/api/posts/:id', async (req, res) => {
  if (req.headers.authorization !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await pool.query(`DELETE FROM posts WHERE id = ${req.params.id}`);
  res.json({ deleted: true });
});

export default router;
```

<details>
<summary>解答</summary>

```typescript
// routes/posts.ts - セキュアなコード
import express from 'express';
import { pool } from '../db';
import { z } from 'zod';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

// バリデーションスキーマ
const searchSchema = z.object({
  q: z.string().max(200).optional(),
});

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(50000),
});

function escapeLikePattern(pattern: string): string {
  return pattern.replace(/[%_\\]/g, '\\$&');
}

// 記事一覧・検索
router.get('/api/posts', async (req, res) => {
  const validation = searchSchema.safeParse(req.query);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  try {
    const { q } = validation.data;
    let query = 'SELECT id, title, body, author_id, created_at FROM posts';
    const params: string[] = [];

    if (q) {
      const safeSearch = `%${escapeLikePattern(q)}%`;
      query += " WHERE title LIKE $1 ESCAPE '\\' OR body LIKE $1 ESCAPE '\\'";
      params.push(safeSearch);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 記事作成（認証必須）
router.post('/api/posts', authMiddleware, async (req, res) => {
  const validation = createPostSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      errors: validation.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message
      }))
    });
  }

  const { title, body } = validation.data;

  try {
    const result = await pool.query(
      'INSERT INTO posts (title, body, author_id) VALUES ($1, $2, $3) RETURNING id',
      [title, body, req.user.id]  // author_id は認証済みユーザーから取得
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 記事削除（管理者権限必須）
router.delete('/api/posts/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ deleted: true });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

**修正ポイント:**
- ハードコードされたトークンを認証ミドルウェアに置き換え
- 全てのSQLをパラメータ化クエリに変更
- LIKE句のワイルドカードをエスケープ
- Zodによる入力バリデーション追加
- author_idをリクエストからではなく認証情報から取得（認可チェック）
- IDのバリデーション
- SELECT * を必要なカラムのみに変更
- 全エンドポイントにエラーハンドリング追加
- 削除時に存在チェック（RETURNING句）

</details>

---

## まとめ

| ポイント | 内容 |
|----------|------|
| パラメータ化 | 全てのSQL操作でパラメータ化クエリを使用 |
| バリデーション | Zodなどで型安全なバリデーションを実装 |
| エスケープ | HTMLに出力する値は全てエスケープ |
| ヘッダー | helmet.js でセキュリティヘッダーを一括設定 |
| 認証・認可 | ハードコードではなく適切な認証・認可の仕組みを使用 |

### チェックリスト

- [ ] 全5つのコードを修正できた
- [ ] 修正の理由を説明できる
- [ ] 複数の脆弱性を含むコードから全ての問題を発見できた
- [ ] セキュアコーディングの各技術を適切に組み合わせられた

---

## 次のステップへ

セキュアな実装の演習を完了しました。
次のセクションでは、Step 3のチェックポイントクイズに挑戦しましょう。

---

*推定所要時間: 90分*
