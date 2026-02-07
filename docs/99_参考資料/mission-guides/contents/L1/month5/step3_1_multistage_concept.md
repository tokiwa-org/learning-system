# マルチステージビルドの概念

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 3
subStep: 1
title: "マルチステージビルドの概念"
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

> 「Dockerfileは書けるようになったな。でも、イメージのサイズを見てみ」
>
> 村上先輩が `docker images` の結果を指差した。
>
> 「350MB......これでも大きいんですか？」
>
> 「本番環境では、このイメージが何十台ものサーバーにプルされる。
> 100MBの差がデプロイ時間に大きく影響する。しかも、ビルドに使ったツールが
> 本番イメージに残っているのはセキュリティ上もよくない」
>
> 「じゃあどうすれば？」
>
> 「マルチステージビルドだ。ビルド用の環境と実行用の環境を分離する。
> 料理に例えれば、調理は広いキッチンで行い、お客様に出すのは
> きれいなお皿の上の料理だけ、ということだ」

---

## マルチステージビルドとは

1つの Dockerfile に複数の `FROM` を記述し、ビルドを段階（ステージ）に分ける手法です。

### 従来の方法（シングルステージ）

```dockerfile
FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ビルドツール（TypeScript コンパイラ等）が本番イメージに残る
CMD ["node", "dist/server.js"]
```

**問題点:**
- ビルドに必要なツール（TypeScript、webpack等）が本番イメージに残る
- devDependencies が残る
- イメージサイズが大きくなる

### マルチステージビルド

```dockerfile
# ==========================================
# ステージ1: ビルド用
# ==========================================
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ==========================================
# ステージ2: 本番用（軽量イメージ）
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ビルド成果物だけをコピー
COPY --from=builder /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

## マルチステージビルドの仕組み

```
ステージ1 (builder):              ステージ2 (production):
┌─────────────────────┐
│ node:20 (フルサイズ)  │
│                     │
│ ソースコード         │
│ devDependencies     │       ┌──────────────────┐
│ TypeScript          │       │ node:20-alpine    │
│ webpack             │       │                  │
│ テストツール         │       │ 本番dependencies  │
│                     │       │                  │
│ → npm run build     │  COPY │ dist/ のみ       │
│                     │ ────→ │                  │
│ dist/ (ビルド成果物)  │       │ 軽量・安全        │
└─────────────────────┘       └──────────────────┘
   〜800MB (使い捨て)              〜150MB (本番用)
```

### 主要な構文

```dockerfile
# ステージに名前をつける
FROM node:20 AS builder

# 別のステージからファイルをコピー
COPY --from=builder /app/dist ./dist

# ステージ番号でも参照可能（0始まり）
COPY --from=0 /app/dist ./dist
```

---

## サイズ比較

| 方法 | イメージサイズ |
|------|-------------|
| シングルステージ（node:20） | ~800MB |
| シングルステージ（node:20-alpine） | ~350MB |
| マルチステージ（alpine） | ~150MB |

マルチステージビルドにより、本番イメージからビルドツールと devDependencies を完全に排除できます。

---

## TypeScript アプリの完全な例

```dockerfile
# ==========================================
# ステージ1: 依存パッケージのインストール
# ==========================================
FROM node:20-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# ステージ2: TypeScript のビルド
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ==========================================
# ステージ3: 本番イメージ
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

---

## 特定のステージだけビルドする

```bash
# builder ステージまでビルド（テスト用）
docker build --target builder -t my-app:test .

# production ステージをビルド（本番用）
docker build --target production -t my-app:prod .

# deps ステージまでビルド（依存パッケージの確認）
docker build --target deps -t my-app:deps .
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| マルチステージビルド | 1つの Dockerfile に複数の FROM を記述する |
| 目的 | ビルド環境と実行環境を分離してイメージを軽量化 |
| COPY --from | 別のステージからファイルをコピーする |
| --target | 特定のステージまでビルドを止める |

### チェックリスト

- [ ] マルチステージビルドの概念を理解した
- [ ] COPY --from の使い方を理解した
- [ ] ビルドステージと本番ステージの分離を設計できる
- [ ] --target オプションの使い方を知っている

---

## 次のステップへ

次のセクションでは、マルチステージビルドにおけるビルダーパターンをさらに詳しく学びます。

---

*推定読了時間: 25分*
