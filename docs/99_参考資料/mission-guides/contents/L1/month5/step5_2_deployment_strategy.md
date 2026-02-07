# Deploymentの作成と更新戦略

## メタ情報

```yaml
mission: "コンテナの海を航海しよう"
step: 5
subStep: 2
title: "Deploymentの作成と更新戦略"
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

> 「アプリをデプロイしたら終わりじゃない。むしろそこからが始まりだ」
>
> 村上先輩が続けた。
>
> 「本番環境で最も重要なのは、ダウンタイムなしでアプリを更新する方法だ。
> Kubernetes の Deployment は、ローリングアップデートという仕組みで
> 無停止デプロイを実現する」
>
> 「ユーザーに影響なくバージョンアップできるんですね」
>
> 「その通り。さらに問題があったらすぐにロールバックもできる。
> 更新戦略を理解しておこう」

---

## 更新戦略の種類

### 1. RollingUpdate（デフォルト）

古い Pod を少しずつ新しい Pod に置き換えます。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 超過して追加できる Pod の数
      maxUnavailable: 1   # 利用不可になれる Pod の数
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
        image: my-app:2.0
```

### ローリングアップデートの流れ

```
初期状態 (v1 x 4):
[v1] [v1] [v1] [v1]

Step 1: 新しい Pod を追加 (maxSurge: 1)
[v1] [v1] [v1] [v1] [v2]

Step 2: 古い Pod を1つ削除 (maxUnavailable: 1)
[v1] [v1] [v1] [v2]

Step 3: 新しい Pod を追加
[v1] [v1] [v1] [v2] [v2]

Step 4: 古い Pod を1つ削除
[v1] [v1] [v2] [v2]

... 繰り返し ...

最終状態 (v2 x 4):
[v2] [v2] [v2] [v2]
```

### maxSurge と maxUnavailable

| パラメータ | 説明 | 数値例 | パーセント例 |
|-----------|------|--------|------------|
| maxSurge | 同時に追加できる Pod 数 | 1 | 25% |
| maxUnavailable | 同時に停止できる Pod 数 | 0 | 25% |

```yaml
# 安全重視: 常に全 Pod が利用可能
strategy:
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0

# 速度重視: 同時に複数 Pod を入れ替え
strategy:
  rollingUpdate:
    maxSurge: 2
    maxUnavailable: 2
```

---

### 2. Recreate

全ての古い Pod を停止してから、新しい Pod を起動します。

```yaml
spec:
  strategy:
    type: Recreate
```

```
初期状態:
[v1] [v1] [v1] [v1]

全停止:
[ ] [ ] [ ] [ ]    ← ダウンタイム発生

全起動:
[v2] [v2] [v2] [v2]
```

| 比較 | RollingUpdate | Recreate |
|------|--------------|----------|
| ダウンタイム | なし | あり |
| リソース消費 | 一時的に増加 | 増加しない |
| データの整合性 | 新旧バージョンが混在 | バージョン統一 |
| 用途 | 一般的なWebアプリ | DBスキーマ変更を伴う場合等 |

---

## デプロイの実行

### イメージの更新

```bash
# 方法1: マニフェストを編集して apply
# deployment.yaml の image を変更
kubectl apply -f deployment.yaml

# 方法2: コマンドで直接更新
kubectl set image deployment/my-app my-app=my-app:2.0

# 方法3: 環境変数を変更してロールアウト
kubectl set env deployment/my-app VERSION=2.0
```

### ロールアウトの監視

```bash
# ロールアウトの進行状況を監視
kubectl rollout status deployment/my-app

# 出力例:
# Waiting for deployment "my-app" rollout to finish:
#   2 out of 4 new replicas have been updated...
#   3 out of 4 new replicas have been updated...
#   4 out of 4 new replicas have been updated...
# deployment "my-app" successfully rolled out

# Pod の状態を監視
kubectl get pods -l app=my-app -w
```

---

## ロールバック

デプロイに問題があった場合、すぐに前のバージョンに戻せます。

```bash
# 前のバージョンにロールバック
kubectl rollout undo deployment/my-app

# 履歴の確認
kubectl rollout history deployment/my-app

# 出力例:
# REVISION  CHANGE-CAUSE
# 1         Initial deployment
# 2         Update to v2.0
# 3         Update to v3.0 (問題あり)

# 特定のリビジョンにロールバック
kubectl rollout undo deployment/my-app --to-revision=1
```

### change-cause の記録

```bash
# デプロイ時に変更理由を記録
kubectl annotate deployment/my-app \
  kubernetes.io/change-cause="Update to v2.0 for bug fix"
```

---

## minReadySeconds

新しい Pod が Ready になってから、次の Pod の入れ替えを開始するまでの待機秒数です。

```yaml
spec:
  minReadySeconds: 10   # 10秒間安定してから次を進める
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| RollingUpdate | 無停止で段階的に更新。デフォルト戦略 |
| Recreate | 全停止→全起動。ダウンタイムあり |
| maxSurge / maxUnavailable | 更新速度と安全性のバランスを制御 |
| ロールバック | kubectl rollout undo で素早く前のバージョンに復帰 |

### チェックリスト

- [ ] RollingUpdate と Recreate の違いを説明できる
- [ ] maxSurge と maxUnavailable の役割を理解した
- [ ] ロールアウトの監視方法を把握した
- [ ] ロールバックの方法を知っている

---

## 次のステップへ

次のセクションでは、ヘルスチェックとリソース管理を学びます。
Pod が正常に動作しているかを監視し、リソースを適切に割り当てる方法を理解しましょう。

---

*推定読了時間: 30分*
