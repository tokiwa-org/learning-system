# ビルダーパターン

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 3
subStep: 2
title: "ビルダーパターン"
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

> 「マルチステージビルドの基本はわかったか？」
>
> 「はい。ビルド用と本番用を分ければいいんですよね」
>
> 村上先輩が付け加えた。
>
> 「それだけじゃない。言語やフレームワークによって、最適なパターンがある。
> Go のようなコンパイル言語なら、最終イメージにランタイムすら不要だ。
> フロントエンドなら、ビルド成果物を Nginx で配信するパターンが定番だ。
> いくつかのパターンを覚えておこう」

---

## パターン1: Go アプリケーション

Go はコンパイル言語なので、バイナリだけを最終イメージにコピーできます。

```dockerfile
# ビルドステージ
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

# 静的リンクされたバイナリを作成
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# 本番ステージ（scratch = 空のイメージ）
FROM scratch

COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080
ENTRYPOINT ["/server"]
```

```
ビルドステージ: ~500MB (Go ツールチェーン + ソースコード)
    ↓
本番イメージ: ~10MB (バイナリのみ)
```

### distroless イメージ

`scratch` は最小限ですが、デバッグが難しいため Google の distroless イメージを使う選択肢もあります。

```dockerfile
FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/server /server
ENTRYPOINT ["/server"]
```

---

## パターン2: フロントエンド（React/Vue）

フロントエンドアプリをビルドし、静的ファイルを Nginx で配信するパターンです。

```dockerfile
# ステージ1: ビルド
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ステージ2: Nginx で配信
FROM nginx:1.25-alpine

# カスタム Nginx 設定
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ビルド成果物をコピー
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```
ビルドステージ: ~500MB (Node.js + 依存パッケージ)
    ↓
本番イメージ: ~25MB (Nginx + 静的ファイル)
```

### nginx.conf の例

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api:3000;
    }
}
```

---

## パターン3: Python（FastAPI）

```dockerfile
# ステージ1: 依存パッケージのインストール
FROM python:3.12-slim AS builder

WORKDIR /app
RUN pip install --no-cache-dir poetry
COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

# ステージ2: 本番イメージ
FROM python:3.12-slim

WORKDIR /app

COPY --from=builder /app/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

RUN useradd -m appuser
USER appuser

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## パターン4: テストを含むパイプライン

ビルドの中にテスト実行を含めることで、テストが通らなければイメージが作成されません。

```dockerfile
# ステージ1: 依存パッケージ
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ステージ2: テスト
FROM deps AS test
COPY . .
RUN npm run lint
RUN npm run test

# ステージ3: ビルド
FROM deps AS builder
COPY . .
RUN npm run build

# ステージ4: 本番
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
CMD ["node", "dist/server.js"]
```

```bash
# テストまで実行
docker build --target test -t my-app:test .

# 本番イメージのビルド（テストが通った後のビルド成果物を使用）
docker build --target production -t my-app:prod .
```

---

## 各パターンのサイズ比較

| パターン | ビルドステージ | 本番イメージ | 削減率 |
|---------|-------------|------------|--------|
| Go + scratch | ~500MB | ~10MB | 98% |
| React + Nginx | ~500MB | ~25MB | 95% |
| Node.js + Alpine | ~800MB | ~150MB | 81% |
| Python + slim | ~400MB | ~200MB | 50% |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Go パターン | コンパイルしてバイナリだけをコピー。scratch も使える |
| フロントエンド | ビルドして静的ファイルを Nginx で配信 |
| Python | poetry/pip でエクスポートして slim イメージで実行 |
| テスト統合 | ビルドパイプライン内にテストステージを含める |

### チェックリスト

- [ ] Go アプリのマルチステージビルドパターンを理解した
- [ ] フロントエンドの Nginx 配信パターンを理解した
- [ ] テストをビルドパイプラインに統合する方法を理解した
- [ ] 言語ごとの最適なパターンを選択できる

---

## 次のステップへ

次のセクションでは、イメージサイズのさらなる最適化テクニックを学びます。

---

*推定読了時間: 25分*
