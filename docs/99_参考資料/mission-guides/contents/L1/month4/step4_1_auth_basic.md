# 認証と認可の違い

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 4
subStep: 1
title: "認証と認可の違い"
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

> 「ここまではコードの脆弱性を防ぐ方法を学んだ。次は**認証と認可**だ」
>
> 高橋さんが言う。
>
> 「システムにアクセスしている人が本当に本人かどうか確認する仕組み、
> そしてその人にどの操作を許可するかを制御する仕組み。
> これが壊れると、攻撃者が正規ユーザーになりすましたり、
> 権限外の操作を実行できたりする」
>
> 「認証と認可......似ているようで違うんですね」
>
> 「よく混同されるが、全く別の概念だ。まずはこの違いを明確にしよう」

---

## 認証（Authentication）と認可（Authorization）

### 認証（Authentication）= 「あなたは誰？」

本人であることを確認するプロセスです。

```
認証の方法:
├── 知識情報（Something you know）
│   └── パスワード、PIN、秘密の質問
├── 所持情報（Something you have）
│   └── スマートフォン、セキュリティキー、ICカード
└── 生体情報（Something you are）
    └── 指紋、顔認証、虹彩認証
```

### 認可（Authorization）= 「あなたは何ができる？」

認証されたユーザーに対して、どの操作を許可するかを制御するプロセスです。

```
認可の例:
├── 一般ユーザー
│   ├── 自分のプロフィールを閲覧・編集 ✅
│   ├── 自分の注文履歴を閲覧 ✅
│   └── 他人のデータを閲覧 ❌
├── 編集者
│   ├── 記事の作成・編集 ✅
│   ├── 記事の公開 ✅
│   └── ユーザーの管理 ❌
└── 管理者
    ├── 全ての操作 ✅
    ├── ユーザーの管理 ✅
    └── システム設定の変更 ✅
```

### 比喩で理解する

```
ホテルの例:

認証 = フロントでチェックイン（身分証を見せて本人確認）
認可 = ルームキーで入れる部屋が決まる
       （自分の部屋は入れるが、他の客の部屋には入れない）
```

---

## セッションベース認証 vs トークンベース認証

### セッションベース認証

```
1. ユーザーがログイン（ID + パスワード）
2. サーバーがセッションを作成し、セッションIDを発行
3. セッションIDをCookieでブラウザに保存
4. 以降のリクエストでCookieが自動送信される
5. サーバーがセッションIDからユーザーを特定

クライアント                    サーバー
    │                            │
    │── POST /login ──────────→  │
    │   {email, password}        │ セッション作成
    │                            │ sessions["abc123"] = {userId: 1}
    │←── Set-Cookie: sid=abc123 ─│
    │                            │
    │── GET /api/profile ──────→ │
    │   Cookie: sid=abc123       │ セッションからユーザー特定
    │←── {name: "田中"} ────────│
```

**メリット**: サーバー側でセッションを管理するため、無効化が容易
**デメリット**: サーバーにセッション情報を保持する必要がある（スケーリングが課題）

### トークンベース認証（JWT）

```
1. ユーザーがログイン（ID + パスワード）
2. サーバーがJWTトークンを発行
3. トークンをクライアントが保存（localStorage等）
4. 以降のリクエストでAuthorizationヘッダーにトークンを付与
5. サーバーがトークンを検証してユーザーを特定

クライアント                    サーバー
    │                            │
    │── POST /login ──────────→  │
    │   {email, password}        │ JWT生成
    │←── {token: "eyJ..."} ─────│
    │                            │
    │── GET /api/profile ──────→ │
    │   Authorization: Bearer eyJ│ JWT検証
    │←── {name: "田中"} ────────│
```

**メリット**: サーバーにセッション情報を持たない（ステートレス）、スケーラブル
**デメリット**: トークンの無効化が困難（有効期限まで有効）

---

## RBAC（ロールベースアクセス制御）

### RBACとは

ユーザーに「ロール」を割り当て、ロールごとに権限を定義するアクセス制御の方式です。

```
ロール定義:
┌──────────┬───────┬───────┬───────┬───────┐
│  操作     │ user  │ editor│ admin │ super │
├──────────┼───────┼───────┼───────┼───────┤
│ 記事閲覧  │  ✅   │  ✅   │  ✅   │  ✅   │
│ 記事作成  │  ❌   │  ✅   │  ✅   │  ✅   │
│ 記事削除  │  ❌   │  ❌   │  ✅   │  ✅   │
│ ユーザー管理│ ❌   │  ❌   │  ✅   │  ✅   │
│ システム設定│ ❌   │  ❌   │  ❌   │  ✅   │
└──────────┴───────┴───────┴───────┴───────┘
```

### 実装例

```typescript
// ロールベースの認可ミドルウェア
function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

// 使用例
app.get('/api/posts', authMiddleware, getAllPosts);                             // 全員
app.post('/api/posts', authMiddleware, requireRole('editor', 'admin'), createPost); // 編集者以上
app.delete('/api/posts/:id', authMiddleware, requireRole('admin'), deletePost);     // 管理者のみ
app.get('/admin/users', authMiddleware, requireRole('admin'), listUsers);           // 管理者のみ
```

---

## よくある認証の脆弱性

### 1. 認証チェックの漏れ

```typescript
// 危険: 認証チェックなし
app.get('/api/admin/users', async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users); // 誰でもアクセスできてしまう
});
```

### 2. 認可チェックの漏れ（IDOR: Insecure Direct Object Reference）

```typescript
// 危険: 認証はあるが認可チェックなし
app.get('/api/users/:id/orders', authMiddleware, async (req, res) => {
  const orders = await db.getOrders(req.params.id);
  res.json(orders); // 他人の注文も見れてしまう
});

// 安全: 認可チェック付き
app.get('/api/users/:id/orders', authMiddleware, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const orders = await db.getOrders(req.params.id);
  res.json(orders);
});
```

### 3. クライアント側での認可チェックのみ

```typescript
// 危険: フロントエンドでのみ管理者チェック
// フロントエンド
if (user.role === 'admin') {
  showAdminButton();
}
// → ブラウザの開発者ツールで簡単にバイパスされる
// → サーバーサイドでもチェックが必要
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 認証 | 「あなたは誰か」を確認するプロセス |
| 認可 | 「何ができるか」を制御するプロセス |
| セッション vs トークン | ステートフル vs ステートレスの違い |
| RBAC | ロールに基づくアクセス制御 |
| よくある問題 | 認証・認可チェックの漏れ、IDOR |

### チェックリスト

- [ ] 認証と認可の違いを説明できる
- [ ] セッションベースとトークンベースの違いを理解した
- [ ] RBACの仕組みを理解した
- [ ] 認証・認可の脆弱性パターンを識別できる

---

## 次のステップへ

認証と認可の基本概念を理解しました。
次のセクションでは、認証の最も基本的な要素である**パスワード管理**の安全な実装を学びます。

---

*推定読了時間: 30分*
