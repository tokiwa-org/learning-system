# イメージサイズの最適化

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 3
subStep: 3
title: "イメージサイズの最適化"
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

> 「マルチステージビルドでかなり小さくなったけど、もっと最適化できる」
>
> 村上先輩が `docker images` と `docker history` の結果を比較した。
>
> 「イメージの各レイヤーのサイズを見ると、まだ削れるところがある。
> 本番環境ではイメージサイズがそのままデプロイ速度に直結するから、
> 1MBでも小さくする意識が大切だ」

---

## 最適化テクニック一覧

### 1. 不要なファイルを削除する

```dockerfile
# 悪い例: パッケージキャッシュが残る
RUN apt-get update && apt-get install -y curl

# 良い例: キャッシュを削除してレイヤーサイズを抑える
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*
```

### 2. レイヤー数を最小限にする

```dockerfile
# 悪い例: 4つのレイヤーが作られる
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN rm -rf /var/lib/apt/lists/*

# 良い例: 1つのレイヤーにまとめる
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl \
      git && \
    rm -rf /var/lib/apt/lists/*
```

**注意**: レイヤーをまとめすぎるとキャッシュの粒度が荒くなります。変更頻度が異なるものは適切に分けましょう。

### 3. .dockerignore で不要ファイルを除外する

ビルドコンテキストから除外することで、`COPY . .` でコピーされるファイルを減らします。

### 4. 本番用の依存パッケージのみインストール

```dockerfile
# Node.js: devDependencies を除外
RUN npm ci --only=production

# Python: 本番用のみ
RUN pip install --no-cache-dir -r requirements.txt
```

### 5. 適切なベースイメージを選択する

```
node:20          1.1GB   (Debian ベース、フル機能)
node:20-slim     243MB   (Debian ベース、最小限)
node:20-alpine   181MB   (Alpine ベース、最軽量)
```

---

## イメージ分析ツール

### docker history

```bash
$ docker history my-app:latest --no-trunc

IMAGE       CREATED BY                                      SIZE
abc123...   CMD ["node" "dist/server.js"]                   0B
bcd234...   COPY dir:abc123... in /app/dist                 2.1MB
cde345...   RUN /bin/sh -c npm ci --only=production...      45.2MB
def456...   COPY file:abc123... in /app/                    2.3KB
efg567...   WORKDIR /app                                    0B
fgh678...   /bin/sh -c #(nop) CMD ["node"]                  0B
```

### docker system df

```bash
$ docker system df

TYPE            TOTAL   ACTIVE  SIZE      RECLAIMABLE
Images          15      5       3.2GB     2.1GB (65%)
Containers      8       3       120MB     80MB (66%)
Local Volumes   5       3       500MB     200MB (40%)
Build Cache     20      0       1.5GB     1.5GB (100%)
```

### dive（サードパーティツール）

```bash
# イメージの各レイヤーを視覚的に調査
dive my-app:latest

# CI でイメージの効率性をチェック
CI=true dive my-app:latest
```

---

## 最適化のビフォーアフター

### Before: 最適化前

```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/server.js"]
```

サイズ: **~1.2GB**

### After: 最適化後

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
RUN addgroup -S app && adduser -S app -G app
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

サイズ: **~150MB** (87%削減)

### 最適化ポイントのまとめ

| テクニック | 削減効果 |
|-----------|---------|
| alpine ベースイメージ | ~900MB 削減 |
| マルチステージビルド | ~100MB 削減 |
| --only=production | ~50MB 削減 |
| npm cache clean | ~10MB 削減 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| レイヤー最適化 | RUN をまとめ、キャッシュを削除する |
| ベースイメージ | alpine / slim を使う |
| マルチステージ | ビルドツールを本番イメージに含めない |
| 分析ツール | docker history, docker system df, dive |

### チェックリスト

- [ ] レイヤーサイズを削減する方法を理解した
- [ ] イメージの分析ツールを使える
- [ ] 最適化前後のサイズ差を把握した
- [ ] プロジェクトに適した最適化を選択できる

---

## 次のステップへ

次のセクションでは、Docker Compose を使って複数のコンテナをまとめて管理する方法を学びます。

---

*推定読了時間: 25分*
