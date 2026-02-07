# HPA（水平オートスケーリング）

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 5
subStep: 4
title: "HPA（水平オートスケーリング）"
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

> 「ヘルスチェックとリソース管理は完璧だ。最後に、もう1つ重要な機能がある」
>
> 村上先輩がアクセスグラフを見せた。
>
> 「このアプリ、昼間はアクセスが多くて夜は少ない。
> 昼間はPodを10個にしたいけど、夜は3個でいい。手動で変更するのは現実的じゃない」
>
> 「自動でスケールするんですか？」
>
> 「HPA（Horizontal Pod Autoscaler）だ。CPU使用率やカスタムメトリクスに基づいて、
> Pod の数を自動的に増減する。コンテナだからこそ、秒単位でスケールできるんだ」

---

## HPA とは

HPA（Horizontal Pod Autoscaler）は、メトリクスに基づいて Pod のレプリカ数を自動的に調整するリソースです。

```
負荷が低い時:                    負荷が高い時:
┌───────────────┐              ┌───────────────────────────┐
│ HPA: min=2    │              │ HPA: max=10               │
│               │              │                           │
│ [Pod] [Pod]   │   → 負荷増加 → │ [Pod] [Pod] [Pod] [Pod]   │
│               │              │ [Pod] [Pod] [Pod] [Pod]   │
│ CPU: 20%      │              │ CPU: 75%                  │
└───────────────┘              └───────────────────────────┘
```

---

## HPA の前提条件

HPA を使うには、以下が必要です。

1. **Metrics Server** がクラスタにインストールされていること
2. Pod に **resources.requests** が設定されていること

```bash
# Metrics Server のインストール確認
kubectl top pods
# エラーが出る場合は Metrics Server をインストール

# minikube の場合
minikube addons enable metrics-server
```

---

## HPA マニフェスト

### 基本的な HPA（CPU ベース）

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70    # CPU使用率70%を目標
```

### CPU + メモリの複合条件

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300   # 5分間安定してからスケールダウン
      policies:
      - type: Percent
        value: 10                        # 10% ずつ縮小
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0     # すぐにスケールアップ
      policies:
      - type: Percent
        value: 100                       # 一度に倍まで増加可能
        periodSeconds: 60
```

---

## HPA の仕組み

### スケーリングの計算

```
目標レプリカ数 = 現在のレプリカ数 x (現在のメトリクス値 / 目標メトリクス値)

例:
現在: 3 レプリカ, CPU 使用率 90%
目標: CPU 使用率 70%

計算: 3 x (90 / 70) = 3.86 → 切り上げて 4 レプリカ
```

### スケーリングの流れ

```
┌──────────────────────────────────────────┐
│            HPA コントロールループ           │
│                                          │
│  1. Metrics Server からメトリクスを取得     │
│     ↓                                    │
│  2. 目標値と比較                           │
│     ↓                                    │
│  3. 必要なレプリカ数を計算                  │
│     ↓                                    │
│  4. Deployment のレプリカ数を更新           │
│     ↓                                    │
│  5. 15秒後に再チェック (デフォルト)          │
│                                          │
└──────────────────────────────────────────┘
```

---

## HPA の管理コマンド

```bash
# HPA の作成（コマンドライン）
kubectl autoscale deployment api-server \
  --min=2 --max=10 --cpu-percent=70

# HPA の一覧
kubectl get hpa

# 出力例:
# NAME             REFERENCE               TARGETS   MINPODS  MAXPODS  REPLICAS
# api-server-hpa   Deployment/api-server   45%/70%   2        10       3

# HPA の詳細
kubectl describe hpa api-server-hpa

# HPA の削除
kubectl delete hpa api-server-hpa
```

---

## behavior によるスケーリング制御

```yaml
behavior:
  scaleUp:
    stabilizationWindowSeconds: 0     # 即座にスケールアップ
    policies:
    - type: Pods
      value: 4                         # 最大4 Pod ずつ追加
      periodSeconds: 60
    - type: Percent
      value: 100                       # または100%ずつ
      periodSeconds: 60
    selectPolicy: Max                  # 大きい方を採用

  scaleDown:
    stabilizationWindowSeconds: 300   # 5分間安定確認
    policies:
    - type: Percent
      value: 10                        # 10%ずつ削減
      periodSeconds: 60
    selectPolicy: Min                  # 小さい方を採用（慎重に縮小）
```

### なぜスケールダウンは慎重にすべきか

```
急激なスケールダウンの問題:
  10 Pod → 2 Pod に急激に縮小
  → 突然の負荷増加に対応できない
  → 再度スケールアップに時間がかかる

安定化ウィンドウを使った慎重なスケールダウン:
  10 Pod → (5分待機) → 8 Pod → (5分待機) → 6 Pod → ...
  → 負荷が再増加しても対応可能
```

---

## 完全な構成例

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 3                    # 初期レプリカ数
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
          requests:              # HPA に必須
            cpu: "250m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
---
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| HPA | メトリクスに基づいて Pod 数を自動調整 |
| 前提条件 | Metrics Server + resources.requests の設定 |
| スケールアップ | 即座に実行（デフォルト） |
| スケールダウン | stabilizationWindow で慎重に実行 |
| behavior | スケーリングの速度と方法を細かく制御 |

### チェックリスト

- [ ] HPA の仕組みを理解した
- [ ] HPA マニフェストを書ける
- [ ] スケーリング計算の方法を理解した
- [ ] behavior でスケーリングを制御できる

---

## 次のステップへ

次のセクションでは、ここまで学んだ全てを使ってフルスタックアプリケーションを K8s にデプロイする総合演習に挑戦します。

---

*推定読了時間: 30分*
