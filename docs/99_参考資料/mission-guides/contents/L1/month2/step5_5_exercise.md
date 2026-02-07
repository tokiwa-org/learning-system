# 演習：ネットワーク障害対応シミュレーション

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 5
subStep: 5
title: "演習：ネットワーク障害対応シミュレーション"
itemType: EXERCISE
estimatedMinutes: 120
noiseLevel: MINIMAL
roadmap:
  skill: "ネットワーク"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 「実際の障害は、いきなりやってくる。冷静に、体系的に対応できるかが勝負だ」
>
> 先輩が8つの障害シナリオを用意してくれた。
>
> 「これは過去に実際にあった障害をベースにしている。原因を特定し、対処方法を答えてくれ」
>
> 「わかりました！」

---

## ミッション概要

8つのネットワーク障害シナリオを読み、以下を回答してください。

1. **考えられる原因**
2. **確認のために実行するコマンド**
3. **対処方法**

### 達成条件

- [ ] 全8シナリオの原因を特定できる
- [ ] 適切な診断コマンドを選べる
- [ ] 対処方法を説明できる

---

## Scenario 1: Webサイトにアクセスできない

**状況:**
- ブラウザで `https://app.example.com` にアクセスするとタイムアウトになる
- `ping 8.8.8.8` は成功する
- `ping app.example.com` はタイムアウトする

**あなたの診断は？**

<details>
<summary>解答</summary>

**原因:** DNS解決の問題

**確認コマンド:**

```bash
# DNS解決を確認
dig app.example.com

# 別のDNSサーバーで試す
dig @8.8.8.8 app.example.com

# /etc/resolv.conf を確認
cat /etc/resolv.conf
```

**対処方法:**
- ローカルDNSサーバーに問題がある場合: /etc/resolv.conf の nameserver を 8.8.8.8 等に変更
- DNSレコードが存在しない場合: DNSレコードの設定を確認・修正
- DNSキャッシュの問題の場合: `sudo systemd-resolve --flush-caches`

**解説:** `ping 8.8.8.8`（IP直指定）は成功するが、ドメイン名での ping が失敗するため、DNS解決に問題があると判断できます。

</details>

---

## Scenario 2: DBサーバーに接続できない

**状況:**
- `mysql -h 192.168.1.100 -P 3306 -u app_user -p` がタイムアウトする
- `ping 192.168.1.100` は成功する
- DBサーバー上で `ss -tln | grep 3306` は `0.0.0.0:3306 LISTEN` を表示する

**あなたの診断は？**

<details>
<summary>解答</summary>

**原因:** ファイアウォールによるブロック

**確認コマンド:**

```bash
# クライアント側からポートの到達確認
nc -zv 192.168.1.100 3306

# サーバー側のファイアウォール確認（サーバーにSSH接続後）
sudo ufw status
sudo iptables -L -n | grep 3306
```

**対処方法:**

```bash
# サーバー側のファイアウォールでポート3306を許可
sudo ufw allow from クライアントIP to any port 3306

# クラウド環境ならセキュリティグループのインバウンドルールを確認
```

**解説:** ping（ICMP）は通るがTCPポート3306に接続できず、サーバー側ではLISTENしているため、途中のファイアウォールがTCPポート3306をブロックしていると判断できます。

</details>

---

## Scenario 3: HTTPS証明書エラー

**状況:**
- ブラウザで `https://secure.example.com` にアクセスすると「この接続ではプライバシーが保護されません」と表示される
- エラーコード: `NET::ERR_CERT_DATE_INVALID`
- HTTPでのアクセス（http://secure.example.com）は正常

**あなたの診断は？**

<details>
<summary>解答</summary>

**原因:** SSL証明書の期限切れ

**確認コマンド:**

```bash
# 証明書の有効期限を確認
echo | openssl s_client -connect secure.example.com:443 -servername secure.example.com 2>/dev/null | openssl x509 -noout -dates

# 詳細な証明書情報
curl -v https://secure.example.com 2>&1 | grep -i "expire\|date\|certificate"
```

**対処方法:**

```bash
# Let's Encrypt の場合
sudo certbot renew

# 証明書の更新後、nginxをリロード
sudo nginx -s reload
```

**解説:** エラーコード `ERR_CERT_DATE_INVALID` は証明書の有効期限に関する問題を示しています。

</details>

---

## Scenario 4: 502 Bad Gateway エラー

**状況:**
- `https://api.example.com` にアクセスすると 502 Bad Gateway エラー
- nginx のリバースプロキシを使用している
- nginx 自体は起動している

**あなたの診断は？**

<details>
<summary>解答</summary>

**原因:** バックエンドのアプリケーションサーバーが停止している

**確認コマンド:**

```bash
# nginx のエラーログを確認
sudo tail -20 /var/log/nginx/error.log

# バックエンドのアプリサーバーが起動しているか確認
ss -tln | grep 3000    # アプリのポートを確認

# アプリサーバーのプロセスを確認
ps aux | grep node     # Node.js の場合
ps aux | grep python   # Python の場合
```

**対処方法:**

```bash
# アプリサーバーを再起動
sudo systemctl restart app-service

# または手動で起動
cd /path/to/app && node server.js
```

**解説:** 502 Bad Gateway は、リバースプロキシ（nginx）が背後のサーバーから応答を得られない場合に発生します。バックエンドの停止が最も一般的な原因です。

</details>

---

## Scenario 5: 名前解決が遅い

**状況:**
- Webサイトにアクセスすると、表示されるまで10秒以上かかる
- 一度表示されると、次のアクセスは速い
- `time dig example.com` の結果が `real 0m8.500s`

**あなたの診断は？**

<details>
<summary>解答</summary>

**原因:** DNSサーバーの応答が遅い

**確認コマンド:**

```bash
# 現在のDNSサーバーでの応答時間
time dig example.com

# Google DNSでの応答時間（比較）
time dig @8.8.8.8 example.com

# 現在のDNS設定を確認
cat /etc/resolv.conf
```

**対処方法:**

```bash
# 高速なDNSサーバーに変更
sudo vi /etc/resolv.conf
# nameserver 8.8.8.8
# nameserver 1.1.1.1

# 恒久的な変更はnetplan等で設定
```

**解説:** 初回アクセスだけ遅く2回目以降が速いのは、DNSキャッシュの効果です。初回のDNS解決に時間がかかっているため、DNSサーバーの応答速度に問題があります。

</details>

---

## Scenario 6: 特定のサーバーだけ接続できない

**状況:**
- `ping 192.168.1.200` はタイムアウトする
- `ping 192.168.1.100` は成功する
- 他の人は `192.168.1.200` に正常にアクセスできる

**あなたの診断は？**

<details>
<summary>解答</summary>

**原因:** 自分のルーティング設定の問題、または相手サーバーが自分のIPをブロックしている

**確認コマンド:**

```bash
# 経路を確認
traceroute 192.168.1.200

# ルーティングテーブルを確認
ip route show

# ARPテーブルを確認
ip neighbor show | grep 192.168.1.200

# 自分のIPアドレスを確認
ip addr show
```

**対処方法:**
- ルーティングの問題: `ip route add` でルートを追加
- ARPの問題: `ip neighbor flush` でARPキャッシュをクリア
- サーバー側のブロック: サーバー管理者にファイアウォールルールを確認依頼

**解説:** 他の人はアクセスできるので、全体のネットワーク障害ではなく、自分の環境に固有の問題です。ルーティング、ARP、ファイアウォール（自分側または相手側）を順番に確認します。

</details>

---

## Scenario 7: SSH接続が途中で切れる

**状況:**
- SSH接続は確立できるが、しばらく放置すると切断される
- 操作中は切れない
- エラー: `client_loop: send disconnect: Broken pipe`

**あなたの診断は？**

<details>
<summary>解答</summary>

**原因:** SSHのKeepAliveが設定されておらず、アイドルタイムアウトで切断されている

**確認コマンド:**

```bash
# SSH接続時に詳細ログを表示
ssh -v user@server

# サーバー側のSSH設定を確認
cat /etc/ssh/sshd_config | grep -i "alive\|timeout"
```

**対処方法:**

```bash
# クライアント側: ~/.ssh/config に追加
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3

# サーバー側: /etc/ssh/sshd_config
ClientAliveInterval 60
ClientAliveCountMax 3
```

**解説:** `ServerAliveInterval 60` は60秒ごとにKeepAliveパケットを送信し、3回連続で応答がなければ切断します。これにより、アイドル状態でも接続が維持されます。途中のファイアウォールやNATがアイドル接続を切断している場合にも有効です。

</details>

---

## Scenario 8: ロードバランサー配下の1台だけエラー

**状況:**
- Webアプリにアクセスすると、たまに500エラーが発生する
- リロードすると正常に表示される
- nginx ロードバランサーの背後に3台のアプリサーバーがある

**あなたの診断は？**

<details>
<summary>解答</summary>

**原因:** 3台のアプリサーバーのうち1台に問題がある。ラウンドロビンで振り分けられるため、その1台に当たったときだけエラーになる。

**確認コマンド:**

```bash
# nginx のアクセスログで振り分け先を確認
sudo tail -100 /var/log/nginx/access.log

# 各アプリサーバーに直接アクセスして確認
curl http://192.168.1.101:3000/health
curl http://192.168.1.102:3000/health
curl http://192.168.1.103:3000/health

# 問題のあるサーバーのログを確認
ssh 192.168.1.102 'tail -50 /var/log/app/error.log'
```

**対処方法:**

```bash
# 一時的に問題のあるサーバーをロードバランサーから除外
# nginx の upstream から該当サーバーをコメントアウト
upstream app_servers {
    server 192.168.1.101:3000;
    # server 192.168.1.102:3000;  # 一時的に除外
    server 192.168.1.103:3000;
}

# nginx をリロード
sudo nginx -s reload

# 問題のあるサーバーを調査・修復
```

**解説:** 「たまにエラー」はロードバランサー特有の症状です。各サーバーに直接アクセスして問題のあるサーバーを特定するのが定石です。

</details>

---

## 達成度チェック

| シナリオ | テーマ | 完了 |
|---------|--------|------|
| Scenario 1 | DNS障害 | [ ] |
| Scenario 2 | ファイアウォール | [ ] |
| Scenario 3 | SSL証明書期限切れ | [ ] |
| Scenario 4 | 502 Bad Gateway | [ ] |
| Scenario 5 | DNS応答遅延 | [ ] |
| Scenario 6 | ルーティング/接続固有 | [ ] |
| Scenario 7 | SSHタイムアウト | [ ] |
| Scenario 8 | ロードバランサー | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 体系的アプローチ | ボトムアップで下位層から確認 |
| 切り分け | 自分だけか全体かで原因の範囲を絞る |
| コマンド活用 | ping, dig, nc, ss, curl, openssl を駆使 |
| ログ確認 | nginx, アプリ、システムのログが重要 |
| 冷静な対応 | 焦らず1つずつ確認して原因を特定 |

### チェックリスト
- [ ] 8つのシナリオすべてで原因を特定できた
- [ ] 各シナリオに適した診断コマンドを選べた
- [ ] 対処方法を具体的に説明できた

---

## 次のステップへ

おめでとうございます。ネットワーク障害対応の実践演習をクリアしました。
次のセクションで理解度チェックを行い、Step 5 の仕上げをしましょう。

---

*推定所要時間: 120分*
