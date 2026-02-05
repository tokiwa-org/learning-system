# 演習：ネットワーク診断

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 5
subStep: 3
title: "演習：ネットワーク診断"
itemType: EXERCISE
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "ネットワーク"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「これまでに学んだネットワークコマンドを使って、診断に挑戦してみよう」
>
> 「ping、nslookup、traceroute、curl を全部使うんですか？」
>
> 「そう。実際の現場でもこの流れでトラブルを調査するんだ」
>
> 「やってみます！」

---

## ミッション概要

ネットワーク診断コマンドを使って、接続確認や経路調査を行います。

### 準備

ターミナルを開いてください。

### 達成条件

- [ ] 6つのミッションすべてをクリアした
- [ ] 各ミッションで正しい出力が得られた
- [ ] コマンドを自分で入力して実行できた

---

### ミッション1: ネットワーク接続の基本チェック

以下の3つの宛先に順番に ping を送り、すべて応答があるか確認してください。

1. 自分自身（localhost）
2. GoogleのDNS（8.8.8.8）
3. google.com（ドメイン名）

それぞれ4回だけ送信してください。

<details><summary>解答</summary>

```bash
# 1. 自分自身
ping -c 4 localhost

# 2. GoogleのDNS
ping -c 4 8.8.8.8

# 3. google.com
ping -c 4 google.com
```

確認ポイント：
- localhost → 応答あり = ネットワークスタック正常
- 8.8.8.8 → 応答あり = インターネット接続OK
- google.com → 応答あり = DNS名前解決もOK

もし google.com で失敗、8.8.8.8 で成功なら、DNSに問題がある可能性があります。

</details>

---

### ミッション2: 複数サイトの応答時間を比較しよう

以下の3つのサーバーに ping を送り、RTT（応答時間）を比較してください。どれが最も速いですか？

1. 8.8.8.8（Google DNS）
2. 1.1.1.1（Cloudflare DNS）
3. www.amazon.co.jp

<details><summary>解答</summary>

```bash
ping -c 4 8.8.8.8
ping -c 4 1.1.1.1
ping -c 4 www.amazon.co.jp
```

統計情報の `avg`（平均値）を比較します。

例：
- 8.8.8.8: avg = 3.5ms
- 1.1.1.1: avg = 2.8ms
- www.amazon.co.jp: avg = 15.2ms

この場合、Cloudflare DNS（1.1.1.1）が最も速い応答です。ただし結果は環境や時間帯によって変わります。

一般的に、DNSサーバーへの ping は近いサーバーほど速くなります。

</details>

---

### ミッション3: DNS名前解決の詳細調査

以下の調査を行ってください：

1. `github.com` の IP アドレスを nslookup で調べる
2. `github.com` の NS レコードを調べる
3. dig +short で `github.com` の IP アドレスを取得する

<details><summary>解答</summary>

```bash
# 1. IPアドレスの確認
nslookup github.com

# 2. NSレコードの確認
nslookup -type=NS github.com

# 3. dig +short でIPのみ取得
dig +short github.com
```

出力例：
```
# nslookup
Name:   github.com
Address: 20.27.177.113

# NS レコード
github.com      nameserver = dns1.p08.nsone.net.
github.com      nameserver = dns2.p08.nsone.net.
github.com      nameserver = ns-1707.awsdns-21.co.uk.
...

# dig +short
20.27.177.113
```

GitHub はクラウドベースのDNS（NSOne、AWS Route 53）を使っていることが分かります。

</details>

---

### ミッション4: traceroute で経路を追跡しよう

`8.8.8.8` への経路を traceroute で追跡してください。何ホップで到達しますか？

```bash
traceroute -m 15 8.8.8.8
```

`-m 15` は最大ホップ数を15に制限するオプションです。

<details><summary>解答</summary>

```bash
traceroute -m 15 8.8.8.8
```

出力例：
```
traceroute to 8.8.8.8 (8.8.8.8), 15 hops max, 60 byte packets
 1  gateway (192.168.1.1)       1.234 ms  1.112 ms  1.089 ms
 2  10.0.0.1                    5.432 ms  5.321 ms  5.234 ms
 3  isp-gw.example.net          8.765 ms  8.654 ms  8.543 ms
 4  72.14.232.136               12.345 ms 12.234 ms 12.123 ms
 5  dns.google (8.8.8.8)        3.456 ms  3.345 ms  3.234 ms
```

確認ポイント：
- ホップ数（この例では5ホップ）
- 各ホップの応答時間
- 急に応答時間が増えているホップはないか
- `* * *` で応答がないホップはないか

環境によってホップ数は大きく異なります（5〜15ホップ程度が一般的）。

</details>

---

### ミッション5: HTTPレベルの診断

以下のURLに curl でアクセスし、ステータスコードを確認してください：

1. `https://www.google.com` → 200が期待される
2. `https://www.google.com/nonexistent-page` → 404が期待される
3. `http://github.com` → 301（リダイレクト）が期待される

<details><summary>解答</summary>

```bash
# 1. 正常なページ
curl -I -s https://www.google.com | head -1

# 2. 存在しないページ
curl -I -s https://www.google.com/nonexistent-page | head -1

# 3. HTTPからHTTPSへのリダイレクト
curl -I -s http://github.com | head -1
```

出力例：
```
# 1. HTTP/2 200
# 2. HTTP/2 404
# 3. HTTP/1.1 301
```

`-I` でヘッダーのみ取得、`-s` で進捗表示を非表示にしています。`head -1` で1行目（ステータスライン）だけを表示しています。

</details>

---

### ミッション6: 総合診断 - トラブルシューティングの流れ

以下の手順を順番に実行して、`www.example.com` への接続を総合的に診断してください。各ステップの結果を確認しながら進めましょう。

1. ping で接続確認
2. nslookup で名前解決確認
3. traceroute で経路確認
4. curl でHTTP接続確認

<details><summary>解答</summary>

```bash
# Step 1: ping で接続確認
ping -c 4 www.example.com

# Step 2: nslookup で名前解決確認
nslookup www.example.com

# Step 3: traceroute で経路確認
traceroute -m 15 www.example.com

# Step 4: curl でHTTP接続確認
curl -I https://www.example.com
```

チェックポイント：
- Step 1: 応答があり、packet loss が 0% か
- Step 2: IP アドレスが正しく解決されたか
- Step 3: 経路上に問題（高遅延、応答なし）がないか
- Step 4: ステータスコード 200 が返ったか

すべて正常であれば、ネットワーク接続に問題なしと判断できます。

</details>

---

## ミッション完了チェック

### 達成チェックリスト

- [ ] ping で基本的な接続チェックができた
- [ ] RTT の比較ができた
- [ ] nslookup / dig でDNS調査ができた
- [ ] traceroute で経路追跡ができた
- [ ] curl でHTTPステータスを確認できた
- [ ] 総合診断の流れを実践できた

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ping | 接続確認、RTT測定 |
| nslookup / dig | DNS名前解決の調査 |
| traceroute | パケットの経路追跡 |
| curl -I | HTTPステータスコードの確認 |
| 診断の流れ | ping → nslookup → traceroute → curl |

### チェックリスト
- [ ] 6つのミッションすべてをクリアした
- [ ] トラブルシューティングの流れが身についた
- [ ] 各コマンドの使い分けが分かる

---

## 次のステップへ

ネットワーク診断演習、お疲れさまでした！

次はStep 5のチェックポイントクイズです。ネットワークコマンドの知識を確認しましょう。

---

*推定読了時間: 60分*
