# 入力値のサニタイズとバリデーション

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 3
subStep: 2
title: "入力値のサニタイズとバリデーション"
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

> 「パラメータ化クエリはSQL対策の決定打だ。でもそれだけでは不十分だ」
>
> 高橋さんが続ける。
>
> 「そもそも、不正な入力値がアプリケーションに入ってくること自体を防ぐべきだ。
> **入力バリデーション**と**サニタイズ**は、多層防御の最前線だ」
>
> 「バリデーションとサニタイズは違うんですか？」
>
> 「バリデーションは入力が正しい形式かどうかを検証すること。
> サニタイズは入力から危険な部分を除去・無害化すること。両方やるのがベストだ」

---

## バリデーションとサニタイズの違い

```
バリデーション（Validation）:
  入力が期待する形式かどうかを検証する
  → 不正な場合はリジェクト（拒否）する

  例: メールアドレスの形式チェック
  "test@example.com" → 有効
  "not-an-email"     → 無効 → 拒否

サニタイズ（Sanitization）:
  入力から危険な部分を除去・変換する
  → 無害化して受け入れる

  例: HTMLタグの除去
  "<script>alert('XSS')</script>Hello" → "Hello"
```

### どちらを使うべきか

```
基本方針:
1. まずバリデーション（不正な入力は拒否）
2. 必要に応じてサニタイズ（受け入れるが無害化）
3. 出力時にエスケープ（次のセクションで学ぶ）
```

---

## ホワイトリスト vs ブラックリスト

### ブラックリスト（非推奨）

「既知の危険なパターン」を拒否する方式です。

```typescript
// ブラックリスト: 危険な文字を禁止
function sanitizeInput(input: string): string {
  return input
    .replace(/'/g, '')
    .replace(/--/g, '')
    .replace(/;/g, '')
    .replace(/UNION/gi, '')
    .replace(/SELECT/gi, '');
}

// 問題点: 攻撃者は常に新しいバイパス方法を見つける
// 例: UNI/**/ON SEL/**/ECT でフィルタを回避
// 例: Unicode文字 ＇（全角シングルクオート）で回避
```

### ホワイトリスト（推奨）

「許可するパターン」のみを受け入れる方式です。

```typescript
// ホワイトリスト: 許可するパターンのみ受け入れ
function validateUsername(input: string): boolean {
  // 英数字とアンダースコアのみ許可（3-20文字）
  return /^[a-zA-Z0-9_]{3,20}$/.test(input);
}

// 攻撃者がどのような入力を試みても、
// 許可リストに合致しなければ全て拒否される
```

---

## Zodによるバリデーション

Zodは TypeScript ファーストのバリデーションライブラリです。

### 基本的な使い方

```typescript
import { z } from 'zod';

// スキーマ定義
const userSchema = z.object({
  name: z.string()
    .min(1, '名前は必須です')
    .max(100, '名前は100文字以内です')
    .regex(/^[a-zA-Zぁ-んァ-ヶ亜-熙]+$/, '不正な文字が含まれています'),

  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .max(255),

  age: z.number()
    .int('整数を入力してください')
    .min(0, '0以上の値を入力してください')
    .max(150, '150以下の値を入力してください'),

  role: z.enum(['user', 'editor', 'admin']),

  website: z.string().url().optional(),
});

// バリデーション実行
app.post('/api/users', (req, res) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  // result.data は型安全かつバリデーション済み
  const validatedUser = result.data;
  createUser(validatedUser);
});
```

### よく使うバリデーションパターン

```typescript
// パスワード: 最低8文字、大文字小文字数字特殊文字を含む
const passwordSchema = z.string()
  .min(8, 'パスワードは8文字以上です')
  .regex(/[A-Z]/, '大文字を含めてください')
  .regex(/[a-z]/, '小文字を含めてください')
  .regex(/[0-9]/, '数字を含めてください')
  .regex(/[^A-Za-z0-9]/, '特殊文字を含めてください');

// 日付: ISO 8601形式
const dateSchema = z.string().datetime();

// ID: 正の整数
const idSchema = z.coerce.number().int().positive();

// 検索クエリ: 長さ制限と危険な文字の排除
const searchSchema = z.string()
  .max(200)
  .transform(val => val.trim());
```

---

## サーバーサイドバリデーションの重要性

**クライアントサイドバリデーションだけでは不十分です。**

```
クライアントサイド:
  <input type="email" required maxlength="255">
  ↓
  ブラウザの開発者ツールで制約を削除可能
  curl コマンドで直接リクエスト送信可能
  ↓
  バリデーションをバイパスされる

サーバーサイド:
  const result = emailSchema.safeParse(req.body.email);
  ↓
  ブラウザの操作では回避できない
  ↓
  確実にバリデーションが実行される
```

```typescript
// 正しいアプローチ: サーバーサイドで必ずバリデーション
app.post('/api/register', (req, res) => {
  // クライアントサイドのバリデーションは UX のためのもの
  // サーバーサイドのバリデーションがセキュリティの砦
  const result = registrationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  // ここに到達した時点で、入力は安全
  registerUser(result.data);
});
```

---

## 型チェックの重要性

JavaScriptでは型の曖昧さが脆弱性につながることがあります。

```typescript
// 危険: 型チェックなし
app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  // id が "1 OR 1=1" でも文字列として通ってしまう
});

// 安全: 型変換と検証
app.get('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: '無効なIDです' });
  }
  // id は必ず正の整数
});

// Zod を使う場合
const paramsSchema = z.object({
  id: z.coerce.number().int().positive()
});
```

---

## ファイルアップロードのバリデーション

```typescript
import multer from 'multer';
import path from 'path';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    // MIMEタイプの検証
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('許可されていないファイル形式です'));
    }

    // 拡張子の検証
    const ext = path.extname(file.originalname).toLowerCase();
    const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error('許可されていない拡張子です'));
    }

    cb(null, true);
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'ファイルが必要です' });
  }
  res.json({ filename: req.file.filename });
});
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| バリデーション | 入力が正しい形式かチェックし、不正なら拒否 |
| サニタイズ | 入力から危険な部分を除去・無害化 |
| ホワイトリスト | 許可するパターンのみ受け入れる（推奨） |
| サーバーサイド | バリデーションは必ずサーバーサイドで実行 |

### チェックリスト

- [ ] バリデーションとサニタイズの違いを理解した
- [ ] ホワイトリストがブラックリストより安全な理由を理解した
- [ ] Zodの基本的な使い方を理解した
- [ ] サーバーサイドバリデーションの重要性を理解した

---

## 次のステップへ

入力のバリデーションとサニタイズを学びました。
次のセクションでは、**出力エスケープ**によるXSS対策を学びます。

入力の防御と出力の防御、両方を組み合わせることでより堅牢になります。

---

*推定読了時間: 30分*
