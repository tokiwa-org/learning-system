# 演習：マルチステージビルドで本番イメージを作ろう

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 3
subStep: 5
title: "演習：マルチステージビルドで本番イメージを作ろう"
itemType: EXERCISE
estimatedMinutes: 45
noiseLevel: MINIMAL
roadmap:
  skill: "Docker"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「さて、最終課題だ。TypeScript で書かれた API サーバーと React フロントエンドを
> マルチステージビルドでコンテナ化してほしい」
>
> 村上先輩が要件書を渡した。
>
> 「本番用のイメージは可能な限り小さく。そして Docker Compose で
> フロント、API、データベースをまとめて起動できるようにしてくれ」
>
> 「了解です。マルチステージビルドとCompose、全部使いますね」

---

## 演習の概要

TypeScript Express API と React フロントエンドをマルチステージビルドでコンテナ化し、Docker Compose でオーケストレーションしてください。

---

## 課題1: API サーバーのマルチステージビルド（20分）

### アプリケーション構成

```
api/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── users.ts
│   └── types/
│       └── user.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

### package.json

```json
{
  "name": "api-server",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "ts-node-dev": "^2.0.0"
  }
}
```

**要件:**
- ステージ1（builder）: TypeScript をコンパイルして `dist/` を生成
- ステージ2（production）: `node:20-alpine` で本番依存のみインストール、`dist/` をコピー
- 非 root ユーザーで実行
- HEALTHCHECK を設定
- 最終イメージサイズを 200MB 以下に

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```dockerfile
# ステージ1: ビルド
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# ステージ2: 本番
FROM node:20-alpine AS production

LABEL maintainer="team@example.com"

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --only=production && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["node", "dist/index.js"]
```

</details>

---

## 課題2: Docker Compose でフルスタック構成（25分）

API、データベース、そして Nginx リバースプロキシを Docker Compose でまとめてください。

**要件:**
- `api` サービス: 課題1の Dockerfile でビルド
- `db` サービス: PostgreSQL 16、ヘルスチェック付き
- `nginx` サービス: リバースプロキシとして API に転送
- ボリュームで DB データを永続化
- `api` は `db` の healthcheck が通ってから起動

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

**compose.yaml:**

```yaml
services:
  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      target: production
    environment:
      - NODE_ENV=production
      - PORT=8080
      - DATABASE_URL=postgres://app:secret@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d myapp"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  db-data:
```

**nginx/default.conf:**

```nginx
upstream api_server {
    server api:8080;
}

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://api_server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

</details>

---

## 動作確認

```bash
# 全サービスを起動
docker compose up -d --build

# サービスの状態確認
docker compose ps

# API の動作確認
curl http://localhost/health

# ログの確認
docker compose logs -f api

# イメージサイズの確認
docker images | grep api

# クリーンアップ
docker compose down -v
```

---

## 達成度チェック

| 課題 | 完了 |
|------|------|
| API のマルチステージビルド | [ ] |
| Docker Compose 構成 | [ ] |
| 全サービスが起動する | [ ] |
| API が応答する | [ ] |
| イメージサイズが200MB以下 | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| マルチステージビルド | TypeScript のビルドと本番実行環境を分離 |
| Docker Compose | 複数サービスを1つのファイルで管理 |
| ヘルスチェック連携 | depends_on + condition で起動順序を制御 |
| サイズ最適化 | alpine + production のみで 200MB 以下を達成 |

### チェックリスト

- [ ] マルチステージビルドの Dockerfile を書けた
- [ ] Docker Compose で複数サービスを定義できた
- [ ] ヘルスチェックと起動順序を設定できた
- [ ] 動作確認を完了した

---

## 次のステップへ

次のセクションでは、Step 3 のチェックポイントクイズに挑戦します。

---

*推定所要時間: 45分*
