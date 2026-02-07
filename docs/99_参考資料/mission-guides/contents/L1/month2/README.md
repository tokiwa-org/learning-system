# L1 月2: データの守護者を目指そう

## 概要

| 項目 | 内容 |
|-----|------|
| 対象 | L1（新人→一人前） |
| 総時間 | 20時間 |
| スキル | データベース（JOIN/サブクエリ）、ネットワーク（トラブルシューティング） |

---

## 前提知識

L0で以下を習得済みであること：

- SQL基本操作（SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, GROUP BY）
- ネットワーク基礎（IP, DNS, HTTP, curl）

---

## ステップ構成

### Step 1: SQLの基本を思い出そう（2時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 1-1 | データの守護者への道 | LESSON | 15分 | [step1_1_intro.md](./step1_1_intro.md) |
| 1-2 | SQL基本の復習 | LESSON | 25分 | [step1_2_review.md](./step1_2_review.md) |
| 1-3 | 複雑なデータベースを構築しよう | LESSON | 25分 | [step1_3_setup.md](./step1_3_setup.md) |
| 1-4 | 外部キーとリレーションを理解しよう | LESSON | 25分 | [step1_4_foreign_key.md](./step1_4_foreign_key.md) |
| 1-5 | ER図の読み方 | LESSON | 15分 | [step1_5_er.md](./step1_5_er.md) |
| 1-6 | 理解度チェック | QUIZ | 15分 | [step1_6_quiz.md](./step1_6_quiz.md) |

### Step 2: JOINの迷宮を攻略しよう（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 2-1 | INNER JOINでテーブルを結合しよう | LESSON | 30分 | [step2_1_inner_join.md](./step2_1_inner_join.md) |
| 2-2 | LEFT JOINで全データを保持しよう | LESSON | 30分 | [step2_2_left_join.md](./step2_2_left_join.md) |
| 2-3 | 3テーブル以上のJOINに挑戦しよう | LESSON | 30分 | [step2_3_multi_join.md](./step2_3_multi_join.md) |
| 2-4 | 自己結合を理解しよう | LESSON | 30分 | [step2_4_self_join.md](./step2_4_self_join.md) |
| 2-5 | 演習：JOINマスターへの挑戦 | EXERCISE | 90分 | [step2_5_exercise.md](./step2_5_exercise.md) |
| 2-6 | チェックポイント | QUIZ | 30分 | [step2_6_quiz.md](./step2_6_quiz.md) |

### Step 3: サブクエリの謎を解き明かそう（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 3-1 | サブクエリの基本 | LESSON | 30分 | [step3_1_subquery_basic.md](./step3_1_subquery_basic.md) |
| 3-2 | WHERE句でサブクエリを使おう | LESSON | 30分 | [step3_2_where_subquery.md](./step3_2_where_subquery.md) |
| 3-3 | FROM句とEXISTSを活用しよう | LESSON | 30分 | [step3_3_from_subquery.md](./step3_3_from_subquery.md) |
| 3-4 | ウィンドウ関数入門 | LESSON | 30分 | [step3_4_window.md](./step3_4_window.md) |
| 3-5 | 演習：複雑なクエリに挑戦 | EXERCISE | 90分 | [step3_5_exercise.md](./step3_5_exercise.md) |
| 3-6 | チェックポイント | QUIZ | 30分 | [step3_6_quiz.md](./step3_6_quiz.md) |

### Step 4: TCP/IPの旅に出よう（2時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 4-1 | TCPの仕組みを深く理解しよう | LESSON | 20分 | [step4_1_tcp.md](./step4_1_tcp.md) |
| 4-2 | TCPとUDPを使い分けよう | LESSON | 20分 | [step4_2_udp.md](./step4_2_udp.md) |
| 4-3 | ポートとソケットを理解しよう | LESSON | 20分 | [step4_3_ports.md](./step4_3_ports.md) |
| 4-4 | ファイアウォールとセキュリティ | LESSON | 20分 | [step4_4_firewall.md](./step4_4_firewall.md) |
| 4-5 | パケットキャプチャ入門 | LESSON | 15分 | [step4_5_wireshark.md](./step4_5_wireshark.md) |
| 4-6 | 理解度チェック | QUIZ | 15分 | [step4_6_quiz.md](./step4_6_quiz.md) |

### Step 5: ネットワーク障害を解決しよう（6時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 5-1 | トラブルシューティングの体系的アプローチ | LESSON | 30分 | [step5_1_troubleshoot.md](./step5_1_troubleshoot.md) |
| 5-2 | DNS障害を解決しよう | LESSON | 30分 | [step5_2_dns_advanced.md](./step5_2_dns_advanced.md) |
| 5-3 | SSL/TLS証明書を理解しよう | LESSON | 30分 | [step5_3_ssl.md](./step5_3_ssl.md) |
| 5-4 | プロキシとロードバランサー | LESSON | 30分 | [step5_4_proxy.md](./step5_4_proxy.md) |
| 5-5 | 演習：ネットワーク障害対応シミュレーション | EXERCISE | 120分 | [step5_5_exercise.md](./step5_5_exercise.md) |
| 5-6 | チェックポイント | QUIZ | 30分 | [step5_6_quiz.md](./step5_6_quiz.md) |

### Step 6: 最終試験：データ復旧ミッション（2時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 6-1 | 総合演習：データ復旧ミッション | EXERCISE | 90分 | [step6_1_final_exercise.md](./step6_1_final_exercise.md) |
| 6-2 | 卒業クイズ | QUIZ | 30分 | [step6_2_final_quiz.md](./step6_2_final_quiz.md) |

---

## 学習の流れ

```
Step 1 (2h)       Step 2 (4h)       Step 3 (4h)
[SQL基礎復習] → [JOIN攻略]    → [サブクエリ]
     ↓               ↓               ↓
Step 4 (2h)       Step 5 (6h)       Step 6 (2h)
[TCP/IP深堀]  → [NW障害対応]  → [卒業試験]
```

---

## 達成目標

このミッション完了後にできること：

- JOINを使って複数テーブルからデータを取得できる
- サブクエリやウィンドウ関数で複雑な分析ができる
- TCP/UDPの違いやポートの役割を説明できる
- ネットワーク障害を体系的に調査・解決できる
- SSL/TLS証明書の仕組みを理解している
