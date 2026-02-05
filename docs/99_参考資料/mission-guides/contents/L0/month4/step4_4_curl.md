# curlでHTTPリクエストを送ろう

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 4
subStep: 4
title: "curlでHTTPリクエストを送ろう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "ネットワーク"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「先輩、HTTPリクエストを実際に送る方法はありますか？ブラウザ以外で」
>
> 「curl というコマンドがあるよ。ターミナルからHTTPリクエストを送れるんだ」
>
> 「ターミナルからWebにアクセスできるんですか！」
>
> 「そう。エンジニアがAPIのテストやデバッグによく使う必須ツールだよ」

---

## curl とは

### 一言で言うと

**ターミナルからHTTPリクエストを送受信するコマンドラインツール**

curl = Client URL

- ほぼすべてのLinux/Macに標準搭載
- Windowsでも利用可能
- APIのテストやデバッグに必須

---

## 基本的な使い方

### GETリクエスト（最もシンプル）

```bash
curl https://httpbin.org/get
```

URLを指定するだけで、GETリクエストが送られます。

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

httpbin.org は、HTTPリクエストのテスト用サービスです。送ったリクエストの内容をそのまま返してくれます。

---

## よく使うオプション

### -v（詳細表示 / verbose）

リクエストとレスポンスの詳細を表示します。

```bash
curl -v https://httpbin.org/get
```

出力例（一部）：
```
> GET /get HTTP/2
> Host: httpbin.org
> User-Agent: curl/7.81.0
> Accept: */*
>
< HTTP/2 200
< content-type: application/json
< content-length: 256
<
{...}
```

- `>` で始まる行 = 送信したリクエスト
- `<` で始まる行 = 受信したレスポンス
- ステータスコード、ヘッダーが確認できる

### -o（ファイルに保存）

レスポンスをファイルに保存します。

```bash
curl -o output.html https://www.example.com
```

### -I（ヘッダーのみ取得）

レスポンスのヘッダーだけを取得します（ボディなし）。

```bash
curl -I https://www.example.com
```

出力例：
```
HTTP/2 200
content-type: text/html; charset=UTF-8
content-length: 1256
```

---

## HTTPメソッドの指定

### -X オプション

```bash
# GETリクエスト（デフォルト）
curl https://httpbin.org/get

# POSTリクエスト
curl -X POST https://httpbin.org/post

# PUTリクエスト
curl -X PUT https://httpbin.org/put

# DELETEリクエスト
curl -X DELETE https://httpbin.org/delete
```

---

## ヘッダーの指定

### -H オプション

```bash
curl -H "Content-Type: application/json" https://httpbin.org/get
```

複数のヘッダーを指定する場合：

```bash
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer mytoken123" \
     https://httpbin.org/get
```

---

## データの送信

### -d オプション（POSTデータ）

```bash
# フォームデータを送信
curl -X POST -d "name=tanaka&age=25" https://httpbin.org/post

# JSONデータを送信
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"name": "tanaka", "age": 25}' \
     https://httpbin.org/post
```

出力例：
```json
{
  "data": "{\"name\": \"tanaka\", \"age\": 25}",
  "headers": {
    "Content-Type": "application/json"
  },
  "json": {
    "name": "tanaka",
    "age": 25
  }
}
```

---

## よく使うパターン集

### Webページの内容を取得

```bash
curl https://www.example.com
```

### APIからJSONデータを取得

```bash
curl https://httpbin.org/json
```

### レスポンスのステータスコードだけを確認

```bash
curl -o /dev/null -s -w "%{http_code}" https://www.example.com
```

出力：`200`

### リダイレクトを追跡

```bash
curl -L http://github.com
```

`-L` オプションで、3xx リダイレクトを自動的に追跡します。

---

## curl オプション早見表

| オプション | 説明 | 例 |
|-----------|------|-----|
| `-v` | 詳細表示 | `curl -v URL` |
| `-I` | ヘッダーのみ | `curl -I URL` |
| `-o` | ファイルに保存 | `curl -o file.html URL` |
| `-X` | メソッド指定 | `curl -X POST URL` |
| `-H` | ヘッダー追加 | `curl -H "Key: Value" URL` |
| `-d` | データ送信 | `curl -d "data" URL` |
| `-L` | リダイレクト追跡 | `curl -L URL` |
| `-s` | 進捗非表示 | `curl -s URL` |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| curl | ターミナルからHTTPリクエストを送るツール |
| 基本形 | `curl URL` でGETリクエスト |
| -v | 詳細なリクエスト/レスポンスを表示 |
| -X | HTTPメソッドを指定（POST, PUT, DELETE） |
| -H | ヘッダーを追加 |
| -d | データを送信 |

### チェックリスト
- [ ] curl の基本的な使い方（curl URL）が分かる
- [ ] -v オプションで詳細を確認できる
- [ ] -X でHTTPメソッドを指定できる
- [ ] -d でデータを送信する方法を知っている

---

## 次のステップへ

curl の基本が分かりましたね。

次は演習です。curl を使って実際にさまざまなHTTPリクエストを送ってみましょう。

---

*推定読了時間: 30分*
