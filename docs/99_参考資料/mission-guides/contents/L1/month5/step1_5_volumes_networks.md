# Dockerボリュームとネットワーク

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 1
subStep: 5
title: "Dockerボリュームとネットワーク"
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

> 「Dockerコマンドは使えるようになった？」
>
> 「はい、コンテナの起動と停止はバッチリです。でも1つ心配なことがあって......
> コンテナを削除したら、中のデータも消えちゃいますよね？データベースとか大丈夫ですか？」
>
> 村上先輩は満足げに頷いた。
>
> 「いい着眼点だ。コンテナは使い捨てが前提だから、データの永続化には"ボリューム"を使う。
> あと、複数のコンテナが連携するとき、コンテナ同士がどう通信するかも知っておく必要がある。
> 今日はこの2つを学ぼう」

---

## ボリューム（Volume）

### なぜボリュームが必要か

コンテナの書き込み可能レイヤーにデータを保存すると、コンテナの削除とともにデータも失われます。

```
コンテナ削除前:                コンテナ削除後:
┌─────────────────┐
│ 書き込みレイヤー   │  → 削除 → データ消失
│ (データベースファイル)│
├─────────────────┤
│ イメージレイヤー   │  → イメージは残る
└─────────────────┘
```

ボリュームを使えば、データをコンテナの外に保存できます。

### 3つのデータ管理方法

```
┌──────────────────────────────────────────────┐
│                  ホスト OS                     │
│                                              │
│  /var/lib/docker/volumes/    /home/user/data/ │
│  ┌──────────────┐           ┌──────────────┐ │
│  │   Volume      │           │  Bind Mount  │ │
│  │(Docker管理)    │           │(ホストのDir)  │ │
│  └──────┬───────┘           └──────┬───────┘ │
│         │                          │          │
│  ┌──────┴──────────────────────────┴───────┐ │
│  │           コンテナ                        │ │
│  │   /data       /app/data                 │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  tmpfs: メモリ上に一時的に保存                   │
└──────────────────────────────────────────────┘
```

| 方法 | 特徴 | 用途 |
|------|------|------|
| Volume | Dockerが管理。ホストの場所を意識しなくてよい | データベース、永続データ |
| Bind Mount | ホストのディレクトリをマウント | 開発時のソースコード共有 |
| tmpfs | メモリ上に保存。コンテナ停止で消える | 一時的な機密データ |

### Volume の操作

```bash
# ボリュームの作成
docker volume create my-data

# ボリューム一覧
docker volume ls

# ボリュームの詳細情報
docker volume inspect my-data

# ボリュームをマウントしてコンテナを起動
docker run -d \
  --name my-postgres \
  -v my-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16

# コンテナを削除してもデータは残る
docker rm -f my-postgres

# 同じボリュームで新しいコンテナを起動 → データが引き継がれる
docker run -d \
  --name my-postgres-2 \
  -v my-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16

# ボリュームの削除
docker volume rm my-data

# 使われていないボリュームを一括削除
docker volume prune
```

### Bind Mount の操作

```bash
# 開発時: ホストのソースコードをコンテナにマウント
docker run -d \
  --name dev-app \
  -v $(pwd)/src:/app/src \
  -p 3000:3000 \
  node:20-alpine \
  sh -c "cd /app && npm start"

# ホスト側でファイルを編集 → コンテナ内に即反映
```

---

## ネットワーク（Network）

### Docker のネットワークドライバ

| ドライバ | 説明 | 用途 |
|---------|------|------|
| bridge | デフォルト。コンテナ間の独立したネットワーク | 単一ホストでのコンテナ間通信 |
| host | ホストのネットワークを直接使用 | パフォーマンスが重要な場合 |
| none | ネットワークなし | セキュリティ隔離 |
| overlay | 複数ホスト間のネットワーク | Docker Swarm / Kubernetes |

### デフォルトの bridge ネットワーク

```bash
# デフォルトネットワークの確認
docker network ls

# 出力例
NETWORK ID     NAME      DRIVER    SCOPE
abc123def456   bridge    bridge    local
bcd234efg567   host      host      local
cde345fgh678   none      null      local
```

### ユーザー定義ネットワーク

ユーザー定義の bridge ネットワークでは、**コンテナ名で通信**できます。

```bash
# ネットワークの作成
docker network create app-network

# コンテナをネットワークに接続して起動
docker run -d \
  --name app-db \
  --network app-network \
  -e POSTGRES_PASSWORD=secret \
  postgres:16

docker run -d \
  --name app-server \
  --network app-network \
  -p 3000:3000 \
  -e DATABASE_URL=postgres://postgres:secret@app-db:5432/postgres \
  my-app:latest

# app-server から app-db にコンテナ名でアクセスできる
# → postgres://postgres:secret@app-db:5432/postgres
```

### ネットワークの管理

```bash
# ネットワーク一覧
docker network ls

# ネットワークの詳細情報（接続中のコンテナを確認）
docker network inspect app-network

# 既存コンテナをネットワークに接続
docker network connect app-network my-container

# ネットワークから切断
docker network disconnect app-network my-container

# ネットワークの削除
docker network rm app-network
```

---

## 実践例：Web + DB 構成

フロントエンド（Nginx）とバックエンド（Node.js）とデータベース（PostgreSQL）を接続する例です。

```bash
# ネットワークとボリュームの作成
docker network create webapp-net
docker volume create db-data

# PostgreSQL を起動
docker run -d \
  --name db \
  --network webapp-net \
  -v db-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=webapp \
  postgres:16

# Node.js アプリを起動
docker run -d \
  --name api \
  --network webapp-net \
  -e DATABASE_URL=postgres://app:secret@db:5432/webapp \
  my-api:latest

# Nginx をリバースプロキシとして起動
docker run -d \
  --name web \
  --network webapp-net \
  -p 80:80 \
  my-nginx:latest
```

```
┌──────────────────────────────────────────┐
│           webapp-net ネットワーク           │
│                                          │
│  ┌──────┐    ┌──────┐    ┌──────────┐   │
│  │ web  │───→│ api  │───→│    db    │   │
│  │:80   │    │:3000 │    │  :5432   │   │
│  └──────┘    └──────┘    └──────────┘   │
│                              │          │
│                         ┌────┴─────┐    │
│                         │ db-data  │    │
│                         │(Volume)  │    │
│                         └──────────┘    │
└──────────────────────────────────────────┘
      ↑
   ポート80をホストに公開
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Volume | Docker管理の永続ストレージ。コンテナ削除後もデータが残る |
| Bind Mount | ホストのディレクトリをコンテナにマウント。開発時に便利 |
| bridge ネットワーク | コンテナ間通信のデフォルト。ユーザー定義ならコンテナ名で通信可能 |
| ネットワーク設計 | 関連するコンテナを同じネットワークに接続する |

### チェックリスト

- [ ] Volume と Bind Mount の違いを理解した
- [ ] Volume を使ったデータの永続化ができる
- [ ] ユーザー定義ネットワークでコンテナ間通信ができる
- [ ] Web + DB 構成の基本パターンを理解した

---

## 次のステップへ

次のセクションでは、Step 1 の理解度チェッククイズに挑戦します。
Docker の基本知識が身についているか確認しましょう。

---

*推定読了時間: 30分*
