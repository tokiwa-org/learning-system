# プロセス管理を理解しよう

## メタ情報

```yaml
mission: "開発環境の支配者となろう"
step: 1
subStep: 4
title: "プロセス管理を理解しよう"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "OS"
  category: "IT基本"
  target_level: "L1"
```

---

## ストーリー

> 開発作業中、ターミナルに `npm run dev` と打ち込むと、開発サーバーが起動した。
>
> しかし、ターミナルがサーバーのログで埋まって他のコマンドが打てない。
>
> 「先輩、ターミナルが使えなくなりました...」
>
> 佐藤先輩が画面を見て答える。
>
> 「プロセスの扱い方を知らないとそうなる。
> フォアグラウンドとバックグラウンド、プロセスの生死を管理できるようになれば、
> ターミナル1つで複数の作業を同時にこなせるようになるぞ」

---

## プロセスとは

プロセスとは、実行中のプログラムのことです。コマンドを打つたびにプロセスが生成されます。

```bash
# 現在の自分のシェルのプロセスIDを確認
echo $$

# 現在動いているプロセス一覧（自分のプロセス）
ps

# 全ユーザーの全プロセス
ps aux
```

### ps aux の出力の読み方

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 169936 13092 ?        Ss   10:00   0:01 /sbin/init
tanaka    1234  1.2  2.5 598000 52000 pts/0    Sl   10:05   0:30 node server.js
```

| 列 | 意味 |
|-----|------|
| USER | プロセスの所有者 |
| PID | プロセスID（一意の番号） |
| %CPU | CPU使用率 |
| %MEM | メモリ使用率 |
| STAT | プロセスの状態 |
| COMMAND | 実行中のコマンド |

---

## top / htop -- リアルタイムモニタリング

### top

```bash
# リアルタイムでプロセスを監視
top
```

`top` の操作キー：

| キー | 動作 |
|------|------|
| `q` | 終了 |
| `M` | メモリ使用量でソート |
| `P` | CPU使用量でソート |
| `k` | プロセスを kill |
| `1` | CPU別に表示 |

### htop（推奨）

`htop` は `top` の高機能版です。色分けされたUIで直感的に操作できます。

```bash
# インストール（まだの場合）
sudo apt install htop    # Ubuntu/Debian
brew install htop        # macOS

# 起動
htop
```

---

## フォアグラウンドとバックグラウンド

### フォアグラウンドプロセス

通常のコマンド実行はフォアグラウンドで動作します。
ターミナルを占有し、完了するまで次のコマンドが打てません。

```bash
# フォアグラウンドで実行（ターミナルを占有）
npm run dev
# → Ctrl+C で停止するまで他のコマンドが打てない
```

### バックグラウンドプロセス（`&`）

コマンドの末尾に `&` をつけると、バックグラウンドで実行されます。

```bash
# バックグラウンドで実行
npm run dev &
# [1] 12345  ← ジョブ番号とPIDが表示される

# バックグラウンドで実行し、出力を捨てる
npm run dev > /dev/null 2>&1 &
```

### jobs -- バックグラウンドジョブの一覧

```bash
jobs
# [1]+  Running    npm run dev &
# [2]-  Stopped    vim config.js
```

### fg / bg -- フォアグラウンドとバックグラウンドの切り替え

```bash
# Ctrl+Z でフォアグラウンドのプロセスを一時停止
npm run dev
# → Ctrl+Z で停止
# [1]+  Stopped    npm run dev

# バックグラウンドで再開
bg %1

# フォアグラウンドに戻す
fg %1
```

### 実践的なワークフロー

```bash
# 1. 開発サーバーをバックグラウンドで起動
npm run dev > server.log 2>&1 &

# 2. 別の作業を行う
git status
vim src/app.js

# 3. サーバーのログを確認したい時
tail -f server.log

# 4. サーバーを停止したい時
fg %1    # フォアグラウンドに戻して
# Ctrl+C  # 停止
```

---

## kill -- プロセスを停止する

### 基本的な使い方

```bash
# PIDを指定して停止（SIGTERM: 正常終了要求）
kill 12345

# 強制終了（SIGKILL: 即座に強制停止）
kill -9 12345

# プロセス名で停止
pkill node

# パターンマッチで停止
pkill -f "npm run dev"
```

### 主なシグナル

| シグナル | 番号 | 意味 |
|---------|------|------|
| SIGTERM | 15 | 正常な終了要求（デフォルト） |
| SIGKILL | 9 | 強制終了（プロセスが処理できない） |
| SIGSTOP | 19 | 一時停止（Ctrl+Z相当） |
| SIGCONT | 18 | 再開 |
| SIGHUP | 1 | 接続が切れた場合の終了 |

### 使い分けの指針

```bash
# まず正常終了を試みる
kill 12345

# 数秒待っても止まらなければ強制終了
kill -9 12345
```

> **注意**: `kill -9` は最終手段です。プロセスにクリーンアップの機会を与えないため、
> データの破損やリソースリークの原因になる場合があります。

---

## nohup -- ログアウト後もプロセスを続行

通常、ターミナルを閉じるとバックグラウンドプロセスも終了します。
`nohup` を使うと、ログアウト後もプロセスが続行されます。

```bash
# ログアウトしても動き続けるプロセス
nohup npm run build &

# 出力ファイルを指定
nohup ./long-running-task.sh > task.log 2>&1 &
```

### 実践例

```bash
# リモートサーバーで長時間タスクを実行
ssh server.example.com
nohup python3 data_processing.py > process.log 2>&1 &
exit  # SSH接続を切っても処理は続行
```

---

## 特定のポートを使っているプロセスの調査

開発中、「ポートが使用中」というエラーに遭遇することがよくあります。

```bash
# ポート3000を使っているプロセスを調査
lsof -i :3000

# ポート3000を使っているプロセスを停止
lsof -ti :3000 | xargs kill

# netstat で確認（Linux）
netstat -tlnp | grep :3000

# ss で確認（Linux、netstat の後継）
ss -tlnp | grep :3000
```

---

## 実践シナリオ：開発環境の管理

日常的な開発で使うプロセス管理のワークフロー例です。

```bash
# 1. フロントエンドサーバー起動
npm run dev > frontend.log 2>&1 &
echo "Frontend PID: $!"

# 2. バックエンドサーバー起動
cd backend && npm start > ../backend.log 2>&1 &
echo "Backend PID: $!"

# 3. ジョブ確認
jobs

# 4. ログのリアルタイム監視
tail -f frontend.log backend.log

# 5. 全プロセスの停止
jobs -p | xargs kill
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ps / top / htop | プロセスの確認・監視 |
| `&` | バックグラウンド実行 |
| Ctrl+Z / bg / fg | フォア/バック切り替え |
| kill / pkill | プロセスの停止 |
| nohup | ログアウト後も続行 |
| lsof -i | ポートを使用しているプロセスの調査 |

### チェックリスト

- [ ] ps aux でプロセス一覧を確認できる
- [ ] コマンドをバックグラウンドで実行できる
- [ ] fg / bg でプロセスの切り替えができる
- [ ] kill でプロセスを停止できる
- [ ] ポートを使用しているプロセスを調査できる

---

## 次のステップへ

プロセスを思い通りに操れるようになりましたね。

次のセクションでは、環境変数とPATHの設定を学びます。
`.bashrc` や `.zshrc` をカスタマイズして、自分だけの効率的な開発環境を作り上げましょう。

---

*推定読了時間: 25分*
