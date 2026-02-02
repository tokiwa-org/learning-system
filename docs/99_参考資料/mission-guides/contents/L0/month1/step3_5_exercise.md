# 演習：ログファイルを分析しよう

## メタ情報

```yaml
mission: "初めてのターミナルを起動しよう"
step: 3
subStep: 5
title: "演習：ログファイルを分析しよう"
itemType: EXERCISE
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "OS基本コマンド"
  category: "IT基本"
  target_level: "L0"
```

---

## ストーリー

> 「実際の開発現場では、ログファイルを分析することが多いんだ」
>
> 「エラーを探したりするんですよね」
>
> 「そう！今日学んだコマンドを使って、サンプルログを分析してみよう」

---

## 準備：サンプルログの作成

```bash
cd ~
mkdir log-analysis
cd log-analysis

# サンプルログを作成
cat > access.log << 'EOF'
2026-01-27 09:00:01 INFO  User login: user001
2026-01-27 09:00:15 INFO  Page view: /home
2026-01-27 09:01:02 WARN  Slow query: 2.5s
2026-01-27 09:01:30 INFO  User login: user002
2026-01-27 09:02:00 ERROR Database connection failed
2026-01-27 09:02:05 INFO  Retry connection
2026-01-27 09:02:10 INFO  Connection restored
2026-01-27 09:03:00 INFO  Page view: /products
2026-01-27 09:03:30 INFO  Page view: /cart
2026-01-27 09:04:00 WARN  High memory usage: 85%
2026-01-27 09:04:30 INFO  User logout: user001
2026-01-27 09:05:00 ERROR Payment processing failed
2026-01-27 09:05:30 INFO  Payment retry successful
2026-01-27 09:06:00 INFO  Order completed: #12345
2026-01-27 09:06:30 INFO  User login: user003
2026-01-27 09:07:00 INFO  Page view: /home
2026-01-27 09:07:30 WARN  API rate limit warning
2026-01-27 09:08:00 INFO  Page view: /about
2026-01-27 09:08:30 INFO  User logout: user002
2026-01-27 09:09:00 ERROR File not found: /old-page
EOF

echo "サンプルログを作成しました"
```

---

## Mission 1: ログの概要を把握

### タスク 1-1: ログの行数を数える

ログファイルは何行ありますか？

<details>
<summary>💡 ヒント</summary>

```bash
wc -l access.log
```

</details>

<details>
<summary>📝 解答</summary>

```bash
wc -l access.log
```

答え: **20行**

</details>

---

### タスク 1-2: 先頭5行を確認

ログの最初の5行を表示してください。

<details>
<summary>📝 解答</summary>

```bash
head -n 5 access.log
```

</details>

---

### タスク 1-3: 末尾5行を確認

ログの最後の5行を表示してください。

<details>
<summary>📝 解答</summary>

```bash
tail -n 5 access.log
```

</details>

---

## Mission 2: エラーを探す

### タスク 2-1: ERRORを含む行を表示

`ERROR` という文字を含む行をすべて表示してください。

<details>
<summary>💡 ヒント</summary>

`grep` コマンドを使います（次のステップで詳しく学びます）。

```bash
grep "ERROR" access.log
```

</details>

<details>
<summary>📝 解答</summary>

```bash
grep "ERROR" access.log
```

出力：
```
2026-01-27 09:02:00 ERROR Database connection failed
2026-01-27 09:05:00 ERROR Payment processing failed
2026-01-27 09:09:00 ERROR File not found: /old-page
```

</details>

---

### タスク 2-2: エラーの数を数える

エラーは何件ありますか？

<details>
<summary>📝 解答</summary>

```bash
grep "ERROR" access.log | wc -l
```

答え: **3件**

</details>

---

### タスク 2-3: 警告の数を数える

`WARN` を含む行は何件ありますか？

<details>
<summary>📝 解答</summary>

```bash
grep "WARN" access.log | wc -l
```

答え: **3件**

</details>

---

## Mission 3: ログをページャで閲覧

### タスク 3-1: lessで開く

ログファイルを `less` で開き、以下の操作を行ってください。

1. 末尾にジャンプ（`G`）
2. 先頭に戻る（`g`）
3. "ERROR" を検索（`/ERROR`）
4. 次のERRORへ（`n`）
5. 終了（`q`）

<details>
<summary>📝 解答</summary>

```bash
less access.log
# G で末尾へ
# g で先頭へ
# /ERROR で検索
# n で次のエラーへ
# q で終了
```

</details>

---

## Mission 4: ログの比較

### タスク 4-1: 新しいログを作成

```bash
# 変更版のログを作成
cat > access_new.log << 'EOF'
2026-01-27 09:00:01 INFO  User login: user001
2026-01-27 09:00:15 INFO  Page view: /home
2026-01-27 09:01:02 WARN  Slow query: 3.0s
2026-01-27 09:01:30 INFO  User login: user002
2026-01-27 09:02:00 INFO  Database connection OK
2026-01-27 09:03:00 INFO  Page view: /products
EOF
```

### タスク 4-2: 差分を確認

元のログ（先頭6行）と新しいログの差分を表示してください。

<details>
<summary>📝 解答</summary>

```bash
head -n 6 access.log > original_head.txt
diff original_head.txt access_new.log
```

または

```bash
diff <(head -n 6 access.log) access_new.log
```

</details>

---

## Mission 5: 統計を取る

### タスク 5-1: ログレベル別にカウント

INFO、WARN、ERROR それぞれ何件あるか確認してください。

<details>
<summary>📝 解答</summary>

```bash
grep "INFO" access.log | wc -l   # INFO: 14件
grep "WARN" access.log | wc -l   # WARN: 3件
grep "ERROR" access.log | wc -l  # ERROR: 3件
```

</details>

---

### タスク 5-2: ユーザーログイン回数

"User login" を含む行は何件ありますか？

<details>
<summary>📝 解答</summary>

```bash
grep "User login" access.log | wc -l
```

答え: **3件**

</details>

---

## 達成度チェック

| Mission | タスク | 完了 |
|---------|--------|------|
| 1 | ログの行数を数える | □ |
| 1 | 先頭5行を確認 | □ |
| 1 | 末尾5行を確認 | □ |
| 2 | ERRORを含む行を表示 | □ |
| 2 | エラーの数を数える | □ |
| 3 | lessで操作 | □ |
| 4 | 差分を確認 | □ |
| 5 | ログレベル別にカウント | □ |

**6個以上クリア** → 合格！

---

## クリーンアップ

```bash
cd ~
rm -r log-analysis
rm -r cat-practice
```

---

## まとめ

この演習で使ったコマンド：

| コマンド | 用途 |
|----------|------|
| `wc -l` | 行数を数える |
| `head -n N` | 先頭N行を表示 |
| `tail -n N` | 末尾N行を表示 |
| `less` | ページャで閲覧 |
| `grep` | パターン検索 |
| `diff` | 差分表示 |

---

## 次のステップへ

ログ分析の演習お疲れさまでした！

次のセクションでは、Step 3の理解度チェックです。
クイズに挑戦して、学んだことを振り返りましょう！

---

*推定所要時間: 60分*
