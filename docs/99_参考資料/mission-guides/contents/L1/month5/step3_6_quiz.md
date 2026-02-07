# チェックポイント：マルチステージビルドをマスターしよう

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 3
subStep: 6
title: "チェックポイント"
itemType: QUIZ
estimatedMinutes: 15
noiseLevel: MINIMAL
roadmap:
  skill: "Docker"
  category: "コンテナ"
  target_level: "L1"
passingScore: 80
```

---

## クイズの説明

Step 3 で学んだマルチステージビルドと Docker Compose の理解度をチェックします。

- 全5問
- 合格ライン: 80%（4問正解）

---

## 問題

### Q1. マルチステージビルドの主な目的はどれですか？

- A) ビルド時間を短縮する
- B) ビルド環境と実行環境を分離してイメージサイズを削減する
- C) 複数のアプリケーションを1つのイメージに含める
- D) Docker Hub へのプッシュ速度を上げる

<details>
<summary>答えを見る</summary>

**正解: B**

マルチステージビルドの主な目的は、ビルドに必要なツール（コンパイラ、ビルドツール、devDependencies等）を本番イメージに含めないことです。ビルドは大きなイメージで行い、成果物だけを軽量な本番イメージにコピーすることで、イメージサイズを大幅に削減できます。

</details>

---

### Q2. 以下の Dockerfile で `COPY --from=builder` は何をしていますか？

```dockerfile
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

- A) ホストマシンの builder ディレクトリからファイルをコピーする
- B) builder という名前のステージからビルド成果物をコピーする
- C) Docker Hub の builder イメージからファイルをコピーする
- D) 前回のビルドキャッシュからファイルをコピーする

<details>
<summary>答えを見る</summary>

**正解: B**

`COPY --from=builder` は、`FROM node:20 AS builder` で定義されたステージからファイルをコピーします。この場合、builder ステージで `npm run build` によって生成された `dist/` ディレクトリの内容を、本番ステージにコピーしています。builder ステージのイメージは最終イメージには含まれません。

</details>

---

### Q3. Go アプリケーションのマルチステージビルドで `FROM scratch` を使う利点はどれですか？

- A) Go のコンパイル速度が上がる
- B) 完全に空のイメージから始まるため、バイナリのみの最小イメージが作れる
- C) scratch は Go 専用のベースイメージである
- D) scratch を使うとセキュリティパッチが自動適用される

<details>
<summary>答えを見る</summary>

**正解: B**

`scratch` は完全に空のベースイメージです。Go のように静的リンクされたバイナリを生成できる言語では、バイナリファイルだけを `scratch` にコピーすることで、10MB 程度の非常に小さなイメージを作成できます。OSやシェルを含まないため、攻撃対象面（Attack Surface）も最小限になります。

</details>

---

### Q4. Docker Compose の `depends_on` で `condition: service_healthy` を指定する効果はどれですか？

- A) 依存サービスのイメージが最新であることを確認する
- B) 依存サービスのコンテナが起動した直後に自サービスを起動する
- C) 依存サービスのヘルスチェックが healthy になるまで自サービスの起動を待つ
- D) 依存サービスが停止したら自サービスも停止する

<details>
<summary>答えを見る</summary>

**正解: C**

`condition: service_healthy` を指定すると、依存サービスの `healthcheck` が `healthy` 状態になるまで自サービスの起動を待機します。これにより、データベースが実際に接続可能になってからアプリケーションを起動するなど、適切な起動順序を保証できます。

</details>

---

### Q5. Docker Compose で `docker compose down -v` を実行した場合の動作はどれですか？

- A) サービスを停止するが、ボリュームは残す
- B) サービスを停止し、名前付きボリュームも削除する
- C) サービスを停止し、イメージも削除する
- D) 全てのDockerリソース（イメージ、コンテナ、ボリューム）を削除する

<details>
<summary>答えを見る</summary>

**正解: B**

`docker compose down` はサービスのコンテナとネットワークを停止・削除します。`-v` オプションを追加すると、`compose.yaml` で定義された名前付きボリュームも削除されます。データベースのデータなどが失われるため、本番環境では注意が必要です。イメージを削除するには `--rmi all` オプションを使います。

</details>

---

## 結果

### 4問以上正解の場合

**合格です。おめでとうございます。**

Step 3「マルチステージビルドをマスターしよう」を完了しました。
次は Step 4「Kubernetesの海図を読もう」に進みましょう。
いよいよコンテナオーケストレーションの世界に入ります。

### 3問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習セクション |
|------|---------------|
| Q1, Q2 | step3_1 マルチステージビルドの概念 |
| Q3 | step3_2 ビルダーパターン |
| Q4, Q5 | step3_4 Docker Compose入門 |

---

*推定所要時間: 15分*
