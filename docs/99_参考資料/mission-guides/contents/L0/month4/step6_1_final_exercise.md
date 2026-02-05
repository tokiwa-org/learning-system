# 総合演習：Webページ表示の裏側を追跡しよう

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 6
subStep: 1
title: "総合演習：Webページ表示の裏側を追跡しよう"
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

> 「ついに最終演習だね。ブラウザでWebページを開くとき、裏側では何が起きているか追跡してみよう」
>
> 「DNS、IP、HTTP...これまで学んだことを全部使うんですね」
>
> 「そう。1つのWebページを表示するまでの流れを、コマンドで追いかけるんだ」
>
> 「やってみます！」

---

## ミッション概要

ブラウザでWebページを開くときに裏側で何が起きているか、5つのパートに分けて追跡します。

### 対象サイト

今回は `www.example.com` を使います。

### 達成条件

- [ ] Part 1〜5 すべてを完了した
- [ ] 各パートで正しい出力が得られた
- [ ] 全体フローをドキュメントにまとめた

---

## Part 1: DNS調査 - ドメイン名からIPアドレスへ

ブラウザがWebサイトにアクセスする最初のステップは、ドメイン名をIPアドレスに変換することです。

### ミッション1-1: nslookupで名前解決

`www.example.com` のIPアドレスを調べてください。

```bash
nslookup www.example.com
```

以下の情報を記録しましょう：
- [ ] 解決されたIPアドレス
- [ ] 使用されたDNSサーバー

<details><summary>解答例</summary>

```bash
nslookup www.example.com
```

出力例：
```
Server:         192.168.1.1
Address:        192.168.1.1#53

Non-authoritative answer:
Name:   www.example.com
Address: 93.184.216.34
```

記録：
- IPアドレス: 93.184.216.34
- DNSサーバー: 192.168.1.1

</details>

### ミッション1-2: dig で詳細情報を確認

dig コマンドでより詳細な情報を確認してください。

```bash
dig www.example.com
```

以下の情報を記録しましょう：
- [ ] レコードタイプ（A / AAAA / CNAME など）
- [ ] TTL（キャッシュ有効時間）

<details><summary>解答例</summary>

```bash
dig www.example.com
```

出力例（ANSWER SECTION）：
```
;; ANSWER SECTION:
www.example.com.    86400   IN  A   93.184.216.34
```

記録：
- レコードタイプ: A（IPv4アドレス）
- TTL: 86400秒（24時間）

</details>

---

## Part 2: IP確認 - ネットワーク接続テスト

IPアドレスが分かったら、そのサーバーに接続できるか確認します。

### ミッション2-1: pingで接続確認

先ほど調べたIPアドレス（または www.example.com）に ping を送ってください。

```bash
ping -c 4 www.example.com
```

以下の情報を記録しましょう：
- [ ] 応答があったか（packet loss）
- [ ] RTT（往復時間）の平均値
- [ ] TTL値

<details><summary>解答例</summary>

```bash
ping -c 4 www.example.com
```

出力例：
```
PING www.example.com (93.184.216.34) 56(84) bytes of data.
64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=85.4 ms
64 bytes from 93.184.216.34: icmp_seq=2 ttl=56 time=84.9 ms
64 bytes from 93.184.216.34: icmp_seq=3 ttl=56 time=85.1 ms
64 bytes from 93.184.216.34: icmp_seq=4 ttl=56 time=85.2 ms

--- www.example.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 84.900/85.150/85.400/0.180 ms
```

記録：
- packet loss: 0%（すべて到達）
- RTT平均: 85.15 ms
- TTL: 56

</details>

### ミッション2-2: 自分のIPアドレスを確認

ついでに自分のローカルIPアドレスも確認しておきましょう。

```bash
# Linux / Mac
ip addr show | grep inet

# または
hostname -I
```

<details><summary>解答例</summary>

```bash
hostname -I
```

出力例：
```
192.168.1.100
```

これが自分のローカルIPアドレスです。

</details>

---

## Part 3: HTTP通信 - リクエストとレスポンス

サーバーに接続できることが確認できたら、HTTPでWebページを取得します。

### ミッション3-1: curl -v で詳細なHTTP通信を確認

`-v`（verbose）オプションを使って、HTTP通信の詳細を確認してください。

```bash
curl -v https://www.example.com 2>&1 | head -30
```

以下の情報を記録しましょう：
- [ ] 接続先のIPアドレスとポート
- [ ] HTTPバージョン
- [ ] ステータスコード
- [ ] Content-Type

<details><summary>解答例</summary>

```bash
curl -v https://www.example.com 2>&1 | head -30
```

出力例（重要部分）：
```
*   Trying 93.184.216.34:443...
* Connected to www.example.com (93.184.216.34) port 443
...
> GET / HTTP/2
> Host: www.example.com
...
< HTTP/2 200
< content-type: text/html; charset=UTF-8
< content-length: 1256
```

記録：
- 接続先: 93.184.216.34:443（HTTPS）
- HTTPバージョン: HTTP/2
- ステータスコード: 200（成功）
- Content-Type: text/html; charset=UTF-8

</details>

### ミッション3-2: HTTPヘッダーの確認

`-I`（ヘッダーのみ取得）オプションでレスポンスヘッダーを確認してください。

```bash
curl -I https://www.example.com
```

<details><summary>解答例</summary>

```bash
curl -I https://www.example.com
```

出力例：
```
HTTP/2 200
accept-ranges: bytes
age: 526025
cache-control: max-age=604800
content-type: text/html; charset=UTF-8
date: Mon, 06 Feb 2026 12:00:00 GMT
etag: "3147526947"
expires: Mon, 13 Feb 2026 12:00:00 GMT
last-modified: Thu, 17 Oct 2019 07:18:26 GMT
server: ECS (dcb/7F83)
content-length: 1256
```

ヘッダーから分かること：
- サーバー: ECS（Akamai CDN）
- キャッシュ: max-age=604800（7日間）
- 最終更新: 2019年10月

</details>

---

## Part 4: 経路追跡 - パケットの旅路

パケットがどのようなルートを通ってサーバーに到達するかを追跡します。

### ミッション4-1: traceroute で経路を追跡

www.example.com への経路を traceroute で追跡してください。

```bash
traceroute -m 20 www.example.com
```

以下の情報を記録しましょう：
- [ ] 合計ホップ数
- [ ] 最も遅いホップ（RTTが大きい）
- [ ] 応答がないホップ（* * *）があるか

<details><summary>解答例</summary>

```bash
traceroute -m 20 www.example.com
```

出力例：
```
traceroute to www.example.com (93.184.216.34), 20 hops max, 60 byte packets
 1  gateway (192.168.1.1)              1.234 ms  1.112 ms  1.089 ms
 2  10.0.0.1                           5.432 ms  5.321 ms  5.234 ms
 3  isp-gw.example.net                 8.765 ms  8.654 ms  8.543 ms
 4  * * *
 5  ae-1.r20.tokyjp05.jp.bb.gin.ntt    25.432 ms 25.321 ms 25.234 ms
 6  ...
12  93.184.216.34                      85.123 ms 85.234 ms 85.345 ms
```

記録：
- 合計ホップ数: 12（環境により異なる）
- 最も遅いホップ: 12番目（85ms）- 目的地への最終経路
- 応答なしホップ: 4番目（セキュリティでブロック）

</details>

---

## Part 5: 全体フローのドキュメント化

これまでの調査結果をまとめて、Webページ表示の流れをドキュメント化しましょう。

### ミッション5-1: 調査結果シートの作成

以下のテンプレートを埋めてください：

```markdown
# www.example.com 接続調査レポート

## 1. DNS情報
- ドメイン: www.example.com
- IPアドレス: __________
- レコードタイプ: __________
- TTL: __________
- 使用DNSサーバー: __________

## 2. 接続性
- ping応答: あり / なし
- packet loss: __________
- RTT平均: __________
- TTL: __________

## 3. HTTP通信
- プロトコル: HTTP / HTTPS
- ポート: __________
- HTTPバージョン: __________
- ステータスコード: __________
- Content-Type: __________

## 4. 経路情報
- 合計ホップ数: __________
- 通過したネットワーク:
  1. __________（ホップ1-2: ローカル）
  2. __________（ホップ3-5: ISP）
  3. __________（ホップ6以降: インターネット）

## 5. 結論
- 接続状態: 正常 / 異常
- 特記事項: __________
```

<details><summary>記入例</summary>

```markdown
# www.example.com 接続調査レポート

## 1. DNS情報
- ドメイン: www.example.com
- IPアドレス: 93.184.216.34
- レコードタイプ: A
- TTL: 86400秒（24時間）
- 使用DNSサーバー: 192.168.1.1

## 2. 接続性
- ping応答: あり
- packet loss: 0%
- RTT平均: 85.15 ms
- TTL: 56

## 3. HTTP通信
- プロトコル: HTTPS
- ポート: 443
- HTTPバージョン: HTTP/2
- ステータスコード: 200
- Content-Type: text/html; charset=UTF-8

## 4. 経路情報
- 合計ホップ数: 12
- 通過したネットワーク:
  1. gateway (192.168.1.1)（ホップ1: ローカルルーター）
  2. isp-gw.example.net（ホップ2-4: ISP）
  3. NTT backbone（ホップ5-10: インターネットバックボーン）
  4. 93.184.216.34（ホップ12: 目的地）

## 5. 結論
- 接続状態: 正常
- 特記事項:
  - RTTが約85msで海外サーバーへのアクセスとしては良好
  - HTTP/2 + HTTPS で高速・安全な通信
  - CDN（ECS/Akamai）を使用している
```

</details>

---

## Webページ表示の全体フロー

今回の調査で確認した、Webページ表示の流れをまとめます。

```
┌─────────────────────────────────────────────────────────────────┐
│                    Webページ表示の流れ                           │
└─────────────────────────────────────────────────────────────────┘

[1] ブラウザがURLを解析
    https://www.example.com
          ↓
[2] DNS名前解決（nslookup）
    www.example.com → 93.184.216.34
          ↓
[3] TCPコネクション確立
    自分のPC → ルーター → ISP → インターネット → サーバー
    （traceroute で確認した経路）
          ↓
[4] TLS/SSLハンドシェイク
    HTTPS のため暗号化通信を確立
          ↓
[5] HTTPリクエスト送信（curl -v）
    GET / HTTP/2
    Host: www.example.com
          ↓
[6] HTTPレスポンス受信
    HTTP/2 200
    Content-Type: text/html
          ↓
[7] HTMLをパースして画面表示
    （さらに画像やCSSがあれば追加リクエスト）
```

---

## ミッション完了チェック

### 達成チェックリスト

- [ ] Part 1: DNS調査を完了した
- [ ] Part 2: ping で接続確認を完了した
- [ ] Part 3: curl で HTTP通信を確認した
- [ ] Part 4: traceroute で経路追跡を完了した
- [ ] Part 5: 調査結果をドキュメント化した
- [ ] Webページ表示の全体フローを理解した

---

## まとめ

| ステップ | コマンド | 確認内容 |
|---------|---------|---------|
| DNS調査 | nslookup, dig | ドメイン→IPアドレス変換 |
| 接続確認 | ping | ネットワーク到達性、RTT |
| HTTP通信 | curl -v, curl -I | リクエスト/レスポンス |
| 経路追跡 | traceroute | パケットの経路 |

### 学んだこと

- Webページ表示には多くのステップがある
- DNS → IP → TCP → TLS → HTTP の順で処理される
- 各ステップをコマンドで確認できる
- 問題が発生した場合、どの層で起きているか特定できる

---

## 次のステップへ

総合演習、お疲れさまでした！

次は最終関門「卒業クイズ」です。今月学んだネットワークの知識を総動員して挑みましょう。80%以上の正解で「ネットワーク基礎 修了証明書」を獲得できます！

---

*推定所要時間: 90分*
