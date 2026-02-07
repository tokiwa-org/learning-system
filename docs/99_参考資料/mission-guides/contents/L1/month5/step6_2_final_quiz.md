# 卒業クイズ：コンテナの海を航海しよう

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 6
subStep: 2
title: "卒業クイズ"
itemType: QUIZ
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "Kubernetes"
  category: "コンテナ"
  target_level: "L1"
passingScore: 80
```

---

## ストーリー

> 「お疲れさま。ここまでよく頑張った」
>
> 村上先輩が穏やかな表情で言った。
>
> 「Docker の基本からマルチステージビルド、Kubernetes のデプロイまで、
> 一通り航海してきたな。最後に卒業クイズで実力を確認しよう」
>
> 「はい。全力で挑戦します」
>
> 「合格したら、君はコンテナの海を自由に航海できるエンジニアだ。
> 自信を持って臨んでくれ」

---

## クイズの説明

今月の全ステップの内容を網羅した総合クイズです。

- 全8問
- 合格ライン: 80%（7問正解）
- 不合格の場合は、間違えた分野を復習してから再挑戦してください

---

## 問題

### Q1. コンテナと仮想マシン（VM）の違いとして正しいものはどれですか？

- A) コンテナは仮想マシンよりセキュリティが強い
- B) コンテナはホストOSのカーネルを共有し、VMは個別のゲストOSを持つ
- C) コンテナはVMより多くのメモリを使用する
- D) コンテナとVMは同じ技術を使っている

<details>
<summary>答えを見る</summary>

**正解: B**

コンテナはホストOSのLinuxカーネルを共有し、名前空間とcgroupsで分離を実現します。一方、VMはハイパーバイザ上で独立したゲストOSを持ちます。このため、コンテナは軽量（数十MB〜数百MB）で起動が速い（数秒）のに対し、VMは重い（数GB）で起動に時間がかかる（数分）特徴があります。

</details>

---

### Q2. 以下の Dockerfile で最もビルドキャッシュが効率的に使われるのはどれですか？

- A)
```dockerfile
FROM node:20-alpine
COPY . .
RUN npm ci
CMD ["node", "server.js"]
```

- B)
```dockerfile
FROM node:20-alpine
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```

- C)
```dockerfile
FROM node:20-alpine
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```

- D)
```dockerfile
FROM node:20-alpine
COPY . .
CMD ["node", "server.js"]
```

<details>
<summary>答えを見る</summary>

**正解: B**

Bの方法では、`package.json` と `package-lock.json` だけを先にコピーして `npm ci` を実行します。ソースコードを変更しても `package*.json` が変わらなければ、`npm ci` のレイヤーはキャッシュが使用されます。Aでは `COPY . .` でソースコードが変更されるたびに `npm ci` も再実行されてしまいます。

</details>

---

### Q3. マルチステージビルドの最大の利点はどれですか？

- A) ビルド速度が10倍になる
- B) ビルドツールを本番イメージから排除し、セキュリティ向上とサイズ削減を実現する
- C) テストが自動的に実行される
- D) 複数のプログラミング言語を1つのコンテナで使える

<details>
<summary>答えを見る</summary>

**正解: B**

マルチステージビルドの最大の利点は、ビルドに必要なツール（コンパイラ、ビルドツール、devDependencies）を本番イメージに含めないことです。これにより、イメージサイズの大幅な削減（Go: 500MB→10MB）とセキュリティの向上（攻撃対象面の削減）が実現できます。

</details>

---

### Q4. Docker Compose の `depends_on` に `condition: service_healthy` を指定する目的はどれですか？

- A) 依存サービスのイメージサイズを確認する
- B) 依存サービスのヘルスチェックが成功してから自サービスを起動する
- C) 依存サービスのログを自サービスに転送する
- D) 依存サービスと同じネットワークに接続する

<details>
<summary>答えを見る</summary>

**正解: B**

`condition: service_healthy` を指定すると、依存サービスの `healthcheck` が `healthy` 状態になるまで自サービスの起動を待機します。例えば、データベースが実際に接続を受け付けられる状態になってからアプリケーションを起動することで、起動時の接続エラーを防止できます。

</details>

---

### Q5. Kubernetes の Deployment、ReplicaSet、Pod の関係として正しいものはどれですか？

- A) Pod が Deployment を管理する
- B) Deployment → ReplicaSet → Pod の順で管理する
- C) ReplicaSet が Deployment と Pod の両方を管理する
- D) 3つは独立したリソースである

<details>
<summary>答えを見る</summary>

**正解: B**

Deployment が ReplicaSet を管理し、ReplicaSet が Pod を管理する階層構造です。Deployment はローリングアップデート時に新旧の ReplicaSet を制御します。ReplicaSet は指定された数の Pod が常に動作していることを保証します。通常は Deployment だけを作成し、ReplicaSet と Pod は自動的に管理されます。

</details>

---

### Q6. Kubernetes Service の ClusterIP、NodePort、LoadBalancer の中で、本番環境で外部ユーザーに公開する場合に最も適切なものはどれですか？

- A) ClusterIP
- B) NodePort
- C) LoadBalancer（またはIngress + ClusterIP）
- D) どれでも同じ

<details>
<summary>答えを見る</summary>

**正解: C**

LoadBalancer は クラウドプロバイダのロードバランサーを自動作成し、安定した外部IPアドレスを提供します。また、Ingress + ClusterIP の組み合わせも一般的で、パスベースやホストベースのルーティングが可能です。ClusterIP はクラスタ内部のみ、NodePort はポート番号の制約（30000-32767）があり、本番環境には適していません。

</details>

---

### Q7. Kubernetes の Liveness Probe と Readiness Probe の違いとして正しいものはどれですか？

- A) Liveness は Pod の起動時のみ、Readiness は常に実行される
- B) Liveness の失敗でコンテナが再起動され、Readiness の失敗で Service から除外される
- C) Liveness はHTTPのみ、Readiness はTCPのみ対応
- D) Liveness と Readiness は同じ動作をする

<details>
<summary>答えを見る</summary>

**正解: B**

Liveness Probe はコンテナが「生きているか」を確認し、失敗するとコンテナが再起動されます（デッドロック検知等）。Readiness Probe はコンテナが「トラフィックを受け入れられるか」を確認し、失敗すると Service のエンドポイントから除外されます（起動中やDB接続エラー時等）。Pod 自体は停止しません。

</details>

---

### Q8. HPA（Horizontal Pod Autoscaler）を使用するために必ず必要な設定はどれですか？

- A) Pod に LABEL を設定すること
- B) Pod に resources.requests を設定し、Metrics Server がインストールされていること
- C) Ingress が設定されていること
- D) ConfigMap にスケーリングパラメータを定義すること

<details>
<summary>答えを見る</summary>

**正解: B**

HPA は Metrics Server からメトリクスを取得して Pod 数を自動調整するため、クラスタに Metrics Server がインストールされている必要があります。また、CPU使用率ベースのスケーリングでは、Pod に `resources.requests.cpu` が設定されている必要があります。これがないと、HPA は使用率のパーセンテージを計算できません。

</details>

---

## 結果

### 7問以上正解の場合

**合格です。おめでとうございます!**

月5のミッション「コンテナの海を航海しよう」を完了しました。

あなたは以下のスキルを習得しました：

| スキル | 到達レベル |
|--------|----------|
| Docker の基本操作 | コンテナの起動・停止・管理ができる |
| Dockerfile の作成 | 最適化されたイメージをビルドできる |
| マルチステージビルド | 言語ごとの最適なパターンで軽量イメージを作成できる |
| Docker Compose | 複数コンテナの構成を定義・管理できる |
| Kubernetes の基礎 | 主要リソースを理解し、マニフェストを書ける |
| K8s デプロイ | ヘルスチェック、リソース管理、HPAを設定できる |

### 6問以下の場合

**もう少し復習しましょう。**

| 問題 | 復習ステップ |
|------|------------|
| Q1 | Step 1: Dockerの基本 |
| Q2 | Step 2: Dockerfileの最適化 |
| Q3 | Step 3: マルチステージビルド |
| Q4 | Step 3: Docker Compose |
| Q5 | Step 4: Kubernetes基礎 |
| Q6 | Step 4: ServiceとIngress |
| Q7 | Step 5: ヘルスチェック |
| Q8 | Step 5: HPA |

---

## 月5 完了

お疲れさまでした。

### 今月の航海を振り返って

```
Step 1: Docker の基本を習得
  → コンテナの仕組み、基本コマンド

Step 2: Dockerfile の最適化
  → キャッシュ活用、ベストプラクティス

Step 3: マルチステージビルド
  → イメージの軽量化、Docker Compose

Step 4: Kubernetes の基礎
  → Pod, Deployment, Service, ConfigMap

Step 5: K8s デプロイ実践
  → マニフェスト、ヘルスチェック、HPA

Step 6: 総合演習 + 卒業クイズ
  → マイクロサービスの全スタック構築
```

### 次の月のプレビュー

月6では、CI/CDパイプラインの構築を学びます。今月学んだDockerとKubernetesの知識を活かして、コードの変更からデプロイまでを自動化するパイプラインを構築します。

---

*推定所要時間: 60分*
