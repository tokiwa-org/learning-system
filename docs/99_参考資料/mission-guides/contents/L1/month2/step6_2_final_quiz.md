# 卒業クイズ：データの守護者を目指そう

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 6
subStep: 2
title: "卒業クイズ"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

L1 Month 2 の全範囲から出題する卒業クイズです。

- 全15問
- 合格ライン: 80%（12問正解）
- 不合格の場合は該当ステップを復習してから再挑戦してください

---

## 問題

### Q1. INNER JOIN と LEFT JOIN の違いとして正しいものは？

- A) INNER JOIN は1つのテーブル、LEFT JOIN は2つのテーブルを使う
- B) INNER JOIN は一致するデータのみ、LEFT JOIN は左テーブルの全データを返す
- C) INNER JOIN は遅く、LEFT JOIN は速い
- D) INNER JOIN は集計用、LEFT JOIN は検索用

<details>
<summary>答えを見る</summary>

**正解: B**

INNER JOINは結合条件に一致するデータのみ返します。LEFT JOINは左テーブルの全データを保持し、一致しない場合は右テーブルのカラムがNULLになります。

</details>

---

### Q2. 自己結合（Self JOIN）が必要なケースは？

- A) 2つの異なるデータベースを結合する場合
- B) 同じテーブル内で上司-部下の関係を取得する場合
- C) テーブルのバックアップを作成する場合
- D) テーブルのデータを2倍にする場合

<details>
<summary>答えを見る</summary>

**正解: B**

自己結合は、同じテーブル内のデータ同士を参照する場合に使います。employees テーブルの manager_id が同テーブルの id を参照する上司-部下関係が典型例です。

</details>

---

### Q3. 「プロジェクトに参加していない社員」を見つけるSQLとして正しいのは？

- A) `SELECT ... FROM employees INNER JOIN project_members ON ... WHERE pm.id IS NULL`
- B) `SELECT ... FROM employees LEFT JOIN project_members ON ... WHERE pm.project_id IS NULL`
- C) `SELECT ... FROM employees WHERE project_id = NULL`
- D) `SELECT ... FROM employees INNER JOIN project_members ON ... WHERE pm.project_id = 0`

<details>
<summary>答えを見る</summary>

**正解: B**

LEFT JOINで全社員を保持し、project_members と結合した後、pm.project_id が IS NULL の行を抽出します。INNER JOINでは一致しない行が消えるため使えません。

</details>

---

### Q4. サブクエリの実行順序として正しいのは？

- A) メインクエリが先に実行される
- B) サブクエリ（内側）が先に実行される
- C) 両方同時に実行される
- D) 実行順序はランダム

<details>
<summary>答えを見る</summary>

**正解: B**

通常のサブクエリは内側（サブクエリ）が先に実行され、その結果を使って外側（メインクエリ）が実行されます。

</details>

---

### Q5. NOT IN を使う際に注意すべきことは？

- A) NOT IN は文字列に使えない
- B) NOT IN のリストにNULLが含まれると予期しない結果になる
- C) NOT IN は常にINより遅い
- D) NOT IN はサブクエリと組み合わせられない

<details>
<summary>答えを見る</summary>

**正解: B**

NOT IN のリストにNULLが含まれると、すべての比較がUNKNOWNになり、結果が空になる可能性があります。WHERE ... IS NOT NULL で除外するか、NOT EXISTS を使うと安全です。

</details>

---

### Q6. ウィンドウ関数の PARTITION BY の役割は？

- A) テーブルを物理的に分割する
- B) ウィンドウ（グループ）を定義し、グループ内で計算を行う
- C) 結果をフィルタリングする
- D) テーブルをJOINする

<details>
<summary>答えを見る</summary>

**正解: B**

PARTITION BYはウィンドウ（グループ）を定義します。GROUP BYとは異なり、行をまとめずに各行を保持したまま、グループ内での計算結果を付与します。

</details>

---

### Q7. RANK() と DENSE_RANK() の違いは？

- A) RANK は数値専用、DENSE_RANK は文字列専用
- B) RANK は同順位の後に飛び番、DENSE_RANK は同順位の後も連番
- C) RANK は昇順、DENSE_RANK は降順
- D) 違いはない

<details>
<summary>答えを見る</summary>

**正解: B**

例: [100, 90, 90, 80] の場合
- RANK: 1, 2, 2, 4（2位が2人なので3位をスキップ）
- DENSE_RANK: 1, 2, 2, 3（スキップしない）

</details>

---

### Q8. TCPの3ウェイハンドシェイクの正しい順序は？

- A) SYN-ACK → SYN → ACK
- B) ACK → SYN → SYN-ACK
- C) SYN → SYN-ACK → ACK
- D) SYN → ACK → SYN-ACK

<details>
<summary>答えを見る</summary>

**正解: C**

クライアントがSYNを送信 → サーバーがSYN-ACKで応答 → クライアントがACKで確認。この3ステップでTCP接続が確立されます。

</details>

---

### Q9. UDPが使われるサービスとして適切なものは？

- A) SSH
- B) MySQL
- C) DNS
- D) HTTP

<details>
<summary>答えを見る</summary>

**正解: C**

DNSの問い合わせは通常UDP/ポート53で行われます。小さなデータを高速にやりとりするためUDPが適しています。SSH、MySQL、HTTPはすべてTCPを使用します。

</details>

---

### Q10. PostgreSQLのデフォルトポート番号は？

- A) 22
- B) 3306
- C) 5432
- D) 8080

<details>
<summary>答えを見る</summary>

**正解: C**

5432がPostgreSQLのデフォルトポートです。22はSSH、3306はMySQL、8080はHTTP（代替）のポートです。

</details>

---

### Q11. ファイアウォールの「最小権限の原則」とは？

- A) すべてのポートを開放する
- B) すべてを拒否し、必要なものだけを許可する
- C) 管理者のみがアクセスできるようにする
- D) 暗号化された通信のみを許可する

<details>
<summary>答えを見る</summary>

**正解: B**

最小権限の原則では、デフォルトですべての通信を拒否し、業務に必要な最小限のアクセスのみを許可します。

</details>

---

### Q12. SSL証明書チェーンの構成要素を正しい順序で並べたものは？

- A) サーバー証明書 → ルートCA → 中間CA
- B) ルートCA → 中間CA → サーバー証明書
- C) 中間CA → ルートCA → サーバー証明書
- D) サーバー証明書 → サーバー証明書 → サーバー証明書

<details>
<summary>答えを見る</summary>

**正解: B**

証明書チェーンは、ルートCA（最上位の信頼元）→ 中間CA → サーバー証明書の順で署名されています。ブラウザはサーバー証明書からルートCAまでチェーンをたどって信頼性を検証します。

</details>

---

### Q13. nginx で 502 Bad Gateway エラーが出る最も一般的な原因は？

- A) クライアントのブラウザが古い
- B) SSL証明書が期限切れ
- C) バックエンドのアプリケーションサーバーが応答しない
- D) DNSの設定ミス

<details>
<summary>答えを見る</summary>

**正解: C**

502 Bad Gatewayは、リバースプロキシ（nginx）がバックエンドのサーバーから有効な応答を得られない場合に発生します。アプリサーバーの停止が最も一般的な原因です。

</details>

---

### Q14. 以下の障害を調査するとき、最初に実行すべきコマンドは？

「Webサーバー（192.168.1.200）にブラウザからアクセスできない」

- A) curl https://192.168.1.200
- B) openssl s_client -connect 192.168.1.200:443
- C) ping 192.168.1.200
- D) dig 192.168.1.200

<details>
<summary>答えを見る</summary>

**正解: C**

ボトムアップアプローチでは、まず下位層（L3 ネットワーク層）の疎通確認から始めます。pingで基本的なネットワーク疎通を確認してから、上位層の診断に進みます。

</details>

---

### Q15. インシデントレポートに含めるべき「再発防止策」の例として最も適切なものは？

- A) 「次回は気をつける」
- B) 「監視アラートの設定と、パッチ適用後のチェックリスト追加」
- C) 「担当者を厳しく指導する」
- D) 「すべてのサーバーを毎日再起動する」

<details>
<summary>答えを見る</summary>

**正解: B**

再発防止策は具体的かつ仕組み化されたものであるべきです。「監視アラートの設定」は問題の早期検知を、「チェックリスト追加」は人的ミスの防止を仕組みとして実現します。精神論や場当たり的な対策ではなく、プロセスの改善が重要です。

</details>

---

## 結果

### 12問以上正解の場合

**合格です！おめでとうございます！**

あなたは「データの守護者」の称号を獲得しました。

### 11問以下の場合

**もう少し復習しましょう**

| 問題 | 復習ステップ |
|------|------------|
| Q1-Q3 | Step 2: JOINの迷宮を攻略しよう |
| Q4-Q7 | Step 3: サブクエリの謎を解き明かそう |
| Q8-Q10 | Step 4: TCP/IPの旅に出よう |
| Q11-Q14 | Step 5: ネットワーク障害を解決しよう |
| Q15 | Step 6: データ復旧ミッション |

---

## データの守護者 修了証明書

```
╔══════════════════════════════════════════════╗
║                                              ║
║         データの守護者 修了証明書             ║
║                                              ║
║  L1 Month 2:                                ║
║  「データの守護者を目指そう」                 ║
║                                              ║
║  修得スキル:                                 ║
║    - JOIN（INNER / LEFT / 自己結合）         ║
║    - サブクエリ（相関 / EXISTS）             ║
║    - ウィンドウ関数（RANK / 集計）           ║
║    - TCP/UDP / ポート / ソケット             ║
║    - ファイアウォール / SSL/TLS              ║
║    - ネットワーク障害対応                    ║
║    - インシデントレポート作成                ║
║                                              ║
║  あなたはデータの守護者として                ║
║  複雑なクエリとネットワーク障害に            ║
║  立ち向かう力を手に入れました。              ║
║                                              ║
╚══════════════════════════════════════════════╝
```

---

## 全体のまとめ

### 学んだスキル一覧

| カテゴリ | スキル | 達成レベル |
|---------|--------|-----------|
| データベース | JOIN（INNER, LEFT, 自己結合） | 実践レベル |
| データベース | サブクエリ（スカラー, 相関, EXISTS） | 実践レベル |
| データベース | ウィンドウ関数（RANK, 集計） | 入門レベル |
| ネットワーク | TCP/UDP、ポート、ソケット | 理解レベル |
| ネットワーク | ファイアウォール（ufw, SG） | 理解レベル |
| ネットワーク | SSL/TLS証明書 | 理解レベル |
| ネットワーク | トラブルシューティング | 実践レベル |

### 次のステップへの道

このミッションで身につけた力は、実務で日常的に使うものです。
次のミッションでは、さらに高度なスキルを学んでいきましょう。

お疲れさまでした。あなたは立派な「データの守護者」です。

---

*推定所要時間: 30分*
