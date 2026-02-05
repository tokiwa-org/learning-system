# チェックポイント：DNSの名前解決を体験しよう

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 3
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "ネットワーク"
  category: "IT基本"
  target_level: "L0"
passingScore: 75
```

---

## クイズの説明

Step 3で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 75%（6問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1: DNSの正式名称と役割として正しいものはどれですか？

A) Data Network System - データを暗号化する仕組み
B) Domain Name System - ドメイン名をIPアドレスに変換する仕組み
C) Dynamic Network Service - ネットワークを自動設定する仕組み
D) Digital Name Server - デジタル証明書を管理する仕組み

<details><summary>答えを見る</summary>

**正解: B) Domain Name System - ドメイン名をIPアドレスに変換する仕組み**

DNS（Domain Name System）は、人間が覚えやすいドメイン名（www.google.com）を、コンピュータが使うIPアドレス（142.250.196.99）に変換する仕組みです。

</details>

---

### Q2: ドメイン名 `mail.google.com` で「google」にあたる部分は何と呼ばれますか？

A) TLD（トップレベルドメイン）
B) サブドメイン
C) セカンドレベルドメイン（ドメイン名）
D) ルートドメイン

<details><summary>答えを見る</summary>

**正解: C) セカンドレベルドメイン（ドメイン名）**

`mail.google.com` の構造：
- `com` = TLD（トップレベルドメイン）
- `google` = セカンドレベルドメイン（ドメイン名）
- `mail` = サブドメイン

ドメイン名は右から左に読みます。

</details>

---

### Q3: 名前解決の順序として正しいものはどれですか？

A) 権威サーバー → TLDサーバー → ルートサーバー → リゾルバ
B) リゾルバ → ルートサーバー → TLDサーバー → 権威サーバー
C) TLDサーバー → ルートサーバー → 権威サーバー → リゾルバ
D) ルートサーバー → 権威サーバー → TLDサーバー → リゾルバ

<details><summary>答えを見る</summary>

**正解: B) リゾルバ → ルートサーバー → TLDサーバー → 権威サーバー**

名前解決の流れ：
1. DNSリゾルバに問い合わせ
2. ルートDNSサーバーに問い合わせ（TLDサーバーを教えてもらう）
3. TLDサーバーに問い合わせ（権威サーバーを教えてもらう）
4. 権威サーバーに問い合わせ（最終回答を得る）

</details>

---

### Q4: Aレコードの役割として正しいものはどれですか？

A) ドメイン名を別のドメイン名に転送する
B) ドメイン名をIPv4アドレスに変換する
C) メールサーバーを指定する
D) 権威DNSサーバーを指定する

<details><summary>答えを見る</summary>

**正解: B) ドメイン名をIPv4アドレスに変換する**

各レコードの役割：
- A: ドメイン → IPv4アドレス
- AAAA: ドメイン → IPv6アドレス
- CNAME: ドメイン → 別のドメイン（A の説明は間違い）
- MX: メールサーバーの指定
- NS: 権威DNSサーバーの指定

</details>

---

### Q5: CNAMEレコードの説明として正しいものはどれですか？

A) ドメイン名をIPv6アドレスに変換するレコード
B) ドメイン名を別のドメイン名に転送するレコード
C) メールの送信先を指定するレコード
D) テキスト情報を保存するレコード

<details><summary>答えを見る</summary>

**正解: B) ドメイン名を別のドメイン名に転送するレコード**

CNAMEレコードは「このドメインの本当の名前はこちら」という転送設定です。例えば `blog.example.com` を `example.github.io` に転送するとき、CNAME レコードを使います。

</details>

---

### Q6: TTL（Time To Live）の説明として正しいものはどれですか？

A) ドメイン名の有効期限
B) DNSサーバーの応答時間
C) DNSキャッシュの有効期限
D) SSL証明書の有効期限

<details><summary>答えを見る</summary>

**正解: C) DNSキャッシュの有効期限**

TTLはDNSレコードのキャッシュがどれくらいの時間有効かを示す値です（秒単位）。例えばTTL=300なら、300秒（5分間）キャッシュが使われ、その後再度DNSに問い合わせが行われます。

</details>

---

### Q7: `nslookup -type=MX example.com` で調べられるものはどれですか？

A) example.com のIPアドレス
B) example.com のメールサーバー
C) example.com のWebサーバー
D) example.com のDNSサーバー

<details><summary>答えを見る</summary>

**正解: B) example.com のメールサーバー**

`-type=MX` はMXレコード（Mail Exchange Record）を指定しています。MXレコードはそのドメインのメールサーバーを指定するレコードです。

- `-type=A` → IPアドレス
- `-type=MX` → メールサーバー
- `-type=NS` → DNSサーバー

</details>

---

### Q8: /etc/hosts ファイルの説明として正しいものはどれですか？

A) DNSサーバーの設定ファイル
B) ローカルの名前解決に使われ、DNSサーバーよりも優先される
C) Webサーバーの設定ファイル
D) ネットワークインターフェースの設定ファイル

<details><summary>答えを見る</summary>

**正解: B) ローカルの名前解決に使われ、DNSサーバーよりも優先される**

`/etc/hosts` はOSが管理する名前とIPアドレスの対応表です。DNSサーバーに問い合わせる前にこのファイルが確認されます。開発環境で独自のドメインを設定する場合などに使われます。

</details>

---

## 結果

### 6問以上正解の場合

**合格です！おめでとうございます！**

Step 3「DNSの名前解決を体験しよう」を完了しました。
次はStep 4「HTTPリクエストを送ってみよう」に進みましょう。

### 5問以下の場合

**もう少し復習しましょう**

間違えた問題の内容を、該当するセクションで復習してください：

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step3_1 DNSとは何か |
| Q2 | step3_1 DNSとは何か |
| Q3 | step3_2 名前解決の仕組み |
| Q4 | step3_3 DNSレコードの種類 |
| Q5 | step3_3 DNSレコードの種類 |
| Q6 | step3_3 DNSレコードの種類 |
| Q7 | step3_4 nslookupで名前解決を体験しよう |
| Q8 | step3_4 nslookupで名前解決を体験しよう |

---

## Step 3 完了！

お疲れさまでした！

### 学んだこと

- DNSの基本（インターネットの電話帳）
- 名前解決の流れ（リゾルバ→ルート→TLD→権威）
- DNSレコードの種類（A、AAAA、CNAME、MX、TXT、NS）
- nslookup / dig コマンドの使い方

### 次のステップ

**Step 4: HTTPリクエストを送ってみよう（4時間）**

Webの通信プロトコルであるHTTPの仕組みを学び、curlコマンドで実際にリクエストを送ります。

---

*推定所要時間: 30分*
