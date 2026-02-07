# SSL/TLS証明書を理解しよう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 5
subStep: 3
title: "SSL/TLS証明書を理解しよう"
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

> 「社内ツールにアクセスしたら『この接続ではプライバシーが保護されません』ってエラーが出る」
>
> 「ああ、SSL証明書の問題だな。証明書が期限切れか、設定が間違っているかだ」
>
> 「SSL証明書って、あの鍵マークのやつですか？」
>
> 「そう。HTTPSの裏側でどんな仕組みが動いているか、ちゃんと理解しておこう」

---

## SSL/TLS とは

SSL（Secure Sockets Layer）/ TLS（Transport Layer Security）は、**通信を暗号化するプロトコル**です。

### HTTPとHTTPSの違い

```
HTTP:  クライアント ←→ サーバー  （平文、盗聴可能）
HTTPS: クライアント ←[暗号化]→ サーバー  （暗号化、安全）
```

> 現在は SSL は古く非推奨で、TLS が使われています。ただし慣例的に「SSL証明書」と呼ばれることが多いです。

---

## SSL/TLSのハンドシェイク

HTTPSの接続確立時に行われるやりとりです（TCPの3ウェイハンドシェイクの後）。

```
クライアント                         サーバー
    |                                  |
    |--- ClientHello ----------------->|  使用可能な暗号方式を提示
    |                                  |
    |<-- ServerHello + 証明書 ---------|  暗号方式の決定 + 証明書送信
    |                                  |
    |   証明書を検証                    |  クライアントが証明書の有効性を確認
    |                                  |
    |--- 鍵交換 ---------------------->|  暗号化通信のための鍵を交換
    |                                  |
    |<-- 完了 -------------------------|
    |                                  |
    |==== 暗号化通信開始 ==============|
```

---

## SSL証明書の構成要素

| 要素 | 説明 |
|------|------|
| ドメイン名 | 証明書が有効なドメイン（例: example.com） |
| 発行者（CA） | 証明書を発行した認証局（例: Let's Encrypt） |
| 有効期限 | 証明書の有効開始日と終了日 |
| 公開鍵 | 暗号化に使う公開鍵 |
| 署名 | 認証局による電子署名 |

---

## 証明書チェーン

証明書は**チェーン（連鎖）**で信頼性を確保します。

```
ルート証明書（Root CA）      ← OSやブラウザに組み込まれている
  ↓ 署名
中間証明書（Intermediate CA） ← ルートCAが署名
  ↓ 署名
サーバー証明書                ← 中間CAが署名。あなたのサイト用
```

> ブラウザは、サーバー証明書から中間証明書、ルート証明書までチェーンをたどり、信頼できるルートCAにたどり着けば「安全」と判断します。

---

## openssl コマンドで証明書を確認

### 基本的な証明書確認

```bash
# サーバーの証明書を表示
openssl s_client -connect example.com:443 -servername example.com

# 出力の見方:
# Certificate chain   ← 証明書チェーン
#  0 s:CN = example.com   ← サーバー証明書
#    i:C = US, O = Let's Encrypt, CN = R3   ← 発行者
#  1 s:C = US, O = Let's Encrypt, CN = R3   ← 中間証明書
#    i:O = Digital Signature Trust Co., CN = DST Root CA X3   ← ルートCA
```

### 証明書の有効期限を確認

```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -dates
```

```
notBefore=Jan  1 00:00:00 2024 GMT   ← 有効開始日
notAfter=Apr  1 00:00:00 2024 GMT    ← 有効終了日
```

### 証明書の詳細を確認

```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -text
```

---

## curl でHTTPSの問題を診断

```bash
# 詳細な接続情報（SSL含む）
curl -v https://example.com

# 出力例（正常）:
# * SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
# * Server certificate:
# *  subject: CN=example.com
# *  SSL certificate verify ok.

# 証明書の検証をスキップ（テスト用、本番では非推奨）
curl -k https://example.com
```

---

## Let's Encrypt

無料でSSL証明書を発行する認証局です。

### 特徴

| 項目 | 内容 |
|------|------|
| 費用 | 無料 |
| 有効期間 | 90日 |
| 更新 | certbot で自動更新 |
| ドメイン検証 | HTTP-01 または DNS-01 |

### certbot の基本

```bash
# 証明書の取得
sudo certbot certonly --webroot -w /var/www/html -d example.com

# 証明書の更新
sudo certbot renew

# 自動更新の設定（cronまたはsystemdタイマー）
# 通常インストール時に自動設定される
```

---

## よくあるSSL/TLS障害

### 1. 証明書の期限切れ

```
症状: 「NET::ERR_CERT_DATE_INVALID」
確認: openssl s_client で有効期限を確認
対応: 証明書を更新（certbot renew）
```

### 2. ドメイン名の不一致

```
症状: 「NET::ERR_CERT_COMMON_NAME_INVALID」
確認: 証明書のCN/SANとアクセスURLのドメインが一致しているか
対応: 正しいドメイン名で証明書を再取得
```

### 3. 中間証明書の欠落

```
症状: 一部のブラウザやOSでだけエラー
確認: openssl s_client で証明書チェーンを確認
対応: 中間証明書をサーバーに設定
```

### 4. 自己署名証明書

```
症状: 「NET::ERR_CERT_AUTHORITY_INVALID」
確認: 発行者が信頼されたCAではない
対応: 正規のCAから証明書を取得（Let's Encrypt等）
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| SSL/TLS | 通信を暗号化するプロトコル |
| 証明書 | ドメインの所有者を証明し、暗号化の鍵を提供 |
| 証明書チェーン | ルートCA → 中間CA → サーバー証明書の信頼の連鎖 |
| openssl | 証明書の内容や有効期限を確認するコマンド |
| Let's Encrypt | 無料の証明書発行サービス（90日ごとに更新） |

### チェックリスト
- [ ] SSL/TLSハンドシェイクの流れを理解した
- [ ] openssl で証明書の有効期限を確認できる
- [ ] 証明書チェーンの概念を説明できる
- [ ] よくあるSSL障害パターンを把握した

---

## 次のステップへ

SSL/TLS証明書の仕組みと障害対応を学びました。
次のセクションでは、プロキシとロードバランサーについて学びます。

---

*推定読了時間: 30分*
