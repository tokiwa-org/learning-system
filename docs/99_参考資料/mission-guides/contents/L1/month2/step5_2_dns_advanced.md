# DNS障害を解決しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 5
subStep: 2
title: "DNS障害を解決しよう"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "ネットワーク"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「社内ツールが『名前解決できない』ってエラーを出してる」
>
> 「名前解決...DNSの問題ですね。L0でDNSの基本は学びました」
>
> 「よし、じゃあもう少し深い話をしよう。DNS伝播、TTL、キャッシュ。この辺りがわかると、DNS障害を自力で解決できるようになる」

---

## DNS解決の流れ（復習と深掘り）

```
ブラウザ → OSキャッシュ → ローカルDNSサーバー → 再帰的に問い合わせ
         → /etc/hosts                              ↓
                                              ルートDNS
                                              → TLD DNS
                                              → 権威DNS
                                              → IPアドレス取得
```

### 各段階のキャッシュ

| キャッシュ | 場所 | 確認・クリア方法 |
|-----------|------|----------------|
| ブラウザキャッシュ | ブラウザ内 | ブラウザの設定からクリア |
| OSキャッシュ | OS | `systemd-resolve --flush-caches` |
| ローカルDNS | ISP等のDNSサーバー | 管理者に依頼 |

---

## dig コマンドの高度な使い方

### 基本的な使い方

```bash
# ドメインのAレコード（IPアドレス）を問い合わせ
dig example.com

# 短い出力
dig +short example.com
```

### 特定のレコードタイプを指定

```bash
# Aレコード（IPv4アドレス）
dig example.com A

# AAAAレコード（IPv6アドレス）
dig example.com AAAA

# MXレコード（メールサーバー）
dig example.com MX

# NSレコード（ネームサーバー）
dig example.com NS

# CNAMEレコード（エイリアス）
dig www.example.com CNAME

# TXTレコード（SPF等）
dig example.com TXT
```

### 特定のDNSサーバーを指定して問い合わせ

```bash
# Google Public DNS (8.8.8.8) に問い合わせ
dig @8.8.8.8 example.com

# Cloudflare DNS (1.1.1.1) に問い合わせ
dig @1.1.1.1 example.com

# 比較してDNSサーバー固有の問題を切り分ける
```

### 詳細な情報を取得

```bash
# 全ての情報を表示
dig example.com +noall +answer +authority +additional

# トレース（再帰的な問い合わせ過程を表示）
dig example.com +trace
```

---

## TTL（Time To Live）

TTLは、**DNSレコードがキャッシュに保持される時間（秒）**です。

### dig の出力でTTLを確認

```
example.com.    300    IN    A    93.184.216.34
                ^^^
                TTL=300秒（5分間キャッシュされる）
```

### TTLの影響

| TTL | 影響 |
|-----|------|
| 短い（60-300秒） | DNS変更が素早く反映される。DNSサーバーへの問い合わせが増える |
| 長い（3600-86400秒） | DNS変更の反映に時間がかかる。DNSサーバーの負荷が減る |

### DNS伝播（Propagation）

DNSレコードを変更した後、世界中のDNSサーバーのキャッシュが更新されるまでに時間がかかります。

```
DNS変更実施 → 各DNSサーバーのキャッシュが有効期限（TTL）を迎える
           → 新しいレコードを取得
           → 全世界に反映（最大でTTL分の時間がかかる）
```

> **DNS移行のベストプラクティス:** 移行前にTTLを短く（60秒等）に設定しておき、移行後に問題があればすぐに戻せるようにする。安定後にTTLを戻す。

---

## /etc/resolv.conf

LinuxのDNS設定ファイルです。

```bash
cat /etc/resolv.conf
```

```
nameserver 8.8.8.8        # 優先DNSサーバー
nameserver 8.8.4.4        # セカンダリDNSサーバー
search example.com        # ドメインサフィックス
```

| 設定 | 説明 |
|------|------|
| nameserver | 使用するDNSサーバーのIPアドレス |
| search | 短いホスト名に自動追加されるドメイン |

> `search example.com` が設定されていると、`ping myserver` が `ping myserver.example.com` として解決されます。

---

## /etc/hosts

OSレベルのDNS設定ファイルです。DNSサーバーより先に参照されます。

```bash
cat /etc/hosts
```

```
127.0.0.1   localhost
192.168.1.100   db-server
192.168.1.200   web-server
```

> `/etc/hosts` にエントリを追加すると、DNSサーバーを経由せずに名前解決できます。テスト環境やDNS障害時の応急処置に使えます。

---

## DNS障害の診断手順

### Step 1: DNS解決ができるか確認

```bash
dig example.com +short
# 空の結果 or エラー → DNS障害の可能性
```

### Step 2: 別のDNSサーバーで試す

```bash
dig @8.8.8.8 example.com +short
dig @1.1.1.1 example.com +short
# 別のDNSサーバーで解決できる → ローカルDNSの問題
# どのDNSサーバーでも解決できない → レコード自体の問題
```

### Step 3: DNSキャッシュをクリア

```bash
# systemd-resolved の場合
sudo systemd-resolve --flush-caches

# dnsmasq の場合
sudo systemctl restart dnsmasq
```

### Step 4: /etc/resolv.conf を確認

```bash
cat /etc/resolv.conf
# nameserver が正しいか確認
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| dig | DNS問い合わせの詳細確認。@ でDNSサーバーを指定 |
| TTL | キャッシュの有効期間。短いと変更が速く反映される |
| DNS伝播 | レコード変更が全世界に反映されるまでの時間 |
| /etc/resolv.conf | DNSサーバーの設定ファイル |
| /etc/hosts | OSレベルのDNS設定（DNSサーバーより優先） |

### チェックリスト
- [ ] dig の基本的なオプションを使える
- [ ] TTLの概念を説明できる
- [ ] DNS伝播が起きる理由を理解した
- [ ] DNS障害の診断手順を実行できる

---

## 次のステップへ

DNS障害の診断と解決方法を学びました。
次のセクションでは、HTTPSの基盤となるSSL/TLS証明書について学びます。

---

*推定読了時間: 30分*
