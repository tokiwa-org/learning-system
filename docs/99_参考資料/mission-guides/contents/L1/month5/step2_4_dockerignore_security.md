# .dockerignoreとセキュリティ

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 2
subStep: 4
title: ".dockerignoreとセキュリティ"
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

> 「ところで、ビルドコンテキストって知ってる？」
>
> 「`docker build .` の `.` のことですか？」
>
> 村上先輩が頷いた。
>
> 「そう。このドット（.）で指定したディレクトリの全ファイルが Docker Daemon に送信される。
> `.env` ファイルや `node_modules` や `.git` ディレクトリまで全部だ」
>
> 「えっ、`.env` にはパスワードとか入ってるのに......」
>
> 「だから `.dockerignore` が必要なんだ。`.gitignore` の Docker 版みたいなものだよ。
> セキュリティとビルド効率の両方に関わる重要なファイルだ」

---

## ビルドコンテキストとは

`docker build` を実行すると、指定したディレクトリの全ファイルが Docker Daemon に送信されます。これを「ビルドコンテキスト」と呼びます。

```bash
# カレントディレクトリをビルドコンテキストとして送信
docker build -t my-app .

# 出力例:
# Sending build context to Docker daemon  245.3MB ← ここに注目
```

不要なファイルが含まれていると、転送に時間がかかり、セキュリティリスクにもなります。

---

## .dockerignore ファイル

### 基本的な .dockerignore

```
# バージョン管理
.git
.gitignore

# 依存パッケージ（コンテナ内で再インストール）
node_modules
__pycache__

# 環境設定・シークレット
.env
.env.local
.env.*.local
*.pem
*.key

# IDE・エディタ
.vscode
.idea
*.swp

# ビルド成果物
dist
build
coverage

# Docker 関連
Dockerfile
docker-compose*.yml
.dockerignore

# ドキュメント
README.md
docs/
*.md

# テスト
test/
tests/
__tests__
*.test.js
*.spec.js

# OS ファイル
.DS_Store
Thumbs.db
```

### .dockerignore の効果

```
.dockerignore なし:
  node_modules/    150MB
  .git/             50MB
  dist/             20MB
  coverage/         10MB
  その他             5MB
  ────────────────────────
  ビルドコンテキスト: 235MB

.dockerignore あり:
  src/              2MB
  package.json      2KB
  server.js         1KB
  ────────────────────────
  ビルドコンテキスト: 2MB
```

---

## セキュリティのベストプラクティス

### 1. シークレットをイメージに含めない

```dockerfile
# 絶対にやってはいけない例
COPY .env /app/.env
ENV DATABASE_PASSWORD=supersecret123

# 正しい方法: 実行時に環境変数で渡す
# docker run -e DATABASE_PASSWORD=xxx my-app
# または docker run --env-file .env my-app
```

### 2. ビルド時のシークレット（Docker BuildKit）

```dockerfile
# syntax=docker/dockerfile:1

# ビルド時にシークレットを安全に使う
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci
COPY . .
CMD ["node", "server.js"]
```

```bash
# ビルド時にシークレットを渡す（イメージには残らない）
docker build --secret id=npmrc,src=.npmrc -t my-app .
```

### 3. イメージの脆弱性スキャン

```bash
# Docker Scout でイメージをスキャン
docker scout cves my-app:latest

# Trivy でスキャン
trivy image my-app:latest
```

### 4. 不要なパッケージを含めない

```dockerfile
# 悪い例: ビルドツールが本番イメージに残る
RUN apt-get install -y build-essential python3 make

# 良い例: マルチステージビルドで分離する（Step 3で学ぶ）
```

---

## イメージの中身を確認する

### docker history でレイヤーを確認

```bash
$ docker history my-app:latest

IMAGE          CREATED       CREATED BY                                      SIZE
abc123def456   2 hours ago   CMD ["node" "server.js"]                        0B
bcd234efg567   2 hours ago   COPY . . # buildkit                            2.1MB
cde345fgh678   2 hours ago   RUN npm ci --only=production                   45MB
def456ghi789   2 hours ago   COPY package*.json ./ # buildkit               2.3KB
efg567hij890   2 hours ago   WORKDIR /app                                   0B
fgh678ijk901   3 days ago    /bin/sh -c #(nop)  CMD ["node"]                0B
```

### dive でイメージの中身を詳細に調査

```bash
# dive ツールでイメージの各レイヤーを視覚的に確認
dive my-app:latest
```

---

## コンテナのセキュリティチェックリスト

```
┌───────────────────────────────────────────────┐
│      コンテナセキュリティチェックリスト           │
├───────────────────────────────────────────────┤
│ イメージ                                       │
│ [ ] .dockerignore で不要ファイルを除外           │
│ [ ] シークレットをイメージに含めていない          │
│ [ ] 軽量ベースイメージを使用                     │
│ [ ] 脆弱性スキャンを実施                        │
│                                               │
│ ランタイム                                      │
│ [ ] 非 root ユーザーで実行                      │
│ [ ] 読み取り専用ファイルシステム（可能な場合）     │
│ [ ] リソース制限を設定                           │
│ [ ] ネットワークを最小限に制限                    │
│                                               │
│ 運用                                           │
│ [ ] イメージを定期的に更新                       │
│ [ ] 脆弱性スキャンをCI/CDに組み込み              │
│ [ ] コンテナログを収集・監視                     │
└───────────────────────────────────────────────┘
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| .dockerignore | ビルドコンテキストから不要ファイルを除外する |
| ビルドコンテキスト | docker build で送信されるファイル群。小さくすべき |
| シークレット | イメージには含めず、実行時に環境変数で渡す |
| 脆弱性スキャン | docker scout や trivy でイメージの脆弱性を確認 |

### チェックリスト

- [ ] .dockerignore ファイルを適切に設定できる
- [ ] ビルドコンテキストの概念を理解した
- [ ] シークレットをイメージに含めない方法を理解した
- [ ] イメージの脆弱性スキャンの方法を知っている

---

## 次のステップへ

次のセクションでは、ここまで学んだ知識を使ってWebアプリケーションを Dockerfile 化する演習に挑戦します。
キャッシュ、ベストプラクティス、.dockerignore を全て活用しましょう。

---

*推定読了時間: 30分*
