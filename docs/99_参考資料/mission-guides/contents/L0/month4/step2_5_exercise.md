# 演習：IPアドレスを調べよう

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 2
subStep: 5
title: "演習：IPアドレスを調べよう"
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

> 「さて、ここまでIPアドレスの仕組みを学んできたね」
>
> 「はい！」
>
> 「じゃあ実際にコマンドを使って、IPアドレスの世界を探検してみよう」
>
> 「やってみます！」

---

## ミッション概要

実際にコマンドを使って、IPアドレスに関する調査を行います。

### 準備

ターミナルを開いてください。

### 達成条件

- [ ] 8つのミッションすべてをクリアした
- [ ] 各ミッションで正しい出力が得られた
- [ ] コマンドを自分で入力して実行できた

---

### ミッション1: 自分のIPアドレスを確認しよう

自分のPCのプライベートIPアドレスを確認してください。

```bash
# Linux の場合
ip addr show

# Mac の場合
ifconfig
```

出力の中から `inet` で始まる行を探し、IPアドレスを見つけてください。

<details><summary>解答</summary>

```bash
ip addr show
```

出力例：
```
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
```

`inet 192.168.1.10/24` がIPv4アドレスです。`/24` はサブネットマスク（255.255.255.0）を意味します。

</details>

---

### ミッション2: ループバックアドレスに ping しよう

自分自身（localhost）に ping を送って、ネットワークスタックが正常に動いているか確認してください。

```bash
ping -c 4 127.0.0.1
```

（`-c 4` は4回だけ送信する指定です）

<details><summary>解答</summary>

```bash
ping -c 4 127.0.0.1
```

出力例：
```
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.030 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.040 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.035 ms
64 bytes from 127.0.0.1: icmp_seq=4 ttl=64 time=0.038 ms

--- 127.0.0.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3060ms
```

`0% packet loss` であればネットワークスタックは正常です。time の値は自分自身なので非常に小さいです。

</details>

---

### ミッション3: localhost に ping しよう

`127.0.0.1` の代わりに `localhost` を使って同じことをしてみましょう。

<details><summary>解答</summary>

```bash
ping -c 4 localhost
```

出力例：
```
PING localhost (127.0.0.1) 56(84) bytes of data.
64 bytes from localhost (127.0.0.1): icmp_seq=1 ttl=64 time=0.032 ms
...
```

`localhost` は `127.0.0.1` に解決されます。同じ結果が得られれば成功です。

</details>

---

### ミッション4: Google の DNS サーバーに ping しよう

インターネットへの接続を確認するため、GoogleのDNSサーバー（8.8.8.8）にpingを送ってください。

<details><summary>解答</summary>

```bash
ping -c 4 8.8.8.8
```

出力例：
```
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=3.45 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=3.52 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=3.48 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=117 time=3.50 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3005ms
```

応答が返ってくればインターネットに接続できています。`time` の値は localhostより大きくなります（インターネット経由のため）。

</details>

---

### ミッション5: ドメイン名で ping しよう

IPアドレスではなく、ドメイン名を使ってpingを送ってみましょう。

```bash
ping -c 4 www.google.com
```

<details><summary>解答</summary>

```bash
ping -c 4 www.google.com
```

出力例：
```
PING www.google.com (142.250.196.99) 56(84) bytes of data.
64 bytes from nrt12s51-in-f4.1e100.net (142.250.196.99): icmp_seq=1 ttl=117 time=3.20 ms
...
```

注目ポイント：
- `(142.250.196.99)` → ドメイン名がIPアドレスに解決されている
- これが **DNS** の名前解決の結果です（Step 3で詳しく学びます）

</details>

---

### ミッション6: 自分のIPアドレスがプライベートIPか確認しよう

ミッション1で確認した自分のIPアドレスが、プライベートIPの範囲に含まれるか判断してください。

プライベートIPの範囲：
- `10.0.0.0` 〜 `10.255.255.255`
- `172.16.0.0` 〜 `172.31.255.255`
- `192.168.0.0` 〜 `192.168.255.255`

<details><summary>解答</summary>

ミッション1で確認したIPアドレスが上記のいずれかの範囲に含まれていれば、プライベートIPアドレスです。

例：
- `192.168.1.10` → `192.168.x.x` の範囲 → **プライベートIP**
- `10.0.2.15` → `10.x.x.x` の範囲 → **プライベートIP**
- `172.20.0.5` → `172.16〜31.x.x` の範囲 → **プライベートIP**

家庭やオフィスのLANに接続している場合、ほぼ確実にプライベートIPアドレスが割り当てられています。

</details>

---

### ミッション7: サブネットマスクを確認しよう

自分のネットワークのサブネットマスクを確認してください。

```bash
# Linux の場合
ip addr show | grep inet

# Mac の場合
ifconfig | grep netmask
```

<details><summary>解答</summary>

Linux の場合：
```bash
ip addr show | grep inet
```

出力例：
```
    inet 127.0.0.1/8 scope host lo
    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
```

- `192.168.1.10/24` の `/24` がサブネットマスク
- `/24` = `255.255.255.0` = 254台の機器が接続可能

Mac の場合：
```bash
ifconfig | grep netmask
```

出力例：
```
    inet 192.168.1.10 netmask 0xffffff00 broadcast 192.168.1.255
```

- `0xffffff00` = `255.255.255.0` = `/24`

</details>

---

### ミッション8: IPv6アドレスを確認しよう

自分のPCに割り当てられているIPv6アドレスを確認してください。

```bash
# Linux の場合
ip -6 addr show

# Mac の場合
ifconfig | grep inet6
```

<details><summary>解答</summary>

```bash
ip -6 addr show
```

出力例：
```
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet6 fe80::a00:27ff:fe4e:1234/64 scope link
```

- `::1` → ループバックアドレス（IPv6版の127.0.0.1）
- `fe80::` で始まるアドレス → リンクローカルアドレス（LAN内のみ有効）

IPv6アドレスが表示されていれば、お使いの環境はIPv6に対応しています。

</details>

---

## ミッション完了チェック

### 達成チェックリスト

- [ ] 自分のプライベートIPアドレスを確認できた
- [ ] localhostへのpingが成功した
- [ ] 外部（8.8.8.8）へのpingが成功した
- [ ] ドメイン名でのpingが成功した
- [ ] 自分のIPがプライベートIPか判断できた
- [ ] サブネットマスクを確認できた
- [ ] IPv6アドレスを確認できた

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ip addr / ifconfig | 自分のIPアドレスを確認するコマンド |
| ping | ネットワーク接続を確認するコマンド |
| プライベートIP確認 | 10.x.x.x、172.16-31.x.x、192.168.x.xの範囲 |
| IPv6確認 | ip -6 addr show で確認可能 |

### チェックリスト
- [ ] 8つのミッションすべてをクリアした
- [ ] 各コマンドの意味を理解している
- [ ] 出力結果の読み方が分かる

---

## 次のステップへ

IPアドレスの実践演習、お疲れさまでした！

次はStep 2のチェックポイントクイズです。IPアドレスの知識を確認しましょう。

---

*推定読了時間: 90分*
