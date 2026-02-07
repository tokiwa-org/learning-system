# Pod、ReplicaSet、Deployment

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 4
subStep: 2
title: "Pod、ReplicaSet、Deployment"
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

> 「Kubernetes の全体像はわかったな。次は、中核となるリソースを学ぼう」
>
> 村上先輩がホワイトボードに3つの箱を描いた。
>
> 「Pod、ReplicaSet、Deployment。この3つの関係がわかれば、
> Kubernetes の半分は理解したも同然だ」
>
> 「Pod がコンテナの入れ物......ですか？」
>
> 「正確には、Pod は1つ以上のコンテナをグループ化した最小デプロイ単位だ。
> ReplicaSet は Pod の数を管理し、Deployment は ReplicaSet を管理する。
> マトリョーシカのような入れ子構造だ」

---

## Pod（ポッド）

Pod は Kubernetes の最小デプロイ単位です。1つ以上のコンテナをグループ化します。

### Pod の構造

```
┌─────────────────────────────────┐
│             Pod                  │
│                                 │
│  ┌───────────┐  ┌───────────┐  │
│  │ Container │  │ Container │  │
│  │  (app)    │  │ (sidecar) │  │
│  └───────────┘  └───────────┘  │
│                                 │
│  共有リソース:                    │
│  - ネットワーク（同じIP）          │
│  - ストレージ（共有Volume）       │
│  - ライフサイクル（一緒に起動・停止）│
└─────────────────────────────────┘
```

### Pod の特徴

| 特徴 | 説明 |
|------|------|
| 最小単位 | Kubernetes がスケジュールする最小の単位 |
| 一時的 | Pod は使い捨て。再起動すると別の Pod になる |
| 共有ネットワーク | Pod 内のコンテナは localhost で通信 |
| 共有ストレージ | Pod 内のコンテナはボリュームを共有可能 |

### Pod のマニフェスト

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  containers:
  - name: app
    image: my-app:1.0
    ports:
    - containerPort: 3000
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
      limits:
        memory: "256Mi"
        cpu: "500m"
```

**注意**: 実際の運用では、Pod を直接作成することはほとんどありません。Deployment を使います。

---

## ReplicaSet（レプリカセット）

ReplicaSet は、指定された数の Pod レプリカが常に動作していることを保証します。

```
ReplicaSet (replicas: 3)
┌──────────────────────────────────────┐
│                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │ Pod 1  │  │ Pod 2  │  │ Pod 3  │ │
│  │ my-app │  │ my-app │  │ my-app │ │
│  └────────┘  └────────┘  └────────┘ │
│                                      │
│  Pod が落ちたら自動で新しい Pod を作成    │
└──────────────────────────────────────┘
```

### 自動復旧の仕組み

```
現在の状態: Pod 3つ（正常）
┌────────┐  ┌────────┐  ┌────────┐
│ Pod 1  │  │ Pod 2  │  │ Pod 3  │
│   OK   │  │   OK   │  │   OK   │
└────────┘  └────────┘  └────────┘

Pod 2 が異常終了:
┌────────┐  ┌────────┐  ┌────────┐
│ Pod 1  │  │ Pod 2  │  │ Pod 3  │
│   OK   │  │  DEAD  │  │   OK   │
└────────┘  └────────┘  └────────┘

ReplicaSet が検知して新しい Pod を作成:
┌────────┐  ┌────────┐  ┌────────┐
│ Pod 1  │  │ Pod 4  │  │ Pod 3  │
│   OK   │  │   OK   │  │   OK   │
└────────┘  └────────┘  └────────┘
→ 常に3つのレプリカが維持される
```

**注意**: ReplicaSet も直接作成することはほとんどありません。Deployment を使います。

---

## Deployment（デプロイメント）

Deployment は、ReplicaSet を管理し、宣言的なアップデート機能を提供する最も重要なリソースです。

### Deployment のマニフェスト

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
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
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
```

### 3つのリソースの関係

```
Deployment
├── ReplicaSet (v1)
│   ├── Pod 1
│   ├── Pod 2
│   └── Pod 3
│
└── (イメージ更新時に新しい ReplicaSet を作成)
    ReplicaSet (v2)
    ├── Pod 4
    ├── Pod 5
    └── Pod 6
```

### マニフェストの構造

```yaml
apiVersion: apps/v1        # API バージョン
kind: Deployment           # リソースの種類
metadata:                  # メタデータ
  name: my-app             #   リソース名
  labels:                  #   ラベル
    app: my-app
spec:                      # Deployment の仕様
  replicas: 3              #   Pod の数
  selector:                #   管理対象の Pod を選択
    matchLabels:
      app: my-app
  template:                #   Pod テンプレート
    metadata:
      labels:
        app: my-app
    spec:                  #   Pod の仕様
      containers:
      - name: my-app
        image: my-app:1.0
```

---

## ラベルとセレクタ

Kubernetes はラベルでリソースを識別・選択します。

```yaml
# Pod のラベル
metadata:
  labels:
    app: my-app
    environment: production
    version: v1.0

# セレクタ（このラベルを持つ Pod を選択）
selector:
  matchLabels:
    app: my-app
```

```bash
# ラベルで Pod をフィルタ
kubectl get pods -l app=my-app
kubectl get pods -l environment=production
```

---

## Deployment の操作

```bash
# Deployment の作成
kubectl apply -f deployment.yaml

# Deployment の一覧
kubectl get deployments

# Deployment の詳細
kubectl describe deployment my-app

# Pod の一覧
kubectl get pods

# レプリカ数の変更
kubectl scale deployment my-app --replicas=5

# イメージの更新
kubectl set image deployment/my-app my-app=my-app:2.0

# ロールアウトの状態確認
kubectl rollout status deployment/my-app

# ロールバック
kubectl rollout undo deployment/my-app
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Pod | 最小デプロイ単位。1つ以上のコンテナをグループ化 |
| ReplicaSet | 指定数の Pod を常に維持する |
| Deployment | ReplicaSet を管理し、ローリングアップデートを提供 |
| ラベル | リソースの識別と選択に使用する key-value ペア |
| 宣言的管理 | YAML マニフェストであるべき状態を宣言する |

### チェックリスト

- [ ] Pod、ReplicaSet、Deployment の関係を説明できる
- [ ] Deployment のマニフェストを読める
- [ ] ラベルとセレクタの仕組みを理解した
- [ ] Deployment の基本操作を把握した

---

## 次のステップへ

次のセクションでは、Service と Ingress を学びます。
外部からのアクセスをどう Pod に振り分けるか、ネットワーキングの仕組みを理解しましょう。

---

*推定読了時間: 30分*
