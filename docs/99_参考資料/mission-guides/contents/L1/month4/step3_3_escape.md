# 出力エスケープでXSSを防ごう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 3
subStep: 3
title: "出力エスケープでXSSを防ごう"
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

> 「入力バリデーションで不正な値を弾くことはできた。でもそれだけでは不十分だ」
>
> 高橋さんが説明する。
>
> 「データベースに保存されたデータをHTMLに出力するとき、
> そのデータにスクリプトが含まれていたらどうなる？」
>
> 「格納型XSSですね。入力時にチェックしていても、
> 過去に保存されたデータや外部から取得したデータは安全とは限らない......」
>
> 「その通り。だから**出力時のエスケープ**が最後の砦になる。
> 入力と出力、両方で防御する。これが多層防御の実践だ」

---

## 出力エスケープとは

HTMLに特別な意味を持つ文字を、安全な文字参照（エンティティ）に変換することです。

```
変換ルール:
  &  → &amp;
  <  → &lt;
  >  → &gt;
  "  → &quot;
  '  → &#x27;
  /  → &#x2F;
```

```
エスケープ前（危険）:
  <p>こんにちは、<script>alert('XSS')</script>さん</p>
  → ブラウザがスクリプトを実行してしまう

エスケープ後（安全）:
  <p>こんにちは、&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;/script&gt;さん</p>
  → ブラウザは文字列として表示する
```

---

## サーバーサイドでのエスケープ

### escape-html ライブラリ

```typescript
import escapeHtml from 'escape-html';

app.get('/profile', (req, res) => {
  const name = req.query.name;
  res.send(`<h1>こんにちは、${escapeHtml(name)}さん</h1>`);
});

// 入力: <script>alert('XSS')</script>
// 出力: <h1>こんにちは、&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;さん</h1>
// → 安全に文字列として表示される
```

### テンプレートエンジンの自動エスケープ

多くのテンプレートエンジンはデフォルトで自動エスケープを行います。

```
EJS:
  <%= userInput %>   → 自動エスケープ（安全）
  <%- userInput %>   → エスケープなし（危険）

Pug:
  p= userInput       → 自動エスケープ（安全）
  p!= userInput      → エスケープなし（危険）

Handlebars:
  {{userInput}}      → 自動エスケープ（安全）
  {{{userInput}}}    → エスケープなし（危険）

React (JSX):
  <p>{userInput}</p> → 自動エスケープ（安全）
  dangerouslySetInnerHTML → エスケープなし（危険）
```

**重要**: テンプレートエンジンを使っていても、エスケープを無効にする構文を使うと脆弱になります。

---

## クライアントサイドでのXSS対策

### innerHTML vs textContent

```typescript
// 危険: innerHTML はHTMLとして解釈される
const userInput = '<img src=x onerror="alert(1)">';
document.getElementById('output').innerHTML = userInput;
// → スクリプトが実行される

// 安全: textContent はテキストとして表示される
document.getElementById('output').textContent = userInput;
// → 「<img src=x onerror="alert(1)">」が文字列として表示される
```

### DOMPurify

ユーザーのHTMLコンテンツ（リッチテキストなど）を受け入れる必要がある場合は、DOMPurifyでサニタイズします。

```typescript
import DOMPurify from 'dompurify';

// HTMLコンテンツをサニタイズ
const dirtyHtml = '<p>Hello</p><script>alert("XSS")</script><b>World</b>';
const cleanHtml = DOMPurify.sanitize(dirtyHtml);
// 結果: '<p>Hello</p><b>World</b>'
// → <script> タグが除去される

// 許可するタグを制限
const cleanHtml = DOMPurify.sanitize(dirtyHtml, {
  ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'br'],
  ALLOWED_ATTR: ['href', 'title']
});
```

---

## Content-Security-Policy（CSP）

CSPはブラウザに対して、どのソースからのスクリプトを実行するかを指示するHTTPヘッダーです。

### 基本的な設定

```typescript
// Express での CSP ヘッダー設定
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",                    // デフォルトは同一オリジンのみ
    "script-src 'self'",                     // スクリプトは同一オリジンのみ
    "style-src 'self' 'unsafe-inline'",      // スタイルは同一オリジンとインライン
    "img-src 'self' data: https:",           // 画像は同一オリジン、data URI、HTTPS
    "font-src 'self' https://fonts.gstatic.com", // フォントの許可元
    "connect-src 'self' https://api.example.com", // API接続先
    "frame-ancestors 'none'",                // iframeへの埋め込みを禁止
  ].join('; '));
  next();
});
```

### CSPがXSSを防ぐ仕組み

```
CSP: script-src 'self'

XSS攻撃で以下のスクリプトが注入されたとする:
<script>alert('XSS')</script>

→ インラインスクリプトは 'self' に含まれないため、
  ブラウザがスクリプトの実行をブロックする

コンソールに以下のエラーが表示される:
"Refused to execute inline script because it violates the
Content Security Policy directive: script-src 'self'"
```

### CSPのレポート機能

```typescript
// CSP違反をレポートする設定
res.setHeader('Content-Security-Policy-Report-Only', [
  "default-src 'self'",
  "script-src 'self'",
  "report-uri /api/csp-report"  // 違反レポートの送信先
].join('; '));

// 違反レポートを受け取るエンドポイント
app.post('/api/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  console.log('CSP Violation:', req.body);
  res.status(204).end();
});
```

`Report-Only` ヘッダーを使うと、ブロックせずに違反を報告だけします。本番導入前のテストに有用です。

---

## コンテキスト別のエスケープ

出力先によって、必要なエスケープ方法が異なります。

```
出力先          エスケープ方法              例
─────────────────────────────────────────────────
HTMLの本文      HTMLエンティティ            &lt;script&gt;
HTML属性値      HTMLエンティティ + 引用符    href="..."
JavaScript      JavaScript文字列エスケープ   \x3cscript\x3e
URL            URLエンコード               %3Cscript%3E
CSS            CSSエスケープ               \3c script\3e
```

```typescript
// HTMLコンテキスト
const safeHtml = escapeHtml(userInput);
res.send(`<p>${safeHtml}</p>`);

// JavaScript コンテキスト
const safeJs = JSON.stringify(userInput);
res.send(`<script>var name = ${safeJs};</script>`);

// URL コンテキスト
const safeUrl = encodeURIComponent(userInput);
res.send(`<a href="/search?q=${safeUrl}">検索</a>`);
```

---

## Reactでの安全なレンダリング

ReactはデフォルトでJSXの値をエスケープします。

```tsx
// 安全: React が自動的にエスケープ
function UserProfile({ name }: { name: string }) {
  return <h1>こんにちは、{name}さん</h1>;
  // name が "<script>alert(1)</script>" でも安全に表示される
}

// 危険: dangerouslySetInnerHTML はエスケープしない
function RichContent({ html }: { html: string }) {
  // 使用する場合は必ず DOMPurify でサニタイズする
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 出力エスケープ | HTML特殊文字をエンティティに変換 |
| テンプレートエンジン | 自動エスケープを有効に保つ |
| DOMPurify | リッチテキストを安全にサニタイズ |
| CSP | ブラウザレベルでスクリプト実行を制限 |
| コンテキスト | 出力先に応じた適切なエスケープを選択 |

### チェックリスト

- [ ] HTMLエスケープの仕組みを理解した
- [ ] テンプレートエンジンの自動エスケープ機能を把握した
- [ ] DOMPurifyの使い方を理解した
- [ ] CSPの基本的な設定方法を理解した
- [ ] innerHTML と textContent の違いを理解した

---

## 次のステップへ

出力エスケープによるXSS対策を学びました。
次のセクションでは、**セキュリティヘッダー**を体系的に設定する方法を学びます。

---

*推定読了時間: 30分*
