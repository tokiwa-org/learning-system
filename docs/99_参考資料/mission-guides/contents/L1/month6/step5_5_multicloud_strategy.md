# マルチクラウド戦略

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 5
subStep: 5
title: "マルチクラウド戦略"
itemType: LESSON
estimatedMinutes: 20
noiseLevel: MINIMAL
roadmap:
  skill: "マルチクラウド"
  category: "クラウド"
  target_level: "L1"
```

---

## ストーリー

> 「3大クラウドの全体像が見えてきたな。最後に、マルチクラウドを実践する際の
> 戦略と設計手法を学ぼう」
>
> 山田先輩がアーキテクチャの設計方針をまとめたドキュメントを開く。
>
> 「マルチクラウドを成功させるには、クラウド間のポータビリティ（移行性）を
> 意識した設計が重要だ。特定のクラウドに深く結合したアーキテクチャだと、
> いざ別のクラウドに移行する時に大きなコストがかかる」
>
> 「具体的にはどういう工夫をするんですか？」
>
> 「コンテナ、IaC、抽象化レイヤー......いくつかのテクニックがある。
> 中村製作所さんの将来のマルチクラウド対応も見据えて、押さえておこう」

---

## クラウドポータビリティの実現

### コンテナによる抽象化

コンテナ（Docker）を使うと、アプリケーションをクラウドに依存しない形でパッケージングできます。

```
コンテナなし:
  AWS EC2 (Amazon Linux) に直接インストール
  → 別のクラウドに移行するには OS 設定からやり直し

コンテナあり:
  Docker イメージとしてパッケージング
  → AWS ECS / GCP Cloud Run / Azure Container Instances
  → どのクラウドでも同じイメージで動作
```

### Kubernetes によるオーケストレーション

Kubernetes はどのクラウドでも使える統一的なコンテナオーケストレーションです。

| クラウド | Kubernetes サービス |
|---------|-------------------|
| AWS | EKS (Elastic Kubernetes Service) |
| GCP | GKE (Google Kubernetes Engine) |
| Azure | AKS (Azure Kubernetes Service) |

```yaml
# Kubernetes のマニフェスト（クラウドに依存しない）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nakamura-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nakamura-web
  template:
    metadata:
      labels:
        app: nakamura-web
    spec:
      containers:
      - name: web
        image: nakamura/web-app:v1.0
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: "500m"
            memory: "256Mi"
```

---

## IaC（Infrastructure as Code）によるマルチクラウド管理

### Terraform

HashiCorp の Terraform は、複数のクラウドプロバイダに対応した IaC ツールです。

```hcl
# Terraform で AWS の EC2 を定義
provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t3.small"

  tags = {
    Name        = "nakamura-web"
    Environment = "production"
  }
}

# 同じ Terraform で GCP の Compute Engine も定義可能
provider "google" {
  project = "nakamura-project"
  region  = "asia-northeast1"
}

resource "google_compute_instance" "web" {
  name         = "nakamura-web"
  machine_type = "e2-small"
  zone         = "asia-northeast1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
  }
}
```

### クラウドネイティブ IaC との比較

| ツール | 対応クラウド | 特徴 |
|--------|------------|------|
| Terraform | AWS, GCP, Azure 他 | マルチクラウド対応、宣言型 |
| AWS CloudFormation | AWS のみ | AWS サービスとの深い統合 |
| GCP Deployment Manager | GCP のみ | GCP ネイティブ |
| Azure ARM/Bicep | Azure のみ | Azure ネイティブ |
| Pulumi | AWS, GCP, Azure 他 | 一般のプログラミング言語で記述 |

---

## 抽象化レイヤーの設計

クラウド固有のサービスを直接呼び出さず、抽象化レイヤーを介することでポータビリティを高めます。

```
抽象化なし（AWS に密結合）:
  アプリケーション → aws-sdk → S3

抽象化あり（クラウドに非依存）:
  アプリケーション → StorageInterface → S3 Adapter → S3
                                     → GCS Adapter → Cloud Storage
                                     → Blob Adapter → Blob Storage
```

```typescript
// 抽象化レイヤーの例（Hexagonal Architecture）
interface ObjectStorage {
  upload(key: string, data: Buffer): Promise<void>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}

// AWS S3 アダプター
class S3Storage implements ObjectStorage {
  async upload(key: string, data: Buffer): Promise<void> {
    await s3Client.putObject({ Bucket: this.bucket, Key: key, Body: data });
  }
  // ...
}

// GCP Cloud Storage アダプター
class GCSStorage implements ObjectStorage {
  async upload(key: string, data: Buffer): Promise<void> {
    await this.bucket.file(key).save(data);
  }
  // ...
}
```

---

## マルチクラウドの監視と管理

### 統合監視ツール

| ツール | 特徴 |
|--------|------|
| Datadog | マルチクラウド対応の統合監視プラットフォーム |
| Grafana | オープンソースのダッシュボード |
| Prometheus | メトリクス収集（Kubernetes と相性が良い） |
| PagerDuty | アラート管理、インシデント対応 |

### コスト管理

| ツール | 特徴 |
|--------|------|
| AWS Cost Explorer | AWS のコスト分析 |
| GCP Cost Management | GCP のコスト分析 |
| Azure Cost Management | Azure のコスト分析 |
| CloudHealth / Spot.io | マルチクラウドのコスト最適化 |

---

## マルチクラウド戦略のまとめフレームワーク

```
マルチクラウド戦略の決定フロー:

1. 現状分析
   ├─ どのクラウドを使っているか？
   ├─ チームのスキルセットは？
   └─ 既存のベンダー契約は？

2. 要件定義
   ├─ マルチクラウドが本当に必要か？
   ├─ どのパターンが最適か？（ワークロード分散？DR？）
   └─ コンプライアンス要件は？

3. 技術選定
   ├─ コンテナ / Kubernetes で抽象化
   ├─ Terraform でIaC統一
   └─ 抽象化レイヤーの設計

4. 運用設計
   ├─ 統合監視の導入
   ├─ コスト管理の統一
   └─ セキュリティポリシーの統一
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| コンテナ | クラウドに依存しないアプリケーションパッケージング |
| Kubernetes | どのクラウドでも使える統一的なオーケストレーション |
| Terraform | マルチクラウド対応の IaC ツール |
| 抽象化レイヤー | クラウド固有 API を隠蔽して移行性を向上 |
| 統合監視 | Datadog 等で複数クラウドを統合的に監視 |

### チェックリスト

- [ ] クラウドポータビリティの重要性を理解した
- [ ] コンテナと Kubernetes による抽象化を理解した
- [ ] Terraform によるマルチクラウド管理を把握した
- [ ] 抽象化レイヤーの設計パターンを理解した
- [ ] マルチクラウド戦略の決定フローを把握した

---

## 次のステップへ

次のセクションでは、Step 5 のまとめとしてマルチクラウドに関する理解度チェックに挑戦します。

---

*推定読了時間: 20分*
