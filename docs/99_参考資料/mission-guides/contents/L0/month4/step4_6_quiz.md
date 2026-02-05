# チェックポイント：HTTPリクエストを送ってみよう

## メタ情報

```yaml
mission: "ネットワークの仕組みを解明しよう"
step: 4
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

Step 4で学んだ内容の理解度をチェックします。

- 全8問
- 合格ライン: 75%（6問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1: HTTPの正式名称として正しいものはどれですか？

A) HyperText Transfer Protocol
B) High Technology Transfer Program
C) Host Text Transport Protocol
D) Hyper Terminal Transfer Process

<details><summary>答えを見る</summary>

**正解: A) HyperText Transfer Protocol**

HTTP = HyperText Transfer Protocol。ブラウザとWebサーバーが通信するためのプロトコルです。

</details>

---

### Q2: HTTPの通信モデルとして正しいものはどれですか？

A) プッシュ/プル モデル
B) リクエスト/レスポンス モデル
C) パブリッシュ/サブスクライブ モデル
D) ピアツーピア モデル

<details><summary>答えを見る</summary>

**正解: B) リクエスト/レスポンス モデル**

HTTPはクライアント（ブラウザ）がリクエストを送り、サーバーがレスポンスを返す「リクエスト/レスポンス」モデルです。

</details>

---

### Q3: 新しいデータを作成するときに使うHTTPメソッドはどれですか？

A) GET
B) POST
C) DELETE
D) HEAD

<details><summary>答えを見る</summary>

**正解: B) POST**

HTTPメソッドとCRUDの対応：
- GET = Read（読み取り）
- POST = Create（作成）
- PUT = Update（更新）
- DELETE = Delete（削除）

</details>

---

### Q4: ステータスコード 404 の意味として正しいものはどれですか？

A) サーバー内部エラー
B) 認証が必要
C) リソースが見つからない
D) リクエスト成功

<details><summary>答えを見る</summary>

**正解: C) リソースが見つからない**

404 Not Found は、リクエストしたURLのページやリソースが存在しないことを示します。URLの間違いやページの削除が原因です。

- 200 = 成功
- 401 = 認証が必要
- 404 = 見つからない
- 500 = サーバー内部エラー

</details>

---

### Q5: ステータスコードが 5xx のとき、問題があるのはどちら側ですか？

A) クライアント（ブラウザ）側
B) サーバー側
C) ネットワーク回線
D) DNSサーバー

<details><summary>答えを見る</summary>

**正解: B) サーバー側**

ステータスコードの分類：
- 4xx = クライアント側のエラー（リクエストに問題がある）
- 5xx = サーバー側のエラー（サーバーに問題がある）

500 Internal Server Error はサーバーのプログラムバグ、503 Service Unavailable はメンテナンスや過負荷が原因です。

</details>

---

### Q6: curl コマンドで POST リクエストを送るとき、メソッドを指定するオプションはどれですか？

A) -d
B) -H
C) -X
D) -v

<details><summary>答えを見る</summary>

**正解: C) -X**

各オプションの役割：
- `-X` = HTTPメソッドの指定（`-X POST`）
- `-d` = 送信データの指定
- `-H` = ヘッダーの追加
- `-v` = 詳細表示

</details>

---

### Q7: HTTP と HTTPS の最も大きな違いは何ですか？

A) 通信速度
B) 通信の暗号化
C) 使えるメソッドの種類
D) 対応するブラウザ

<details><summary>答えを見る</summary>

**正解: B) 通信の暗号化**

- HTTP：通信が暗号化されていない（ポート80）
- HTTPS：SSL/TLSで通信が暗号化されている（ポート443）

HTTPSを使うことで、通信内容（パスワード、個人情報など）が第三者に盗み見されるリスクを防げます。

</details>

---

### Q8: ステータスコード 301 の意味として正しいものはどれですか？

A) リクエスト成功
B) 恒久的にリダイレクト（移動）
C) 認証が必要
D) サービス利用不可

<details><summary>答えを見る</summary>

**正解: B) 恒久的にリダイレクト（移動）**

301 Moved Permanently は「このURLは恒久的に別のURLに移動しました」という意味です。http:// から https:// への転送などでよく使われます。

3xx系はすべてリダイレクト（転送）に関するステータスコードです。

</details>

---

## 結果

### 6問以上正解の場合

**合格です！おめでとうございます！**

Step 4「HTTPリクエストを送ってみよう」を完了しました。
次はStep 5「ネットワークコマンドを使いこなそう」に進みましょう。

### 5問以下の場合

**もう少し復習しましょう**

間違えた問題の内容を、該当するセクションで復習してください：

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step4_1 HTTPとは何か |
| Q2 | step4_1 HTTPとは何か |
| Q3 | step4_2 HTTPメソッドを理解しよう |
| Q4 | step4_3 ステータスコードを読み解こう |
| Q5 | step4_3 ステータスコードを読み解こう |
| Q6 | step4_4 curlでHTTPリクエストを送ろう |
| Q7 | step4_1 HTTPとは何か |
| Q8 | step4_3 ステータスコードを読み解こう |

---

## Step 4 完了！

お疲れさまでした！

### 学んだこと

- HTTPの基本（リクエスト/レスポンスモデル）
- HTTPメソッド（GET、POST、PUT、DELETE）
- ステータスコード（200、301、404、500など）
- curlコマンドの使い方

### 次のステップ

**Step 5: ネットワークコマンドを使いこなそう（3時間）**

ping、traceroute などのネットワーク診断コマンドを学びます。

---

*推定所要時間: 30分*
