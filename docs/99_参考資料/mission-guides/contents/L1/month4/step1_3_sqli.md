# SQLインジェクションの仕組み

## メタ情報

```yaml
mission: "SQLインジェクション攻撃を阻止しよう"
step: 1
subStep: 3
title: "SQLインジェクションの仕組み"
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

> 高橋さんが画面にアクセスログを映し出した。
>
> 「見てくれ。このリクエストのパラメータだ」
>
> ```
> GET /api/users?name=' OR 1=1 --
> ```
>
> 「これが......SQLインジェクションですか」
>
> 「ああ。この文字列がそのままSQLクエリに埋め込まれると、データベースの全レコードが返される。
> 攻撃者はこうやって、少しずつシステムの中身を探っていくんだ」
>
> 「どうしてこんなことが可能なんですか？」
>
> 「原因はシンプルだ。**ユーザーの入力を信頼して、そのままSQLに組み込んでいる**からだ」

---

## SQLインジェクションとは

SQLインジェクション（SQLi）は、ユーザーの入力がSQL文の一部として解釈されることで、攻撃者がデータベースを不正に操作できてしまう脆弱性です。

### 基本的な仕組み

```
正常なリクエスト:
  入力: "田中"
  SQL:  SELECT * FROM users WHERE name = '田中';
  結果: 田中さんのデータのみ返る

攻撃リクエスト:
  入力: "' OR 1=1 --"
  SQL:  SELECT * FROM users WHERE name = '' OR 1=1 --';
  結果: 全ユーザーのデータが返る
```

### なぜ起こるのか

```typescript
// 脆弱なコード: 文字列連結でSQLを組み立てている
const query = `SELECT * FROM users WHERE name = '${userInput}'`;

// userInput が "' OR 1=1 --" の場合:
// SELECT * FROM users WHERE name = '' OR 1=1 --'
//                                    ^^^^^^^^ ^^
//                                    常に真    コメント（残りを無視）
```

`--` はSQLのコメントです。これにより、元のクエリの残りの部分（閉じクオートなど）が無視されます。

---

## SQLインジェクションの種類

### 1. クラシック（インバンド）SQLインジェクション

結果が画面に直接表示されるタイプです。

```sql
-- ユーザー検索フォームへの攻撃
-- 入力: ' UNION SELECT username, password FROM admin_users --
SELECT * FROM users WHERE name = '' UNION SELECT username, password FROM admin_users --';
```

UNION句を使って、別のテーブルのデータを一緒に取得します。

### 2. ブラインドSQLインジェクション

結果が直接表示されない場合でも、True/Falseの違いや応答時間の差から情報を推測する攻撃です。

#### Boolean-based（真偽値ベース）

```sql
-- 管理者のパスワードの1文字目が 'a' かどうかを確認
' AND (SELECT SUBSTRING(password, 1, 1) FROM admin_users LIMIT 1) = 'a' --

-- 画面の表示が変わる → 'a' で正解
-- 画面が変わらない → 'a' ではない → 次の文字を試す
```

#### Time-based（時間ベース）

```sql
-- パスワードの1文字目が 'a' なら5秒待機
' AND IF((SELECT SUBSTRING(password, 1, 1) FROM admin_users LIMIT 1) = 'a', SLEEP(5), 0) --

-- レスポンスが5秒遅れた → 'a' で正解
```

### 3. エラーベースSQLインジェクション

データベースのエラーメッセージから情報を漏洩させる攻撃です。

```sql
-- エラーメッセージにバージョン情報が含まれる
' AND 1=CONVERT(int, @@version) --

-- エラー: Conversion failed when converting the nvarchar value
-- 'Microsoft SQL Server 2019...' to data type int.
```

---

## 実際の攻撃シナリオ

### シナリオ1: ログインバイパス

```typescript
// 脆弱なログイン処理
const query = `SELECT * FROM users
  WHERE email = '${email}' AND password = '${password}'`;
```

攻撃者の入力:
- メール: `admin@example.com' --`
- パスワード: （何でもよい）

```sql
SELECT * FROM users
  WHERE email = 'admin@example.com' --' AND password = '任意の値';
-- パスワードチェックがコメントアウトされる
-- → パスワードなしでログインできてしまう
```

### シナリオ2: データの窃取

```typescript
// 脆弱な商品検索
const query = `SELECT name, price FROM products WHERE category = '${category}'`;
```

攻撃者の入力: `' UNION SELECT email, password FROM users --`

```sql
SELECT name, price FROM products WHERE category = ''
UNION SELECT email, password FROM users --';
-- 商品一覧にユーザーのメールとパスワードが混ざって表示される
```

### シナリオ3: データの改ざん・削除

```sql
-- 入力: '; DROP TABLE users; --
SELECT * FROM users WHERE name = ''; DROP TABLE users; --';
-- usersテーブルが削除される
```

```sql
-- 入力: '; UPDATE users SET role = 'admin' WHERE email = 'attacker@evil.com'; --
-- 攻撃者のアカウントが管理者権限に昇格される
```

---

## 実際の被害事例

### 事例から学ぶ教訓

| 事例 | 概要 | 影響 |
|------|------|------|
| Sony Pictures (2011) | SQLiにより100万件以上のアカウント情報が漏洩 | パスワードが平文で保存されていた |
| Heartland Payment Systems (2008) | SQLiを起点に1.3億件のカード情報が漏洩 | 損害額1億4000万ドル以上 |
| TalkTalk (2015) | SQLiにより15万件の顧客データが漏洩 | 罰金40万ポンド、顧客10万人離脱 |

---

## 攻撃を検出するヒント

### 不審な入力パターン

以下のような文字列がリクエストに含まれていたら要注意です。

```
' OR 1=1 --
' UNION SELECT
'; DROP TABLE
' AND 1=1
' AND SLEEP(5)
admin'--
1' OR '1'='1
```

### ログで見るべきポイント

```
# アクセスログの不審なパターン
GET /search?q=%27%20OR%201%3D1%20-- HTTP/1.1
# デコードすると: /search?q=' OR 1=1 --

GET /api/users?id=1%20UNION%20SELECT%20*%20FROM%20passwords HTTP/1.1
# デコードすると: /api/users?id=1 UNION SELECT * FROM passwords
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 原因 | ユーザー入力をそのままSQL文に埋め込んでいる |
| 種類 | クラシック、ブラインド（Boolean/Time）、エラーベース |
| 被害 | データ漏洩、改ざん、削除、認証バイパス |
| 検出 | 特定の文字列パターン（`' OR`, `UNION SELECT`, `--`）を監視 |

### チェックリスト

- [ ] SQLインジェクションの基本的な仕組みを理解した
- [ ] 3種類のSQLi（クラシック、ブラインド、エラーベース）を区別できる
- [ ] 文字列連結が危険な理由を説明できる
- [ ] 攻撃パターンを見たとき、それがSQLiだと判断できる

---

## 次のステップへ

SQLインジェクションの仕組みを学びました。
次のセクションでは、もう1つの重大な脆弱性である**XSS（クロスサイトスクリプティング）**を学びます。

攻撃手法のバリエーションを知ることで、防御の視野を広げましょう。

---

*推定読了時間: 30分*
