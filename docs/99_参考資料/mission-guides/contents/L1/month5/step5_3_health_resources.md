# ヘルスチェックとリソース管理

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 5
subStep: 3
title: "ヘルスチェックとリソース管理"
itemType: LESSON
estimatedMinutes: 30
noiseLevel: MINIMAL
roadmap:
  skill: "Kubernetes"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「ローリングアップデートで無停止デプロイができるようになった。
> でも、新しい Pod がちゃんと動いているかどうか、どうやって判断してると思う？」
>
> 「......起動しただけでは不十分ですか？」
>
> 村上先輩が頷いた。
>
> 「プロセスが起動していても、アプリケーションが正常にリクエストを処理できるとは限らない。
> データベースへの接続に失敗しているかもしれない。ヘルスチェックが必要なんだ」
>
> 「ヘルスチェック......Docker の HEALTHCHECK みたいなものですか？」
>
> 「もっと高度だ。Kubernetes には3種類のヘルスチェックがある。
> そしてリソース管理も重要だ。メモリリークで他の Pod を道連れにしないように」

---

## 3種類のヘルスチェック（Probe）

### 1. Liveness Probe（生存確認）

コンテナが「生きている」かを確認します。失敗するとコンテナが再起動されます。

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 15   # 初回チェックまでの待機時間
  periodSeconds: 10          # チェック間隔
  timeoutSeconds: 3          # タイムアウト
  failureThreshold: 3        # 失敗許容回数
```

**用途**: アプリがデッドロックやハングした場合に再起動する

### 2. Readiness Probe（準備確認）

コンテナがトラフィックを受け入れる「準備ができている」かを確認します。失敗すると Service からのルーティングが停止されます。

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

**用途**: 起動処理中やDB接続エラー時にトラフィックを受けないようにする

### 3. Startup Probe（起動確認）

コンテナの起動が完了したかを確認します。成功するまで他の Probe は無効になります。

```yaml
startupProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 0
  periodSeconds: 5
  failureThreshold: 30      # 30回 x 5秒 = 最大150秒まで待機
```

**用途**: 起動に時間がかかるアプリ（Java等）で、起動中に liveness probe が誤って再起動しないようにする

---

## Probe の違い

```
┌─────────────────────────────────────────────────┐
│                コンテナ起動                        │
│                                                 │
│  Startup Probe: 起動完了を待つ                    │
│  ├── 起動中... → 他の Probe は無効               │
│  └── 成功 → Liveness/Readiness が有効に          │
│                                                 │
│  Readiness Probe: トラフィック受入可能か            │
│  ├── 成功 → Service にルーティングされる           │
│  └── 失敗 → Service から除外（再起動はしない）     │
│                                                 │
│  Liveness Probe: プロセスは正常か                  │
│  ├── 成功 → 何もしない                           │
│  └── 失敗 → コンテナを再起動                      │
└─────────────────────────────────────────────────┘
```

| Probe | 失敗時の動作 | 確認する内容 |
|-------|------------|------------|
| Startup | 起動失敗として再起動 | アプリの起動完了 |
| Liveness | コンテナを再起動 | アプリが正常動作中か |
| Readiness | Service から除外 | トラフィック受入可能か |

---

## Probe の種類

```yaml
# HTTP GET（最も一般的）
livenessProbe:
  httpGet:
    path: /health
    port: 8080
    httpHeaders:
    - name: Custom-Header
      value: Probe

# TCP ソケット
livenessProbe:
  tcpSocket:
    port: 5432

# コマンド実行
livenessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
```

---

## リソース管理

### requests と limits

```yaml
resources:
  requests:            # 最低保証するリソース量
    cpu: "250m"        # 0.25 CPU コア
    memory: "256Mi"    # 256 MiB
  limits:              # 使用上限
    cpu: "500m"        # 0.5 CPU コア
    memory: "512Mi"    # 512 MiB
```

```
┌──────────────────────────────────┐
│          ノードのリソース          │
│                                  │
│  requests: スケジューラが配置に使用  │
│  ├── この分は保証される             │
│  │                               │
│  limits: 使用上限                  │
│  ├── CPU: 制限（スロットリング）     │
│  └── メモリ: 制限（OOMKill）       │
│                                  │
│  0     requests    limits   Max  │
│  ├────────┤──────────┤───────┤   │
│  │ 保証    │  バースト  │ 拒否  │   │
└──────────────────────────────────┘
```

### requests と limits の違い

| 項目 | requests | limits |
|------|----------|--------|
| 意味 | 最低保証リソース量 | 使用上限 |
| スケジューリング | Pod 配置の判断に使用 | 使用しない |
| CPU超過時 | - | スロットリング（速度制限） |
| メモリ超過時 | - | OOMKill（プロセス強制終了） |

### ベストプラクティス

```yaml
# 推奨: requests を設定し、limits は余裕を持たせる
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    cpu: "1000m"
    memory: "512Mi"
```

---

## 完全な Deployment マニフェスト

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
      - name: api-server
        image: my-api:1.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "250m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        startupProbe:
          httpGet:
            path: /health
            port: 8080
          periodSeconds: 5
          failureThreshold: 30
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          periodSeconds: 5
          failureThreshold: 3
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Liveness Probe | 失敗でコンテナ再起動。デッドロック検知 |
| Readiness Probe | 失敗で Service から除外。起動中やエラー時 |
| Startup Probe | 起動完了まで他の Probe を無効化 |
| requests | 最低保証リソース。スケジューリングに使用 |
| limits | 使用上限。超過時はスロットリングまたは OOMKill |

### チェックリスト

- [ ] 3種類の Probe の違いを説明できる
- [ ] Probe をマニフェストに設定できる
- [ ] requests と limits の違いを理解した
- [ ] リソース値の単位（m, Mi, Gi）を理解した

---

## 次のステップへ

次のセクションでは、HPA（Horizontal Pod Autoscaler）を使って水平オートスケーリングを設定する方法を学びます。

---

*推定読了時間: 30分*
