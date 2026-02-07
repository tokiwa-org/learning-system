# 理解度チェック：攻撃の仕組みを理解しよう

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 1
subStep: 6
title: "理解度チェック"
itemType: QUIZ
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "セキュアコーディング"
  category: "セキュリティ"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 1で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. OWASP Top 10（2021年版）で最も順位が高い脆弱性カテゴリはどれですか？

- A) インジェクション
- B) アクセス制御の不備
- C) 暗号化の失敗
- D) セキュリティの設定ミス

<details>
<summary>答えを見る</summary>

**正解: B**

OWASP Top 10 2021年版では、A01（1位）は「アクセス制御の不備」です。
インジェクション（A03）は以前は1位でしたが、2021年版では3位に移動しました。
これは、フレームワークの進化によりインジェクション対策が進んだ一方で、
アクセス制御の不備が依然として多く報告されていることを反映しています。

</details>

---

### Q2. 以下のコードに含まれる脆弱性はどれですか？

```typescript
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;
const result = await db.execute(query);
```

- A) XSS
- B) CSRF
- C) SQLインジェクション
- D) SSRF

<details>
<summary>答えを見る</summary>

**正解: C**

ユーザー入力（`req.body.email`）をテンプレートリテラルで直接SQL文に埋め込んでいます。
攻撃者が `email` に `' OR 1=1 --` のような文字列を入力すると、
SQL文の構造が変わり、全ユーザーのデータが返されるなどの不正操作が可能になります。

対策: パラメータ化クエリ（プリペアドステートメント）を使用する。

</details>

---

### Q3. ブラインドSQLインジェクションの特徴として正しいものはどれですか？

- A) 攻撃結果が画面に直接表示される
- B) UNION句を使ってデータを取得する
- C) True/Falseの違いや応答時間の差から情報を推測する
- D) エラーメッセージからデータベースの情報を得る

<details>
<summary>答えを見る</summary>

**正解: C**

ブラインドSQLインジェクションは、攻撃結果が直接画面に表示されない場合に使われます。
- **Boolean-based**: 条件式の真偽によるページの表示差異から情報を1ビットずつ推測
- **Time-based**: `SLEEP()` 関数などで応答時間に差を作り、条件の真偽を判定

Aはクラシック（インバンド）SQLi、Dはエラーベースの特徴です。

</details>

---

### Q4. 格納型XSS（Stored XSS）が反射型XSS（Reflected XSS）より危険とされる理由はどれですか？

- A) サーバーのログに記録されないから
- B) 攻撃コードがデータベースに保存され、ページを閲覧する全ユーザーが被害を受けるから
- C) ブラウザのセキュリティ機能で検出できないから
- D) 管理者権限が必要だから

<details>
<summary>答えを見る</summary>

**正解: B**

格納型XSSでは、悪意のあるスクリプトがデータベースに保存されます。
そのため、攻撃者がURLを配布する必要がなく、そのページにアクセスする
全てのユーザーのブラウザでスクリプトが実行されます。

反射型XSSは、攻撃者が作成したURLをクリックした人だけが被害を受けます。

</details>

---

### Q5. CSRFトークンの役割として正しいものはどれですか？

- A) パスワードを暗号化する
- B) リクエストが正規のフォームから送信されたことを検証する
- C) SQLインジェクションを防ぐ
- D) セッションの有効期限を延長する

<details>
<summary>答えを見る</summary>

**正解: B**

CSRFトークンは、推測不可能なランダムな値をフォームに埋め込み、
サーバー側でリクエスト時にこのトークンを検証します。

攻撃者は正規のフォームに埋め込まれたトークンの値を知ることができないため、
罠サイトから偽のリクエストを送信しても、トークンの検証で拒否されます。

</details>

---

### Q6. 以下のコードに含まれるXSS脆弱性を悪用できる入力はどれですか？

```typescript
app.get('/greet', (req, res) => {
  res.send(`<h1>こんにちは、${req.query.name}さん</h1>`);
});
```

- A) `' OR 1=1 --`
- B) `<script>alert('XSS')</script>`
- C) `../../etc/passwd`
- D) `http://evil.com/malware`

<details>
<summary>答えを見る</summary>

**正解: B**

このコードはユーザー入力（`req.query.name`）をエスケープせずにHTMLに埋め込んでいます。
`<script>alert('XSS')</script>` を入力すると、以下のHTMLが生成されます:

```html
<h1>こんにちは、<script>alert('XSS')</script>さん</h1>
```

ブラウザがこのスクリプトを実行してしまいます。これは反射型XSSの例です。
Aはsqlインジェクション、Cはディレクトリトラバーサルの攻撃パターンです。

</details>

---

### Q7. SSRFの攻撃で狙われやすいURLはどれですか？

- A) `https://www.google.com`
- B) `http://169.254.169.254/latest/meta-data/`
- C) `https://example.com/api/users`
- D) `https://cdn.example.com/images/logo.png`

<details>
<summary>答えを見る</summary>

**正解: B**

`169.254.169.254` はAWSなどのクラウド環境でインスタンスメタデータにアクセスする
特別なIPアドレスです。SSRF攻撃でサーバーにこのURLへのリクエストを実行させると、
IAMロールの認証情報など、機密性の高い情報が取得される可能性があります。

SSRFの主なターゲットは内部ネットワークやメタデータエンドポイントです。

</details>

---

### Q8. クリックジャッキングへの対策として適切なHTTPヘッダーはどれですか？

- A) `Content-Type: text/html`
- B) `X-Frame-Options: DENY`
- C) `Cache-Control: no-cache`
- D) `Access-Control-Allow-Origin: *`

<details>
<summary>答えを見る</summary>

**正解: B**

`X-Frame-Options: DENY` はページがiframeに埋め込まれることを禁止するHTTPヘッダーです。
これにより、攻撃者が透明なiframeでページを重ねてクリックを誘導するクリックジャッキングを防止できます。

より現代的な方法として、CSPの `frame-ancestors 'none'` も同様の効果があります。
Dの `Access-Control-Allow-Origin: *` は逆にセキュリティリスクを高める設定です。

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます。**

Step 1「攻撃の仕組みを理解しよう」を完了しました。
次は Step 2「脆弱なコードを特定しよう」に進みましょう。

### 6問以下の場合

**もう少し復習しましょう。**

間違えた問題の内容を、該当するセクションで復習してください：

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step1_2 OWASP Top 10 |
| Q2, Q3 | step1_3 SQLインジェクションの仕組み |
| Q4, Q6 | step1_4 XSS攻撃 |
| Q5, Q7, Q8 | step1_5 CSRFとその他の攻撃手法 |

---

## Step 1 完了

お疲れさまでした。

### 学んだこと

- セキュリティの重要性と基本原則（多層防御、最小権限、ゼロトラスト）
- OWASP Top 10の全体像
- SQLインジェクションの3つの種類と攻撃手法
- XSSの3つのタイプ（反射型、格納型、DOM-based）
- CSRF、クリックジャッキング、SSRFの仕組みと対策

### 次のステップ

**Step 2: 脆弱なコードを特定しよう（4時間）**

攻撃手法を理解した今、次は実際のコードから脆弱性を見つけ出す力を養います。

---

*推定所要時間: 15分*
