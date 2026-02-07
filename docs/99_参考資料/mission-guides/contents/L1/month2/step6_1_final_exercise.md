# 総合演習：データ復旧ミッション

## メタ情報

```yaml
mission: "データの守護者を目指そう"
step: 6
subStep: 1
title: "総合演習：データ復旧ミッション"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "データベース"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 深夜2時。携帯が鳴った。
>
> 「緊急事態だ。ECサイトの注文データがおかしい。お客さんから『注文したのに確認メールが来ない』って問い合わせが殺到してる」
>
> 先輩の声は真剣だ。
>
> 「まず、DBを調査して影響範囲を特定してくれ。それからネットワークの問題もあるかもしれない。順番にやっていこう」
>
> 「わかりました！」
>
> これまで学んだすべてのスキルを総動員する時が来た。

---

## ミッション概要

本番環境で発生したデータ障害を、5つのパートに分けて解決します。

### 達成条件

- [ ] Part 1-5 すべてのタスクを完了
- [ ] 各パートで正しいSQL/コマンドを書ける
- [ ] Part 5 でインシデントレポートを作成できる

---

## Part 1: 消えた注文データを探せ（JOIN）

**状況:** 「注文したのにデータがない」という顧客が複数いる。

### 前提：追加テーブル

以下のテーブルが社員管理DBに追加されているとイメージしてください。

```sql
-- 顧客からの注文を管理するテーブル（イメージ）
-- project_members テーブルを「注文データ」として読み替える

-- project_members の role は以下に対応:
--   'PM'        → 注文ステータス: '処理済み'
--   'テックリード' → 注文ステータス: '処理中'
--   'エンジニア'  → 注文ステータス: '未処理'
--   'メンバー'   → 注文ステータス: '確認待ち'
```

### Task 1-1: 全社員のプロジェクト参加状況を確認

全社員について、参加しているプロジェクト名とその役割を表示してください。プロジェクト未参加の社員も含めること。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    COALESCE(p.name, '未参加') AS プロジェクト名,
    COALESCE(pm.role, '-') AS 役割
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
LEFT JOIN project_members pm ON e.id = pm.employee_id
LEFT JOIN projects p ON pm.project_id = p.id
ORDER BY e.id;
```

</details>

### Task 1-2: プロジェクトのない部署を特定

プロジェクトが割り当てられていない部署を見つけてください。

<details>
<summary>解答</summary>

```sql
SELECT d.name AS 部署名, d.budget AS 予算
FROM departments d
LEFT JOIN projects p ON d.id = p.department_id
WHERE p.id IS NULL;
```

</details>

### Task 1-3: 複数プロジェクトに参加している社員の詳細

2つ以上のプロジェクトに参加している社員の名前、部署名、参加プロジェクト数を表示してください。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    COUNT(pm.project_id) AS 参加PJ数
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
INNER JOIN project_members pm ON e.id = pm.employee_id
GROUP BY e.name, d.name
HAVING COUNT(pm.project_id) >= 2;
```

</details>

---

## Part 2: データの異常を検知せよ（サブクエリ）

**状況:** データの異常パターンを特定する必要がある。

### Task 2-1: 部署平均より給与が低い社員を検出

各部署で、その部署の平均給与より低い給与の社員を特定してください。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    e.salary AS 月給,
    (SELECT ROUND(AVG(e2.salary))
     FROM employees e2
     WHERE e2.department_id = e.department_id) AS 部署平均
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary < (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e.department_id
);
```

</details>

### Task 2-2: プロジェクト予算に対する人件費比率が最も高いプロジェクト

各プロジェクトについて、メンバーの月給合計が予算に占める割合を算出し、最も割合が高いプロジェクトを見つけてください。

<details>
<summary>解答</summary>

```sql
SELECT
    p.name AS プロジェクト名,
    p.budget AS 予算,
    SUM(e.salary) AS メンバー月給合計,
    ROUND(CAST(SUM(e.salary) AS FLOAT) / p.budget * 100, 1) AS 月給割合
FROM projects p
INNER JOIN project_members pm ON p.id = pm.project_id
INNER JOIN employees e ON pm.employee_id = e.id
GROUP BY p.name, p.budget
ORDER BY 月給割合 DESC
LIMIT 1;
```

</details>

### Task 2-3: 全社ランキングと部署内ランキングを同時表示

全社員について、全社での給与ランキングと部署内での給与ランキングを同時に表示してください。

<details>
<summary>解答</summary>

```sql
SELECT
    e.name AS 社員名,
    d.name AS 部署名,
    e.salary AS 月給,
    RANK() OVER (ORDER BY e.salary DESC) AS 全社ランキング,
    RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS 部署内ランキング
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY 全社ランキング;
```

</details>

---

## Part 3: ネットワーク接続の確認（トラブルシューティング）

**状況:** DBサーバーへの接続が不安定。原因を調査してください。

### Task 3-1: 接続診断の手順を書け

DBサーバー（192.168.1.100:3306）への接続問題を調査するためのコマンドを、ボトムアップアプローチで順番に書いてください。

<details>
<summary>解答</summary>

```bash
# Step 1: L3 ネットワーク疎通確認
ping -c 3 192.168.1.100

# Step 2: 経路確認
traceroute 192.168.1.100

# Step 3: L4 ポート到達確認
nc -zv 192.168.1.100 3306

# Step 4: TCP接続状態の確認
ss -tn | grep 192.168.1.100

# Step 5: DNS解決の確認（ドメイン名を使う場合）
dig db.example.com

# Step 6: アプリケーション層の接続テスト
mysql -h 192.168.1.100 -P 3306 -u app_user -p
```

</details>

### Task 3-2: tcpdump で接続問題を分析

DBサーバーへの接続を tcpdump でキャプチャするコマンドを書いてください。3ウェイハンドシェイクが完了しているかを確認したい。

<details>
<summary>解答</summary>

```bash
# DBサーバーへのTCP通信をキャプチャ
sudo tcpdump -i eth0 host 192.168.1.100 and port 3306 -c 20

# 出力の確認ポイント:
# Flags [S]    → SYN 送信（クライアント→サーバー）
# Flags [S.]   → SYN-ACK 受信（サーバー→クライアント）
# Flags [.]    → ACK 送信（クライアント→サーバー）
# この3つが揃えば3ウェイハンドシェイク成功

# SYNだけ送られてSYN-ACKが返ってこない場合:
# → ファイアウォールでブロックされている可能性
# → サーバーのポートがLISTENしていない可能性

# 結果をファイルに保存
sudo tcpdump -i eth0 host 192.168.1.100 and port 3306 -w db_debug.pcap
```

</details>

---

## Part 4: SSL証明書の検証

**状況:** 内部管理ツール（https://admin.example.com）で証明書エラーが発生。

### Task 4-1: 証明書の状態を確認するコマンド

admin.example.com のSSL証明書の有効期限と発行者を確認するコマンドを書いてください。

<details>
<summary>解答</summary>

```bash
# 証明書の有効期限を確認
echo | openssl s_client -connect admin.example.com:443 -servername admin.example.com 2>/dev/null | openssl x509 -noout -dates

# 証明書の発行者を確認
echo | openssl s_client -connect admin.example.com:443 -servername admin.example.com 2>/dev/null | openssl x509 -noout -issuer

# 証明書チェーンを確認
openssl s_client -connect admin.example.com:443 -servername admin.example.com

# curl で詳細な接続情報を確認
curl -v https://admin.example.com 2>&1 | head -30
```

</details>

### Task 4-2: 証明書が期限切れだった場合の対処

Let's Encrypt 証明書が期限切れだった場合の復旧手順を書いてください。

<details>
<summary>解答</summary>

```bash
# 1. 証明書の更新
sudo certbot renew

# 2. 更新に失敗した場合、強制更新
sudo certbot renew --force-renewal

# 3. 更新後、nginx をリロード
sudo nginx -t          # 設定の構文チェック
sudo nginx -s reload   # リロード

# 4. 証明書の有効期限を再確認
echo | openssl s_client -connect admin.example.com:443 -servername admin.example.com 2>/dev/null | openssl x509 -noout -dates

# 5. 自動更新が設定されているか確認
sudo systemctl status certbot.timer
# または
crontab -l | grep certbot
```

</details>

---

## Part 5: インシデントレポートの作成

**状況:** 障害が解決した。上司に報告するインシデントレポートを作成してください。

### Task 5-1: インシデントレポート

以下の項目を埋めて、インシデントレポートを完成させてください。

```
## インシデントレポート

### 概要
- 発生日時: 2024年X月X日 2:00 AM
- 検知方法: 顧客からの問い合わせ
- 影響範囲: （記入してください）

### タイムライン
- 2:00 AM: （記入してください）
- 2:15 AM: （記入してください）
- 2:30 AM: （記入してください）
- 3:00 AM: （記入してください）

### 原因
（記入してください）

### 対応内容
（記入してください）

### 再発防止策
（記入してください）
```

<details>
<summary>解答例</summary>

```
## インシデントレポート

### 概要
- 発生日時: 2024年X月X日 2:00 AM
- 検知方法: 顧客からの問い合わせ（注文確認メール未着）
- 影響範囲: ECサイト利用者のうち、注文処理が完了していない顧客

### タイムライン
- 2:00 AM: 障害検知。顧客から注文確認メール未着の報告
- 2:15 AM: DBサーバーの調査開始。JOINクエリで注文データの状態を確認
- 2:30 AM: DBサーバーへのネットワーク接続が不安定であることを発見。
           ファイアウォール設定の変更が原因と判明
- 3:00 AM: ファイアウォール設定を修正。接続復旧。未処理の注文を再処理

### 原因
前日のセキュリティパッチ適用時に、ファイアウォールルールが
初期化され、アプリサーバーからDBサーバー（ポート3306）への
通信が一時的にブロックされた。

### 対応内容
1. DBサーバーのファイアウォールにポート3306の許可ルールを再設定
2. アプリサーバーとDB間の接続を確認
3. 未処理の注文データを特定し、再処理を実行

### 再発防止策
1. ファイアウォール設定のバックアップと変更管理の導入
2. セキュリティパッチ適用後のチェックリストにネットワーク疎通確認を追加
3. DB接続監視アラートの設定（5分以上接続不可でアラート）
4. certbot 自動更新の定期動作確認をcronに追加
```

</details>

---

## 達成度チェック

| パート | テーマ | 完了 |
|--------|--------|------|
| Part 1 | JOIN（データ探索） | [ ] |
| Part 2 | サブクエリ・ウィンドウ関数（異常検知） | [ ] |
| Part 3 | ネットワーク（接続診断） | [ ] |
| Part 4 | SSL証明書（検証と復旧） | [ ] |
| Part 5 | インシデントレポート（文書化） | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| JOIN | 複数テーブルを横断してデータを探索 |
| サブクエリ | データの異常パターンを検出 |
| ウィンドウ関数 | ランキングや相対比較で分析 |
| ネットワーク診断 | ボトムアップで接続問題を調査 |
| SSL証明書 | 有効期限の確認と更新手順 |
| レポート | 障害の記録と再発防止策の策定 |

### チェックリスト
- [ ] Part 1-5 すべて完了した
- [ ] 複雑なJOINクエリを書けた
- [ ] サブクエリとウィンドウ関数を活用できた
- [ ] ネットワーク診断コマンドを正しく書けた
- [ ] インシデントレポートを作成できた

---

## 次のステップへ

データ復旧ミッション、お疲れさまでした。
最後に卒業クイズに挑戦し、データの守護者の称号を手に入れましょう。

---

*推定所要時間: 90分*
