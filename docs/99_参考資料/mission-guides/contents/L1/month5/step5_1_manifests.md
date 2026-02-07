# マニフェストの書き方

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 5
subStep: 1
title: "マニフェストの書き方"
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

> 「ここからが本番だ。Step 1〜4 で学んだ全てを使って、実際にアプリを K8s にデプロイする」
>
> 村上先輩が新しいディレクトリ構成を見せた。
>
> 「まず、マニフェストファイルの書き方と管理方法を覚えよう。
> 実際のプロジェクトでは、複数のマニフェストを整理して管理する必要がある。
> ディレクトリ構成から始めよう」

---

## マニフェストの基本構造

全ての Kubernetes マニフェストには4つの共通フィールドがあります。

```yaml
apiVersion: apps/v1      # API バージョン
kind: Deployment         # リソースの種類
metadata:                # メタデータ（名前、ラベル等）
  name: my-app
  labels:
    app: my-app
spec:                    # リソースの仕様（設定）
  replicas: 3
  # ...
```

### apiVersion の一覧

| リソース | apiVersion |
|---------|-----------|
| Pod, Service, ConfigMap, Secret | v1 |
| Deployment, ReplicaSet | apps/v1 |
| Ingress | networking.k8s.io/v1 |
| HPA | autoscaling/v2 |
| CronJob | batch/v1 |

---

## マニフェストのディレクトリ構成

### 推奨構成

```
k8s/
├── base/                    # 共通設定
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── overlays/                # 環境別の上書き
│   ├── development/
│   │   ├── configmap.yaml
│   │   └── kustomization.yaml
│   ├── staging/
│   │   ├── configmap.yaml
│   │   └── kustomization.yaml
│   └── production/
│       ├── configmap.yaml
│       ├── hpa.yaml
│       └── kustomization.yaml
└── README.md
```

### シンプルな構成（小規模プロジェクト）

```
k8s/
├── deployment.yaml
├── service.yaml
├── configmap.yaml
├── secret.yaml
└── ingress.yaml
```

---

## 1つのファイルに複数リソース

`---` で区切ることで、1つの YAML ファイルに複数のリソースを定義できます。

```yaml
# app.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 3000
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:1.0
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
```

---

## 完全なマニフェストの例

### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
  labels:
    project: my-app
```

### Deployment（詳細版）

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  namespace: my-app
  labels:
    app: api-server
    version: v1.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
        version: v1.0.0
    spec:
      containers:
      - name: api-server
        image: myregistry.com/api-server:1.0.0
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: api-config
              key: NODE_ENV
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: api-secret
              key: DB_PASSWORD
        resources:
          requests:
            cpu: "250m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
      restartPolicy: Always
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: my-app
spec:
  type: ClusterIP
  selector:
    app: api-server
  ports:
  - name: http
    port: 80
    targetPort: 8080
    protocol: TCP
```

---

## マニフェストの適用と確認

```bash
# 名前空間の作成
kubectl apply -f k8s/namespace.yaml

# 全マニフェストを一括適用
kubectl apply -f k8s/

# 名前空間を指定して確認
kubectl get all -n my-app

# ドライランで確認
kubectl apply -f k8s/ --dry-run=client

# 差分の確認
kubectl diff -f k8s/deployment.yaml
```

---

## YAML 記述のコツ

### 1. 文字列と数値

```yaml
# 文字列
name: "my-app"    # 引用符あり
name: my-app      # 引用符なしでも可

# 数値（ポートなど）
port: 8080        # 数値
port: "8080"      # これは文字列

# CPU/メモリのリソース値
cpu: "250m"       # 250ミリCPU（0.25コア）
memory: "256Mi"   # 256メビバイト
```

### 2. リソース値の単位

| リソース | 単位 | 例 |
|---------|------|-----|
| CPU | m (ミリコア) | 250m = 0.25コア, 1000m = 1コア |
| メモリ | Mi, Gi | 256Mi, 1Gi |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 基本構造 | apiVersion, kind, metadata, spec の4フィールド |
| ファイル管理 | 環境別にディレクトリを分けて管理 |
| 複数リソース | --- で区切って1ファイルに複数定義可能 |
| 適用方法 | kubectl apply -f で適用 |

### チェックリスト

- [ ] マニフェストの基本構造を理解した
- [ ] 複数リソースを定義できる
- [ ] ディレクトリ構成のパターンを把握した
- [ ] kubectl apply でマニフェストを適用できる

---

## 次のステップへ

次のセクションでは、Deployment の更新戦略（ローリングアップデートなど）を学びます。

---

*推定読了時間: 30分*
