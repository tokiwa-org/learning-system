# L1 月5: コンテナの海を航海しよう

## 概要

| 項目 | 内容 |
|-----|------|
| 対象 | L1（新人→一人前） |
| 総時間 | 20時間 |
| スキル | Docker（最適化されたイメージをビルド・運用できる）, Kubernetes（マニフェストを書き、アプリケーションをデプロイできる） |
| 前提 | L0修了（基本プログラミング TS/Python, Linux基礎, Git操作） |

---

## ステップ構成

### Step 1: Dockerの基本を習得しよう（3時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 1-1 | コンテナ技術の概要 | LESSON | 15分 | [step1_1_container_overview.md](./step1_1_container_overview.md) |
| 1-2 | Dockerのアーキテクチャ | LESSON | 30分 | [step1_2_docker_architecture.md](./step1_2_docker_architecture.md) |
| 1-3 | Dockerイメージとコンテナ | LESSON | 30分 | [step1_3_images_containers.md](./step1_3_images_containers.md) |
| 1-4 | 基本的なDockerコマンド | LESSON | 30分 | [step1_4_basic_commands.md](./step1_4_basic_commands.md) |
| 1-5 | Dockerボリュームとネットワーク | LESSON | 30分 | [step1_5_volumes_networks.md](./step1_5_volumes_networks.md) |
| 1-6 | 理解度チェック | QUIZ | 15分 | [step1_6_quiz.md](./step1_6_quiz.md) |

### Step 2: 最適化されたDockerfileを書こう（4時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 2-1 | Dockerfileの基本構文 | LESSON | 30分 | [step2_1_dockerfile_basics.md](./step2_1_dockerfile_basics.md) |
| 2-2 | レイヤーキャッシュの仕組み | LESSON | 30分 | [step2_2_layer_cache.md](./step2_2_layer_cache.md) |
| 2-3 | ベストプラクティス | LESSON | 30分 | [step2_3_best_practices.md](./step2_3_best_practices.md) |
| 2-4 | .dockerignoreとセキュリティ | LESSON | 30分 | [step2_4_dockerignore_security.md](./step2_4_dockerignore_security.md) |
| 2-5 | 演習：Webアプリを最適化Dockerfile化しよう | EXERCISE | 90分 | [step2_5_exercise.md](./step2_5_exercise.md) |
| 2-6 | チェックポイント | QUIZ | 30分 | [step2_6_quiz.md](./step2_6_quiz.md) |

### Step 3: マルチステージビルドをマスターしよう（3時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 3-1 | マルチステージビルドの概念 | LESSON | 25分 | [step3_1_multistage_concept.md](./step3_1_multistage_concept.md) |
| 3-2 | ビルダーパターン | LESSON | 25分 | [step3_2_builder_pattern.md](./step3_2_builder_pattern.md) |
| 3-3 | イメージサイズの最適化 | LESSON | 25分 | [step3_3_image_optimization.md](./step3_3_image_optimization.md) |
| 3-4 | Docker Compose入門 | LESSON | 25分 | [step3_4_docker_compose.md](./step3_4_docker_compose.md) |
| 3-5 | 演習：マルチステージビルドで本番イメージを作ろう | EXERCISE | 45分 | [step3_5_exercise.md](./step3_5_exercise.md) |
| 3-6 | チェックポイント | QUIZ | 15分 | [step3_6_quiz.md](./step3_6_quiz.md) |

### Step 4: Kubernetesの海図を読もう（3時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 4-1 | Kubernetesとは何か | LESSON | 25分 | [step4_1_k8s_overview.md](./step4_1_k8s_overview.md) |
| 4-2 | Pod、ReplicaSet、Deployment | LESSON | 30分 | [step4_2_pods_deployments.md](./step4_2_pods_deployments.md) |
| 4-3 | ServiceとIngress | LESSON | 30分 | [step4_3_services_ingress.md](./step4_3_services_ingress.md) |
| 4-4 | ConfigMapとSecret | LESSON | 25分 | [step4_4_configmap_secret.md](./step4_4_configmap_secret.md) |
| 4-5 | kubectlコマンドの基本 | LESSON | 30分 | [step4_5_kubectl.md](./step4_5_kubectl.md) |
| 4-6 | 理解度チェック | QUIZ | 20分 | [step4_6_quiz.md](./step4_6_quiz.md) |

### Step 5: アプリをK8sにデプロイしよう（5時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 5-1 | マニフェストの書き方 | LESSON | 30分 | [step5_1_manifests.md](./step5_1_manifests.md) |
| 5-2 | Deploymentの作成と更新戦略 | LESSON | 30分 | [step5_2_deployment_strategy.md](./step5_2_deployment_strategy.md) |
| 5-3 | ヘルスチェックとリソース管理 | LESSON | 30分 | [step5_3_health_resources.md](./step5_3_health_resources.md) |
| 5-4 | HPA（水平オートスケーリング） | LESSON | 30分 | [step5_4_hpa.md](./step5_4_hpa.md) |
| 5-5 | 演習：フルスタックアプリをK8sにデプロイしよう | EXERCISE | 120分 | [step5_5_exercise.md](./step5_5_exercise.md) |
| 5-6 | チェックポイント | QUIZ | 30分 | [step5_6_quiz.md](./step5_6_quiz.md) |

### Step 6: 航海の成果を確認しよう（2時間）

| サブステップ | タイトル | 種別 | 時間 | ファイル |
|-------------|---------|------|------|---------|
| 6-1 | 総合演習：マイクロサービスのコンテナ化とデプロイ | EXERCISE | 60分 | [step6_1_final_exercise.md](./step6_1_final_exercise.md) |
| 6-2 | 卒業クイズ | QUIZ | 60分 | [step6_2_final_quiz.md](./step6_2_final_quiz.md) |

---

## 学習の流れ

```
Step 1 (3h)            Step 2 (4h)             Step 3 (3h)
[Docker基礎]      →  [Dockerfile最適化]   →  [マルチステージビルド]
      ↓                     ↓                      ↓
Step 4 (3h)            Step 5 (5h)             Step 6 (2h)
[Kubernetes基礎]   →  [K8sデプロイ実践]    →  [最終試験]
```

---

## 前提知識からの成長マップ

| スキル | これまでに学んだこと | 今月学ぶこと |
|--------|---------------------|-------------|
| Linux | コマンドライン操作、ファイルシステム | コンテナの仕組み、名前空間、cgroups |
| ネットワーク | HTTP基礎、ポート番号 | コンテナネットワーク、Service、Ingress |
| アプリケーション | TypeScript/Python基礎、Web開発 | コンテナ化、マルチステージビルド |
| インフラ | なし | Docker、Kubernetes、マニフェスト |
| 運用 | Git、CI/CD基礎 | ヘルスチェック、オートスケーリング |

---

## 達成目標

このミッション完了後にできること：

- コンテナ技術の基本概念（名前空間、cgroups）を説明できる
- 最適化されたDockerfileを書いてイメージをビルドできる
- マルチステージビルドでイメージサイズを削減できる
- Docker Composeで複数コンテナを管理できる
- Kubernetesの主要リソース（Pod, Deployment, Service）を理解している
- Kubernetesマニフェストを書いてアプリケーションをデプロイできる
- ヘルスチェックとリソース制限を設定できる
- HPAで水平オートスケーリングを構成できる
