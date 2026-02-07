# ログ分析で攻撃を検知しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 2
subStep: 4
title: "ログ分析で攻撃を検知しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "DevSecOps"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 「ツールも大事だが、もう1つ重要なスキルがある」高橋さんが画面を切り替えた。
>
> 「アクセスログの分析だ。今回の不審なアクセスも、ログの監視から発覚した。
> ログを読めるエンジニアは、攻撃の兆候を早期に察知できる」
>
> 画面にはずらりとアクセスログが並んでいる。
>
> 「これ全部見るんですか......？」
>
> 「全部見る必要はない。パターンを知っていれば、異常を素早く見つけられる。
> 今からそのパターンを教えよう」

---

## アクセスログの基本

### Webサーバーのログ形式

Nginx / Apache の一般的なアクセスログ形式（Combined Log Format）:

```
192.168.1.100 - - [15/Jan/2025:14:30:05 +0900] "GET /api/users?id=1 HTTP/1.1" 200 1234 "https://example.com/dashboard" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
```

```
各フィールドの意味:
192.168.1.100    → クライアントのIPアドレス
-                → 認証ユーザー名（未認証の場合は -）
[15/Jan/2025:...]→ アクセス日時
"GET /api/..."   → HTTPメソッドとパス
200              → HTTPステータスコード
1234             → レスポンスサイズ（バイト）
"https://..."    → リファラー（参照元URL）
"Mozilla/5.0..." → ユーザーエージェント
```

---

## 不審なパターンを見つける

### パターン1: SQLインジェクションの試行

```
# 典型的なSQLi攻撃のログ
10.0.0.50 - - [15/Jan/2025:14:30:05 +0900] "GET /api/users?id=1%27%20OR%201%3D1%20-- HTTP/1.1" 200 45678
10.0.0.50 - - [15/Jan/2025:14:30:07 +0900] "GET /api/users?id=1%27%20UNION%20SELECT%20*%20FROM%20passwords%20-- HTTP/1.1" 500 234
10.0.0.50 - - [15/Jan/2025:14:30:09 +0900] "GET /api/users?id=1%27%3B%20DROP%20TABLE%20users%20-- HTTP/1.1" 500 234
```

URLデコードすると:
```
/api/users?id=1' OR 1=1 --
/api/users?id=1' UNION SELECT * FROM passwords --
/api/users?id=1'; DROP TABLE users --
```

**注目ポイント:**
- 同一IPから短時間に連続したリクエスト
- URLにSQLの予約語（`UNION`, `SELECT`, `DROP`, `OR 1=1`）が含まれている
- `'`（シングルクオート）や `--`（コメント）の存在

### パターン2: XSS攻撃の試行

```
10.0.0.50 - - [15/Jan/2025:14:31:00 +0900] "GET /search?q=%3Cscript%3Ealert(1)%3C/script%3E HTTP/1.1" 200 5678
10.0.0.50 - - [15/Jan/2025:14:31:02 +0900] "POST /comments HTTP/1.1" 200 123
```

デコード: `/search?q=<script>alert(1)</script>`

### パターン3: ブルートフォース攻撃

```
# 同一IPから大量のログイン試行
10.0.0.50 - - [15/Jan/2025:14:30:00 +0900] "POST /api/login HTTP/1.1" 401 45
10.0.0.50 - - [15/Jan/2025:14:30:01 +0900] "POST /api/login HTTP/1.1" 401 45
10.0.0.50 - - [15/Jan/2025:14:30:02 +0900] "POST /api/login HTTP/1.1" 401 45
10.0.0.50 - - [15/Jan/2025:14:30:03 +0900] "POST /api/login HTTP/1.1" 401 45
10.0.0.50 - - [15/Jan/2025:14:30:04 +0900] "POST /api/login HTTP/1.1" 200 234
```

**注目ポイント:**
- 同一エンドポイントへの高頻度リクエスト
- 401（認証失敗）の連続後に200（成功）
- 1秒間隔など機械的なタイミング

### パターン4: ディレクトリトラバーサルの試行

```
10.0.0.50 - - [15/Jan/2025:14:32:00 +0900] "GET /files?path=../../etc/passwd HTTP/1.1" 403 45
10.0.0.50 - - [15/Jan/2025:14:32:02 +0900] "GET /files?path=..%2F..%2Fetc%2Fpasswd HTTP/1.1" 200 1234
```

### パターン5: 異常なレスポンスサイズ

```
# 通常のレスポンスサイズは 500 バイト程度のエンドポイントで
# 突然大きなレスポンスが返されている
10.0.0.50 - - [15/Jan/2025:14:33:00 +0900] "GET /api/users?id=1 HTTP/1.1" 200 512
10.0.0.50 - - [15/Jan/2025:14:33:05 +0900] "GET /api/users?id=1' OR 1=1-- HTTP/1.1" 200 458902
```

レスポンスサイズが 512 バイトから 458,902 バイトに急増しています。SQLインジェクションにより全レコードが返された可能性があります。

---

## ログ分析のコマンド例

### 基本的な分析

```bash
# 特定のIPからのアクセスを抽出
grep "10.0.0.50" access.log

# SQLインジェクションのパターンを検索
grep -iE "(union|select|drop|insert|delete|update|or 1=1|' --)" access.log

# XSSパターンの検索
grep -iE "(<script|alert\(|onerror=|onload=)" access.log

# 401エラーの頻度を確認（ブルートフォース検出）
grep " 401 " access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 特定の時間帯のアクセスを抽出
grep "15/Jan/2025:14:3" access.log
```

### 高度な分析

```bash
# IPごとのリクエスト数を集計（異常に多いIPを発見）
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -20

# 5xx エラーの多いエンドポイントを特定
grep " 5[0-9][0-9] " access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10

# 1分間に100回以上アクセスしているIPを検出
awk '{print $1, $4}' access.log | \
  awk -F'[: ]' '{print $1, $2":"$3":"$4}' | \
  sort | uniq -c | sort -rn | \
  awk '$1 > 100 {print}'
```

---

## レート制限の重要性

ログ分析で攻撃を検知するだけでなく、レート制限で攻撃を予防することも重要です。

```typescript
// express-rate-limit を使用した例
import rateLimit from 'express-rate-limit';

// 一般的なAPI: 15分間に100リクエストまで
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'リクエスト数の上限に達しました。しばらく待ってから再試行してください。' }
});

// ログインAPI: 15分間に5回まで（ブルートフォース対策）
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'ログイン試行回数の上限に達しました。' }
});

app.use('/api/', apiLimiter);
app.use('/api/login', loginLimiter);
```

---

## セキュリティログの記録

アクセスログだけでなく、アプリケーション内でセキュリティイベントを記録することも重要です。

```typescript
// セキュリティイベントのログ記録
function logSecurityEvent(event: {
  type: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  ip: string;
  userId?: string;
  details: string;
}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event
  };
  console.log(`[SECURITY] ${JSON.stringify(logEntry)}`);
}

// 使用例
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);

  if (!user) {
    logSecurityEvent({
      type: 'LOGIN_FAILED',
      severity: 'WARN',
      ip: req.ip,
      details: `Failed login attempt for email: ${email}`
    });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  logSecurityEvent({
    type: 'LOGIN_SUCCESS',
    severity: 'INFO',
    ip: req.ip,
    userId: user.id,
    details: `Successful login`
  });
});
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ログ形式 | Combined Log Format の各フィールドを理解する |
| 不審パターン | SQLi、XSS、ブルートフォース、異常サイズを見分ける |
| 分析コマンド | grep、awk、sort、uniq を組み合わせて分析 |
| レート制限 | ログ分析だけでなく、予防措置も実装する |

### チェックリスト

- [ ] アクセスログの各フィールドを理解した
- [ ] 不審なアクセスパターンを5つ以上識別できる
- [ ] grepとawkを使ったログ分析の基本を理解した
- [ ] レート制限の必要性を理解した

---

## 次のステップへ

ログ分析の方法を学びました。
次のセクションでは、これまでの知識を活用して、実際に脆弱なコードを見つけて報告する演習に取り組みます。

---

*推定読了時間: 30分*
