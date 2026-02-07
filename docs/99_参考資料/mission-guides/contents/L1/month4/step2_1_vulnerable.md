# 脆弱なコードパターン

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 2
subStep: 1
title: "脆弱なコードパターン"
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

> 「攻撃手法の基礎は学んだ。次は実際のコードに潜む脆弱性を見抜く力を鍛えるぞ」
>
> 高橋さんが社内リポジトリの画面を開いた。
>
> 「このプロジェクトのコードベースを調査してほしい。よくある脆弱性パターンを知っていれば、
> コードを読んだ瞬間に危険を察知できるようになる」
>
> 「コードレビューでセキュリティの問題を見つける、ということですか」
>
> 「その通りだ。まずは典型的な脆弱パターンを頭に叩き込め」

---

## パターン1: 文字列連結によるSQL構築

最も基本的かつ致命的な脆弱性パターンです。

### 脆弱なコード

```typescript
// TypeScript (Node.js)
async function findUser(email: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  return await db.query(query);
}

// Python
def find_user(email: str):
    query = f"SELECT * FROM users WHERE email = '{email}'"
    cursor.execute(query)
    return cursor.fetchone()
```

### なぜ危険か

```
入力: admin@example.com' OR '1'='1
生成されるSQL: SELECT * FROM users WHERE email = 'admin@example.com' OR '1'='1'
結果: 全ユーザーが返される
```

### セキュアなコード

```typescript
// TypeScript: パラメータ化クエリ
async function findUser(email: string) {
  const query = 'SELECT * FROM users WHERE email = $1';
  return await db.query(query, [email]);
}

// Python: プレースホルダー
def find_user(email: str):
    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    return cursor.fetchone()
```

---

## パターン2: エスケープなしのHTML出力

ユーザー入力をそのままHTMLに埋め込むとXSSが発生します。

### 脆弱なコード

```typescript
// サーバーサイド
app.get('/profile', (req, res) => {
  const name = req.query.name;
  res.send(`<div class="profile"><h2>${name}</h2></div>`);
});

// クライアントサイド
const comment = getUserComment();
document.getElementById('output').innerHTML = comment;
```

### セキュアなコード

```typescript
// サーバーサイド: エスケープ関数を使用
import escapeHtml from 'escape-html';

app.get('/profile', (req, res) => {
  const name = escapeHtml(req.query.name);
  res.send(`<div class="profile"><h2>${name}</h2></div>`);
});

// クライアントサイド: textContent を使用
const comment = getUserComment();
document.getElementById('output').textContent = comment;
```

---

## パターン3: ハードコードされたシークレット

ソースコードに直接書かれたパスワード、APIキー、トークンは深刻なリスクです。

### 脆弱なコード

```typescript
// データベース接続情報がコードに直書き
const db = new Database({
  host: 'production-db.example.com',
  user: 'admin',
  password: 'SuperSecret123!',
  database: 'users_production'
});

// APIキーがコードに直書き
const stripeKey = 'sk_live_abcdef123456';
const response = await fetch('https://api.stripe.com/v1/charges', {
  headers: { 'Authorization': `Bearer ${stripeKey}` }
});
```

### セキュアなコード

```typescript
// 環境変数から読み込む
const db = new Database({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// .env ファイル + dotenv（.envは.gitignoreに含める）
import dotenv from 'dotenv';
dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY;
```

```bash
# .gitignore に必ず追加
.env
.env.local
.env.production
```

---

## パターン4: eval() と動的コード実行

`eval()` やそれに類する関数は、任意のコード実行を許してしまいます。

### 脆弱なコード

```typescript
// JavaScript: eval() でユーザー入力を実行
app.post('/calculate', (req, res) => {
  const expression = req.body.expression;
  const result = eval(expression);  // 任意のコードが実行される
  res.json({ result });
});

// Python: exec() でユーザー入力を実行
@app.route('/run', methods=['POST'])
def run_code():
    code = request.form['code']
    exec(code)  # 任意のPythonコードが実行される
```

### 攻撃例

```
入力: require('child_process').execSync('rm -rf /').toString()
→ サーバーのファイルシステムが破壊される

入力: process.env.DATABASE_URL
→ 環境変数（シークレット）が漏洩する
```

### セキュアなコード

```typescript
// 安全な数式パーサーを使用
import { evaluate } from 'mathjs';

app.post('/calculate', (req, res) => {
  try {
    const result = evaluate(req.body.expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: '無効な数式です' });
  }
});
```

---

## パターン5: 不適切なエラーハンドリング

エラーメッセージに内部情報を含めてしまうパターンです。

### 脆弱なコード

```typescript
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
    res.json(user);
  } catch (error) {
    // スタックトレースやSQLクエリをそのまま返す
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      query: error.query  // 実行されたSQLが見える
    });
  }
});
```

### 攻撃者が得られる情報

```json
{
  "error": "relation \"users\" does not exist",
  "stack": "at Pool.query (/app/node_modules/pg/lib/pool.js:45:23)...",
  "query": "SELECT * FROM users WHERE id = 1 UNION SELECT * FROM admin_credentials"
}
```

テーブル名、カラム名、使用しているDB、ディレクトリ構造などが漏洩します。

### セキュアなコード

```typescript
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    res.json(user);
  } catch (error) {
    // サーバーログには詳細を記録
    console.error('Database error:', error);

    // クライアントには汎用的なメッセージのみ返す
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});
```

---

## パターン6: 不十分な入力バリデーション

入力値の検証が甘い、または存在しないパターンです。

### 脆弱なコード

```typescript
// ファイルアップロード: 拡張子チェックなし
app.post('/upload', upload.single('file'), (req, res) => {
  // .exe, .sh, .php など危険なファイルもアップロードされる
  res.json({ path: req.file.path });
});

// 数値を期待するが文字列チェックなし
app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  // id が "1; DROP TABLE users" でも通ってしまう
  const user = await db.query(`SELECT * FROM users WHERE id = ${id}`);
});
```

### セキュアなコード

```typescript
// ファイルアップロード: 拡張子とMIMEタイプをチェック
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

app.post('/upload', upload.single('file'), (req, res) => {
  const ext = path.extname(req.file.originalname).toLowerCase();

  if (!ALLOWED_TYPES.includes(req.file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: '許可されていないファイル形式です' });
  }
  res.json({ path: req.file.path });
});

// 数値バリデーション
app.get('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: '無効なIDです' });
  }
  const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
});
```

---

## 脆弱性パターン一覧

| パターン | 主な脆弱性 | 対策 |
|---------|-----------|------|
| 文字列連結SQL | SQLインジェクション | パラメータ化クエリ |
| エスケープなしHTML | XSS | 出力エスケープ |
| ハードコードシークレット | 情報漏洩 | 環境変数 |
| eval() | 任意コード実行 | 安全なパーサー |
| 詳細エラーメッセージ | 情報漏洩 | 汎用メッセージ |
| 入力バリデーション不備 | 各種インジェクション | 型チェック・ホワイトリスト |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 文字列連結 | SQLに限らず、あらゆるインジェクションの根本原因 |
| ハードコード | シークレットは必ず環境変数で管理 |
| eval() | ユーザー入力を動的実行してはならない |
| エラー処理 | 内部情報をクライアントに返さない |

### チェックリスト

- [ ] 6つの脆弱性パターンを識別できる
- [ ] 各パターンの安全な代替手法を理解した
- [ ] 自分のコードに同様のパターンがないか振り返った

---

## 次のステップへ

脆弱なコードの典型パターンを学びました。
次のセクションでは、これらのパターンをコードレビューで効果的に発見する方法を学びます。

---

*推定読了時間: 30分*
