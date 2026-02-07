# ServiceとIngress

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 4
subStep: 3
title: "ServiceとIngress"
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

> 「Deployment で Pod を作れるようになった。でも、外からどうやってアクセスするんだ？」
>
> 村上先輩が問いかけた。
>
> 「え......Pod のIPアドレスに直接？」
>
> 「それがダメなんだ。Pod は一時的な存在だ。再起動のたびにIPアドレスが変わる。
> しかもレプリカが3つあったら、どの Pod にアクセスすればいい？」
>
> 「ロードバランサーが必要......ですね」
>
> 「その通り。Kubernetes では Service がロードバランサーの役割を果たす。
> そして外部からのHTTPアクセスを振り分けるのが Ingress だ」

---

## なぜ Service が必要か

Pod は一時的（エフェメラル）な存在で、IPアドレスが変わります。

```
状態1: Pod のIPアドレス
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Pod 1       │  │ Pod 2       │  │ Pod 3       │
│ 10.0.0.5    │  │ 10.0.0.6    │  │ 10.0.0.7    │
└─────────────┘  └─────────────┘  └─────────────┘

状態2: Pod 2 が再起動
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Pod 1       │  │ Pod 4 (新)  │  │ Pod 3       │
│ 10.0.0.5    │  │ 10.0.0.12   │  │ 10.0.0.7    │
└─────────────┘  └─────────────┘  └─────────────┘
                 ← IPが変わった!
```

Service は安定したエンドポイント（IPアドレスとDNS名）を提供し、背後の Pod にトラフィックを振り分けます。

---

## Service の種類

### 1. ClusterIP（デフォルト）

クラスタ内部でのみアクセス可能な仮想IPを割り当てます。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
  - port: 80          # Service のポート
    targetPort: 3000   # Pod のポート
```

```
クラスタ内部:
                     ┌──────────────────┐
                     │    Service       │
 他の Pod ──────→    │  my-app-service  │
                     │  10.96.0.1:80    │
                     └────────┬─────────┘
                              │
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │  Pod 1   │ │  Pod 2   │ │  Pod 3   │
              │  :3000   │ │  :3000   │ │  :3000   │
              └──────────┘ └──────────┘ └──────────┘
```

### 2. NodePort

各ノードの特定ポートを開放し、外部からアクセス可能にします。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-nodeport
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 3000
    nodePort: 30080    # 30000-32767 の範囲
```

```
外部:
  http://node-ip:30080
         │
         ↓
┌─────────────────────┐
│   Node (30080)      │
│         │           │
│    ┌────┴────┐      │
│    │ Service │      │
│    └────┬────┘      │
│    ┌────┼────┐      │
│    ↓    ↓    ↓      │
│  Pod1 Pod2 Pod3     │
└─────────────────────┘
```

### 3. LoadBalancer

クラウドプロバイダのロードバランサーを自動作成します。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-lb
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 3000
```

```
インターネット
     │
     ↓
┌──────────────────────┐
│  Cloud Load Balancer │  ← 自動作成される
│  (外部IP: x.x.x.x)  │
└──────────┬───────────┘
           │
     ┌─────┼─────┐
     ↓     ↓     ↓
   Pod1  Pod2  Pod3
```

### Service の種類比較

| 種類 | アクセス範囲 | 用途 |
|------|------------|------|
| ClusterIP | クラスタ内部のみ | マイクロサービス間通信 |
| NodePort | ノードIP + ポート | 開発・テスト環境 |
| LoadBalancer | 外部（クラウドLB） | 本番環境の外部公開 |

---

## DNS によるサービスディスカバリ

Kubernetes クラスタ内では、Service 名で通信できます。

```
Service名: my-app-service
名前空間: default

DNS名:
  my-app-service                        (同じ名前空間)
  my-app-service.default                (名前空間指定)
  my-app-service.default.svc.cluster.local  (完全修飾名)
```

```yaml
# 別の Pod からの接続例
env:
- name: API_URL
  value: "http://my-app-service:80"
```

---

## Ingress（イングレス）

Ingress は、HTTP/HTTPS のルーティングルールを定義するリソースです。

### Ingress の役割

```
インターネット
     │
     ↓
┌──────────────────────────────────┐
│           Ingress                │
│                                  │
│  /api/*   → api-service:8080    │
│  /web/*   → web-service:80      │
│  /admin/* → admin-service:3000  │
│                                  │
└──────────────────────────────────┘
     │          │           │
     ↓          ↓           ↓
 api Pods   web Pods   admin Pods
```

### Ingress マニフェスト

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

### Ingress Controller

Ingress リソースだけでは動作しません。Ingress Controller が必要です。

| Ingress Controller | 特徴 |
|-------------------|------|
| NGINX Ingress Controller | 最も一般的 |
| AWS ALB Ingress Controller | AWS ALB を自動構成 |
| Traefik | 自動設定、Let's Encrypt対応 |
| Istio Gateway | サービスメッシュ統合 |

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Service | Pod への安定したアクセスポイント。ロードバランシング |
| ClusterIP | クラスタ内部アクセス用（デフォルト） |
| NodePort | ノードのポートを開放して外部アクセス |
| LoadBalancer | クラウドLBを自動作成 |
| Ingress | HTTP/HTTPS のルーティングルール定義 |

### チェックリスト

- [ ] Service が必要な理由を理解した
- [ ] ClusterIP、NodePort、LoadBalancer の違いを説明できる
- [ ] DNS によるサービスディスカバリを理解した
- [ ] Ingress の役割と基本的なマニフェストを理解した

---

## 次のステップへ

次のセクションでは、ConfigMap と Secret を使って設定情報を管理する方法を学びます。

---

*推定読了時間: 30分*
