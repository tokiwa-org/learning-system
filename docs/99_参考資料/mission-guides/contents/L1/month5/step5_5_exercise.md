# 演習：フルスタックアプリをK8sにデプロイしよう

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 5
subStep: 5
title: "演習：フルスタックアプリをK8sにデプロイしよう"
itemType: EXERCISE
estimatedMinutes: 120
noiseLevel: MINIMAL
roadmap:
  skill: "Kubernetes"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「ここまでの知識を全部使って、実際のアプリケーションを Kubernetes にデプロイしよう」
>
> 村上先輩が本番さながらの構成図を広げた。
>
> 「フロントエンド、APIサーバー、データベース。この3層構成を Kubernetes マニフェストで
> 定義して、動く状態にしてくれ。ヘルスチェック、リソース制限、HPA も忘れずに」
>
> 「いよいよ実践ですね。やってみます」
>
> 「困ったら、これまでのステップを振り返ればいい。全部つながっているから」

---

## 演習の概要

以下の3層構成アプリケーションを Kubernetes にデプロイしてください。

```
┌─────────┐     ┌──────────┐     ┌────────────┐
│ Nginx   │────→│ API      │────→│ PostgreSQL │
│ (Web)   │     │ (Node.js)│     │ (DB)       │
│ :80     │     │ :8080    │     │ :5432      │
└─────────┘     └──────────┘     └────────────┘
   Ingress        Service          Service
```

---

## 課題1: Namespace と ConfigMap/Secret の作成（15分）

**要件:**
- Namespace: `webapp`
- ConfigMap: アプリの設定値（NODE_ENV, DB_HOST, DB_PORT, DB_NAME）
- Secret: 機密情報（DB_USER, DB_PASSWORD）

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: webapp
  labels:
    project: webapp
---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: webapp
data:
  NODE_ENV: "production"
  DB_HOST: "db-service"
  DB_PORT: "5432"
  DB_NAME: "webapp"
  API_PORT: "8080"
---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
  namespace: webapp
type: Opaque
stringData:
  DB_USER: "webapp"
  DB_PASSWORD: "securepassword123"
  POSTGRES_USER: "webapp"
  POSTGRES_PASSWORD: "securepassword123"
```

</details>

---

## 課題2: PostgreSQL の Deployment と Service（20分）

**要件:**
- イメージ: `postgres:16-alpine`
- ConfigMap/Secret から環境変数を注入
- PersistentVolumeClaim でデータを永続化
- ヘルスチェック（TCP 5432）
- リソース制限を設定
- ClusterIP Service を作成

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```yaml
# db-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: db-pvc
  namespace: webapp
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
# db-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: db
  namespace: webapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
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
              name: app-secret
              key: POSTGRES_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: POSTGRES_PASSWORD
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_NAME
        resources:
          requests:
            cpu: "250m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          tcpSocket:
            port: 5432
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - webapp
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: db-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: db-storage
        persistentVolumeClaim:
          claimName: db-pvc
---
# db-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: db-service
  namespace: webapp
spec:
  type: ClusterIP
  selector:
    app: db
  ports:
  - port: 5432
    targetPort: 5432
```

</details>

---

## 課題3: API サーバーの Deployment、Service、HPA（30分）

**要件:**
- イメージ: `my-api:1.0`（事前にビルド済みと仮定）
- ConfigMap/Secret から環境変数を注入
- Liveness/Readiness Probe を設定
- リソース制限を設定
- RollingUpdate 戦略（maxSurge: 1, maxUnavailable: 0）
- HPA: CPU 70% で 2〜8 レプリカ

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```yaml
# api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  namespace: webapp
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
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secret
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
---
# api-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: webapp
spec:
  type: ClusterIP
  selector:
    app: api-server
  ports:
  - port: 8080
    targetPort: 8080
---
# api-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server-hpa
  namespace: webapp
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 2
  maxReplicas: 8
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
```

</details>

---

## 課題4: Nginx と Ingress の設定（20分）

**要件:**
- Nginx で静的ファイルを配信し、`/api` パスを API サーバーに転送
- Ingress でルーティング設定

<details>
<summary>解答例（自分で実装してから確認しよう）</summary>

```yaml
# nginx-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: webapp
data:
  default.conf: |
    server {
      listen 80;
      server_name localhost;

      location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
      }

      location /api/ {
        proxy_pass http://api-service:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
      }

      location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
      }
    }
---
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: webapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: "100m"
            memory: "64Mi"
          limits:
            cpu: "200m"
            memory: "128Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          periodSeconds: 5
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/conf.d
      volumes:
      - name: nginx-config
        configMap:
          name: nginx-config
---
# web-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
  namespace: webapp
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: webapp-ingress
  namespace: webapp
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: webapp.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

</details>

---

## 課題5: デプロイと動作確認（35分）

```bash
# 1. 全マニフェストを適用
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/

# 2. 全リソースの確認
kubectl get all -n webapp

# 3. Pod の状態確認
kubectl get pods -n webapp -w

# 4. ヘルスチェックの確認
kubectl describe pod -n webapp -l app=api-server

# 5. ポートフォワードでアクセス確認
kubectl port-forward -n webapp service/web-service 8080:80

# 6. API のテスト
curl http://localhost:8080/api/health

# 7. HPA の確認
kubectl get hpa -n webapp

# 8. ログの確認
kubectl logs -n webapp -l app=api-server --tail=20
```

---

## 達成度チェック

| 課題 | 完了 |
|------|------|
| Namespace/ConfigMap/Secret | [ ] |
| PostgreSQL Deployment + Service | [ ] |
| API Deployment + Service + HPA | [ ] |
| Nginx + Ingress | [ ] |
| デプロイと動作確認 | [ ] |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 構成 | Namespace → ConfigMap/Secret → DB → API → Web → Ingress |
| データ永続化 | PVC で PostgreSQL のデータを保持 |
| ヘルスチェック | 全 Pod に Liveness/Readiness Probe を設定 |
| オートスケーリング | HPA で API サーバーの負荷に応じてスケール |
| セキュリティ | Secret で機密情報を管理 |

### チェックリスト

- [ ] 全マニフェストを作成できた
- [ ] デプロイが成功した
- [ ] ヘルスチェックが正常に動作している
- [ ] Service 経由で API にアクセスできた
- [ ] HPA が設定されている

---

## 次のステップへ

次のセクションでは、Step 5 のチェックポイントクイズに挑戦します。

---

*推定所要時間: 120分*
