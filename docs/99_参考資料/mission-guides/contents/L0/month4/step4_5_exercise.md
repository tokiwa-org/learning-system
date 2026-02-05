# 演習：HTTPリクエスト実践

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 4
subStep: 5
title: "演習：HTTPリクエスト実践"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "ネットワーク"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「curl の使い方を学んだね。じゃあ実際にHTTPリクエストを送って、Webの通信を体験してみよう」
>
> 「はい！やってみます！」
>
> 「httpbin.org というテスト用のサービスを使うから、安心して色々試してみて」

---

## ミッション概要

curl コマンドを使って、HTTPリクエストの送受信を体験します。

### 準備

ターミナルを開いてください。テスト用サービス httpbin.org を使います。

### 達成条件

- [ ] 8つのミッションすべてをクリアした
- [ ] 各ミッションで正しい出力が得られた
- [ ] コマンドを自分で入力して実行できた

---

### ミッション1: 基本のGETリクエスト

httpbin.org にGETリクエストを送り、レスポンスを確認してください。

<details><summary>解答</summary>

```bash
curl https://httpbin.org/get
```

出力例：
```json
{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/7.81.0"
  },
  "origin": "203.0.113.1",
  "url": "https://httpbin.org/get"
}
```

ポイント：
- `headers` にリクエストヘッダーが表示される
- `origin` にあなたのIPアドレスが表示される
- `url` にリクエスト先のURLが表示される

</details>

---

### ミッション2: 詳細表示（-v）でリクエスト/レスポンスを確認

-v オプションをつけて、リクエストとレスポンスの詳細を確認してください。ステータスコードとContent-Typeヘッダーを見つけましょう。

<details><summary>解答</summary>

```bash
curl -v https://httpbin.org/get
```

出力例（主要部分）：
```
> GET /get HTTP/2
> Host: httpbin.org
> User-Agent: curl/7.81.0
> Accept: */*
>
< HTTP/2 200
< content-type: application/json
```

確認ポイント：
- `> GET /get HTTP/2` → GETメソッドでリクエスト
- `< HTTP/2 200` → ステータスコード200（成功）
- `< content-type: application/json` → レスポンスはJSON形式

</details>

---

### ミッション3: ヘッダーだけを確認

www.example.com のレスポンスヘッダーだけを取得してください。Content-Type と Content-Length を確認しましょう。

<details><summary>解答</summary>

```bash
curl -I https://www.example.com
```

出力例：
```
HTTP/2 200
content-type: text/html; charset=UTF-8
content-length: 1256
```

確認ポイント：
- `content-type: text/html` → HTMLページ
- `content-length: 1256` → データサイズは1256バイト

</details>

---

### ミッション4: POSTリクエストでデータを送信

httpbin.org にJSONデータをPOSTで送信してください。

送信するデータ：
```json
{"username": "tanaka", "email": "tanaka@example.com"}
```

<details><summary>解答</summary>

```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"username": "tanaka", "email": "tanaka@example.com"}' \
     https://httpbin.org/post
```

出力例：
```json
{
  "data": "{\"username\": \"tanaka\", \"email\": \"tanaka@example.com\"}",
  "headers": {
    "Content-Type": "application/json"
  },
  "json": {
    "username": "tanaka",
    "email": "tanaka@example.com"
  }
}
```

ポイント：
- `-X POST` でPOSTメソッドを指定
- `-H "Content-Type: application/json"` でJSON形式を宣言
- `-d` で送信データを指定
- レスポンスの `json` フィールドに解析結果が表示される

</details>

---

### ミッション5: ステータスコードを確認しよう

以下のURLにアクセスして、異なるステータスコードを確認してください。

1. `https://httpbin.org/status/200` → 200 を確認
2. `https://httpbin.org/status/404` → 404 を確認
3. `https://httpbin.org/status/500` → 500 を確認

<details><summary>解答</summary>

```bash
# 200 OK
curl -I https://httpbin.org/status/200

# 404 Not Found
curl -I https://httpbin.org/status/404

# 500 Internal Server Error
curl -I https://httpbin.org/status/500
```

出力例：
```
# 200
HTTP/2 200

# 404
HTTP/2 404

# 500
HTTP/2 500
```

httpbin.org の `/status/コード` エンドポイントは、指定したステータスコードを返してくれるテスト用APIです。

</details>

---

### ミッション6: リダイレクトを追跡しよう

http://github.com にアクセスすると https://github.com にリダイレクトされます。-L オプションでリダイレクトを追跡し、-v で詳細を確認してください。

<details><summary>解答</summary>

```bash
curl -v -L http://github.com 2>&1 | head -30
```

出力例（主要部分）：
```
< HTTP/1.1 301 Moved Permanently
< Location: https://github.com/
...
> GET / HTTP/2
> Host: github.com
...
< HTTP/2 200
```

確認ポイント：
- 最初のレスポンス: `301 Moved Permanently`（恒久的に移動）
- `Location: https://github.com/`（転送先）
- -L オプションにより自動的に転送先にアクセス
- 最終的に `200` が返る

</details>

---

### ミッション7: カスタムヘッダーを送信しよう

httpbin.org に独自のヘッダー `X-My-Header: Hello` を含めたGETリクエストを送り、レスポンスで確認してください。

<details><summary>解答</summary>

```bash
curl -H "X-My-Header: Hello" https://httpbin.org/headers
```

出力例：
```json
{
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/7.81.0",
    "X-My-Header": "Hello"
  }
}
```

`/headers` エンドポイントは受け取ったヘッダーをそのまま表示します。独自ヘッダー `X-My-Header: Hello` が正しく送信されていることが確認できます。

</details>

---

### ミッション8: PUTリクエストでデータを更新しよう

httpbin.org にPUTリクエストでデータを送信してください。

送信するデータ：
```json
{"name": "Updated User", "status": "active"}
```

<details><summary>解答</summary>

```bash
curl -X PUT \
     -H "Content-Type: application/json" \
     -d '{"name": "Updated User", "status": "active"}' \
     https://httpbin.org/put
```

出力例：
```json
{
  "data": "{\"name\": \"Updated User\", \"status\": \"active\"}",
  "json": {
    "name": "Updated User",
    "status": "active"
  }
}
```

ポイント：
- `-X PUT` でPUTメソッドを指定
- PUTは既存データの更新に使う
- httpbin.org はテスト用なので実際のデータ更新は行われません

</details>

---

## ミッション完了チェック

### 達成チェックリスト

- [ ] GETリクエストを送れた
- [ ] -v オプションで詳細を確認できた
- [ ] -I オプションでヘッダーのみ取得できた
- [ ] POSTリクエストでJSONデータを送れた
- [ ] 異なるステータスコードを確認できた
- [ ] リダイレクトの追跡ができた
- [ ] カスタムヘッダーを送信できた
- [ ] PUTリクエストを送れた

---

## まとめ

| ポイント | 内容 |
|----------|------|
| curl URL | 基本のGETリクエスト |
| curl -v | 詳細表示でデバッグ |
| curl -X POST -d | POSTでデータ送信 |
| curl -I | ヘッダーのみ取得 |
| curl -L | リダイレクト追跡 |

### チェックリスト
- [ ] 8つのミッションすべてをクリアした
- [ ] 各curlオプションの意味を理解している
- [ ] HTTPリクエスト/レスポンスの流れを体験的に理解した

---

## 次のステップへ

HTTPリクエスト実践、お疲れさまでした！

次はStep 4のチェックポイントクイズです。HTTPの知識を確認しましょう。

---

*推定読了時間: 90分*
