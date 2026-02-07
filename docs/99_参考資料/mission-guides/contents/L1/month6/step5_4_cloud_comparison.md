# クラウドサービス比較

## メタ情報

```yaml
mission: "クラウドの頂を制覇しよう"
step: 5
subStep: 4
title: "クラウドサービス比較"
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

> 「AWS、GCP、Azure それぞれの特徴は掴めたな。
> ここからは3つを並べて比較してみよう」
>
> 山田先輩が比較表を画面に映す。
>
> 「クライアントから『うちはどのクラウドを使えばいいですか？』と聞かれた時に、
> 根拠を持って答えられるようになるのが目標だ」
>
> 「どのクラウドが一番いいんですか？」
>
> 「それは要件次第だ。銀の弾丸はない。
> 技術的な特性、既存の投資、チームのスキル、予算......
> 多角的に評価して最適解を見つけるのがアーキテクトの仕事だ」

---

## 3大クラウド横断比較

### コンピュートサービス

| 機能 | AWS | GCP | Azure |
|------|-----|-----|-------|
| 仮想マシン | EC2 | Compute Engine | Virtual Machines |
| サーバーレス | Lambda | Cloud Functions | Azure Functions |
| コンテナ(K8s) | EKS | GKE | AKS |
| PaaS | Elastic Beanstalk | App Engine | App Service |
| マネージドコンテナ | Fargate | Cloud Run | Container Instances |

### ストレージサービス

| 機能 | AWS | GCP | Azure |
|------|-----|-----|-------|
| オブジェクト | S3 | Cloud Storage | Blob Storage |
| ブロック | EBS | Persistent Disk | Managed Disks |
| ファイル | EFS | Filestore | Azure Files |
| アーカイブ | Glacier | Archive Storage | Archive Storage |

### データベースサービス

| 機能 | AWS | GCP | Azure |
|------|-----|-----|-------|
| RDB (MySQL) | RDS | Cloud SQL | Azure Database for MySQL |
| RDB (PostgreSQL) | RDS | Cloud SQL | Azure Database for PostgreSQL |
| 高性能 RDB | Aurora | Cloud Spanner | Azure SQL Database |
| NoSQL (KV) | DynamoDB | Firestore | Cosmos DB |
| キャッシュ | ElastiCache | Memorystore | Azure Cache for Redis |

### ネットワークサービス

| 機能 | AWS | GCP | Azure |
|------|-----|-----|-------|
| 仮想ネットワーク | VPC | VPC | VNet |
| ロードバランサー | ELB/ALB | Cloud LB | Load Balancer |
| DNS | Route 53 | Cloud DNS | Azure DNS |
| CDN | CloudFront | Cloud CDN | Azure CDN |
| VPN | VPN Gateway | Cloud VPN | VPN Gateway |

### セキュリティ・ID管理

| 機能 | AWS | GCP | Azure |
|------|-----|-----|-------|
| ID管理 | IAM | IAM | Azure AD (Entra ID) |
| 鍵管理 | KMS | Cloud KMS | Key Vault |
| シークレット | Secrets Manager | Secret Manager | Key Vault |
| WAF | AWS WAF | Cloud Armor | Azure WAF |

---

## プロバイダ別の強み・弱み

### AWS

| 観点 | 評価 |
|------|------|
| サービス数 | 最多（200以上） |
| コミュニティ | 最大。情報量が豊富 |
| 資格制度 | 充実（SAA, SAP 等） |
| 料金体系 | 複雑だが柔軟 |
| 弱み | UI/UX がやや複雑、一部サービスの学習コストが高い |

### GCP

| 観点 | 評価 |
|------|------|
| データ分析 | BigQuery が突出して強い |
| AI/ML | Vertex AI、TensorFlow との連携 |
| Kubernetes | GKE の品質が高い |
| 料金体系 | シンプル。自動的な料金最適化 |
| 弱み | エンタープライズ向け機能がやや弱い、サービス数が少なめ |

### Azure

| 観点 | 評価 |
|------|------|
| エンタープライズ | Active Directory 連携が強い |
| ハイブリッド | オンプレミスとの連携が得意 |
| Microsoft 統合 | Office 365、Teams、Power BI |
| .NET 対応 | .NET アプリケーションのホスティングに最適 |
| 弱み | 独自の用語が多い、一部サービスの安定性 |

---

## 選択基準のフレームワーク

クラウドプロバイダを選ぶ際の評価軸を整理します。

| 評価軸 | 質問 | AWS が有利 | GCP が有利 | Azure が有利 |
|--------|------|-----------|-----------|-------------|
| 技術要件 | メインの言語/FW は？ | 全般 | Python/Go | .NET/Java |
| データ分析 | 大規模データ分析が必要？ | Redshift | BigQuery | Synapse |
| AI/ML | ML 開発が中心？ | SageMaker | Vertex AI | Azure ML |
| ID管理 | AD 連携が必要？ | - | - | Azure AD |
| 既存資産 | 何を使っている？ | AWS利用中 | Google Workspace | Office 365 |
| チームスキル | チームの経験は？ | AWS経験者多 | GCP経験者多 | Azure経験者多 |
| コスト | 予算の制約は？ | RI/SP割引 | 持続利用割引 | EA契約割引 |

---

## CLI コマンド比較

同じ操作を3つのクラウドの CLI で比較します。

### 仮想マシン一覧

```bash
# AWS
aws ec2 describe-instances --query 'Reservations[*].Instances[*].{ID:InstanceId,State:State.Name}' --output table

# GCP
gcloud compute instances list

# Azure
az vm list --output table
```

### オブジェクトストレージのバケット一覧

```bash
# AWS
aws s3 ls

# GCP
gsutil ls

# Azure
az storage container list --account-name mystorageaccount --output table
```

---

## まとめ

| ポイント | 内容 |
|----------|------|
| 共通概念 | コンピュート、ストレージ、DB、ネットワーク等は3社共通 |
| AWS の強み | サービス数最多、最大コミュニティ |
| GCP の強み | データ分析（BigQuery）、AI/ML、Kubernetes |
| Azure の強み | エンタープライズ、Microsoft 統合、ハイブリッド |
| 選択基準 | 技術要件、既存資産、チームスキル、コストで総合判断 |

### チェックリスト

- [ ] 3大クラウドの主要サービスの対応関係を把握した
- [ ] 各プロバイダの強み・弱みを説明できる
- [ ] クラウド選択の評価軸を理解した
- [ ] 3つの CLI の違いを把握した

---

## 次のステップへ

次のセクションでは、マルチクラウド戦略の具体的な実践方法を学びます。
クラウド間のポータビリティを高めるための設計手法を理解しましょう。

---

*推定読了時間: 20分*
