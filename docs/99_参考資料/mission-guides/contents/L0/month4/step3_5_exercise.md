# 演習：DNS調査ミッション

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 3
subStep: 5
title: "演習：DNS調査ミッション"
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

> 「DNS の仕組みを学んだね。じゃあ、実際に調査員になったつもりで DNS を調べてみよう」
>
> 「調査員ですか！」
>
> 「そう。nslookup や dig を使って、ドメインの裏側を探るんだ」
>
> 「面白そうですね！やってみます！」

---

## ミッション概要

DNS に関するコマンドを使って、ドメインの調査を行います。

### 準備

ターミナルを開いてください。

### 達成条件

- [ ] 8つのミッションすべてをクリアした
- [ ] 各ミッションで正しい出力が得られた
- [ ] コマンドを自分で入力して実行できた

---

### ミッション1: google.com の IP アドレスを調べよう

nslookup を使って、google.com の IP アドレスを調べてください。

<details><summary>解答</summary>

```bash
nslookup google.com
```

出力例：
```
Server:     8.8.8.8
Address:    8.8.8.8#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.196.99
```

google.com の IPv4 アドレスが表示されます。環境によって IP アドレスは異なることがあります（Google は世界中にサーバーがあるため）。

</details>

---

### ミッション2: github.com の IP アドレスを調べよう

nslookup を使って、github.com の IP アドレスを調べてください。

<details><summary>解答</summary>

```bash
nslookup github.com
```

出力例：
```
Non-authoritative answer:
Name:   github.com
Address: 20.27.177.113
```

GitHub の IP アドレスが表示されます。

</details>

---

### ミッション3: MX レコードを調べよう

google.com のメールサーバー（MX レコード）を調べてください。

<details><summary>解答</summary>

```bash
nslookup -type=MX google.com
```

出力例：
```
google.com      mail exchanger = 10 smtp.google.com.
```

Google のメールサーバーが `smtp.google.com` であることが分かります。数字の `10` は優先度です。

</details>

---

### ミッション4: NS レコードを調べよう

google.com の権威 DNS サーバー（NS レコード）を調べてください。

<details><summary>解答</summary>

```bash
nslookup -type=NS google.com
```

出力例：
```
google.com      nameserver = ns1.google.com.
google.com      nameserver = ns2.google.com.
google.com      nameserver = ns3.google.com.
google.com      nameserver = ns4.google.com.
```

Google のドメインは `ns1〜ns4.google.com` という4つの権威DNSサーバーで管理されています。複数あるのは冗長性（障害対策）のためです。

</details>

---

### ミッション5: dig で詳細情報を確認しよう

dig コマンドを使って、example.com の A レコードを詳しく調べてください。TTL（キャッシュ時間）を確認しましょう。

<details><summary>解答</summary>

```bash
dig example.com
```

出力例：
```
;; ANSWER SECTION:
example.com.        86400   IN  A   93.184.216.34
```

- `86400` = TTL（86400秒 = 24時間）
- `A` = A レコード
- `93.184.216.34` = IP アドレス

example.com の DNS キャッシュは24時間有効であることが分かります。

</details>

---

### ミッション6: dig +short で簡潔に確認しよう

dig +short を使って、複数のドメインの IP アドレスを素早く調べてください。

調べるドメイン：
1. amazon.com
2. twitter.com
3. microsoft.com

<details><summary>解答</summary>

```bash
dig +short amazon.com
dig +short twitter.com
dig +short microsoft.com
```

出力例：
```
$ dig +short amazon.com
52.94.236.248
54.239.28.85

$ dig +short twitter.com
104.244.42.129
104.244.42.193

$ dig +short microsoft.com
20.70.246.20
20.236.44.162
```

`+short` オプションで IP アドレスだけが表示されます。複数の IP アドレスが返ってくることがありますが、これは負荷分散のためです。

</details>

---

### ミッション7: 逆引きに挑戦しよう

IP アドレス `8.8.8.8` からドメイン名を調べてください（逆引き）。

<details><summary>解答</summary>

```bash
nslookup 8.8.8.8
```

出力例：
```
8.8.8.8.in-addr.arpa    name = dns.google.
```

IP アドレス `8.8.8.8` は `dns.google` というドメイン名であることが分かります。これは Google のパブリック DNS サーバーです。

</details>

---

### ミッション8: /etc/hosts ファイルを確認しよう

自分の PC の `/etc/hosts` ファイルの内容を確認してください。

```bash
cat /etc/hosts
```

localhost がどの IP アドレスに設定されているか確認しましょう。

<details><summary>解答</summary>

```bash
cat /etc/hosts
```

出力例：
```
127.0.0.1   localhost
::1         localhost
```

- `127.0.0.1 localhost` → IPv4 で localhost は 127.0.0.1
- `::1 localhost` → IPv6 で localhost は ::1

このファイルに記載されたエントリは DNS サーバーよりも優先されます。開発環境で独自の名前を設定したい場合にこのファイルを編集します。

</details>

---

## ミッション完了チェック

### 達成チェックリスト

- [ ] nslookup で A レコードを調べられた
- [ ] nslookup -type で MX / NS レコードを調べられた
- [ ] dig コマンドで詳細情報（TTL など）を確認できた
- [ ] dig +short で簡潔に IP アドレスを取得できた
- [ ] 逆引きができた
- [ ] /etc/hosts の内容を確認できた

---

## まとめ

| ポイント | 内容 |
|----------|------|
| nslookup | 手軽にDNSを調べるコマンド |
| nslookup -type | レコードタイプを指定（MX, NS, TXT） |
| dig | 詳細なDNS情報を確認（TTLなど） |
| dig +short | IPアドレスだけを素早く取得 |
| 逆引き | IPアドレスからドメイン名を調べる |

### チェックリスト
- [ ] 8つのミッションすべてをクリアした
- [ ] 各コマンドの意味を理解している
- [ ] DNS調査の流れが身についた

---

## 次のステップへ

DNS調査ミッション、お疲れさまでした！

次はStep 3のチェックポイントクイズです。DNSの知識を確認しましょう。

---

*推定読了時間: 90分*
