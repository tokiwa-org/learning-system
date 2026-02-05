# nslookupで名前解決を体験しよう

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 3
subStep: 4
title: "nslookupで名前解決を体験しよう"
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

> 「先輩、DNSの仕組みは理解できました。でも実際に名前解決が行われているのを確認する方法はありますか？」
>
> 「もちろん！nslookup や dig というコマンドがあるよ」
>
> 「使ってみたいです！」
>
> 「じゃあ実際にコマンドを打って、DNSの世界を覗いてみよう」

---

## nslookup コマンド

### 基本的な使い方

```bash
nslookup ドメイン名
```

ドメイン名からIPアドレスを調べるコマンドです。

### 実行例

```bash
nslookup www.google.com
```

出力例：
```
Server:     8.8.8.8
Address:    8.8.8.8#53

Non-authoritative answer:
Name:   www.google.com
Address: 142.250.196.99
```

- **Server**: 問い合わせに使ったDNSサーバー
- **Address**: DNSサーバーのIPアドレス（#53 はDNSのポート番号）
- **Non-authoritative answer**: キャッシュからの回答（権威サーバーに直接聞いたわけではない）
- **Name**: 調べたドメイン名
- **Address**: 解決されたIPアドレス

---

## nslookup の応用

### 特定のDNSサーバーを指定

```bash
nslookup www.google.com 8.8.8.8
```

Google のDNSサーバー（8.8.8.8）を使って名前解決します。

### レコードタイプを指定

```bash
nslookup -type=MX google.com
```

出力例：
```
google.com      mail exchanger = 10 smtp.google.com.
```

MXレコード（メールサーバー）を調べられます。

```bash
nslookup -type=TXT google.com
```

TXTレコードを調べられます。

---

## dig コマンド

`dig` は `nslookup` よりも詳細な情報を表示するコマンドです。

### 基本的な使い方

```bash
dig ドメイン名
```

### 実行例

```bash
dig www.google.com
```

出力例（一部）：
```
;; QUESTION SECTION:
;www.google.com.            IN  A

;; ANSWER SECTION:
www.google.com.     300     IN  A   142.250.196.99

;; Query time: 3 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
```

- **QUESTION SECTION**: 問い合わせた内容
- **ANSWER SECTION**: 回答
  - `300` = TTL（300秒 = 5分）
  - `IN` = Internet クラス
  - `A` = Aレコード
  - `142.250.196.99` = IPアドレス
- **Query time**: 問い合わせにかかった時間
- **SERVER**: 使用したDNSサーバー

### dig の便利なオプション

```bash
# 簡潔な出力
dig +short www.google.com

# MXレコードを調べる
dig MX google.com

# NSレコードを調べる
dig NS google.com

# 名前解決の経路を追跡
dig +trace www.google.com
```

### dig +trace の出力例（簡略版）

```bash
dig +trace www.google.com
```

```
.                       518400  IN  NS  a.root-servers.net.    ← ルートサーバー
com.                    172800  IN  NS  a.gtld-servers.net.    ← .com TLDサーバー
google.com.             172800  IN  NS  ns1.google.com.        ← Google権威サーバー
www.google.com.         300     IN  A   142.250.196.99         ← 最終回答
```

ルート → TLD → 権威サーバーの順に辿っていく様子が見えます。

---

## nslookup vs dig

| 項目 | nslookup | dig |
|------|----------|-----|
| 情報量 | 基本的な情報 | 詳細な情報 |
| 使いやすさ | シンプルで初心者向け | 情報が多く上級者向け |
| 利用環境 | ほぼすべてのOSに標準搭載 | Linux/Mac に標準搭載 |
| おすすめ | 手軽に調べたいとき | 詳しく調べたいとき |

まずは `nslookup` を覚えて、慣れてきたら `dig` を使ってみましょう。

---

## よく使うパターン

### Webサイトの IP アドレスを調べる

```bash
nslookup www.example.com
```

### メールサーバーを調べる

```bash
nslookup -type=MX example.com
```

### ドメインの権威DNSサーバーを調べる

```bash
nslookup -type=NS example.com
```

### 逆引き（IPアドレスからドメイン名）

```bash
nslookup 8.8.8.8
```

出力例：
```
8.8.8.8.in-addr.arpa    name = dns.google.
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| nslookup | DNSの名前解決を手軽に確認できるコマンド |
| dig | より詳細なDNS情報を確認できるコマンド |
| -type オプション | A、MX、TXT、NSなどレコードタイプを指定 |
| dig +trace | 名前解決の経路を追跡できる |

### チェックリスト
- [ ] nslookup でドメイン名からIPアドレスを調べられる
- [ ] nslookup -type でレコードタイプを指定できる
- [ ] dig コマンドの基本的な使い方を知っている
- [ ] 出力結果の読み方が分かる

---

## 次のステップへ

nslookup と dig の使い方が分かりましたね。

次は演習です。実際にDNS調査ミッションに挑戦して、学んだことを実践しましょう。

---

*推定読了時間: 30分*
