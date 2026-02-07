# 総合演習：マイクロサービスのコンテナ化とデプロイ

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 6
subStep: 1
title: "総合演習：マイクロサービスのコンテナ化とデプロイ"
itemType: EXERCISE
estimatedMinutes: 60
noiseLevel: MINIMAL
roadmap:
  skill: "Kubernetes"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「最終ミッションだ」
>
> 村上先輩が今まで以上に真剣な表情で言った。
>
> 「ECサイトの注文管理システムをマイクロサービス化してほしいという依頼が来た。
> 注文サービスと在庫サービスの2つのマイクロサービスをDockerでコンテナ化し、
> Kubernetesにデプロイするんだ」
>
> 「Docker のマルチステージビルドから、K8s のマニフェストまで全部ですね」
>
> 「その通り。これまで学んだ全てを使え。成功すれば、君はコンテナの海を
> 自由に航海できるようになる」

---

## 課題の全体像

```
┌──────────────────────────────────────────────────────┐
│                  Kubernetes Cluster                    │
│                                                      │
│  ┌─────────────┐      ┌─────────────┐               │
│  │   Ingress    │      │   Ingress    │               │
│  │  /orders/*  │      │ /inventory/* │               │
│  └──────┬──────┘      └──────┬──────┘               │
│         ↓                     ↓                      │
│  ┌─────────────┐      ┌─────────────┐               │
│  │ order-svc   │      │inventory-svc│               │
│  │ (Service)   │─────→│ (Service)   │               │
│  └──────┬──────┘      └──────┬──────┘               │
│         ↓                     ↓                      │
│  ┌─────────────┐      ┌─────────────┐               │
│  │ order-api   │      │inventory-api│               │
│  │ (Deployment)│      │ (Deployment)│               │
│  │ replicas: 3 │      │ replicas: 2 │               │
│  └──────┬──────┘      └──────┬──────┘               │
│         ↓                     ↓                      │
│  ┌─────────────┐      ┌─────────────┐               │
│  │ order-db    │      │inventory-db │               │
│  │ (PostgreSQL)│      │ (PostgreSQL) │               │
│  └─────────────┘      └─────────────┘               │
└──────────────────────────────────────────────────────┘
```

---

## Part 1: Dockerfile の作成（20分）

### 注文サービス（order-api）

TypeScript Express アプリケーションのマルチステージビルド Dockerfile を作成してください。

**要件:**
- ビルドステージ: `node:20-alpine` で TypeScript をコンパイル
- 本番ステージ: `node:20-alpine` で production 依存のみ
- 非 root ユーザーで実行
- HEALTHCHECK を設定
- ポート: 8080

### 在庫サービス（inventory-api）

Python FastAPI アプリケーションのマルチステージビルド Dockerfile を作成してください。

**要件:**
- ビルドステージ: `python:3.12-slim` で依存パッケージをエクスポート
- 本番ステージ: `python:3.12-slim` で requirements.txt からインストール
- 非 root ユーザーで実行
- HEALTHCHECK を設定
- ポート: 8081

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

**order-api/Dockerfile:**

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Production stage
FROM node:20-alpine
LABEL service="order-api"
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1
CMD ["node", "dist/server.js"]
```

**inventory-api/Dockerfile:**

```dockerfile
# Build stage
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir poetry
COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

# Production stage
FROM python:3.12-slim
LABEL service="inventory-api"
WORKDIR /app
COPY --from=builder /app/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
RUN useradd -m appuser
USER appuser
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=3s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8081/health')" || exit 1
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8081"]
```

</details>

---

## Part 2: Kubernetes マニフェストの作成（30分）

以下のマニフェストを全て作成してください。

### 共通リソース

- Namespace: `ecommerce`
- ConfigMap: 各サービスの設定値
- Secret: データベース認証情報

### 注文サービス

- Deployment: 3レプリカ、ヘルスチェック、リソース制限
- Service: ClusterIP
- HPA: CPU 70% で 2〜6 レプリカ

### 在庫サービス

- Deployment: 2レプリカ、ヘルスチェック、リソース制限
- Service: ClusterIP

### データベース

- 各サービス用の PostgreSQL Deployment + Service + PVC

### Ingress

- `/orders/*` → order-service
- `/inventory/*` → inventory-service

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ecommerce
---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: order-config
  namespace: ecommerce
data:
  NODE_ENV: "production"
  PORT: "8080"
  DB_HOST: "order-db-service"
  DB_PORT: "5432"
  DB_NAME: "orders"
  INVENTORY_SERVICE_URL: "http://inventory-service:8081"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: inventory-config
  namespace: ecommerce
data:
  PORT: "8081"
  DB_HOST: "inventory-db-service"
  DB_PORT: "5432"
  DB_NAME: "inventory"
---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: ecommerce
type: Opaque
stringData:
  ORDER_DB_USER: "orderuser"
  ORDER_DB_PASSWORD: "orderpass123"
  INVENTORY_DB_USER: "invuser"
  INVENTORY_DB_PASSWORD: "invpass123"
---
# order-db.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: order-db-pvc
  namespace: ecommerce
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-db
  namespace: ecommerce
spec:
  replicas: 1
  selector:
    matchLabels:
      app: order-db
  template:
    metadata:
      labels:
        app: order-db
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: ORDER_DB_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: ORDER_DB_PASSWORD
        - name: POSTGRES_DB
          value: "orders"
        resources:
          requests:
            cpu: "250m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        readinessProbe:
          exec:
            command: ["pg_isready", "-U", "orderuser"]
          periodSeconds: 5
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: order-db-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: order-db-service
  namespace: ecommerce
spec:
  selector:
    app: order-db
  ports:
  - port: 5432
    targetPort: 5432
---
# order-api.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-api
  namespace: ecommerce
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: order-api
  template:
    metadata:
      labels:
        app: order-api
    spec:
      containers:
      - name: order-api
        image: order-api:1.0
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: order-config
        env:
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: ORDER_DB_USER
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: ORDER_DB_PASSWORD
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
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: order-service
  namespace: ecommerce
spec:
  selector:
    app: order-api
  ports:
  - port: 8080
    targetPort: 8080
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-api-hpa
  namespace: ecommerce
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-api
  minReplicas: 2
  maxReplicas: 6
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
---
# inventory-api.yaml (同様の構成で inventory 用を作成)
# inventory-db.yaml (同様の構成で inventory 用を作成)

# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-ingress
  namespace: ecommerce
spec:
  ingressClassName: nginx
  rules:
  - host: ecommerce.local
    http:
      paths:
      - path: /orders
        pathType: Prefix
        backend:
          service:
            name: order-service
            port:
              number: 8080
      - path: /inventory
        pathType: Prefix
        backend:
          service:
            name: inventory-service
            port:
              number: 8081
```

</details>

---

## Part 3: 動作確認（10分）

```bash
# 全リソースの適用
kubectl apply -f k8s/

# 状態確認
kubectl get all -n ecommerce

# サービス間通信の確認
kubectl exec -n ecommerce deploy/order-api -- \
  wget -qO- http://inventory-service:8081/health

# HPA の確認
kubectl get hpa -n ecommerce
```

---

## 達成度チェック

| 項目 | 完了 |
|------|------|
| 注文サービスの Dockerfile | [ ] |
| 在庫サービスの Dockerfile | [ ] |
| Namespace/ConfigMap/Secret | [ ] |
| 注文サービスの K8s マニフェスト | [ ] |
| 在庫サービスの K8s マニフェスト | [ ] |
| データベースの K8s マニフェスト | [ ] |
| Ingress 設定 | [ ] |
| 動作確認 | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| マルチステージビルド | 言語ごとに最適なパターンを選択 |
| マニフェスト設計 | 環境別の ConfigMap/Secret で設定を分離 |
| サービス間通信 | Service の DNS 名で通信 |
| 運用品質 | ヘルスチェック、リソース制限、HPA の設定 |

### チェックリスト

- [ ] 2つの言語のマルチステージビルド Dockerfile を書けた
- [ ] マイクロサービス構成の K8s マニフェストを書けた
- [ ] サービス間通信の仕組みを活用できた
- [ ] 本番品質の設定（Probe、リソース、HPA）を適用できた

---

## 次のステップへ

最後に、卒業クイズに挑戦して今月の学習の成果を確認しましょう。

---

*推定所要時間: 60分*
