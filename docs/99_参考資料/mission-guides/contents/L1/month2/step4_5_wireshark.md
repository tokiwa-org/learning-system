# パケットキャプチャ入門

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 4
subStep: 5
title: "パケットキャプチャ入門"
itemType: LESSON
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "ネットワーク"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「ネットワークの問題を調べるとき、最終手段がある」
>
> 「最終手段？」
>
> 「パケットキャプチャだ。実際に流れている通信データを捕まえて中身を見る」
>
> 「通信の中身が見えるんですか！」
>
> 「そう。3ウェイハンドシェイクが本当に行われているか、どこで通信が止まっているか、すべてわかる。まずは tcpdump の基本を覚えよう」

---

## パケットキャプチャとは

パケットキャプチャは、**ネットワーク上を流れるパケット（通信データ）を捕獲・記録して分析する**技術です。

### 主なツール

| ツール | 特徴 |
|--------|------|
| tcpdump | コマンドライン（CUI）。サーバーで使用 |
| Wireshark | GUI。PC上で使用。視覚的にわかりやすい |
| tshark | Wiresharkのコマンドライン版 |

> サーバーにはGUIがないことが多いので、まず **tcpdump** を使えるようになりましょう。

---

## tcpdump の基本

### インストール確認

```bash
# インストールされているか確認
which tcpdump

# インストール（Ubuntuの場合）
sudo apt install tcpdump
```

### 基本コマンド

```bash
# すべてのパケットを表示（Ctrl+C で停止）
sudo tcpdump

# インターフェースを指定
sudo tcpdump -i eth0

# 最初の10パケットだけキャプチャ
sudo tcpdump -c 10
```

---

## フィルタリング

実際のサーバーでは大量のパケットが流れているので、フィルタリングが重要です。

### ホストでフィルタ

```bash
# 特定のIPアドレスとの通信のみ
sudo tcpdump host 192.168.1.100

# 特定の送信元
sudo tcpdump src host 192.168.1.100

# 特定の宛先
sudo tcpdump dst host 192.168.1.100
```

### ポートでフィルタ

```bash
# 特定のポートの通信のみ
sudo tcpdump port 3306

# HTTPまたはHTTPS
sudo tcpdump port 80 or port 443

# SSH以外
sudo tcpdump not port 22
```

### プロトコルでフィルタ

```bash
# TCPのみ
sudo tcpdump tcp

# UDPのみ
sudo tcpdump udp

# ICMPのみ（ping）
sudo tcpdump icmp
```

### 組み合わせ

```bash
# 特定ホストのMySQL通信
sudo tcpdump host 192.168.1.100 and port 3306

# SSH以外のTCP通信
sudo tcpdump tcp and not port 22
```

---

## 出力の読み方

```bash
sudo tcpdump -i eth0 port 80 -c 3
```

```
14:30:01.123456 IP 192.168.1.50.54321 > 93.184.216.34.80: Flags [S], seq 1234
14:30:01.234567 IP 93.184.216.34.80 > 192.168.1.50.54321: Flags [S.], seq 5678, ack 1235
14:30:01.234600 IP 192.168.1.50.54321 > 93.184.216.34.80: Flags [.], ack 5679
```

| 部分 | 意味 |
|------|------|
| 14:30:01.123456 | タイムスタンプ |
| 192.168.1.50.54321 | 送信元IP.ポート |
| 93.184.216.34.80 | 宛先IP.ポート |
| Flags [S] | SYNフラグ（接続要求） |
| Flags [S.] | SYN-ACKフラグ（接続承認） |
| Flags [.] | ACKフラグ（確認応答） |

> 上の3行は、まさに3ウェイハンドシェイクを示しています。

### フラグの意味

| フラグ | 記号 | 意味 |
|--------|------|------|
| SYN | S | 接続要求 |
| ACK | . | 確認応答 |
| FIN | F | 切断要求 |
| RST | R | 接続リセット |
| PSH | P | データ送信 |

---

## ファイルへの保存と分析

```bash
# パケットをファイルに保存
sudo tcpdump -w capture.pcap port 3306

# 保存したファイルを読み込む
sudo tcpdump -r capture.pcap

# .pcap ファイルは Wireshark で開くこともできる
```

> 本番サーバーでキャプチャした `.pcap` ファイルを手元のPCにダウンロードし、Wireshark で視覚的に分析するのが一般的なワークフローです。

---

## トラブルシューティングでの活用例

### 接続が確立できない場合

```bash
# DB接続のパケットを確認
sudo tcpdump -i eth0 port 3306 -c 20

# SYNは送られているがSYN-ACKが返ってこない
# → サーバーが応答していない or ファイアウォールでブロック

# RSTが返ってきている
# → サーバーのポートが閉じている
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| パケットキャプチャ | 通信データを捕獲・分析する技術 |
| tcpdump | コマンドラインのキャプチャツール |
| フィルタ | host, port, tcp/udp で絞り込み |
| フラグ | S=SYN, .=ACK, F=FIN, R=RST |
| 保存 | -w で pcap ファイルに保存 |

### チェックリスト
- [ ] tcpdump の基本コマンドを書ける
- [ ] host, port でフィルタリングできる
- [ ] パケット出力のフラグを読める
- [ ] キャプチャ結果から3ウェイハンドシェイクを識別できる

---

## 次のステップへ

パケットキャプチャの基本を学びました。
次のセクションで理解度チェックを行い、Step 4 の仕上げをしましょう。

---

*推定読了時間: 15分*
