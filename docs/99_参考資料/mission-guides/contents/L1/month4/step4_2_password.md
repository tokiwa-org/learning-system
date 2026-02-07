# パスワードの安全な管理

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 4
subStep: 2
title: "パスワードの安全な管理"
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

> 「認証の要はパスワードだ。では質問だ。パスワードはどうやって保存する？」
>
> 高橋さんがあなたに問いかける。
>
> 「え......データベースに保存しますよね。暗号化して？」
>
> 「暗号化ではない。**ハッシュ化**だ。この2つの違いは重要だ。
> そして、ただハッシュ化するだけでも不十分。
> 正しいパスワード管理は思ったより奥が深い」

---

## パスワードを平文で保存してはいけない理由

```
データベースが漏洩した場合:

平文保存:
  users テーブル
  | email              | password     |
  | tanaka@example.com | MyPassword1! |
  | sato@example.com   | Secret123    |
  → 全ユーザーのパスワードがそのまま見える
  → パスワードの使い回しで他のサービスにも被害が及ぶ

ハッシュ化保存:
  users テーブル
  | email              | password_hash                                  |
  | tanaka@example.com | $2b$12$LJ3m4vKiGY0FzPLgFt5c6eNqKS... |
  | sato@example.com   | $2b$12$8Kx2nOjKP0FzLzPQgt5c6eRqTU... |
  → ハッシュから元のパスワードを復元できない
```

---

## 暗号化 vs ハッシュ化

```
暗号化（Encryption）:
  元のデータ → 暗号化 → 暗号文
  暗号文 → 復号 → 元のデータ
  → 鍵があれば元に戻せる（双方向）
  → パスワード保存には不適切

ハッシュ化（Hashing）:
  元のデータ → ハッシュ関数 → ハッシュ値
  ハッシュ値 → ???
  → 元に戻せない（一方向）
  → パスワード保存に適切
```

### 検証の仕組み

```
登録時:
  パスワード "MyPassword1!" → ハッシュ化 → "$2b$12$LJ3m..." → DBに保存

ログイン時:
  入力パスワード "MyPassword1!" → ハッシュ化 → "$2b$12$LJ3m..."
  DBのハッシュ値 "$2b$12$LJ3m..." と比較 → 一致 → 認証成功
```

---

## 危険なハッシュアルゴリズム

### MD5 / SHA-1 / SHA-256

```typescript
// 危険: MD5
crypto.createHash('md5').update(password).digest('hex');
// 出力: "5f4dcc3b5aa765d61d8327deb882cf99"

// 危険: SHA-1
crypto.createHash('sha1').update(password).digest('hex');

// まだ危険: SHA-256（高速すぎる）
crypto.createHash('sha256').update(password).digest('hex');
```

**なぜ危険なのか:**

1. **高速すぎる**: GPU1台で毎秒数十億回のハッシュ計算が可能。総当りが現実的
2. **レインボーテーブル**: よく使われるパスワードのハッシュ値一覧が存在し、照合するだけで元のパスワードが分かる
3. **ソルトなし**: 同じパスワードは同じハッシュ値になるため、1つ解読すると同じパスワードの全ユーザーが影響を受ける

---

## ソルト（Salt）

ソルトは各ユーザーに固有のランダムな値をパスワードに付加してからハッシュ化する手法です。

```
ソルトなし:
  "password123" → SHA256 → "ef92..." → 全員同じハッシュ
  "password123" → SHA256 → "ef92..." → レインボーテーブルで一発解読

ソルトあり:
  "password123" + "a1b2c3" → SHA256 → "7f3d..." → ユーザーAのハッシュ
  "password123" + "x9y8z7" → SHA256 → "c42e..." → ユーザーBのハッシュ
  → 同じパスワードでも異なるハッシュになる
  → レインボーテーブルが使えない
```

---

## bcrypt -- 推奨されるパスワードハッシュ

bcrypt はパスワードハッシュ化のために設計されたアルゴリズムです。

### 特徴

| 特徴 | 説明 |
|------|------|
| 意図的に低速 | コスト係数（ストレッチング）により計算時間を制御 |
| ソルト内蔵 | 自動的にソルトを生成・付加 |
| 適応的 | ハードウェアの進化に合わせてコスト係数を増やせる |

### 実装

```typescript
import bcrypt from 'bcrypt';

// パスワードのハッシュ化（登録時）
const saltRounds = 12;  // コスト係数（推奨: 10-12）
const hashedPassword = await bcrypt.hash(password, saltRounds);
// 出力例: "$2b$12$LJ3m4vKiGY0FzPLgFt5c6eNqKS3dU8pVqIy3pI9vKsWjF2kB6"
//          $2b$ = アルゴリズム
//          12$  = コスト係数
//          LJ3m... = ソルト + ハッシュ

// パスワードの検証（ログイン時）
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
if (isValid) {
  // 認証成功
} else {
  // 認証失敗
}
```

### コスト係数の選び方

```
コスト係数 → ハッシュ化にかかる時間
  10     → 約100ms
  11     → 約200ms
  12     → 約400ms（推奨）
  13     → 約800ms
  14     → 約1.6s

目安: ハッシュ化に 250ms - 500ms かかる程度が適切
```

---

## パスワードポリシー

### 良いパスワードポリシー

```typescript
import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'パスワードは8文字以上です')
  .max(128, 'パスワードは128文字以内です')
  .regex(/[A-Z]/, '大文字を1文字以上含めてください')
  .regex(/[a-z]/, '小文字を1文字以上含めてください')
  .regex(/[0-9]/, '数字を1文字以上含めてください');

// 追加チェック
function validatePassword(password: string, email: string): string[] {
  const errors: string[] = [];

  // よく使われるパスワードのチェック
  const commonPasswords = ['password', '12345678', 'qwerty123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('よく使われるパスワードは使用できません');
  }

  // メールアドレスとの類似チェック
  const emailLocal = email.split('@')[0].toLowerCase();
  if (password.toLowerCase().includes(emailLocal)) {
    errors.push('メールアドレスを含むパスワードは使用できません');
  }

  return errors;
}
```

### 避けるべきパスワードポリシー

```
悪い例:
- パスワードは6文字以上     → 短すぎる
- 90日ごとに変更を強制     → ユーザーが弱いパスワードを使いがち
- 特殊文字を必須にしすぎる  → "P@$$w0rd!" のようなパターン化を招く
- 最大文字数が少ない       → パスフレーズが使えなくなる
```

---

## パスワードリセットの安全な実装

```typescript
import crypto from 'crypto';

// リセットトークンの生成
async function createResetToken(email: string): Promise<string> {
  const user = await db.findUserByEmail(email);

  // ユーザーの存在有無に関わらず同じレスポンスを返す（ユーザー列挙防止）
  if (!user) return '';

  // 暗号学的に安全なランダムトークン
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // トークンのハッシュをDBに保存（有効期限1時間）
  await db.saveResetToken(user.id, tokenHash, Date.now() + 3600000);

  return token; // メールで送信（トークン自体はDBに保存しない）
}

// リセットの実行
async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const record = await db.findResetToken(tokenHash);

  if (!record || record.expiresAt < Date.now()) {
    return false; // トークンが無効または期限切れ
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await db.updatePassword(record.userId, hashedPassword);
  await db.deleteResetToken(tokenHash); // トークンを無効化（使い捨て）

  return true;
}
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 平文保存 | 絶対に行わない |
| ハッシュ化 | 一方向変換で元に戻せない |
| bcrypt | ソルト内蔵・意図的低速・推奨アルゴリズム |
| パスワードポリシー | 8文字以上、一般的パスワードの禁止 |
| リセット | 暗号学的に安全なトークン、有効期限、使い捨て |

### チェックリスト

- [ ] 暗号化とハッシュ化の違いを説明できる
- [ ] MD5/SHA-1が危険な理由を理解した
- [ ] bcryptの使い方を理解した
- [ ] パスワードリセットの安全な実装を理解した

---

## 次のステップへ

パスワードの安全な管理を学びました。
次のセクションでは、モダンな認証の要である**JWT（JSON Web Token）**の仕組みを学びます。

---

*推定読了時間: 30分*
