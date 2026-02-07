# GCPの主要サービス

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 5
subStep: 2
title: "GCPの主要サービス"
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

> 「まずは GCP（Google Cloud Platform）を見ていこう」
>
> 山田先輩が GCP のコンソール画面を開く。
>
> 「GCP は Google 検索や YouTube を支えるインフラの上に構築されている。
> データ分析と AI/ML の分野で特に強いが、コンピュートやストレージなど
> 基本的なサービスもしっかり揃っている」
>
> 「AWS のサービスと対応させて覚えると分かりやすいですか？」
>
> 「その通り。概念は共通しているから、AWS の知識をベースにして
> GCP の用語とサービス名を覚えれば、すぐに対応できるようになるぞ」

---

## GCP の基本構造

### リソース階層

GCP は AWS とは異なるリソース階層を持っています。

```
GCP のリソース階層:

  Organization（組織）
      │
      ├── Folder（フォルダ）
      │     │
      │     ├── Project-A（プロジェクト）
      │     │     ├── Compute Engine (VM)
      │     │     ├── Cloud Storage (バケット)
      │     │     └── Cloud SQL (DB)
      │     │
      │     └── Project-B（プロジェクト）
      │
      └── Folder（フォルダ）

AWS との対応:
  Organization → AWS Organizations
  Project      → AWS アカウント（に近い概念）
```

### リージョンとゾーン

| GCP | AWS 対応 | 日本拠点 |
|-----|---------|---------|
| Region（リージョン） | Region | asia-northeast1（東京）, asia-northeast2（大阪） |
| Zone（ゾーン） | AZ | asia-northeast1-a, asia-northeast1-b, asia-northeast1-c |

---

## 主要サービスの AWS 対応表

### コンピュート

| GCP サービス | AWS 対応 | 説明 |
|-------------|---------|------|
| Compute Engine | EC2 | 仮想マシン |
| Cloud Functions | Lambda | サーバーレス関数 |
| Cloud Run | Fargate | マネージドコンテナ |
| GKE（Google Kubernetes Engine） | EKS | Kubernetes マネージドサービス |
| App Engine | Elastic Beanstalk | PaaS |

### ストレージ

| GCP サービス | AWS 対応 | 説明 |
|-------------|---------|------|
| Cloud Storage | S3 | オブジェクトストレージ |
| Persistent Disk | EBS | ブロックストレージ |
| Filestore | EFS | ファイルストレージ |

### データベース

| GCP サービス | AWS 対応 | 説明 |
|-------------|---------|------|
| Cloud SQL | RDS | マネージド RDB（MySQL, PostgreSQL） |
| Cloud Spanner | Aurora（グローバル） | グローバル分散 RDB |
| Firestore | DynamoDB | NoSQL ドキュメント DB |
| Bigtable | DynamoDB（大規模） | NoSQL ワイドカラム DB |

### ネットワーク

| GCP サービス | AWS 対応 | 説明 |
|-------------|---------|------|
| VPC | VPC | 仮想ネットワーク |
| Cloud Load Balancing | ELB | ロードバランサー |
| Cloud DNS | Route 53 | DNS サービス |
| Cloud CDN | CloudFront | CDN |

---

## GCP の特筆すべきサービス

### BigQuery

GCP で最も人気のあるサービスの一つ。サーバーレスのデータウェアハウスです。

```sql
-- BigQuery の使用例
-- ペタバイト規模のデータも数秒で分析可能
SELECT
  product_name,
  SUM(quantity) as total_sold,
  SUM(price * quantity) as revenue
FROM `project.dataset.orders`
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY product_name
ORDER BY revenue DESC
LIMIT 10;
```

| 特徴 | 説明 |
|------|------|
| サーバーレス | インフラ管理不要 |
| スケール | ペタバイト規模のデータ分析 |
| SQL ベース | 標準 SQL で分析可能 |
| 料金 | スキャンしたデータ量に応じた課金 |

### GKE（Google Kubernetes Engine）

Google が開発した Kubernetes のマネージドサービスで、コンテナオーケストレーションの分野で非常に高い評価を得ています。

### Vertex AI

Google の AI/ML プラットフォーム。TensorFlow を含む機械学習モデルの開発・トレーニング・デプロイを統合的に管理できます。

---

## GCP CLI（gcloud）の基本

```bash
# gcloud CLI のバージョン確認
gcloud version

# 認証
gcloud auth login

# プロジェクトの設定
gcloud config set project my-project-id

# Compute Engine インスタンスの一覧
gcloud compute instances list

# Cloud Storage バケットの一覧
gsutil ls

# Cloud SQL インスタンスの一覧
gcloud sql instances list
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| GCP の構造 | Organization → Folder → Project のリソース階層 |
| コンピュート | Compute Engine（EC2相当）、Cloud Run、GKE |
| ストレージ | Cloud Storage（S3相当）、Cloud SQL（RDS相当） |
| 強み | BigQuery（データ分析）、GKE（Kubernetes）、Vertex AI |
| CLI | gcloud コマンドで操作 |

### チェックリスト

- [ ] GCP のリソース階層を理解した
- [ ] 主要サービスの AWS との対応関係を把握した
- [ ] BigQuery の特徴を説明できる
- [ ] gcloud CLI の基本コマンドを知った

---

## 次のステップへ

次のセクションでは、Azure の主要サービスを学びます。
3つのクラウドの全体像を把握して、サービス比較ができるようになりましょう。

---

*推定読了時間: 20分*
