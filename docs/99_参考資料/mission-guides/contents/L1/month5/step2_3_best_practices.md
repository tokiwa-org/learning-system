# ベストプラクティス

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 2
subStep: 3
title: "ベストプラクティス"
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

> 「キャッシュの使い方はわかった。次は、本番環境で使えるDockerfileの書き方を教えよう」
>
> 村上先輩が過去の障害報告書を見せた。
>
> 「去年、あるチームのコンテナが root で動いていて、脆弱性を突かれてホストまで侵入された。
> また別のチームは、イメージが2GBもあってデプロイに10分以上かかっていた」
>
> 「ベストプラクティスを守るだけで、そういう問題を防げるんですね」
>
> 「その通り。セキュリティ、サイズ、保守性。この3つの観点で Dockerfile を書こう」

---

## 1. 軽量なベースイメージを使う

### ベースイメージの比較

| ベースイメージ | サイズ | 特徴 |
|-------------|-------|------|
| `node:20` | ~1.1GB | フル機能、デバッグに便利 |
| `node:20-slim` | ~243MB | 不要なパッケージを削除 |
| `node:20-alpine` | ~181MB | Alpine Linux ベース、最軽量 |

```dockerfile
# 推奨: 本番用は alpine または slim を使う
FROM node:20-alpine
```

### Alpine の注意点

- パッケージマネージャが `apk`（apt ではない）
- 一部のネイティブモジュールで追加の依存が必要な場合がある
- musl libc を使用（glibc ではない）

```dockerfile
# Alpine で追加パッケージが必要な場合
FROM node:20-alpine
RUN apk add --no-cache python3 make g++
```

---

## 2. 非 root ユーザーで実行する

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# 非 root ユーザーを作成
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# 非 root ユーザーに切り替え
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
```

**なぜ重要か**: root で実行すると、コンテナの脆弱性が悪用された場合にホスト全体が危険にさらされる可能性があります。

---

## 3. RUN 命令を最適化する

### 不要なパッケージキャッシュを削除

```dockerfile
# 悪い例: キャッシュが残りイメージが大きくなる
RUN apt-get update
RUN apt-get install -y curl

# 良い例: インストールとキャッシュ削除を1つの RUN にまとめる
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*
```

### Alpine の場合

```dockerfile
RUN apk add --no-cache curl
# --no-cache で apk のキャッシュを保持しない
```

---

## 4. COPY を効率的に使う

```dockerfile
# 悪い例: 不要なファイルもコピーされる
COPY . .

# 良い例: 必要なファイルだけコピー
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY src/ ./src/
```

---

## 5. npm ci を使う（Node.js の場合）

```dockerfile
# 悪い例: npm install はバージョン変動の可能性がある
RUN npm install

# 良い例: npm ci は package-lock.json に厳密に従う
RUN npm ci --only=production
```

| コマンド | 特徴 |
|---------|------|
| `npm install` | package.json に基づきインストール。lock ファイルを更新する場合がある |
| `npm ci` | package-lock.json に厳密に従う。CI/CD 環境に最適 |

---

## 6. HEALTHCHECK を設定する

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
```

| オプション | 説明 | デフォルト |
|-----------|------|----------|
| --interval | チェック間隔 | 30s |
| --timeout | タイムアウト | 30s |
| --start-period | 起動猶予期間 | 0s |
| --retries | 失敗許容回数 | 3 |

---

## 7. LABEL でメタデータを付与する

```dockerfile
LABEL maintainer="team@example.com"
LABEL version="1.0.0"
LABEL description="My web application"
LABEL org.opencontainers.image.source="https://github.com/myorg/myapp"
```

---

## 8. 本番と開発を分ける

```dockerfile
# 開発環境用
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# 本番環境用
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
USER node
CMD ["node", "server.js"]
```

```bash
# 開発用のビルド
docker build --target development -t my-app:dev .

# 本番用のビルド
docker build --target production -t my-app:prod .
```

---

## チェックリスト形式のベストプラクティス

```
┌─────────────────────────────────────────────────┐
│        Dockerfile ベストプラクティス               │
├─────────────────────────────────────────────────┤
│ [ ] 軽量なベースイメージ（alpine/slim）を使う      │
│ [ ] 非 root ユーザーで実行する                    │
│ [ ] RUN を && でまとめてレイヤー数を減らす          │
│ [ ] パッケージキャッシュを削除する                  │
│ [ ] npm ci を使う（Node.js）                     │
│ [ ] COPY は必要なファイルだけ                     │
│ [ ] HEALTHCHECK を設定する                       │
│ [ ] LABEL でメタデータを付与する                   │
│ [ ] .dockerignore を設定する（次セクション）       │
│ [ ] シークレットをイメージに含めない               │
└─────────────────────────────────────────────────┘
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| ベースイメージ | alpine / slim を使用してサイズを削減 |
| セキュリティ | 非 root ユーザー、シークレットを含めない |
| 最適化 | RUN をまとめる、キャッシュを削除する |
| 保守性 | LABEL、HEALTHCHECK、npm ci の使用 |

### チェックリスト

- [ ] 軽量なベースイメージを選択できる
- [ ] 非 root ユーザーでの実行を設定できる
- [ ] RUN 命令を最適化して書ける
- [ ] HEALTHCHECK を設定できる

---

## 次のステップへ

次のセクションでは、`.dockerignore` ファイルの書き方とセキュリティについて学びます。
不要なファイルを除外してイメージを安全にしましょう。

---

*推定読了時間: 30分*
