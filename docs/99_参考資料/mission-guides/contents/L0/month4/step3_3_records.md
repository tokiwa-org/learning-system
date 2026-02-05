# DNSレコードの種類

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 3
subStep: 3
title: "DNSレコードの種類"
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

> 「先輩、DNSにはIPアドレス以外の情報も登録されているんですか？」
>
> 「そうだよ。DNSには色んな種類のレコードがあるんだ」
>
> 「レコード？」
>
> 「データベースの行みたいなもので、Aレコード、CNAMEレコード、MXレコードとか種類があるんだ」

---

## DNSレコードとは

DNSサーバーに登録されている情報の1件1件を **レコード** と呼びます。

レコードにはさまざまな種類（タイプ）があり、それぞれ異なる情報を持っています。

---

## 主要なレコードタイプ

### Aレコード（Address Record）

**ドメイン名をIPv4アドレスに変換** する、最も基本的なレコード。

```
example.com.    A    93.184.216.34
www.example.com. A    93.184.216.34
```

- 「このドメインのIPアドレスはこれです」という情報
- DNSの名前解決で最も頻繁に使われる

### AAAAレコード（Quad-A Record）

**ドメイン名をIPv6アドレスに変換** するレコード。

```
example.com.    AAAA    2606:2800:220:1:248:1893:25c8:1946
```

- Aレコードの IPv6版
- 「AAAA」は「A」が4つ（IPv6のアドレスがIPv4の4倍のビット数だから）

### CNAMEレコード（Canonical Name Record）

**ドメイン名を別のドメイン名に転送** するレコード。

```
blog.example.com.    CNAME    example.github.io.
```

- 「このドメインの本当の名前はこちらです」という転送設定
- 転送先のAレコードを参照してIPアドレスが決まる

```
blog.example.com → (CNAMEで) example.github.io → (Aレコードで) 185.199.108.153
```

### MXレコード（Mail Exchange Record）

**メールサーバーを指定** するレコード。

```
example.com.    MX    10    mail.example.com.
example.com.    MX    20    mail2.example.com.
```

- メールの送信先サーバーを指定する
- 数字は **優先度**（小さいほど優先）
- 優先度10のサーバーが使えないとき、優先度20のサーバーが使われる

### TXTレコード（Text Record）

**テキスト情報を保存** するレコード。

```
example.com.    TXT    "v=spf1 include:_spf.google.com ~all"
```

用途：
- **SPF**: メールの送信元認証（なりすまし防止）
- **ドメイン所有確認**: Google や AWS がドメインの所有者を確認するとき
- その他の検証情報

### NSレコード（Name Server Record）

**そのドメインの権威DNSサーバーを指定** するレコード。

```
example.com.    NS    ns1.example.com.
example.com.    NS    ns2.example.com.
```

- 「このドメインのDNS情報はこのサーバーが管理しています」という情報

---

## レコードタイプの早見表

| タイプ | 名前 | 内容 | 例 |
|--------|------|------|-----|
| **A** | Address | ドメイン → IPv4 | example.com → 93.184.216.34 |
| **AAAA** | Quad-A | ドメイン → IPv6 | example.com → 2606:2800:... |
| **CNAME** | Canonical Name | ドメイン → 別のドメイン | blog.example.com → example.github.io |
| **MX** | Mail Exchange | メールサーバー指定 | example.com → mail.example.com |
| **TXT** | Text | テキスト情報 | SPF、ドメイン認証 |
| **NS** | Name Server | 権威DNSサーバー | example.com → ns1.example.com |

---

## レコードの実例

### Googleの場合

```
google.com      A       142.250.196.99
google.com      AAAA    2404:6800:4004:826::200e
google.com      MX      10 smtp.google.com
google.com      NS      ns1.google.com
google.com      TXT     "v=spf1 include:_spf.google.com ~all"
```

1つのドメインに複数のレコードタイプが設定されています。

### Webサイトとメールで別サーバー

```
example.com     A       93.184.216.34        ← Webサーバー
example.com     MX      10 mail.example.com  ← メールサーバー
```

同じドメインでも、WebとメールでIPアドレスが異なることがあります。Aレコードは Webサーバー、MXレコードはメールサーバーを指します。

---

## TTL（Time To Live）

各レコードには **TTL** が設定されています。

```
example.com.    300    A    93.184.216.34
                └── TTL: 300秒 = 5分間キャッシュ
```

- TTLが短い（60秒など）：変更がすぐ反映される。DNSサーバーへの問い合わせが増える
- TTLが長い（86400秒 = 24時間など）：変更の反映が遅い。DNSサーバーの負荷が少ない

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Aレコード | ドメイン → IPv4アドレス（最も基本） |
| AAAAレコード | ドメイン → IPv6アドレス |
| CNAMEレコード | ドメイン → 別のドメイン（転送） |
| MXレコード | メールサーバーの指定 |
| TXTレコード | テキスト情報（SPF、ドメイン認証） |
| NSレコード | 権威DNSサーバーの指定 |

### チェックリスト
- [ ] A レコードと AAAA レコードの違いを説明できる
- [ ] CNAME レコードの役割を理解した
- [ ] MX レコードがメール用だと知っている
- [ ] TTL の意味を理解した

---

## 次のステップへ

DNSレコードの種類が分かりましたね。

次のセクションでは、実際に **nslookup** コマンドを使って、DNSの名前解決を体験します。

---

*推定読了時間: 30分*
