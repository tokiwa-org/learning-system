# チェックポイント：最適化されたDockerfileを書こう

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 2
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Docker"
  category: "コンテナ"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 2 で学んだ Dockerfile の書き方に関する理解度をチェックします。

- 全6問
- 合格ライン: 80%（5問正解）
- 不合格の場合は復習してから再挑戦してください

---

## 問題

### Q1. Dockerfile で `COPY` より `ADD` が推奨される場面はどれですか？

- A) 常に ADD を使うべき
- B) リモート URL からファイルをダウンロードする場合
- C) tar.gz ファイルを自動展開してコピーする場合
- D) ローカルファイルをコピーする場合

<details>
<summary>答えを見る</summary>

**正解: C**

`ADD` は tar アーカイブの自動展開機能を持っています。tar.gz ファイルを自動的に展開してコピーしたい場合に `ADD` を使います。それ以外の通常のファイルコピーでは `COPY` を使うのがベストプラクティスです。リモート URL からのダウンロードは `curl` や `wget` + `RUN` を使う方が推奨されます。

</details>

---

### Q2. 以下の Dockerfile でキャッシュの観点から問題のある部分はどこですか？

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]
```

- A) FROM の指定が不適切
- B) WORKDIR の場所が不適切
- C) COPY . . が npm ci より前にある（ソースコード変更で毎回 npm ci が実行される）
- D) CMD の書き方が間違っている

<details>
<summary>答えを見る</summary>

**正解: C**

`COPY . .` で全ファイルをコピーした後に `RUN npm ci` を実行しているため、ソースコードを1行変更するだけで `npm ci` が毎回再実行されます。正しくは、先に `package.json` と `package-lock.json` だけをコピーして `npm ci` を実行し、その後にソースコードをコピーすべきです。

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

</details>

---

### Q3. .dockerignore に含めるべきでないファイルはどれですか？

- A) node_modules/
- B) .env
- C) package.json
- D) .git/

<details>
<summary>答えを見る</summary>

**正解: C**

`package.json` は Dockerfile の `COPY` 命令で必要とされるファイルであり、.dockerignore に含めてはいけません。`node_modules` はコンテナ内で `npm ci` で再インストールするため除外します。`.env` はシークレットを含む可能性があり除外必須です。`.git` はイメージに不要なため除外します。

</details>

---

### Q4. コンテナを非 root ユーザーで実行する理由として最も適切なものはどれですか？

- A) パフォーマンスが向上するから
- B) コンテナの脆弱性が悪用された場合にホストへの影響を最小限にするため
- C) Docker Hub のポリシーで必須だから
- D) イメージサイズを削減するため

<details>
<summary>答えを見る</summary>

**正解: B**

root ユーザーでコンテナを実行していると、コンテナ内の脆弱性が悪用された場合にホストOSへのアクセスが可能になるリスクがあります。非 root ユーザーで実行することで、攻撃者がコンテナの脆弱性を利用しても権限が制限され、ホストへの影響を最小限に抑えられます。

</details>

---

### Q5. `npm install` と `npm ci` の違いとして正しいものはどれですか？

- A) npm ci は npm install より多くのパッケージをインストールする
- B) npm ci は package-lock.json に厳密に従い、CI/CD環境での再現性が高い
- C) npm ci は開発依存パッケージのみをインストールする
- D) npm ci は npm install の省略形である

<details>
<summary>答えを見る</summary>

**正解: B**

`npm ci` は `package-lock.json` に厳密に従ってインストールするため、再現性が高くCI/CD環境に最適です。`npm install` は `package.json` を基にインストールし、lock ファイルを更新する可能性があります。また、`npm ci` は既存の `node_modules` を削除してからクリーンインストールを行います。

</details>

---

### Q6. HEALTHCHECK 命令の目的として正しいものはどれですか？

- A) コンテナのCPU使用率を制限する
- B) コンテナが正常に動作しているか定期的に確認する
- C) コンテナのネットワーク接続をテストする
- D) コンテナの起動速度を最適化する

<details>
<summary>答えを見る</summary>

**正解: B**

`HEALTHCHECK` 命令は、コンテナが正常に動作しているかを定期的に確認するための仕組みです。指定したコマンドの終了コードで健全性を判定し、Docker はコンテナの状態を `healthy`、`unhealthy`、`starting` として管理します。Kubernetes のヘルスチェック（liveness/readiness probe）と同様の概念です。

</details>

---

## 結果

### 5問以上正解の場合

**合格です。おめでとうございます。**

Step 2「最適化されたDockerfileを書こう」を完了しました。
次は Step 3「マルチステージビルドをマスターしよう」に進みましょう。

### 4問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1 | step2_1 Dockerfileの基本構文 |
| Q2 | step2_2 レイヤーキャッシュの仕組み |
| Q3 | step2_4 .dockerignoreとセキュリティ |
| Q4 | step2_3 ベストプラクティス |
| Q5 | step2_3 ベストプラクティス |
| Q6 | step2_3 ベストプラクティス |

---

*推定所要時間: 30分*
