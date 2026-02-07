# 基本的なDockerコマンド

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 1
subStep: 4
title: "基本的なDockerコマンド"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Docker"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「理論はここまでにして、実際に手を動かしてみよう」
>
> 村上先輩がターミナルを開いた。
>
> 「まずは簡単なNginxコンテナを起動して、基本操作を覚えよう。
> コマンドを1つずつ打ちながら、何が起きているか確認していくんだ」
>
> 「わかりました。やってみます」
>
> 「最初は `docker run` だ。これが一番使うコマンドだよ」

---

## docker run - コンテナの起動

### 基本構文

```bash
docker run [オプション] イメージ名[:タグ] [コマンド]
```

### 最初のコンテナを起動する

```bash
# Nginx コンテナを起動（フォアグラウンド）
docker run nginx:1.25

# Ctrl+C で停止
```

### よく使うオプション

```bash
# バックグラウンドで起動（-d: detach）
docker run -d nginx:1.25

# ポートマッピング（-p: ホスト側ポート:コンテナ側ポート）
docker run -d -p 8080:80 nginx:1.25

# コンテナに名前をつける（--name）
docker run -d --name my-nginx -p 8080:80 nginx:1.25

# 環境変数を設定（-e）
docker run -d --name my-db -e MYSQL_ROOT_PASSWORD=secret mysql:8.0

# コンテナ停止時に自動削除（--rm）
docker run --rm -p 8080:80 nginx:1.25
```

### オプション一覧

| オプション | 説明 | 例 |
|-----------|------|-----|
| `-d` | バックグラウンドで起動 | `docker run -d nginx` |
| `-p` | ポートマッピング | `-p 8080:80` |
| `--name` | コンテナ名を指定 | `--name my-nginx` |
| `-e` | 環境変数を設定 | `-e NODE_ENV=production` |
| `--rm` | 停止時に自動削除 | `docker run --rm nginx` |
| `-v` | ボリュームをマウント | `-v /host/dir:/container/dir` |
| `-it` | 対話モード（ターミナル接続） | `docker run -it ubuntu bash` |
| `--network` | ネットワークを指定 | `--network my-net` |

---

## コンテナの管理コマンド

### コンテナの一覧表示

```bash
# 実行中のコンテナを表示
docker ps

# 全コンテナを表示（停止中も含む）
docker ps -a

# 出力例
CONTAINER ID   IMAGE        COMMAND                  CREATED        STATUS        PORTS                  NAMES
a1b2c3d4e5f6   nginx:1.25   "/docker-entrypoint.…"   5 minutes ago  Up 5 minutes  0.0.0.0:8080->80/tcp   my-nginx
```

### コンテナの停止・再起動・削除

```bash
# コンテナの停止（SIGTERMを送信、10秒後にSIGKILL）
docker stop my-nginx

# コンテナの再起動
docker restart my-nginx

# コンテナの削除（停止中のコンテナのみ）
docker rm my-nginx

# 強制削除（実行中でも停止して削除）
docker rm -f my-nginx

# 停止中の全コンテナを削除
docker container prune
```

---

## ログとプロセスの確認

### コンテナのログを確認

```bash
# ログを表示
docker logs my-nginx

# リアルタイムでログを監視（-f: follow）
docker logs -f my-nginx

# 直近10行のみ表示
docker logs --tail 10 my-nginx

# タイムスタンプ付きで表示
docker logs -t my-nginx
```

### コンテナ内のプロセスを確認

```bash
# コンテナ内で実行中のプロセスを表示
docker top my-nginx

# コンテナのリソース使用状況をリアルタイム表示
docker stats

# 特定のコンテナのリソース使用状況
docker stats my-nginx
```

---

## コンテナ内部への接続

### exec でコマンドを実行

```bash
# コンテナ内でコマンドを実行
docker exec my-nginx ls /usr/share/nginx/html

# コンテナにシェルで接続（対話モード）
docker exec -it my-nginx /bin/bash

# Alpine ベースの場合は sh を使う
docker exec -it my-nginx /bin/sh

# 接続を終了するには exit または Ctrl+D
```

### 実用例: デバッグ

```bash
# コンテナ内のファイルを確認
docker exec my-nginx cat /etc/nginx/nginx.conf

# コンテナ内のネットワーク設定を確認
docker exec my-nginx hostname -i

# コンテナ内の環境変数を確認
docker exec my-nginx env
```

---

## イメージの管理コマンド

```bash
# ローカルのイメージ一覧
docker images

# イメージの取得
docker pull node:20-alpine

# イメージの削除
docker rmi node:20-alpine

# 使われていないイメージを一括削除
docker image prune

# 全未使用リソースを一括削除（注意して使用）
docker system prune

# ディスク使用量の確認
docker system df
```

---

## よくある操作パターン

### パターン1: Web サーバーの起動

```bash
# Nginx を起動してブラウザで確認
docker run -d --name web -p 8080:80 nginx:1.25
# → http://localhost:8080 にアクセス
```

### パターン2: 対話的なデバッグ

```bash
# Ubuntu コンテナに入ってコマンドを試す
docker run -it --rm ubuntu:22.04 bash
# コンテナ内で自由にコマンドを実行
# exit で終了すると自動削除される
```

### パターン3: データベースの起動

```bash
# PostgreSQL を起動
docker run -d \
  --name my-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  postgres:16
```

---

## コマンド早見表

```
┌─────────────────────────────────────────────┐
│            Docker コマンド早見表               │
├──────────────┬──────────────────────────────┤
│ 起動・停止    │ run, start, stop, restart    │
│ 確認         │ ps, logs, top, stats, inspect│
│ 操作         │ exec, cp, rename             │
│ 削除         │ rm, container prune          │
│ イメージ     │ images, pull, push, rmi, tag │
│ システム     │ system df, system prune      │
└──────────────┴──────────────────────────────┘
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| docker run | コンテナの起動。-d, -p, --name が基本オプション |
| docker ps | 実行中コンテナの確認。-a で全コンテナ表示 |
| docker logs | コンテナのログ確認。-f でリアルタイム監視 |
| docker exec | コンテナ内でコマンド実行。-it で対話モード |
| docker images | ローカルイメージの管理 |

### チェックリスト

- [ ] docker run でコンテナを起動できる
- [ ] docker ps でコンテナの状態を確認できる
- [ ] docker logs でログを確認できる
- [ ] docker exec でコンテナ内部に接続できる
- [ ] docker stop / rm でコンテナを停止・削除できる

---

## 次のステップへ

次のセクションでは、Docker のボリュームとネットワークを学びます。
データの永続化とコンテナ間通信の仕組みを理解しましょう。

---

*推定読了時間: 30分*
