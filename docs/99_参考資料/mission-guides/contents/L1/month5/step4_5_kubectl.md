# kubectlコマンドの基本

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 4
subStep: 5
title: "kubectlコマンドの基本"
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

> 「Kubernetes のリソースは理解した。次は実際に操作してみよう」
>
> 村上先輩がターミナルを開いた。
>
> 「kubectl（クーベコントロール）は Kubernetes クラスタと対話するための
> コマンドラインツールだ。Docker CLI が Docker Daemon と通信するように、
> kubectl は API Server と通信する」
>
> 「コマンドの数、多そうですね......」
>
> 「よく使うのは10種類くらいだ。パターンを覚えれば簡単だよ」

---

## kubectl の基本構文

```bash
kubectl [コマンド] [リソース種類] [リソース名] [オプション]
```

```bash
# 例
kubectl get pods                    # Pod の一覧
kubectl describe deployment my-app  # Deployment の詳細
kubectl delete pod my-app-abc123    # Pod の削除
kubectl apply -f deployment.yaml    # マニフェストの適用
```

---

## リソースの取得（get）

```bash
# Pod の一覧
kubectl get pods
kubectl get po              # 省略形

# Deployment の一覧
kubectl get deployments
kubectl get deploy          # 省略形

# Service の一覧
kubectl get services
kubectl get svc             # 省略形

# 全リソースの一覧
kubectl get all

# 詳細出力（IPアドレス、ノード名を含む）
kubectl get pods -o wide

# YAML 形式で出力
kubectl get deployment my-app -o yaml

# JSON 形式で出力
kubectl get pod my-app-abc123 -o json

# ラベルで絞り込み
kubectl get pods -l app=my-app

# 名前空間を指定
kubectl get pods -n kube-system

# 全名前空間のリソースを表示
kubectl get pods -A
```

### リソース種類の省略形

| リソース | 省略形 |
|---------|--------|
| pods | po |
| deployments | deploy |
| services | svc |
| configmaps | cm |
| secrets | - |
| namespaces | ns |
| nodes | no |
| ingresses | ing |
| replicasets | rs |

---

## リソースの詳細（describe）

```bash
# Pod の詳細情報（イベント、状態、設定を表示）
kubectl describe pod my-app-abc123

# Deployment の詳細
kubectl describe deployment my-app

# Service の詳細
kubectl describe service my-app-service

# Node の詳細（リソース使用状況を含む）
kubectl describe node node-1
```

`describe` の出力には以下が含まれます：
- リソースの設定
- 現在の状態
- イベント（トラブルシューティングに重要）
- 関連するリソース

---

## リソースの作成・更新（apply / create）

```bash
# マニフェストファイルを適用（作成 or 更新）
kubectl apply -f deployment.yaml

# ディレクトリ内の全マニフェストを適用
kubectl apply -f k8s/

# 複数ファイルを適用
kubectl apply -f deployment.yaml -f service.yaml

# URL から適用
kubectl apply -f https://example.com/deployment.yaml

# ドライランで確認（実際には作成しない）
kubectl apply -f deployment.yaml --dry-run=client
```

### apply と create の違い

| コマンド | 動作 |
|---------|------|
| `kubectl apply` | リソースが存在しなければ作成、存在すれば更新 |
| `kubectl create` | リソースが存在しなければ作成、存在すればエラー |

**推奨**: 通常は `apply` を使います。

---

## リソースの削除（delete）

```bash
# Pod の削除
kubectl delete pod my-app-abc123

# Deployment の削除
kubectl delete deployment my-app

# マニフェストに定義されたリソースを削除
kubectl delete -f deployment.yaml

# ラベルで削除
kubectl delete pods -l app=my-app

# 名前空間内の全 Pod を削除
kubectl delete pods --all -n default
```

---

## ログと実行（logs / exec）

```bash
# Pod のログを表示
kubectl logs my-app-abc123

# リアルタイムでログを監視
kubectl logs -f my-app-abc123

# 特定のコンテナのログ（Pod に複数コンテナがある場合）
kubectl logs my-app-abc123 -c sidecar

# 直近 100 行のログ
kubectl logs my-app-abc123 --tail=100

# Pod 内でコマンドを実行
kubectl exec my-app-abc123 -- ls /app

# Pod 内にシェルで接続
kubectl exec -it my-app-abc123 -- /bin/sh
```

---

## デプロイ管理（rollout）

```bash
# ロールアウトの状態確認
kubectl rollout status deployment/my-app

# ロールアウト履歴
kubectl rollout history deployment/my-app

# ロールバック（前のバージョンに戻す）
kubectl rollout undo deployment/my-app

# 特定のリビジョンにロールバック
kubectl rollout undo deployment/my-app --to-revision=2

# ロールアウトの一時停止
kubectl rollout pause deployment/my-app

# ロールアウトの再開
kubectl rollout resume deployment/my-app
```

---

## デバッグに便利なコマンド

```bash
# Pod のイベントを確認（エラーの原因調査）
kubectl get events --sort-by='.lastTimestamp'

# Pod の状態が Pending の場合
kubectl describe pod <pod-name>
# → Events セクションでスケジューリング失敗の理由を確認

# CrashLoopBackOff の場合
kubectl logs <pod-name> --previous
# → 前回のコンテナのログを確認

# リソースの使用状況
kubectl top pods
kubectl top nodes

# ポートフォワード（ローカルからPodに直接アクセス）
kubectl port-forward pod/my-app-abc123 3000:3000
kubectl port-forward service/my-app-service 8080:80
```

---

## kubectl コマンド早見表

```
┌──────────────────────────────────────────────────┐
│            kubectl コマンド早見表                   │
├──────────────┬───────────────────────────────────┤
│ 取得・確認    │ get, describe, logs, top          │
│ 作成・更新    │ apply, create, edit, scale        │
│ 削除         │ delete                            │
│ デバッグ      │ exec, port-forward, logs, events  │
│ デプロイ      │ rollout (status/history/undo)     │
│ 設定         │ config (view/use-context)         │
└──────────────┴───────────────────────────────────┘
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 基本構文 | `kubectl [コマンド] [リソース] [名前] [オプション]` |
| よく使うコマンド | get, describe, apply, delete, logs, exec |
| デプロイ管理 | rollout status/history/undo |
| デバッグ | logs, describe, events, port-forward |

### チェックリスト

- [ ] kubectl の基本構文を理解した
- [ ] get, describe でリソース情報を確認できる
- [ ] apply でマニフェストを適用できる
- [ ] logs でコンテナのログを確認できる
- [ ] exec でコンテナ内部に接続できる
- [ ] rollout でデプロイの管理ができる

---

## 次のステップへ

次のセクションでは、Step 4 の理解度チェッククイズに挑戦します。
Kubernetes の基礎知識が身についているか確認しましょう。

---

*推定読了時間: 30分*
