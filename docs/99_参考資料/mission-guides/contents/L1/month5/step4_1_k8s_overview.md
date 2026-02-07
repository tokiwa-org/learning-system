# Kubernetesとは何か

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 4
subStep: 1
title: "Kubernetesとは何か"
itemType: LESSON
estimatedMinutes: 25
noiseLevel: MINIMAL
roadmap:
  skill: "Kubernetes"
  category: "コンテナ"
  target_level: "L1"
```

---

## ストーリー

> 「Docker でコンテナ化はできた。次はいよいよ Kubernetes だ」
>
> 村上先輩が大きな海図のような図を広げた。
>
> 「Docker Compose は開発環境では便利だけど、本番環境では不十分だ。
> コンテナが落ちたら自動で再起動してほしい、アクセスが増えたら自動でスケールしてほしい、
> 無停止でデプロイしたい......こういう要求に応えるのが Kubernetes だ」
>
> 「Kubernetes......略して K8s ですよね。名前は聞くけど、正直よくわかってないです」
>
> 「Kubernetes はギリシャ語で"操舵手"を意味する。
> コンテナの海を安全に航海するための操舵システムだと思えばいい。
> まずは全体像を把握しよう」

---

## Kubernetes（K8s）とは

Kubernetes は、コンテナ化されたアプリケーションの**デプロイ、スケーリング、管理を自動化**するためのオープンソースプラットフォームです。

### Docker Compose との違い

| 機能 | Docker Compose | Kubernetes |
|------|---------------|------------|
| 対象環境 | 単一マシン | 複数マシン（クラスタ） |
| 自動スケーリング | なし | あり（HPA） |
| 自動復旧 | 限定的 | あり（コンテナ再起動、再配置） |
| ローリングアップデート | なし | あり |
| ロードバランシング | なし | あり（Service） |
| 設定管理 | .env ファイル | ConfigMap / Secret |
| 用途 | 開発環境 | 本番環境 |

---

## Kubernetes クラスタのアーキテクチャ

```
┌──────────────────────────────────────────────────────┐
│                  Kubernetes クラスタ                    │
│                                                      │
│  ┌──────────────────────────────────────┐            │
│  │       コントロールプレーン               │            │
│  │                                      │            │
│  │  ┌──────────┐  ┌────────────────┐   │            │
│  │  │ API Server│  │   Scheduler    │   │            │
│  │  └──────────┘  └────────────────┘   │            │
│  │  ┌──────────────┐  ┌────────────┐   │            │
│  │  │ Controller   │  │   etcd     │   │            │
│  │  │ Manager      │  │ (データ保存) │   │            │
│  │  └──────────────┘  └────────────┘   │            │
│  └──────────────────────────────────────┘            │
│                      │                               │
│          ┌───────────┼───────────┐                   │
│          ↓           ↓           ↓                   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│  │   Node 1   │ │   Node 2   │ │   Node 3   │       │
│  │            │ │            │ │            │       │
│  │ ┌────────┐ │ │ ┌────────┐ │ │ ┌────────┐ │       │
│  │ │kubelet │ │ │ │kubelet │ │ │ │kubelet │ │       │
│  │ ├────────┤ │ │ ├────────┤ │ │ ├────────┤ │       │
│  │ │kube-   │ │ │ │kube-   │ │ │ │kube-   │ │       │
│  │ │proxy   │ │ │ │proxy   │ │ │ │proxy   │ │       │
│  │ ├────────┤ │ │ ├────────┤ │ │ ├────────┤ │       │
│  │ │ Pod(s) │ │ │ │ Pod(s) │ │ │ │ Pod(s) │ │       │
│  │ └────────┘ │ │ └────────┘ │ │ └────────┘ │       │
│  └────────────┘ └────────────┘ └────────────┘       │
└──────────────────────────────────────────────────────┘
```

### コントロールプレーン

クラスタ全体を管理する「司令塔」です。

| コンポーネント | 役割 |
|-------------|------|
| API Server | 全通信の入口。kubectl コマンドはここに送られる |
| Scheduler | Pod をどのノードに配置するか決定する |
| Controller Manager | Deployment、ReplicaSet などの状態を管理する |
| etcd | クラスタの全設定データを保存するデータベース |

### ワーカーノード

実際にコンテナが動く「作業マシン」です。

| コンポーネント | 役割 |
|-------------|------|
| kubelet | ノード上の Pod を管理するエージェント |
| kube-proxy | ネットワークルーティングを管理 |
| Container Runtime | コンテナを実行する（containerd等） |

---

## Kubernetes の基本概念

### 宣言的設定（Declarative Configuration）

Kubernetes は「あるべき状態」を宣言し、システムが自動的にその状態を維持します。

```
命令型（Docker Compose）:
  「コンテナを3つ起動しろ」
  「1つ落ちたら手動で再起動する」

宣言型（Kubernetes）:
  「このアプリのレプリカは常に3つであるべき」
  → 1つ落ちても自動で3つに戻す
  → ノードが故障しても別ノードで再起動
```

### YAML マニフェスト

Kubernetes のリソースは YAML ファイル（マニフェスト）で定義します。

```yaml
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
```

---

## ローカル開発環境

### Kubernetes をローカルで試す

| ツール | 特徴 |
|--------|------|
| minikube | ローカルに1ノードクラスタを構築。最も一般的 |
| kind | Docker in Docker でクラスタを構築。CI向き |
| Docker Desktop | Docker Desktop に付属の K8s。手軽 |
| k3d | 軽量な k3s を Docker 上で実行 |

```bash
# minikube の場合
minikube start

# Docker Desktop の場合
# 設定 → Kubernetes → Enable Kubernetes にチェック

# クラスタの状態確認
kubectl cluster-info
kubectl get nodes
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| Kubernetes とは | コンテナのデプロイ・スケーリング・管理を自動化するプラットフォーム |
| アーキテクチャ | コントロールプレーン + ワーカーノードで構成 |
| 宣言的設定 | あるべき状態を定義し、システムが自動維持 |
| Docker Compose との違い | 自動スケーリング、自動復旧、ローリングアップデート |

### チェックリスト

- [ ] Kubernetes の目的と Docker Compose との違いを説明できる
- [ ] クラスタのアーキテクチャ（コントロールプレーン + ノード）を理解した
- [ ] 宣言的設定の概念を理解した
- [ ] ローカル開発環境の選択肢を知っている

---

## 次のステップへ

次のセクションでは、Kubernetes の主要リソースである Pod、ReplicaSet、Deployment を学びます。
これらの関係を理解すれば、アプリケーションのデプロイが見えてきます。

---

*推定読了時間: 25分*
