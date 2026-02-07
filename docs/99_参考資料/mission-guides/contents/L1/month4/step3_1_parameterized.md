# パラメータ化クエリで防御しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 3
subStep: 1
title: "パラメータ化クエリで防御しよう"
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

> 「攻撃手法と脆弱性の見つけ方は分かった。ここからは防御だ」
>
> 高橋さんが言う。
>
> 「SQLインジェクション対策の最も効果的な方法は、**パラメータ化クエリ**だ。
> これを徹底するだけで、SQLインジェクションの99%を防げる」
>
> 「なぜそれほど効果的なんですか？」
>
> 「文字列連結では、ユーザー入力がSQL構文の一部として解釈される。
> パラメータ化クエリでは、入力は常にデータとして扱われ、SQL構文に影響を与えない。
> 根本原因を断ち切る対策だからだ」

---

## パラメータ化クエリとは

パラメータ化クエリ（Prepared Statement / プリペアドステートメント）は、SQL文の構造と値を分離する手法です。

### 仕組み

```
文字列連結（危険）:
1. SQL文 = "SELECT * FROM users WHERE name = '" + 入力値 + "'"
2. データベースが SQL文全体 を解析
→ 入力値が SQL構文 として解釈される可能性がある

パラメータ化クエリ（安全）:
1. SQL文のテンプレート = "SELECT * FROM users WHERE name = $1"
2. データベースがテンプレートを解析（構造が確定）
3. パラメータ（入力値）をデータとしてバインド
→ 入力値は常に 値（データ） として扱われる
```

```
┌─────────────────────────────────────┐
│ パラメータ化クエリの内部処理           │
│                                     │
│ ステップ1: SQL構造を解析              │
│   SELECT * FROM users WHERE name = ? │
│                                ^^^^  │
│                              プレースホルダ │
│                                     │
│ ステップ2: 値をバインド               │
│   ? ← "' OR 1=1 --"                │
│                                     │
│ ステップ3: 実行                      │
│   name = "' OR 1=1 --" (文字列として比較) │
│   → 一致するレコードなし（安全）       │
└─────────────────────────────────────┘
```

---

## 各言語・ライブラリでの実装

### Node.js (pg / PostgreSQL)

```typescript
// 脆弱なコード
const query = `SELECT * FROM users WHERE email = '${email}'`;
const result = await pool.query(query);

// セキュアなコード: $1, $2 ... でプレースホルダを指定
const query = 'SELECT * FROM users WHERE email = $1';
const result = await pool.query(query, [email]);

// 複数パラメータ
const query = 'SELECT * FROM users WHERE email = $1 AND status = $2';
const result = await pool.query(query, [email, status]);

// INSERT文
const query = 'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id';
const result = await pool.query(query, [name, email, role]);
```

### Node.js (mysql2)

```typescript
// MySQL では ? をプレースホルダとして使用
const query = 'SELECT * FROM users WHERE email = ? AND status = ?';
const [rows] = await pool.execute(query, [email, status]);
```

### Python (psycopg2 / PostgreSQL)

```python
# 脆弱なコード
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# セキュアなコード: %s でプレースホルダを指定
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

# 複数パラメータ
cursor.execute(
    "SELECT * FROM users WHERE email = %s AND status = %s",
    (email, status)
)
```

### Python (SQLAlchemy)

```python
from sqlalchemy import text

# text() を使ったパラメータ化クエリ
stmt = text("SELECT * FROM users WHERE email = :email AND status = :status")
result = session.execute(stmt, {"email": email, "status": status})
```

---

## ORMを使った安全なデータベース操作

ORMを使用することで、SQLインジェクションのリスクをさらに低減できます。

### Prisma（TypeScript）

```typescript
// Prisma はデフォルトでパラメータ化クエリを使用
const user = await prisma.user.findUnique({
  where: { email: email }
});

// 検索
const users = await prisma.user.findMany({
  where: {
    name: { contains: searchTerm },
    status: 'active'
  }
});

// 作成
const newUser = await prisma.user.create({
  data: { name, email, role: 'user' }
});

// 更新
const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: newName }
});
```

### Prisma で raw query を使う場合の注意

```typescript
// 安全: タグ付きテンプレートリテラル（Prisma が自動的にパラメータ化）
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE name LIKE ${`%${searchTerm}%`}
`;

// 危険: $queryRawUnsafe はパラメータ化しない
const users = await prisma.$queryRawUnsafe(
  `SELECT * FROM users WHERE name = '${searchTerm}'`  // SQLインジェクション可能
);
```

---

## LIKE句のパラメータ化

LIKE句でのパラメータ化は少し注意が必要です。

```typescript
// 脆弱: LIKE句に直接埋め込み
const query = `SELECT * FROM products WHERE name LIKE '%${search}%'`;

// セキュアだが不完全: ワイルドカードのエスケープが必要
const query = 'SELECT * FROM products WHERE name LIKE $1';
await pool.query(query, [`%${search}%`]);
// search に % や _ が含まれると意図しない動作になる

// 完全にセキュア: ワイルドカード文字もエスケープ
function escapeLikePattern(pattern: string): string {
  return pattern.replace(/[%_\\]/g, '\\$&');
}

const safeSearch = escapeLikePattern(search);
const query = "SELECT * FROM products WHERE name LIKE $1 ESCAPE '\\'";
await pool.query(query, [`%${safeSearch}%`]);
```

---

## IN句のパラメータ化

```typescript
// 脆弱: IN句に直接埋め込み
const ids = req.query.ids; // "1,2,3"
const query = `SELECT * FROM users WHERE id IN (${ids})`;

// セキュア: 各値を個別のパラメータとして渡す
const ids = [1, 2, 3];
const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
const query = `SELECT * FROM users WHERE id IN (${placeholders})`;
await pool.query(query, ids);
// 生成されるSQL: SELECT * FROM users WHERE id IN ($1, $2, $3)
```

---

## ORDER BY句の安全な処理

ORDER BY句はパラメータ化できないため、ホワイトリストで制御します。

```typescript
// 脆弱: ORDER BY に直接埋め込み
const sortBy = req.query.sort; // "name; DROP TABLE users --"
const query = `SELECT * FROM users ORDER BY ${sortBy}`;

// セキュア: ホワイトリストで許可するカラムを制限
const ALLOWED_SORT_COLUMNS = ['name', 'email', 'created_at'];
const ALLOWED_SORT_DIRECTIONS = ['ASC', 'DESC'];

const sortBy = ALLOWED_SORT_COLUMNS.includes(req.query.sort)
  ? req.query.sort
  : 'created_at';

const sortDir = ALLOWED_SORT_DIRECTIONS.includes(req.query.dir?.toUpperCase())
  ? req.query.dir.toUpperCase()
  : 'DESC';

const query = `SELECT id, name, email FROM users ORDER BY ${sortBy} ${sortDir}`;
// sortBy と sortDir はホワイトリストで検証済みのため安全
await pool.query(query);
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| パラメータ化クエリ | SQL構文と値を分離し、入力を常にデータとして扱う |
| ORM | デフォルトでパラメータ化されるため、さらに安全 |
| LIKE句 | ワイルドカード文字のエスケープも必要 |
| ORDER BY | パラメータ化できないため、ホワイトリストで制御 |

### チェックリスト

- [ ] パラメータ化クエリの仕組みを理解した
- [ ] 各言語でのパラメータ化クエリの書き方を理解した
- [ ] ORMの安全性と raw query 使用時の注意点を理解した
- [ ] LIKE句やORDER BY句の安全な処理方法を理解した

---

## 次のステップへ

パラメータ化クエリによるSQLインジェクション対策を学びました。
次のセクションでは、より広範な**入力バリデーションとサニタイズ**について学びます。

---

*推定読了時間: 30分*
