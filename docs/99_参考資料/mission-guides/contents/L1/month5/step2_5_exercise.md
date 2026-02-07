# 演習：Webアプリを最適化Dockerfile化しよう

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 2
subStep: 5
title: "演習：Webアプリを最適化Dockerfile化しよう"
itemType: EXERCISE
estimatedMinutes: 90
noiseLevel: MINIMAL
roadmap:
  skill: "Docker"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「よし、いよいよ実践だ。このWebアプリケーションを Dockerfile 化してほしい」
>
> 村上先輩がリポジトリのURLを共有した。
>
> 「ただ動くだけじゃダメだ。今まで学んだベストプラクティスを全部適用してほしい。
> キャッシュの活用、軽量イメージ、非root実行、.dockerignore......全部だ」
>
> 「全部ですか......」
>
> 「安心しろ。段階的にやっていこう。まずは動くDockerfileを作って、
> そこから最適化していくんだ」

---

## 演習の概要

以下の Express アプリケーションを最適化された Dockerfile でコンテナ化してください。

### アプリケーション構成

```
my-web-app/
├── src/
│   ├── server.js
│   ├── routes/
│   │   ├── index.js
│   │   └── api.js
│   └── middleware/
│       └── logger.js
├── public/
│   ├── index.html
│   └── style.css
├── test/
│   ├── server.test.js
│   └── api.test.js
├── package.json
├── package-lock.json
├── .env
├── .env.example
├── .git/
├── README.md
└── node_modules/
```

### package.json

```json
{
  "name": "my-web-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.0.2"
  }
}
```

### src/server.js

```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.json({ message: `Hello, ${name}!` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 課題

### 課題1: .dockerignore ファイルを作成する（15分）

ビルドコンテキストに含めるべきでないファイルを除外する `.dockerignore` を作成してください。

**要件:**
- `node_modules` を除外する
- `.env` ファイルを除外する
- テストファイルを除外する
- `.git` ディレクトリを除外する
- ドキュメントファイルを除外する

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```
# 依存パッケージ
node_modules

# 環境変数
.env
.env.local
.env.*.local

# バージョン管理
.git
.gitignore

# テスト
test/
*.test.js
*.spec.js
coverage/

# ドキュメント
README.md
docs/
*.md

# IDE
.vscode
.idea

# Docker
Dockerfile
docker-compose*.yml
.dockerignore

# OS
.DS_Store
Thumbs.db
```

</details>

---

### 課題2: 基本的な Dockerfile を作成する（20分）

まずは「動く」Dockerfile を作成してください。

**要件:**
- `node:20-alpine` をベースイメージにする
- 作業ディレクトリを `/app` に設定する
- 依存パッケージをインストールする
- アプリケーションコードをコピーする
- ポート3000を公開する
- `node src/server.js` で起動する

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY src/ ./src/
COPY public/ ./public/

EXPOSE 3000

CMD ["node", "src/server.js"]
```

</details>

---

### 課題3: ベストプラクティスを適用する（30分）

課題2の Dockerfile に以下のベストプラクティスを適用してください。

**要件:**
- レイヤーキャッシュを最大限活用する命令順序にする
- 非 root ユーザーで実行する
- HEALTHCHECK を設定する
- LABEL でメタデータを付与する
- NODE_ENV を production に設定する

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```dockerfile
FROM node:20-alpine

# メタデータ
LABEL maintainer="your-team@example.com"
LABEL version="1.0.0"
LABEL description="My Web Application"

# 環境変数
ENV NODE_ENV=production
ENV PORT=3000

# 作業ディレクトリ
WORKDIR /app

# 依存パッケージのインストール（キャッシュ活用）
COPY package.json package-lock.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# アプリケーションコードのコピー
COPY src/ ./src/
COPY public/ ./public/

# 非 root ユーザーの設定
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

# ポート宣言
EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# アプリケーション起動
CMD ["node", "src/server.js"]
```

</details>

---

### 課題4: ビルドとテスト（25分）

作成した Dockerfile でイメージをビルドし、コンテナを起動してテストしてください。

```bash
# 1. イメージのビルド
docker build -t my-web-app:1.0 .

# 2. イメージサイズの確認
docker images my-web-app

# 3. コンテナの起動
docker run -d --name web-test -p 3000:3000 my-web-app:1.0

# 4. 動作確認
curl http://localhost:3000/health
curl http://localhost:3000/api/greeting?name=Docker

# 5. ログの確認
docker logs web-test

# 6. コンテナ内の実行ユーザーを確認
docker exec web-test whoami

# 7. ヘルスチェックの状態を確認
docker inspect --format='{{.State.Health.Status}}' web-test

# 8. クリーンアップ
docker rm -f web-test
```

**確認項目:**
- [ ] イメージサイズが 200MB 以下か
- [ ] `/health` エンドポイントが応答するか
- [ ] `/api/greeting` が正しく動作するか
- [ ] コンテナ内のユーザーが root ではないか
- [ ] ヘルスチェックが healthy になるか

---

## 達成度チェック

| 課題 | 完了 |
|------|------|
| .dockerignore の作成 | [ ] |
| 基本 Dockerfile の作成 | [ ] |
| ベストプラクティスの適用 | [ ] |
| ビルドとテスト | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| .dockerignore | セキュリティとビルド効率の両方に重要 |
| 段階的アプローチ | まず動くものを作り、最適化していく |
| キャッシュ活用 | package*.json を先にコピーして npm ci |
| セキュリティ | 非 root 実行、.env 除外、HEALTHCHECK |

### チェックリスト

- [ ] .dockerignore を適切に設定できた
- [ ] レイヤーキャッシュを活用した Dockerfile を書けた
- [ ] 非 root ユーザーで実行するよう設定できた
- [ ] HEALTHCHECK を設定してヘルス監視ができた
- [ ] イメージのビルドとテストが成功した

---

## 次のステップへ

次のセクションでは、Step 2のチェックポイントクイズに挑戦します。
Dockerfile のベストプラクティスが身についているか確認しましょう。

---

*推定所要時間: 90分*
