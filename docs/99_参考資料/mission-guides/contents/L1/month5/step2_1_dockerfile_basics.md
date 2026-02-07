# Dockerfileの基本構文

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 2
subStep: 1
title: "Dockerfileの基本構文"
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

> 「Docker の基本操作は覚えたね。次は自分でイメージを作る番だ」
>
> 村上先輩がエディタを開いた。
>
> 「既存のイメージを pull して使うだけじゃなく、自分のアプリケーション用のイメージを
> Dockerfile というファイルに定義して作るんだ」
>
> 「Dockerfile......レシピみたいなものですか？」
>
> 「まさにそう。料理のレシピが材料と手順を書いたものであるように、
> Dockerfile はベースイメージと、何をインストールして、何をコピーして、
> どう起動するかを書いたものだ。このレシピが良ければ、効率的で安全なイメージができる」

---

## Dockerfile とは

Dockerfile は、Docker イメージを自動的にビルドするための命令が書かれたテキストファイルです。

### 最小限の Dockerfile

```dockerfile
# ベースイメージを指定
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# 依存パッケージの定義ファイルをコピー
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# アプリケーションが使用するポートを宣言
EXPOSE 3000

# コンテナ起動時に実行するコマンド
CMD ["node", "server.js"]
```

### ビルドと実行

```bash
# イメージのビルド
docker build -t my-app:1.0 .

# コンテナの起動
docker run -d -p 3000:3000 my-app:1.0
```

---

## 主要な Dockerfile 命令

### FROM - ベースイメージの指定

```dockerfile
# 公式イメージをベースにする
FROM node:20-alpine

# 特定のバージョンを指定
FROM python:3.12-slim

# 最小限のイメージ（上級者向け）
FROM scratch
```

全ての Dockerfile は `FROM` で始まります。ベースイメージの選択はイメージサイズとセキュリティに直結します。

### WORKDIR - 作業ディレクトリの設定

```dockerfile
# 以降の命令はこのディレクトリで実行される
WORKDIR /app

# ディレクトリが存在しない場合は自動作成される
WORKDIR /app/src
```

### COPY と ADD - ファイルのコピー

```dockerfile
# ホストのファイルをコンテナにコピー
COPY package.json ./
COPY src/ ./src/

# ワイルドカードも使える
COPY *.json ./

# ADD は COPY と似ているが、追加機能がある
# - tar の自動展開
# - URL からのダウンロード（非推奨）
ADD archive.tar.gz /app/
```

**ベストプラクティス**: 特別な理由がない限り `COPY` を使います。`ADD` の暗黙的な動作（tar展開など）は予期しない結果を招くことがあります。

### RUN - コマンドの実行

```dockerfile
# シェル形式（/bin/sh -c で実行される）
RUN npm install

# 複数コマンドを && で連結（レイヤーを1つに抑える）
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# exec 形式
RUN ["npm", "install", "--production"]
```

### ENV - 環境変数の設定

```dockerfile
# 環境変数を設定
ENV NODE_ENV=production
ENV PORT=3000

# 後続の命令で参照可能
RUN echo "Environment: $NODE_ENV"
```

### EXPOSE - ポートの宣言

```dockerfile
# このコンテナが使用するポートを宣言（ドキュメント目的）
EXPOSE 3000
EXPOSE 8080/tcp
EXPOSE 8081/udp
```

`EXPOSE` は実際にポートを公開するわけではありません。`docker run -p` でポートマッピングが必要です。

### CMD と ENTRYPOINT - コンテナ起動時のコマンド

```dockerfile
# CMD: コンテナ起動時のデフォルトコマンド
CMD ["node", "server.js"]

# ENTRYPOINT: コンテナの実行可能ファイルを定義
ENTRYPOINT ["node"]
CMD ["server.js"]
```

| 命令 | 役割 | docker run で上書き |
|-----|------|-------------------|
| CMD | デフォルトコマンド | 上書き可能 |
| ENTRYPOINT | 固定のエントリーポイント | --entrypoint で上書き |
| 組み合わせ | ENTRYPOINT が固定、CMD がデフォルト引数 | CMD 部分のみ上書き |

```bash
# CMD ["node", "server.js"] の場合
docker run my-app                    # → node server.js
docker run my-app node test.js       # → node test.js （CMD を上書き）

# ENTRYPOINT ["node"] CMD ["server.js"] の場合
docker run my-app                    # → node server.js
docker run my-app test.js            # → node test.js （CMD 部分のみ上書き）
```

### USER - 実行ユーザーの指定

```dockerfile
# 非 root ユーザーを作成して切り替え
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### ARG - ビルド時の引数

```dockerfile
# ビルド時に変更可能な引数
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine

ARG APP_VERSION=1.0.0
LABEL version=${APP_VERSION}
```

```bash
# ビルド時に引数を指定
docker build --build-arg NODE_VERSION=18 -t my-app .
```

---

## Dockerfile 命令一覧

```
┌────────────┬──────────────────────────────────┐
│  命令       │  説明                             │
├────────────┼──────────────────────────────────┤
│ FROM       │ ベースイメージの指定                 │
│ WORKDIR    │ 作業ディレクトリの設定               │
│ COPY       │ ファイルのコピー                    │
│ ADD        │ ファイルのコピー（tar展開等の追加機能） │
│ RUN        │ ビルド時にコマンドを実行              │
│ ENV        │ 環境変数の設定                      │
│ EXPOSE     │ ポートの宣言                        │
│ CMD        │ コンテナ起動時のデフォルトコマンド      │
│ ENTRYPOINT │ コンテナのエントリーポイント           │
│ USER       │ 実行ユーザーの指定                   │
│ ARG        │ ビルド時の引数                      │
│ LABEL      │ メタデータの付与                     │
│ VOLUME     │ ボリュームマウントポイントの宣言       │
│ HEALTHCHECK│ ヘルスチェックの定義                  │
└────────────┴──────────────────────────────────┘
```

---

## 実践例: Express アプリの Dockerfile

```dockerfile
FROM node:20-alpine

# メタデータ
LABEL maintainer="team@example.com"
LABEL version="1.0.0"

# 作業ディレクトリ
WORKDIR /app

# 依存パッケージのインストール
COPY package.json package-lock.json ./
RUN npm ci --only=production

# アプリケーションコードのコピー
COPY src/ ./src/

# 非 root ユーザーで実行
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# ポート宣言
EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# アプリケーション起動
CMD ["node", "src/server.js"]
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| FROM | 全ての Dockerfile の起点。ベースイメージを指定 |
| COPY vs ADD | 基本は COPY を使用。ADD は tar 展開が必要な場合のみ |
| RUN | ビルド時のコマンド実行。&& で連結してレイヤー数を減らす |
| CMD vs ENTRYPOINT | CMD はデフォルトコマンド、ENTRYPOINT は固定の実行ファイル |
| USER | セキュリティのため非 root ユーザーで実行 |

### チェックリスト

- [ ] 主要な Dockerfile 命令の役割を理解した
- [ ] FROM, WORKDIR, COPY, RUN, CMD を使った Dockerfile を書ける
- [ ] CMD と ENTRYPOINT の違いを説明できる
- [ ] COPY と ADD の使い分けを理解した

---

## 次のステップへ

次のセクションでは、Docker のレイヤーキャッシュの仕組みを学びます。
キャッシュを効果的に活用することで、ビルド時間を大幅に短縮できます。

---

*推定読了時間: 30分*
