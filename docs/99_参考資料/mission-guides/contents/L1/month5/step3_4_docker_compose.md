# Docker Compose入門

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 3
subStep: 4
title: "Docker Compose入門"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "Docker"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「ここまでで1つのコンテナは完璧にできるようになった。でも実際のアプリケーションは
> Web サーバー、API、データベース、キャッシュ......複数のコンテナで構成されるよね」
>
> 村上先輩が前に見せた `docker run` コマンドの羅列を指差した。
>
> 「毎回これを手で打つのは現実的じゃない。Docker Compose を使えば、
> 複数のコンテナの構成を1つのYAMLファイルに定義して、一括管理できるんだ」
>
> 「YAMLファイル1つで全部起動できるんですか？」
>
> 「`docker compose up` の1コマンドだ。開発環境では必須のツールだよ」

---

## Docker Compose とは

複数のコンテナを定義・実行するためのツールです。`compose.yaml`（または `docker-compose.yml`）にサービスの構成を記述します。

---

## 基本的な compose.yaml

```yaml
# compose.yaml
services:
  # Web アプリケーション
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://app:secret@db:5432/myapp
    depends_on:
      - db
    volumes:
      - ./src:/app/src

  # データベース
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

---

## 基本コマンド

```bash
# 全サービスを起動（バックグラウンド）
docker compose up -d

# ログを表示
docker compose logs

# 特定のサービスのログ
docker compose logs -f app

# サービスの状態を確認
docker compose ps

# 全サービスを停止
docker compose down

# 全サービスを停止しボリュームも削除
docker compose down -v

# イメージを再ビルドして起動
docker compose up -d --build

# 特定のサービスだけ起動
docker compose up -d db

# サービス内でコマンドを実行
docker compose exec app sh
```

---

## 実践例: フルスタック構成

```yaml
# compose.yaml
services:
  # フロントエンド（React）
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
    environment:
      - REACT_APP_API_URL=http://localhost:8080

  # バックエンド（Express API）
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://app:secret@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    volumes:
      - ./api/src:/app/src

  # データベース（PostgreSQL）
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d myapp"]
      interval: 5s
      timeout: 5s
      retries: 5

  # キャッシュ（Redis）
  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - cache-data:/data

volumes:
  db-data:
  cache-data:
```

---

## 主要な設定項目

| 設定 | 説明 | 例 |
|-----|------|-----|
| `build` | Dockerfile のパスを指定 | `build: ./api` |
| `image` | 既存イメージを使用 | `image: postgres:16` |
| `ports` | ポートマッピング | `"8080:8080"` |
| `environment` | 環境変数 | `NODE_ENV: production` |
| `volumes` | ボリュームマウント | `./src:/app/src` |
| `depends_on` | 起動順序の制御 | `depends_on: [db]` |
| `healthcheck` | ヘルスチェック | `test: ["CMD", "curl", ...]` |
| `networks` | カスタムネットワーク | `networks: [frontend]` |
| `restart` | 再起動ポリシー | `restart: unless-stopped` |

---

## 環境変数の管理

```yaml
services:
  app:
    # 方法1: 直接記述
    environment:
      - NODE_ENV=production
      - PORT=3000

    # 方法2: .env ファイルから読み込み
    env_file:
      - .env
      - .env.local
```

`.env` ファイル:

```
DATABASE_URL=postgres://app:secret@db:5432/myapp
REDIS_URL=redis://cache:6379
SECRET_KEY=my-secret-key
```

---

## ネットワークの分離

```yaml
services:
  frontend:
    networks:
      - frontend-net

  api:
    networks:
      - frontend-net
      - backend-net

  db:
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:
```

```
frontend-net           backend-net
┌──────────────┐      ┌──────────────┐
│  frontend ←──┼──→ api ←──┼──→ db  │
└──────────────┘      └──────────────┘
 frontend は db に直接アクセスできない
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Docker Compose | 複数コンテナの構成を YAML で定義・管理 |
| 基本コマンド | `up -d`, `down`, `logs`, `ps`, `exec` |
| depends_on | サービスの起動順序を制御 |
| volumes | データの永続化と開発時のコード共有 |
| networks | サービス間のネットワーク分離 |

### チェックリスト

- [ ] compose.yaml の基本構造を理解した
- [ ] docker compose の基本コマンドを使える
- [ ] 複数サービスの構成を定義できる
- [ ] 環境変数の管理方法を理解した

---

## 次のステップへ

次のセクションでは、マルチステージビルドの演習に挑戦します。
TypeScript アプリケーションを最適化されたマルチステージビルドでコンテナ化しましょう。

---

*推定読了時間: 25分*
